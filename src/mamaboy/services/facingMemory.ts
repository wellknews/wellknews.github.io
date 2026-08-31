import type { FacingProviderId, FacingSignal } from './facingPrompt'
import { normalizeFacingAiResult, type FacingAiResult } from './facingResult'

export type FacingRecord = {
  version: 2
  date: string
  savedAt: string
  provider: FacingProviderId | null
  signals: FacingSignal[]
  result: FacingAiResult
}

export type FacingSignalCount = {
  label: string
  current7: number
  previous7: number
  days30: number
  trend: 'new' | 'up' | 'same' | 'down'
}

export type FacingMemorySummary = {
  totalDays: number
  days7: number
  days30: number
  top7: FacingSignalCount[]
  top30: FacingSignalCount[]
}

export const FACING_MEMORY_UPDATED_EVENT = 'mamaboy:facing:memory-updated'

const DB_NAME = 'mamaboy-facing'
const DB_VERSION = 1
const STORE_NAME = 'dailyRecords'
const LEGACY_HISTORY_KEY = 'mamaboy:facing:history:v1'
const TODAY_CACHE_KEY = 'mamaboy:facing:today:v2'
const MIGRATION_MARKER_KEY = 'mamaboy:facing:indexeddb-migrated:v2'

let initialization: Promise<void> | null = null

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function dateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function validProvider(value: unknown): FacingProviderId | null {
  if (value === null || value === undefined) return null
  if (['workers-ai', 'chatgpt', 'gemini', 'claude'].includes(String(value))) {
    return value as FacingProviderId
  }
  return null
}

function normalizeSignals(value: unknown): FacingSignal[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((signal): FacingSignal[] => {
    if (!isRecord(signal) || !Array.isArray(signal.ids) || !Array.isArray(signal.labels)) return []
    if (!signal.ids.every((id) => typeof id === 'string')) return []
    if (!signal.labels.every((label) => typeof label === 'string')) return []
    if (signal.ids.length === 0 || signal.ids.length !== signal.labels.length) return []
    return [{ ids: [...signal.ids] as string[], labels: [...signal.labels] as string[] }]
  })
}

function normalizeStoredRecord(value: unknown): FacingRecord | null {
  if (!isRecord(value)) return null
  if (typeof value.date !== 'string' || typeof value.savedAt !== 'string') return null

  const signals = normalizeSignals(value.signals)
  if (signals.length === 0) return null

  try {
    return {
      version: 2,
      date: value.date,
      savedAt: value.savedAt,
      provider: validProvider(value.provider),
      signals,
      result: normalizeFacingAiResult(value.result),
    }
  } catch {
    return null
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'date' })
        store.createIndex('savedAt', 'savedAt')
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB를 열지 못했어.'))
  })
}

function txDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB 저장에 실패했어.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB 저장이 취소됐어.'))
  })
}

function readLegacyRecords(): FacingRecord[] {
  try {
    const raw = window.localStorage.getItem(LEGACY_HISTORY_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item): FacingRecord[] => {
      const record = normalizeStoredRecord(item)
      return record ? [record] : []
    })
  } catch {
    return []
  }
}

function readTodayCache(): FacingRecord | null {
  try {
    const raw = window.localStorage.getItem(TODAY_CACHE_KEY)
    if (!raw) return null
    return normalizeStoredRecord(JSON.parse(raw))
  } catch {
    return null
  }
}

function writeTodayCache(record: FacingRecord) {
  try {
    window.localStorage.setItem(TODAY_CACHE_KEY, JSON.stringify(record))
  } catch {
    // IndexedDB remains the source of truth; this cache is best-effort only.
  }
}

function notifyChanged() {
  window.dispatchEvent(new Event(FACING_MEMORY_UPDATED_EVENT))
}

async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist) await navigator.storage.persist()
  } catch {
    // Some browsers deny/omit persistent storage. Memory still works normally.
  }
}

export function initializeFacingMemory(): Promise<void> {
  if (initialization) return initialization

  initialization = (async () => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) return

    const db = await openDb()
    try {
      const migrated = window.localStorage.getItem(MIGRATION_MARKER_KEY) === '1'
      const legacy = migrated ? [] : readLegacyRecords()
      const todayCache = readTodayCache()
      const toImport = [...legacy]
      if (todayCache && !toImport.some((record) => record.date === todayCache.date)) {
        toImport.push(todayCache)
      }

      if (toImport.length > 0) {
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        toImport.forEach((record) => store.put(record))
        await txDone(transaction)
      }

      if (!migrated) {
        const today = legacy.find((record) => record.date === dateKey())
        if (today && !todayCache) writeTodayCache(today)
        window.localStorage.removeItem(LEGACY_HISTORY_KEY)
        window.localStorage.setItem(MIGRATION_MARKER_KEY, '1')
      }
    } finally {
      db.close()
    }

    await requestPersistentStorage()
  })().catch((error) => {
    initialization = null
    throw error
  })

  return initialization
}

export function loadTodayFacingRecord(): FacingRecord | null {
  if (typeof window === 'undefined') return null

  const cached = readTodayCache()
  if (cached?.date === dateKey()) return cached

  // One-release fallback while old localStorage data is waiting to migrate.
  return readLegacyRecords().find((record) => record.date === dateKey()) ?? null
}

export async function saveFacingRecord(
  signals: readonly FacingSignal[],
  result: FacingAiResult,
  provider: FacingProviderId | null,
): Promise<FacingRecord | null> {
  if (typeof window === 'undefined' || signals.length === 0) return null

  const record: FacingRecord = {
    version: 2,
    date: dateKey(),
    savedAt: new Date().toISOString(),
    provider,
    signals: signals.map((signal) => ({ ids: [...signal.ids], labels: [...signal.labels] })),
    result,
  }

  writeTodayCache(record)

  try {
    await initializeFacingMemory()
    const db = await openDb()
    try {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      transaction.objectStore(STORE_NAME).put(record)
      await txDone(transaction)
    } finally {
      db.close()
    }
    notifyChanged()
    return record
  } catch {
    return null
  }
}

export async function listFacingRecords(): Promise<FacingRecord[]> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return []
  await initializeFacingMemory()

  const db = await openDb()
  try {
    const records = await new Promise<unknown[]>((resolve, reject) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll()
      request.onsuccess = () => resolve(request.result as unknown[])
      request.onerror = () => reject(request.error ?? new Error('기록을 읽지 못했어.'))
    })

    return records
      .flatMap((item): FacingRecord[] => {
        const record = normalizeStoredRecord(item)
        return record ? [record] : []
      })
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
  } finally {
    db.close()
  }
}

export async function deleteFacingRecord(date: string): Promise<void> {
  await initializeFacingMemory()
  const db = await openDb()
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).delete(date)
    await txDone(transaction)
  } finally {
    db.close()
  }

  const cached = readTodayCache()
  if (cached?.date === date) window.localStorage.removeItem(TODAY_CACHE_KEY)
  notifyChanged()
}

export async function clearFacingMemory(): Promise<void> {
  await initializeFacingMemory()
  const db = await openDb()
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).clear()
    await txDone(transaction)
  } finally {
    db.close()
  }

  window.localStorage.removeItem(TODAY_CACHE_KEY)
  window.localStorage.removeItem(LEGACY_HISTORY_KEY)
  notifyChanged()
}

function localDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
}

function dateFromKey(key: string): Date | null {
  const match = key.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const value = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12)
  return Number.isNaN(value.getTime()) ? null : value
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function within(date: Date, start: Date, end: Date): boolean {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
}

function countSignals(
  records: readonly FacingRecord[],
  start: Date,
  end: Date,
): Map<string, number> {
  const counts = new Map<string, number>()

  records.forEach((record) => {
    const recordDate = dateFromKey(record.date)
    if (!recordDate || !within(recordDate, start, end)) return

    const seen = new Set(record.signals.map((signal) => signal.labels.join(' › ')))
    seen.forEach((label) => counts.set(label, (counts.get(label) ?? 0) + 1))
  })

  return counts
}

function recordedDays(records: readonly FacingRecord[], start: Date, end: Date): number {
  return new Set(
    records.flatMap((record) => {
      const recordDate = dateFromKey(record.date)
      return recordDate && within(recordDate, start, end) ? [record.date] : []
    }),
  ).size
}

export function summarizeFacingMemory(
  records: readonly FacingRecord[],
  now = new Date(),
): FacingMemorySummary {
  const today = localDay(now)
  const current7Start = addDays(today, -6)
  const previous7Start = addDays(today, -13)
  const previous7End = addDays(today, -7)
  const days30Start = addDays(today, -29)

  const current7 = countSignals(records, current7Start, today)
  const previous7 = countSignals(records, previous7Start, previous7End)
  const days30 = countSignals(records, days30Start, today)
  const labels = new Set([...days30.keys(), ...current7.keys(), ...previous7.keys()])

  const counts = [...labels].map((label): FacingSignalCount => {
    const current = current7.get(label) ?? 0
    const previous = previous7.get(label) ?? 0
    const thirty = days30.get(label) ?? 0
    const trend: FacingSignalCount['trend'] =
      current > 0 && previous === 0
        ? 'new'
        : current > previous
          ? 'up'
          : current < previous
            ? 'down'
            : 'same'

    return { label, current7: current, previous7: previous, days30: thirty, trend }
  })

  const top7 = counts
    .filter((item) => item.current7 > 0)
    .sort(
      (a, b) => b.current7 - a.current7 || b.days30 - a.days30 || a.label.localeCompare(b.label),
    )
  const top30 = counts
    .filter((item) => item.days30 > 0)
    .sort(
      (a, b) => b.days30 - a.days30 || b.current7 - a.current7 || a.label.localeCompare(b.label),
    )

  return {
    totalDays: new Set(records.map((record) => record.date)).size,
    days7: recordedDays(records, current7Start, today),
    days30: recordedDays(records, days30Start, today),
    top7,
    top30,
  }
}

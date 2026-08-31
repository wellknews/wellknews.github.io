import { summarizeFacingMemory, type FacingRecord, type FacingSignalCount } from './facingMemory'

type WorkbookCell = string | number | null

type WorkbookSheet = {
  name: string
  rows: WorkbookCell[][]
  widths: number[]
  headerRow?: number
  autoFilter?: boolean
}

type ZipEntry = {
  name: string
  data: Uint8Array
}

const encoder = new TextEncoder()

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function columnName(index: number): string {
  let value = index + 1
  let result = ''
  while (value > 0) {
    const remainder = (value - 1) % 26
    result = String.fromCharCode(65 + remainder) + result
    value = Math.floor((value - 1) / 26)
  }
  return result
}

function cellXml(value: WorkbookCell, rowIndex: number, colIndex: number, style: number): string {
  if (value === null || value === '') return ''
  const ref = `${columnName(colIndex)}${rowIndex + 1}`
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${ref}" s="${style}"><v>${value}</v></c>`
  }

  const text = String(value)
  return `<c r="${ref}" t="inlineStr" s="${style}"><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`
}

function worksheetXml(sheet: WorkbookSheet): string {
  const rowCount = Math.max(sheet.rows.length, 1)
  const colCount = Math.max(sheet.widths.length, ...sheet.rows.map((row) => row.length), 1)
  const dimension = `A1:${columnName(colCount - 1)}${rowCount}`
  const headerIndex = (sheet.headerRow ?? 1) - 1
  const rows = sheet.rows
    .map((row, rowIndex) => {
      const style = rowIndex === headerIndex ? 1 : rowIndex === 0 && headerIndex !== 0 ? 3 : 2
      const cells = row.map((value, colIndex) => cellXml(value, rowIndex, colIndex, style)).join('')
      return `<row r="${rowIndex + 1}">${cells}</row>`
    })
    .join('')
  const widths = sheet.widths
    .map(
      (width, index) =>
        `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`,
    )
    .join('')
  const filter =
    sheet.autoFilter && sheet.rows.length > 1
      ? `<autoFilter ref="A${headerIndex + 1}:${columnName(colCount - 1)}${rowCount}"/>`
      : ''
  const pane =
    headerIndex >= 0
      ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${headerIndex + 1}" topLeftCell="A${headerIndex + 2}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
      : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">\n<dimension ref="${dimension}"/>\n${pane}\n<sheetFormatPr defaultRowHeight="18"/>\n<cols>${widths}</cols>\n<sheetData>${rows}</sheetData>\n${filter}\n<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.2" footer="0.2"/>\n</worksheet>`
}

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="3">
    <font><sz val="11"/><name val="Aptos"/><family val="2"/></font>
    <font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Aptos"/><family val="2"/></font>
    <font><b/><sz val="16"/><name val="Aptos Display"/><family val="2"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF171513"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="4">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top"/></xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`

function dosDateTime(date: Date): { time: number; date: number } {
  const year = Math.max(1980, date.getFullYear())
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  }
}

const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  data.forEach((byte) => {
    crc = (crcTable[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8)
  })
  return (crc ^ 0xffffffff) >>> 0
}

function uint16(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff])
}

function uint32(value: number): Uint8Array {
  return new Uint8Array([
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ])
}

function concat(parts: readonly Uint8Array[]): Uint8Array<ArrayBuffer> {
  const size = parts.reduce((sum, part) => sum + part.byteLength, 0)
  const result = new Uint8Array(size)
  let offset = 0
  parts.forEach((part) => {
    result.set(part, offset)
    offset += part.byteLength
  })
  return result
}

function zipStore(entries: readonly ZipEntry[]): Uint8Array<ArrayBuffer> {
  const locals: Uint8Array[] = []
  const centrals: Uint8Array[] = []
  let offset = 0
  const stamp = dosDateTime(new Date())

  entries.forEach((entry) => {
    const name = encoder.encode(entry.name)
    const crc = crc32(entry.data)
    const local = concat([
      uint32(0x04034b50),
      uint16(20),
      uint16(0x0800),
      uint16(0),
      uint16(stamp.time),
      uint16(stamp.date),
      uint32(crc),
      uint32(entry.data.byteLength),
      uint32(entry.data.byteLength),
      uint16(name.byteLength),
      uint16(0),
      name,
      entry.data,
    ])
    locals.push(local)

    centrals.push(
      concat([
        uint32(0x02014b50),
        uint16(20),
        uint16(20),
        uint16(0x0800),
        uint16(0),
        uint16(stamp.time),
        uint16(stamp.date),
        uint32(crc),
        uint32(entry.data.byteLength),
        uint32(entry.data.byteLength),
        uint16(name.byteLength),
        uint16(0),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(0),
        uint32(offset),
        name,
      ]),
    )

    offset += local.byteLength
  })

  const central = concat(centrals)
  const end = concat([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(entries.length),
    uint16(entries.length),
    uint32(central.byteLength),
    uint32(offset),
    uint16(0),
  ])

  return concat([...locals, central, end])
}

function trendText(item: FacingSignalCount): string {
  if (item.trend === 'new') return '이번 7일 새로 선택'
  const delta = item.current7 - item.previous7
  if (delta > 0) return `이전 7일보다 +${delta}회`
  if (delta < 0) return `이전 7일보다 ${delta}회`
  return '이전 7일과 같음'
}

function joinLines(items: readonly string[]): string {
  return items.join('\n')
}

function ingredientLines(record: FacingRecord): string {
  return record.result.ingredients
    .map(
      (item) =>
        `${item.name} — ${item.easy} / ${item.target} / ${item.lookFor} / 주의: ${item.caution}`,
    )
    .join('\n')
}

function nutrientLines(record: FacingRecord): string {
  return record.result.nutrients
    .map(
      (item) =>
        `${item.name} — ${item.easy} / ${item.why} / ${item.guidance} / 주의: ${item.caution}`,
    )
    .join('\n')
}

function workbookSheets(records: readonly FacingRecord[]): WorkbookSheet[] {
  const summary = summarizeFacingMemory(records)
  const exportedAt = new Date().toISOString()
  const sortedAsc = [...records].sort((a, b) => a.date.localeCompare(b.date))
  const firstDate = sortedAsc[0]?.date ?? '-'
  const lastDate = sortedAsc.at(-1)?.date ?? '-'

  const overview: WorkbookSheet = {
    name: 'Overview',
    headerRow: 8,
    widths: [24, 18, 18, 18, 34],
    rows: [
      ['Facing AI Daily Face Memory'],
      ['내보낸 시각', exportedAt],
      ['전체 기록 일수', summary.totalDays],
      ['첫 기록', firstDate],
      ['마지막 기록', lastDate],
      ['저장 방식', '이 브라우저의 IndexedDB에만 저장된 기록을 내보냄'],
      [],
      ['신호', '최근 7일', '이전 7일', '최근 30일', '변화(선택 횟수)'],
      ...summary.top30.map((item) => [
        item.label,
        item.current7,
        item.previous7,
        item.days30,
        trendText(item),
      ]),
    ],
  }

  const dailyRows: WorkbookCell[][] = [
    [
      '날짜',
      '관찰',
      '오늘 요약',
      '세안·스킨케어 루틴',
      '스킨케어 성분',
      '영양 성분',
      '생활습관',
      '피하기',
      '관찰하기',
      '진료 안내',
      '저장 시각',
    ],
    ...sortedAsc.map((record) => [
      record.date,
      record.signals.map((signal) => signal.labels.join(' › ')).join('\n'),
      record.result.summary,
      joinLines(record.result.routine),
      ingredientLines(record),
      nutrientLines(record),
      joinLines(record.result.lifestyle),
      joinLines(record.result.avoid),
      joinLines(record.result.watch),
      record.result.getHelp ?? '',
      record.savedAt,
    ]),
  ]

  const signalRows: WorkbookCell[][] = [
    ['신호', '최근 7일', '이전 7일', '최근 30일', '변화(선택 횟수)'],
    ...summary.top30.map((item) => [
      item.label,
      item.current7,
      item.previous7,
      item.days30,
      trendText(item),
    ]),
  ]

  const ingredientRows: WorkbookCell[][] = [
    ['날짜', '구분', '성분', '쉬운 설명', '대상·이유', '어디서 찾기·확인', '주의'],
  ]
  sortedAsc.forEach((record) => {
    record.result.ingredients.forEach((item) => {
      ingredientRows.push([
        record.date,
        'SKINCARE',
        item.name,
        item.easy,
        item.target,
        item.lookFor,
        item.caution,
      ])
    })
    record.result.nutrients.forEach((item) => {
      ingredientRows.push([
        record.date,
        'NUTRIENT',
        item.name,
        item.easy,
        item.why,
        item.guidance,
        item.caution,
      ])
    })
  })

  return [
    overview,
    {
      name: 'Daily Records',
      headerRow: 1,
      autoFilter: true,
      widths: [12, 34, 42, 44, 48, 48, 38, 34, 34, 42, 24],
      rows: dailyRows,
    },
    {
      name: 'Signals',
      headerRow: 1,
      autoFilter: true,
      widths: [44, 14, 14, 14, 24],
      rows: signalRows,
    },
    {
      name: 'Ingredients',
      headerRow: 1,
      autoFilter: true,
      widths: [12, 14, 24, 44, 38, 44, 42],
      rows: ingredientRows,
    },
  ]
}

function buildFacingMemoryWorkbook(records: readonly FacingRecord[]): Uint8Array<ArrayBuffer> {
  const sheets = workbookSheets(records)
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${sheets
    .map(
      (_, index) =>
        `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
    )
    .join('\n  ')}
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <bookViews><workbookView/></bookViews>
  <sheets>${sheets
    .map(
      (sheet, index) =>
        `<sheet name="${xmlEscape(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`,
    )
    .join('')}</sheets>
  <calcPr calcId="191029" fullCalcOnLoad="1"/>
</workbook>`

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheets
    .map(
      (_, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
    )
    .join('\n  ')}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

  const now = new Date().toISOString()
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Facing AI Daily Face Memory</dc:title>
  <dc:creator>Mamaboy Facing AI</dc:creator>
  <cp:lastModifiedBy>Mamaboy Facing AI</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`

  const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Mamaboy Facing AI</Application>
</Properties>`

  const entries: ZipEntry[] = [
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rootRels) },
    { name: 'xl/workbook.xml', data: encoder.encode(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
    { name: 'xl/styles.xml', data: encoder.encode(STYLES_XML) },
    { name: 'docProps/core.xml', data: encoder.encode(core) },
    { name: 'docProps/app.xml', data: encoder.encode(app) },
    ...sheets.map((sheet, index) => ({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: encoder.encode(worksheetXml(sheet)),
    })),
  ]

  return zipStore(entries)
}

export function downloadFacingMemoryWorkbook(records: readonly FacingRecord[]): string {
  if (records.length === 0) throw new Error('내보낼 Facing AI 기록이 없어.')

  const bytes = buildFacingMemoryWorkbook(records)
  const filename = `mamaboy-facing-memory-${new Date().toISOString().slice(0, 10)}.xlsx`
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
  return filename
}

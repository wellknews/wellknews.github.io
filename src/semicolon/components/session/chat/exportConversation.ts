import type {
  DirectMessageSpeaker,
  DirectMessageTurn,
} from '../../../content/sessions/commander-at-home.transcript'

/**
 * 대화를 인스타그램 캐러셀로 옮기는 일.
 *
 * 페이지를 찍어서 1080px씩 자르지 않는다. 그렇게 하면 웹의 조판이 잘린 사진이
 * 되고, 잘린 자리는 문장의 경계와 아무 상관이 없다. 여기서는 같은 원고를 정사각형
 * 지면에 다시 앉힌다 — 조판은 두 벌이지만 원고는 한 벌이라는 원칙이 그대로다.
 *
 * 외부 라이브러리를 쓰지 않는다. 하는 일은 캔버스에 글자를 놓고, PNG로 굽고,
 * 압축 없는 ZIP으로 묶는 것뿐이다. 이 정도를 위해 의존성을 늘리면 번들이
 * 대화 한 편보다 무거워진다.
 */

type Progress = (current: number, total: number) => void

/* ─────────────────────────────  지면  ─────────────────────────────
 *
 * 값들은 웹의 조판에서 가져온 것이 아니라 정사각형 지면에서 다시 잡은 것이다.
 * 인스타그램의 카드는 손에 쥔 화면에서 1080px이 400px 남짓으로 줄어들므로,
 * 웹의 비율을 그대로 옮기면 글자가 읽히지 않는다.
 */
const CARD = 1080
const PAD = 72
/** 머리글(공간 이름과 장 번호)이 앉는 줄. */
const HEAD_Y = 54
/** 본문이 시작하고 끝나는 자리. 그 사이가 한 장에 담기는 전부다. */
const TOP = 138
const BOTTOM = 84
const CAPACITY = CARD - TOP - BOTTOM

const BODY_SIZE = 32
const LINE_HEIGHT = 45
const LABEL_SIZE = 20
const LABEL_GAP = 13
const LABEL_BLOCK = LABEL_SIZE + LABEL_GAP

const BUBBLE_W = 820
const BUBBLE_X_PAD = 28
const BUBBLE_Y_PAD = 24
const TEXT_W = BUBBLE_W - BUBBLE_X_PAD * 2

/** 말과 말 사이, 그리고 한 말 안에서 문단이 바뀌는 자리. */
const SEGMENT_GAP = 30
const PARAGRAPH_GAP = 17

const IMAGE_BOX = 520

/*
 * 색은 웹과 같은 값을 그대로 쓴다. 카드가 페이지에서 떨어져 나와 인스타그램에
 * 놓이더라도 같은 종이 위에 있어야 한다.
 */
const BG = '#fafaf8'
const INK = '#111111'
const MUTED = '#585853'
const LINE = 'rgba(17, 17, 17, 0.13)'
const MINE = 'rgba(17, 17, 17, 0.05)'
const THEIRS = 'rgba(255, 255, 255, 0.5)'

const SERIF = '"Hahmlet Variable", Hahmlet, Georgia, serif'
const MONO = '"IBM Plex Mono", "Hahmlet Variable", monospace'

const TITLE = ['군단장은', '본가에 있다']
const SUBTITLE = 'A CONVERSATION WITH TAB'
const STAMP = 'VIBE CODING · 2026-08-29'
const ADDRESS = 'wellknews.github.io/;/session/commander-at-home'
const ZIP_NAME = 'semicolon-commander-at-home-20260829.zip'

/* ─────────────────────────────  조판  ───────────────────────────── */

type TextBlock = {
  kind: 'text'
  speaker: DirectMessageSpeaker
  lines: string[]
  /** 이 줄 앞에서 문단이 바뀐다(블록 안에서의 상대 번호). */
  gaps: number[]
}

type ImageBlock = { kind: 'image'; speaker: DirectMessageSpeaker; src: string }

type Block = TextBlock | ImageBlock

type Card = Block[]

/**
 * 한 말을 줄로 풀어 놓은 것.
 *
 * 어디서 끊어도 되는지를 함께 들고 다닌다. 문단의 첫 줄은 문장의 첫 줄이기도
 * 하므로 두 목록은 겹치고, 끊을 자리를 고를 때 문단 쪽을 먼저 본다.
 */
type Spoken = {
  lines: string[]
  paragraphStarts: number[]
  sentenceStarts: number[]
}

/**
 * 문장의 경계.
 *
 * 카드가 넘칠 때 «문단 → 문장» 순으로 자연스러운 자리를 찾기 위한 것이다.
 * 글자 수로 자르면 한글이 낱자 사이에서 끊긴다.
 */
function sentences(text: string): string[] {
  if ('Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' })
    const parts = Array.from(segmenter.segment(text), (part) => part.segment.trim()).filter(Boolean)
    if (parts.length > 0) return parts
  }

  return text
    .split(/(?<=[.!?。！？])\s+/u)
    .map((part) => part.trim())
    .filter(Boolean)
}

/*
 * 줄바꿈의 단위.
 *
 * 웹에서 `word-break: keep-all`이 하는 일을 캔버스에서 손으로 한다. 한글은
 * 글자 하나하나가 줄바꿈이 가능한 자리지만, 그 사이에 끼면 안 되는 자리가 있다.
 *
 *   · 여는 따옴표와 괄호는 뒤따르는 말과 붙어 다닌다. 홀로 줄 끝에 남으면
 *     인용이 시작된다는 신호가 다음 줄의 첫 글자와 떨어진다.
 *   · 마침표·쉼표·닫는 따옴표는 앞 글자에 붙어 다닌다. 마침표 하나가 다음 줄
 *     첫머리에 홀로 떨어지면 그 자리에서 문장이 아니라 활자가 보인다.
 *   · 라틴 낱말에 붙은 조사(`AI를`, `png파일로`)는 한 덩어리로 움직인다.
 */
const TOKENS = /\s+|[^\s가-힣]+[가-힣]*|[가-힣][.,!?…·:;)\]}”’'"%]*/gu

function tokenize(text: string): string[] {
  return text.match(TOKENS) ?? [text]
}

/**
 * 한 문단을 줄로 흘려 놓는다.
 *
 * 문장마다 줄을 새로 시작하지 않는다. 웹의 문단이 그렇듯 문장은 앞 문장이
 * 끝난 자리에서 이어지고, 줄은 폭이 다했을 때만 바뀐다. 문장마다 끊으면
 * 대화가 시집처럼 보이고, 카드 수도 두 배가 된다.
 *
 * 그러면서도 «어느 줄에서 새 문장이 시작되는가»는 기억해 둔다. 카드가 넘칠 때
 * 끊을 자리를 고르는 데 쓴다 — 줄 한가운데에서 시작한 문장은 거기서 끊으면
 * 앞 문장의 꼬리까지 다음 장으로 넘어가므로 후보로 세지 않는다.
 */
function flow(
  ctx: CanvasRenderingContext2D,
  paragraph: string,
  maxWidth: number,
): { lines: string[]; sentenceStarts: number[] } {
  const lines: string[] = []
  const sentenceStarts: number[] = []
  let line = ''

  const overflow = (candidate: string) => ctx.measureText(candidate).width > maxWidth

  const put = (token: string) => {
    if (!line || !overflow(line + token)) {
      line += token
      return
    }

    lines.push(line.trimEnd())
    line = token.trimStart()

    /*
     * 낱말 하나가 한 줄보다 길 때만 글자 단위로 나눈다. 코드 포인트를 하나씩
     * 옮기므로 한글이 낱자 사이에서 갈라지지 않는다.
     */
    if (!overflow(line)) return

    let fragment = ''
    for (const char of Array.from(line)) {
      if (fragment && overflow(fragment + char)) {
        lines.push(fragment)
        fragment = char
      } else {
        fragment += char
      }
    }
    line = fragment
  }

  sentences(paragraph).forEach((sentence, index) => {
    if (index > 0 && line) put(' ')

    const [first, ...rest] = tokenize(sentence)
    const empty = line.trim() === ''
    const before = lines.length

    if (first !== undefined) put(first)
    if (index > 0 && (empty || lines.length > before)) sentenceStarts.push(lines.length)

    for (const token of rest) put(token)
  })

  if (line.trim()) lines.push(line.trimEnd())
  return { lines: lines.length > 0 ? lines : [''], sentenceStarts }
}

/** 줄 수와 문단 사이 간격으로 계산한 한 덩어리의 높이. */
function blockHeight(block: Block): number {
  if (block.kind === 'image') return LABEL_BLOCK + IMAGE_BOX

  return (
    LABEL_BLOCK +
    BUBBLE_Y_PAD * 2 +
    block.lines.length * LINE_HEIGHT +
    block.gaps.length * PARAGRAPH_GAP
  )
}

/** 한 말을 문단 → 문장 → 줄 순으로 풀어 놓는다. */
function speak(ctx: CanvasRenderingContext2D, paragraphs: readonly string[]): Spoken {
  const lines: string[] = []
  const paragraphStarts: number[] = []
  const sentenceStarts: number[] = []

  for (const paragraph of paragraphs) {
    /* 문단은 언제나 새 줄에서 시작한다. 그래서 문단의 경계는 늘 끊을 수 있다. */
    if (lines.length > 0) paragraphStarts.push(lines.length)

    const wrapped = flow(ctx, paragraph, TEXT_W)
    for (const at of wrapped.sentenceStarts) sentenceStarts.push(lines.length + at)
    lines.push(...wrapped.lines)
  }

  return { lines, paragraphStarts, sentenceStarts }
}

/**
 * 대화를 카드 여러 장으로 앉힌다.
 *
 * 한 말은 되도록 한 장 안에 둔다. 넘치는 말만 나누고, 나눌 때는 문단의 경계를
 * 먼저 찾고 없으면 문장의 경계를 찾는다. 문장 하나가 한 장보다 길 때만 줄에서
 * 끊는다 — 그때도 줄바꿈이 이미 낱말과 글자의 경계에서 일어난 뒤라 한글이
 * 낱자 사이에서 갈라지지 않는다.
 *
 * 남은 자리에는 다음 말이 이어 앉는다. 말마다 새 장을 주면 카드가 대화의 두
 * 배로 늘어나고, 캐러셀에 올릴 수 있는 장 수를 금방 넘긴다.
 */
function layout(ctx: CanvasRenderingContext2D, transcript: readonly DirectMessageTurn[]): Card[] {
  ctx.font = `${BODY_SIZE}px ${SERIF}`

  const cards: Card[] = []
  let card: Card = []
  /** 지금 카드에서 이미 쓴 높이(덩어리 사이 간격 포함). */
  let used = 0

  const breakCard = () => {
    if (card.length > 0) cards.push(card)
    card = []
    used = 0
  }

  const place = (block: Block) => {
    const height = blockHeight(block)
    const gap = card.length === 0 ? 0 : SEGMENT_GAP

    if (card.length > 0 && used + gap + height > CAPACITY) {
      breakCard()
      card.push(block)
      used = height
      return
    }

    card.push(block)
    used += gap + height
  }

  for (const turn of transcript) {
    const { lines, paragraphStarts, sentenceStarts } = speak(ctx, turn.paragraphs)

    /** 남은 높이 안에 커서부터 몇 줄이 들어가는지. 문단 사이 간격까지 센다. */
    const fits = (cursor: number, budget: number) => {
      let height = 0
      let count = 0

      while (cursor + count < lines.length) {
        const extra = count > 0 && paragraphStarts.includes(cursor + count) ? PARAGRAPH_GAP : 0
        if (height + extra + LINE_HEIGHT > budget) break
        height += extra + LINE_HEIGHT
        count += 1
      }

      return count
    }

    let cursor = 0
    while (cursor < lines.length) {
      const gap = card.length === 0 ? 0 : SEGMENT_GAP
      const shell = gap + LABEL_BLOCK + BUBBLE_Y_PAD * 2
      let take = fits(cursor, CAPACITY - used - shell)

      /*
       * 아주 조금 남은 자리에 두세 줄만 밀어 넣으면 다음 장의 첫머리가 문장
       * 한가운데가 된다. 그만큼도 안 들어가면 이 장을 닫고 새 장에서 시작한다.
       */
      if (take < Math.min(4, lines.length - cursor)) {
        breakCard()
        take = fits(cursor, CAPACITY - LABEL_BLOCK - BUBBLE_Y_PAD * 2)
      }

      /* 한 줄도 못 들어가는 지면은 만들지 않았다. 그래도 멈춰 둔다. */
      if (take === 0) break

      /* 남은 줄을 다 못 담으면 문단, 그다음 문장의 경계까지만 가져간다. */
      if (cursor + take < lines.length) {
        const edge = (marks: number[]) =>
          marks.filter((at) => at > cursor && at <= cursor + take).pop()
        take = (edge(paragraphStarts) ?? edge(sentenceStarts) ?? cursor + take) - cursor
      }

      place({
        kind: 'text',
        speaker: turn.speaker,
        lines: lines.slice(cursor, cursor + take),
        gaps: paragraphStarts
          .filter((at) => at > cursor && at < cursor + take)
          .map((at) => at - cursor),
      })

      cursor += take
    }

    if (turn.attachment) {
      place({ kind: 'image', speaker: turn.speaker, src: turn.attachment.src })
    }
  }

  breakCard()
  return cards
}

/* ─────────────────────────────  그리기  ───────────────────────────── */

function mono(ctx: CanvasRenderingContext2D, size: number) {
  ctx.font = `${size}px ${MONO}`
  /* 웹에서 메타데이터가 갖는 자간. 지원하지 않는 브라우저에서는 그냥 붙어 나온다. */
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0.14em'
}

function serif(ctx: CanvasRenderingContext2D, size: number, weight = 400) {
  ctx.font = `${weight} ${size}px ${SERIF}`
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'
}

/** 어느 카드에나 있는 것 — 종이, 공간의 이름, 몇 번째인지. */
function frame(ctx: CanvasRenderingContext2D, index: number, total: number) {
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, CARD, CARD)

  ctx.textBaseline = 'top'
  ctx.fillStyle = MUTED
  mono(ctx, LABEL_SIZE)

  ctx.textAlign = 'left'
  ctx.fillText('SEMICOLON / SESSION', PAD, HEAD_Y)

  ctx.textAlign = 'right'
  ctx.fillText(`${pad2(index)} / ${pad2(total)}`, CARD - PAD, HEAD_Y)
  ctx.textAlign = 'left'
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function speakerLabel(ctx: CanvasRenderingContext2D, speaker: DirectMessageSpeaker, y: number) {
  ctx.fillStyle = MUTED
  mono(ctx, LABEL_SIZE)
  ctx.textAlign = speaker === 'me' ? 'right' : 'left'
  ctx.fillText(speaker === 'me' ? 'ME' : 'TAB', speaker === 'me' ? CARD - PAD : PAD, y)
  ctx.textAlign = 'left'
}

/**
 * 말풍선.
 *
 * 모서리를 굴리지 않는다. 웹에서도 굴리지 않았고, 카드에서만 굴리면 같은 대화가
 * 두 개의 디자인을 갖게 된다.
 */
function drawText(ctx: CanvasRenderingContext2D, block: TextBlock, y: number): number {
  const mine = block.speaker === 'me'
  const x = mine ? CARD - PAD - BUBBLE_W : PAD

  speakerLabel(ctx, block.speaker, y)

  const top = y + LABEL_BLOCK
  const height = blockHeight(block) - LABEL_BLOCK

  ctx.fillStyle = mine ? MINE : THEIRS
  ctx.fillRect(x, top, BUBBLE_W, height)

  if (!mine) {
    ctx.strokeStyle = LINE
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, top + 0.5, BUBBLE_W - 1, height - 1)
  }

  serif(ctx, BODY_SIZE)
  ctx.fillStyle = INK
  ctx.textBaseline = 'top'

  let lineY = top + BUBBLE_Y_PAD
  block.lines.forEach((line, index) => {
    if (block.gaps.includes(index)) lineY += PARAGRAPH_GAP
    /* 세리프 본문의 행간 안에서 글자를 가운데에 둔다. */
    ctx.fillText(line, x + BUBBLE_X_PAD, lineY + (LINE_HEIGHT - BODY_SIZE) / 2 - 2)
    lineY += LINE_HEIGHT
  })

  return blockHeight(block)
}

function drawImage(
  ctx: CanvasRenderingContext2D,
  block: ImageBlock,
  image: HTMLImageElement,
  y: number,
): number {
  const mine = block.speaker === 'me'
  const x = mine ? CARD - PAD - IMAGE_BOX : PAD
  const top = y + LABEL_BLOCK

  speakerLabel(ctx, block.speaker, y)

  /* 정사각형 안에 가운데를 맞춰 채운다(object-fit: cover와 같은 계산). */
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  const side = Math.min(width, height)
  const sx = (width - side) / 2
  const sy = (height - side) / 2

  ctx.drawImage(image, sx, sy, side, side, x, top, IMAGE_BOX, IMAGE_BOX)

  ctx.strokeStyle = LINE
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, top + 0.5, IMAGE_BOX - 1, IMAGE_BOX - 1)

  return blockHeight(block)
}

/**
 * 첫 장.
 *
 * 대화가 아니라 표지다. 캐러셀을 넘기기 전에 보이는 한 장이므로 여기서 이
 * 기록이 무엇인지 끝난다 — 기호 하나, 제목, 그리고 언제였는지.
 */
function drawCover(ctx: CanvasRenderingContext2D, total: number) {
  frame(ctx, 1, total)

  ctx.fillStyle = INK
  serif(ctx, 96, 500)
  ctx.textBaseline = 'top'
  ctx.fillText(';', PAD, 168)

  serif(ctx, 86, 500)
  TITLE.forEach((line, index) => {
    ctx.fillText(line, PAD, 402 + index * 108)
  })

  ctx.fillStyle = MUTED
  mono(ctx, 22)
  ctx.fillText(SUBTITLE, PAD, 726)
  ctx.fillText(STAMP, PAD, 772)
}

/**
 * 마지막 장.
 *
 * 새로 지어낸 문장을 얹지 않는다. 대화는 이미 끝났고, 남는 것은 이 기록이
 * 실제로 어디에 있는지뿐이다.
 */
function drawEnd(ctx: CanvasRenderingContext2D, total: number) {
  frame(ctx, total, total)

  ctx.fillStyle = INK
  serif(ctx, 120, 500)
  ctx.textBaseline = 'top'
  ctx.fillText(';', PAD, 424)

  ctx.fillStyle = MUTED
  mono(ctx, 22)
  ctx.fillText(ADDRESS, PAD, 622)
}

/* ─────────────────────────────  굽기  ───────────────────────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error(`이미지를 불러오지 못했다: ${src}`)))
    image.src = src
  })
}

function toPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('PNG로 굽지 못했다.'))
    }, 'image/png')
  })
}

/**
 * 글꼴이 실제로 도착했는지 확인한다.
 *
 * 캔버스는 아직 내려받지 않은 글꼴을 기다려 주지 않는다. 그대로 그리면 폭을
 * 잘못 재서 줄이 어긋나고, 한글이 통째로 대체 글꼴로 나온다. Hahmlet의 한글은
 * 유니코드 구간별로 나뉘어 있으므로 실제로 쓸 문자열을 넘겨 필요한 조각만 받는다.
 */
async function ensureFonts(text: string) {
  const wanted = [
    [`${BODY_SIZE}px ${SERIF}`, text],
    [`500 86px ${SERIF}`, `${TITLE.join('')};`],
    [`${LABEL_SIZE}px ${MONO}`, `${SUBTITLE}${STAMP}${ADDRESS}SEMICOLON / SESSION METAB0123456789`],
  ] as const

  await Promise.all(
    wanted.map(([font, sample]) => document.fonts.load(font, sample).catch(() => [])),
  )
  await document.fonts.ready
}

/* ─────────────────────────────  ZIP  ─────────────────────────────
 *
 * 압축하지 않고(store) 담는다. PNG는 이미 압축된 형식이라 다시 줄여도 거의
 * 줄지 않고, deflate를 직접 구현하거나 라이브러리를 들이면 이 기능 하나가
 * 페이지에서 가장 무거운 코드가 된다.
 */

type ZipEntry = { name: string; data: Uint8Array }

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
  }
  return (crc ^ 0xffffffff) >>> 0
}

/** ZIP은 아직 1980년 기준의 MS-DOS 날짜를 쓴다. */
function dosStamp(date: Date) {
  const year = Math.max(1980, date.getFullYear())
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  }
}

function zip(entries: readonly ZipEntry[]): Blob {
  const encoder = new TextEncoder()
  const stamp = dosStamp(new Date())
  const locals: Uint8Array[] = []
  const centrals: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const name = encoder.encode(entry.name)
    const crc = crc32(entry.data)
    const size = entry.data.length

    const local = new Uint8Array(30 + name.length)
    const localView = new DataView(local.buffer)
    localView.setUint32(0, 0x04034b50, true)
    localView.setUint16(4, 20, true)
    localView.setUint16(10, stamp.time, true)
    localView.setUint16(12, stamp.date, true)
    localView.setUint32(14, crc, true)
    localView.setUint32(18, size, true)
    localView.setUint32(22, size, true)
    localView.setUint16(26, name.length, true)
    local.set(name, 30)

    const central = new Uint8Array(46 + name.length)
    const centralView = new DataView(central.buffer)
    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint16(12, stamp.time, true)
    centralView.setUint16(14, stamp.date, true)
    centralView.setUint32(16, crc, true)
    centralView.setUint32(20, size, true)
    centralView.setUint32(24, size, true)
    centralView.setUint16(28, name.length, true)
    centralView.setUint32(42, offset, true)
    central.set(name, 46)

    locals.push(local, entry.data)
    centrals.push(central)
    offset += local.length + size
  }

  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0)
  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)
  endView.setUint32(0, 0x06054b50, true)
  endView.setUint16(8, entries.length, true)
  endView.setUint16(10, entries.length, true)
  endView.setUint32(12, centralSize, true)
  endView.setUint32(16, offset, true)

  return new Blob([...locals, ...centrals, end] as BlobPart[], { type: 'application/zip' })
}

/**
 * 파일을 내려준다.
 *
 * 안드로이드 크롬을 포함해 어디서나 같은 방법을 쓴다 — blob 주소를 붙인 링크를
 * 한 번 누르는 것. 새 창을 열면 팝업 차단에 걸리고, 파일 시스템 API는
 * 데스크톱 크로미움 밖에서 없다.
 */
function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/**
 * 대화 한 편을 1080×1080 PNG 여러 장으로 굽고 ZIP 하나로 내려준다.
 *
 * 진행 상태를 한 장마다 알려 준다. 스무 장 가까이 굽는 동안 버튼이 아무 말도
 * 하지 않으면 눌리지 않은 것과 구별되지 않는다.
 */
export async function exportConversation(
  transcript: readonly DirectMessageTurn[],
  onProgress: Progress,
): Promise<void> {
  const text = transcript.flatMap((turn) => turn.paragraphs).join('')
  await ensureFonts(text)

  const canvas = document.createElement('canvas')
  canvas.width = CARD
  canvas.height = CARD
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('이 브라우저에서 캔버스를 쓸 수 없다.')

  const cards = layout(ctx, transcript)
  /* 표지와 마지막 장을 더한 것이 캐러셀의 길이다. */
  const total = cards.length + 2

  /*
   * 사진은 미리 받아 둔다.
   *
   * 카드를 굽는 도중에 기다리면 아직 도착하지 않은 그림 위에 다음 카드가
   * 그려진다. 같은 origin의 파일이라 캔버스가 오염되지도 않는다 — 여기서
   * 태극 이미지를 SVG에 감싸 두지 않고 실제 파일로 두는 이유이기도 하다.
   */
  const sources = new Set(
    cards.flatMap((card) => card.flatMap((block) => (block.kind === 'image' ? [block.src] : []))),
  )
  const images = new Map<string, HTMLImageElement>()
  await Promise.all(
    Array.from(sources, async (src) => {
      images.set(src, await loadImage(src))
    }),
  )

  const entries: ZipEntry[] = []

  /*
   * 캔버스는 한 장뿐이다.
   *
   * 굽기를 병렬로 돌리면 다음 카드가 앞 카드를 지운 위에 그려진다. 여기서
   * 순서대로 기다리는 것은 최적화를 놓친 것이 아니라 조건이다. 겸사겸사
   * 한 장마다 브라우저에 차례가 돌아가 진행 상태가 실제로 갱신된다.
   */
  const bake = async (name: string) => {
    const blob = await toPng(canvas)
    entries.push({ name, data: new Uint8Array(await blob.arrayBuffer()) })
    onProgress(entries.length, total)
  }

  drawCover(ctx, total)
  await bake(`${pad2(1)}-cover.png`)

  for (const [index, card] of cards.entries()) {
    const number = index + 2
    frame(ctx, number, total)

    /*
     * 사진 한 장뿐인 카드는 세로 가운데에 앉힌다.
     *
     * 위에 붙여 두면 아래쪽 절반이 통째로 빈다. 캐러셀에서 이 한 장은 프로필
     * 이미지를 보낸 장면 그 자체이므로, 비어 있는 것이 여백으로 읽혀야지
     * 자리가 남은 것으로 읽히면 안 된다.
     */
    const only = card.length === 1 ? card[0] : undefined
    let y = only?.kind === 'image' ? TOP + Math.round((CAPACITY - blockHeight(only)) / 2) : TOP

    for (const [at, block] of card.entries()) {
      if (at > 0) y += SEGMENT_GAP

      if (block.kind === 'text') {
        y += drawText(ctx, block, y)
        continue
      }

      const image = images.get(block.src)
      if (image) y += drawImage(ctx, block, image, y)
    }

    // oxlint-disable-next-line eslint/no-await-in-loop
    await bake(`${pad2(number)}.png`)
  }

  drawEnd(ctx, total)
  await bake(`${pad2(total)}-end.png`)

  save(zip(entries), ZIP_NAME)
}

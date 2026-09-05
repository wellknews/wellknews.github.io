export type ShareResult = 'shared' | 'copied' | 'manual' | 'cancelled'

interface SharePlatform {
  share?: ((data: { title: string; url: string }) => Promise<void>) | undefined
  copy?: ((url: string) => Promise<void>) | undefined
}

export async function shareCase(
  data: { title: string; url: string },
  platform: SharePlatform,
): Promise<ShareResult> {
  if (platform.share) {
    try {
      await platform.share(data)
      return 'shared'
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    if (!platform.copy) return 'manual'
    await platform.copy(data.url)
    return 'copied'
  } catch {
    return 'manual'
  }
}

/** A deepest selected observation path from the Facing AI morning check. */
export type FacingSignal = {
  ids: readonly string[]
  labels: readonly string[]
}

/**
 * `workers-ai` is the native zero-cost path.
 * Legacy values stay in the type so records saved by the previous external handoff still load.
 */
export type FacingProviderId = 'workers-ai' | 'chatgpt' | 'gemini' | 'claude'

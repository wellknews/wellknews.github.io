import { sampleCases } from '../data/sampleCases'
import type { CaseProvider } from '../types/missingChild'
import { caseAdapter } from './caseAdapter'

export const sampleCaseProvider: CaseProvider = {
  async getFeaturedCase() {
    return caseAdapter(sampleCases[0])
  },
  async getCase(id) {
    const record = sampleCases.find((item) => item.id === id)
    if (!record) throw new Error('요청한 예시를 찾을 수 없습니다.')
    return caseAdapter(record)
  },
}

// Replace the provider at this boundary when the server proxy is ready.
// No Safe182 credentials or direct API calls belong in the browser.
export const caseProvider: CaseProvider = sampleCaseProvider

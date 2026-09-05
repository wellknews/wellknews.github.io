export type CaseStatus = 'sample' | 'active' | 'stale' | 'unavailable'

export interface MissingChildCase {
  id: string
  name: string
  photoUrl?: string | undefined
  ageAtMissing?: number | undefined
  currentAge?: number | undefined
  sex?: string | undefined
  missingDate?: string | undefined
  missingArea?: string | undefined
  height?: string | undefined
  weight?: string | undefined
  physicalFeatures?: string | undefined
  clothing?: string | undefined
  officialUrl?: string | undefined
  sourceLabel: string
  verifiedAt?: string | undefined
  expiresAt?: string | undefined
  status: CaseStatus
}

export interface CaseProvider {
  getFeaturedCase(): Promise<MissingChildCase>
  getCase(id: string): Promise<MissingChildCase>
}

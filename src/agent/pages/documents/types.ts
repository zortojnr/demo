export interface Document {
  id: string
  name: string
  type: DocumentType
  status: DocumentStatus
  content: string
  htmlContent?: string
  propertyId?: string
  clientId?: string
  clientName?: string
  propertyAddress?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
  versions: DocumentVersion[]
  signatures: DocumentSignature[]
  metadata: DocumentMetadata
}

export interface DocumentVersion {
  id: string
  version: number
  content: string
  htmlContent?: string
  createdAt: string
  createdBy: string
  changesSummary: string
}

export interface DocumentSignature {
  id: string
  signerName: string
  signerEmail: string
  signatureData: string // base64 signature image
  signedAt: string
  ipAddress: string
  verified: boolean
}

export interface DocumentMetadata {
  size: string
  pageCount: number
  wordCount: number
  readingTime: number
  lastViewed?: string
  downloadCount: number
  shareLinks: ShareLink[]
}

export interface ShareLink {
  id: string
  url: string
  expiresAt: string
  accessCount: number
  createdAt: string
}

export interface Template {
  id: string
  name: string
  description: string
  type: DocumentType
  content: string
  htmlContent: string
  fields: TemplateField[]
  tags: string[]
  isBuiltIn: boolean
  isFavorite?: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface TemplateField {
  id: string
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'currency'
  placeholder?: string
  required: boolean
  options?: string[] // for select type
  defaultValue?: string
}

export type DocumentType = 
  | 'sales_contract'
  | 'tenancy_agreement' 
  | 'inspection_report'
  | 'marketing_proposal'
  | 'invoice'
  | 'custom'

export type DocumentStatus = 
  | 'draft'
  | 'generated'
  | 'sent'
  | 'signed'
  | 'archived'

export interface AIGenerationRequest {
  templateId: string
  fields: Record<string, any>
  customInstructions?: string
}

export interface AIGenerationResponse {
  content: string
  htmlContent: string
  suggestions: string[]
  estimatedReadingTime: number
  wordCount: number
}

export interface DocumentFilter {
  type?: DocumentType
  status?: DocumentStatus
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
  search?: string
}

export interface AuditLogEntry {
  id: string
  documentId: string
  action: 'created' | 'edited' | 'generated' | 'sent' | 'signed' | 'downloaded' | 'shared'
  userId: string
  userName: string
  timestamp: string
  ipAddress: string
  details?: string
}
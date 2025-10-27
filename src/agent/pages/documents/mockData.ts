import type { Document, Template, DocumentType, DocumentStatus } from './types'

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Sales Contract - Luxury Villa Paradise',
    type: 'sales_contract',
    status: 'signed',
    content: 'This Sales Contract is entered into between...',
    htmlContent: '<div class="document"><h1>Sales Contract</h1><p>This Sales Contract is entered into between...</p></div>',
    propertyId: 'prop-001',
    clientId: 'client-001',
    clientName: 'John Smith',
    propertyAddress: '123 Paradise Lane, Lagos',
    tags: ['urgent', 'high-value'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    createdBy: 'agent-001',
    versions: [
      {
        id: 'v1',
        version: 1,
        content: 'Initial draft...',
        createdAt: '2024-01-15T10:00:00Z',
        createdBy: 'agent-001',
        changesSummary: 'Initial document creation'
      },
      {
        id: 'v2',
        version: 2,
        content: 'Updated with client feedback...',
        createdAt: '2024-01-16T14:30:00Z',
        createdBy: 'agent-001',
        changesSummary: 'Added special terms and conditions'
      }
    ],
    signatures: [
      {
        id: 'sig-001',
        signerName: 'John Smith',
        signerEmail: 'john.smith@email.com',
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        signedAt: '2024-01-16T16:00:00Z',
        ipAddress: '192.168.1.100',
        verified: true
      }
    ],
    metadata: {
      size: '2.4 MB',
      pageCount: 8,
      wordCount: 2450,
      readingTime: 12,
      lastViewed: '2024-01-16T18:00:00Z',
      downloadCount: 3,
      shareLinks: []
    }
  },
  {
    id: '2',
    name: 'Tenancy Agreement - Modern Apartment',
    type: 'tenancy_agreement',
    status: 'sent',
    content: 'This Tenancy Agreement is made between...',
    propertyId: 'prop-002',
    clientId: 'client-002',
    clientName: 'Sarah Johnson',
    propertyAddress: '456 Modern Street, Abuja',
    tags: ['rental', 'apartment'],
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T15:00:00Z',
    createdBy: 'agent-001',
    versions: [
      {
        id: 'v1',
        version: 1,
        content: 'Tenancy agreement draft...',
        createdAt: '2024-01-14T09:00:00Z',
        createdBy: 'agent-001',
        changesSummary: 'Initial tenancy agreement'
      }
    ],
    signatures: [],
    metadata: {
      size: '1.8 MB',
      pageCount: 6,
      wordCount: 1800,
      readingTime: 9,
      downloadCount: 1,
      shareLinks: [
        {
          id: 'share-001',
          url: 'https://app.homekey.com/share/doc-2-abc123',
          expiresAt: '2024-01-21T15:00:00Z',
          accessCount: 2,
          createdAt: '2024-01-14T15:00:00Z'
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Property Inspection Report - Villa Paradise',
    type: 'inspection_report',
    status: 'generated',
    content: 'Property Inspection Report for Villa Paradise...',
    propertyId: 'prop-001',
    tags: ['inspection', 'maintenance'],
    createdAt: '2024-01-13T11:00:00Z',
    updatedAt: '2024-01-13T11:00:00Z',
    createdBy: 'agent-002',
    versions: [
      {
        id: 'v1',
        version: 1,
        content: 'Inspection findings...',
        createdAt: '2024-01-13T11:00:00Z',
        createdBy: 'agent-002',
        changesSummary: 'Initial inspection report'
      }
    ],
    signatures: [],
    metadata: {
      size: '3.2 MB',
      pageCount: 12,
      wordCount: 3200,
      readingTime: 16,
      downloadCount: 0,
      shareLinks: []
    }
  },
  {
    id: '4',
    name: 'Marketing Proposal - Luxury Development',
    type: 'marketing_proposal',
    status: 'draft',
    content: 'Marketing Strategy Proposal...',
    clientId: 'client-003',
    clientName: 'Lagos Properties Ltd',
    tags: ['marketing', 'proposal'],
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    createdBy: 'agent-001',
    versions: [
      {
        id: 'v1',
        version: 1,
        content: 'Marketing proposal draft...',
        createdAt: '2024-01-12T14:00:00Z',
        createdBy: 'agent-001',
        changesSummary: 'Initial proposal draft'
      }
    ],
    signatures: [],
    metadata: {
      size: '1.5 MB',
      pageCount: 4,
      wordCount: 1200,
      readingTime: 6,
      downloadCount: 0,
      shareLinks: []
    }
  }
]

export const mockTemplates: Template[] = [
  {
    id: 'template-sales-contract',
    name: 'Residential Sales Contract',
    description: 'Standard sales contract for residential properties',
    type: 'sales_contract',
    content: 'RESIDENTIAL SALES CONTRACT\n\nThis Sales Contract is entered into on {{contract_date}} between {{seller_name}} (Seller) and {{buyer_name}} (Buyer) for the property located at {{property_address}}.\n\nPURCHASE PRICE: {{sale_price}}\nDEPOSIT: {{deposit_amount}}\nCLOSING DATE: {{closing_date}}\n\nSPECIAL TERMS:\n{{special_terms}}\n\nThis contract is binding upon both parties.',
    htmlContent: '<div class="contract"><h1>RESIDENTIAL SALES CONTRACT</h1><p>This Sales Contract is entered into on <strong>{{contract_date}}</strong> between <strong>{{seller_name}}</strong> (Seller) and <strong>{{buyer_name}}</strong> (Buyer) for the property located at <strong>{{property_address}}</strong>.</p><h2>FINANCIAL TERMS</h2><ul><li>PURCHASE PRICE: <strong>{{sale_price}}</strong></li><li>DEPOSIT: <strong>{{deposit_amount}}</strong></li><li>CLOSING DATE: <strong>{{closing_date}}</strong></li></ul><h2>SPECIAL TERMS</h2><p>{{special_terms}}</p><p>This contract is binding upon both parties.</p></div>',
    fields: [
      { id: 'contract_date', name: 'contract_date', label: 'Contract Date', type: 'date', required: true },
      { id: 'seller_name', name: 'seller_name', label: 'Seller Name', type: 'text', required: true },
      { id: 'buyer_name', name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
      { id: 'property_address', name: 'property_address', label: 'Property Address', type: 'textarea', required: true },
      { id: 'sale_price', name: 'sale_price', label: 'Sale Price', type: 'currency', required: true, placeholder: '₦5,000,000' },
      { id: 'deposit_amount', name: 'deposit_amount', label: 'Deposit Amount', type: 'currency', required: true, placeholder: '₦500,000' },
      { id: 'closing_date', name: 'closing_date', label: 'Closing Date', type: 'date', required: true },
      { id: 'special_terms', name: 'special_terms', label: 'Special Terms', type: 'textarea', required: false, placeholder: 'Any special conditions or terms...' }
    ],
    tags: ['sales', 'residential', 'contract'],
    isBuiltIn: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    usageCount: 45
  },
  {
    id: 'template-tenancy-agreement',
    name: 'Standard Tenancy Agreement',
    description: 'Comprehensive tenancy agreement for rental properties',
    type: 'tenancy_agreement',
    content: 'TENANCY AGREEMENT\n\nThis agreement is made between {{landlord_name}} (Landlord) and {{tenant_name}} (Tenant) for the property at {{property_address}}.\n\nRENT: {{rent_amount}} per {{rent_period}}\nLEASE TERM: {{lease_term}}\nDEPOSIT: {{security_deposit}}\nMOVE-IN DATE: {{move_in_date}}\n\nUTILITIES:\n{{utilities_clause}}\n\nTERMS AND CONDITIONS:\n{{additional_terms}}',
    htmlContent: '<div class="agreement"><h1>TENANCY AGREEMENT</h1><p>This agreement is made between <strong>{{landlord_name}}</strong> (Landlord) and <strong>{{tenant_name}}</strong> (Tenant) for the property at <strong>{{property_address}}</strong>.</p><h2>RENTAL TERMS</h2><ul><li>RENT: <strong>{{rent_amount}}</strong> per {{rent_period}}</li><li>LEASE TERM: <strong>{{lease_term}}</strong></li><li>DEPOSIT: <strong>{{security_deposit}}</strong></li><li>MOVE-IN DATE: <strong>{{move_in_date}}</strong></li></ul><h2>UTILITIES</h2><p>{{utilities_clause}}</p><h2>TERMS AND CONDITIONS</h2><p>{{additional_terms}}</p></div>',
    fields: [
      { id: 'landlord_name', name: 'landlord_name', label: 'Landlord Name', type: 'text', required: true },
      { id: 'tenant_name', name: 'tenant_name', label: 'Tenant Name', type: 'text', required: true },
      { id: 'property_address', name: 'property_address', label: 'Property Address', type: 'textarea', required: true },
      { id: 'rent_amount', name: 'rent_amount', label: 'Monthly Rent', type: 'currency', required: true, placeholder: '₦150,000' },
      { id: 'rent_period', name: 'rent_period', label: 'Rent Period', type: 'select', required: true, options: ['month', 'year'], defaultValue: 'month' },
      { id: 'lease_term', name: 'lease_term', label: 'Lease Term', type: 'text', required: true, placeholder: '12 months' },
      { id: 'security_deposit', name: 'security_deposit', label: 'Security Deposit', type: 'currency', required: true, placeholder: '₦300,000' },
      { id: 'move_in_date', name: 'move_in_date', label: 'Move-in Date', type: 'date', required: true },
      { id: 'utilities_clause', name: 'utilities_clause', label: 'Utilities Arrangement', type: 'textarea', required: false, placeholder: 'Tenant responsible for electricity and water...' },
      { id: 'additional_terms', name: 'additional_terms', label: 'Additional Terms', type: 'textarea', required: false, placeholder: 'Any additional terms and conditions...' }
    ],
    tags: ['rental', 'tenancy', 'agreement'],
    isBuiltIn: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    usageCount: 32
  },
  {
    id: 'template-inspection-report',
    name: 'Property Inspection Report',
    description: 'Detailed property inspection report template',
    type: 'inspection_report',
    content: 'PROPERTY INSPECTION REPORT\n\nProperty: {{property_address}}\nInspector: {{inspector_name}}\nInspection Date: {{inspection_date}}\nClient: {{client_name}}\n\nPROPERTY CONDITION:\n{{property_condition}}\n\nISSUES IDENTIFIED:\n{{issues_found}}\n\nRECOMMendations:\n{{recommendations}}\n\nINSPECTOR SIGNATURE: ________________\nDate: {{report_date}}',
    htmlContent: '<div class="report"><h1>PROPERTY INSPECTION REPORT</h1><table><tr><td><strong>Property:</strong></td><td>{{property_address}}</td></tr><tr><td><strong>Inspector:</strong></td><td>{{inspector_name}}</td></tr><tr><td><strong>Inspection Date:</strong></td><td>{{inspection_date}}</td></tr><tr><td><strong>Client:</strong></td><td>{{client_name}}</td></tr></table><h2>PROPERTY CONDITION</h2><p>{{property_condition}}</p><h2>ISSUES IDENTIFIED</h2><p>{{issues_found}}</p><h2>RECOMMENDATIONS</h2><p>{{recommendations}}</p><div class="signature-section"><p><strong>INSPECTOR SIGNATURE:</strong> ________________</p><p><strong>Date:</strong> {{report_date}}</p></div></div>',
    fields: [
      { id: 'property_address', name: 'property_address', label: 'Property Address', type: 'textarea', required: true },
      { id: 'inspector_name', name: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
      { id: 'inspection_date', name: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
      { id: 'client_name', name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { id: 'property_condition', name: 'property_condition', label: 'Overall Property Condition', type: 'textarea', required: true, placeholder: 'Describe the general condition of the property...' },
      { id: 'issues_found', name: 'issues_found', label: 'Issues Identified', type: 'textarea', required: false, placeholder: 'List any issues or defects found...' },
      { id: 'recommendations', name: 'recommendations', label: 'Recommendations', type: 'textarea', required: false, placeholder: 'Recommended actions or repairs...' },
      { id: 'report_date', name: 'report_date', label: 'Report Date', type: 'date', required: true }
    ],
    tags: ['inspection', 'report', 'property'],
    isBuiltIn: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    usageCount: 28
  },
  {
    id: 'template-marketing-proposal',
    name: 'Marketing Campaign Proposal',
    description: 'Professional marketing proposal for property campaigns',
    type: 'marketing_proposal',
    content: 'MARKETING CAMPAIGN PROPOSAL\n\nClient: {{client_name}}\nProperty: {{property_details}}\nProposal Date: {{proposal_date}}\n\nCAMPAIGN SCOPE:\n{{campaign_scope}}\n\nDELIVERABLES:\n{{deliverables}}\n\nTIMELINE:\n{{timeline}}\n\nINVESTMENT:\n{{total_cost}}\n\nEXPECTED OUTCOMES:\n{{expected_outcomes}}',
    htmlContent: '<div class="proposal"><h1>MARKETING CAMPAIGN PROPOSAL</h1><table><tr><td><strong>Client:</strong></td><td>{{client_name}}</td></tr><tr><td><strong>Property:</strong></td><td>{{property_details}}</td></tr><tr><td><strong>Proposal Date:</strong></td><td>{{proposal_date}}</td></tr></table><h2>CAMPAIGN SCOPE</h2><p>{{campaign_scope}}</p><h2>DELIVERABLES</h2><p>{{deliverables}}</p><h2>TIMELINE</h2><p>{{timeline}}</p><h2>INVESTMENT</h2><p><strong>{{total_cost}}</strong></p><h2>EXPECTED OUTCOMES</h2><p>{{expected_outcomes}}</p></div>',
    fields: [
      { id: 'client_name', name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { id: 'property_details', name: 'property_details', label: 'Property Details', type: 'textarea', required: true },
      { id: 'proposal_date', name: 'proposal_date', label: 'Proposal Date', type: 'date', required: true },
      { id: 'campaign_scope', name: 'campaign_scope', label: 'Campaign Scope', type: 'textarea', required: true, placeholder: 'Describe the marketing campaign scope...' },
      { id: 'deliverables', name: 'deliverables', label: 'Deliverables', type: 'textarea', required: true, placeholder: 'List all deliverables...' },
      { id: 'timeline', name: 'timeline', label: 'Project Timeline', type: 'textarea', required: true, placeholder: 'Project timeline and milestones...' },
      { id: 'total_cost', name: 'total_cost', label: 'Total Investment', type: 'currency', required: true, placeholder: '₦500,000' },
      { id: 'expected_outcomes', name: 'expected_outcomes', label: 'Expected Outcomes', type: 'textarea', required: false, placeholder: 'Expected results and ROI...' }
    ],
    tags: ['marketing', 'proposal', 'campaign'],
    isBuiltIn: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    usageCount: 18
  },
  {
    id: 'template-invoice',
    name: 'Professional Invoice',
    description: 'Standard invoice template for services',
    type: 'invoice',
    content: 'INVOICE\n\nInvoice #: {{invoice_number}}\nDate: {{invoice_date}}\nDue Date: {{due_date}}\n\nBill To:\n{{client_name}}\n{{client_address}}\n\nSERVICES:\n{{service_items}}\n\nSUBTOTAL: {{subtotal}}\nTAX: {{tax_amount}}\nTOTAL: {{total_amount}}\n\nPAYMENT INSTRUCTIONS:\n{{payment_instructions}}',
    htmlContent: '<div class="invoice"><h1>INVOICE</h1><table><tr><td><strong>Invoice #:</strong></td><td>{{invoice_number}}</td></tr><tr><td><strong>Date:</strong></td><td>{{invoice_date}}</td></tr><tr><td><strong>Due Date:</strong></td><td>{{due_date}}</td></tr></table><h2>BILL TO</h2><p><strong>{{client_name}}</strong><br>{{client_address}}</p><h2>SERVICES</h2><p>{{service_items}}</p><table class="totals"><tr><td>SUBTOTAL:</td><td>{{subtotal}}</td></tr><tr><td>TAX:</td><td>{{tax_amount}}</td></tr><tr><td><strong>TOTAL:</strong></td><td><strong>{{total_amount}}</strong></td></tr></table><h2>PAYMENT INSTRUCTIONS</h2><p>{{payment_instructions}}</p></div>',
    fields: [
      { id: 'invoice_number', name: 'invoice_number', label: 'Invoice Number', type: 'text', required: true, placeholder: 'INV-2024-001' },
      { id: 'invoice_date', name: 'invoice_date', label: 'Invoice Date', type: 'date', required: true },
      { id: 'due_date', name: 'due_date', label: 'Due Date', type: 'date', required: true },
      { id: 'client_name', name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { id: 'client_address', name: 'client_address', label: 'Client Address', type: 'textarea', required: true },
      { id: 'service_items', name: 'service_items', label: 'Services/Items', type: 'textarea', required: true, placeholder: 'List services and amounts...' },
      { id: 'subtotal', name: 'subtotal', label: 'Subtotal', type: 'currency', required: true, placeholder: '₦100,000' },
      { id: 'tax_amount', name: 'tax_amount', label: 'Tax Amount', type: 'currency', required: false, placeholder: '₦7,500' },
      { id: 'total_amount', name: 'total_amount', label: 'Total Amount', type: 'currency', required: true, placeholder: '₦107,500' },
      { id: 'payment_instructions', name: 'payment_instructions', label: 'Payment Instructions', type: 'textarea', required: true, placeholder: 'Payment terms and instructions...' }
    ],
    tags: ['invoice', 'billing', 'payment'],
    isBuiltIn: true,
    createdBy: 'system',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    usageCount: 67
  }
]

export const documentTypeLabels: Record<DocumentType, string> = {
  sales_contract: 'Sales Contract',
  tenancy_agreement: 'Tenancy Agreement',
  inspection_report: 'Inspection Report',
  marketing_proposal: 'Marketing Proposal',
  invoice: 'Invoice',
  custom: 'Custom Document'
}

export const documentStatusLabels: Record<DocumentStatus, string> = {
  draft: 'Draft',
  generated: 'Generated',
  sent: 'Sent',
  signed: 'Signed',
  archived: 'Archived'
}

export const documentStatusColors: Record<DocumentStatus, string> = {
  draft: 'bg-slate-500/20 text-slate-300',
  generated: 'bg-blue-500/20 text-blue-300',
  sent: 'bg-yellow-500/20 text-yellow-300',
  signed: 'bg-emerald-500/20 text-emerald-300',
  archived: 'bg-gray-500/20 text-gray-300'
}

// Additional mock data used in document creation flow
export const mockClients = [
  { id: 'client-001', name: 'John Smith', email: 'john.smith@email.com', phone: '+234 801 234 5678' },
  { id: 'client-002', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+234 802 345 6789' },
  { id: 'client-003', name: 'Lagos Properties Ltd', email: 'info@lagosprops.com', phone: '+234 803 456 7890' }
]

export const mockProperties = [
  { id: 'prop-001', address: '123 Paradise Lane, Lagos', type: 'Villa', price: '₦5,000,000' },
  { id: 'prop-002', address: '456 Modern Street, Abuja', type: 'Apartment', price: '₦2,500,000' },
  { id: 'prop-003', address: '789 Ocean View, Port Harcourt', type: 'Condo', price: '₦3,200,000' }
]

// Alias for existing templates export to match imports
export const templates = mockTemplates
// SOS ProcureSphere 360 - Database Layer & Mock Data Structures

export type UserRole = 'REQUESTOR' | 'PROCUREMENT_OFFICER' | 'FINANCE_OFFICER' | 'COUNTRY_DIRECTOR' | 'AUDITOR' | 'SUPPLIER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  location: string;
  avatar: string;
}

export interface BudgetLine {
  id: string;
  grantId: string;
  grantName: string;
  donor: string;
  department: string;
  location: string;
  allocated: number;
  committed: number;
  actual: number;
  available: number;
}

export interface SupplierDocument {
  name: string;
  expiryDate: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING';
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  taxId: string;
  bankAccount: string;
  bankName: string;
  contactName: string;
  email: string;
  phone: string;
  rating: number; // 1-5 scale
  deliveryTimeRating: number;
  qualityRating: number;
  complianceRating: number;
  isBlacklisted: boolean;
  blacklistReason?: string;
  blacklistDate?: string;
  isPreferred: boolean;
  documents: SupplierDocument[];
}

export interface PRLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface PRApprovalStep {
  role: UserRole;
  approverName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  date?: string;
  comments?: string;
}

export interface PurchaseRequisition {
  id: string;
  requesterId: string;
  requesterName: string;
  department: string;
  location: string;
  grantId: string;
  budgetLineId: string;
  justification: string;
  items: PRLineItem[];
  totalAmount: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_PO';
  createdAt: string;
  approvals: PRApprovalStep[];
  budgetCheckMode: 'SOFT' | 'HARD';
}

export interface RFx {
  id: string;
  title: string;
  prId: string;
  category: string;
  closeDate: string; // ISO DateTime
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EVALUATING' | 'AWARDED';
  invitedSuppliers: string[]; // Supplier IDs
  isReverseAuction: boolean;
}

export interface BidLine {
  itemDescription: string;
  qty: number;
  unitPrice: number;
}

export interface SupplierBid {
  id: string;
  rfxId: string;
  supplierId: string;
  supplierName: string;
  submissionTime: string;
  items: BidLine[];
  totalPrice: number;
  leadTimeDays: number;
  warrantyMonths: number;
  technicalCompliance: boolean;
  score?: number;
  notes?: string;
  status: 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'AWARDED';
}

export interface POAmendment {
  version: number;
  date: string;
  description: string;
  approvedBy: string;
}

export interface PurchaseOrder {
  id: string;
  prId: string;
  rfxId?: string;
  supplierId: string;
  supplierName: string;
  grantId: string;
  department: string;
  location: string;
  totalAmount: number;
  status: 'DRAFT' | 'APPROVED' | 'ISSUED' | 'PARTIALLY_RECEIVED' | 'CLOSED';
  createdAt: string;
  approvedAt?: string;
  issuedAt?: string;
  amendments: POAmendment[];
}

export interface GRNLine {
  itemDescription: string;
  qtyOrdered: number;
  qtyReceived: number;
  status: 'FULLY_RECEIVED' | 'PARTIALLY_RECEIVED' | 'DAMAGED';
}

export interface GoodsReceiptNote {
  id: string;
  poId: string;
  receivedBy: string;
  receivedAt: string;
  items: GRNLine[];
  carrierReference?: string;
}

export interface Invoice {
  id: string;
  poId: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  submittedAt: string;
  invoiceFile?: string;
  status: 'PENDING' | 'MATCHED' | 'EXCEPTION' | 'PAID';
}

export interface MatchResult {
  invoiceId: string;
  poId: string;
  poMatch: boolean;
  grnMatch: boolean;
  priceVariance: number; // percentage
  qtyVariance: number; // percentage
  status: 'PASSED' | 'PRICE_MISMATCH' | 'QTY_MISMATCH' | 'MISSING_GRN';
  exceptionResolved: boolean;
  resolverName?: string;
  resolutionComments?: string;
}

export interface BankingTransfer {
  referenceId: string;
  invoiceId: string;
  poId: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
  status: 'INITIATED' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';
  initiationPayload: string;
  bankReference?: string;
  reconciledAt?: string;
}

export interface DocumentVersion {
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  hash: string;
  changes: string;
}

export interface DMSDocument {
  id: string;
  name: string;
  folder: 'Finance' | 'Procurement' | 'Logistics' | 'Grants';
  docType: 'PR' | 'RFQ' | 'BID' | 'PO' | 'GRN' | 'INVOICE' | 'PAYMENT' | 'VEND_DOC';
  referenceId: string; // ID of the entity it links to, e.g. PO-2026-001
  supplierName?: string;
  grantId?: string;
  uploadDate: string;
  amount?: number;
  ocrText: string;
  permissions: {
    view: UserRole[];
    edit: UserRole[];
  };
  versions: DocumentVersion[];
  retentionExpiry: string; // ISO Date
  isArchived: boolean;
}

export interface AuditEvent {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

// ------------------------------------------------------------
// DATABASE MOCK SEED RECORDS
// ------------------------------------------------------------

export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Kiatu Barclay',
    email: 'kiatu.barclay@sos-liberia.org',
    role: 'REQUESTOR',
    department: 'Education',
    location: 'Juah Town Children Village',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face'
  },
  {
    id: 'USR-002',
    name: 'Tamba Cooper',
    email: 'tamba.cooper@sos-liberia.org',
    role: 'PROCUREMENT_OFFICER',
    department: 'Procurement',
    location: 'Monrovia National Office',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'
  },
  {
    id: 'USR-003',
    name: 'Helena Cole',
    email: 'helena.cole@sos-liberia.org',
    role: 'FINANCE_OFFICER',
    department: 'Finance',
    location: 'Monrovia National Office',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face'
  },
  {
    id: 'USR-004',
    name: 'Dr. Augustine A. Allieu',
    email: 'augustine.allieu@sos-liberia.org',
    role: 'COUNTRY_DIRECTOR',
    department: 'Executive',
    location: 'Monrovia National Office',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&crop=face'
  },
  {
    id: 'USR-005',
    name: 'Robert Green',
    email: 'robert.green@donor-auditor.org',
    role: 'AUDITOR',
    department: 'External Audit',
    location: 'Geneva / Monrovia Office',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face'
  }
];

export const MOCK_BUDGET_LINES: BudgetLine[] = [
  {
    id: 'BL-001',
    grantId: 'USAID-SOS-2025',
    grantName: 'Youth Empowerment & Protection Liberia',
    donor: 'USAID',
    department: 'Education',
    location: 'Juah Town Children Village',
    allocated: 120000,
    committed: 45000,
    actual: 35000,
    available: 40000
  },
  {
    id: 'BL-002',
    grantId: 'EU-CHILD-CARE',
    grantName: 'Integrated Family Strengthening Liberia',
    donor: 'European Union',
    department: 'Health',
    location: 'Juah Town Children Village',
    allocated: 85000,
    committed: 12000,
    actual: 54000,
    available: 19000
  },
  {
    id: 'BL-003',
    grantId: 'BMZ-EDU-LIB',
    grantName: 'Primary & Vocational School Operations',
    donor: 'BMZ (Germany)',
    department: 'Education',
    location: 'Grand Bassa School',
    allocated: 200000,
    committed: 85000,
    actual: 92000,
    available: 23000
  },
  {
    id: 'BL-004',
    grantId: 'GLO-SPONSOR-2026',
    grantName: 'Direct Orphan Care Support Services',
    donor: 'Global SOS Sponsorships',
    department: 'Operations',
    location: 'Monrovia National Office',
    allocated: 350000,
    committed: 110000,
    actual: 220000,
    available: 20000
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Liberia Enterprise Inc.',
    category: 'Educational Supplies & Uniforms',
    taxId: 'TAX-LR-88719-A',
    bankAccount: 'LR11-9988-7766-5544-01',
    bankName: 'Ecobank Liberia Limited',
    contactName: 'Rufus Kollie',
    email: 'sales@liberia-enterprise.com',
    phone: '+231-886-500-120',
    rating: 4.8,
    deliveryTimeRating: 4.9,
    qualityRating: 4.7,
    complianceRating: 4.8,
    isBlacklisted: false,
    isPreferred: true,
    documents: [
      { name: 'Business_Registration_2026.pdf', expiryDate: '2026-12-31', status: 'VALID' },
      { name: 'Tax_Clearance_Q2_2026.pdf', expiryDate: '2026-07-31', status: 'VALID' },
      { name: 'Article_of_Incorporation.pdf', expiryDate: '2030-01-01', status: 'VALID' }
    ]
  },
  {
    id: 'SUP-002',
    name: 'Golden Key Logistics',
    category: 'Transportation & Vehicle Spare Parts',
    taxId: 'TAX-LR-32941-F',
    bankAccount: 'LR23-7766-4433-2211-09',
    bankName: 'International Bank Liberia',
    contactName: 'Emmanuel Sherman',
    email: 'info@goldenkeylogistics.lr',
    phone: '+231-777-123-456',
    rating: 4.2,
    deliveryTimeRating: 4.0,
    qualityRating: 4.3,
    complianceRating: 4.4,
    isBlacklisted: false,
    isPreferred: false,
    documents: [
      { name: 'Business_Registration_2026.pdf', expiryDate: '2026-11-30', status: 'VALID' },
      { name: 'Tax_Clearance_Q2_2026.pdf', expiryDate: '2026-06-30', status: 'VALID' }
    ]
  },
  {
    id: 'SUP-003',
    name: 'Monrovia Tech Hub Ltd',
    category: 'IT Equipment & Networking Hardware',
    taxId: 'TAX-LR-49823-K',
    bankAccount: 'LR88-1122-3344-5566-02',
    bankName: 'United Bank for Africa (UBA) Liberia',
    contactName: 'Fatoumata Diallo',
    email: 'orders@monroviatechhub.com',
    phone: '+231-880-999-888',
    rating: 4.6,
    deliveryTimeRating: 4.5,
    qualityRating: 4.7,
    complianceRating: 4.6,
    isBlacklisted: false,
    isPreferred: true,
    documents: [
      { name: 'Business_Licence_2026.pdf', expiryDate: '2026-08-15', status: 'VALID' },
      { name: 'Tax_Compliance_Cert_2026.pdf', expiryDate: '2026-09-01', status: 'VALID' }
    ]
  },
  {
    id: 'SUP-004',
    name: 'West Africa Health Supplies',
    category: 'Medical Equipment & Pharmaceuticals',
    taxId: 'TAX-LR-11029-X',
    bankAccount: 'LR45-4433-5566-1122-07',
    bankName: 'Liberia Bank for Development & Investment (LBDI)',
    contactName: 'Joseph Sirleaf',
    email: 'joseph@wa-healthsupplies.com',
    phone: '+231-886-444-111',
    rating: 2.1,
    deliveryTimeRating: 1.8,
    qualityRating: 2.5,
    complianceRating: 2.0,
    isBlacklisted: true,
    blacklistReason: 'Repeated supply of expired medications and non-compliance with drug storage regulations during delivery.',
    blacklistDate: '2026-04-10',
    isPreferred: false,
    documents: [
      { name: 'Business_Licence_2025.pdf', expiryDate: '2025-12-31', status: 'EXPIRED' },
      { name: 'Pharmacy_Board_LR_Cert.pdf', expiryDate: '2026-02-15', status: 'EXPIRED' }
    ]
  }
];

export const MOCK_REQUISITIONS: PurchaseRequisition[] = [
  {
    id: 'PR-2026-001',
    requesterId: 'USR-001',
    requesterName: 'Kiatu Barclay',
    department: 'Education',
    location: 'Juah Town Children Village',
    grantId: 'USAID-SOS-2025',
    budgetLineId: 'BL-001',
    justification: 'Purchase of 30 textbooks, educational materials, and school uniforms for child support services at Juah Town SOS Village Primary school.',
    items: [
      { id: 'ITM-01', description: 'Primary Grade Textbook Math/Science Pack of 30', quantity: 1, unitPrice: 450 },
      { id: 'ITM-02', description: 'SOS Custom Printed School Uniforms for Juah Town Pupils', quantity: 30, unitPrice: 25 },
      { id: 'ITM-03', description: 'Assorted School Stationary Packs (notebooks, pens, rulers)', quantity: 30, unitPrice: 10 }
    ],
    totalAmount: 1500, // 450 + 750 + 300
    status: 'APPROVED',
    createdAt: '2026-05-10',
    budgetCheckMode: 'SOFT',
    approvals: [
      { role: 'REQUESTOR', approverName: 'Kiatu Barclay', status: 'APPROVED', date: '2026-05-10', comments: 'Requested emergency educational material fill.' },
      { role: 'PROCUREMENT_OFFICER', approverName: 'Tamba Cooper', status: 'APPROVED', date: '2026-05-11', comments: 'Budget check passed (soft limit). Prices validated.' },
      { role: 'FINANCE_OFFICER', approverName: 'Helena Cole', status: 'APPROVED', date: '2026-05-12', comments: 'Sufficient funds available in Grant USAID-2025.' },
      { role: 'COUNTRY_DIRECTOR', approverName: 'Dr. Augustine A. Allieu', status: 'SKIPPED', comments: 'Below national director approval threshold of $5,000 USD.' }
    ]
  },
  {
    id: 'PR-2026-002',
    requesterId: 'USR-001',
    requesterName: 'Kiatu Barclay',
    department: 'Education',
    location: 'Juah Town Children Village',
    grantId: 'USAID-SOS-2025',
    budgetLineId: 'BL-001',
    justification: 'Procurement of 10 modern learning laptops for the new Youth Computer Laboratory building in the Juah Town School.',
    items: [
      { id: 'ITM-04', description: 'Lenovo ThinkPad L14 Core i5, 16GB RAM, 512GB SSD', quantity: 10, unitPrice: 750 }
    ],
    totalAmount: 7500,
    status: 'PENDING_APPROVAL',
    createdAt: '2026-05-25',
    budgetCheckMode: 'HARD',
    approvals: [
      { role: 'REQUESTOR', approverName: 'Kiatu Barclay', status: 'APPROVED', date: '2026-05-25', comments: 'Highly needed computer literacy project labs.' },
      { role: 'PROCUREMENT_OFFICER', approverName: 'Tamba Cooper', status: 'APPROVED', date: '2026-05-26', comments: 'RFQ triggered since amount > $5,000. Verified.' },
      { role: 'FINANCE_OFFICER', approverName: 'Helena Cole', status: 'PENDING', comments: 'Awaiting formal Quote Evaluation review before committing.' },
      { role: 'COUNTRY_DIRECTOR', approverName: 'Dr. Augustine A. Allieu', status: 'PENDING', comments: 'Required approval above $5,000 threshold.' }
    ]
  },
  {
    id: 'PR-2026-003',
    requesterId: 'USR-001',
    requesterName: 'Kiatu Barclay',
    department: 'Education',
    location: 'Juah Town Children Village',
    grantId: 'EU-CHILD-CARE',
    budgetLineId: 'BL-002',
    justification: 'Emergency purchase of children medicines and medical supplies due to high local fever season in Grand Bassa SOS Clinic.',
    items: [
      { id: 'ITM-05', description: 'Malaria Medical Kits & Diagnostic Strips Pack of 200', quantity: 1, unitPrice: 24000 }
    ],
    totalAmount: 24000,
    status: 'REJECTED',
    createdAt: '2026-05-18',
    budgetCheckMode: 'HARD',
    approvals: [
      { role: 'REQUESTOR', approverName: 'Kiatu Barclay', status: 'APPROVED', date: '2026-05-18', comments: 'Urgent medical inventory fill request.' },
      { role: 'PROCUREMENT_OFFICER', approverName: 'Tamba Cooper', status: 'REJECTED', date: '2026-05-19', comments: 'HARD BUDGET CHECK BLOCKED: The requested amount ($24,000) exceeds the remaining budget of $19,000 in EU-CHILD-CARE.' }
    ]
  }
];

export const MOCK_RFX: RFx[] = [
  {
    id: 'RFQ-2026-001',
    title: 'Supply of Student Textbooks and Custom Uniforms',
    prId: 'PR-2026-001',
    category: 'Educational Supplies & Uniforms',
    closeDate: '2026-05-15T17:00:00Z',
    status: 'AWARDED',
    invitedSuppliers: ['SUP-001', 'SUP-003'],
    isReverseAuction: false
  },
  {
    id: 'RFQ-2026-002',
    title: 'Sourcing of Youth Lab Computers and Laptops',
    prId: 'PR-2026-002',
    category: 'IT Equipment & Networking Hardware',
    closeDate: '2026-06-10T17:00:00Z',
    status: 'ACTIVE',
    invitedSuppliers: ['SUP-003', 'SUP-001', 'SUP-002'],
    isReverseAuction: true
  }
];

export const MOCK_BIDS: SupplierBid[] = [
  {
    id: 'BID-001',
    rfxId: 'RFQ-2026-001',
    supplierId: 'SUP-001',
    supplierName: 'Liberia Enterprise Inc.',
    submissionTime: '2026-05-14T11:22:00Z',
    items: [
      { itemDescription: 'Primary Grade Textbook Math/Science Pack of 30', qty: 1, unitPrice: 420 },
      { itemDescription: 'SOS Custom Printed School Uniforms for Juah Town Pupils', qty: 30, unitPrice: 24 },
      { itemDescription: 'Assorted School Stationary Packs', qty: 30, unitPrice: 9.5 }
    ],
    totalPrice: 1425, // 420 + 720 + 285
    leadTimeDays: 5,
    warrantyMonths: 0,
    technicalCompliance: true,
    score: 95,
    notes: 'Preferred supplier pricing discounts applied.',
    status: 'AWARDED'
  },
  {
    id: 'BID-002',
    rfxId: 'RFQ-2026-001',
    supplierId: 'SUP-003',
    supplierName: 'Monrovia Tech Hub Ltd',
    submissionTime: '2026-05-15T09:15:00Z',
    items: [
      { itemDescription: 'Primary Grade Textbook Math/Science Pack of 30', qty: 1, unitPrice: 500 },
      { itemDescription: 'SOS Custom Printed School Uniforms for Juah Town Pupils', qty: 30, unitPrice: 30 },
      { itemDescription: 'Assorted School Stationary Packs', qty: 30, unitPrice: 12 }
    ],
    totalPrice: 1760,
    leadTimeDays: 8,
    warrantyMonths: 0,
    technicalCompliance: true,
    score: 82,
    notes: 'Standard educational catalogue pricing.',
    status: 'REJECTED'
  },
  // Active RFP Bids
  {
    id: 'BID-003',
    rfxId: 'RFQ-2026-002',
    supplierId: 'SUP-003',
    supplierName: 'Monrovia Tech Hub Ltd',
    submissionTime: '2026-05-27T16:00:00Z',
    items: [
      { itemDescription: 'Lenovo ThinkPad L14 Core i5, 16GB RAM, 512GB SSD', qty: 10, unitPrice: 720 }
    ],
    totalPrice: 7200,
    leadTimeDays: 3,
    warrantyMonths: 24,
    technicalCompliance: true,
    notes: 'Includes free courier delivery and setup in Juah Town Village.',
    status: 'SHORTLISTED'
  },
  {
    id: 'BID-004',
    rfxId: 'RFQ-2026-002',
    supplierId: 'SUP-002',
    supplierName: 'Golden Key Logistics',
    submissionTime: '2026-05-28T08:30:00Z',
    items: [
      { itemDescription: 'Lenovo ThinkPad L14 Core i5, 16GB RAM, 512GB SSD', qty: 10, unitPrice: 740 }
    ],
    totalPrice: 7400,
    leadTimeDays: 7,
    warrantyMonths: 12,
    technicalCompliance: true,
    notes: 'Sourced directly from certified suppliers.',
    status: 'PENDING'
  }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2026-001',
    prId: 'PR-2026-001',
    rfxId: 'RFQ-2026-001',
    supplierId: 'SUP-001',
    supplierName: 'Liberia Enterprise Inc.',
    grantId: 'USAID-SOS-2025',
    department: 'Education',
    location: 'Juah Town Children Village',
    totalAmount: 1425,
    status: 'PARTIALLY_RECEIVED',
    createdAt: '2026-05-16',
    approvedAt: '2026-05-16',
    issuedAt: '2026-05-17',
    amendments: [
      { version: 1, date: '2026-05-17', description: 'Updated delivery site location to Building C primary warehouse.', approvedBy: 'Tamba Cooper' }
    ]
  }
];

export const MOCK_GRNS: GoodsReceiptNote[] = [
  {
    id: 'GRN-2026-001',
    poId: 'PO-2026-001',
    receivedBy: 'Tamba Cooper',
    receivedAt: '2026-05-22T10:00:00Z',
    carrierReference: 'DHL-LR-1284712',
    items: [
      { itemDescription: 'Primary Grade Textbook Math/Science Pack of 30', qtyOrdered: 1, qtyReceived: 1, status: 'FULLY_RECEIVED' },
      { itemDescription: 'SOS Custom Printed School Uniforms for Juah Town Pupils', qtyOrdered: 30, qtyReceived: 20, status: 'PARTIALLY_RECEIVED' }, // missing 10
      { itemDescription: 'Assorted School Stationary Packs', qtyOrdered: 30, qtyReceived: 30, status: 'FULLY_RECEIVED' }
    ]
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    poId: 'PO-2026-001',
    supplierId: 'SUP-001',
    supplierName: 'Liberia Enterprise Inc.',
    amount: 1425, // Full invoice submitted
    submittedAt: '2026-05-24',
    status: 'EXCEPTION' // Invoiced full amount, but GRN shows only partial uniforms received!
  }
];

export const MOCK_MATCH_RESULTS: MatchResult[] = [
  {
    invoiceId: 'INV-2026-001',
    poId: 'PO-2026-001',
    poMatch: true, // PO lists 1425, invoice lists 1425
    grnMatch: false, // GRN uniforms quantity is 20, invoice/PO quantity is 30! Mismatch!
    priceVariance: 0,
    qtyVariance: 33.3, // 10/30 uniforms missing
    status: 'QTY_MISMATCH',
    exceptionResolved: false
  }
];

export const MOCK_BANK_TRANSFERS: BankingTransfer[] = [
  {
    referenceId: 'TRF-2026-0912',
    invoiceId: 'INV-2026-001',
    poId: 'PO-2026-001',
    supplierId: 'SUP-001',
    supplierName: 'Liberia Enterprise Inc.',
    amount: 1185, // Re-calculated matched amount only (or full pending resolution)
    accountNumber: 'LR11-9988-7766-5544-01',
    bankName: 'Ecobank Liberia Limited',
    swiftCode: 'ECOBLRMonrovia',
    status: 'INITIATED',
    initiationPayload: `{"PaymentInitiation":{"Reference":"TRF-2026-0912","Recipient":"Liberia Enterprise Inc.","AccountNumber":"LR11-9988-7766-5544-01","BankSwift":"ECOBLRMonrovia","Amount":1185.00,"Currency":"USD","Narrative":"Payment for PO-2026-001 Textbooks & Uniforms","SoDApproved":true}}`
  }
];

export const MOCK_DOCUMENTS: DMSDocument[] = [
  {
    id: 'DOC-101',
    name: 'Purchase_Requisition_PR-2026-001.pdf',
    folder: 'Procurement',
    docType: 'PR',
    referenceId: 'PR-2026-001',
    uploadDate: '2026-05-10',
    ocrText: 'SOS Children Villages Liberia Purchase Requisition. Requisition ID: PR-2026-001. Requester: Kiatu Barclay. Department: Education. Justification: Textbooks and Custom School Uniforms for Juah Town children. Total requested amount: $1,500.00. Budget line: BL-001. USAID-SOS-2025 funding approved by Helen Cole and Tamba Cooper.',
    permissions: {
      view: ['REQUESTOR', 'PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR'],
      edit: ['PROCUREMENT_OFFICER']
    },
    versions: [
      { version: 1, uploadedAt: '2026-05-10T09:00:00Z', uploadedBy: 'Kiatu Barclay', hash: '8f2d847124cb11ef88ec0242ac130002', changes: 'Initial requisition submission' }
    ],
    retentionExpiry: '2033-05-10',
    isArchived: false
  },
  {
    id: 'DOC-102',
    name: 'RFQ_uniform_textbooks_RFQ-2026-001.pdf',
    folder: 'Procurement',
    docType: 'RFQ',
    referenceId: 'RFQ-2026-001',
    uploadDate: '2026-05-12',
    ocrText: 'SOS Children Villages Liberia RFQ Sourcing. Sourcing Reference: RFQ-2026-001. Request for Quotation. Title: Supply of Student Textbooks and Custom Uniforms. Deadline for submission: May 15, 2026. Sealed Bid regulations apply. Invited: Liberia Enterprise Inc, Monrovia Tech Hub.',
    permissions: {
      view: ['PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR', 'SUPPLIER'],
      edit: ['PROCUREMENT_OFFICER']
    },
    versions: [
      { version: 1, uploadedAt: '2026-05-12T14:30:00Z', uploadedBy: 'Tamba Cooper', hash: '9b3c482012eb12ef88ec0242ac130002', changes: 'Created sourcing document' }
    ],
    retentionExpiry: '2033-05-12',
    isArchived: false
  },
  {
    id: 'DOC-103',
    name: 'Supplier_Bid_Liberia_Enterprise_BID-001.pdf',
    folder: 'Procurement',
    docType: 'BID',
    referenceId: 'BID-001',
    supplierName: 'Liberia Enterprise Inc.',
    uploadDate: '2026-05-14',
    amount: 1425,
    ocrText: 'LIBERIA ENTERPRISE INC BID SUBMISSION. RFQ Ref: RFQ-2026-001. Quotation: textbooks total $420, uniforms 30 units total $720, stationery packs 30 units total $285. Grand total: $1,425.00. Lead time: 5 days. Warranty: None. Tax Registration ID: TAX-LR-88719-A. Signed Rufus Kollie.',
    permissions: {
      view: ['PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR'],
      edit: []
    },
    versions: [
      { version: 1, uploadedAt: '2026-05-14T11:22:00Z', uploadedBy: 'Rufus Kollie', hash: '5c1234ba443c11ef88ec0242ac130002', changes: 'Bid submitted' }
    ],
    retentionExpiry: '2033-05-14',
    isArchived: false
  },
  {
    id: 'DOC-104',
    name: 'Purchase_Order_PO-2026-001.pdf',
    folder: 'Procurement',
    docType: 'PO',
    referenceId: 'PO-2026-001',
    supplierName: 'Liberia Enterprise Inc.',
    uploadDate: '2026-05-16',
    amount: 1425,
    ocrText: 'SOS Children Villages Liberia PURCHASE ORDER. PO ID: PO-2026-001. Date: May 16, 2026. Vendor: Liberia Enterprise Inc. Total contract value: $1,425.00. Shipping location: Juah Town Children Village Building C. Authorized by: Tamba Cooper, Procurement Officer. Budget approved under USAID-SOS-2025. Integrity SHA-256 seal verified.',
    permissions: {
      view: ['REQUESTOR', 'PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR', 'SUPPLIER'],
      edit: ['PROCUREMENT_OFFICER']
    },
    versions: [
      { version: 1, uploadedAt: '2026-05-16T16:00:00Z', uploadedBy: 'Tamba Cooper', hash: 'a12bcde34f567890abcdef1234567890', changes: 'Initial Release' },
      { version: 2, uploadedAt: '2026-05-17T09:30:00Z', uploadedBy: 'Tamba Cooper', hash: 'a12bcde34f567890abcdef1234567891', changes: 'Amendment 1: Added shipping building reference' }
    ],
    retentionExpiry: '2033-05-16',
    isArchived: false
  },
  {
    id: 'DOC-105',
    name: 'Goods_Receipt_GRN-2026-001.pdf',
    folder: 'Logistics',
    docType: 'GRN',
    referenceId: 'GRN-2026-001',
    uploadDate: '2026-05-22',
    ocrText: 'SOS Children Villages Liberia GOODS RECEIPT NOTE (GRN). GRN Ref: GRN-2026-001. Related PO: PO-2026-001. Received by: Tamba Cooper. Received date: May 22, 2026. Items received: Textbooks 1 pack (fully received), Stationery 30 packs (fully received), School Uniforms 20 units (PARTIALLY RECEIVED, 10 units missing, DHL courier noted carton damage). Carrier ref: DHL-LR-1284712.',
    permissions: {
      view: ['REQUESTOR', 'PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR'],
      edit: ['PROCUREMENT_OFFICER']
    },
    versions: [
      { version: 1, uploadedAt: '2026-05-22T10:15:00Z', uploadedBy: 'Tamba Cooper', hash: 'cfd41a82bbef12ef88ec0242ac130002', changes: 'GRN physical verification signed' }
    ],
    retentionExpiry: '2033-05-22',
    isArchived: false
  },
  {
    id: 'DOC-106',
    name: 'Supplier_Invoice_INV-2026-001.pdf',
    folder: 'Finance',
    docType: 'INVOICE',
    referenceId: 'INV-2026-001',
    supplierName: 'Liberia Enterprise Inc.',
    uploadDate: '2026-05-24',
    amount: 1425,
    ocrText: 'LIBERIA ENTERPRISE INC INVOICE. Invoice ID: INV-2026-001. Date: May 24, 2026. Bill to: SOS Children Villages Liberia Monrovia. Ref PO: PO-2026-001. Charges: textbook kits $420, uniforms 30 units $720, stationery $285. Total invoiced amount: $1,425.00. Payment bank: Ecobank. Payment due in 30 days.',
    permissions: {
      view: ['PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR', 'SUPPLIER'],
      edit: ['FINANCE_OFFICER']
    },
    versions: [
      { version: 1, uploadedAt: '2026-05-24T08:00:00Z', uploadedBy: 'Rufus Kollie', hash: 'e0123dcd224f11ef88ec0242ac130002', changes: 'Invoice file upload' }
    ],
    retentionExpiry: '2033-05-24',
    isArchived: false
  }
];

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-001',
    userId: 'USR-001',
    userName: 'Kiatu Barclay',
    userRole: 'REQUESTOR',
    action: 'CREATE_PR',
    entity: 'PurchaseRequisition',
    entityId: 'PR-2026-001',
    timestamp: '2026-05-10T09:12:00Z',
    details: 'Created Purchase Requisition for textbooks and custom uniforms, amount $1,500.00.',
    ipAddress: '197.231.25.101' // Liberia IP address
  },
  {
    id: 'AUD-002',
    userId: 'USR-002',
    userName: 'Tamba Cooper',
    userRole: 'PROCUREMENT_OFFICER',
    action: 'VERIFY_BUDGET',
    entity: 'PurchaseRequisition',
    entityId: 'PR-2026-001',
    timestamp: '2026-05-11T14:22:00Z',
    details: 'Budget Soft Check warning bypassed. Allocation available: $40,000, requesting $1,500. Approved.',
    ipAddress: '197.231.25.105'
  },
  {
    id: 'AUD-003',
    userId: 'USR-003',
    userName: 'Helena Cole',
    userRole: 'FINANCE_OFFICER',
    action: 'APPROVE_PR',
    entity: 'PurchaseRequisition',
    entityId: 'PR-2026-001',
    timestamp: '2026-05-12T16:30:00Z',
    details: 'Finance approved. Committed $1,500.00 against USAID-SOS-2025 grant, budget line BL-001.',
    ipAddress: '197.231.25.106'
  },
  {
    id: 'AUD-004',
    userId: 'USR-002',
    userName: 'Tamba Cooper',
    userRole: 'PROCUREMENT_OFFICER',
    action: 'CREATE_RFQ',
    entity: 'RFx',
    entityId: 'RFQ-2026-001',
    timestamp: '2026-05-12T17:15:00Z',
    details: 'Sourcing RFQ launched. Invited Liberia Enterprise Inc and Monrovia Tech Hub.',
    ipAddress: '197.231.25.105'
  },
  {
    id: 'AUD-005',
    userId: 'SUP-001',
    userName: 'Liberia Enterprise Inc.',
    userRole: 'SUPPLIER',
    action: 'SUBMIT_BID',
    entity: 'SupplierBid',
    entityId: 'BID-001',
    timestamp: '2026-05-14T11:22:00Z',
    details: 'Supplier submitted bid of $1,425.00 with 5-day lead time.',
    ipAddress: '197.231.27.14'
  },
  {
    id: 'AUD-006',
    userId: 'USR-002',
    userName: 'Tamba Cooper',
    userRole: 'PROCUREMENT_OFFICER',
    action: 'AWARD_BID',
    entity: 'RFx',
    entityId: 'RFQ-2026-001',
    timestamp: '2026-05-15T10:00:00Z',
    details: 'Award recommendation made to Liberia Enterprise Inc. Evaluation score: 95/100.',
    ipAddress: '197.231.25.105'
  },
  {
    id: 'AUD-007',
    userId: 'USR-002',
    userName: 'Tamba Cooper',
    userRole: 'PROCUREMENT_OFFICER',
    action: 'CREATE_PO',
    entity: 'PurchaseOrder',
    entityId: 'PO-2026-001',
    timestamp: '2026-05-16T16:00:00Z',
    details: 'Generated Purchase Order PO-2026-001 from awarded RFQ BID-001. SHA-256 integrity seal applied: a12bcde34f567890abcdef1234567890.',
    ipAddress: '197.231.25.105'
  },
  {
    id: 'AUD-008',
    userId: 'USR-002',
    userName: 'Tamba Cooper',
    userRole: 'PROCUREMENT_OFFICER',
    action: 'AMEND_PO',
    entity: 'PurchaseOrder',
    entityId: 'PO-2026-001',
    timestamp: '2026-05-17T09:30:00Z',
    details: 'PO amended to version 2. Updated delivery address details. SHA-256 seal: a12bcde34f567890abcdef1234567891.',
    ipAddress: '197.231.25.105'
  },
  {
    id: 'AUD-009',
    userId: 'USR-002',
    userName: 'Tamba Cooper',
    userRole: 'PROCUREMENT_OFFICER',
    action: 'SIGN_GRN',
    entity: 'GoodsReceiptNote',
    entityId: 'GRN-2026-001',
    timestamp: '2026-05-22T10:15:00Z',
    details: 'Goods Receipt Note signed. Caught 10 missing custom school uniforms (Damaged carton via DHL).',
    ipAddress: '197.231.25.105'
  },
  {
    id: 'AUD-010',
    userId: 'SUP-001',
    userName: 'Liberia Enterprise Inc.',
    userRole: 'SUPPLIER',
    action: 'SUBMIT_INVOICE',
    entity: 'Invoice',
    entityId: 'INV-2026-001',
    timestamp: '2026-05-24T08:00:00Z',
    details: 'Invoice INV-2026-001 submitted for full PO contract value of $1,425.00.',
    ipAddress: '197.231.27.14'
  },
  {
    id: 'AUD-011',
    userId: 'USR-003',
    userName: 'Helena Cole',
    userRole: 'FINANCE_OFFICER',
    action: 'TRIGGER_3WAY_MATCH',
    entity: 'MatchResult',
    entityId: 'INV-2026-001',
    timestamp: '2026-05-24T10:30:00Z',
    details: '3-way match finished. Flagged QTY_MISMATCH exception: Invoiced 30 uniforms, received 20. Workflow locked in finance exceptions board.',
    ipAddress: '197.231.25.106'
  }
];

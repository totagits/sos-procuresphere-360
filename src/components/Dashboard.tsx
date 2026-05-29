import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck, 
  ShoppingBag, 
  Layers, 
  FolderLock, 
  Coins, 
  Activity, 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  ArrowLeft,
  FileText,
  Search,
  Download,
  Fingerprint,
  RefreshCw,
  Clock,
  User,
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingUp,
  Key,
  Lock,
  Mail,
  ShieldCheck
} from 'lucide-react';
import type { 
  User as UserType, 
  PurchaseRequisition, 
  SupplierBid, 
  DMSDocument,
  AuditEvent,
  Invoice,
  MatchResult,
  BankingTransfer,
  Supplier,
  UserRole,
  RFx
} from '../data/mockData';
import { 
  MOCK_USERS, 
  MOCK_BUDGET_LINES, 
  MOCK_SUPPLIERS, 
  MOCK_REQUISITIONS, 
  MOCK_RFX, 
  MOCK_BIDS, 
  MOCK_PURCHASE_ORDERS, 
  MOCK_INVOICES, 
  MOCK_MATCH_RESULTS, 
  MOCK_BANK_TRANSFERS, 
  MOCK_DOCUMENTS, 
  MOCK_AUDIT_EVENTS 
} from '../data/mockData';

interface DashboardProps {
  activeUser: UserType;
  onExit: () => void;
  onSwitchUser: (u: UserType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeUser, onExit, onSwitchUser }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'pr' | 'rfx' | 'matching' | 'dms' | 'finance' | 'health'>('analytics');
  
  // React State replicating "Database Engine" operations
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>(MOCK_REQUISITIONS);
  const [budgets, setBudgets] = useState(MOCK_BUDGET_LINES);
  
  // Load custom suppliers from localStorage, merged with MOCK_SUPPLIERS
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const custom = localStorage.getItem('CUSTOM_SUPPLIERS');
    const parsedCustom = custom ? JSON.parse(custom) : [];
    return [...MOCK_SUPPLIERS, ...parsedCustom];
  });

  // Load custom users dynamically based on active suppliers who have accounts
  const [simUsers, setSimUsers] = useState<UserType[]>(() => {
    const custom = localStorage.getItem('CUSTOM_SUPPLIERS');
    const parsedCustom = custom ? JSON.parse(custom) : [];
    const customSupplierUsers = parsedCustom
      .filter((s: any) => s.accountStatus === 'PENDING_CONFIRMATION' || s.accountStatus === 'ACTIVE')
      .map((s: any) => ({
        id: s.id,
        name: `${s.contactName} (${s.name})`,
        email: s.email,
        role: 'SUPPLIER' as UserRole,
        department: 'Sales & Bids',
        location: s.name,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'
      }));
    return [...MOCK_USERS, ...customSupplierUsers];
  });

  const refreshSimUsers = (updatedSuppliersList: Supplier[]) => {
    const customSupplierUsers = updatedSuppliersList
      .filter((s: any) => s.accountStatus === 'PENDING_CONFIRMATION' || s.accountStatus === 'ACTIVE')
      .map((s: any) => ({
        id: s.id,
        name: `${s.contactName} (${s.name})`,
        email: s.email,
        role: 'SUPPLIER' as UserRole,
        department: 'Sales & Bids',
        location: s.name,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'
      }));
    setSimUsers([...MOCK_USERS, ...customSupplierUsers]);
  };

  const [rfxList, setRfxList] = useState(MOCK_RFX);
  const [bids, setBids] = useState<SupplierBid[]>(MOCK_BIDS);
  const [purchaseOrders, setPurchaseOrders] = useState(MOCK_PURCHASE_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [matches, setMatches] = useState<MatchResult[]>(MOCK_MATCH_RESULTS);
  const [transfers, setTransfers] = useState<BankingTransfer[]>(MOCK_BANK_TRANSFERS);
  const [documents, setDocuments] = useState<DMSDocument[]>(MOCK_DOCUMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);

  // Form states
  const [showNewPRModal, setShowNewPRModal] = useState(false);
  const [newPRDesc, setNewPRDesc] = useState('');
  const [newPRQty, setNewPRQty] = useState(1);
  const [newPRPrice, setNewPRPrice] = useState(10);
  const [newPRJustification, setNewPRJustification] = useState('');
  const [selectedBudgetLineId, setSelectedBudgetLineId] = useState('BL-001');
  const [budgetCheckMessage, setBudgetCheckMessage] = useState<{status: 'PASSED'|'WARN'|'BLOCKED', text: string} | null>(null);

  // RFx states
  const [reverseAuctionEnabled, setReverseAuctionEnabled] = useState(false);
  const [showNewRFQModal, setShowNewRFQModal] = useState(false);
  const [newRFQTitle, setNewRFQTitle] = useState('');
  const [newRFQPrId, setNewRFQPrId] = useState('');
  const [newRFQCategory, setNewRFQCategory] = useState('IT Equipment & Networking Hardware');
  const [newRFQCloseDate, setNewRFQCloseDate] = useState('2026-06-30T17:00');
  const [newRFQInvitedSuppliers, setNewRFQInvitedSuppliers] = useState<string[]>([]);
  const [newRFQIsReverseAuction, setNewRFQIsReverseAuction] = useState(false);
  
  // DMS Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DMSDocument | null>(MOCK_DOCUMENTS[3]); // PO-001 doc pre-selected

  // Supplier & Compliance System States
  const [tempPassInput, setTempPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [supplierRfxSelect, setSupplierRfxSelect] = useState('RFQ-2026-002');
  const [supplierBidPrice, setSupplierBidPrice] = useState(6900);
  const [supplierBidLeadTime, setSupplierBidLeadTime] = useState(5);
  const [supplierBidWarranty, setSupplierBidWarranty] = useState(24);
  const [supplierBidNotes, setSupplierBidNotes] = useState('Official bidding submission.');
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewingDocName, setRenewingDocName] = useState('');
  const [renewingDocExpiry, setRenewingDocExpiry] = useState('2027-12-31');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Procurement Vendor Approval States
  const [showSupplierApprovalModal, setShowSupplierApprovalModal] = useState(false);
  const [approvingSupplier, setApprovingSupplier] = useState<Supplier | null>(null);
  const [generatedTempPassword, setGeneratedTempPassword] = useState('');

  // Find the active supplier linked to this login
  const activeSupplier = suppliers.find(s => s.email === activeUser.email || s.id === activeUser.id);
  const isForceResetActive = activeSupplier && activeSupplier.accountStatus === 'PENDING_CONFIRMATION';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Audit Pack Selected ID
  const [selectedAuditPackRef, setSelectedAuditPackRef] = useState('PR-2026-001');
  const [isGeneratingAuditPack, setIsGeneratingAuditPack] = useState(false);
  const [generatedAuditPackResult, setGeneratedAuditPackResult] = useState<boolean>(false);

  // Exception Resolver comments
  const [resolutionComment, setResolutionComment] = useState('');
  const [resolvedInvoices, setResolvedInvoices] = useState<string[]>([]);

  // Policy Settings override state
  const [strictSoD, setStrictSoD] = useState(true);
  const [quoteRuleThreshold, setQuoteRuleThreshold] = useState(5000); // 3 quotes rule threshold

  // Helper logger
  const logEvent = (action: string, entity: string, entityId: string, details: string) => {
    const newEvent: AuditEvent = {
      id: `AUD-0${auditLogs.length + 1}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userRole: activeUser.role,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      details,
      ipAddress: '197.231.25.105'
    };
    setAuditLogs(prev => [newEvent, ...prev]);
  };

  // Trigger Budget Live commitment calculation
  const handleBudgetCheck = (val: number, lineId: string) => {
    const line = budgets.find(b => b.id === lineId);
    if (!line) return;
    
    const remaining = line.available;
    if (val > remaining) {
      setBudgetCheckMessage({
        status: 'BLOCKED',
        text: `HARD BLOCK: Requested $${val.toLocaleString()} exceeds available grant budget of $${remaining.toLocaleString()} under ${line.grantId}.`
      });
    } else if (val > remaining * 0.8) {
      setBudgetCheckMessage({
        status: 'WARN',
        text: `SOFT CHECK WARNING: Allocation is at 80%+ utilization. Remaining available: $${remaining.toLocaleString()}.`
      });
    } else {
      setBudgetCheckMessage({
        status: 'PASSED',
        text: `BUDGET CHECK PASSED: Ample grant funds available. Remaining: $${remaining.toLocaleString()}.`
      });
    }
  };

  // Submit Requisition (PR)
  const submitPR = (e: React.FormEvent) => {
    e.preventDefault();
    const line = budgets.find(b => b.id === selectedBudgetLineId);
    if (!line) return;

    const total = newPRQty * newPRPrice;
    
    // Enforce budget checks
    if (total > line.available) {
      alert(`PR creation blocked. Exceeds available grant budget.`);
      return;
    }

    const prId = `PR-2026-0${requisitions.length + 1}`;
    const newPR: PurchaseRequisition = {
      id: prId,
      requesterId: activeUser.id,
      requesterName: activeUser.name,
      department: activeUser.department,
      location: activeUser.location,
      grantId: line.grantId,
      budgetLineId: selectedBudgetLineId,
      justification: newPRJustification,
      items: [{
        id: `ITM-0${Math.floor(Math.random() * 100)}`,
        description: newPRDesc,
        quantity: newPRQty,
        unitPrice: newPRPrice
      }],
      totalAmount: total,
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString().split('T')[0],
      budgetCheckMode: total > line.available * 0.8 ? 'HARD' : 'SOFT',
      approvals: [
        { role: 'REQUESTOR', approverName: activeUser.name, status: 'APPROVED', date: new Date().toISOString().split('T')[0], comments: 'Requisition submitted.' },
        { role: 'PROCUREMENT_OFFICER', approverName: 'Tamba Cooper', status: 'PENDING', comments: 'Awaiting pricing verification.' },
        { role: 'FINANCE_OFFICER', approverName: 'Helena Cole', status: 'PENDING' }
      ]
    };

    // Update state databases
    setRequisitions(prev => [newPR, ...prev]);
    
    // Commit funds against budget
    setBudgets(prev => prev.map(b => {
      if (b.id === selectedBudgetLineId) {
        return {
          ...b,
          committed: b.committed + total,
          available: b.available - total
        };
      }
      return b;
    }));

    // Create a mock document in the DMS automatically linking it
    const docId = `DOC-${Math.floor(Math.random() * 900) + 200}`;
    const newDoc: DMSDocument = {
      id: docId,
      name: `Purchase_Requisition_${prId}.pdf`,
      folder: 'Procurement',
      docType: 'PR',
      referenceId: prId,
      uploadDate: new Date().toISOString().split('T')[0],
      ocrText: `SOS Children Villages Liberia Purchase Requisition. ID: ${prId}. Requester: ${activeUser.name}. Total amount: $${total}. Justification: ${newPRJustification}. Budget Grant: ${line.grantId}.`,
      permissions: {
        view: ['REQUESTOR', 'PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR'],
        edit: ['PROCUREMENT_OFFICER']
      },
      versions: [
        { version: 1, uploadedAt: new Date().toISOString(), uploadedBy: activeUser.name, hash: 'abc12374182cb11ef88ec0242ac13abcdef', changes: 'Initial electronic submission' }
      ],
      retentionExpiry: '2033-05-28',
      isArchived: false
    };
    setDocuments(prev => [newDoc, ...prev]);

    logEvent('CREATE_PR', 'PurchaseRequisition', prId, `Submitted PR for '${newPRDesc}', total amount $${total}.`);
    
    // Reset inputs
    setNewPRDesc('');
    setNewPRQty(1);
    setNewPRPrice(10);
    setNewPRJustification('');
    setBudgetCheckMessage(null);
    setShowNewPRModal(false);
  };

  const submitRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRFQTitle || !newRFQPrId) {
      alert("Please enter a Title and select a Purchase Requisition.");
      return;
    }
    
    const newRFQ: RFx = {
      id: `RFQ-2026-00${rfxList.length + 1}`,
      title: newRFQTitle,
      prId: newRFQPrId,
      category: newRFQCategory,
      closeDate: new Date(newRFQCloseDate).toISOString(),
      status: 'ACTIVE',
      invitedSuppliers: newRFQInvitedSuppliers,
      isReverseAuction: newRFQIsReverseAuction
    };
    
    setRfxList(prev => [...prev, newRFQ]);
    
    // Log audit event
    logEvent('CREATE_RFX_CASE', 'RFx', newRFQ.id, `Procurement Officer Tamba Cooper initiated and dispatched sourcing invitation ${newRFQ.id} - ${newRFQ.title}.`);
    
    // Automatically add a document to the DMS
    const rfqDoc: DMSDocument = {
      id: `DOC-RFQ-${Date.now().toString().slice(-3)}`,
      name: `SOS_Liberia_RFQ_${newRFQ.id.replace(/-/g, '_')}.pdf`,
      folder: 'Procurement',
      docType: 'RFQ',
      referenceId: newRFQ.id,
      uploadDate: new Date().toISOString().split('T')[0],
      amount: 0,
      ocrText: `SOS CHILDREN'S VILLAGES LIBERIA. Request for Quotation (RFQ) - Sourcing Case Reference: ${newRFQ.id}. Title: ${newRFQ.title}. Associated Requisition: ${newRFQ.prId}. Procurement Category: ${newRFQCategory}. Closing Date: ${newRFQCloseDate}. Signed and authorized by Tamba Cooper, Procurement Officer.`,
      permissions: {
        view: ['PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR', 'SUPPLIER'],
        edit: ['PROCUREMENT_OFFICER']
      },
      versions: [{ version: 1, uploadedAt: new Date().toISOString(), uploadedBy: 'Tamba Cooper', hash: '8f7d9e1a2b3c4d5', changes: 'Original RFQ generation' }],
      retentionExpiry: '2033-05-28',
      isArchived: false
    };
    setDocuments(prev => [rfqDoc, ...prev]);

    // Reset fields
    setShowNewRFQModal(false);
    setNewRFQTitle('');
    setNewRFQPrId('');
    setNewRFQInvitedSuppliers([]);
    setNewRFQIsReverseAuction(false);
    
    showToast(`🎉 Sourcing Case ${newRFQ.id} successfully created & dispatched to ${newRFQInvitedSuppliers.length} suppliers!`);
  };

  // PR Approvals Router
  const approvePR = (prId: string) => {
    setRequisitions(prev => prev.map(pr => {
      if (pr.id === prId) {
        let updatedApprovals = [...pr.approvals];
        let nextIndex = updatedApprovals.findIndex(a => a.status === 'PENDING');
        
        if (nextIndex !== -1) {
          updatedApprovals[nextIndex] = {
            ...updatedApprovals[nextIndex],
            status: 'APPROVED',
            date: new Date().toISOString().split('T')[0],
            comments: `Approved by ${activeUser.name} (${activeUser.role}). Verified.`
          };
        }

        // Check if all approvals are complete
        const allApproved = updatedApprovals.every(a => a.status === 'APPROVED' || a.status === 'SKIPPED');
        
        logEvent('APPROVE_PR', 'PurchaseRequisition', prId, `Approved PR approval stage by ${activeUser.name}.`);

        return {
          ...pr,
          approvals: updatedApprovals,
          status: allApproved ? 'APPROVED' : pr.status
        };
      }
      return pr;
    }));
  };

  // Resolve Exception 3-Way Match
  const resolveException = (invoiceId: string) => {
    if (!resolutionComment) {
      alert('Please enter a resolution comment before approving exception bypass.');
      return;
    }

    setMatches(prev => prev.map(m => {
      if (m.invoiceId === invoiceId) {
        return {
          ...m,
          status: 'PASSED',
          exceptionResolved: true,
          resolverName: activeUser.name,
          resolutionComments: resolutionComment
        };
      }
      return m;
    }));

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, status: 'MATCHED' };
      }
      return inv;
    }));

    setResolvedInvoices(prev => [...prev, invoiceId]);
    logEvent('RESOLVE_EXCEPTION', 'MatchResult', invoiceId, `Exception resolved by ${activeUser.name}: ${resolutionComment}`);
    setResolutionComment('');
  };

  // Initiate Mock Bank Adapter Transfer
  const triggerBankTransfer = (invoiceId: string) => {
    // If strict Segregation of Duties is enabled:
    // Tamba Cooper verified GRN and created PO.
    // Helena Cole is processing payment.
    // Ensure Requestor is not doing this.
    if (strictSoD && activeUser.role === 'REQUESTOR') {
      alert('SEGREGATION OF DUTIES VIOLATION: Requestors cannot initiate financial bank payments.');
      return;
    }

    setTransfers(prev => prev.map(trf => {
      if (trf.invoiceId === invoiceId) {
        logEvent('BANK_INITIATE_TRANSFER', 'BankingTransfer', trf.referenceId, `Sent MT103 XML payment initiation block to Ecobank.`);
        return {
          ...trf,
          status: 'PROCESSING'
        };
      }
      return trf;
    }));

    // Simulate async settlement callback
    setTimeout(() => {
      setTransfers(prev => prev.map(trf => {
        if (trf.invoiceId === invoiceId) {
          const bankRefId = `CBK-LR-${Math.floor(Math.random() * 900000) + 100000}`;
          
          // Actualize spend in budget line
          setBudgets(budgetsPrev => budgetsPrev.map(b => {
            if (b.id === 'BL-001') {
              return {
                ...b,
                committed: b.committed - trf.amount,
                actual: b.actual + trf.amount
              };
            }
            return b;
          }));

          // Mark invoice as paid
          setInvoices(invPrev => invPrev.map(inv => {
            if (inv.id === invoiceId) {
              return { ...inv, status: 'PAID' };
            }
            return inv;
          }));

          // Upload automated Payment Voucher doc into DMS
          const paymentDoc: DMSDocument = {
            id: `DOC-VOUCH-${Math.floor(Math.random()*800)+100}`,
            name: `Payment_Reconciliation_Voucher_${trf.referenceId}.pdf`,
            folder: 'Finance',
            docType: 'PAYMENT',
            referenceId: trf.poId,
            amount: trf.amount,
            uploadDate: new Date().toISOString().split('T')[0],
            ocrText: `SOS Children Villages Liberia Payment Voucher. Ref: ${trf.referenceId}. Amount Paid: $${trf.amount}. Bank Reference: ${bankRefId}. Settled via Ecobank to Liberia Enterprise Inc. Reconciled.`,
            permissions: {
              view: ['PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR'],
              edit: []
            },
            versions: [{ version: 1, uploadedAt: new Date().toISOString(), uploadedBy: 'Ecobank API Adapter', hash: 'e556b19472ef', changes: 'System receipt' }],
            retentionExpiry: '2033-05-28',
            isArchived: false
          };
          setDocuments(docPrev => [paymentDoc, ...docPrev]);

          return {
            ...trf,
            status: 'CONFIRMED',
            bankReference: bankRefId,
            reconciledAt: new Date().toISOString()
          };
        }
        return trf;
      }));
    }, 2500);
  };

  // Compile visual One-Click Audit Pack
  const triggerAuditPackGeneration = (prId: string) => {
    setIsGeneratingAuditPack(true);
    setGeneratedAuditPackResult(false);
    
    setTimeout(() => {
      setIsGeneratingAuditPack(false);
      setGeneratedAuditPackResult(true);
      logEvent('EXPORT_AUDIT_PACK', 'AuditPack', prId, `Compiled and downloaded 1-Click Audit Pack bundle containing all associated procurement lifecycle files.`);
    }, 1800);
  };

  // Reverse Auction drop bid helper
  const triggerReverseAuctionDrop = (bidId: string) => {
    setBids(prev => prev.map(bid => {
      if (bid.id === bidId) {
        const droppedPrice = Math.round(bid.totalPrice * 0.95);
        return {
          ...bid,
          totalPrice: droppedPrice,
          notes: `Reverse Auction Bid: Price dropped by 5%! Prev: $${bid.totalPrice}.`
        };
      }
      return bid;
    }));
    logEvent('BID_DROP_AUCTION', 'SupplierBid', bidId, `Supplier bid total price reduced dynamically in reverse-auction simulation.`);
  };

  // Filter documents dynamically for OCR search & role boundaries
  const filteredDocs = documents.filter(doc => {
    // 1. Role boundaries: Suppliers can only see files belonging to them
    if (activeUser.role === 'SUPPLIER') {
      const linked = suppliers.find(s => s.email === activeUser.email || s.id === activeUser.id);
      if (!linked || (doc.supplierName !== linked.name && !doc.permissions.view.includes('SUPPLIER'))) {
        return false;
      }
    }

    // 2. Search filters
    const matchSearch = searchTerm.trim().toLowerCase();
    if (!matchSearch) return true;
    return (
      doc.name.toLowerCase().includes(matchSearch) ||
      doc.ocrText.toLowerCase().includes(matchSearch) ||
      doc.referenceId.toLowerCase().includes(matchSearch) ||
      (doc.supplierName && doc.supplierName.toLowerCase().includes(matchSearch))
    );
  });

  if (isForceResetActive && activeSupplier) {
    const handlePasswordResetSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!tempPassInput || !newPassInput || !confirmPassInput) {
        alert("Please fill in all credential fields.");
        return;
      }
      if (tempPassInput !== (activeSupplier.tempPassword || 'SOS-TEMP')) {
        alert("Incorrect temporary password. Please check your simulated email notification or ask Tamba Cooper to re-issue.");
        return;
      }
      if (newPassInput !== confirmPassInput) {
        alert("New passwords do not match.");
        return;
      }
      if (newPassInput.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }

      // Update supplier status in local suppliers state
      const updatedList = suppliers.map(s => {
        if (s.id === activeSupplier.id) {
          return {
            ...s,
            accountStatus: 'ACTIVE' as const,
            tempPassword: '',
            isTempPasswordActive: false
          };
        }
        return s;
      });
      setSuppliers(updatedList);

      // Save custom ones back to localStorage
      const custom = localStorage.getItem('CUSTOM_SUPPLIERS');
      if (custom) {
        const parsedCustom = JSON.parse(custom);
        const updatedCustom = parsedCustom.map((s: any) => {
          if (s.id === activeSupplier.id) {
            return {
              ...s,
              accountStatus: 'ACTIVE',
              tempPassword: '',
              isTempPasswordActive: false
            };
          }
          return s;
        });
        localStorage.setItem('CUSTOM_SUPPLIERS', JSON.stringify(updatedCustom));
      }

      // Add audit event
      const resetEvent: AuditEvent = {
        id: `AUD-${Date.now().toString().slice(-3)}`,
        userId: activeUser.id,
        userName: activeUser.name,
        userRole: 'SUPPLIER',
        action: 'CONFIRM_REGISTRATION_PWD_RESET',
        entity: 'Supplier',
        entityId: activeSupplier.id,
        timestamp: new Date().toISOString(),
        details: 'Vendor logged in for first time, completed temporary password reset challenge, and activated active portal access.',
        ipAddress: '197.56.241.11'
      };
      setAuditLogs(prev => [resetEvent, ...prev]);

      // Refresh simUsers switcher list
      refreshSimUsers(updatedList);

      alert("🎉 Account Activated Successfully! Welcome to SOS ProcureSphere 360.");
      
      // Reset inputs
      setTempPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
    };

    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(circle at 10% 20%, #1e293b 0%, #0f172a 90%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'var(--font-primary)',
        color: 'white'
      }} className="fade-in">
        <div style={{
          background: 'rgba(30, 41, 59, 0.45)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          width: '460px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          {/* Key Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 90, 156, 0.2)',
            color: 'hsl(var(--sos-blue-light))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            border: '1px solid rgba(0, 90, 156, 0.4)',
            boxShadow: '0 0 20px rgba(0, 90, 156, 0.2)'
          }}>
            <Key size={28} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: 'white', letterSpacing: '-0.5px' }}>
              Confirm Vendor Registration
            </h3>
            <p style={{ fontSize: '12px', color: 'hsl(var(--dark-muted))', lineHeight: '1.6', margin: 0 }}>
              You are logging in to <strong style={{ color: 'hsl(var(--sos-blue-light))' }}>{activeSupplier.name}</strong> for the first time. To activate your secure bidding space, you must replace your temporary password.
            </p>
          </div>

          <form onSubmit={handlePasswordResetSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--dark-muted))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Temporary Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password"
                  required
                  placeholder="e.g. SOS-TEMP-XXXX"
                  value={tempPassInput}
                  onChange={(e) => setTempPassInput(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--dark-border))',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock size={14} style={{ position: 'absolute', left: '14px', top: '13px', color: 'hsl(var(--dark-muted))' }} />
              </div>
              <span style={{ fontSize: '9px', color: 'hsl(var(--sos-gold))', fontWeight: 600 }}>
                Tip: Your temporary credentials are: <strong>{activeSupplier.tempPassword || 'SOS-TEMP'}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--dark-muted))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                New Permanent Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--dark-border))',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock size={14} style={{ position: 'absolute', left: '14px', top: '13px', color: 'hsl(var(--dark-muted))' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--dark-muted))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Confirm New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  style={{
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--dark-border))',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
                <Lock size={14} style={{ position: 'absolute', left: '14px', top: '13px', color: 'hsl(var(--dark-muted))' }} />
              </div>
            </div>

            <button 
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px'
              }}
            >
              Activate Account & Enter Portal
            </button>

            <button 
              type="button"
              onClick={onExit}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'hsl(var(--dark-muted))',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '8px'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'white'}
              onMouseOut={(e) => e.currentTarget.style.color = 'hsl(var(--dark-muted))'}
            >
              ← Cancel & Log Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Panel */}
      <aside className="sidebar">
        {/* Branding header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid hsl(var(--dark-border))',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <img src="/logo.jpg" alt="SOS Children's Villages Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', color: 'white', letterSpacing: '-0.3px' }}>ProcureSphere</h2>
            <span style={{ fontSize: '10px', color: 'hsl(var(--dark-muted))', fontWeight: 600 }}>Liberia Control</span>
          </div>
        </div>

        {/* User context widget */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid hsl(var(--dark-border))',
          backgroundColor: 'rgba(255,255,255,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid hsl(var(--sos-blue))' }} 
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{activeUser.name}</div>
              <div style={{ fontSize: '10px', color: 'hsl(var(--sos-gold))', fontWeight: 600 }}>{activeUser.role}</div>
            </div>
          </div>
          <div style={{ fontSize: '10px', color: 'hsl(var(--dark-muted))' }}>
            Dept: {activeUser.department} | {activeUser.location.split(' ')[0]}
          </div>

          {/* Quick role change directly on dashboard */}
          <select 
            value={activeUser.id} 
            onChange={(e) => {
              const u = simUsers.find(usr => usr.id === e.target.value);
              if (u) {
                onSwitchUser(u);
                logEvent('SWITCH_USER_PROFILE', 'User', u.id, `Simulated profile switched to ${u.name} (${u.role}).`);
              }
            }}
            style={{
              marginTop: '4px',
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid hsl(var(--dark-border))',
              backgroundColor: 'hsl(var(--dark-card))',
              color: 'white',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {simUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>

        {/* Navigation Sidebar Tabs */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {activeUser.role === 'SUPPLIER' ? (
            <>
              <button 
                onClick={() => setActiveTab('analytics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'analytics' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'analytics' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ShieldCheck size={18} /> Compliance Center
              </button>

              <button 
                onClick={() => setActiveTab('rfx')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'rfx' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'rfx' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ShoppingBag size={18} /> RFP Bid Portal
              </button>

              <button 
                onClick={() => setActiveTab('dms')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'dms' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'dms' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FolderLock size={18} /> My Document Dossier
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('analytics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'analytics' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'analytics' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <LayoutDashboard size={18} /> Spend Analytics
              </button>

              <button 
                onClick={() => setActiveTab('pr')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'pr' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'pr' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FileCheck size={18} /> Purchase Requisitions
              </button>

              <button 
                onClick={() => setActiveTab('rfx')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'rfx' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'rfx' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ShoppingBag size={18} /> Sourcing & Bids (RFx)
              </button>

              <button 
                onClick={() => setActiveTab('matching')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'matching' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'matching' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Layers size={18} /> Invoicing & 3-Way Match
              </button>

              <button 
                onClick={() => setActiveTab('dms')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'dms' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'dms' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FolderLock size={18} /> Document Vault (DMS)
              </button>

              <button 
                onClick={() => setActiveTab('finance')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'finance' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'finance' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Coins size={18} /> Banking Adapter Layer
              </button>

              <button 
                onClick={() => setActiveTab('health')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'health' ? 'hsl(var(--sos-blue))' : 'transparent',
                  color: activeTab === 'health' ? 'white' : 'hsl(var(--dark-muted))',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Activity size={18} /> System Observability
              </button>
            </>
          )}
        </nav>

        {/* Settings Engine Panel on Sidebar footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid hsl(var(--dark-border))',
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'hsl(var(--dark-muted))', fontWeight: 700 }}>
            <Sliders size={12} /> GLOBAL SYSTEM POLICIES
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'white', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={strictSoD} 
              onChange={() => {
                setStrictSoD(!strictSoD);
                logEvent('TOGGLE_POLICY', 'System', 'SoD_Policy', `Strict Segregation of Duties toggle set to ${!strictSoD}`);
              }}
              style={{ cursor: 'pointer' }}
            />
            Block Same-Person SoD
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'hsl(var(--dark-muted))' }}>RFQ Quote Threshold:</span>
            <select 
              value={quoteRuleThreshold} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setQuoteRuleThreshold(val);
                logEvent('CHANGE_POLICY', 'System', 'RFQ_Threshold', `RFQ policy limit adjusted to $${val}.`);
              }}
              style={{
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: 'hsl(var(--dark-card))',
                border: '1px solid hsl(var(--dark-border))',
                color: 'white',
                fontSize: '11px'
              }}
            >
              <option value={1000}>$1,000 USD</option>
              <option value={3000}>$3,000 USD</option>
              <option value={5000}>$5,000 USD</option>
              <option value={10000}>$10,000 USD</option>
            </select>
          </div>
        </div>

        {/* Back to landing screen */}
        <button 
          onClick={onExit}
          style={{
            padding: '16px',
            border: 'none',
            borderTop: '1px solid hsl(var(--dark-border))',
            backgroundColor: '#020617',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Exit to Landing Page
        </button>
      </aside>

      {/* Main Panel Canvas Area */}
      <main className="main-content">
        
        {/* TABS CONTAINER */}

        {/* 1. SPEND ANALYTICS WORKSPACE */}
        {activeTab === 'analytics' && activeUser.role === 'SUPPLIER' && activeSupplier ? (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>Vendor Compliance Center</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Maintain your pre-qualification credentials and compliance ratings.</p>
              </div>
              <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: 'hsl(var(--sos-blue))', backgroundColor: 'white' }}>
                Account Roster: {activeSupplier.id}
              </div>
            </div>

            {/* Warning banner logic */}
            {activeSupplier.isBlacklisted ? (
              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderLeft: '5px solid #ef4444',
                borderRadius: '8px',
                color: '#991b1b',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 800 }}>⚠️ CRITICAL ACCOUNT DEBARMENT</h4>
                This supplier account has been blacklisted by SOS Children's Villages Liberia. 
                <br /><strong>Reason:</strong> {activeSupplier.blacklistReason}
                <br /><small>Date logged: {activeSupplier.blacklistDate}. Please contact the Country Directorate for recourse.</small>
              </div>
            ) : (() => {
              const today = new Date("2026-05-28");
              const expiringDoc = activeSupplier.documents.find(d => {
                const exp = new Date(d.expiryDate);
                const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
                return days >= 0 && days <= 30;
              });
              
              if (expiringDoc) {
                const exp = new Date(expiringDoc.expiryDate);
                const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
                return (
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                    borderLeft: '5px solid hsl(var(--sos-gold))',
                    borderRadius: '8px',
                    color: '#92400e',
                    fontSize: '13.5px',
                    lineHeight: '1.5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }} className="pulse-warning">
                    <div>
                      <strong>⚠️ ACTION REQUIRED: Document Expiring Soon!</strong>
                      <br />Your document <strong>{expiringDoc.name}</strong> will expire in <strong>{days} days</strong> (on {expiringDoc.expiryDate}). Please upload an updated certificate to remain eligible for electronic RFPs.
                    </div>
                    <button 
                      onClick={() => {
                        setRenewingDocName(expiringDoc.name);
                        setIsRenewModalOpen(true);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12px', whiteSpace: 'nowrap' }}
                    >
                      Renew Credentials
                    </button>
                  </div>
                );
              }
              return null;
            })()}

            {/* Compliance Scores Widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Overall Compliance</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
                  <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{activeSupplier.complianceRating ? activeSupplier.complianceRating * 20 : 100}%</h3>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>Active status</span>
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Quality Score</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#0f172a' }}>{activeSupplier.qualityRating || 5.0} / 5.0</h3>
              </div>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Delivery Timeliness</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#0f172a' }}>{activeSupplier.deliveryTimeRating || 5.0} / 5.0</h3>
              </div>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>General Rating</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#0f172a' }}>{activeSupplier.rating || 5.0} / 5.0</h3>
              </div>
            </div>

            {/* Document Roster Dossier Grid */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Pre-qualification Due Diligence Documents
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TIN Verified: {activeSupplier.taxId}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeSupplier.documents.map((d, index) => {
                  const today = new Date("2026-05-28");
                  const exp = new Date(d.expiryDate);
                  const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  
                  let badgeColor = '#16a34a';
                  let bgBadge = '#dcfce7';
                  let statusText = 'VALID';
                  
                  if (days < 0) {
                    badgeColor = '#ef4444';
                    bgBadge = '#fee2e2';
                    statusText = 'EXPIRED';
                  } else if (days <= 30) {
                    badgeColor = '#d97706';
                    bgBadge = '#fef3c7';
                    statusText = `EXPIRING IN ${days} DAYS`;
                  }

                  return (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.2s'
                    }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0, 90, 156, 0.08)',
                          color: 'hsl(var(--sos-blue))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FileText size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>{d.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>Expires on: <strong>{d.expiryDate}</strong></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: bgBadge,
                          color: badgeColor,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          letterSpacing: '0.5px'
                        }}>
                          {statusText}
                        </span>
                        <button 
                          onClick={() => {
                            setRenewingDocName(d.name);
                            setIsRenewModalOpen(true);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', background: 'white' }}
                        >
                          Renew / Upload
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>Spend & Budget Dashboard</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Real-time indicators across grants, donors, and locations.</p>
              </div>
              <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: 'hsl(var(--sos-blue))', backgroundColor: 'white' }}>
                Active Program Year: 2026
              </div>
            </div>

            {/* Visual Spend Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {/* Box 1 */}
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Total Requisitioned</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#0f172a' }}>$33,000</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '8px' }}>
                  <TrendingUp size={12} /> Committed Funds active
                </div>
              </div>

              {/* Box 2 */}
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>USAID Grant Utilization</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#0f172a' }}>66.6%</h3>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '14px', overflow: 'hidden' }}>
                  <div style={{ width: '66.6%', height: '100%', backgroundColor: 'hsl(var(--sos-blue))' }} />
                </div>
              </div>

              {/* Box 3 */}
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Policy Compliance Level</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#0f172a' }}>100%</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '8px' }}>
                  <Check size={12} /> Double-signature verification
                </div>
              </div>

              {/* Box 4 */}
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Active Sourcing Cycles</span>
                <h3 style={{ fontSize: '32px', fontWeight: 800, marginTop: '8px', color: '#0f172a' }}>2 RFQs</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginTop: '8px' }}>
                  1 textbooks / 1 laptops
                </div>
              </div>
            </div>

            {/* Grant Budgets ledger table */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DollarSign size={20} style={{ color: 'hsl(var(--sos-blue))' }} /> Live Donor Grant Allocations (Liberia Office)
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                    <th style={{ padding: '12px 16px' }}>GRANT CODE</th>
                    <th style={{ padding: '12px 16px' }}>GRANT NAME</th>
                    <th style={{ padding: '12px 16px' }}>DONOR</th>
                    <th style={{ padding: '12px 16px' }}>ALLOCATED</th>
                    <th style={{ padding: '12px 16px' }}>COMMITTED (PR)</th>
                    <th style={{ padding: '12px 16px' }}>SPENT ACTUAL</th>
                    <th style={{ padding: '12px 16px' }}>REMAINING AVAILABLE</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                      <td style={{ padding: '16px', fontWeight: 700, color: 'hsl(var(--sos-blue))' }}>{b.grantId}</td>
                      <td style={{ padding: '16px', color: '#334155' }}>{b.grantName}</td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{b.donor}</td>
                      <td style={{ padding: '16px', fontWeight: 700 }}>${b.allocated.toLocaleString()}</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>${b.committed.toLocaleString()}</td>
                      <td style={{ padding: '16px', color: '#16a34a', fontWeight: 600 }}>${b.actual.toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: b.available < 25000 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                          color: b.available < 25000 ? '#dc2626' : '#16a34a'
                        }}>
                          ${b.available.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Spend Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>Spend Allocation by Category (YTD)</h4>
                
                {/* Visual SVG chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>Educational Materials</span>
                      <span style={{ fontWeight: 700 }}>$12,000 USD (36%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '36%', height: '100%', backgroundColor: 'hsl(var(--sos-blue))' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>IT Equipment</span>
                      <span style={{ fontWeight: 700 }}>$15,000 USD (45%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45%', height: '100%', backgroundColor: 'hsl(var(--sos-gold))' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>Medical & Support</span>
                      <span style={{ fontWeight: 700 }}>$6,000 USD (19%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '19%', height: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrity Shield Indicator Card */}
              <div className="glass-panel" style={{ 
                padding: '30px', 
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(0, 90, 156, 0.1)',
                  color: 'hsl(var(--sos-blue))',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} className="pulse-glow">
                  <Fingerprint size={32} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Immutable Ledger active</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    All logs are signed with cryptographic SHA-256 seals, preventing retroactive revisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* 2. PURCHASE REQUISITIONS (PR) WORKSPACE */}
        {activeTab === 'pr' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>Purchase Requisition Registry</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Draft, review, check grant budgets, and approve requests.</p>
              </div>

              {/* Role restriction on creating a PR */}
              <button 
                onClick={() => {
                  if (activeUser.role !== 'REQUESTOR' && activeUser.role !== 'PROCUREMENT_OFFICER') {
                    alert(`ACCESS BLOCK: Only Staff roles 'REQUESTOR' or 'PROCUREMENT_OFFICER' are permitted to create requisitions.`);
                    return;
                  }
                  setShowNewPRModal(true);
                }}
                className="btn btn-primary"
              >
                <Plus size={18} /> Create Requisition
              </button>
            </div>

            {/* BUDGET CHECK MODAL INLINE DISPLAY */}
            {showNewPRModal && (
              <div className="glass-panel" style={{
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '20px',
                border: '2px solid hsl(var(--sos-blue))'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>New Electronic Purchase Requisition (PR)</h3>
                  <button onClick={() => setShowNewPRModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={submitPR} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Item / Service Description</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="e.g. Primary School Math Textbooks" 
                        value={newPRDesc}
                        onChange={(e) => setNewPRDesc(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input 
                          type="number" 
                          required 
                          min={1} 
                          className="form-control" 
                          value={newPRQty}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setNewPRQty(val);
                            handleBudgetCheck(val * newPRPrice, selectedBudgetLineId);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Est. Unit Price (USD)</label>
                        <input 
                          type="number" 
                          required 
                          min={1} 
                          className="form-control" 
                          value={newPRPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setNewPRPrice(val);
                            handleBudgetCheck(newPRQty * val, selectedBudgetLineId);
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Detailed Justification</label>
                      <textarea 
                        required 
                        rows={3} 
                        className="form-control" 
                        placeholder="State why this procurement is necessary..." 
                        value={newPRJustification}
                        onChange={(e) => setNewPRJustification(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Select Grant Funding & Location</label>
                      <select 
                        className="form-control"
                        value={selectedBudgetLineId}
                        onChange={(e) => {
                          setSelectedBudgetLineId(e.target.value);
                          handleBudgetCheck(newPRQty * newPRPrice, e.target.value);
                        }}
                      >
                        {budgets.map(b => (
                          <option key={b.id} value={b.id}>{b.grantId} - {b.department} ({b.location.split(' ')[0]})</option>
                        ))}
                      </select>
                    </div>

                    {/* LIVE COMMITMENT CONTROL WIDGET */}
                    <div style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>REAL-TIME COMMITMENT CONTROL CHECK:</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span>Requisition Amount:</span>
                        <span style={{ fontWeight: 700 }}>${(newPRQty * newPRPrice).toLocaleString()} USD</span>
                      </div>

                      {budgetCheckMessage ? (
                        <div style={{
                          marginTop: '10px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: budgetCheckMessage.status === 'BLOCKED' ? 'rgba(239,68,68,0.1)' : budgetCheckMessage.status === 'WARN' ? 'rgba(217,119,6,0.1)' : 'rgba(22,163,74,0.1)',
                          color: budgetCheckMessage.status === 'BLOCKED' ? '#dc2626' : budgetCheckMessage.status === 'WARN' ? '#d97706' : '#16a34a',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <AlertTriangle size={14} /> {budgetCheckMessage.text}
                        </div>
                      ) : (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Enter quantity & price to run live budget simulator.</div>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button type="button" onClick={() => setShowNewPRModal(false)} className="btn btn-secondary">Cancel</button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={budgetCheckMessage?.status === 'BLOCKED'}
                      >
                        Submit Requisition
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* List of Requisitions */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Active Requisitions Registry</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {requisitions.map(pr => {
                  const currentPendingApprovalIndex = pr.approvals.findIndex(a => a.status === 'PENDING');
                  const currentPendingRole = currentPendingApprovalIndex !== -1 ? pr.approvals[currentPendingApprovalIndex].role : null;
                  const canUserApprove = currentPendingRole === activeUser.role && pr.status === 'PENDING_APPROVAL';

                  return (
                    <div key={pr.id} style={{
                      padding: '24px',
                      borderRadius: '14px',
                      border: `1px solid var(--border-color)`,
                      backgroundColor: 'white',
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr 1fr',
                      gap: '20px',
                      alignItems: 'center'
                    }}>
                      {/* Left: Requisition Details */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>{pr.id}</span>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: pr.status === 'APPROVED' ? 'rgba(22, 163, 74, 0.1)' : pr.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                            color: pr.status === 'APPROVED' ? '#16a34a' : pr.status === 'REJECTED' ? '#dc2626' : '#d97706'
                          }}>
                            {pr.status}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 4px', color: '#0f172a' }}>
                          {pr.items[0]?.description}
                        </h4>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          <span>Requester: <strong>{pr.requesterName}</strong></span>
                          <span>Grant: <strong>{pr.grantId}</strong></span>
                          <span>Location: <strong>{pr.location.split(' ')[0]}</strong></span>
                        </div>
                      </div>

                      {/* Middle: Live Approval flow step visualizer */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Approval Pathway:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {pr.approvals.map((app, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 800,
                                backgroundColor: app.status === 'APPROVED' ? '#16a34a' : app.status === 'REJECTED' ? '#dc2626' : app.status === 'PENDING' ? '#d97706' : '#94a3b8',
                                color: 'white'
                              }} title={`${app.role}: ${app.status} (${app.comments || 'No comments'})`}>
                                {i + 1}
                              </div>
                              {i < pr.approvals.length - 1 && <span style={{ color: '#cbd5e1', fontSize: '10px' }}>→</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                          ${pr.totalAmount.toLocaleString()} USD
                        </div>

                        {canUserApprove ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              onClick={() => approvePR(pr.id)}
                              className="btn btn-primary"
                              style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', backgroundColor: '#16a34a', boxShadow: 'none' }}
                            >
                              <Check size={12} /> Approve
                            </button>
                            <button 
                              onClick={() => {
                                setRequisitions(prev => prev.map(req => {
                                  if (req.id === pr.id) {
                                    logEvent('REJECT_PR', 'PurchaseRequisition', pr.id, `PR rejected by ${activeUser.name}.`);
                                    return { ...req, status: 'REJECTED' };
                                  }
                                  return req;
                                }));
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', border: '1px solid #dc2626', color: '#dc2626' }}
                            >
                              <X size={12} /> Reject
                            </button>
                          </div>
                        ) : pr.status === 'PENDING_APPROVAL' ? (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Awaiting {currentPendingRole}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. E-SOURCING & RFX WORKSPACE */}
        {activeTab === 'rfx' && activeUser.role === 'SUPPLIER' && activeSupplier ? (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>RFP Bid Participation Portal</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Review invited Request for Proposals (RFP) and submit secure, sealed bids.</p>
              </div>
              <div className="glass-panel" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700, color: 'hsl(var(--sos-blue))', backgroundColor: 'white' }}>
                Secure Bid Workspace
              </div>
            </div>

            {/* Check if any document is expired */}
            {(() => {
              const today = new Date("2026-05-28");
              const hasExpiredDoc = activeSupplier.documents.some(d => {
                const exp = new Date(d.expiryDate);
                return exp < today;
              });
              if (hasExpiredDoc) {
                return (
                  <div style={{
                    padding: '16px 20px',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    borderLeft: '5px solid #ef4444',
                    borderRadius: '8px',
                    color: '#991b1b',
                    fontSize: '13.5px',
                    lineHeight: '1.5'
                  }}>
                    <strong>❌ BIDDING BARRED: Expired Compliance Credentials</strong>
                    <br />Your pre-qualification status is suspended because one or more of your required due diligence documents has expired. You are blocked from bidding on any RFPs until you upload updated certificates in the **Compliance Center**.
                  </div>
                );
              }
              return null;
            })()}

            {/* Bidding workspace */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
              
              {/* Left Column: RFP list & Bidding Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                    Open Sourcing Invitations
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {rfxList.filter(r => r.invitedSuppliers.includes(activeSupplier.id) || r.category === activeSupplier.category).map((r, i) => {
                      const isClosingSoon = new Date(r.closeDate) > new Date("2026-05-28");
                      const hasSubmitted = bids.some(b => b.rfxId === r.id && b.supplierId === activeSupplier.id);
                      
                      return (
                        <div key={i} style={{
                          padding: '16px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          background: supplierRfxSelect === r.id ? 'rgba(0,90,156,0.02)' : 'white',
                          borderLeft: supplierRfxSelect === r.id ? '4px solid hsl(var(--sos-blue))' : '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }} onClick={() => {
                          if (!hasSubmitted) {
                            setSupplierRfxSelect(r.id);
                          }
                        }}>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>{r.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              Ref: {r.id} | Category: <strong>{r.category}</strong>
                            </div>
                            <div style={{ fontSize: '11px', color: isClosingSoon ? '#b45309' : '#64748b', marginTop: '2px' }}>
                              Closes: {new Date(r.closeDate).toLocaleString()}
                            </div>
                          </div>
                          
                          <div>
                            {hasSubmitted ? (
                              <span style={{ fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                                ✓ Bid Sealed & Submitted
                              </span>
                            ) : (
                              <span style={{ fontSize: '10px', background: supplierRfxSelect === r.id ? 'rgba(0,90,156,0.1)' : '#f1f5f9', color: supplierRfxSelect === r.id ? 'hsl(var(--sos-blue))' : '#475569', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                                {supplierRfxSelect === r.id ? 'Selected for Bid' : 'Click to Select'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Secure Bid Submission Form */}
                {(() => {
                  const today = new Date("2026-05-28");
                  const hasExpiredDoc = activeSupplier.documents.some(d => new Date(d.expiryDate) < today);
                  const selectedRfx = rfxList.find(r => r.id === supplierRfxSelect);
                  const hasSubmitted = bids.some(b => b.rfxId === supplierRfxSelect && b.supplierId === activeSupplier.id);
                  
                  if (hasExpiredDoc || !selectedRfx || hasSubmitted) return null;
                  
                  const handleSupplierBidSubmit = (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!supplierBidPrice || !supplierBidLeadTime) {
                      alert("Please fill in price and lead time fields.");
                      return;
                    }
                    
                    const newBid: SupplierBid = {
                      id: `BID-${Date.now().toString().slice(-3)}`,
                      rfxId: supplierRfxSelect,
                      supplierId: activeSupplier.id,
                      supplierName: activeSupplier.name,
                      submissionTime: new Date().toISOString(),
                      items: [
                        { itemDescription: selectedRfx.title, qty: 10, unitPrice: Math.round(supplierBidPrice / 10) }
                      ],
                      totalPrice: supplierBidPrice,
                      leadTimeDays: supplierBidLeadTime,
                      warrantyMonths: supplierBidWarranty,
                      technicalCompliance: true,
                      notes: supplierBidNotes,
                      status: 'PENDING'
                    };
                    
                    setBids(prev => [newBid, ...prev]);
                    
                    // Log audit event
                    const bidEvent: AuditEvent = {
                      id: `AUD-${Date.now().toString().slice(-3)}`,
                      userId: activeUser.id,
                      userName: activeUser.name,
                      userRole: 'SUPPLIER',
                      action: 'SUBMIT_SEALED_PROPOSAL_BID',
                      entity: 'SupplierBid',
                      entityId: newBid.id,
                      timestamp: new Date().toISOString(),
                      details: `Supplier submitted a secure sealed proposal for contract ${supplierRfxSelect} with total bid amount of $${supplierBidPrice.toLocaleString()}.`,
                      ipAddress: '197.56.241.11'
                    };
                    setAuditLogs(prev => [bidEvent, ...prev]);

                    // Add document to DMS
                    const bidDoc: DMSDocument = {
                      id: `DOC-BID-${Date.now().toString().slice(-3)}`,
                      name: `Supplier_Bid_${activeSupplier.name.replace(/\s+/g, '_')}_${newBid.id}.pdf`,
                      folder: 'Procurement',
                      docType: 'BID',
                      referenceId: supplierRfxSelect,
                      supplierName: activeSupplier.name,
                      uploadDate: new Date().toISOString().split('T')[0],
                      amount: supplierBidPrice,
                      ocrText: `SUPPLIER RFP PROPOSAL. Reference RFP: ${supplierRfxSelect}. Bidder: ${activeSupplier.name}. Legal Representative: ${activeSupplier.contactName}. Total Financial Bid: $${supplierBidPrice}. Warranty Offered: ${supplierBidWarranty} months. Lead time: ${supplierBidLeadTime} days. Signed and cryptographically sealed under SHA-256 hash.`,
                      permissions: {
                        view: ['PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR'],
                        edit: []
                      },
                      versions: [{ version: 1, uploadedAt: new Date().toISOString(), uploadedBy: activeSupplier.contactName, hash: '7c9e018a4cdb11', changes: 'Sealed proposal submit' }],
                      retentionExpiry: '2033-05-28',
                      isArchived: false
                    };
                    setDocuments(prev => [bidDoc, ...prev]);

                    showToast("🎉 Sealed Bid Proposal Submitted & Cryptographically Sealed!");
                  };

                  return (
                    <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                        Submit Secure Proposal Bid
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target RFP: <strong>{selectedRfx.title} ({selectedRfx.id})</strong></span>
                      
                      <form onSubmit={handleSupplierBidSubmit} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Total Financial Bid Amount ($ USD) *</label>
                            <input 
                              type="number"
                              required
                              value={supplierBidPrice}
                              onChange={(e) => setSupplierBidPrice(Number(e.target.value))}
                              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Lead Time (Days to Deliver) *</label>
                            <input 
                              type="number"
                              required
                              value={supplierBidLeadTime}
                              onChange={(e) => setSupplierBidLeadTime(Number(e.target.value))}
                              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Warranty Period (Months)</label>
                          <input 
                            type="number"
                            value={supplierBidWarranty}
                            onChange={(e) => setSupplierBidWarranty(Number(e.target.value))}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Additional Bid Commentary</label>
                          <textarea 
                            rows={3}
                            value={supplierBidNotes}
                            onChange={(e) => setSupplierBidNotes(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '12px', outline: 'none', fontFamily: 'inherit' }}
                          />
                        </div>

                        <div style={{
                          padding: '10px 14px',
                          backgroundColor: 'rgba(22, 163, 74, 0.04)',
                          border: '1px solid rgba(22, 163, 74, 0.2)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: '#166534',
                          lineHeight: '1.4',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <Fingerprint size={16} />
                          <span>This bid is secured via SHA-256 seal. Once submitted, it remains encrypted and locked from SOS viewing until the RFP close date.</span>
                        </div>

                        <button 
                          type="submit"
                          className="btn btn-primary"
                          style={{ padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, marginTop: '5px' }}
                        >
                          Submit Cryptographically Sealed Proposal
                        </button>
                      </form>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Bid Submission History & Status */}
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                  Submitted Bids History
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {bids.filter(b => b.supplierId === activeSupplier.id).map((b, i) => {
                    let badgeBg = '#f1f5f9';
                    let badgeColor = '#475569';
                    if (b.status === 'AWARDED') {
                      badgeBg = '#dcfce7';
                      badgeColor = '#16a34a';
                    } else if (b.status === 'SHORTLISTED') {
                      badgeBg = '#dbeafe';
                      badgeColor = '#2563eb';
                    } else if (b.status === 'REJECTED') {
                      badgeBg = '#fee2e2';
                      badgeColor = '#ef4444';
                    }

                    return (
                      <div key={i} style={{
                        padding: '14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>Bid Ref: {b.id}</span>
                          <span style={{ fontSize: '9px', fontWeight: 800, background: badgeBg, color: badgeColor, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                            {b.status}
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: '#64748b' }}>
                          <div>RFP Ref: <strong>{b.rfxId}</strong></div>
                          <div>Total Bid Value: <strong style={{ color: '#0f172a' }}>${b.totalPrice.toLocaleString()}</strong></div>
                          <div>Lead Time: <strong>{b.leadTimeDays} days</strong></div>
                          <div>Warranty: <strong>{b.warrantyMonths} months</strong></div>
                        </div>

                        {b.notes && (
                          <div style={{ fontSize: '10.5px', color: '#475569', background: 'white', padding: '8px', borderRadius: '4px', border: '1px dashed #e2e8f0' }}>
                            {b.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        ) : activeTab === 'rfx' ? (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>E-Sourcing & Quotation Matrix (RFx)</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Analyze supplier bids side-by-side using quote comparison sheets.</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {activeUser.role === 'PROCUREMENT_OFFICER' && (
                  <button 
                    onClick={() => setShowNewRFQModal(true)}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Plus size={18} /> Create RFQ / RFP
                  </button>
                )}

                {/* Auction Switcher */}
                <div className="glass-panel" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'white' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Reverse E-Auction Module:</span>
                  <button 
                    onClick={() => {
                      setReverseAuctionEnabled(!reverseAuctionEnabled);
                      logEvent('TOGGLE_AUCTION', 'System', 'ReverseAuction', `Reverse auction simulation state toggled to ${!reverseAuctionEnabled}`);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: reverseAuctionEnabled ? '#16a34a' : '#94a3b8',
                      color: 'white',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    {reverseAuctionEnabled ? 'ON / ACTIVE' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIVE SOURCING TENDERS & RFX DOSSIERS */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} style={{ color: 'hsl(var(--sos-blue))' }} /> Active Sourcing Tenders & RFx Dossiers
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rfxList.map(rfx => (
                  <div key={rfx.id} style={{
                    padding: '16px 20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }} className="scale-hover">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontSize: '14.5px', color: '#1e293b' }}>{rfx.title}</strong>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: rfx.status === 'AWARDED' ? '#dcfce7' : rfx.status === 'ACTIVE' ? '#e0f2fe' : '#fee2e2',
                          color: rfx.status === 'AWARDED' ? '#16a34a' : rfx.status === 'ACTIVE' ? '#0369a1' : '#ef4444',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.5px'
                        }}>
                          {rfx.status}
                        </span>
                        {rfx.isReverseAuction && (
                          <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '4px' }}>
                            ⚡ REVERSE AUCTION
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        RFQ Ref: <strong>{rfx.id}</strong> | Requisition: <strong>{rfx.prId}</strong> | Sourcing Category: <strong>{rfx.category}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                      <div>Deadline: <strong>{new Date(rfx.closeDate).toLocaleDateString()}</strong></div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>Invited Suppliers: {rfx.invitedSuppliers.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUOTE COMPARISON MATRIX */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders size={20} style={{ color: 'hsl(var(--sos-blue))' }} /> Sealed Quote Comparison Matrix - RFQ-2026-001 (Textbooks & Uniforms)
              </h3>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                    <th style={{ padding: '12px' }}>RFQ ITEMS</th>
                    <th style={{ padding: '12px' }}>QTY</th>
                    <th style={{ padding: '12px', color: 'hsl(var(--sos-blue))', fontWeight: 700 }}>SUPPLIER A: Liberia Enterprise Inc.</th>
                    <th style={{ padding: '12px', color: '#9333ea', fontWeight: 700 }}>SUPPLIER B: Monrovia Tech Hub Ltd</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>1. Textbooks Math/Science Package</td>
                    <td style={{ padding: '16px' }}>1 Pack</td>
                    <td style={{ padding: '16px', color: '#16a34a', fontWeight: 700 }}>$420.00 <span style={{ fontSize: '11px', color: '#16a34a' }}>(Lowest)</span></td>
                    <td style={{ padding: '16px', color: '#ef4444' }}>$500.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>2. Custom SOS School Uniforms</td>
                    <td style={{ padding: '16px' }}>30 Units</td>
                    <td style={{ padding: '16px', color: '#16a34a', fontWeight: 700 }}>$24.00 <span style={{ fontSize: '11px', color: '#16a34a' }}>($720 total)</span></td>
                    <td style={{ padding: '16px', color: '#ef4444' }}>$30.00 <span style={{ fontSize: '11px', color: '#ef4444' }}>($900 total)</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>3. Stationery Accessory Packs</td>
                    <td style={{ padding: '16px' }}>30 Packs</td>
                    <td style={{ padding: '16px', color: '#16a34a', fontWeight: 700 }}>$9.50 <span style={{ fontSize: '11px', color: '#16a34a' }}>($285 total)</span></td>
                    <td style={{ padding: '16px', color: '#ef4444' }}>$12.00 <span style={{ fontSize: '11px', color: '#ef4444' }}>($360 total)</span></td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', fontSize: '14px', backgroundColor: '#f8fafc', fontWeight: 800 }}>
                    <td style={{ padding: '16px' }}>GRAND TOTAL BID AMOUNT</td>
                    <td style={{ padding: '16px' }}>-</td>
                    <td style={{ padding: '16px', color: '#16a34a' }}>$1,425.00 USD</td>
                    <td style={{ padding: '16px', color: '#ef4444' }}>$1,760.00 USD</td>
                  </tr>
                  <tr style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>Lead Time / Delivery Speed</td>
                    <td style={{ padding: '16px' }}>-</td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#334155' }}>5 Days</td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#334155' }}>8 Days</td>
                  </tr>
                  <tr style={{ fontSize: '13px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>Technical Compliance check</td>
                    <td style={{ padding: '16px' }}>-</td>
                    <td style={{ padding: '16px', color: '#16a34a', fontWeight: 700 }}>PASSED (Valid Tax/Licences)</td>
                    <td style={{ padding: '16px', color: '#16a34a', fontWeight: 700 }}>PASSED</td>
                  </tr>
                  <tr style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>Committee Evaluation Rating</td>
                    <td style={{ padding: '16px' }}>-</td>
                    <td style={{ padding: '16px', fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>95 / 100 (Award Recommendation)</td>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#64748b' }}>82 / 100</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Reverse Auction Active simulation block */}
            {reverseAuctionEnabled && (
              <div className="glass-panel" style={{
                padding: '30px',
                backgroundColor: 'rgba(255, 204, 0, 0.05)',
                border: '1px dashed hsl(var(--sos-gold))',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444'
                  }} className="pulse-glow" />
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#d97706' }}>LIVE REVERSE AUCTION SANDBOX (RFQ-2026-002 Laptops)</h4>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Suppliers are modifying bids in real-time. Direct them to drop values by 5% increments to test evaluation.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {bids.filter(b => b.rfxId === 'RFQ-2026-002').map(b => (
                    <div key={b.id} style={{
                      padding: '20px',
                      borderRadius: '10px',
                      backgroundColor: 'white',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{b.supplierName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{b.notes}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>${b.totalPrice.toLocaleString()}</div>
                        <button 
                          onClick={() => triggerReverseAuctionDrop(b.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px' }}
                        >
                          Trigger Price Drop (5%)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VENDOR ROSTER & PRE-QUALIFICATION COMPLIANCE SECTION */}
            {activeUser.role === 'PROCUREMENT_OFFICER' && (
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      SOS Pre-qualified Vendor Compliance Ledger
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0 0' }}>
                      Enforce strict due diligence checks on Liberian contractors. Expiration scan checks are automated.
                    </p>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'hsl(var(--sos-blue))' }}>
                    Compliance Health: {Math.round(suppliers.filter(s => !s.documents.some(d => new Date(d.expiryDate) < new Date("2026-05-28"))).length / suppliers.length * 100)}% Verified
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {suppliers.map((s, index) => {
                    const today = new Date("2026-05-28");
                    const hasExpiredDoc = s.documents.some(d => new Date(d.expiryDate) < today);
                    const expiringDoc = s.documents.find(d => {
                      const exp = new Date(d.expiryDate);
                      const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
                      return days >= 0 && days <= 30;
                    });

                    let statusBadge = (
                      <span style={{ fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        ✓ COMPLIANT
                      </span>
                    );
                    
                    if (s.isBlacklisted) {
                      statusBadge = (
                        <span style={{ fontSize: '10px', background: '#fee2e2', color: '#ef4444', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          ❌ DEBARRED (BLACKLIST)
                        </span>
                      );
                    } else if (hasExpiredDoc) {
                      statusBadge = (
                        <span style={{ fontSize: '10px', background: '#fee2e2', color: '#ef4444', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          ⚠️ SUSPENDED (EXPIRED DOCS)
                        </span>
                      );
                    } else if (expiringDoc) {
                      statusBadge = (
                        <span style={{ fontSize: '10px', background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          🚨 EXPIRES SOON
                        </span>
                      );
                    } else if (s.accountStatus === 'PENDING_REVIEW') {
                      statusBadge = (
                        <span style={{ fontSize: '10px', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          ⌛ PENDING PRE-QUALIFICATION
                        </span>
                      );
                    }

                    const handleSimulateAlert = () => {
                      showToast(`✉️ Expiration Warning email dispatched to ${s.email}!`);
                      const alertEvt: AuditEvent = {
                        id: `AUD-${Date.now().toString().slice(-3)}`,
                        userId: activeUser.id,
                        userName: activeUser.name,
                        userRole: 'PROCUREMENT_OFFICER',
                        action: 'DISPATCH_COMPLIANCE_RENEWAL_ALERT',
                        entity: 'Supplier',
                        entityId: s.id,
                        timestamp: new Date().toISOString(),
                        details: `Procurement Officer Tamba Cooper triggered manual document renewal email notification to ${s.contactName} (${s.email}) due to upcoming certificate expirations.`,
                        ipAddress: '197.56.241.11'
                      };
                      setAuditLogs(prev => [alertEvt, ...prev]);
                    };

                    return (
                      <div key={index} style={{
                        padding: '16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '14px', color: '#1e293b' }}>{s.name}</strong>
                            {statusBadge}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                            Category: <strong>{s.category}</strong> | Contact: {s.contactName} ({s.phone})
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '4px' }}>
                            {s.documents.map((d, di) => {
                              const isExp = new Date(d.expiryDate) < today;
                              return (
                                <span key={di} style={{ marginRight: '10px', color: isExp ? '#ef4444' : '#475569' }}>
                                  • {d.name.split('_')[0]}: <strong>{d.expiryDate}</strong>
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          {s.accountStatus === 'PENDING_REVIEW' ? (
                            <button 
                              onClick={() => {
                                setApprovingSupplier(s);
                                setGeneratedTempPassword(`SOS-TEMP-${Math.floor(1000 + Math.random()*9000)}`);
                                setShowSupplierApprovalModal(true);
                              }}
                              className="btn btn-primary"
                              style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12px' }}
                            >
                              Verify & Approve Account
                            </button>
                          ) : expiringDoc ? (
                            <button 
                              onClick={handleSimulateAlert}
                              className="btn btn-secondary"
                              style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #d97706', color: '#d97706', background: 'white' }}
                            >
                              <Mail size={12} /> Send Renewal Alert
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                              Rating: ★ {s.rating} / 5.0
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* 4. INVOICING & 3-WAY MATCH WORKSPACE */}
        {activeTab === 'matching' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>Invoice Verification & 3-Way Match</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Segregate receiving physical items and matching invoice data.</p>
            </div>

            {/* SEGREGATION OF DUTIES ALERT BANNER */}
            {strictSoD && (
              <div style={{
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShieldAlert size={22} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800 }}>Strict Segregation of Duties (SoD) Enforced:</div>
                  <div style={{ fontSize: '12px', color: '#ef4444' }}>
                    Users are prohibited from validating goods receipts (GRN) or approving invoices on cases where they created the initial PR.
                  </div>
                </div>
              </div>
            )}

            {/* 3-WAY MATCH MATRIX FOR DISCREPANCIES */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} style={{ color: 'hsl(var(--sos-blue))' }} /> Three-Way Verification Match Panel (INV-2026-001)
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {/* Column 1: PO */}
                <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>1. CONTRACT VALUE (PO-2026-001)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: 'hsl(var(--sos-blue))', marginTop: '8px' }}>$1,425.00</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '10px' }}>
                    * Textbooks Math/Science: <strong>1 Pack ($420)</strong><br />
                    * Custom Uniforms: <strong>30 Units ($720)</strong><br />
                    * Stationery accessory packs: <strong>30 Packs ($285)</strong>
                  </div>
                </div>

                {/* Column 2: GRN */}
                <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>2. PHYSICAL RECEIPTS (GRN-2026-001)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#e0a000', marginTop: '8px' }}>PARTIAL RECEIPT</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '10px' }}>
                    * Textbooks Math/Science: <strong>1 Pack Received</strong><br />
                    * Custom Uniforms: <strong style={{ color: '#ef4444' }}>20 Received (10 DAMAGED/MISSING)</strong><br />
                    * Stationery accessory packs: <strong>30 Received</strong>
                  </div>
                </div>

                {/* Column 3: Invoice */}
                <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>3. SUPPLIER INVOICE (INV-2026-001)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', marginTop: '8px' }}>$1,425.00</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '10px' }}>
                    Supplier invoiced for full **30 Uniform units** ($720) instead of actual received **20 units** ($480).
                  </div>
                </div>
              </div>

              {/* Match Checker Dashboard status */}
              <div style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: resolvedInvoices.includes('INV-2026-001') ? 'rgba(22, 163, 74, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: resolvedInvoices.includes('INV-2026-001') ? '1px solid rgba(22, 163, 74, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 800,
                      backgroundColor: resolvedInvoices.includes('INV-2026-001') ? '#16a34a' : '#dc2626',
                      color: 'white'
                    }}>
                      {resolvedInvoices.includes('INV-2026-001') ? 'EXCEPTION RESOLVED' : 'QTY_MISMATCH EXCEPTION'}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>Variance: $240.00 USD (33% Uniform quantity shortage)</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {resolvedInvoices.includes('INV-2026-001') 
                      ? 'Exception bypass authorized. Recalculated payment total committed.' 
                      : 'Finance has flagged invoice. Awaiting authorization of adjusted payout of $1,185.00 USD.'}
                  </p>
                </div>

                {!resolvedInvoices.includes('INV-2026-001') && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {activeUser.role !== 'FINANCE_OFFICER' && activeUser.role !== 'COUNTRY_DIRECTOR' ? (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Switch to Finance Officer Helena Cole to Resolve</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          placeholder="Bypass comment / Deduct shortage amount..."
                          className="form-control"
                          style={{ width: '260px', padding: '8px 12px' }}
                          value={resolutionComment}
                          onChange={(e) => setResolutionComment(e.target.value)}
                        />
                        <button 
                          onClick={() => resolveException('INV-2026-001')}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '12px', backgroundColor: '#16a34a', boxShadow: 'none' }}
                        >
                          Resolve & Authorize Deducted Payment ($1,185)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. DOCUMENT MANAGEMENT SYSTEM (DMS) */}
        {activeTab === 'dms' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>DMS Central Secure Document Vault</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>ISO 15489-compliant archive registry, full OCR indexer, and 1-Click Audit Packs.</p>
              </div>

              {/* SEARCH INPUT BAR */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="glass-panel">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search by keywords or OCR..."
                    style={{
                      padding: '10px 16px 10px 40px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      width: '320px',
                      outline: 'none',
                      fontSize: '13px'
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      style={{ position: 'absolute', right: '12px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AUDIT PACK GENERATION BANNER */}
            <div className="glass-panel" style={{
              padding: '24px 30px',
              backgroundColor: 'rgba(0, 90, 156, 0.03)',
              border: '1px solid rgba(0, 90, 156, 0.1)',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  backgroundColor: 'rgba(0, 90, 156, 0.1)',
                  color: 'hsl(var(--sos-blue))',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800 }}>ONE-CLICK DONOR AUDIT PACK GENERATOR</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Bundle the complete transaction lineage (PR, RFQ, bids, PO, GRN, invoice, matches, pay ref) instantly.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select 
                  value={selectedAuditPackRef}
                  onChange={(e) => {
                    setSelectedAuditPackRef(e.target.value);
                    setGeneratedAuditPackResult(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: 'white'
                  }}
                >
                  <option value="PR-2026-001">Procurement Cycle 1 (PR-2026-001)</option>
                  <option value="PR-2026-002">Procurement Cycle 2 (PR-2026-002)</option>
                </select>

                <button 
                  onClick={() => triggerAuditPackGeneration(selectedAuditPackRef)}
                  className="btn btn-accent"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                  disabled={isGeneratingAuditPack}
                >
                  {isGeneratingAuditPack ? (
                    <>
                      <RefreshCw size={14} className="float-animation" /> Compiling Bundle...
                    </>
                  ) : (
                    <>
                      <Download size={14} /> Generate Audit Pack
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Audit Pack Compilation Result */}
            {generatedAuditPackResult && (
              <div className="glass-panel slide-in" style={{
                padding: '20px',
                backgroundColor: 'rgba(22, 163, 74, 0.05)',
                border: '1px dashed #16a34a',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyItems: 'center', gap: '10px', alignItems: 'center', color: '#16a34a', fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>
                  <Check size={18} /> AUDIT PACK GENERATED SUCCESSFULLY: [SOS_Liberia_AuditPack_{selectedAuditPackRef}.zip]
                </div>
                <div style={{ fontSize: '12px', color: '#334155' }}>
                  Verified cryptographic SHA-256 signatures for all files in transaction chain. Contain records:
                  <ul style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.6 }}>
                    <li>PR details & electronic authorization logs</li>
                    <li>Invited suppliers list & bid comparison evaluation matrix sheets</li>
                    <li>Award documentation signed by committee</li>
                    <li>PO amendment history logs with version signatures</li>
                    <li>DHL delivery receipt and signed Goods Receipt Note (GRN)</li>
                    <li>Matched Invoices and Bank reconciliation clearance ledger record</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Main Vault Panel Grid layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
              
              {/* Left Side: Document Registry files list */}
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Document Vault Library ({filteredDocs.length} files)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {filteredDocs.map(doc => (
                    <div 
                      key={doc.id} 
                      onClick={() => setSelectedDoc(doc)}
                      style={{
                        padding: '14px',
                        borderRadius: '8px',
                        border: `1px solid ${selectedDoc?.id === doc.id ? 'hsl(var(--sos-blue))' : 'var(--border-color)'}`,
                        backgroundColor: selectedDoc?.id === doc.id ? 'rgba(0, 90, 156, 0.04)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={18} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#0f172a' }}>{doc.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                          <span>Folder: <strong>{doc.folder}</strong></span>
                          <span>Type: <strong>{doc.docType}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: High-fidelity File detail viewer & OCR Simulator */}
              {selectedDoc ? (
                <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{selectedDoc.name}</h3>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Vault Folder: <strong>{selectedDoc.folder}</strong></span>
                        <span>SHA-256 Hash: <code style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>{selectedDoc.versions[0]?.hash.substring(0, 12)}...</code></span>
                      </div>
                    </div>
                    
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      color: '#16a34a'
                    }}>
                      ISO Compliance: ACTIVE
                    </span>
                  </div>

                  {/* VISUAL OCR HIGHLIGHT SIMULATOR BOX */}
                  <div style={{
                    backgroundColor: '#0f172a',
                    color: '#94a3b8',
                    padding: '20px',
                    borderRadius: '12px',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    height: '240px',
                    overflowY: 'auto',
                    border: '1px solid #1e293b',
                    lineHeight: 1.6
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, fontSize: '11px', marginBottom: '10px', fontFamily: 'sans-serif' }}>
                      <Activity size={12} /> SECURE CLOUD STORAGE SCANNER - LIVE OCR TEXT MATRIX
                    </div>

                    {/* OCR Text rendering with keyword highlighter */}
                    {searchTerm ? (
                      (() => {
                        const parts = selectedDoc.ocrText.split(new RegExp(`(${searchTerm})`, 'gi'));
                        return (
                          <p>
                            {parts.map((part, index) => 
                              part.toLowerCase() === searchTerm.toLowerCase() 
                                ? <mark key={index} style={{ backgroundColor: '#FFCC00', color: '#020617', fontWeight: 'bold', padding: '2px 4px', borderRadius: '2px' }}>{part}</mark> 
                                : part
                            )}
                          </p>
                        );
                      })()
                    ) : (
                      <p>{selectedDoc.ocrText}</p>
                    )}
                  </div>

                  {/* Version Controller History details */}
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>Document Version Ledger</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedDoc.versions.map((ver, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '12px',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div>
                            <span style={{ fontWeight: 800 }}>Version {ver.version}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>Uploaded by {ver.uploadedBy}</span>
                          </div>
                          <div style={{ color: '#475569', fontStyle: 'italic' }}>{ver.changes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Select a document to inspect full metadata & OCR scan</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. FINANCE WORKFLOW & BANKING ADAPTER */}
        {activeTab === 'finance' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>Banking Adapter Layer (MT103 Sandbox)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Simulate initiating bank transfer payloads and syncing settled transaction receipts.</p>
            </div>

            {/* BANKING ADAPTER SIMULATOR GRID */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Coins size={20} style={{ color: 'hsl(var(--sos-blue))' }} /> Pluggable Bank Integration Sandbox
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {transfers.map(trf => {
                  const matchingInvoice = invoices.find(inv => inv.id === trf.invoiceId);
                  const isResolved = resolvedInvoices.includes(trf.invoiceId);

                  return (
                    <div key={trf.referenceId} style={{
                      padding: '24px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'white',
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr 1fr',
                      gap: '20px',
                      alignItems: 'center'
                    }}>
                      
                      {/* Left: recipient banking detail */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>{trf.referenceId}</span>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: trf.status === 'CONFIRMED' ? 'rgba(22, 163, 74, 0.1)' : trf.status === 'PROCESSING' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                            color: trf.status === 'CONFIRMED' ? '#16a34a' : trf.status === 'PROCESSING' ? '#d97706' : '#64748b'
                          }}>
                            {trf.status}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0 4px', color: '#0f172a' }}>
                          {trf.supplierName}
                        </h4>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                          Bank: <strong>{trf.bankName}</strong><br />
                          Account: <strong>{trf.accountNumber}</strong> | Swift: <strong>{trf.swiftCode}</strong>
                        </div>
                      </div>

                      {/* Middle: Live MT103 API Payload preview */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pluggable MT103 API Payload:</span>
                        <code style={{
                          fontSize: '10px',
                          backgroundColor: '#0f172a',
                          color: '#10b981',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          maxHeight: '75px',
                          overflowY: 'auto',
                          fontFamily: 'monospace',
                          display: 'block',
                          border: '1px solid #1e293b'
                        }}>
                          {trf.initiationPayload}
                        </code>
                      </div>

                      {/* Right: Transfer action triggers */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                          ${trf.amount.toLocaleString()} USD
                        </div>

                        {trf.status === 'INITIATED' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {matchingInvoice?.status === 'EXCEPTION' && !isResolved ? (
                              <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={12} /> Invoice locked in exceptions. Cannot pay.
                              </div>
                            ) : (
                              <button 
                                onClick={() => triggerBankTransfer(trf.invoiceId)}
                                className="btn btn-accent"
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                              >
                                Initiate Bank Transfer (API Mock)
                              </button>
                            )}
                          </div>
                        ) : trf.status === 'PROCESSING' ? (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <RefreshCw size={14} className="float-animation" /> Bank processing. Auto-settling ledger...
                          </div>
                        ) : (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>RECONCILED</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bank Ref: <strong>{trf.bankReference}</strong></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 7. SYSTEM OBSERVABILITY & LEGER LOGS */}
        {activeTab === 'health' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>System Observability & Auditing Ledger</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Check platform server status, uptime ratios, and export immutable logs.</p>
              </div>

              <button 
                onClick={() => {
                  alert('System Health Export: Audit logs compiled in CSV format and sent to secure backup folder.');
                  logEvent('EXPORT_SYSTEM_LOGS', 'System', 'UptimeLedger', 'Audit trails exported by authorized system operator.');
                }}
                className="btn btn-secondary"
              >
                <Download size={16} /> Export Audit Ledger
              </button>
            </div>

            {/* Health Dashboard Widgets grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Core API Uptime</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color: '#16a34a' }}>99.98%</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>All nodes operating healthy</span>
              </div>

              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Database Replication</span>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color: '#16a34a' }}>SYNCED</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monrovia National Server mirrored</span>
              </div>

              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'white' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Backup Integrity Hash</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '14px', color: 'hsl(var(--sos-blue))', fontFamily: 'monospace' }}>
                  SHA256: 8f2d8471...
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Continuous hourly backups</span>
              </div>
            </div>

            {/* LIVE SYSTEM AUDIT TRAIL LOGS */}
            <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Fingerprint size={20} style={{ color: 'hsl(var(--sos-blue))' }} /> Immutable Audit Trail Ledger (Live Database)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
                {auditLogs.map(log => (
                  <div key={log.id} style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#f8fafc',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 2fr 1.2fr',
                    gap: '10px',
                    alignItems: 'center',
                    fontSize: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>{log.id}</span>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: 'rgba(0, 90, 156, 0.08)',
                          color: 'hsl(var(--sos-blue))'
                        }}>{log.userRole}</span>
                      </div>
                      <div style={{ marginTop: '4px', fontWeight: 700, color: '#334155' }}>{log.userName}</div>
                    </div>

                    <div style={{ color: '#475569', lineHeight: 1.4 }}>
                      <strong>Action:</strong> <code style={{ backgroundColor: '#e2e8f0', padding: '2px 4px', borderRadius: '4px', fontSize: '11px' }}>{log.action}</code><br />
                      {log.details}
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        <Clock size={12} /> {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>IP: {log.ipAddress}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification Box */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '16px 24px',
          backgroundColor: '#0f172a',
          color: 'white',
          borderRadius: '10px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 99999,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <ShieldCheck size={18} style={{ color: '#16a34a' }} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Supplier pre-qualification approvals modal (For Procurement Officer) */}
      {showSupplierApprovalModal && approvingSupplier && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} className="fade-in">
          <div style={{
            background: 'white',
            width: '520px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0,0,0,0.05)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'hsl(var(--sos-blue))', margin: 0 }}>
                  Review Pre-qualification Dossier
                </h4>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Supplier ID: {approvingSupplier.id}</span>
              </div>
              <button 
                onClick={() => setShowSupplierApprovalModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#334155' }}>
              <div>Company Name: <strong>{approvingSupplier.name}</strong></div>
              <div>Contact Representative: <strong>{approvingSupplier.contactName}</strong></div>
              <div>Email Address: <strong>{approvingSupplier.email}</strong></div>
              <div>Taxpayer TIN: <strong style={{ color: 'hsl(var(--sos-blue))' }}>{approvingSupplier.taxId}</strong></div>
              <div>Industry Category: <strong>{approvingSupplier.category}</strong></div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uploaded Due Diligence Checks</span>
              {approvingSupplier.documents.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: '#475569' }}>📄 {d.name.split('_')[0]}: <strong>Expires {d.expiryDate}</strong></span>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓ Verified</span>
                </div>
              ))}
            </div>

            <div style={{
              padding: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#475569',
              lineHeight: '1.4'
            }}>
              <strong>Account Setup Credentials:</strong>
              <br />Generating approval will create a secure Supplier Login.
              <br />Generated Temp Password: <strong style={{ color: '#d97706', fontSize: '12px' }}>{generatedTempPassword}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setShowSupplierApprovalModal(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px' }}
              >
                Decline
              </button>
              <button 
                type="button" 
                onClick={() => {
                  const updatedSuppliers = suppliers.map(s => {
                    if (s.id === approvingSupplier.id) {
                      return {
                        ...s,
                        accountStatus: 'PENDING_CONFIRMATION' as const,
                        tempPassword: generatedTempPassword,
                        isTempPasswordActive: true
                      };
                    }
                    return s;
                  });
                  setSuppliers(updatedSuppliers);

                  const custom = localStorage.getItem('CUSTOM_SUPPLIERS');
                  if (custom) {
                    const parsedCustom = JSON.parse(custom);
                    const updatedCustom = parsedCustom.map((s: any) => {
                      if (s.id === approvingSupplier.id) {
                        return {
                          ...s,
                          accountStatus: 'PENDING_CONFIRMATION',
                          tempPassword: generatedTempPassword,
                          isTempPasswordActive: true
                        };
                      }
                      return s;
                    });
                    localStorage.setItem('CUSTOM_SUPPLIERS', JSON.stringify(updatedCustom));
                  }

                  const appEvt: AuditEvent = {
                    id: `AUD-${Date.now().toString().slice(-3)}`,
                    userId: activeUser.id,
                    userName: activeUser.name,
                    userRole: 'PROCUREMENT_OFFICER',
                    action: 'APPROVE_VENDOR_PRE_QUALIFICATION',
                    entity: 'Supplier',
                    entityId: approvingSupplier.id,
                    timestamp: new Date().toISOString(),
                    details: `Procurement Officer Tamba Cooper verified TIN and uploaded due-diligence certificates, approved pre-qualification dossier for ${approvingSupplier.name}, generated vendor account, and dispatched temporary credentials.`,
                    ipAddress: '197.56.241.11'
                  };
                  setAuditLogs(prev => [appEvt, ...prev]);

                  refreshSimUsers(updatedSuppliers);

                  setShowSupplierApprovalModal(false);
                  showToast(`🎉 Vendor approved! Temporary password generated: ${generatedTempPassword}`);
                }}
                className="btn btn-primary"
                style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '12.5px' }}
              >
                Approve & Dispatch Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Renew Documents Modal */}
      {isRenewModalOpen && renewingDocName && activeSupplier && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} className="fade-in">
          <div style={{
            background: 'white',
            width: '460px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0,0,0,0.05)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'hsl(var(--sos-blue))', margin: 0 }}>
                  Renew Document Credentials
                </h4>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Target: {renewingDocName}</span>
              </div>
              <button 
                onClick={() => setIsRenewModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                Please upload a renewed file copy for <strong>{renewingDocName}</strong>. You must enter the new certificate expiry date.
              </div>

              <div style={{
                padding: '16px',
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                textAlign: 'center',
                background: '#f8fafc',
                fontSize: '12.5px',
                color: '#64748b',
                cursor: 'pointer'
              }}>
                📄 Click to Select Renewed PDF Copy
                <br /><small style={{ fontSize: '9.5px', color: '#94a3b8' }}>Max size 10MB. Automatically checked by donor OCR engines.</small>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>New Expiry Date *</label>
                <input 
                  type="date"
                  value={renewingDocExpiry}
                  onChange={(e) => setRenewingDocExpiry(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => setIsRenewModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (!renewingDocExpiry) {
                    alert("Please select a new expiry date.");
                    return;
                  }

                  const updatedSuppliers = suppliers.map(s => {
                    if (s.id === activeSupplier.id) {
                      return {
                        ...s,
                        documents: s.documents.map(d => {
                          if (d.name === renewingDocName) {
                            return { ...d, expiryDate: renewingDocExpiry, status: 'VALID' as const };
                          }
                          return d;
                        })
                      };
                    }
                    return s;
                  });
                  setSuppliers(updatedSuppliers);

                  const custom = localStorage.getItem('CUSTOM_SUPPLIERS');
                  if (custom) {
                    const parsedCustom = JSON.parse(custom);
                    const updatedCustom = parsedCustom.map((s: any) => {
                      if (s.id === activeSupplier.id) {
                        return {
                          ...s,
                          documents: s.documents.map((d: any) => {
                            if (d.name === renewingDocName) {
                              return { ...d, expiryDate: renewingDocExpiry, status: 'VALID' };
                            }
                            return d;
                          })
                        };
                      }
                      return s;
                    });
                    localStorage.setItem('CUSTOM_SUPPLIERS', JSON.stringify(updatedCustom));
                  }

                  const renewEvt: AuditEvent = {
                    id: `AUD-${Date.now().toString().slice(-3)}`,
                    userId: activeUser.id,
                    userName: activeUser.name,
                    userRole: 'SUPPLIER',
                    action: 'RENEW_COMPLIANCE_CERTIFICATE',
                    entity: 'Supplier',
                    entityId: activeSupplier.id,
                    timestamp: new Date().toISOString(),
                    details: `Supplier uploaded renewed copy for certificate ${renewingDocName} with updated expiry date of ${renewingDocExpiry}. Compliance standing restored.`,
                    ipAddress: '197.56.241.11'
                  };
                  setAuditLogs(prev => [renewEvt, ...prev]);

                  const newDmsDoc: DMSDocument = {
                    id: `DOC-VEND-${Date.now().toString().slice(-3)}`,
                    name: `Supplier_Renewed_${renewingDocName.replace(/\s+/g, '_')}_${activeSupplier.name.replace(/\s+/g, '_')}.pdf`,
                    folder: 'Procurement',
                    docType: 'VEND_DOC',
                    referenceId: activeSupplier.id,
                    supplierName: activeSupplier.name,
                    uploadDate: new Date().toISOString().split('T')[0],
                    ocrText: `RENEWED COMPLIANCE CERTIFICATE. Type: ${renewingDocName}. Bidder: ${activeSupplier.name}. New validity registered through: ${renewingDocExpiry}. Checked and logged by SOS ProcureSphere 360 compliance audit tracker.`,
                    permissions: {
                      view: ['PROCUREMENT_OFFICER', 'FINANCE_OFFICER', 'COUNTRY_DIRECTOR', 'AUDITOR'],
                      edit: []
                    },
                    versions: [{ version: 1, uploadedAt: new Date().toISOString(), uploadedBy: activeSupplier.contactName, hash: '2e4d91a1824cb', changes: 'Renewed certificate copy' }],
                    retentionExpiry: '2033-05-28',
                    isArchived: false
                  };
                  setDocuments(prev => [newDmsDoc, ...prev]);

                  setIsRenewModalOpen(false);
                  showToast("🎉 Document renewed successfully and logged inside DMS!");
                }}
                className="btn btn-primary"
                style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '12.5px' }}
              >
                Upload & Clear Warnings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create RFQ / RFP Modal */}
      {showNewRFQModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} className="fade-in">
          <div className="glass-panel slide-up" style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '2px solid hsl(var(--sos-blue))',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={22} style={{ color: 'hsl(var(--sos-blue))' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Dispatch Electronic RFQ / RFP
                </h3>
              </div>
              <button 
                onClick={() => setShowNewRFQModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              Initiate a competitive sourcing tender by selecting an approved Purchase Requisition and inviting vetted suppliers.
            </p>

            <form onSubmit={submitRFQ} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>RFQ / RFP Project Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Sourcing of Emergency Clinic Medicines"
                  value={newRFQTitle}
                  onChange={(e) => setNewRFQTitle(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Select Approved Requisition *</label>
                  <select
                    required
                    value={newRFQPrId}
                    onChange={(e) => {
                      setNewRFQPrId(e.target.value);
                      // Auto-select category based on the PR
                      const relatedPr = requisitions.find(pr => pr.id === e.target.value);
                      if (relatedPr) {
                        if (relatedPr.id === 'PR-2026-001') {
                          setNewRFQCategory('Educational Supplies & Uniforms');
                        } else if (relatedPr.id === 'PR-2026-002') {
                          setNewRFQCategory('IT Equipment & Networking Hardware');
                        } else {
                          setNewRFQCategory('Medical Equipment & Pharmaceuticals');
                        }
                      }
                    }}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', backgroundColor: 'white' }}
                  >
                    <option value="">-- Choose Requisition --</option>
                    {requisitions.filter(pr => pr.status === 'APPROVED').map(pr => (
                      <option key={pr.id} value={pr.id}>{pr.id} - {pr.items[0]?.description.slice(0, 30)}... (${pr.totalAmount.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Sourcing Category</label>
                  <input 
                    type="text"
                    readOnly
                    value={newRFQCategory}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px', backgroundColor: '#f1f5f9', color: '#64748b' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Closing Deadline *</label>
                  <input 
                    type="datetime-local"
                    required
                    value={newRFQCloseDate}
                    onChange={(e) => setNewRFQCloseDate(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Sourcing Mechanism</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={newRFQIsReverseAuction}
                      onChange={(e) => setNewRFQIsReverseAuction(e.target.checked)}
                    />
                    Enable Reverse E-Auction
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Invite Vetted Pre-qualified Suppliers *</label>
                <div style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {suppliers.filter(s => s.accountStatus === 'ACTIVE' && !s.isBlacklisted).map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={newRFQInvitedSuppliers.includes(s.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRFQInvitedSuppliers(prev => [...prev, s.id]);
                          } else {
                            setNewRFQInvitedSuppliers(prev => prev.filter(id => id !== s.id));
                          }
                        }}
                      />
                      {s.name} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({s.category.split(' ')[0]})</span>
                    </label>
                  ))}
                  {suppliers.filter(s => s.accountStatus === 'ACTIVE' && !s.isBlacklisted).length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active pre-qualified suppliers available in directory.</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowNewRFQModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12.5px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', borderRadius: '6px', fontSize: '12.5px' }}
                >
                  Publish & Dispatch RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

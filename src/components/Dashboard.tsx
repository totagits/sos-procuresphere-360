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
  TrendingUp
} from 'lucide-react';
import type { 
  User as UserType, 
  PurchaseRequisition, 
  SupplierBid, 
  DMSDocument,
  AuditEvent,
  Invoice,
  MatchResult,
  BankingTransfer
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
  const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);
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
  
  // DMS Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DMSDocument | null>(MOCK_DOCUMENTS[3]); // PO-001 doc pre-selected

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

  // Filter documents dynamically for OCR search
  const filteredDocs = documents.filter(doc => {
    const matchSearch = searchTerm.trim().toLowerCase();
    if (!matchSearch) return true;
    return (
      doc.name.toLowerCase().includes(matchSearch) ||
      doc.ocrText.toLowerCase().includes(matchSearch) ||
      doc.referenceId.toLowerCase().includes(matchSearch) ||
      (doc.supplierName && doc.supplierName.toLowerCase().includes(matchSearch))
    );
  });

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
              const u = MOCK_USERS.find(usr => usr.id === e.target.value);
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
              cursor: 'pointer'
            }}
          >
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>

        {/* Navigation Sidebar Tabs */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
        {activeTab === 'analytics' && (
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
        )}

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
        {activeTab === 'rfx' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>E-Sourcing & Quotation Matrix (RFx)</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Analyze supplier bids side-by-side using quote comparison sheets.</p>
              </div>

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
          </div>
        )}

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
    </div>
  );
};

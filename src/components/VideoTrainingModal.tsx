import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Film, 
  ArrowRight,
  MousePointer2,
  FileCheck,
  ShoppingBag,
  Layers,
  FolderLock,
  Coins,
  Activity,
  UserCheck,
  ShieldCheck,
  Award
} from 'lucide-react';

interface VideoTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SimStep {
  time: number; // in percentage of progress
  narration: string;
  cursorPos?: { x: string; y: string };
  highlightElement?: string;
  simulatedInput?: string;
  activeScreen: string; // which layout to mock
}

interface VideoTrack {
  id: string;
  title: string;
  role: string;
  duration: string;
  steps: SimStep[];
}

export const VideoTrainingModal: React.FC<VideoTrainingModalProps> = ({ isOpen, onClose }) => {
  const [activeTrackId, setActiveTrackId] = useState<string>('track-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  const videoTracks: VideoTrack[] = [
    {
      id: 'track-1',
      title: 'Requestor: Purchase Requisition Lifecycle',
      role: 'Staff Requestor (Kiatu Barclay)',
      duration: '0:25',
      steps: [
        { time: 0, narration: "Welcome! Let's watch Kiatu Barclay, Staff Requestor, create a purchase requisition.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'landing' },
        { time: 10, narration: "First, Kiatu switch profiles and navigates to the 'Purchase Requisitions' workspace tab on the sidebar.", cursorPos: { x: '10%', y: '28%' }, highlightElement: 'pr-tab', activeScreen: 'dashboard_pr_empty' },
        { time: 30, narration: "Next, he clicks 'Create Requisition' to open the budget check form.", cursorPos: { x: '82%', y: '15%' }, highlightElement: 'create-pr-btn', activeScreen: 'dashboard_pr_form_empty' },
        { time: 50, narration: "He selects USAID grant and types the item description: 'Primary Grade School Textbooks'.", cursorPos: { x: '45%', y: '32%' }, simulatedInput: "Primary Grade School Textbooks", activeScreen: 'dashboard_pr_form_filled' },
        { time: 70, narration: "The Commitment Control Engine runs a soft check, verifying available funds and returning a green 'PASSED' badge.", cursorPos: { x: '45%', y: '68%' }, highlightElement: 'budget-passed', activeScreen: 'dashboard_pr_form_passed' },
        { time: 90, narration: "Finally, he clicks 'Submit Requisition' to log the transaction into the ledger and generate a DMS archive.", cursorPos: { x: '58%', y: '88%' }, highlightElement: 'submit-pr', activeScreen: 'dashboard_pr_complete' },
        { time: 100, narration: "The PR is successfully logged as Pending Procurement review! End of simulation.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'dashboard_pr_complete' }
      ]
    },
    {
      id: 'track-2',
      title: 'Procurement: E-Sourcing & RFP Dispatch',
      role: 'Procurement Officer (Tamba Cooper)',
      duration: '0:30',
      steps: [
        { time: 0, narration: "Welcome! Watch Tamba Cooper, Procurement Officer, create an RFQ and dispatch it to pre-qualified vendors.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'landing' },
        { time: 10, narration: "He switches roles and clicks Sourcing & Bids (RFx) tab to inspect active tendering cycles.", cursorPos: { x: '10%', y: '35%' }, highlightElement: 'rfx-tab', activeScreen: 'dashboard_rfx_empty' },
        { time: 30, narration: "To set up a competitive tender, he clicks the new 'Create RFQ / RFP' button in the tab header.", cursorPos: { x: '62%', y: '15%' }, highlightElement: 'create-rfq-btn', activeScreen: 'dashboard_rfq_modal_empty' },
        { time: 55, narration: "Tamba selects approved PR-2026-002, sets a deadline, and checks checkboxes to invite vetted suppliers.", cursorPos: { x: '40%', y: '78%' }, highlightElement: 'suppliers-check', activeScreen: 'dashboard_rfq_modal_filled' },
        { time: 75, narration: "He clicks 'Publish & Dispatch RFQ'. The system broadcasts invites and archives an official PDF specs sheet in the DMS.", cursorPos: { x: '68%', y: '86%' }, highlightElement: 'submit-rfq', activeScreen: 'dashboard_rfq_complete' },
        { time: 90, narration: "Scroll down to check compliance dockets inside the Pre-qualified Vendor Compliance Ledger.", cursorPos: { x: '50%', y: '92%' }, highlightElement: 'vendor-ledger', activeScreen: 'dashboard_rfq_complete' },
        { time: 100, narration: "The RFQ is officially live and dispatched! End of simulation.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'dashboard_rfq_complete' }
      ]
    },
    {
      id: 'track-3',
      title: 'Finance: 3-Way Match & Bank Settlements',
      role: 'Finance Officer (Helena Cole)',
      duration: '0:30',
      steps: [
        { time: 0, narration: "Welcome! Watch Finance Officer Helena Cole resolve matching exceptions and disburse digital Ecobank payments.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'landing' },
        { time: 15, narration: "Helena navigates to the 'Invoicing & 3-Way Match' tab to review invoice verification panels.", cursorPos: { x: '10%', y: '42%' }, highlightElement: 'matching-tab', activeScreen: 'dashboard_match_exception' },
        { time: 35, narration: "She spots Invoice INV-2026-001 locked with a red 'QTY_MISMATCH' Exception (30 uniforms billed, 20 received).", cursorPos: { x: '50%', y: '30%' }, highlightElement: 'match-panel', activeScreen: 'dashboard_match_exception' },
        { time: 55, narration: "Helena enters resolution comments to bypass the lock and authorize payment for the 20 physical units actually delivered.", cursorPos: { x: '50%', y: '75%' }, simulatedInput: "Exception resolved. Partial payment approved for 20 units actually received.", activeScreen: 'dashboard_match_comments' },
        { time: 70, narration: "She clicks 'Approve Exception Bypass'. The invoice status clears to MATCHED.", cursorPos: { x: '72%', y: '84%' }, highlightElement: 'bypass-btn', activeScreen: 'dashboard_match_cleared' },
        { time: 85, narration: "Next, she glides to the 'Banking Adapter' tab and clicks 'Initiate Bank Transfer' to send MT103 API mock data.", cursorPos: { x: '10%', y: '56%' }, highlightElement: 'finance-tab', activeScreen: 'dashboard_finance_settling' },
        { time: 100, narration: "Ecobank settles the mock transfer, returns a secure Reference Key, and logs it in the ledger! End of simulation.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'dashboard_finance_complete' }
      ]
    },
    {
      id: 'track-4',
      title: 'Country Director: High-Value PR Sign-offs',
      role: 'Country Director (Dr. Augustine A. Allieu)',
      duration: '0:15',
      steps: [
        { time: 0, narration: "Welcome! Watch Country Director Dr. Augustine A. Allieu sign off on major procurement cycles exceeding $5,000.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'landing' },
        { time: 25, narration: "The Director switches to the Purchase Requisition workspace tab to review outstanding approvals.", cursorPos: { x: '10%', y: '28%' }, highlightElement: 'pr-tab', activeScreen: 'dashboard_director_pr_pending' },
        { time: 55, narration: "He reviews PR-2026-002 valued at $7,500 USD for laptops, which is strictly locked from lower staff authorization.", cursorPos: { x: '50%', y: '35%' }, highlightElement: 'pr-row-laptops', activeScreen: 'dashboard_director_pr_pending' },
        { time: 80, narration: "Satisfied with the USAID grant checks, he clicks 'Approve Requisition' to sign off the contract.", cursorPos: { x: '82%', y: '40%' }, highlightElement: 'director-approve-btn', activeScreen: 'dashboard_director_pr_approved' },
        { time: 100, narration: "The requisition is approved and automatically converted to PO-2026-002 with audit logs! End of simulation.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'dashboard_director_pr_approved' }
      ]
    },
    {
      id: 'track-5',
      title: 'Auditor: OCR File Search & Audit Packs',
      role: 'External Donor Auditor (Robert Green)',
      duration: '0:20',
      steps: [
        { time: 0, narration: "Welcome! Watch External Auditor Robert Green search files via OCR and export compliance Audit Packs.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'landing' },
        { time: 20, narration: "He switches profiles and clicks on the 'Document Vault (DMS)' tab to access NGO archives.", cursorPos: { x: '10%', y: '48%' }, highlightElement: 'dms-tab', activeScreen: 'dashboard_dms_empty' },
        { time: 45, narration: "He types 'USAID' in the Search bar. The live OCR Engine reads the mock PDFs and highlights matching keywords in yellow.", cursorPos: { x: '35%', y: '18%' }, simulatedInput: "USAID", activeScreen: 'dashboard_dms_searched' },
        { time: 75, narration: "To package a donor-ready audit loop, he selects cycle PR-2026-001 and clicks 'Generate Audit Pack'.", cursorPos: { x: '84%', y: '48%' }, highlightElement: 'gen-audit-btn', activeScreen: 'dashboard_dms_generating' },
        { time: 100, narration: "The system bundles PRs, RFQs, bids, POs, matches, and logs into a download ZIP dossier! End of simulation.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'dashboard_dms_zip_ready' }
      ]
    },
    {
      id: 'track-6',
      title: 'Supplier: Vetting Updates & Sealed Bids',
      role: 'External Pre-qualified Supplier',
      duration: '0:30',
      steps: [
        { time: 0, narration: "Welcome! Watch a Supplier log in, clear certificate warnings, and submit cryptographically sealed bids.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'landing' },
        { time: 15, narration: "Newly approved suppliers log in with their temporary credentials, immediately triggering a security Password Reset.", cursorPos: { x: '50%', y: '50%' }, highlightElement: 'reset-panel', activeScreen: 'supplier_reset_pass' },
        { time: 35, narration: "Once logged in, they open the Vendor Compliance Center (analytics tab) to check their vetting scorecard.", cursorPos: { x: '10%', y: '28%' }, highlightElement: 'compliance-center-tab', activeScreen: 'supplier_compliance_warning' },
        { time: 55, narration: "They spot an expiring Tax Clearance warning, click 'Renew / Upload', and upload a renewed PDF with an updated date.", cursorPos: { x: '82%', y: '68%' }, highlightElement: 'renew-btn', activeScreen: 'supplier_compliance_renew_modal' },
        { time: 75, narration: "Next, they open the RFP Portal (RFx tab) and click on the open Laptop Sourcing Case RFQ-2026-002.", cursorPos: { x: '10%', y: '35%' }, highlightElement: 'supplier-rfx-tab', activeScreen: 'supplier_rfx_bidding' },
        { time: 90, narration: "They type their bid price ($6,900), lead time, and submit a secure bid proposal sealed under SHA-256 encryption.", cursorPos: { x: '58%', y: '88%' }, highlightElement: 'submit-sealed-bid', activeScreen: 'supplier_rfx_complete' },
        { time: 100, narration: "The bid is cryptographically sealed in the ledger! End of simulation.", cursorPos: { x: '80%', y: '10%' }, activeScreen: 'supplier_rfx_complete' }
      ]
    }
  ];

  const activeTrack = videoTracks.find(t => t.id === activeTrackId) || videoTracks[0];

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setIsPlaying(false);
      setCurrentStepIndex(0);
    }
  }, [isOpen, activeTrackId]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 100;
          }
          const nextVal = prev + 1;
          
          // Map progress percentage to steps
          const matchingStepIndex = activeTrack.steps.findIndex((s, idx) => {
            const nextStep = activeTrack.steps[idx + 1];
            return nextVal >= s.time && (!nextStep || nextVal < nextStep.time);
          });
          
          if (matchingStepIndex !== -1) {
            setCurrentStepIndex(matchingStepIndex);
          }

          return nextVal;
        });
      }, 300); // 300ms per 1% -> 30 seconds total video duration
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, activeTrack]);

  if (!isOpen) return null;

  const currentStep = activeTrack.steps[currentStepIndex] || activeTrack.steps[0];

  const handlePlayPause = () => {
    if (progress >= 100) {
      setProgress(0);
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentStepIndex(0);
  };

  // Mock viewport screen rendering based on the activeStep screenState
  const renderSimulatedScreen = () => {
    switch (currentStep.activeScreen) {
      case 'dashboard_pr_empty':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>Purchase Requisition Registry</div>
              <button id="create-pr-btn" className="btn btn-primary" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>+ Create Requisition</button>
            </div>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '11px', marginTop: '30px' }}>
              No purchase requisitions created yet in this simulation.
            </div>
          </div>
        );
      case 'dashboard_pr_form_empty':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'white', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>New Purchase Requisition (PR) Form</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
              <label style={{ fontWeight: 700 }}>Item / Service Description</label>
              <input type="text" readOnly placeholder="e.g. Primary School Math Textbooks" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <input type="number" readOnly placeholder="Qty" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
                <input type="number" readOnly placeholder="Unit Price" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
              </div>
              <label style={{ fontWeight: 700 }}>Grant Funding Mappings</label>
              <select style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} disabled><option>Select Funding Mappings</option></select>
            </div>
          </div>
        );
      case 'dashboard_pr_form_filled':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'white', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>New Purchase Requisition (PR) Form</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
              <label style={{ fontWeight: 700 }}>Item / Service Description</label>
              <input type="text" readOnly value={currentStep.simulatedInput || "Primary Grade School Textbooks"} style={{ padding: '4px', border: '1px solid #005a9c', borderRadius: '4px', fontSize: '10px', background: 'rgba(0,90,156,0.05)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <input type="text" readOnly value="50" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
                <input type="text" readOnly value="$15.00 USD" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
              </div>
              <label style={{ fontWeight: 700 }}>Grant Funding Mappings</label>
              <select style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px', backgroundColor: 'white' }} disabled><option>USAID-SOS-2025 - Juah Town Children Village</option></select>
            </div>
          </div>
        );
      case 'dashboard_pr_form_passed':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'white', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>New Purchase Requisition (PR) Form</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
              <input type="text" readOnly value="Primary Grade School Textbooks" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <input type="text" readOnly value="50" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
                <input type="text" readOnly value="$15.00 USD" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10px' }} />
              </div>
              <div id="budget-passed" style={{ padding: '8px', background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '6px', fontWeight: 700 }}>
                ✓ COMMITMENT CONTROL: PASSED ($750 / $40,000 Available)
              </div>
              <button id="submit-pr" className="btn btn-primary" style={{ padding: '8px', borderRadius: '4px', fontSize: '11px', marginTop: 'auto' }}>Submit Requisition</button>
            </div>
          </div>
        );
      case 'dashboard_pr_complete':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>Purchase Requisition Registry</div>
              <button className="btn btn-primary" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>+ Create Requisition</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>PR-2026-004</span>
                    <span style={{ fontSize: '9px', background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>PENDING_APPROVAL</span>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Primary Grade School Textbooks</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>Grant: USAID-SOS-2025 | Location: Juah Town</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>$750.00 USD</div>
              </div>
            </div>
          </div>
        );
      case 'dashboard_rfx_empty':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>E-Sourcing & Quotation Matrix (RFx)</div>
              <button id="create-rfq-btn" className="btn btn-primary" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px' }}>+ Create RFQ / RFP</button>
            </div>
            <div style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '11px', color: '#64748b' }}>
              Standard RFQ comparisons are active. Select 'Create RFQ' to dispatch new contract bids.
            </div>
          </div>
        );
      case 'dashboard_rfq_modal_empty':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'white', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', color: 'hsl(var(--sos-blue))' }}>Dispatch Electronic RFQ / RFP</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '9px' }}>
              <label style={{ fontWeight: 700 }}>RFQ / RFP Project Title</label>
              <input type="text" readOnly placeholder="e.g. Sourcing of Youth Lab Computers" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              <label style={{ fontWeight: 700 }}>Select Approved Requisition</label>
              <select style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} disabled><option>PR-2026-002 ($7,500 Laptops)</option></select>
            </div>
          </div>
        );
      case 'dashboard_rfq_modal_filled':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'white', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', color: 'hsl(var(--sos-blue))' }}>Dispatch Electronic RFQ / RFP</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '9px' }}>
              <label style={{ fontWeight: 700 }}>RFQ / RFP Project Title</label>
              <input type="text" readOnly value="Sourcing of Youth Lab Computers" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              <label style={{ fontWeight: 700 }}>Select Approved Requisition</label>
              <select style={{ padding: '4px', border: '1px solid #005a9c', borderRadius: '4px', backgroundColor: 'white' }} disabled><option>PR-2026-002 ($7,500 Laptops)</option></select>
              <label style={{ fontWeight: 700 }}>Invite Vetted Pre-qualified Suppliers</label>
              <div id="suppliers-check" style={{ padding: '4px', border: '1px solid #005a9c', borderRadius: '4px', background: 'rgba(0,90,156,0.05)' }}>
                ☑ Monrovia Tech Hub Ltd (IT hardware)<br />
                ☑ Liberia Enterprise Inc. (Logistics/Office)
              </div>
              <button id="submit-rfq" className="btn btn-primary" style={{ padding: '6px', borderRadius: '4px', fontSize: '10px', marginTop: 'auto' }}>Publish & Dispatch RFQ</button>
            </div>
          </div>
        );
      case 'dashboard_rfq_complete':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800 }}>Active Sourcing Tenders</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ padding: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Sourcing of Youth Lab Computers</strong>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '1px 4px', borderRadius: '4px', fontSize: '8px', fontWeight: 800 }}>ACTIVE</span>
                </div>
                <div style={{ color: '#64748b', fontSize: '8px', marginTop: '2px' }}>RFQ Ref: RFQ-2026-003 | Invited: 2 Suppliers</div>
              </div>
            </div>
            <div id="vendor-ledger" style={{ padding: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, marginBottom: '4px' }}>Compliance Ledger</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', borderBottom: '1px solid #f1f5f9', padding: '4px 0' }}>
                <span>Monrovia Catering Inc.</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ COMPLIANT</span>
              </div>
            </div>
          </div>
        );
      case 'dashboard_match_exception':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>Three-Way Match Verification Panel</div>
            <div id="match-panel" style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>
                <span>Invoice INV-2026-001</span>
                <span>QTY_MISMATCH Exception</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '9px', marginTop: '10px', color: '#475569' }}>
                <div>PO Ordered: <strong>30 Units</strong></div>
                <div>GRN Received: <strong style={{ color: '#dc2626' }}>20 Units</strong></div>
                <div>Invoice Billed: <strong>30 Units</strong></div>
              </div>
            </div>
          </div>
        );
      case 'dashboard_match_comments':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>Three-Way Match Verification Panel</div>
            <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#dc2626' }}>
                <span>Invoice INV-2026-001</span>
                <span>QTY_MISMATCH Lock</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px', fontSize: '9px' }}>
                <label style={{ fontWeight: 700 }}>Resolution Comments *</label>
                <textarea readOnly value={currentStep.simulatedInput} style={{ padding: '6px', border: '1px solid #005a9c', borderRadius: '4px', fontSize: '9px', outline: 'none', background: 'rgba(0,90,156,0.05)' }} rows={2} />
              </div>
              <button id="bypass-btn" className="btn btn-primary" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '9px', marginTop: '6px', background: '#16a34a', border: 'none' }}>Approve Exception Bypass</button>
            </div>
          </div>
        );
      case 'dashboard_match_cleared':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>Three-Way Match Verification Panel</div>
            <div style={{ padding: '12px', background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '8px', color: '#16a34a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700 }}>
                <span>Invoice INV-2026-001</span>
                <span>✓ MATCHED (BYPASS ACTIVE)</span>
              </div>
              <div style={{ fontSize: '9px', color: '#166534', marginTop: '6px', fontStyle: 'italic' }}>
                Bypass comments: Exception resolved. Partial payment approved for 20 units actually received.
              </div>
            </div>
          </div>
        );
      case 'dashboard_finance_settling':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>Banking API Adapter & MT103 Payloads</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700 }}>INV-2026-001 (Matched)</span>
                <span style={{ fontSize: '10px', fontWeight: 800 }}>$1,185.00 USD</span>
              </div>
              <div style={{ background: '#0f172a', padding: '8px', borderRadius: '6px', color: '#38bdf8', fontSize: '8px', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {`{
  "MT103_directive": "MOCK_PAYMENT",
  "creditor_iban": "LR88-1122-3344",
  "settlement_currency": "USD",
  "net_payment_amount": 1185.00
}`}
              </div>
              <button id="finance-tab" className="btn btn-accent" style={{ padding: '8px', borderRadius: '4px', fontSize: '10px', backgroundColor: 'hsl(var(--sos-gold))', border: 'none', color: '#1e293b', fontWeight: 700 }}>Initiate Bank Transfer (API Mock)</button>
            </div>
          </div>
        );
      case 'dashboard_finance_complete':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>Banking API Adapter & MT103 Payloads</div>
            <div style={{ padding: '14px', background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a' }}>✓ SETTLED & RECONCILED</div>
              <div style={{ fontSize: '9px', color: '#166534' }}>
                Bank Reference Key: <strong>CBK-LR-893041</strong><br />
                Ecobank API response code: <code>200 OK</code>
              </div>
            </div>
          </div>
        );
      case 'dashboard_director_pr_pending':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800 }}>Purchase Requisition Registry</div>
            </div>
            <div id="pr-row-laptops" style={{ padding: '10px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800 }}>PR-2026-002</span>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#005a9c' }}>IT Youth Computer Lab Laptops</div>
                <div style={{ fontSize: '8px', color: '#94a3b8' }}>Amount: $7,500 | Limit exceeded (Director Review Required)</div>
              </div>
              <button id="director-approve-btn" className="btn btn-primary" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '9px', background: '#16a34a', border: 'none' }}>Approve Requisition</button>
            </div>
          </div>
        );
      case 'dashboard_director_pr_approved':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#f8fafc', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800 }}>Purchase Requisition Registry</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(22, 163, 74, 0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800 }}>PR-2026-002</span>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#166534' }}>IT Youth Computer Lab Laptops</div>
                <div style={{ fontSize: '8px', color: '#166534' }}>Status: ✓ APPROVED (Director Signed)</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a' }}>$7,500.00</span>
            </div>
          </div>
        );
      case 'dashboard_dms_empty':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800 }}>Document Vault (DMS)</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input type="text" readOnly placeholder="Search documents via OCR index..." style={{ padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', fontSize: '10px' }} />
            </div>
          </div>
        );
      case 'dashboard_dms_searched':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800 }}>Document Vault (DMS)</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input type="text" readOnly value={currentStep.simulatedInput} style={{ padding: '6px', border: '1px solid #005a9c', borderRadius: '6px', width: '100%', fontSize: '10px', background: 'rgba(0,90,156,0.05)' }} />
            </div>
            <div style={{ padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '9px' }}>
              <div style={{ fontWeight: 700 }}>Search Result: PO_2026_001_Uniforms.pdf</div>
              <div style={{ color: '#64748b', fontSize: '8px', marginTop: '2px', background: '#fefe03', display: 'inline', padding: '2px' }}>OCR Match: ...custom custom school <mark style={{ backgroundColor: 'yellow', fontWeight: 700 }}>uniforms</mark> for kids...</div>
              <button id="gen-audit-btn" className="btn btn-primary" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '8px', marginTop: '6px', display: 'block' }}>Generate Audit Pack</button>
            </div>
          </div>
        );
      case 'dashboard_dms_generating':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <div className="pulse-glow" style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>
              ⏳ Bundling cryptographically sealed files...
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>Aggregating PO, GRN, Invoices & Banking Vouchers</div>
          </div>
        );
      case 'dashboard_dms_zip_ready':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ color: '#16a34a', fontSize: '24px' }}>✓</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a' }}>Audit Pack ZIP Compiled!</div>
            <div style={{ fontSize: '9px', background: 'white', padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              📁 <strong>SOS_Liberia_AuditPack_PR-2026-001.zip</strong>
            </div>
          </div>
        );
      case 'supplier_reset_pass':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'white', height: '100%', justifyContent: 'center' }}>
            <div id="reset-panel" style={{ border: '1px solid #dc2626', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9px' }}>
              <div style={{ fontWeight: 800, color: '#dc2626' }}>⚠️ First-Time Login Password Reset</div>
              <input type="password" readOnly value="••••••••" placeholder="New Password" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              <input type="password" readOnly value="••••••••" placeholder="Confirm Password" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              <button className="btn btn-primary" style={{ padding: '6px', borderRadius: '4px', fontSize: '10px', background: '#dc2626', border: 'none' }}>Update & Confirm Account</button>
            </div>
          </div>
        );
      case 'supplier_compliance_warning':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>Vendor Compliance scorecard</div>
            <div style={{ padding: '8px', background: 'rgba(217, 119, 6, 0.08)', borderLeft: '4px solid #d97706', borderRadius: '4px', fontSize: '9px', color: '#92400e' }}>
              ⚠️ ALERT: Your Tax Clearance Certificate will expire in 8 days. Click renew below to maintain bidding eligibility.
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
              <span style={{ fontSize: '10px' }}>Tax Clearance Doc</span>
              <button id="renew-btn" className="btn btn-secondary" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '8px' }}>Renew / Upload</button>
            </div>
          </div>
        );
      case 'supplier_compliance_renew_modal':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'white', height: '100%', border: '2px solid hsl(var(--sos-blue))', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'hsl(var(--sos-blue))' }}>Renew Vetting Document</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9px' }}>
              <div style={{ padding: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', borderRadius: '4px' }}>📄 Click to Select Renewed PDF Copy</div>
              <label style={{ fontWeight: 700 }}>New Expiry Date *</label>
              <input type="text" readOnly value="2027-12-31" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              <button className="btn btn-primary" style={{ padding: '6px', borderRadius: '4px', fontSize: '9px', marginTop: '4px' }}>Upload & Clear Warnings</button>
            </div>
          </div>
        );
      case 'supplier_rfx_bidding':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', height: '100%', overflowY: 'auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Invited RFQs & Bid Proposal Submission</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '9px' }}>
              <div style={{ padding: '6px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                <strong>RFQ-2026-002 (Laptops)</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <input type="text" readOnly value="$6,900 USD" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                <input type="text" readOnly value="5 Days" style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </div>
              <button id="submit-sealed-bid" className="btn btn-primary" style={{ padding: '6px', borderRadius: '4px', fontSize: '9px', marginTop: '4px' }}>Submit Cryptographically Sealed Proposal</button>
            </div>
          </div>
        );
      case 'supplier_rfx_complete':
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ color: '#16a34a', fontSize: '24px' }}>✓</div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', textAlign: 'center' }}>
              Bid Submitted Successfully!<br />
              <span style={{ fontSize: '8px', color: '#64748b' }}>Sealed under SHA-256 integrity locks.</span>
            </div>
          </div>
        );
      case 'landing':
      default:
        return (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'white', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 90, 156, 0.1)', color: 'hsl(var(--sos-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>SOS Children's Villages Liberia</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>E-Procurement Control Center</div>
            </div>
            <button className="btn btn-primary" style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Play Sourcing Simulation <ArrowRight size={12} />
            </button>
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(2, 6, 23, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
      padding: '20px'
    }} className="fade-in">
      <div className="glass-panel" style={{
        width: '94%',
        maxWidth: '1200px',
        height: '85vh',
        backgroundColor: '#020617',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        overflow: 'hidden'
      }}>
        {/* Track Sidebar */}
        <div style={{
          borderRight: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#090d1f',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'hsl(var(--sos-gold))' }}>
              <Film size={20} />
              <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'white' }}>Training Videos</h4>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
              Select a visual tutorial tracking simulation to learn how to operate specific role tools.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {videoTracks.map(track => (
              <button
                key={track.id}
                onClick={() => {
                  setActiveTrackId(track.id);
                  handleReset();
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTrackId === track.id ? 'rgba(0, 90, 156, 0.2)' : 'transparent',
                  borderLeft: activeTrackId === track.id ? '4px solid hsl(var(--sos-blue))' : '4px solid transparent',
                  color: activeTrackId === track.id ? 'white' : '#94a3b8',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.3 }}>{track.title}</span>
                <span style={{ fontSize: '10px', color: activeTrackId === track.id ? 'hsl(var(--sos-gold))' : '#64748b' }}>{track.role}</span>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{
              marginTop: 'auto',
              padding: '10px',
              borderRadius: '8px',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '12px',
              fontWeight: 700,
              background: 'transparent'
            }}
          >
            Close Training Center
          </button>
        </div>

        {/* Video Player Viewport */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#020617',
          position: 'relative'
        }}>
          {/* Top Video Header */}
          <div style={{
            padding: '20px 30px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'white', margin: 0 }}>{activeTrack.title}</h3>
              <span style={{ fontSize: '11px', color: 'hsl(var(--sos-gold))', fontWeight: 600 }}>Active Track: {activeTrack.role}</span>
            </div>
            <button 
              onClick={onClose}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Actual simulated Video Screen Canvas */}
          <div style={{
            flex: 1,
            margin: '30px',
            borderRadius: '16px',
            border: '2px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            backgroundColor: '#f8fafc',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Render MOCK Screen */}
            {renderSimulatedScreen()}

            {/* DYNAMIC cursor simulation */}
            {isPlaying && currentStep.cursorPos && (
              <div style={{
                position: 'absolute',
                top: currentStep.cursorPos.y,
                left: currentStep.cursorPos.x,
                color: 'red',
                pointerEvents: 'none',
                zIndex: 9999,
                transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))'
              }}>
                <MousePointer2 size={24} fill="red" />
                <div style={{
                  position: 'absolute',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.4)',
                  top: 0,
                  left: 0,
                  transform: 'translate(-25%, -25%) scale(1)',
                  animation: 'pulse-glow 1s infinite'
                }} />
              </div>
            )}
            
            {/* Visual Highlight outline */}
            {isPlaying && currentStep.highlightElement && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 999,
                border: '3px solid hsl(var(--sos-gold))',
                borderRadius: '8px',
                animation: 'pulse-glow 1.5s infinite',
                boxShadow: '0 0 15px hsl(var(--sos-gold))'
              }} />
            )}
          </div>

          {/* Subtitles & Voiceover Narration Bar */}
          <div style={{
            margin: '0 30px',
            padding: '16px 24px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            color: '#e2e8f0',
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: 1.5,
            textAlign: 'center',
            minHeight: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            🎙️ {currentStep.narration}
          </div>

          {/* Player controls */}
          <div style={{
            padding: '20px 30px 30px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <button
              onClick={handlePlayPause}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--sos-blue))',
                border: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
            </button>

            <button
              onClick={handleReset}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>

            {/* Video progress slider */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>0:00</span>
              <div style={{
                flex: 1,
                height: '6px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: 'hsl(var(--sos-gold))',
                  transition: 'width 0.3s linear'
                }} />
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{activeTrack.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowRight, 
  TrendingUp, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Award,
  Building,
  Users
} from 'lucide-react';
import type { User } from '../data/mockData';
import { MOCK_USERS } from '../data/mockData';
import { VideoTrainingModal } from './VideoTrainingModal';

interface LandingPageProps {
  onEnterDashboard: (selectedUser: User) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[1]); // Default to Tamba Cooper (Procurement Officer)
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoTrainingOpen, setIsVideoTrainingOpen] = useState(false);

  // Vendor Registration State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorCategory, setVendorCategory] = useState('Educational Supplies & Uniforms');
  const [vendorTaxId, setVendorTaxId] = useState('');
  const [vendorCertName, setVendorCertName] = useState('Professional License');
  const [busRegExpiry, setBusRegExpiry] = useState('2027-12-31');
  const [taxClearExpiry, setTaxClearExpiry] = useState('2026-06-05'); // Seed to match 8 days warning if they don't change it!
  const [certExpiry, setCertExpiry] = useState('2026-08-31');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegSuccess, setShowRegSuccess] = useState(false);

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !vendorContact || !vendorEmail || !vendorPhone || !vendorTaxId) {
      alert("Please fill in all mandatory due diligence fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newSupplier = {
        id: `SUP-${Date.now().toString().slice(-4)}`,
        name: vendorName,
        category: vendorCategory,
        taxId: vendorTaxId,
        bankAccount: 'LR-' + Math.floor(100000 + Math.random() * 900000) + '-ECB',
        bankName: 'Ecobank Liberia Limited',
        contactName: vendorContact,
        email: vendorEmail,
        phone: vendorPhone,
        rating: 5.0,
        deliveryTimeRating: 5.0,
        qualityRating: 5.0,
        complianceRating: 5.0,
        isBlacklisted: false,
        accountStatus: 'PENDING_REVIEW', // Tamba must approve first!
        documents: [
          { name: 'Business_Registration_Certificate.pdf', expiryDate: busRegExpiry, status: 'VALID' },
          { name: 'Tax_Clearance_Certificate.pdf', expiryDate: taxClearExpiry, status: 'VALID' },
          { name: `${vendorCertName.replace(/\s+/g, '_')}_License.pdf`, expiryDate: certExpiry, status: 'VALID' }
        ]
      };
      
      const existing = localStorage.getItem('CUSTOM_SUPPLIERS');
      const suppliersList = existing ? JSON.parse(existing) : [];
      suppliersList.push(newSupplier);
      localStorage.setItem('CUSTOM_SUPPLIERS', JSON.stringify(suppliersList));
      
      setIsSubmitting(false);
      setShowRegSuccess(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    setIsRegisterModalOpen(false);
    setShowRegSuccess(false);
    setVendorName('');
    setVendorContact('');
    setVendorEmail('');
    setVendorPhone('');
    setVendorTaxId('');
    setVendorCertName('Professional License');
  };

  const carouselSlides = [
    {
      image: '/assets/sos_liberia_village.png',
      title: 'SOS Children’s Village Liberia',
      desc: 'Nurturing family homes and safe communities in Juah Town and Monrovia.',
      tag: 'Community Care'
    },
    {
      image: '/assets/sos_liberia_school.png',
      title: 'SOS Children’s Villages School',
      desc: 'Quality primary and vocational education, bridging literacy and tech skills.',
      tag: 'Education'
    },
    {
      image: '/assets/sos_liberia_clinic.png',
      title: 'SOS Pediatric Medical Center',
      desc: 'State-of-the-art health clinics providing crucial pediatric care and medicine.',
      tag: 'Healthcare'
    },
    {
      image: '/assets/sos_dashboard_mockup.png',
      title: 'ProcureSphere 360 Control Center',
      desc: 'Advanced digital ledgers, audit-ready workflows, and real-time NGO tracking.',
      tag: 'Governance'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(0, 90, 156, 0.05) 0%, rgba(2, 6, 23, 0.02) 90%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Top Banner Navigation */}
      <header className="glass-panel" style={{
        margin: '20px auto 0',
        width: '92%',
        maxWidth: '1400px',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,90,156,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/logo.jpg" alt="SOS Children's Villages Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'hsl(var(--sos-blue))', letterSpacing: '-0.5px' }}>
              SOS ProcureSphere<span style={{ color: 'hsl(var(--sos-gold))' }}>360</span>
            </h1>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Liberia Country Program
            </span>
          </div>
        </div>

        {/* Quick Profile Switcher for Demo testing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', display: 'block' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Role Simulation Active:</div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{currentUser.name}</div>
          </div>
          <select 
            value={currentUser.id} 
            onChange={(e) => {
              const u = MOCK_USERS.find(user => user.id === e.target.value);
              if (u) setCurrentUser(u);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '13px',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>

          <button 
            onClick={() => setIsVideoTrainingOpen(true)} 
            className="btn btn-secondary"
            style={{ 
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontSize: '13px', 
              background: 'rgba(255, 204, 0, 0.1)', 
              border: '1px solid hsl(var(--sos-gold))', 
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🎥 Training Videos
          </button>

          <button 
            onClick={() => setIsRegisterModalOpen(true)} 
            className="btn btn-secondary"
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', background: 'transparent', border: '1px solid hsl(var(--sos-blue))', color: 'hsl(var(--sos-blue))' }}
          >
            Register as Vendor
          </button>

          <button 
            onClick={() => onEnterDashboard(currentUser)} 
            className="btn btn-primary"
            style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px' }}
          >
            Enter Platform <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main style={{
        flex: 1,
        width: '92%',
        maxWidth: '1400px',
        margin: '40px auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left Side: Stats and Hero Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="slide-in">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(0, 90, 156, 0.08)',
            color: 'hsl(var(--sos-blue))',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            width: 'fit-content'
          }}>
            <Globe size={14} className="float-animation" /> Safe, Secure & Donor Audit-Compliant Platform
          </div>

          <h2 style={{
            fontSize: '48px',
            lineHeight: 1.15,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-1.5px'
          }}>
            Unified <span style={{ color: 'hsl(var(--sos-blue))', position: 'relative' }}>
              Procure-to-Pay
            </span> & <span style={{ color: 'hsl(var(--sos-blue))' }}>Document Control</span> Center.
          </h2>

          <p style={{
            fontSize: '17px',
            color: '#475569',
            lineHeight: 1.7,
            maxWidth: '560px'
          }}>
            Designed specifically for **SOS Children’s Villages Liberia**. Reduce manual tasks, enforce segregation of duties, monitor remaining grants, and generate comprehensive **One-Click Donor Audit Packs** instantaneously.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '10px' }}>
            <button 
              onClick={() => onEnterDashboard(currentUser)} 
              className="btn btn-primary" 
              style={{ padding: '14px 24px', borderRadius: '10px', fontSize: '14px' }}
            >
              Access Requisitions <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => setIsRegisterModalOpen(true)} 
              className="btn btn-secondary" 
              style={{ padding: '14px 24px', borderRadius: '10px', fontSize: '14px', border: '1px solid hsl(var(--sos-blue))', background: 'transparent', color: 'hsl(var(--sos-blue))' }}
            >
              Register as Vendor <Shield size={16} />
            </button>
            <button 
              onClick={() => onEnterDashboard(MOCK_USERS[4])} // Switch to auditor directly!
              className="btn btn-secondary" 
              style={{ padding: '14px 24px', borderRadius: '10px', fontSize: '14px' }}
            >
              Auditor Vault <Award size={16} />
            </button>
          </div>

          {/* Stats Indicators Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '20px'
          }}>
            {/* Stat 1 */}
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 204, 0, 0.15)',
                color: 'hsl(var(--sos-gold-light), 20%)',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={24} style={{ color: '#d97706' }} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>$755,000</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Annual Grant Allocation</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: 'rgba(0, 90, 156, 0.08)',
                color: 'hsl(var(--sos-blue))',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>100%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Compliance Audit Rating</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: 'rgba(22, 163, 74, 0.08)',
                color: '#16a34a',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>4 Sites</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>SOS Liberia Locations</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="glass-panel" style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: 'rgba(147, 51, 234, 0.08)',
                color: '#9333ea',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>24 Partners</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Onboarded Suppliers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Photo Carousel of Liberia Villages */}
        <div style={{ position: 'relative', width: '100%', height: '560px' }}>
          {/* Main Display Card */}
          <div className="glass-panel" style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#020617'
          }}>
            {/* Image slides */}
            {carouselSlides.map((slide, index) => (
              <div 
                key={index} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: activeSlide === index ? 1 : 0,
                  transform: activeSlide === index ? 'scale(1)' : 'scale(1.05)',
                  transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                  zIndex: activeSlide === index ? 2 : 1
                }}
              >
                {/* Fallback pattern in case image takes time */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(2, 6, 23, 0.92) 85%)',
                  zIndex: 3
                }} />
                
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    // Fallback visual illustration in case of render delays
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Tag Badge */}
                <span style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(0, 90, 156, 0.85)',
                  backdropFilter: 'blur(5px)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '30px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  zIndex: 4
                }}>
                  {slide.tag}
                </span>

                {/* Text Details overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '36px',
                  left: '36px',
                  right: '36px',
                  zIndex: 4,
                  color: 'white'
                }}>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    marginBottom: '8px',
                    fontFamily: 'var(--font-heading)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    color: '#ffffff'
                  }}>
                    {slide.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#cbd5e1',
                    lineHeight: 1.5,
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                  }}>
                    {slide.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Manual Arrows overlay */}
            <button 
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <ChevronLeft size={20} />
            </button>

            <button 
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              <ChevronRight size={20} />
            </button>

            {/* Navigation Dots overlay */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '36px',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}>
              {carouselSlides.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveSlide(index)}
                  style={{
                    width: activeSlide === index ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: activeSlide === index ? 'hsl(var(--sos-gold))' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto',
        backgroundColor: 'rgba(255,255,255,0.4)',
        zIndex: 5
      }}>
        © 2026 SOS Children’s Villages Liberia. All rights reserved. Managed under global NGO Procurement Standards and ISO 15489.
      </footer>

      {/* Vendor Registration Modal Overlay */}
      {isRegisterModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} className="fade-in">
          <div style={{
            background: 'white',
            width: '640px',
            maxWidth: '100%',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            
            {/* Modal Header */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, #fafafa, white)'
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'hsl(var(--sos-blue))', margin: 0 }}>
                  Vendor Pre-qualification Portal
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  SOS Children's Villages Liberia Sourcing
                </span>
              </div>
              <button 
                onClick={handleCloseModal}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#475569',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
              >
                ✕
              </button>
            </div>

            {!showRegSuccess ? (
              <form onSubmit={handleSubmitRegistration} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(0, 90, 156, 0.04)',
                  borderLeft: '4px solid hsl(var(--sos-blue))',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '12px',
                  color: '#334155',
                  lineHeight: '1.5'
                }}>
                  <strong>Vendor Notice:</strong> Registering your company puts your business in our vendor database. Once approved, you will receive temporary credentials to participate in relevant RFP sourcing contracts.
                </div>

                {/* Grid Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Company Legal Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Liberia Construction Corp"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Contact Person Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      value={vendorContact}
                      onChange={(e) => setVendorContact(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Business Email *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. sales@liberiacorp.com"
                      value={vendorEmail}
                      onChange={(e) => setVendorEmail(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Phone Number *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. +231-886-555-123"
                      value={vendorPhone}
                      onChange={(e) => setVendorPhone(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Service Category *</label>
                    <select 
                      value={vendorCategory}
                      onChange={(e) => setVendorCategory(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none', backgroundColor: 'white' }}
                    >
                      <option value="Educational Supplies & Uniforms">Educational Supplies & Uniforms</option>
                      <option value="Transportation & Vehicle Spare Parts">Transportation & Vehicle Spare Parts</option>
                      <option value="IT Equipment & Networking Hardware">IT Equipment & Networking Hardware</option>
                      <option value="Medical Equipment & Pharmaceuticals">Medical Equipment & Pharmaceuticals</option>
                      <option value="Building & Construction Services">Building & Construction Services</option>
                      <option value="Electrical & Power Contractors">Electrical & Power Contractors</option>
                      <option value="Plumbing & Sanitation Systems">Plumbing & Sanitation Systems</option>
                      <option value="Catering & Hospitality Services">Catering & Hospitality Services</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Tax Registration TIN *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. TAX-LR-99881-X"
                      value={vendorTaxId}
                      onChange={(e) => setVendorTaxId(e.target.value)}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Required Due Diligence Files
                  </h4>
                  
                  {/* File 1: Business Registration */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>1. Business Registration Certificate *</span>
                      <span style={{ fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>✓ Attached (Simulated)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Certificate Expiry Date:</span>
                      <input 
                        type="date"
                        value={busRegExpiry}
                        onChange={(e) => setBusRegExpiry(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '11px', outline: 'none', background: 'white' }}
                      />
                    </div>
                  </div>

                  {/* File 2: Tax Clearance */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>2. Valid Tax Clearance Certificate *</span>
                      <span style={{ fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>✓ Attached (Simulated)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Certificate Expiry Date:</span>
                      <input 
                        type="date"
                        value={taxClearExpiry}
                        onChange={(e) => setTaxClearExpiry(e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '11px', outline: 'none', background: 'white' }}
                      />
                      <span style={{ fontSize: '9px', color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Default seeds 8 days left warning</span>
                    </div>
                  </div>

                  {/* File 3: Area Certification */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>3. Area Professional Certification / License *</span>
                      <span style={{ fontSize: '10px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>✓ Attached (Simulated)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginTop: '4px' }}>
                      <input 
                        type="text"
                        placeholder="e.g. MPW Plumbing Board License"
                        value={vendorCertName}
                        onChange={(e) => setVendorCertName(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '11px', outline: 'none' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>Expires:</span>
                        <input 
                          type="date"
                          value={certExpiry}
                          onChange={(e) => setCertExpiry(e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '11px', outline: 'none', background: 'white', width: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Debarment terms box */}
                <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', lineHeight: '1.4', padding: '0 10px' }}>
                  By submitting this dossier, you declare under penalty of perjury and vendor debarment that all documents are authentic, up-to-date, and authorized. SOS Children's Villages Liberia maintains an audit-ready vendor registry checked by international donors.
                </div>

                {/* Form Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '20px',
                  marginTop: '10px'
                }}>
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="btn btn-secondary"
                    style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px' }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} /> Processing Dossier...
                      </>
                    ) : (
                      <>
                        Submit Pre-qualification Dossier
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ padding: '40px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  boxShadow: '0 4px 12px rgba(22,163,74,0.15)'
                }}>
                  ✓
                </div>
                <div>
                  <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                    Dossier Submitted Successfully!
                  </h4>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: '0 auto', maxWidth: '480px' }}>
                    Your vendor pre-qualification application for <strong style={{ color: 'hsl(var(--sos-blue))' }}>{vendorName}</strong> has been logged inside the secure SOS Audit Registry!
                  </p>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'left',
                  width: '100%',
                  fontSize: '12.5px',
                  color: '#334155',
                  lineHeight: '1.6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: 'hsl(var(--sos-blue))' }}>•</span>
                    <span>An automated due-diligence review task has been routed to <strong>Tamba Cooper (Procurement Officer)</strong> at the Monrovia National Office.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: 'hsl(var(--sos-blue))' }}>•</span>
                    <span>Upon document verification, SOS will activate your account and issue a <strong>Temporary Password</strong> to <strong style={{ color: 'hsl(var(--sos-blue))' }}>{vendorEmail}</strong>.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: 'hsl(var(--sos-blue))' }}>•</span>
                    <span>You will be forced to change this temporary password on your first login, which confirms your official vendor registration on **SOS ProcureSphere 360**.</span>
                  </div>
                </div>

                <button 
                  onClick={handleCloseModal}
                  className="btn btn-primary"
                  style={{ padding: '12px 30px', borderRadius: '8px', fontSize: '14px', marginTop: '10px' }}
                >
                  Return to Public Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Video Training Modal */}
      <VideoTrainingModal isOpen={isVideoTrainingOpen} onClose={() => setIsVideoTrainingOpen(false)} />
    </div>
  );
};

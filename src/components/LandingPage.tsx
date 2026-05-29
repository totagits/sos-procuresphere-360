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

interface LandingPageProps {
  onEnterDashboard: (selectedUser: User) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[1]); // Default to Tamba Cooper (Procurement Officer)
  const [activeSlide, setActiveSlide] = useState(0);

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

          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <button 
              onClick={() => onEnterDashboard(currentUser)} 
              className="btn btn-primary" 
              style={{ padding: '14px 28px', borderRadius: '10px', fontSize: '15px' }}
            >
              Access Requisitions <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onEnterDashboard(MOCK_USERS[4])} // Switch to auditor directly!
              className="btn btn-secondary" 
              style={{ padding: '14px 28px', borderRadius: '10px', fontSize: '15px' }}
            >
              Auditor Vault <Award size={18} />
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
        backgroundColor: 'rgba(255,255,255,0.4)'
      }}>
        © 2026 SOS Children’s Villages Liberia. All rights reserved. Managed under global NGO Procurement Standards and ISO 15489.
      </footer>
    </div>
  );
};

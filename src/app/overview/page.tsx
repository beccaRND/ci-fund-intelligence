'use client';

import { useEffect, useRef, useState } from 'react';

const PLATFORM_URL = 'https://ci-fund-intelligence.vercel.app';
const LOOM_URL = 'https://www.loom.com/share/3460de6c064846b991c13af82c8249af';

// ─── App frame mockup wrapper ──────────────────────────────────────────────
function AppFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ background: '#232323', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{ flex: 1, margin: '0 12px', background: '#383838', borderRadius: 5, padding: '4px 12px', fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
          ci-fund-intelligence.vercel.app
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ─── Dashboard mockup ─────────────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div style={{ background: '#F5F4F0', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { value: '1,111,404', label: 'ha enrolled', badge: 'Target exceeded' },
          { value: '105,145', label: 'beneficiaries', badge: '↑116% YOY' },
          { value: '11', label: 'active grantees', badge: null },
          { value: 'Year 4', label: 'of operation', badge: 'Active' },
        ].map((k) => (
          <div key={k.label} style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#2D2D2D', fontFamily: 'monospace', lineHeight: 1.1 }}>{k.value}</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{k.label}</div>
            {k.badge && <div style={{ marginTop: 5, display: 'inline-block', background: '#E8F5EF', color: '#007A4D', fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 99 }}>{k.badge}</div>}
          </div>
        ))}
      </div>
      {/* Chart + Map row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 10 }}>
        {/* Chart */}
        <div style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#2D2D2D', marginBottom: 8 }}>Hectare Growth 2022–2024</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
            {[
              { year: '2022', direct: 30, indirect: 0 },
              { year: '2023', direct: 74, indirect: 0 },
              { year: '2024', direct: 95, indirect: 30 },
            ].map((b) => (
              <div key={b.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {b.indirect > 0 && <div style={{ height: b.indirect * 0.6, background: '#A8DFC8', borderRadius: '4px 4px 0 0' }} />}
                  <div style={{ height: b.direct * 0.6, background: '#00A86B', borderRadius: b.indirect > 0 ? 0 : '4px 4px 0 0' }} />
                </div>
                <div style={{ fontSize: 9, color: '#888' }}>{b.year}</div>
              </div>
            ))}
            <div style={{ width: 1, background: '#ddd', height: '100%', marginLeft: 4 }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#666' }}><div style={{ width: 10, height: 10, background: '#00A86B', borderRadius: 2 }} />Direct</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#666' }}><div style={{ width: 10, height: 10, background: '#A8DFC8', borderRadius: 2 }} />Indirect</div>
          </div>
        </div>
        {/* Map placeholder */}
        <div style={{ background: '#2D3E2D', borderRadius: 8, overflow: 'hidden', position: 'relative', minHeight: 120 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(0,168,107,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(82,121,132,0.2) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>11 projects · 8 countries</div>
          {/* Pin dots */}
          {[{ t: '25%', l: '60%' }, { t: '40%', l: '30%' }, { t: '55%', l: '75%' }, { t: '30%', l: '20%' }].map((p, i) => (
            <div key={i} style={{ position: 'absolute', top: p.t, left: p.l, width: 8, height: 8, background: '#00A86B', borderRadius: '50%', border: '1.5px solid #fff', boxShadow: '0 0 6px rgba(0,168,107,0.6)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Project profile mockup ───────────────────────────────────────────────
function ProjectMockup() {
  return (
    <div style={{ background: '#F5F4F0', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D', marginBottom: 4 }}>Eastern Cape Sheep Wool</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ background: '#6B9E6B', color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>Wool</span>
          <span style={{ background: '#E8F5EF', color: '#007A4D', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>Active</span>
          <span style={{ background: '#F0F0EC', color: '#666', fontSize: 9, padding: '2px 8px', borderRadius: 99 }}>15,791 ha · 377 beneficiaries</span>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
        {['Climate', 'Soil', 'Water', 'Biodiversity', 'Livelihoods', 'Animal Welfare'].map((t, i) => (
          <div key={t} style={{ flex: 1, textAlign: 'center', padding: '5px 0', fontSize: 8, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#00A86B' : '#888', borderBottom: i === 0 ? '2px solid #00A86B' : '2px solid #e5e5e5', cursor: 'pointer' }}>{t}</div>
        ))}
      </div>
      {/* Data panel */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#2D2D2D', marginBottom: 8 }}>Climate Data — Open-Meteo Satellite</div>
        {[
          { label: 'Annual rainfall', value: '482 mm/yr', badge: 'Satellite' },
          { label: 'Mean temperature', value: '14.2°C', badge: 'Satellite' },
          { label: 'Growing degree days', value: '2,847 GDD', badge: 'Satellite' },
        ].map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #f0f0ec' }}>
            <span style={{ fontSize: 10, color: '#555' }}>{r.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#2D2D2D', fontFamily: 'monospace' }}>{r.value}</span>
              <span style={{ background: '#E8F5EF', color: '#007A4D', fontSize: 8, fontWeight: 600, padding: '1px 6px', borderRadius: 99 }}>{r.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── M&E indicators mockup ─────────────────────────────────────────────────
function MEMockup() {
  return (
    <div style={{ background: '#F5F4F0', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#2D2D2D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>M&E Framework — Soil Health · 9 indicators</div>
          <div style={{ display: 'flex', gap: 8, fontSize: 9, color: '#888' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A86B', display: 'inline-block' }} /> Submitted</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #00A86B', display: 'inline-block' }} /> Baseline</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid #ccc', display: 'inline-block' }} /> No data</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, height: 5, background: '#f0f0ec', borderRadius: 99 }}>
            <div style={{ width: '28%', height: '100%', background: '#00A86B', borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 9, color: '#888', fontFamily: 'monospace' }}>2/7 core with data</span>
        </div>
        {/* Indicators */}
        {[
          { id: 'sol-01', name: 'Soil Organic Carbon (SOC)', metric: 'tCO₂e/ha baseline & change', status: 'baseline', freq: 'Annual' },
          { id: 'sol-02', name: 'Soil Bulk Density', metric: 'g/cm³ — depth-weighted avg', status: 'baseline', freq: 'Biannual' },
          { id: 'sol-03', name: 'Soil pH', metric: 'pH units, 0–30cm', status: 'none', freq: 'Biannual' },
          { id: 'sol-04', name: 'Aggregate Stability', metric: 'Mean weight diameter (mm)', status: 'none', freq: 'Biannual' },
        ].map((ind) => (
          <div key={ind.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 0', borderBottom: '1px solid #f5f5f2' }}>
            <div style={{ marginTop: 2, flexShrink: 0 }}>
              {ind.status === 'baseline' ? (
                <svg width="11" height="11" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#00A86B" strokeWidth="1.5" /><path d="M6 1 A5 5 0 0 1 11 6 L6 6 Z" fill="#00A86B" /></svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#ccc" strokeWidth="1.5" /></svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#2D2D2D' }}>{ind.name}</div>
              <div style={{ fontSize: 9, color: '#888', marginTop: 1 }}>{ind.metric}</div>
            </div>
            <div style={{ flexShrink: 0 }}>
              {ind.status === 'baseline' && <span style={{ background: '#E8F5EF', color: '#007A4D', fontSize: 8, fontWeight: 600, padding: '1px 6px', borderRadius: 99 }}>Satellite baseline</span>}
              {ind.status === 'none' && <span style={{ background: '#f5f5f2', color: '#aaa', fontSize: 8, fontWeight: 600, padding: '1px 6px', borderRadius: 99 }}>No data</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Partner dashboard mockup ─────────────────────────────────────────────
function PartnerMockup() {
  return (
    <div style={{ background: '#F5F4F0', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2D2D2D' }}>Kering</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>Luxury Fashion · Founding Partner · Since 2021</div>
          </div>
          <div style={{ background: '#00A86B', color: '#fff', fontSize: 10, fontWeight: 600, padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Export Impact Report</div>
        </div>
      </div>
      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
        {[
          { v: '489,546', l: 'ha attributed' },
          { v: '433', l: 'farmer beneficiaries' },
          { v: '6', l: 'projects' },
          { v: 'Year 4', l: 'founding partner' },
        ].map((k) => (
          <div key={k.l} style={{ background: '#fff', borderRadius: 7, padding: '8px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2D2D2D', fontFamily: 'monospace' }}>{k.v}</div>
            <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>{k.l}</div>
          </div>
        ))}
      </div>
      {/* Attribution table */}
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0ec', fontSize: 10, fontWeight: 600, color: '#2D2D2D' }}>Attributed Projects</div>
        {[
          { name: 'Patagonia Wool & Specialty Fibres', type: 'Direct', ha: '299,142 ha', commodity: 'wool' },
          { name: 'Sustainable Cashmere Landscapes', type: 'Direct', ha: '178,909 ha', commodity: 'cashmere' },
          { name: 'Eastern Cape Sheep Wool', type: 'Portfolio', ha: '7,895 ha', commodity: 'wool' },
        ].map((p) => (
          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #f8f8f5' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#2D2D2D' }}>{p.name}</div>
              <div style={{ fontSize: 9, color: '#888', marginTop: 1 }}>
                <span style={{ background: p.type === 'Direct' ? '#E8F5EF' : '#E8F5F5', color: p.type === 'Direct' ? '#007A4D' : '#527984', fontSize: 8, fontWeight: 600, padding: '1px 6px', borderRadius: 99, marginRight: 5 }}>{p.type}</span>
                {p.commodity}
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#00A86B', fontFamily: 'monospace' }}>{p.ha}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Feature block ─────────────────────────────────────────────────────────
function Feature({
  eyebrow,
  heading,
  body,
  mockup,
  reverse = false,
  index,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  mockup: React.ReactNode;
  reverse?: boolean;
  index: number;
}) {
  return (
    <div
      className="fade-in-on-scroll"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
        padding: '80px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ order: reverse ? 2 : 1 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 13, fontWeight: 600, color: '#00A86B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>{eyebrow}</div>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 700, color: '#1C1C1C', lineHeight: 1.25, marginBottom: 20, margin: 0 }}>{heading}</h3>
        <p style={{ fontSize: 17, color: '#4A4A4A', lineHeight: 1.75, marginTop: 20, marginBottom: 0 }}>{body}</p>
      </div>
      <div style={{ order: reverse ? 1 : 2 }}>
        <AppFrame>{mockup}</AppFrame>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function OverviewPage() {
  const heroRef = useRef<HTMLElement>(null);
  const [showNav, setShowNav] = useState(false);

  // Sticky nav visibility via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowNav(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.fade-in-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Global styles for this page ──────────────────────────────── */}
      <style>{`
        .fade-in-on-scroll {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .fade-in-on-scroll.in-view {
          opacity: 1;
          transform: none;
        }
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .feature-grid > * { order: unset !important; }
          .stat-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 24px !important; }
          .hero-btns { flex-direction: column !important; align-items: flex-start !important; }
          .nav-label { display: none !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── Sticky nav ────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56, background: 'rgba(250,250,247,0.92)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        opacity: showNav ? 1 : 0,
        pointerEvents: showNav ? 'auto' : 'none',
        transition: 'opacity 200ms ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#00A86B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>CI</span>
          </div>
          <span className="nav-label" style={{ fontSize: 13, color: '#4A4A4A', fontWeight: 500 }}>Regenerative Fund for Nature</span>
        </div>
        <a href={PLATFORM_URL} target="_blank" rel="noopener noreferrer" style={{
          background: '#00A86B', color: '#fff', padding: '8px 18px', borderRadius: 4,
          fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}>
          Enter the Dashboard →
        </a>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px 40px',
        background: `
          radial-gradient(ellipse at 15% 70%, rgba(0,168,107,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 25%, rgba(82,121,132,0.22) 0%, transparent 50%),
          radial-gradient(ellipse at 60% 80%, rgba(45,78,45,0.3) 0%, transparent 40%),
          linear-gradient(160deg, #111E11 0%, #1C2B1C 45%, #162220 100%)
        `,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Topographic texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cellipse cx='100' cy='100' rx='90' ry='40' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cellipse cx='100' cy='100' rx='70' ry='30' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cellipse cx='100' cy='100' rx='50' ry='20' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cellipse cx='100' cy='100' rx='30' ry='12' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />

        <div style={{ maxWidth: 780, position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 600, color: 'rgba(0,168,107,0.9)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            Conservation International
          </div>

          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, lineHeight: 1.1, margin: 0, color: '#fff' }}>
            <span style={{ display: 'block', fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 400, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
              Regenerative Fund for Nature
            </span>
            <span style={{ fontSize: 'clamp(42px, 6vw, 72px)' }}>
              Fund Intelligence<br />Platform
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(17px, 2.2vw, 22px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: '28px 0 40px', maxWidth: 580 }}>
            A centralized view of the fund's impact across 11 grantees, 8 countries, and 1.1 million enrolled hectares.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href={PLATFORM_URL} target="_blank" rel="noopener noreferrer" style={{
              background: '#00A86B', color: '#fff', padding: '14px 28px', borderRadius: 4,
              fontSize: 15, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Explore the Platform →
            </a>
            <a href={LOOM_URL} style={{
              background: 'transparent', color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,255,255,0.3)', padding: '14px 28px', borderRadius: 4,
              fontSize: 15, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.02em',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              ▶ Watch the Walkthrough
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))' }} />
        </div>
      </section>

      {/* ── Content wrapper ───────────────────────────────────────────── */}
      <div style={{ background: '#FAFAF7' }}>

        {/* ── Problem ───────────────────────────────────────────────── */}
        <section className="fade-in-on-scroll" style={{ maxWidth: 720, margin: '0 auto', padding: '100px 40px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#2D2D2D', lineHeight: 1.8, margin: '0 0 28px' }}>
            The Regenerative Fund for Nature operates across 11 grantees in 8 countries, spanning cotton, wool, cashmere, and leather supply chains. Each project collects data differently — different methodologies, different formats, different levels of completeness. Until now, there has been no unified view of where the fund stands, what data exists, and where the gaps are.
          </p>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(20px, 2.8vw, 26px)', color: '#00A86B', fontWeight: 400, margin: 0 }}>
            This platform changes that.
          </p>
        </section>

        {/* ── Features ──────────────────────────────────────────────── */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="fade-in-on-scroll">
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 600, color: '#00A86B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Portfolio at a Glance</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, color: '#1C1C1C', lineHeight: 1.25, margin: '0 0 20px' }}>Your fund, one screen.</h3>
              <p style={{ fontSize: 17, color: '#4A4A4A', lineHeight: 1.75, margin: 0 }}>
                Every project on a satellite map. Hectare growth from 260,000 to 1.1 million — year over year, direct and indirect. Data completeness across all six fund principles. The first ten minutes of your day, answered before you open a spreadsheet.
              </p>
            </div>
            <div className="fade-in-on-scroll" style={{ transitionDelay: '100ms' }}>
              <AppFrame><DashboardMockup /></AppFrame>
            </div>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="fade-in-on-scroll" style={{ transitionDelay: '100ms' }}>
              <AppFrame><ProjectMockup /></AppFrame>
            </div>
            <div className="fade-in-on-scroll">
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 600, color: '#00A86B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Project Intelligence</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, color: '#1C1C1C', lineHeight: 1.25, margin: '0 0 20px' }}>From coordinates to a complete profile.</h3>
              <p style={{ fontSize: 17, color: '#4A4A4A', lineHeight: 1.75, margin: 0 }}>
                Enter a project's location and the platform generates a climate profile, soil baseline, demographic context, and commodity specifications from public data sources. Where grantee-reported data exists, it layers on top. Every number is labeled with its source.
              </p>
            </div>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="fade-in-on-scroll">
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 600, color: '#00A86B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>M&E Framework</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, color: '#1C1C1C', lineHeight: 1.25, margin: '0 0 20px' }}>Your framework, built in.</h3>
              <p style={{ fontSize: 17, color: '#4A4A4A', lineHeight: 1.75, margin: 0 }}>
                57 indicators across six principles — climate, soil health, water, biodiversity, livelihoods, and animal welfare. Each indicator shows its metric, measurement method, and data completeness status. The science team's recommended data repositories are configurable.
              </p>
            </div>
            <div className="fade-in-on-scroll" style={{ transitionDelay: '100ms' }}>
              <AppFrame><MEMockup /></AppFrame>
            </div>
          </div>

          <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', padding: '80px 0' }}>
            <div className="fade-in-on-scroll" style={{ transitionDelay: '100ms' }}>
              <AppFrame><PartnerMockup /></AppFrame>
            </div>
            <div className="fade-in-on-scroll">
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 12, fontWeight: 600, color: '#00A86B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Brand Partner Views</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, color: '#1C1C1C', lineHeight: 1.25, margin: '0 0 20px' }}>Show a brand exactly what their investment achieved.</h3>
              <p style={{ fontSize: 17, color: '#4A4A4A', lineHeight: 1.75, margin: 0 }}>
                Each donor partner gets an attributed dashboard — their projects, their hectares, their fiber portfolio. Supply chain context shows the value chain from producer to certified fiber to brand shelf. A one-page impact summary exports as PDF for the brand's own reporting.
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats bar ─────────────────────────────────────────────── */}
        <section style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
          <div className="stat-grid fade-in-on-scroll" style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 40px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 32, textAlign: 'center' }}>
            {[
              { value: '1,111,404', label: 'hectares enrolled' },
              { value: '105,145', label: 'beneficiaries' },
              { value: '11', label: 'grantees' },
              { value: '57', label: 'M&E indicators' },
              { value: '6', label: 'principles' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: '#00A86B', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#7A7A7A', marginTop: 8, fontWeight: 400 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Data / Ownership ────────────────────────────────────────── */}
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 40px' }}>
          <div className="fade-in-on-scroll" style={{ marginBottom: 56 }}>
            <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#1C1C1C', marginBottom: 16, margin: 0 }}>How data gets in</h4>
            <p style={{ fontSize: 17, color: '#4A4A4A', lineHeight: 1.75, marginTop: 16 }}>
              The platform accepts your existing Excel spreadsheets for biannual M&E submissions — impact allocation and indicator tables in your current format. As the fund moves toward ActivityInfo or other systems, the platform connects directly. Public data repositories — climate, soil, demographics — are always running in the background, configurable by your science team.
            </p>
          </div>
          <div className="fade-in-on-scroll">
            <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: '#1C1C1C', margin: 0 }}>Data ownership</h4>
            <p style={{ fontSize: 15, color: '#7A7A7A', lineHeight: 1.75, marginTop: 16 }}>
              CI owns all data, all code, and the deployed platform. It runs on your infrastructure, at your URL, under your control. Public data repositories are defaults that your team selects. Regen Network provides the build and technical support — not data capture.
            </p>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section style={{
          background: `linear-gradient(160deg, #111E11 0%, #1C2B1C 60%, #162220 100%)`,
          padding: '100px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cellipse cx='100' cy='100' rx='90' ry='40' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cellipse cx='100' cy='100' rx='70' ry='30' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cellipse cx='100' cy='100' rx='50' ry='20' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
            <div className="fade-in-on-scroll">
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', lineHeight: 1.15 }}>
                Ready to see it?
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 40 }}>
                The platform is live. Explore the full prototype.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <a href={PLATFORM_URL} target="_blank" rel="noopener noreferrer" style={{
                  background: '#00A86B', color: '#fff', padding: '16px 36px', borderRadius: 4,
                  fontSize: 16, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em', width: 320, textAlign: 'center',
                }}>
                  Explore the Live Platform →
                </a>
                <a href={LOOM_URL} style={{
                  background: 'transparent', color: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.2)', padding: '14px 36px', borderRadius: 4,
                  fontSize: 15, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.02em', width: 320, textAlign: 'center',
                }}>
                  ▶ Watch the 5-Minute Walkthrough
                </a>
              </div>
            </div>

            <div style={{ marginTop: 60, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#00A86B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 11 }}>CI</span>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Conservation International</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Regenerative Fund for Nature</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 16 }}>Powered by Regen Network</div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

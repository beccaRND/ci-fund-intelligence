import {
  Globe,
  Leaf,
  Users,
  Target,
  Calendar,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const milestones = [
  { year: '2020', label: 'Fund established with founding partners' },
  { year: '2021', label: 'First 6 landscape projects onboarded' },
  { year: '2022', label: 'Expanded to 11 projects across 4 continents' },
  { year: '2023', label: 'Launched satellite monitoring & data platform' },
  { year: '2024', label: '13 active projects, 1.1M+ hectares under management' },
];

const pillars = [
  {
    icon: Leaf,
    title: 'Regenerative Agriculture',
    description:
      'Investing in farming practices that restore soil health, sequester carbon, and rebuild biodiversity across degraded landscapes.',
  },
  {
    icon: Users,
    title: 'Community Livelihoods',
    description:
      'Ensuring smallholder farmers and indigenous communities benefit directly through premium market access, training, and fair supply chains.',
  },
  {
    icon: Globe,
    title: 'Landscape-Scale Impact',
    description:
      'Operating at landscape scale across 11 countries, addressing systemic drivers of land degradation through coordinated interventions.',
  },
  {
    icon: Target,
    title: 'Data-Driven Decisions',
    description:
      'Combining satellite imagery, soil science, and field data to monitor outcomes, verify impact, and continuously improve our approach.',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-[28px] font-bold text-ci-charcoal mb-1"
          style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
        >
          About the Fund
        </h2>
        <p className="text-ci-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
          Conservation International&apos;s Regenerative Fund for Nature
        </p>
      </div>

      {/* Hero card */}
      <div className="bg-ci-green rounded-[var(--radius-lg)] p-8 mb-8 text-white">
        <h3
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Investing in Nature&apos;s Recovery
        </h3>
        <p className="text-white/90 max-w-3xl leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          The Regenerative Fund for Nature is a pioneering initiative by Conservation International
          that channels investment into regenerative agricultural landscapes worldwide. By partnering
          with commodity brands, smallholder cooperatives, and scientific institutions, the Fund drives
          measurable improvements in soil carbon, biodiversity, water quality, and farmer livelihoods
          across 1.1 million hectares in 11 countries.
        </p>
        <div className="flex flex-wrap gap-8 mt-6">
          <div>
            <div className="text-3xl font-bold">13</div>
            <div className="text-white/70 text-sm">Active Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold">1.1M ha</div>
            <div className="text-white/70 text-sm">Under Management</div>
          </div>
          <div>
            <div className="text-3xl font-bold">11</div>
            <div className="text-white/70 text-sm">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold">105K+</div>
            <div className="text-white/70 text-sm">Beneficiaries</div>
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="mb-8">
        <h3
          className="text-lg font-bold text-ci-charcoal mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Strategic Pillars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 border border-ci-gray-300/30"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-ci-green-light flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-ci-green" />
                  </div>
                  <div>
                    <h4
                      className="text-sm font-bold text-ci-charcoal mb-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-ci-gray-500 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fund Timeline */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 mb-8 border border-ci-gray-300/30">
        <div className="flex items-center gap-2 mb-5">
          <Calendar size={18} className="text-ci-green" />
          <h3
            className="text-lg font-bold text-ci-charcoal"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Fund Timeline
          </h3>
        </div>
        <div className="space-y-4">
          {milestones.map((m, i) => (
            <div key={m.year} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    i === milestones.length - 1 ? 'bg-ci-green' : 'bg-ci-gray-300'
                  }`}
                />
                {i < milestones.length - 1 && (
                  <div className="w-px h-6 bg-ci-gray-300/60" />
                )}
              </div>
              <div className="flex items-baseline gap-3 -mt-1">
                <span
                  className="text-sm font-bold text-ci-charcoal shrink-0"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {m.year}
                </span>
                <span className="text-sm text-ci-gray-500">{m.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Funding & Governance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 border border-ci-gray-300/30">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-ci-green" />
            <h3
              className="text-lg font-bold text-ci-charcoal"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Funding Model
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-ci-gray-500">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-green mt-1.5 shrink-0" />
              <span>Blended finance combining philanthropic grants with corporate commodity partnerships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-green mt-1.5 shrink-0" />
              <span>Multi-year grant cycles (3&ndash;5 years) to ensure landscape-level impact</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-green mt-1.5 shrink-0" />
              <span>Technical assistance alongside capital deployment for grantee capacity building</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-green mt-1.5 shrink-0" />
              <span>Results-based tranches tied to measurable environmental and social outcomes</span>
            </li>
          </ul>
        </div>

        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 border border-ci-gray-300/30">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-ci-green" />
            <h3
              className="text-lg font-bold text-ci-charcoal"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Governance
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-ci-gray-500">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-teal mt-1.5 shrink-0" />
              <span>Managed by Conservation International&apos;s Sustainable Landscapes team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-teal mt-1.5 shrink-0" />
              <span>Independent scientific advisory board for methodology review</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-teal mt-1.5 shrink-0" />
              <span>Annual impact reports verified through third-party audit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ci-teal mt-1.5 shrink-0" />
              <span>Community feedback loops integrated into project monitoring</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-ci-green-light rounded-[var(--radius-md)] p-6 flex items-center justify-between">
        <div>
          <h4
            className="text-sm font-bold text-ci-green-dark mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Explore Partnership Opportunities
          </h4>
          <p className="text-sm text-ci-green-dark/70">
            Learn about engagement tiers for corporate and institutional partners.
          </p>
        </div>
        <Link
          href="/partnership-tiers"
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors shrink-0"
        >
          Partnership Tiers
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

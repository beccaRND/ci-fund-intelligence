import { Check, ArrowRight, Star, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

interface Tier {
  name: string;
  icon: typeof Star;
  color: string;
  bgColor: string;
  borderColor: string;
  tagline: string;
  commitment: string;
  features: string[];
  highlighted?: boolean;
}

const tiers: Tier[] = [
  {
    name: 'Explorer',
    icon: Star,
    color: 'text-ci-teal',
    bgColor: 'bg-ci-teal-light',
    borderColor: 'border-ci-teal/20',
    tagline: 'Learn & Align',
    commitment: '$50K &ndash; $250K / year',
    features: [
      'Access to fund intelligence dashboard (read-only)',
      'Quarterly impact reports and portfolio updates',
      'Invitation to annual stakeholder convenings',
      'Brand association with CI Regenerative Fund',
      'Aggregated portfolio-level data and insights',
    ],
  },
  {
    name: 'Partner',
    icon: Zap,
    color: 'text-ci-green',
    bgColor: 'bg-ci-green-light',
    borderColor: 'border-ci-green/30',
    tagline: 'Co-Invest & Shape',
    commitment: '$250K &ndash; $1M / year',
    highlighted: true,
    features: [
      'Everything in Explorer, plus:',
      'Direct co-investment in specific landscape projects',
      'Commodity-specific supply chain data and traceability',
      'Named project attribution in CI communications',
      'Seat on Partner Advisory Council',
      'Custom data exports and API access',
      'Priority access to verified carbon and biodiversity credits',
    ],
  },
  {
    name: 'Anchor',
    icon: Crown,
    color: 'text-ci-orange',
    bgColor: 'bg-ci-orange-light',
    borderColor: 'border-ci-orange/20',
    tagline: 'Lead & Transform',
    commitment: '$1M+ / year',
    features: [
      'Everything in Partner, plus:',
      'Co-design new landscape interventions with CI scientists',
      'Dedicated fund manager and quarterly strategy sessions',
      'Custom monitoring dashboards for your supply chain regions',
      'First-look at emerging credit methodologies (VM0042, etc.)',
      'Joint publications and thought leadership opportunities',
      'Board observer seat on Fund Steering Committee',
      'White-labeled impact reporting for ESG disclosures',
    ],
  },
];

const engagementSteps = [
  {
    step: '01',
    title: 'Discovery Call',
    description: 'Meet with our partnerships team to discuss your sustainability goals and supply chain priorities.',
  },
  {
    step: '02',
    title: 'Landscape Alignment',
    description: 'We map your commodity footprint against our active projects to identify high-impact co-investment opportunities.',
  },
  {
    step: '03',
    title: 'Partnership Agreement',
    description: 'Formalize your engagement tier, define KPIs, and set up platform access for your team.',
  },
  {
    step: '04',
    title: 'Onboarding & Impact',
    description: 'Get full dashboard access, meet your project leads, and start receiving real-time monitoring data.',
  },
];

export default function PartnershipTiersPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-[28px] font-bold text-ci-charcoal mb-1"
          style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
        >
          Partnership Tiers
        </h2>
        <p className="text-ci-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
          Engagement levels for corporate and institutional partners
        </p>
      </div>

      {/* Intro */}
      <div className="bg-ci-green-light rounded-[var(--radius-md)] p-5 mb-8 border border-ci-green/10">
        <p className="text-sm text-ci-green-dark leading-relaxed">
          The Regenerative Fund for Nature offers structured partnership tiers designed to match
          your organization&apos;s sustainability ambitions with measurable, landscape-scale impact.
          Each tier provides increasing levels of data access, project influence, and brand association.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.name}
              className={`relative bg-ci-white rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border ${tier.borderColor} p-6 flex flex-col ${
                tier.highlighted ? 'ring-2 ring-ci-green/30' : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-ci-green text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}

              {/* Tier header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-[var(--radius-sm)] ${tier.bgColor} flex items-center justify-center`}>
                  <Icon size={20} className={tier.color} />
                </div>
                <div>
                  <h3
                    className="text-lg font-bold text-ci-charcoal"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {tier.name}
                  </h3>
                  <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider">
                    {tier.tagline}
                  </div>
                </div>
              </div>

              {/* Commitment */}
              <div className="mb-5 pb-5 border-b border-ci-gray-300/40">
                <div
                  className="text-lg font-bold text-ci-charcoal"
                  style={{ fontFamily: 'var(--font-display)' }}
                  dangerouslySetInnerHTML={{ __html: tier.commitment }}
                />
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {feature.endsWith(':') ? (
                      <span className="text-xs text-ci-gray-500 font-medium">{feature}</span>
                    ) : (
                      <>
                        <Check size={14} className="text-ci-green mt-0.5 shrink-0" />
                        <span className="text-sm text-ci-gray-700 leading-snug">{feature}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* How to engage */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 mb-8 border border-ci-gray-300/30">
        <h3
          className="text-lg font-bold text-ci-charcoal mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          How to Engage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {engagementSteps.map((s) => (
            <div key={s.step}>
              <div
                className="text-2xl font-bold text-ci-green/20 mb-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {s.step}
              </div>
              <h4
                className="text-sm font-bold text-ci-charcoal mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {s.title}
              </h4>
              <p className="text-xs text-ci-gray-500 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-ci-green rounded-[var(--radius-lg)] p-6 flex items-center justify-between">
        <div>
          <h4
            className="text-white font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to partner with us?
          </h4>
          <p className="text-white/70 text-sm">
            Contact our partnerships team to schedule a discovery call.
          </p>
        </div>
        <Link
          href="/about"
          className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-white text-ci-green text-sm font-semibold hover:bg-ci-cream transition-colors shrink-0"
        >
          Learn About the Fund
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

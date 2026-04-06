import { notFound } from 'next/navigation';
import { getPartnerById, getAttributionsForPartner, aggregatePartnerMetrics } from '@/lib/seed/brandPartners';
import PartnerHealthCards from '@/components/partners/PartnerHealthCards';
import PartnerDashboard from '@/components/partners/PartnerDashboard';
import ExportImpactPDF from '@/components/partners/ExportImpactPDF';

interface Props {
  params: { brandId: string };
}

export async function generateStaticParams() {
  return [{ brandId: 'kering' }, { brandId: 'inditex' }];
}

export default function PartnerPage({ params }: Props) {
  const partner = getPartnerById(params.brandId);
  if (!partner) notFound();

  const attributions = getAttributionsForPartner(params.brandId);
  const metrics = aggregatePartnerMetrics(params.brandId);

  return (
    <div className="space-y-6">
      {/* Partner header */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] px-6 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1
                className="text-2xl font-bold text-ci-charcoal"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {partner.name}
              </h1>
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-ci-green-light text-ci-green-dark capitalize"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {partner.tier} Partner
              </span>
            </div>
            <p className="text-[13px] text-ci-gray-500">
              {partner.primaryCategory} · Partner since {partner.since}
            </p>
            {partner.contactName && (
              <p className="text-[12px] text-ci-gray-400 mt-0.5">
                Contact: {partner.contactName}, {partner.contactTitle}
              </p>
            )}
          </div>
          <ExportImpactPDF partner={partner} attributions={attributions} />
        </div>
        <p className="text-sm text-ci-gray-600 mt-4 leading-relaxed max-w-3xl">
          {partner.description}
        </p>
      </div>

      {/* Health cards */}
      <PartnerHealthCards partner={partner} metrics={metrics} />

      {/* Project attribution table */}
      <PartnerDashboard attributions={attributions} />
    </div>
  );
}

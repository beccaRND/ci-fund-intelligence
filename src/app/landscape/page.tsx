import LandscapeAnalysis from '@/components/landscape/LandscapeAnalysis';
import DataSourceBadge from '@/components/shared/DataSourceBadge';

export default function LandscapePage() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-[28px] font-bold text-ci-charcoal mb-1"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
          >
            Landscape Prioritization
          </h2>
          <p className="text-ci-gray-500">
            Identify where restoration investment generates the greatest ecological and economic return.
          </p>
        </div>
        <DataSourceBadge source="computed" label="SoilGrids + Open-Meteo + Literature" />
      </div>

      <LandscapeAnalysis />
    </div>
  );
}

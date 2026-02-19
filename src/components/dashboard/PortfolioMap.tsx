'use client';

import dynamic from 'next/dynamic';

const PortfolioMapInner = dynamic(() => import('./PortfolioMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] skeleton rounded-[var(--radius-sm)] flex items-center justify-center">
      <span className="text-ci-gray-500 text-sm">Loading portfolio map...</span>
    </div>
  ),
});

export default function PortfolioMap() {
  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-1.5 mb-8">
      <PortfolioMapInner />
    </div>
  );
}

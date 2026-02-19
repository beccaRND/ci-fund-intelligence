import FundHealthCards from '@/components/dashboard/FundHealthCards';
import PortfolioMap from '@/components/dashboard/PortfolioMap';
import ProjectStatusTable from '@/components/dashboard/ProjectStatusTable';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h2
          className="text-[28px] font-bold text-ci-charcoal mb-1"
          style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
        >
          Portfolio Dashboard
        </h2>
        <p className="text-ci-gray-500" style={{ fontFamily: 'var(--font-body)' }}>
          Fund command center &mdash; all projects at a glance
        </p>
      </div>

      <FundHealthCards />

      <PortfolioMap />

      <ProjectStatusTable />
    </div>
  );
}

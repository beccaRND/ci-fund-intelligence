import Link from 'next/link';
import { projects } from '@/lib/seed/projects';
import { commodityColor, commodityLabel, formatHectares, countryFlag } from '@/lib/utils';

export default function ProjectsPage() {
  return (
    <div>
      <h2
        className="text-[28px] font-bold text-ci-charcoal mb-1"
        style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
      >
        Projects
      </h2>
      <p className="text-ci-gray-500 mb-8">
        All {projects.length} projects in the Regenerative Fund for Nature portfolio
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all p-5 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: commodityColor(p.commodity) }}
                />
                <span className="text-[10px] font-semibold text-ci-gray-500 uppercase tracking-wider">
                  {commodityLabel(p.commodity)}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  p.status === 'active'
                    ? 'bg-ci-green-light text-ci-green-dark'
                    : p.status === 'new'
                      ? 'bg-ci-gold-light text-ci-gold'
                      : 'bg-ci-gray-100 text-ci-gray-500'
                }`}
              >
                {p.status.toUpperCase()}
              </span>
            </div>

            <h3
              className="text-base font-bold text-ci-charcoal mb-1 group-hover:text-ci-green transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {countryFlag(p.country)} {p.name}
            </h3>
            <p className="text-xs text-ci-gray-500 mb-3">{p.grantee}</p>

            <p className="text-sm text-ci-gray-700 mb-4 line-clamp-2">{p.description}</p>

            <div className="flex items-center gap-4 text-xs text-ci-gray-500">
              <span>{formatHectares(p.hectares)}</span>
              <span>{p.country}</span>
              <span>Since {p.yearJoined}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

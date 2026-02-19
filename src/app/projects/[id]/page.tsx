import { notFound } from 'next/navigation';
import { projects } from '@/lib/seed/projects';
import { commodityColor, commodityLabel, formatHectares, formatCoordinate, countryFlag } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProjectDataPanels from '@/components/project/ProjectDataPanels';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectProfilePage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ci-gray-500 hover:text-ci-green transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Portfolio
      </Link>

      {/* Project header */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2
              className="text-[28px] font-bold text-ci-charcoal mb-1"
              style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
            >
              {project.name}
            </h2>
            <p className="text-ci-gray-500">
              {project.grantee} · {countryFlag(project.country)} {project.country} · {formatHectares(project.hectares)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: commodityColor(project.commodity) }}
            >
              {commodityLabel(project.commodity)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                project.status === 'active'
                  ? 'bg-ci-green-light text-ci-green-dark'
                  : project.status === 'new'
                    ? 'bg-ci-gold-light text-ci-gold'
                    : 'bg-ci-gray-100 text-ci-gray-500'
              }`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-ci-gray-100 text-ci-gray-500">
              Since {project.yearJoined}
            </span>
            {project.beneficiaries && (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-ci-green-light text-ci-green-dark">
                {project.beneficiaries.toLocaleString()} beneficiaries
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-ci-gray-700 mb-4">{project.description}</p>

        <div
          className="text-xs text-ci-gray-500"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Lat: {formatCoordinate(project.lat, 'lat')} &nbsp; Lng: {formatCoordinate(project.lng, 'lng')}
        </div>
      </div>

      {/* Data panels — client component with API calls */}
      <ProjectDataPanels
        projectId={project.id}
        lat={project.lat}
        lng={project.lng}
        commodity={project.commodity}
        name={project.name}
      />

      {/* Action buttons */}
      <div className="flex gap-3 mt-6">
        <Link
          href={`/projects/${project.id}/context`}
          className="px-5 py-2.5 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors"
        >
          View Contextual Intelligence
        </Link>
        <Link
          href={`/projects/${project.id}/upload`}
          className="px-5 py-2.5 rounded-[var(--radius-md)] border border-ci-gray-300 text-ci-gray-700 text-sm font-semibold hover:bg-ci-gray-100 transition-colors"
        >
          Upload Data
        </Link>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

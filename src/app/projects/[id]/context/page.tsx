import { notFound } from 'next/navigation';
import { projects } from '@/lib/seed/projects';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContextualIntelligence from '@/components/context/ContextualIntelligence';
import { formatCoordinate } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContextPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div>
      <Link
        href={`/projects/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-ci-gray-500 hover:text-ci-green transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Project
      </Link>

      <div className="mb-6">
        <h2
          className="text-[28px] font-bold text-ci-charcoal mb-1"
          style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
        >
          Contextual Intelligence
        </h2>
        <p className="text-ci-gray-500">
          {project.name} · Environmental context layered onto monitoring results
        </p>
        <p
          className="text-xs text-ci-gray-500 mt-1"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {formatCoordinate(project.lat, 'lat')} · {formatCoordinate(project.lng, 'lng')}
        </p>
      </div>

      {/* Explainer */}
      <div className="mb-6 px-4 py-3 bg-ci-green-light rounded-[var(--radius-md)] border border-ci-green/20">
        <p className="text-sm text-ci-green-dark">
          <strong>How to read this view:</strong> The left panel shows grantee-reported monitoring data.
          The right panel shows concurrent climate conditions from satellite data.
          The interpretation engine compares both to determine whether observed changes are
          practice-driven or climate-driven.
        </p>
      </div>

      <ContextualIntelligence
        lat={project.lat}
        lng={project.lng}
        projectName={project.name}
      />
    </div>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

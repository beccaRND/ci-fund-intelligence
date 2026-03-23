import { notFound } from 'next/navigation';
import { projects } from '@/lib/seed/projects';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import UploadPageContent from '@/components/upload/UploadPageContent';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UploadPage({ params }: Props) {
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

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-[28px] font-bold text-ci-charcoal mb-1"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
          >
            Data Upload & Quality Checklist
          </h2>
          <p className="text-ci-gray-500">
            {project.name} · Upload monitoring data and validate against VM0042
          </p>
        </div>
        <DataSourceBadge source="field" label="Grantee-reported data" />
      </div>

      <UploadPageContent
        projectId={project.id}
        projectName={project.name}
        yearJoined={project.yearJoined}
      />
    </div>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

'use client';

import dynamic from 'next/dynamic';

const ProjectMiniMapInner = dynamic(() => import('./ProjectMiniMapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] skeleton rounded-[var(--radius-sm)]" />
  ),
});

interface ProjectMiniMapProps {
  lat: number;
  lng: number;
  name: string;
  commodityColor: string;
}

export default function ProjectMiniMap(props: ProjectMiniMapProps) {
  return <ProjectMiniMapInner {...props} />;
}

'use client';

type SourceType = 'satellite' | 'public' | 'field' | 'computed';

const sourceConfig: Record<SourceType, { icon: string; color: string; bg: string }> = {
  satellite: { icon: '🛰', color: 'var(--color-source-satellite)', bg: '#E5F2F3' },
  public: { icon: '📊', color: 'var(--color-source-public)', bg: '#F0F0EC' },
  field: { icon: '📋', color: 'var(--color-source-field)', bg: '#E8F5EF' },
  computed: { icon: '🧮', color: 'var(--color-source-modeled)', bg: '#F0EBF5' },
};

interface DataSourceBadgeProps {
  source: SourceType;
  label: string;
}

export default function DataSourceBadge({ source, label }: DataSourceBadgeProps) {
  const config = sourceConfig[source];

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span className="text-[9px]">{config.icon}</span>
      {label}
    </span>
  );
}

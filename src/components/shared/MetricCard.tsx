'use client';

import DataSourceBadge from './DataSourceBadge';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  source?: { type: 'satellite' | 'public' | 'field' | 'computed'; label: string };
  trend?: { direction: 'up' | 'down' | 'stable'; label: string };
  mono?: boolean;
}

export default function MetricCard({ label, value, unit, source, trend, mono }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-2xl font-bold text-ci-charcoal leading-none"
          style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)' }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm text-ci-gray-500">{unit}</span>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-0.5">
          <span
            className={`text-xs font-medium ${
              trend.direction === 'up'
                ? 'text-ci-green'
                : trend.direction === 'down'
                  ? 'text-ci-orange'
                  : 'text-ci-gray-500'
            }`}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}{' '}
            {trend.label}
          </span>
        </div>
      )}
      {source && (
        <div className="mt-1">
          <DataSourceBadge source={source.type} label={source.label} />
        </div>
      )}
    </div>
  );
}

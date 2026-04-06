'use client';

import {
  ComposedChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
} from 'recharts';
import { ArrowUp, TrendingUp } from 'lucide-react';
import { annualMetrics, HECTARE_TARGET } from '@/lib/seed/fundMetrics';

function formatHa(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return value.toString();
}

const chartData = annualMetrics.map((m) => ({
  year: m.year.toString(),
  direct: m.directHectares,
  indirect: m.indirectHectares,
  total: m.totalEnrolled,
}));

const beneficiaryData = annualMetrics.map((m) => ({
  year: m.year.toString(),
  direct: m.directBeneficiaries,
  indirect: m.indirectBeneficiaries,
  total: m.totalBeneficiaries,
}));

function CustomTooltipHa({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="bg-ci-white border border-ci-gray-300/60 rounded-[var(--radius-sm)] p-3 shadow-[var(--shadow-md)] text-[12px]">
      <div className="font-semibold text-ci-charcoal mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        {label}
      </div>
      {payload.map((p) => p.value > 0 && (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-ci-gray-500 capitalize">{p.name}:</span>
          <span className="font-semibold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
            {p.value.toLocaleString()} ha
          </span>
        </div>
      ))}
      {payload.length > 1 && (
        <div className="mt-1.5 pt-1.5 border-t border-ci-gray-300/40 flex justify-between">
          <span className="text-ci-gray-500">Total:</span>
          <span className="font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
            {total.toLocaleString()} ha
          </span>
        </div>
      )}
    </div>
  );
}

function CustomTooltipBeneficiary({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="bg-ci-white border border-ci-gray-300/60 rounded-[var(--radius-sm)] p-3 shadow-[var(--shadow-md)] text-[12px]">
      <div className="font-semibold text-ci-charcoal mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        {label}
      </div>
      {payload.map((p) => p.value > 0 && (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-ci-gray-500 capitalize">{p.name}:</span>
          <span className="font-semibold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
      {payload.length > 1 && (
        <div className="mt-1.5 pt-1.5 border-t border-ci-gray-300/40 flex justify-between">
          <span className="text-ci-gray-500">Total:</span>
          <span className="font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
            {total.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

export default function HectareGrowthChart() {
  const latest = annualMetrics[annualMetrics.length - 1];
  const prev = annualMetrics[annualMetrics.length - 2];
  const haYOY = Math.round(((latest.totalEnrolled - prev.totalEnrolled) / prev.totalEnrolled) * 100);
  const benefYOY = Math.round(((latest.totalBeneficiaries - prev.totalBeneficiaries) / prev.totalBeneficiaries) * 100);

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] mb-8 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-ci-gray-300/30">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3
              className="text-lg font-bold text-ci-charcoal"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Hectare Growth Year-on-Year
            </h3>
            <p className="text-xs text-ci-gray-500 mt-0.5">
              Direct and indirect enrolled hectares across the fund portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ci-green-light">
              <ArrowUp size={12} className="text-ci-green" />
              <span className="text-[11px] font-semibold text-ci-green-dark">
                Target exceeded
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ci-gray-100">
              <TrendingUp size={12} className="text-ci-teal" />
              <span className="text-[11px] font-semibold text-ci-charcoal">
                +{haYOY}% YOY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-ci-gray-300/30">
        {/* Hectare chart — 2/3 width */}
        <div className="lg:col-span-2 px-6 py-5">
          <div className="text-[11px] font-semibold text-ci-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Enrolled Hectares
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#7A7A7A', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatHa}
                tick={{ fontSize: 11, fill: '#7A7A7A', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 1300000]}
                ticks={[0, 250000, 500000, 750000, 1000000, 1250000]}
                width={40}
              />
              <Tooltip content={<CustomTooltipHa />} />
              <Legend
                iconType="square"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8, fontFamily: 'var(--font-body)' }}
                formatter={(value: string) => (
                  <span style={{ color: '#7A7A7A', textTransform: 'capitalize' }}>{value}</span>
                )}
              />
              <Bar dataKey="direct" name="direct" stackId="a" fill="#00A86B" radius={[0, 0, 0, 0]} maxBarSize={60} />
              <Bar dataKey="indirect" name="indirect" stackId="a" fill="#A8DFC8" radius={[4, 4, 0, 0]} maxBarSize={60} />
              <ReferenceLine
                y={HECTARE_TARGET}
                stroke="#7A7A7A"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                label={{
                  value: '1M target',
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: '#7A7A7A',
                  fontFamily: 'var(--font-mono)',
                  dy: -4,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Beneficiary chart — 1/3 width */}
        <div className="px-6 py-5">
          <div className="text-[11px] font-semibold text-ci-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Beneficiaries
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={beneficiaryData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#7A7A7A', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}K` : v}
                tick={{ fontSize: 11, fill: '#7A7A7A', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip content={<CustomTooltipBeneficiary />} />
              <Bar dataKey="direct" name="direct" stackId="a" fill="#007B7F" radius={[0, 0, 0, 0]} maxBarSize={48} />
              <Bar dataKey="indirect" name="indirect" stackId="a" fill="#99CCCE" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
          {/* YOY badge */}
          <div className="mt-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-ci-teal-light w-fit">
            <ArrowUp size={10} className="text-ci-teal" />
            <span className="text-[10px] font-semibold text-ci-teal">
              +{benefYOY}% YOY
            </span>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-ci-gray-100/40 border-t border-ci-gray-300/30">
        <p className="text-[11px] text-ci-gray-500 italic">
          Enrolled hectares in 2022–2023 included both direct and indirect impacts combined. 2024 data separates direct (845K) from indirect (267K) hectares.
          Source: CI Regenerative Fund for Nature Annual Report.
        </p>
      </div>
    </div>
  );
}

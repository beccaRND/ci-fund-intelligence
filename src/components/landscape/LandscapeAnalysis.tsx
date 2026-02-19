'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from 'recharts';
import Link from 'next/link';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import { RefreshCw, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { DegradationAssessment } from '@/lib/types';
import { commodityColor, commodityLabel, countryFlag, formatHectares, formatNumber } from '@/lib/utils';

interface LandscapeAssessment extends DegradationAssessment {
  projectName: string;
  country: string;
  commodity: string;
  hectares: number;
}

interface LandscapeData {
  assessments: LandscapeAssessment[];
  totalProjects: number;
  successCount: number;
  errors: { projectId: string; error: string }[];
}

export default function LandscapeAnalysis() {
  const [data, setData] = useState<LandscapeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<LandscapeAssessment | null>(null);
  const [sortKey, setSortKey] = useState<'priorityScore' | 'socDeficit_percent' | 'potentialCO2e_tPerHa' | 'carbonValue_usdPerHa'>('priorityScore');
  const [sortAsc, setSortAsc] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/landscape');
      const json = await res.json();
      if (json.success && json.assessments.length > 0) {
        setData(json);
        setSelectedProject(json.assessments[0]);
      } else {
        setError('Could not compute degradation assessments. External APIs may be down.');
      }
    } catch {
      setError('Network error — could not reach landscape API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-48 skeleton" />
          </div>
          <div className="h-64 skeleton rounded-[var(--radius-sm)]" />
        </div>
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="h-6 w-36 skeleton mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 skeleton rounded-[var(--radius-sm)]" />
            ))}
          </div>
        </div>
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ci-cream rounded-full text-sm text-ci-gray-500">
            <RefreshCw size={14} className="animate-spin" />
            Computing degradation for all 13 projects... this may take a moment.
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertTriangle size={24} className="text-ci-orange" />
          <p className="text-sm text-ci-gray-500 max-w-sm">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const sorted = [...data.assessments].sort((a, b) => {
    const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
    return sortAsc ? diff : -diff;
  });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ col }: { col: typeof sortKey }) => {
    if (sortKey !== col) return null;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  // Waterfall chart data for selected project
  const waterfallData = selectedProject
    ? [
        { name: 'Current SOC', value: selectedProject.currentSOC_tPerHa, fill: '#E8732A' },
        { name: 'Potential Gain', value: selectedProject.potentialSOC_gain_tPerHa, fill: '#00A86B' },
        { name: 'Restored SOC', value: selectedProject.currentSOC_tPerHa + selectedProject.potentialSOC_gain_tPerHa, fill: '#007B7F' },
        { name: 'Reference SOC', value: selectedProject.referenceSOC_tPerHa, fill: '#B8B8B8' },
      ]
    : [];

  // Summary stats
  const totalPotentialCO2 = data.assessments.reduce(
    (sum, a) => sum + a.potentialCO2e_tPerHa * a.hectares,
    0
  );
  const totalCarbonValue = data.assessments.reduce(
    (sum, a) => sum + a.carbonValue_usdPerHa * a.hectares,
    0
  );
  const avgDeficit = data.assessments.reduce((sum, a) => sum + a.socDeficit_percent, 0) / data.assessments.length;

  return (
    <div className="space-y-6">
      {/* Fund-wide summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-4">
          <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Avg SOC Deficit</div>
          <div className="text-2xl font-bold text-ci-orange" style={{ fontFamily: 'var(--font-mono)' }}>
            {Math.round(avgDeficit)}%
          </div>
          <div className="text-[11px] text-ci-gray-500">below reference levels</div>
        </div>
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-4">
          <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Projects Assessed</div>
          <div className="text-2xl font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
            {data.successCount}<span className="text-base text-ci-gray-500">/{data.totalProjects}</span>
          </div>
          <div className="text-[11px] text-ci-gray-500">degradation computed</div>
        </div>
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-4">
          <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Total CO₂e Potential</div>
          <div className="text-2xl font-bold text-ci-green" style={{ fontFamily: 'var(--font-mono)' }}>
            {formatNumber(Math.round(totalPotentialCO2 / 1000))}K
          </div>
          <div className="text-[11px] text-ci-gray-500">t CO₂e across portfolio</div>
        </div>
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-4">
          <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-1">Total Carbon Value</div>
          <div className="text-2xl font-bold text-ci-teal" style={{ fontFamily: 'var(--font-mono)' }}>
            ${formatNumber(Math.round(totalCarbonValue / 1000000))}M
          </div>
          <div className="text-[11px] text-ci-gray-500">@ $15/t CO₂e (conservative)</div>
        </div>
      </div>

      {/* SOC Gap comparison chart — all projects */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            SOC Gap by Project
          </h3>
          <DataSourceBadge source="computed" label="SoilGrids + literature" />
        </div>
        <p className="text-xs text-ci-gray-500 mb-4">
          Current SOC vs reference SOC for each soil type and climate zone (t C/ha, 0-30cm)
        </p>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data.assessments.map((a) => ({
              name: a.projectName.length > 18 ? a.projectName.substring(0, 18) + '...' : a.projectName,
              current: a.currentSOC_tPerHa,
              gap: a.socDeficit_tPerHa,
              reference: a.referenceSOC_tPerHa,
              id: a.projectId,
            }))}
            margin={{ top: 10, right: 10, left: -5, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#7A7A7A' }}
              angle={-35}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis tick={{ fontSize: 10, fill: '#7A7A7A' }} tickFormatter={(v) => `${v}`} label={{ value: 't C/ha', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#7A7A7A' } }} />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid #F0F0EC',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
              formatter={(value: number | undefined, name: string | undefined) => {
                const label = name === 'current' ? 'Current SOC' : name === 'gap' ? 'SOC Gap' : 'Reference';
                return [`${value ?? 0} t C/ha`, label];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#7A7A7A' }}
              formatter={(value) => (value === 'current' ? 'Current SOC' : 'SOC Deficit')}
            />
            <Bar dataKey="current" stackId="soc" fill="#E8732A" radius={[0, 0, 0, 0]} barSize={20} name="current" />
            <Bar dataKey="gap" stackId="soc" fill="#00A86B" radius={[3, 3, 0, 0]} barSize={20} opacity={0.5} name="gap" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Priority Rankings Table */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
            Priority Rankings
          </h3>
          <DataSourceBadge source="computed" label="Composite scoring" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ci-gray-300/50">
                <th className="text-left py-2 px-2 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold">
                  Rank
                </th>
                <th className="text-left py-2 px-2 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold">
                  Project
                </th>
                <th
                  className="text-right py-2 px-2 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold cursor-pointer hover:text-ci-charcoal"
                  onClick={() => handleSort('socDeficit_percent')}
                >
                  <span className="flex items-center justify-end gap-1">
                    SOC Gap <SortIcon col="socDeficit_percent" />
                  </span>
                </th>
                <th
                  className="text-right py-2 px-2 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold cursor-pointer hover:text-ci-charcoal"
                  onClick={() => handleSort('potentialCO2e_tPerHa')}
                >
                  <span className="flex items-center justify-end gap-1">
                    CO₂e Potential <SortIcon col="potentialCO2e_tPerHa" />
                  </span>
                </th>
                <th
                  className="text-right py-2 px-2 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold cursor-pointer hover:text-ci-charcoal"
                  onClick={() => handleSort('carbonValue_usdPerHa')}
                >
                  <span className="flex items-center justify-end gap-1">
                    Value/ha <SortIcon col="carbonValue_usdPerHa" />
                  </span>
                </th>
                <th
                  className="text-right py-2 px-2 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold cursor-pointer hover:text-ci-charcoal"
                  onClick={() => handleSort('priorityScore')}
                >
                  <span className="flex items-center justify-end gap-1">
                    Score <SortIcon col="priorityScore" />
                  </span>
                </th>
                <th className="py-2 px-2" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((a) => (
                <tr
                  key={a.projectId}
                  className={`border-b border-ci-gray-300/30 cursor-pointer transition-colors ${
                    selectedProject?.projectId === a.projectId
                      ? 'bg-ci-green-light'
                      : 'hover:bg-ci-cream'
                  }`}
                  onClick={() => setSelectedProject(a)}
                >
                  <td className="py-2.5 px-2">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white"
                      style={{
                        backgroundColor: a.priorityRank <= 3 ? '#00A86B' : a.priorityRank <= 7 ? '#E8732A' : '#B8B8B8',
                      }}
                    >
                      {a.priorityRank}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: commodityColor(a.commodity) }}
                      />
                      <div>
                        <div className="font-medium text-ci-charcoal text-sm">{a.projectName}</div>
                        <div className="text-[11px] text-ci-gray-500">
                          {countryFlag(a.country)} {a.country} · {formatHectares(a.hectares)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: a.socDeficit_percent > 30 ? '#C4392F' : a.socDeficit_percent > 15 ? '#E8732A' : '#00A86B',
                      }}
                    >
                      -{a.socDeficit_percent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="text-sm font-semibold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                      {a.potentialCO2e_tPerHa} t/ha
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <span className="text-sm font-semibold text-ci-teal" style={{ fontFamily: 'var(--font-mono)' }}>
                      ${a.carbonValue_usdPerHa}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-ci-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${a.priorityScore}%`,
                            backgroundColor: a.priorityScore >= 70 ? '#00A86B' : a.priorityScore >= 50 ? '#E8732A' : '#C4392F',
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                        {a.priorityScore}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <Link
                      href={`/projects/${a.projectId}`}
                      className="text-ci-green hover:text-ci-green-dark"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Project Deep Dive */}
      {selectedProject && (
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              {selectedProject.projectName} — Restoration Potential
            </h3>
            <DataSourceBadge source="computed" label="SoilGrids + literature" />
          </div>
          <p className="text-xs text-ci-gray-500 mb-5">
            {countryFlag(selectedProject.country)} {selectedProject.country} · {formatHectares(selectedProject.hectares)} · {commodityLabel(selectedProject.commodity)}
          </p>

          {/* Current → Restored comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="px-4 py-4 bg-ci-orange-light rounded-[var(--radius-md)] border border-ci-orange/20">
              <div className="text-xs text-ci-orange font-semibold uppercase tracking-wider mb-2">Current State</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-ci-gray-700">SOC (0-30cm)</span>
                  <span className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                    {selectedProject.currentSOC_tPerHa} t C/ha
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ci-gray-700">CO₂ stored</span>
                  <span className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                    {Math.round(selectedProject.currentSOC_tPerHa * 3.67)} t CO₂e/ha
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ci-gray-700">Deficit from reference</span>
                  <span className="text-sm font-bold text-ci-orange" style={{ fontFamily: 'var(--font-mono)' }}>
                    -{selectedProject.socDeficit_percent}%
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 bg-ci-green-light rounded-[var(--radius-md)] border border-ci-green/20">
              <div className="text-xs text-ci-green font-semibold uppercase tracking-wider mb-2">Restored Potential</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-ci-gray-700">SOC (0-30cm)</span>
                  <span className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                    {Math.round((selectedProject.currentSOC_tPerHa + selectedProject.potentialSOC_gain_tPerHa) * 10) / 10} t C/ha
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ci-gray-700">CO₂ stored</span>
                  <span className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                    {Math.round((selectedProject.currentSOC_tPerHa + selectedProject.potentialSOC_gain_tPerHa) * 3.67)} t CO₂e/ha
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ci-gray-700">SOC gain</span>
                  <span className="text-sm font-bold text-ci-green" style={{ fontFamily: 'var(--font-mono)' }}>
                    +{selectedProject.potentialSOC_gain_tPerHa} t C/ha
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Waterfall chart */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-ci-charcoal mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              SOC Stock: Current → Potential → Reference
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={waterfallData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7A7A7A' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7A7A7A' }} tickFormatter={(v) => `${v}`} label={{ value: 't C/ha', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#7A7A7A' } }} />
                <Tooltip
                  contentStyle={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #F0F0EC',
                  }}
                  formatter={(value: number | undefined) => [`${value ?? 0} t C/ha`, 'SOC']}
                />
                <Bar dataKey="value" barSize={48} radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Value breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-ci-gray-300/50">
            <div className="px-4 py-3 bg-ci-cream rounded-[var(--radius-md)] text-center">
              <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider mb-0.5">Carbon Value</div>
              <div className="text-lg font-bold text-ci-teal" style={{ fontFamily: 'var(--font-mono)' }}>
                ${selectedProject.carbonValue_usdPerHa}/ha
              </div>
            </div>
            <div className="px-4 py-3 bg-ci-cream rounded-[var(--radius-md)] text-center">
              <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider mb-0.5">Productivity Gain</div>
              <div className="text-lg font-bold text-ci-green" style={{ fontFamily: 'var(--font-mono)' }}>
                +{selectedProject.productivityGain_percent}%
              </div>
            </div>
            <div className="px-4 py-3 bg-ci-cream rounded-[var(--radius-md)] text-center">
              <div className="text-[10px] text-ci-gray-500 uppercase tracking-wider mb-0.5">Time to Restore</div>
              <div className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-mono)' }}>
                ~{selectedProject.timeToRestore_years} yr
              </div>
            </div>
          </div>

          {/* Investment thesis */}
          <div className="px-4 py-4 bg-ci-teal-light rounded-[var(--radius-md)] border border-ci-teal/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-ci-teal" />
              <span className="text-sm font-bold text-ci-teal">Investment Thesis</span>
            </div>
            <p className="text-sm text-ci-gray-700 leading-relaxed mb-2">
              {formatHectares(selectedProject.hectares)} × ${selectedProject.carbonValue_usdPerHa}/ha ={' '}
              <strong className="text-ci-teal">
                ${formatNumber(Math.round(selectedProject.hectares * selectedProject.carbonValue_usdPerHa / 1000))}K
              </strong>{' '}
              potential carbon value over a {selectedProject.timeToRestore_years}-year restoration trajectory.
            </p>
            <p className="text-xs text-ci-gray-500 flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-ci-gold shrink-0" />
              Estimates use conservative assumptions. Actual outcomes depend on practice implementation, climate conditions, and local context.
            </p>
          </div>
        </div>
      )}

      {/* Methodology Notes */}
      <details className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] overflow-hidden">
        <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-ci-charcoal hover:bg-ci-cream transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
          Methodology Notes
        </summary>
        <div className="px-5 pb-5 space-y-3 text-xs text-ci-gray-700 leading-relaxed border-t border-ci-gray-300/50 pt-4">
          <div className="flex items-start gap-2">
            <DataSourceBadge source="satellite" label="SoilGrids 250m" />
            <p>Current SOC stocks derived from ISRIC SoilGrids 2.0 at 250m resolution (0-30cm depth). When API is unavailable, regional literature estimates are used.</p>
          </div>
          <div className="flex items-start gap-2">
            <DataSourceBadge source="computed" label="Literature values" />
            <p>Reference SOC values are based on published literature for undegraded soils by texture class and climate zone. Climate zones classified from Open-Meteo ERA5 precipitation data.</p>
          </div>
          <div className="flex items-start gap-2">
            <DataSourceBadge source="computed" label="Conservative" />
            <p>Restoration potential assumes 80% of SOC deficit is recoverable. Accumulation rates are literature-derived estimates for regenerative practices (e.g., rotational grazing: 0.5 t C/ha/yr). Carbon price: $15/t CO₂e (conservative voluntary market estimate).</p>
          </div>
          <div className="flex items-start gap-2">
            <DataSourceBadge source="computed" label="Composite" />
            <p>Priority score (0-100) is a composite of: degradation severity (max 40 pts), project scale via log(hectares) (max 30 pts), and restoration feasibility based on practice accumulation rate (max 30 pts).</p>
          </div>
        </div>
      </details>

      {/* API errors */}
      {data.errors.length > 0 && (
        <div className="px-4 py-3 bg-ci-gold-light rounded-[var(--radius-md)] border border-ci-gold/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-ci-gold" />
            <span className="text-xs font-semibold text-ci-gold">
              {data.errors.length} project{data.errors.length > 1 ? 's' : ''} could not be assessed
            </span>
          </div>
          <p className="text-[11px] text-ci-gray-500">
            External APIs (SoilGrids/Open-Meteo) may have been unavailable for: {data.errors.map((e) => e.projectId).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

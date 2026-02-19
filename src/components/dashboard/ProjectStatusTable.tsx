'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { projects, dataCompleteness } from '@/lib/seed/projects';
import { countryFlag, dataStatusIcon, dataStatusColor, commodityColor, commodityLabel } from '@/lib/utils';

type SortKey = 'name' | 'score' | 'soil' | 'biodiversity' | 'water' | 'livelihoods';
type SortDir = 'asc' | 'desc';

const statusOrder = { complete: 3, partial: 2, missing: 1 };

export default function ProjectStatusTable() {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sorted = [...projects].sort((a, b) => {
    const dcA = dataCompleteness[a.id];
    const dcB = dataCompleteness[b.id];
    let cmp = 0;

    switch (sortKey) {
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'score':
        cmp = (dcA?.score ?? 0) - (dcB?.score ?? 0);
        break;
      case 'soil':
        cmp = (statusOrder[dcA?.soil] ?? 0) - (statusOrder[dcB?.soil] ?? 0);
        break;
      case 'biodiversity':
        cmp = (statusOrder[dcA?.biodiversity] ?? 0) - (statusOrder[dcB?.biodiversity] ?? 0);
        break;
      case 'water':
        cmp = (statusOrder[dcA?.water] ?? 0) - (statusOrder[dcB?.water] ?? 0);
        break;
      case 'livelihoods':
        cmp = (statusOrder[dcA?.livelihoods] ?? 0) - (statusOrder[dcB?.livelihoods] ?? 0);
        break;
    }

    return sortDir === 'asc' ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortIcon({ colKey }: { colKey: SortKey }) {
    if (sortKey !== colKey) return <ArrowUpDown size={12} className="text-ci-gray-300" />;
    return sortDir === 'desc' ? (
      <ArrowDown size={12} className="text-ci-green" />
    ) : (
      <ArrowUp size={12} className="text-ci-green" />
    );
  }

  const needsAttention = sorted.filter((p) => (dataCompleteness[p.id]?.score ?? 0) < 30);

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3
          className="text-lg font-bold text-ci-charcoal"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Data Completeness Overview
        </h3>
        <p className="text-xs text-ci-gray-500 mt-1">
          Track data submission status across all projects
        </p>
      </div>

      {needsAttention.length > 0 && (
        <div className="mx-5 mb-3 px-4 py-3 bg-ci-orange-light rounded-[var(--radius-sm)] border border-ci-orange/20">
          <span className="text-sm font-semibold text-ci-orange">
            {needsAttention.length} project{needsAttention.length > 1 ? 's' : ''} need attention
          </span>
          <span className="text-xs text-ci-gray-500 ml-2">
            &mdash; data score below 30%
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b border-ci-gray-300/50">
              <th className="px-5 py-3 text-left">
                <button
                  onClick={() => toggleSort('name')}
                  className="flex items-center gap-1.5 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold hover:text-ci-charcoal transition-colors"
                >
                  Project <SortIcon colKey="name" />
                </button>
              </th>
              {(['soil', 'biodiversity', 'water', 'livelihoods'] as SortKey[]).map((col) => (
                <th key={col} className="px-3 py-3 text-center">
                  <button
                    onClick={() => toggleSort(col)}
                    className="flex items-center gap-1 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold hover:text-ci-charcoal transition-colors mx-auto"
                  >
                    {col === 'biodiversity' ? 'Bio' : col.charAt(0).toUpperCase() + col.slice(1)}
                    <SortIcon colKey={col} />
                  </button>
                </th>
              ))}
              <th className="px-3 py-3 text-center">
                <button
                  onClick={() => toggleSort('score')}
                  className="flex items-center gap-1 text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold hover:text-ci-charcoal transition-colors mx-auto"
                >
                  Score <SortIcon colKey="score" />
                </button>
              </th>
              <th className="px-5 py-3 text-right">
                <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold">
                  Updated
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const dc = dataCompleteness[p.id];
              return (
                <tr
                  key={p.id}
                  className="border-b border-ci-gray-300/30 hover:bg-ci-cream/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/projects/${p.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: commodityColor(p.commodity) }}
                      />
                      <div>
                        <div className="text-sm font-medium text-ci-charcoal group-hover:text-ci-green transition-colors">
                          {countryFlag(p.country)} {p.name}
                        </div>
                        <div className="text-[11px] text-ci-gray-500">
                          {p.grantee} · {commodityLabel(p.commodity)}
                        </div>
                      </div>
                    </Link>
                  </td>
                  {(['soil', 'biodiversity', 'water', 'livelihoods'] as const).map((field) => (
                    <td key={field} className="px-3 py-3 text-center">
                      <span
                        className="text-lg"
                        style={{ color: dataStatusColor(dc?.[field] ?? 'missing') }}
                        title={dc?.[field] ?? 'missing'}
                      >
                        {dataStatusIcon(dc?.[field] ?? 'missing')}
                      </span>
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-1.5 bg-ci-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${dc?.score ?? 0}%`,
                            backgroundColor:
                              (dc?.score ?? 0) >= 70
                                ? '#00A86B'
                                : (dc?.score ?? 0) >= 40
                                  ? '#E8732A'
                                  : '#C4392F',
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-semibold"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color:
                            (dc?.score ?? 0) >= 70
                              ? '#00A86B'
                              : (dc?.score ?? 0) >= 40
                                ? '#E8732A'
                                : '#C4392F',
                        }}
                      >
                        {dc?.score ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className="text-xs text-ci-gray-500"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {dc?.lastUpdated
                        ? new Date(dc.lastUpdated).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import DataSourceBadge from '@/components/shared/DataSourceBadge';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import type { CommodityPriceData } from '@/lib/api/worldBank';
import { commodityLabel } from '@/lib/utils';

interface CommodityPanelProps {
  commodity: string;
}

export default function CommodityPanel({ commodity }: CommodityPanelProps) {
  const [data, setData] = useState<CommodityPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/commodities?commodity=${commodity}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load commodity data');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commodity]);

  if (loading) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <h3 className="text-lg font-bold text-ci-charcoal mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Commodity Context
        </h3>
        <div className="h-48 skeleton rounded-[var(--radius-sm)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <h3 className="text-lg font-bold text-ci-charcoal mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Commodity Context
        </h3>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <AlertTriangle size={20} className="text-ci-orange" />
          <p className="text-sm text-ci-gray-500">{error}</p>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] bg-ci-green text-white text-xs font-semibold hover:bg-ci-green-dark transition-colors"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const hasPrices = data.prices.length > 0;

  return (
    <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
          Commodity Context — {commodityLabel(commodity)}
        </h3>
        <DataSourceBadge
          source={hasPrices ? 'public' : 'computed'}
          label={hasPrices ? 'World Bank' : 'Contextual data'}
        />
      </div>

      {hasPrices ? (
        <>
          <p className="text-xs text-ci-gray-500 mb-4">
            {commodityLabel(commodity)} price trend · {data.unit}
          </p>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.prices} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EC" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#7A7A7A' }} />
              <YAxis tick={{ fontSize: 10, fill: '#7A7A7A' }} />
              <Tooltip
                contentStyle={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid #F0F0EC',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                formatter={(value: number | undefined) => [`${value ?? 0} ${data.unit}`, commodityLabel(commodity)]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#E8732A"
                strokeWidth={2}
                dot={{ r: 4, fill: '#E8732A' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {data.contextText && (
            <p className="text-sm text-ci-gray-500 mt-4 leading-relaxed">
              {data.contextText}
            </p>
          )}
        </>
      ) : (
        <div className="mt-3">
          <div className="px-4 py-3 bg-ci-teal-light rounded-[var(--radius-sm)] border border-ci-teal/20 mb-4">
            <p className="text-xs text-ci-teal font-medium mb-1">
              No public price API available for {commodityLabel(commodity)}
            </p>
          </div>
          {data.contextText && (
            <p
              className="text-sm text-ci-gray-700 leading-relaxed"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {data.contextText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

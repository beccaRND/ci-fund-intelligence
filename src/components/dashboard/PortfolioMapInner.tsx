'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { projects } from '@/lib/seed/projects';
import { commodityColor, commodityLabel, formatHectares } from '@/lib/utils';
import { Filter, ChevronDown } from 'lucide-react';

const TILE_URLS = {
  satellite:
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  streets:
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
};

export default function PortfolioMapInner() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [basemap, setBasemap] = useState<'satellite' | 'streets'>('satellite');
  const [filter, setFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [filterOpen]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const tileLayer = L.tileLayer(TILE_URLS.satellite, {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.esri.com/">Esri</a>',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    // Fit bounds to all projects
    const bounds = L.latLngBounds(projects.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });

    // Add markers
    addMarkers(map, null);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_URLS[basemap]);
    if (basemap === 'streets') {
      tileLayerRef.current.options.attribution =
        '&copy; <a href="https://carto.com/">CartoDB</a>';
    } else {
      tileLayerRef.current.options.attribution =
        '&copy; <a href="https://www.esri.com/">Esri</a>';
    }
  }, [basemap]);

  useEffect(() => {
    if (!mapRef.current) return;
    // Remove existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapRef.current!.removeLayer(layer);
      }
    });
    addMarkers(mapRef.current, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function addMarkers(map: L.Map, commodityFilter: string | null) {
    const filtered = commodityFilter
      ? projects.filter((p) => p.commodity === commodityFilter)
      : projects;

    filtered.forEach((p) => {
      // Scale radius by hectares (log scale, clamped)
      const radius = Math.max(6, Math.min(20, Math.log10(p.hectares) * 4));

      const marker = L.circleMarker([p.lat, p.lng], {
        radius,
        fillColor: commodityColor(p.commodity),
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      marker.bindTooltip(
        `<div style="font-family: 'Source Sans 3', sans-serif; padding: 4px 2px;">
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${p.name}</div>
          <div style="font-size: 11px; color: #4A4A4A;">${p.grantee}</div>
          <div style="font-size: 11px; color: #7A7A7A; margin-top: 3px;">
            ${formatHectares(p.hectares)} · ${commodityLabel(p.commodity)}
          </div>
        </div>`,
        {
          direction: 'top',
          offset: [0, -radius],
          className: 'map-tooltip',
        }
      );

      marker.on('click', () => {
        router.push(`/projects/${p.id}`);
      });

      (marker.getElement() as HTMLElement | undefined)?.style.setProperty('cursor', 'pointer');
    });
  }

  const commodities = [...new Set(projects.map((p) => p.commodity))];

  return (
    <div className="relative" style={{ isolation: 'isolate' }}>
      <div
        ref={containerRef}
        className="h-[500px] rounded-[var(--radius-sm)]"
      />

      {/* Controls overlay — pointer-events:none on wrapper so map stays interactive,
          pointer-events:auto on the actual controls so buttons work */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
        <div className="absolute top-3 left-3 flex items-start gap-2 pointer-events-auto">
          {/* Basemap toggle */}
          <div className="bg-ci-white/95 backdrop-blur rounded-[var(--radius-md)] shadow-[var(--shadow-md)] p-1 flex gap-1">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-[11px] font-semibold transition-colors ${
                basemap === 'satellite'
                  ? 'bg-ci-green text-white'
                  : 'text-ci-gray-700 hover:bg-ci-gray-100'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBasemap('streets')}
              className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-[11px] font-semibold transition-colors ${
                basemap === 'streets'
                  ? 'bg-ci-green text-white'
                  : 'text-ci-gray-700 hover:bg-ci-gray-100'
              }`}
            >
              Streets
            </button>
          </div>

          {/* Commodity filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-[11px] font-semibold transition-colors shadow-[var(--shadow-md)] ${
                filter !== null
                  ? 'bg-ci-green text-white'
                  : 'bg-ci-white/95 backdrop-blur text-ci-gray-700 hover:bg-ci-gray-100'
              }`}
            >
              <Filter size={12} />
              {filter ? commodityLabel(filter) : 'Filter'}
              <ChevronDown size={12} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>

            {filterOpen && (
              <div className="absolute top-full left-0 mt-1 bg-ci-white/95 backdrop-blur rounded-[var(--radius-md)] shadow-[var(--shadow-md)] p-2 min-w-[160px]">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => { setFilter(null); setFilterOpen(false); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] text-[11px] transition-colors ${
                      filter === null ? 'bg-ci-green-light text-ci-green-dark font-semibold' : 'text-ci-gray-700 hover:bg-ci-gray-100'
                    }`}
                  >
                    All ({projects.length})
                  </button>
                  {commodities.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setFilter(filter === c ? null : c); setFilterOpen(false); }}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] text-[11px] transition-colors ${
                        filter === c ? 'bg-ci-green-light text-ci-green-dark font-semibold' : 'text-ci-gray-700 hover:bg-ci-gray-100'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: commodityColor(c) }}
                      />
                      {commodityLabel(c)} ({projects.filter((p) => p.commodity === c).length})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

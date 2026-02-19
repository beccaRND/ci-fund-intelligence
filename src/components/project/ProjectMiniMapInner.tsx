'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface Props {
  lat: number;
  lng: number;
  name: string;
  commodityColor: string;
}

export default function ProjectMiniMapInner({ lat, lng, name, commodityColor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18 }
    ).addTo(map);

    map.setView([lat, lng], 6);

    L.circleMarker([lat, lng], {
      radius: 8,
      fillColor: commodityColor,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    })
      .bindTooltip(name, { permanent: true, direction: 'right', offset: [12, 0], className: 'minimap-label' })
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, name, commodityColor]);

  return <div ref={containerRef} className="h-[200px] rounded-[var(--radius-sm)]" />;
}

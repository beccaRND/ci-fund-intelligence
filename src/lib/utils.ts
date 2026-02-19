import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHectares(ha: number): string {
  if (ha >= 1000000) return `${(ha / 1000000).toFixed(1)}M ha`;
  if (ha >= 1000) return `${(ha / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}K ha`;
  return `${ha.toLocaleString()} ha`;
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString();
}

export function formatCoordinate(coord: number, type: 'lat' | 'lng'): string {
  const dir = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : coord >= 0 ? 'E' : 'W';
  return `${Math.abs(coord).toFixed(4)}°${dir}`;
}

export function commodityColor(commodity: string): string {
  switch (commodity) {
    case 'cotton':
      return '#E8732A';
    case 'wool':
      return '#007B7F';
    case 'cashmere':
      return '#C5A830';
    case 'leather':
      return '#7A7A7A';
    case 'multi':
      return '#00A86B';
    default:
      return '#7A7A7A';
  }
}

export function commodityLabel(commodity: string): string {
  return commodity.charAt(0).toUpperCase() + commodity.slice(1);
}

export function statusColor(status: string): string {
  switch (status) {
    case 'active':
      return '#00A86B';
    case 'completed':
      return '#007B7F';
    case 'new':
      return '#C5A830';
    default:
      return '#7A7A7A';
  }
}

export function dataStatusIcon(status: 'complete' | 'partial' | 'missing'): string {
  switch (status) {
    case 'complete':
      return '●';
    case 'partial':
      return '◐';
    case 'missing':
      return '○';
  }
}

export function dataStatusColor(status: 'complete' | 'partial' | 'missing'): string {
  switch (status) {
    case 'complete':
      return '#00A86B';
    case 'partial':
      return '#E8732A';
    case 'missing':
      return '#C4392F';
  }
}

export function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    Mongolia: '🇲🇳',
    India: '🇮🇳',
    Argentina: '🇦🇷',
    Spain: '🇪🇸',
    France: '🇫🇷',
    'South Africa': '🇿🇦',
    Uganda: '🇺🇬',
    Pakistan: '🇵🇰',
    'Türkiye': '🇹🇷',
    Australia: '🇦🇺',
    'New Zealand': '🇳🇿',
  };
  return flags[country] || '🌍';
}

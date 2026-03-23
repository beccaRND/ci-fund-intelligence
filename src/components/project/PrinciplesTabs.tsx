'use client';

import { Sun, Sprout, Droplets, Bug, Users, Heart } from 'lucide-react';
import { dataCompleteness } from '@/lib/seed/projects';

export type PrincipleId = 'climate' | 'soil' | 'water' | 'biodiversity' | 'livelihoods' | 'animal_welfare';

export const PRINCIPLES: { id: PrincipleId; label: string; icon: typeof Sun; color: string; dcKey: string }[] = [
  { id: 'climate', label: 'Climate', icon: Sun, color: '#E8732A', dcKey: 'climate' },
  { id: 'soil', label: 'Soil Health', icon: Sprout, color: '#7A5C2E', dcKey: 'soil' },
  { id: 'water', label: 'Water', icon: Droplets, color: '#007B7F', dcKey: 'water' },
  { id: 'biodiversity', label: 'Biodiversity', icon: Bug, color: '#4A7C59', dcKey: 'biodiversity' },
  { id: 'livelihoods', label: 'Livelihoods', icon: Users, color: '#6B5CA5', dcKey: 'livelihoods' },
  { id: 'animal_welfare', label: 'Animal Welfare', icon: Heart, color: '#C4392F', dcKey: 'animalWelfare' },
];

function statusDot(status: 'complete' | 'partial' | 'missing' | undefined) {
  if (status === 'complete') return { color: '#00A86B', char: '\u25CF' };
  if (status === 'partial') return { color: '#E8732A', char: '\u25D0' };
  return { color: '#B8B8B8', char: '\u25CB' };
}

interface Props {
  active: PrincipleId;
  onChange: (id: PrincipleId) => void;
  projectId: string;
}

export default function PrinciplesTabs({ active, onChange, projectId }: Props) {
  const dc = dataCompleteness[projectId];

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
      {PRINCIPLES.map((p) => {
        const Icon = p.icon;
        const isActive = active === p.id;
        const dcField = dc?.[p.dcKey as keyof typeof dc] as 'complete' | 'partial' | 'missing' | undefined;
        const dot = statusDot(dcField);

        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
              isActive
                ? 'bg-ci-white shadow-[var(--shadow-md)] text-ci-charcoal'
                : 'text-ci-gray-500 hover:bg-ci-white/60 hover:text-ci-gray-700'
            }`}
            style={{
              fontFamily: 'var(--font-display)',
              borderBottom: isActive ? `2px solid ${p.color}` : '2px solid transparent',
            }}
          >
            <Icon size={16} style={{ color: isActive ? p.color : undefined }} />
            <span className="hidden sm:inline">{p.label}</span>
            <span
              className="text-[10px] ml-0.5"
              style={{ color: dot.color }}
              title={dcField ?? 'missing'}
            >
              {dot.char}
            </span>
          </button>
        );
      })}
    </div>
  );
}

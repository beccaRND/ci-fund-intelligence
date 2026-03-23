'use client';

import { projectBiodiversity } from '@/lib/seed/projects';
import { MapPin, Trees, Shield, AlertTriangle } from 'lucide-react';
import DataSourceBadge from '@/components/shared/DataSourceBadge';

interface Props {
  projectId: string;
}

export default function BiodiversityPanel({ projectId }: Props) {
  const bio = projectBiodiversity[projectId];

  if (!bio) {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6 text-center">
        <p className="text-sm text-ci-gray-500">No biodiversity data available for this project.</p>
      </div>
    );
  }

  const awaiting = bio.keySpecies.length === 1 && bio.keySpecies[0] === 'Awaiting CI input';

  return (
    <div className="space-y-6">
      {/* Ecoregion & Biome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trees size={16} className="text-ci-green" />
            <h4 className="text-xs font-bold text-ci-charcoal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              Ecoregion
            </h4>
          </div>
          <div className="text-base font-bold text-ci-charcoal mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {bio.ecoregion}
          </div>
          <div className="text-sm text-ci-gray-500">{bio.biome}</div>
          <div className="mt-3">
            <DataSourceBadge source="public" label="WWF Ecoregions" />
          </div>
        </div>

        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-ci-teal" />
            <h4 className="text-xs font-bold text-ci-charcoal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              Nearest Protected Area
            </h4>
          </div>
          <div className="text-base font-bold text-ci-charcoal mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {bio.nearestProtectedArea}
          </div>
          {bio.distanceToProtectedAreaKm > 0 && (
            <div className="text-sm text-ci-gray-500">
              <span style={{ fontFamily: 'var(--font-mono)' }}>{bio.distanceToProtectedAreaKm} km</span> from project boundary
            </div>
          )}
        </div>
      </div>

      {/* Key Species */}
      {!awaiting && (
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-ci-charcoal uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              Key Species in Landscape
            </h4>
            <DataSourceBadge source="field" label="CI Reports" />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {bio.keySpecies.map((sp) => (
              <span
                key={sp}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-ci-green-light text-ci-green-dark"
              >
                {sp}
              </span>
            ))}
          </div>

          {/* Threatened species */}
          {bio.threatenedSpecies.length > 0 && (
            <>
              <h4 className="text-xs font-bold text-ci-charcoal uppercase tracking-wider mb-2 mt-4 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-display)' }}>
                <AlertTriangle size={13} className="text-ci-orange" />
                Threatened Species
              </h4>
              <div className="flex flex-wrap gap-2">
                {bio.threatenedSpecies.map((sp) => (
                  <span
                    key={sp}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-ci-orange-light text-ci-orange border border-ci-orange/20"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Awaiting input state */}
      {awaiting && (
        <div className="bg-ci-cream rounded-[var(--radius-md)] p-5 text-center">
          <MapPin size={24} className="text-ci-gray-300 mx-auto mb-2" />
          <p className="text-sm text-ci-gray-500 font-medium">Species data awaiting CI input</p>
          <p className="text-xs text-ci-gray-500 mt-1">Ecoregion and biome data available. Contact CI to add species lists.</p>
        </div>
      )}

      {/* Notes */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
        <h4 className="text-xs font-bold text-ci-charcoal uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Biodiversity Context
        </h4>
        <p className="text-sm text-ci-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
          {bio.biodiversityNotes}
        </p>
      </div>
    </div>
  );
}

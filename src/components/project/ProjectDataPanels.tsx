'use client';

import { useState } from 'react';
import ClimatePanel from './ClimatePanel';
import SoilPanel from './SoilPanel';
import WaterPanel from './WaterPanel';
import BiodiversityPanel from './BiodiversityPanel';
import LivelihoodsPanel from './LivelihoodsPanel';
import AnimalWelfarePanel from './AnimalWelfarePanel';
import CommodityPanel from './CommodityPanel';
import GranteeDataPanel from './GranteeDataPanel';
import ProjectMiniMap from './ProjectMiniMap';
import PrinciplesTabs, { PrincipleId } from './PrinciplesTabs';
import PrincipleIndicatorView from './PrincipleIndicatorView';
import { commodityColor as getCommodityColor } from '@/lib/utils';

interface ProjectDataPanelsProps {
  projectId: string;
  lat: number;
  lng: number;
  commodity: string;
  name: string;
  country: string;
}

export default function ProjectDataPanels({ projectId, lat, lng, commodity, name, country }: ProjectDataPanelsProps) {
  const [activeTab, setActiveTab] = useState<PrincipleId>('climate');

  return (
    <div className="space-y-6">
      {/* Mini-map */}
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-1.5">
        <ProjectMiniMap
          lat={lat}
          lng={lng}
          name={name}
          commodityColor={getCommodityColor(commodity)}
        />
      </div>

      {/* Six Principles tabs */}
      <PrinciplesTabs
        active={activeTab}
        onChange={setActiveTab}
        projectId={projectId}
      />

      {/* Active principle panel + M&E framework indicators */}
      <div>
        {activeTab === 'climate' && <ClimatePanel lat={lat} lng={lng} />}
        {activeTab === 'soil' && <SoilPanel lat={lat} lng={lng} />}
        {activeTab === 'water' && <WaterPanel lat={lat} lng={lng} />}
        {activeTab === 'biodiversity' && <BiodiversityPanel projectId={projectId} />}
        {activeTab === 'livelihoods' && <LivelihoodsPanel projectId={projectId} country={country} />}
        {activeTab === 'animal_welfare' && <AnimalWelfarePanel projectId={projectId} />}

        {/* M&E framework indicators below public data panel */}
        <div className="mt-6 bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] px-5 py-4">
          <PrincipleIndicatorView
            principle={activeTab}
            commodity={commodity}
          />
        </div>
      </div>

      {/* Commodity + Grantee Data — always visible below the principle panel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CommodityPanel commodity={commodity} />
        <GranteeDataPanel projectId={projectId} />
      </div>
    </div>
  );
}

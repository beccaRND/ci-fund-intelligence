'use client';

import ClimatePanel from './ClimatePanel';
import SoilPanel from './SoilPanel';
import CommodityPanel from './CommodityPanel';
import GranteeDataPanel from './GranteeDataPanel';
import ProjectMiniMap from './ProjectMiniMap';
import { commodityColor as getCommodityColor } from '@/lib/utils';

interface ProjectDataPanelsProps {
  projectId: string;
  lat: number;
  lng: number;
  commodity: string;
  name: string;
}

export default function ProjectDataPanels({ projectId, lat, lng, commodity, name }: ProjectDataPanelsProps) {
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

      {/* Climate + Soil side by side on larger screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ClimatePanel lat={lat} lng={lng} />
        <SoilPanel lat={lat} lng={lng} />
      </div>

      {/* Commodity + Grantee Data side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CommodityPanel commodity={commodity} />
        <GranteeDataPanel projectId={projectId} />
      </div>
    </div>
  );
}

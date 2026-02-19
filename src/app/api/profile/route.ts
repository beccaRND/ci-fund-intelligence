import { NextRequest, NextResponse } from 'next/server';
import { getClimateData, processClimateData } from '@/lib/api/openMeteo';
import { getSoilData } from '@/lib/api/soilGrids';
import { getCommodityPrices } from '@/lib/api/worldBank';
import { getNASAPowerData } from '@/lib/api/nasaPower';
import { computeDegradation } from '@/lib/api/degradation';
import { projects } from '@/lib/seed/projects';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const projectId = searchParams.get('projectId');
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const commodity = searchParams.get('commodity') || 'cotton';

  // Resolve project or use raw coordinates
  const project = projectId ? projects.find((p) => p.id === projectId) : null;
  const resolvedLat = project ? project.lat : lat;
  const resolvedLng = project ? project.lng : lng;
  const resolvedCommodity = project ? project.commodity : commodity;
  const resolvedHectares = project ? project.hectares : 1000;

  if (isNaN(resolvedLat) || isNaN(resolvedLng)) {
    return NextResponse.json(
      { error: 'Either projectId or lat/lng coordinates are required' },
      { status: 400 }
    );
  }

  // Call all APIs in parallel with individual error handling
  const [climateResult, soilResult, commodityResult, nasaResult] = await Promise.allSettled([
    getClimateData(resolvedLat, resolvedLng).then(processClimateData),
    getSoilData(resolvedLat, resolvedLng),
    getCommodityPrices(resolvedCommodity),
    getNASAPowerData(resolvedLat, resolvedLng),
  ]);

  const climate = climateResult.status === 'fulfilled' ? climateResult.value : null;
  const soil = soilResult.status === 'fulfilled' ? soilResult.value : null;
  const commodityData = commodityResult.status === 'fulfilled' ? commodityResult.value : null;
  const nasa = nasaResult.status === 'fulfilled' ? nasaResult.value : null;

  // Compute degradation assessment if we have both soil and climate data
  let degradation = null;
  if (soil && climate) {
    degradation = computeDegradation(
      projectId || 'custom',
      soil.socStock_tPerHa,
      soil.textureClass,
      climate.annualPrecip,
      resolvedCommodity,
      resolvedHectares
    );
  }

  return NextResponse.json({
    success: true,
    coordinates: { lat: resolvedLat, lng: resolvedLng },
    project: project || null,
    climate,
    soil,
    commodity: commodityData,
    nasa,
    degradation,
    errors: {
      climate: climateResult.status === 'rejected' ? (climateResult.reason as Error).message : null,
      soil: soilResult.status === 'rejected' ? (soilResult.reason as Error).message : null,
      commodity: commodityResult.status === 'rejected' ? (commodityResult.reason as Error).message : null,
      nasa: nasaResult.status === 'rejected' ? (nasaResult.reason as Error).message : null,
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getSoilData } from '@/lib/api/soilGrids';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'lat and lng are required numeric parameters' },
      { status: 400 }
    );
  }

  try {
    const data = await getSoilData(lat, lng);
    const isFallback = 'isFallback' in data && data.isFallback;

    return NextResponse.json({
      success: true,
      data,
      source: isFallback
        ? 'Estimated from regional literature values (SoilGrids API unavailable)'
        : 'ISRIC SoilGrids 2.0 (250m resolution)',
      isFallback,
      coordinates: { lat, lng },
    });
  } catch (error) {
    console.error('Soil API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch soil data',
        message: error instanceof Error ? error.message : 'Unknown error',
        fallbackNote:
          'SoilGrids API may be temporarily unavailable (beta service). Please retry in a few minutes.',
      },
      { status: 502 }
    );
  }
}

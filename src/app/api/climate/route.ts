import { NextRequest, NextResponse } from 'next/server';
import { getClimateData, processClimateData } from '@/lib/api/openMeteo';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: 'lat and lng are required numeric parameters' },
      { status: 400 }
    );
  }

  try {
    const raw = await getClimateData(lat, lng, startDate, endDate);
    const processed = processClimateData(raw);

    return NextResponse.json({
      success: true,
      data: processed,
      source: 'Open-Meteo Historical Weather API (ERA5)',
      coordinates: { lat, lng },
    });
  } catch (error) {
    console.error('Climate API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch climate data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 }
    );
  }
}

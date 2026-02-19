import { NextRequest, NextResponse } from 'next/server';
import { getCommodityPrices } from '@/lib/api/worldBank';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const commodity = searchParams.get('commodity');

  if (!commodity) {
    return NextResponse.json(
      { error: 'commodity parameter is required' },
      { status: 400 }
    );
  }

  try {
    const data = await getCommodityPrices(commodity);

    return NextResponse.json({
      success: true,
      data,
      source: data.prices.length > 0 ? 'World Bank Commodity API' : 'Contextual data (no public price API)',
    });
  } catch (error) {
    console.error('Commodities API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch commodity data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 }
    );
  }
}

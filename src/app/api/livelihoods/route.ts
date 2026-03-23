import { NextRequest, NextResponse } from 'next/server';
import { getLivelihoodData } from '@/lib/api/worldBankWDI';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const countryCode = searchParams.get('countryCode');

  if (!countryCode) {
    return NextResponse.json({ error: 'countryCode parameter required' }, { status: 400 });
  }

  try {
    const metrics = await getLivelihoodData(countryCode);
    return NextResponse.json({ metrics, countryCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch livelihood data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

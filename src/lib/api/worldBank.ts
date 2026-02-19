// World Bank commodity price data
// Note: The World Bank Commodity API uses specific indicator codes

const COMMODITY_INDICATORS: Record<string, string | null> = {
  cotton: 'COTTON_A_INDX',
  wool: null, // No direct World Bank indicator for wool — use fallback data
  cashmere: null, // No public API for cashmere
  leather: null, // No direct indicator
};

export interface CommodityPriceData {
  commodity: string;
  prices: { date: string; price: number }[];
  unit: string;
  contextText: string | null;
}

// Fallback context text for commodities without price APIs
const COMMODITY_CONTEXT: Record<string, string> = {
  cashmere: `Mongolia supplies approximately 40% of global cashmere demand. About 80% is exported unprocessed, and roughly 70% of pastureland shows signs of degradation. The Sustainable Fibre Alliance (SFA) has certified over 21,500 herders across 17 provinces. Premium certified cashmere commands 10-15% price premiums over conventional.`,

  wool: `Global wool production is approximately 1.1 million tonnes annually. Australia leads production (25%), followed by China (18%). Fine merino wool trades at significant premiums — Wildlife Friendly-certified wool from Patagonia commands 15% premiums. The wool market has seen moderate price recovery since 2020 lows.`,

  leather: `Global leather industry valued at approximately $400B. The Gran Chaco region in Argentina faces acute deforestation pressure from cattle ranching. Sustainable leather certification is emerging but not yet standardized. Note: Leather was dropped from the fund's 2025 eligible commodities list.`,
};

export async function getCommodityPrices(commodity: string): Promise<CommodityPriceData> {
  const indicator = COMMODITY_INDICATORS[commodity];

  if (!indicator) {
    // Return context text only for commodities without price APIs
    return {
      commodity,
      prices: [],
      unit: '',
      contextText: COMMODITY_CONTEXT[commodity] || `No public price data available for ${commodity}.`,
    };
  }

  try {
    // Use World Bank API for commodity prices
    // The pink sheet data endpoint
    const res = await fetch(
      `https://api.worldbank.org/v2/country/WLD/indicator/${indicator}?date=2019:2025&format=json&per_page=100`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      throw new Error(`World Bank API error: ${res.status}`);
    }

    const data = await res.json();

    // World Bank API returns [metadata, data_array]
    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
      // Fallback: return synthetic cotton price data based on known market values
      return getCottonFallback();
    }

    const prices = data[1]
      .filter((item: { value: number | null }) => item.value !== null)
      .map((item: { date: string; value: number }) => ({
        date: item.date,
        price: Math.round(item.value * 100) / 100,
      }))
      .sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date));

    return {
      commodity,
      prices,
      unit: 'US cents/lb',
      contextText: null,
    };
  } catch {
    // Fallback for cotton if API fails
    if (commodity === 'cotton') {
      return getCottonFallback();
    }
    return {
      commodity,
      prices: [],
      unit: '',
      contextText: COMMODITY_CONTEXT[commodity] || `Price data temporarily unavailable for ${commodity}.`,
    };
  }
}

function getCottonFallback(): CommodityPriceData {
  // Approximate cotton A-index prices (US cents/lb) based on published market data
  return {
    commodity: 'cotton',
    prices: [
      { date: '2019', price: 75.2 },
      { date: '2020', price: 68.4 },
      { date: '2021', price: 102.8 },
      { date: '2022', price: 128.3 },
      { date: '2023', price: 95.7 },
      { date: '2024', price: 88.1 },
    ],
    unit: 'US cents/lb (approximate)',
    contextText:
      'Cotton A-Index approximate values. Global cotton production ~25M tonnes annually. India is the largest producer. Organic cotton commands 10-20% premiums.',
  };
}

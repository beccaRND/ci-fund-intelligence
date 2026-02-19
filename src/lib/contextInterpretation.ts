/**
 * Rule-based contextual interpretation engine.
 * NOT an LLM call — simple deterministic logic that contextualizes
 * SOC changes against climate conditions during the monitoring period.
 */

export interface MonitoringContext {
  socChange: number | null;       // t C/ha change from baseline
  socChangePercent: number | null; // % change
  precipAnomaly: number;          // % deviation from 5yr avg (negative = deficit)
  tempAnomaly: number;            // °C deviation from 5yr avg
  droughtOccurred: boolean;       // any 30+ day dry streak in period
  moistureDeficit: boolean;       // significant soil moisture drop
}

export interface Interpretation {
  headline: string;
  body: string;
  severity: 'positive' | 'neutral' | 'warning' | 'alert';
}

export function generateInterpretation(ctx: MonitoringContext): Interpretation[] {
  const interpretations: Interpretation[] = [];

  const hasSocData = ctx.socChange !== null;
  const socDeclined = hasSocData && (ctx.socChange ?? 0) < 0;
  const socIncreased = hasSocData && (ctx.socChange ?? 0) > 0;
  const severeDeficit = ctx.precipAnomaly < -25;
  const mildDeficit = ctx.precipAnomaly < -10 && ctx.precipAnomaly >= -25;
  const warmAnomaly = ctx.tempAnomaly > 0.8;

  // Drought + SOC decline
  if (socDeclined && ctx.droughtOccurred) {
    interpretations.push({
      headline: 'SOC decline consistent with drought conditions',
      body: `The observed SOC decline of ${Math.abs(ctx.socChange ?? 0).toFixed(1)} t C/ha is consistent with the severe drought conditions during this monitoring period. Reduced soil moisture and elevated temperatures accelerate organic matter decomposition. This does not necessarily indicate practice failure.`,
      severity: 'warning',
    });
  }

  // SOC decline + severe precip deficit but no drought flag
  if (socDeclined && severeDeficit && !ctx.droughtOccurred) {
    interpretations.push({
      headline: 'SOC decline during significant precipitation deficit',
      body: `Precipitation was ${Math.abs(ctx.precipAnomaly).toFixed(0)}% below the 5-year average during the monitoring period. This moisture deficit likely contributed to reduced microbial activity and accelerated SOC decomposition, partially explaining the observed decline.`,
      severity: 'warning',
    });
  }

  // SOC increased under normal/favorable conditions
  if (socIncreased && !ctx.droughtOccurred && ctx.precipAnomaly > -10) {
    interpretations.push({
      headline: 'SOC increase during favorable conditions',
      body: `The observed SOC increase of ${(ctx.socChange ?? 0).toFixed(1)} t C/ha occurred during relatively normal climate conditions, suggesting that management practices are contributing to soil carbon accumulation as intended.`,
      severity: 'positive',
    });
  }

  // SOC increased despite adverse conditions
  if (socIncreased && (ctx.droughtOccurred || severeDeficit)) {
    interpretations.push({
      headline: 'Positive SOC trend despite challenging conditions',
      body: `Notably, soil carbon increased despite adverse climate conditions during the monitoring period. This suggests the implemented management practices are effective at building soil carbon resilience even under climate stress.`,
      severity: 'positive',
    });
  }

  // SOC declined under normal conditions
  if (socDeclined && !ctx.droughtOccurred && ctx.precipAnomaly >= -10 && !warmAnomaly) {
    interpretations.push({
      headline: 'SOC decline during normal conditions warrants investigation',
      body: `The observed SOC decline occurred during relatively normal climate conditions (precipitation within 10% of average, no drought events). This may indicate that current management practices need review or adjustment.`,
      severity: 'alert',
    });
  }

  // Temperature anomaly
  if (warmAnomaly) {
    interpretations.push({
      headline: `Temperature anomaly: +${ctx.tempAnomaly.toFixed(1)}°C above average`,
      body: `The monitoring period was significantly warmer than the 5-year baseline. Elevated temperatures increase soil respiration rates, which can accelerate SOC decomposition regardless of management practices.`,
      severity: 'warning',
    });
  }

  // Precipitation anomaly (informational)
  if (severeDeficit) {
    interpretations.push({
      headline: 'Severe precipitation deficit',
      body: `This region received ${Math.abs(ctx.precipAnomaly).toFixed(0)}% less precipitation than the 5-year average during the monitoring period. Extended dry conditions reduce plant productivity and root carbon inputs to soil.`,
      severity: 'alert',
    });
  } else if (mildDeficit) {
    interpretations.push({
      headline: 'Mild precipitation deficit',
      body: `Precipitation was ${Math.abs(ctx.precipAnomaly).toFixed(0)}% below the 5-year average. This moderate deficit may have partially limited soil carbon accumulation.`,
      severity: 'neutral',
    });
  } else if (ctx.precipAnomaly > 15) {
    interpretations.push({
      headline: 'Above-average precipitation',
      body: `Precipitation was ${ctx.precipAnomaly.toFixed(0)}% above the 5-year average. Increased moisture typically supports plant growth and root carbon inputs, which is favorable for SOC accumulation.`,
      severity: 'positive',
    });
  }

  // No SOC data available
  if (!hasSocData) {
    interpretations.push({
      headline: 'Climate context ready — awaiting monitoring data',
      body: 'Upload soil carbon monitoring results to generate a full contextual interpretation comparing your field data against the environmental conditions during the monitoring period.',
      severity: 'neutral',
    });
  }

  return interpretations;
}

// Calculate climate anomalies from monthly data
export function computeAnomalies(
  monitoringMonths: { month: string; tempMean: number; precipitation: number }[],
  allMonths: { month: string; tempMean: number; precipitation: number }[]
) {
  if (monitoringMonths.length === 0 || allMonths.length === 0) {
    return { precipAnomaly: 0, tempAnomaly: 0 };
  }

  // Calculate baseline averages (by calendar month across all years)
  const baselineByMonth: Record<string, { temps: number[]; precips: number[] }> = {};
  for (const m of allMonths) {
    const calMonth = m.month.substring(5); // "01", "02", etc.
    if (!baselineByMonth[calMonth]) baselineByMonth[calMonth] = { temps: [], precips: [] };
    baselineByMonth[calMonth].temps.push(m.tempMean);
    baselineByMonth[calMonth].precips.push(m.precipitation);
  }

  const baselineAvg: Record<string, { temp: number; precip: number }> = {};
  for (const [cm, data] of Object.entries(baselineByMonth)) {
    baselineAvg[cm] = {
      temp: data.temps.reduce((a, b) => a + b, 0) / data.temps.length,
      precip: data.precips.reduce((a, b) => a + b, 0) / data.precips.length,
    };
  }

  // Compare monitoring period to baseline
  let totalPrecipMonitoring = 0;
  let totalPrecipBaseline = 0;
  let tempDiffs: number[] = [];

  for (const m of monitoringMonths) {
    const calMonth = m.month.substring(5);
    const baseline = baselineAvg[calMonth];
    if (!baseline) continue;

    totalPrecipMonitoring += m.precipitation;
    totalPrecipBaseline += baseline.precip;
    tempDiffs.push(m.tempMean - baseline.temp);
  }

  const precipAnomaly = totalPrecipBaseline > 0
    ? ((totalPrecipMonitoring - totalPrecipBaseline) / totalPrecipBaseline) * 100
    : 0;
  const tempAnomaly = tempDiffs.length > 0
    ? tempDiffs.reduce((a, b) => a + b, 0) / tempDiffs.length
    : 0;

  return {
    precipAnomaly: Math.round(precipAnomaly * 10) / 10,
    tempAnomaly: Math.round(tempAnomaly * 100) / 100,
  };
}

import { NextResponse } from 'next/server';
import { getClimateData, processClimateData } from '@/lib/api/openMeteo';
import { getSoilData } from '@/lib/api/soilGrids';
import { computeDegradation } from '@/lib/api/degradation';
import { projects } from '@/lib/seed/projects';
import type { DegradationAssessment } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: (DegradationAssessment & { projectName: string; country: string; commodity: string; hectares: number })[] = [];
  const errors: { projectId: string; error: string }[] = [];

  // Process projects in batches of 4 to avoid overwhelming APIs
  const BATCH_SIZE = 4;
  for (let i = 0; i < projects.length; i += BATCH_SIZE) {
    const batch = projects.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (project) => {
        const [climateResult, soilResult] = await Promise.allSettled([
          getClimateData(project.lat, project.lng).then(processClimateData),
          getSoilData(project.lat, project.lng),
        ]);

        const climate = climateResult.status === 'fulfilled' ? climateResult.value : null;
        const soil = soilResult.status === 'fulfilled' ? soilResult.value : null;

        if (!soil || !climate) {
          throw new Error(`Missing data: soil=${!!soil}, climate=${!!climate}`);
        }

        const assessment = computeDegradation(
          project.id,
          soil.socStock_tPerHa,
          soil.textureClass,
          climate.annualPrecip,
          project.commodity,
          project.hectares
        );

        return {
          ...assessment,
          projectName: project.name,
          country: project.country,
          commodity: project.commodity,
          hectares: project.hectares,
        };
      })
    );

    for (let j = 0; j < batchResults.length; j++) {
      const r = batchResults[j];
      if (r.status === 'fulfilled') {
        results.push(r.value);
      } else {
        errors.push({
          projectId: batch[j].id,
          error: (r.reason as Error).message,
        });
      }
    }
  }

  // Sort by priority score descending and assign ranks
  results.sort((a, b) => b.priorityScore - a.priorityScore);
  results.forEach((r, idx) => {
    r.priorityRank = idx + 1;
  });

  return NextResponse.json({
    success: true,
    assessments: results,
    totalProjects: projects.length,
    successCount: results.length,
    errors,
  });
}

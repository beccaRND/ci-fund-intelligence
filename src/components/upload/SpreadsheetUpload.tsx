'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, X, ChevronRight, Sparkles, Check, SkipForward } from 'lucide-react';

interface SpreadsheetData {
  headers: string[];
  rows: unknown[][];
  sheetName: string;
  totalRows: number;
}

interface ColumnMapping {
  sourceColumn: string;
  targetPrinciple: string;
  targetMetric: string;
  unit: string | null;
  mapped: boolean;
  autoMapped: boolean;
}

const MAPPABLE_METRICS: Record<string, { id: string; label: string; unit: string }[]> = {
  climate: [
    { id: 'mean_temp', label: 'Mean Temperature', unit: '\u00b0C' },
    { id: 'annual_precip', label: 'Annual Precipitation', unit: 'mm' },
    { id: 'drought_events', label: 'Drought Events', unit: 'count' },
  ],
  soil: [
    { id: 'soc_stock', label: 'SOC Stock (0-30cm)', unit: 't C/ha' },
    { id: 'soc_change', label: 'SOC Change', unit: 't C/ha' },
    { id: 'ph', label: 'Soil pH', unit: 'pH' },
    { id: 'bulk_density', label: 'Bulk Density', unit: 'g/cm\u00b3' },
  ],
  water: [
    { id: 'water_quality', label: 'Water Quality Index', unit: 'score' },
    { id: 'water_table', label: 'Water Table Depth', unit: 'm' },
    { id: 'irrigation_pct', label: 'Irrigated Area', unit: '%' },
  ],
  biodiversity: [
    { id: 'species_count', label: 'Species Count', unit: 'count' },
    { id: 'habitat_area', label: 'Habitat Area Restored', unit: 'ha' },
    { id: 'tree_cover', label: 'Tree Cover', unit: '%' },
  ],
  livelihoods: [
    { id: 'beneficiaries', label: 'Beneficiaries', unit: 'count' },
    { id: 'avg_income', label: 'Average Income', unit: 'USD' },
    { id: 'income_change', label: 'Income Change', unit: '%' },
    { id: 'women_pct', label: 'Women Participants', unit: '%' },
  ],
  animal_welfare: [
    { id: 'head_count', label: 'Livestock Head Count', unit: 'count' },
    { id: 'stocking_rate', label: 'Stocking Rate', unit: 'head/ha' },
    { id: 'mortality_rate', label: 'Mortality Rate', unit: '%' },
  ],
};

const PRINCIPLE_LABELS: Record<string, string> = {
  climate: '\u2600\ufe0f Climate',
  soil: '\ud83c\udf31 Soil Health',
  water: '\ud83d\udca7 Water',
  biodiversity: '\ud83e\udd8b Biodiversity',
  livelihoods: '\ud83d\udc65 Livelihoods',
  animal_welfare: '\ud83d\udc11 Animal Welfare',
};

// Simple auto-mapping rules
const AUTO_MAP_RULES: { pattern: RegExp; principle: string; metric: string }[] = [
  { pattern: /soc|soil.?carbon|organic.?carbon/i, principle: 'soil', metric: 'soc_stock' },
  { pattern: /soc.?change|carbon.?change/i, principle: 'soil', metric: 'soc_change' },
  { pattern: /ph|soil.?ph/i, principle: 'soil', metric: 'ph' },
  { pattern: /bulk.?density/i, principle: 'soil', metric: 'bulk_density' },
  { pattern: /precip|rainfall/i, principle: 'climate', metric: 'annual_precip' },
  { pattern: /temp|temperature/i, principle: 'climate', metric: 'mean_temp' },
  { pattern: /drought/i, principle: 'climate', metric: 'drought_events' },
  { pattern: /species|biodiversity/i, principle: 'biodiversity', metric: 'species_count' },
  { pattern: /habitat|restoration/i, principle: 'biodiversity', metric: 'habitat_area' },
  { pattern: /tree.?cover/i, principle: 'biodiversity', metric: 'tree_cover' },
  { pattern: /beneficiar/i, principle: 'livelihoods', metric: 'beneficiaries' },
  { pattern: /income/i, principle: 'livelihoods', metric: 'avg_income' },
  { pattern: /women|female/i, principle: 'livelihoods', metric: 'women_pct' },
  { pattern: /head.?count|livestock/i, principle: 'animal_welfare', metric: 'head_count' },
  { pattern: /stocking/i, principle: 'animal_welfare', metric: 'stocking_rate' },
  { pattern: /mortality/i, principle: 'animal_welfare', metric: 'mortality_rate' },
  { pattern: /water.?quality/i, principle: 'water', metric: 'water_quality' },
  { pattern: /irrigation/i, principle: 'water', metric: 'irrigation_pct' },
];

export default function SpreadsheetUpload() {
  const [step, setStep] = useState<'upload' | 'preview' | 'map' | 'done'>('upload');
  const [data, setData] = useState<SpreadsheetData | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(raw, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as unknown[][];

      const headers = (jsonData[0] || []) as string[];
      const rows = jsonData.slice(1);

      setData({
        headers,
        rows,
        sheetName: workbook.SheetNames[0],
        totalRows: rows.length,
      });

      // Auto-map columns
      const autoMappings = headers.map((h) => {
        const match = AUTO_MAP_RULES.find((rule) => rule.pattern.test(h));
        if (match) {
          const metric = MAPPABLE_METRICS[match.principle]?.find((m) => m.id === match.metric);
          return {
            sourceColumn: h,
            targetPrinciple: match.principle,
            targetMetric: match.metric,
            unit: metric?.unit ?? null,
            mapped: true,
            autoMapped: true,
          };
        }
        return {
          sourceColumn: h,
          targetPrinciple: '',
          targetMetric: '',
          unit: null,
          mapped: false,
          autoMapped: false,
        };
      });

      setMappings(autoMappings);
      setStep('preview');
    };
    reader.readAsArrayBuffer(file);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  }, []);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  }, []);

  function updateMapping(idx: number, principle: string, metric: string) {
    setMappings((prev) =>
      prev.map((m, i) =>
        i === idx
          ? {
              ...m,
              targetPrinciple: principle,
              targetMetric: metric,
              unit: MAPPABLE_METRICS[principle]?.find((mt) => mt.id === metric)?.unit ?? null,
              mapped: principle !== '' && metric !== '',
              autoMapped: false,
            }
          : m
      )
    );
  }

  function skipColumn(idx: number) {
    setMappings((prev) =>
      prev.map((m, i) =>
        i === idx ? { ...m, targetPrinciple: '', targetMetric: '', mapped: false, autoMapped: false } : m
      )
    );
  }

  const autoMappedCount = mappings.filter((m) => m.autoMapped).length;
  const mappedCount = mappings.filter((m) => m.mapped).length;

  // Step 1: Upload
  if (step === 'upload') {
    return (
      <div
        className={`border-2 border-dashed rounded-[var(--radius-md)] p-10 text-center transition-colors ${
          dragOver ? 'border-ci-green bg-ci-green-light/30' : 'border-ci-gray-300 bg-ci-cream/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <FileSpreadsheet size={40} className="mx-auto text-ci-gray-300 mb-4" />
        <p className="text-sm font-medium text-ci-charcoal mb-1">Drop your spreadsheet here</p>
        <p className="text-xs text-ci-gray-500 mb-4">Accepts .xlsx, .xls, .csv, .tsv</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold cursor-pointer hover:bg-ci-green-dark transition-colors">
          <Upload size={14} />
          Choose File
          <input
            type="file"
            accept=".xlsx,.xls,.csv,.tsv"
            className="hidden"
            onChange={onFileSelect}
          />
        </label>
      </div>
    );
  }

  // Step 2: Preview
  if (step === 'preview' && data) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Preview: {data.sheetName}
            </h4>
            <p className="text-xs text-ci-gray-500">{data.totalRows} rows, {data.headers.length} columns</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setStep('upload'); setData(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-ci-gray-500 hover:text-ci-charcoal transition-colors"
            >
              <X size={12} /> Start Over
            </button>
            <button
              onClick={() => setStep('map')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors"
            >
              Map Columns <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-ci-gray-300/50">
                {data.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left text-ci-gray-500 font-semibold whitespace-nowrap">
                    {String(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.slice(0, 10).map((row, ri) => (
                <tr key={ri} className="border-b border-ci-gray-300/20">
                  {data.headers.map((_, ci) => (
                    <td key={ci} className="px-3 py-1.5 text-ci-gray-700 whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)' }}>
                      {row[ci] != null ? String(row[ci]) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.totalRows > 10 && (
            <div className="px-3 py-2 text-[11px] text-ci-gray-500 text-center border-t border-ci-gray-300/30">
              Showing first 10 of {data.totalRows} rows
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 3: Column Mapping
  if (step === 'map') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Map Your Data
            </h4>
            <p className="text-xs text-ci-gray-500">
              {data?.headers.length} columns found. Map each to a monitoring principle and metric.
            </p>
          </div>
          <button
            onClick={() => setStep('done')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] bg-ci-green text-white text-sm font-semibold hover:bg-ci-green-dark transition-colors"
          >
            Review & Import <ChevronRight size={14} />
          </button>
        </div>

        {autoMappedCount > 0 && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-ci-green-light rounded-[var(--radius-sm)] border border-ci-green/20">
            <Sparkles size={14} className="text-ci-green" />
            <span className="text-sm text-ci-green-dark font-medium">
              Auto-mapped {autoMappedCount} of {data?.headers.length} columns based on header names
            </span>
          </div>
        )}

        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] divide-y divide-ci-gray-300/30">
          {mappings.map((m, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="w-48 shrink-0">
                <div className="text-sm font-medium text-ci-charcoal flex items-center gap-1.5">
                  {m.sourceColumn}
                  {m.autoMapped && <Sparkles size={10} className="text-ci-green" />}
                </div>
              </div>
              <ChevronRight size={14} className="text-ci-gray-300 shrink-0" />
              <select
                value={m.targetPrinciple}
                onChange={(e) => updateMapping(i, e.target.value, '')}
                className="text-xs px-2 py-1.5 rounded-[var(--radius-sm)] border border-ci-gray-300/50 bg-ci-cream text-ci-gray-700 min-w-[140px]"
              >
                <option value="">Skip</option>
                {Object.entries(PRINCIPLE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {m.targetPrinciple && (
                <>
                  <ChevronRight size={14} className="text-ci-gray-300 shrink-0" />
                  <select
                    value={m.targetMetric}
                    onChange={(e) => updateMapping(i, m.targetPrinciple, e.target.value)}
                    className="text-xs px-2 py-1.5 rounded-[var(--radius-sm)] border border-ci-gray-300/50 bg-ci-cream text-ci-gray-700 min-w-[160px]"
                  >
                    <option value="">Select metric...</option>
                    {(MAPPABLE_METRICS[m.targetPrinciple] || []).map((mt) => (
                      <option key={mt.id} value={mt.id}>{mt.label} ({mt.unit})</option>
                    ))}
                  </select>
                </>
              )}
              {m.mapped && (
                <Check size={14} className="text-ci-green shrink-0" />
              )}
              {!m.mapped && m.targetPrinciple === '' && (
                <span className="text-[10px] text-ci-gray-500 shrink-0">
                  <SkipForward size={12} className="inline" /> Skipped
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Done
  if (step === 'done') {
    return (
      <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-ci-green-light flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-ci-green" />
        </div>
        <h4 className="text-lg font-bold text-ci-charcoal mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Import Complete
        </h4>
        <p className="text-sm text-ci-gray-500 mb-1">
          {mappedCount} column{mappedCount !== 1 ? 's' : ''} mapped across {data?.totalRows} rows
        </p>
        <p className="text-xs text-ci-gray-500 mb-6">
          Data stored locally in this prototype. Production version will sync to the CI database.
        </p>
        <button
          onClick={() => { setStep('upload'); setData(null); setMappings([]); }}
          className="px-4 py-2 rounded-[var(--radius-md)] border border-ci-gray-300 text-ci-gray-700 text-sm font-semibold hover:bg-ci-gray-100 transition-colors"
        >
          Upload Another
        </button>
      </div>
    );
  }

  return null;
}

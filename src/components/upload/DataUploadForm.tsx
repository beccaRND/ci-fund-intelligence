'use client';

import { useState, useCallback } from 'react';
import { Beaker, MapPin, Calendar, BarChart3, FileText, Layers } from 'lucide-react';
import UploadZone from './UploadZone';
import ComplianceScore from './ComplianceScore';
import { defaultFormData, runChecklist, computeScore } from '@/lib/checklist';
import type { UploadFormData, ChecklistResult } from '@/lib/checklist';

interface DataUploadFormProps {
  projectId: string;
  projectName: string;
  yearJoined: number;
}

const STRATIFICATION_OPTIONS = ['Soil type', 'Management practice', 'Cropping system', 'Topography'];
const DEPTH_INTERVALS = ['0-5', '5-15', '15-30', '30-60', '60-100'];
const LAB_METHODS = [
  { value: 'dumas', label: 'Dry combustion (Dumas)' },
  { value: 'walkley-black', label: 'Wet oxidation (Walkley-Black)' },
  { value: 'mir', label: 'MIR spectroscopy' },
  { value: 'vis-nir', label: 'Vis-NIR spectroscopy' },
  { value: 'other', label: 'Other' },
];
const BULK_DENSITY_OPTIONS = [
  { value: 'measured', label: 'Directly measured' },
  { value: 'esm', label: 'ESM approach' },
  { value: 'not-measured', label: 'Not measured' },
];
const QAQC_OPTIONS = ['Lab duplicates', 'Reference samples', 'Replicate analysis'];

export default function DataUploadForm({ projectId, projectName, yearJoined }: DataUploadFormProps) {
  const [form, setForm] = useState<UploadFormData>({
    ...defaultFormData,
    projectStartYear: yearJoined,
  });
  const [results, setResults] = useState<ChecklistResult[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const updateField = useCallback(<K extends keyof UploadFormData>(key: K, value: UploadFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setShowResults(false);
  }, []);

  const toggleArrayItem = useCallback((key: keyof UploadFormData, item: string) => {
    setForm((prev) => {
      const arr = prev[key] as string[];
      const next = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      return { ...prev, [key]: next };
    });
    setShowResults(false);
  }, []);

  const handleValidate = useCallback(() => {
    const checklistResults = runChecklist(form);
    const checklistScore = computeScore(checklistResults);
    setResults(checklistResults);
    setScore(checklistScore);
    setShowResults(true);
  }, [form]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Form — takes 2 columns */}
      <div className="xl:col-span-2 space-y-6">
        {/* Project Context (read-only) */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-ci-green" />
            <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Project Context
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider">Project</label>
              <p className="text-sm text-ci-charcoal font-medium mt-0.5">{projectName}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider">Data Type</label>
              <p className="text-sm text-ci-charcoal font-medium mt-0.5">Soil Carbon Monitoring</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider">Monitoring Period</label>
              <div className="flex gap-2 mt-0.5">
                <input
                  type="date"
                  value={form.baselineDate}
                  onChange={(e) => updateField('baselineDate', e.target.value)}
                  className="px-2 py-1 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
                />
                <span className="text-ci-gray-500 self-center text-sm">to</span>
                <input
                  type="date"
                  value={form.currentMeasurementDate}
                  onChange={(e) => updateField('currentMeasurementDate', e.target.value)}
                  className="px-2 py-1 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider">Project Start Year</label>
              <input
                type="number"
                value={form.projectStartYear ?? ''}
                onChange={(e) => updateField('projectStartYear', e.target.value ? Number(e.target.value) : null)}
                className="mt-0.5 w-24 px-2 py-1 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>
        </div>

        {/* Sampling Design */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={18} className="text-ci-teal" />
            <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Sampling Design
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Number of Strata
              </label>
              <input
                type="number"
                min={1}
                value={form.numberOfStrata ?? ''}
                onChange={(e) => updateField('numberOfStrata', e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g. 3"
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal placeholder:text-ci-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Samples per Stratum
              </label>
              <input
                type="number"
                min={1}
                value={form.samplesPerStratum ?? ''}
                onChange={(e) => updateField('samplesPerStratum', e.target.value ? Number(e.target.value) : null)}
                placeholder="≥ 5 recommended"
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal placeholder:text-ci-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Max Sampling Depth (cm)
              </label>
              <input
                type="number"
                min={1}
                value={form.maxDepthCm ?? ''}
                onChange={(e) => updateField('maxDepthCm', e.target.value ? Number(e.target.value) : null)}
                placeholder="30"
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal placeholder:text-ci-gray-300"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Verification Frequency (years)
              </label>
              <input
                type="number"
                min={1}
                value={form.verificationFrequencyYears ?? ''}
                onChange={(e) => updateField('verificationFrequencyYears', e.target.value ? Number(e.target.value) : null)}
                placeholder="≤ 5"
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal placeholder:text-ci-gray-300"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-2 block">
              Stratification Factors
            </label>
            <div className="flex flex-wrap gap-2">
              {STRATIFICATION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleArrayItem('stratificationFactors', opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    form.stratificationFactors.includes(opt)
                      ? 'bg-ci-teal text-white'
                      : 'bg-ci-gray-100 text-ci-gray-700 hover:bg-ci-teal-light'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-2 block">
              Depth Intervals Sampled (cm)
            </label>
            <div className="flex flex-wrap gap-2">
              {DEPTH_INTERVALS.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleArrayItem('depthIntervals', d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    form.depthIntervals.includes(d)
                      ? 'bg-ci-green text-white'
                      : 'bg-ci-gray-100 text-ci-gray-700 hover:bg-ci-green-light'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Laboratory */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Beaker size={18} className="text-ci-orange" />
            <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Laboratory
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Lab Method
              </label>
              <select
                value={form.labMethod}
                onChange={(e) => updateField('labMethod', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
              >
                <option value="">Select method...</option>
                {LAB_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Lab Name
              </label>
              <input
                type="text"
                value={form.labName}
                onChange={(e) => updateField('labName', e.target.value)}
                placeholder="e.g. SGS Labs"
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal placeholder:text-ci-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Bulk Density
              </label>
              <select
                value={form.bulkDensityApproach}
                onChange={(e) => updateField('bulkDensityApproach', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
              >
                <option value="">Select approach...</option>
                {BULK_DENSITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-2 block">
              QA/QC Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {QAQC_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleArrayItem('qaqcMethods', opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    form.qaqcMethods.includes(opt)
                      ? 'bg-ci-orange text-white'
                      : 'bg-ci-gray-100 text-ci-gray-700 hover:bg-ci-orange-light'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <UploadZone
              label="Lab Report"
              accept=".pdf,.doc,.docx"
              hint="PDF or Word document"
              uploaded={form.labReportUploaded}
              onUpload={() => updateField('labReportUploaded', true)}
              onRemove={() => updateField('labReportUploaded', false)}
            />
          </div>
        </div>

        {/* Spatial */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-ci-green" />
            <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Spatial
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.gpsCoordinates}
                  onChange={(e) => updateField('gpsCoordinates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-ci-gray-300 peer-focus:ring-2 peer-focus:ring-ci-green/30 rounded-full peer peer-checked:bg-ci-green transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <span className="text-sm text-ci-charcoal">Sample locations georeferenced</span>
            </div>

            <UploadZone
              label="GPS Coordinates File"
              accept=".csv,.gpx,.kml"
              hint="CSV, GPX, or KML format"
              uploaded={form.gpsFileUploaded}
              onUpload={() => updateField('gpsFileUploaded', true)}
              onRemove={() => updateField('gpsFileUploaded', false)}
            />
          </div>
        </div>

        {/* Timing */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-ci-gold" />
            <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Timing
            </h3>
          </div>
          <p className="text-xs text-ci-gray-500 mb-3">
            Baseline and current measurement dates are set in the Project Context section above.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="px-3 py-2 bg-ci-gray-100 rounded-[var(--radius-sm)]">
              <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider">Baseline</span>
              <p className="text-sm text-ci-charcoal font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                {form.baselineDate || '—'}
              </p>
            </div>
            <div className="px-3 py-2 bg-ci-gray-100 rounded-[var(--radius-sm)]">
              <span className="text-[11px] text-ci-gray-500 uppercase tracking-wider">Current</span>
              <p className="text-sm text-ci-charcoal font-medium" style={{ fontFamily: 'var(--font-mono)' }}>
                {form.currentMeasurementDate || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-ci-green" />
            <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Results
            </h3>
            <span className="text-[11px] text-ci-gray-500 bg-ci-gray-100 px-2 py-0.5 rounded-full">Optional</span>
          </div>

          <div className="mb-4">
            <UploadZone
              label="SOC Results File"
              accept=".csv,.xlsx"
              hint="CSV or Excel with SOC measurements"
              uploaded={form.resultsFileUploaded}
              onUpload={() => updateField('resultsFileUploaded', true)}
              onRemove={() => updateField('resultsFileUploaded', false)}
            />
          </div>

          <p className="text-xs text-ci-gray-500 mb-3 font-medium">Or enter summary manually:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Mean SOC (0-30cm)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={form.meanSOC ?? ''}
                  onChange={(e) => updateField('meanSOC', e.target.value ? Number(e.target.value) : null)}
                  placeholder="—"
                  className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <span className="text-xs text-ci-gray-500 shrink-0">t C/ha</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                SOC Change
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={form.socChangeFromBaseline ?? ''}
                  onChange={(e) => updateField('socChangeFromBaseline', e.target.value ? Number(e.target.value) : null)}
                  placeholder="—"
                  className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <span className="text-xs text-ci-gray-500 shrink-0">t C/ha</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Confidence Interval
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="1"
                  value={form.confidenceInterval ?? ''}
                  onChange={(e) => updateField('confidenceInterval', e.target.value ? Number(e.target.value) : null)}
                  placeholder="—"
                  className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-sm)] bg-ci-white text-ci-charcoal"
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
                <span className="text-xs text-ci-gray-500 shrink-0">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-ci-gray-500" />
            <h3 className="text-base font-bold text-ci-charcoal" style={{ fontFamily: 'var(--font-display)' }}>
              Documentation
            </h3>
          </div>
          <div className="space-y-4">
            <UploadZone
              label="Sampling Protocol"
              accept=".pdf,.doc,.docx"
              hint="PDF or Word document"
              uploaded={form.samplingProtocolUploaded}
              onUpload={() => updateField('samplingProtocolUploaded', true)}
              onRemove={() => updateField('samplingProtocolUploaded', false)}
            />

            <div>
              <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
                Additional Notes
              </label>
              <textarea
                value={form.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                placeholder="Any supplementary information about the monitoring campaign..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-ci-gray-300 rounded-[var(--radius-md)] bg-ci-white text-ci-charcoal placeholder:text-ci-gray-300 resize-y"
              />
            </div>
          </div>
        </div>

        {/* Validate Button */}
        <button
          onClick={handleValidate}
          className="w-full px-6 py-3 rounded-[var(--radius-md)] bg-ci-green text-white text-base font-bold hover:bg-ci-green-dark transition-colors shadow-md"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Validate Against VM0042 Checklist
        </button>
      </div>

      {/* Results panel — takes 1 column */}
      <div className="xl:col-span-1">
        <div className="sticky top-24">
          {showResults && results && score !== null ? (
            <ComplianceScore score={score} results={results} />
          ) : (
            <div className="bg-ci-white rounded-[var(--radius-md)] shadow-[var(--shadow-card)] p-6">
              <h3
                className="text-lg font-bold text-ci-charcoal mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Quality Checklist
              </h3>
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-ci-gray-100 flex items-center justify-center mb-4">
                  <BarChart3 size={24} className="text-ci-gray-500" />
                </div>
                <p className="text-sm text-ci-gray-500 max-w-xs">
                  Fill in the form and click <strong>&ldquo;Validate&rdquo;</strong> to check compliance against the VM0042 soil carbon methodology checklist.
                </p>
                <div className="mt-4 space-y-2 text-left w-full max-w-xs">
                  <p className="text-[11px] text-ci-gray-500 uppercase tracking-wider font-semibold mb-2">
                    Checks include:
                  </p>
                  {[
                    'Sampling depth ≥ 30cm',
                    'Lab method documented',
                    'Bulk density measured',
                    'GPS coordinates provided',
                    'Stratification documented',
                    'Baseline timing verified',
                    'Verification frequency',
                    'QA/QC protocols',
                    'Statistical adequacy',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-ci-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-ci-gray-300 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

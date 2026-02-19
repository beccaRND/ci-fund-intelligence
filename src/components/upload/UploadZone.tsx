'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface UploadZoneProps {
  label: string;
  accept?: string;
  hint?: string;
  uploaded: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function UploadZone({ label, accept, hint, uploaded, onUpload, onRemove }: UploadZoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setFileName(null);
    onRemove();
  }, [onRemove]);

  if (uploaded && fileName) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-ci-green-light rounded-[var(--radius-md)] border border-ci-green/20">
        <CheckCircle size={16} className="text-ci-green shrink-0" />
        <FileText size={14} className="text-ci-green shrink-0" />
        <span className="text-sm text-ci-charcoal font-medium truncate flex-1">{fileName}</span>
        <button
          onClick={handleRemove}
          className="text-ci-gray-500 hover:text-ci-charcoal transition-colors shrink-0"
          aria-label="Remove file"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-semibold text-ci-gray-500 uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center gap-2 px-4 py-6 rounded-[var(--radius-md)] border-2 border-dashed transition-colors cursor-pointer ${
          dragOver
            ? 'border-ci-green bg-ci-green-light'
            : 'border-ci-gray-300 bg-ci-gray-100 hover:border-ci-green/50 hover:bg-ci-green-light/50'
        }`}
      >
        <Upload size={20} className={dragOver ? 'text-ci-green' : 'text-ci-gray-500'} />
        <div className="text-sm text-ci-gray-700 text-center">
          <span className="font-semibold text-ci-green">Choose file</span> or drag & drop
        </div>
        {hint && (
          <p className="text-[11px] text-ci-gray-500">{hint}</p>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

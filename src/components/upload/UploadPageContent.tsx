'use client';

import { useState } from 'react';
import { ClipboardCheck, FileSpreadsheet, Link2 } from 'lucide-react';
import DataUploadForm from './DataUploadForm';
import SpreadsheetUpload from './SpreadsheetUpload';
import DataConnections from './DataConnections';

interface Props {
  projectId: string;
  projectName: string;
  yearJoined: number;
}

type Tab = 'structured' | 'spreadsheet' | 'connections';

export default function UploadPageContent({ projectId, projectName, yearJoined }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('structured');

  const tabs: { id: Tab; label: string; icon: typeof ClipboardCheck }[] = [
    { id: 'structured', label: 'Structured Form', icon: ClipboardCheck },
    { id: 'spreadsheet', label: 'Upload Spreadsheet', icon: FileSpreadsheet },
    { id: 'connections', label: 'Data Connections', icon: Link2 },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-ci-cream rounded-[var(--radius-md)] p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-ci-white shadow-[var(--shadow-sm)] text-ci-charcoal'
                  : 'text-ci-gray-500 hover:text-ci-gray-700'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Icon size={16} className={isActive ? 'text-ci-green' : ''} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'structured' && (
        <>
          <div className="mb-6 px-4 py-3 bg-ci-teal-light rounded-[var(--radius-md)] border border-ci-teal/20">
            <p className="text-sm text-ci-teal">
              <strong>VM0042-aligned checklist</strong> — Fill in the form below to validate your soil carbon
              monitoring data against Verra VM0042 v2.2 methodology requirements. The quality score updates
              in real-time as you enter data.
            </p>
          </div>
          <DataUploadForm
            projectId={projectId}
            projectName={projectName}
            yearJoined={yearJoined}
          />
        </>
      )}

      {activeTab === 'spreadsheet' && (
        <>
          <div className="mb-6 px-4 py-3 bg-ci-green-light rounded-[var(--radius-md)] border border-ci-green/20">
            <p className="text-sm text-ci-green-dark">
              <strong>Upload any spreadsheet</strong> — Drop an Excel or CSV file and map columns to the six
              monitoring principles. Auto-mapping detects common header names like &quot;soc&quot;, &quot;precipitation&quot;, or &quot;income&quot;.
            </p>
          </div>
          <SpreadsheetUpload />
        </>
      )}

      {activeTab === 'connections' && (
        <DataConnections onUploadClick={() => setActiveTab('spreadsheet')} />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle2, ShieldCheck, 
  Printer, Share2, Plus, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalBadge } from '../components/common/TacticalBadge';
import { api } from '../services/api';
import { ReportRecord } from '../types';

export const ReportsPage: React.FC = () => {
  const { selectedCaseId, setAlertBanner } = useApp();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  useEffect(() => {
    api.getReports().then(setReports).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    try {
      const rep = await api.generateReport({
        case_id: selectedCaseId,
        title: `Official Incident Executive Summary: ${selectedCaseId}`,
        report_type: 'CASE_SUMMARY',
        created_by: 'Insp. R. Sharma',
        format: selectedFormat,
        summary_text: `Verified multi-hop transaction chain for ${selectedCaseId}. Spatial forecast matched Sector 14 Corridor. All records cryptographically hashed.`
      });
      setReports([rep, ...reports]);
      setShowExportModal(false);
      setAlertBanner(`Report ${rep.report_id} generated successfully.`);
    } catch (err) {
      console.error('Failed to generate report', err);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="neu-card p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Case Reports & Legal Export Archive
              </h2>
              <TacticalBadge label={`${reports.length} Reports`} variant="dark" />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Structured Case Summaries, Action Packets, and Evaluation Dumps (Section 12.3)
            </p>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-6 py-3 pill-btn-lime text-xs font-black shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Export / PDF</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.report_id} className="neu-card p-6 space-y-4 hover:shadow-lg transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-extrabold text-slate-900">{r.title}</h3>
                    <TacticalBadge label={r.format} variant="slate" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Case: <span className="font-mono text-slate-800 font-bold">{r.case_id}</span> • Author: {r.created_by}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-slate-500">
                {r.created_at}
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 p-4 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
              {r.summary_text}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SHA-256 Authenticated Digital Artifact</span>
              </div>

              <button
                onClick={() => alert(`Downloading verified ${r.format} export: ${r.report_id}`)}
                className="flex items-center gap-2 px-5 py-2 pill-btn-dark text-xs font-bold shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span>Download {r.format}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* M-10 Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Export Case Record</h3>
                <p className="text-xs text-slate-500">M-10 Export Modal Specification</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase">Select Export Format:</label>
                <div className="grid grid-cols-2 gap-3">
                  {['PDF', 'JSON'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`p-3 rounded-2xl font-bold border transition-all cursor-pointer ${
                        selectedFormat === fmt
                          ? 'bg-[#111317] text-white border-[#111317]'
                          : 'bg-[#F8FAFC] border-slate-200 text-slate-700'
                      }`}
                    >
                      {fmt} Document
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-medium">
                NOTICE: Public demo exports automatically apply zero-PII masking to account numbers and citizen identifiers.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-2.5 pill-btn-lime text-xs font-bold cursor-pointer shadow-md"
              >
                Generate & Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

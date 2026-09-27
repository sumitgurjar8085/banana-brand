import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles, Award } from 'lucide-react';
import { MockupFrame, Product } from '../types';

interface ConsistencyAuditModalProps {
  frame: MockupFrame;
  activeProduct: Product;
  onClose: () => void;
}

export const ConsistencyAuditModal: React.FC<ConsistencyAuditModalProps> = ({
  frame,
  activeProduct,
  onClose,
}) => {
  const report = frame.auditReport;
  if (!report) return null;

  const scoreColor =
    report.consistencyScore >= 90
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
      : report.consistencyScore >= 75
      ? 'text-yellow-400 border-yellow-500/40 bg-yellow-950/40'
      : 'text-amber-400 border-amber-500/40 bg-amber-950/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Brand Consistency Audit Report
              </h3>
              <p className="text-xs text-zinc-400">
                Multimodal inspection by Gemini 3.8 Flash • {frame.mediumName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Consistency Index
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm">
                {report.brandFidelitySummary}
              </p>
            </div>

            <div
              className={`flex flex-col items-center justify-center px-6 py-3 rounded-2xl border ${scoreColor}`}
            >
              <span className="text-3xl font-extrabold tracking-tight">
                {report.consistencyScore}%
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider">
                Fidelity Match
              </span>
            </div>
          </div>

          {/* Visual Pair Comparison */}
          <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="space-y-1 text-center">
              <span className="text-[10px] uppercase font-semibold text-zinc-400">
                Original Reference
              </span>
              <div className="h-28 rounded-lg bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={activeProduct.imageUrl}
                  alt="Reference"
                  referrerPolicy="no-referrer"
                  className="max-h-full object-contain"
                />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {activeProduct.brandName}
              </span>
            </div>

            <div className="space-y-1 text-center">
              <span className="text-[10px] uppercase font-semibold text-yellow-400">
                Generated Mockup
              </span>
              <div className="h-28 rounded-lg bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center overflow-hidden">
                {frame.imageUrl && (
                  <img
                    src={frame.imageUrl}
                    alt="Mockup"
                    referrerPolicy="no-referrer"
                    className="max-h-full object-contain"
                  />
                )}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {frame.mediumName}
              </span>
            </div>
          </div>

          {/* Detailed Audit Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Technical Audit Criteria
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider">
                  Logo & Typography
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {report.logoAssessment}
                </p>
              </div>

              <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Palette Preservation
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {report.colorPaletteAssessment}
                </p>
              </div>

              <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  Material & Physics
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {report.materialRealismAssessment}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths & Suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Key Consistency Strengths
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {report.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Creative Optimization
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {report.suggestions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-yellow-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

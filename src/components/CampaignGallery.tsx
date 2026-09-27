import React, { useState } from 'react';
import {
  Download,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Edit3,
  Maximize2,
  Columns,
  Eye,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileCheck,
  Zap,
} from 'lucide-react';
import { MockupFrame, Product } from '../types';
import { downloadImage } from '../utils/imageHelpers';

interface CampaignGalleryProps {
  mockupFrames: MockupFrame[];
  activeProduct: Product;
  onAuditConsistency: (frame: MockupFrame) => void;
  onOpenPromptEditor: (frame: MockupFrame) => void;
  onRegenerate: (frame: MockupFrame) => void;
  onDeleteFrame: (frameId: string) => void;
  onViewAuditReport: (frame: MockupFrame) => void;
}

export const CampaignGallery: React.FC<CampaignGalleryProps> = ({
  mockupFrames,
  activeProduct,
  onAuditConsistency,
  onOpenPromptEditor,
  onRegenerate,
  onDeleteFrame,
  onViewAuditReport,
}) => {
  const [splitViewFrameId, setSplitViewFrameId] = useState<string | null>(null);
  const [lightboxFrame, setLightboxFrame] = useState<MockupFrame | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'audited'>('all');

  const visibleFrames =
    activeTab === 'audited'
      ? mockupFrames.filter((f) => f.auditReport !== undefined)
      : mockupFrames;

  if (mockupFrames.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-yellow-400 mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/5">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight">
            No Marketing Mockups Generated Yet
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Select one of the marketing mediums above (like Ceramic Coffee Mug, Metropolitan Billboard, or Heavyweight T-Shirt) or click &quot;Generate Campaign&quot; to visualize your product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Generated Marketing Campaign Collateral
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
            {mockupFrames.filter((f) => f.status === 'completed').length} frames ready
          </span>
        </div>

        {/* Filter / View Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'all'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Frames ({mockupFrames.length})
          </button>
          <button
            onClick={() => setActiveTab('audited')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === 'audited'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Audited Consistency ({mockupFrames.filter((f) => f.auditReport).length})
          </button>
        </div>
      </div>

      {/* Frames Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleFrames.map((frame) => {
          const isSplitView = splitViewFrameId === frame.id;
          const isGenerating = frame.status === 'generating';
          const isFailed = frame.status === 'failed';
          const isCompleted = frame.status === 'completed';

          return (
            <div
              key={frame.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-zinc-700 transition-all duration-200"
            >
              {/* Frame Card Top bar */}
              <div className="px-4 py-3 bg-zinc-950/60 border-b border-zinc-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-white tracking-wide truncate">
                    {frame.mediumName}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 shrink-0">
                    {frame.aspectRatio}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Consistency score badge if audited */}
                  {frame.auditReport && (
                    <button
                      onClick={() => onViewAuditReport(frame)}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold hover:bg-emerald-900/80 transition"
                      title="View AI Brand Consistency Audit Report"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{frame.auditReport.consistencyScore}% Consistent</span>
                    </button>
                  )}

                  {/* Split compare toggle */}
                  {isCompleted && (
                    <button
                      onClick={() => setSplitViewFrameId(isSplitView ? null : frame.id)}
                      className={`p-1.5 rounded-lg text-xs transition ${
                        isSplitView
                          ? 'bg-yellow-400 text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                      title={isSplitView ? 'Close Split View' : 'Compare Side-by-Side with Reference'}
                    >
                      <Columns className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete Frame */}
                  <button
                    onClick={() => onDeleteFrame(frame.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition"
                    title="Remove frame"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Frame Visual Container */}
              <div className="relative bg-zinc-950 flex items-center justify-center min-h-[300px] overflow-hidden">
                {isGenerating && (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 animate-pulse">
                        <RefreshCw className="w-6 h-6 animate-spin text-yellow-400" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 text-xs">🍌</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white tracking-wide">
                        Conditioning Nano Banana Multimodal Frame...
                      </p>
                      <p className="text-[11px] text-zinc-400 max-w-xs">
                        Preserving {activeProduct.brandName} logo, packaging silhouette, and color values onto {frame.mediumName}.
                      </p>
                    </div>
                  </div>
                )}

                {isFailed && (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-rose-400" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-rose-300">Generation Unsuccessful</p>
                      <p className="text-[11px] text-zinc-400 max-w-xs">
                        {frame.error || 'The model could not generate this frame. Check API key status or retry.'}
                      </p>
                    </div>
                    <button
                      onClick={() => onRegenerate(frame)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry Generation
                    </button>
                  </div>
                )}

                {isCompleted && frame.imageUrl && (
                  <>
                    {/* Standard or Split-screen View */}
                    {isSplitView ? (
                      <div className="w-full grid grid-cols-2 divide-x divide-zinc-800 h-[320px]">
                        {/* Reference Product side */}
                        <div className="relative bg-zinc-950 p-2 flex flex-col items-center justify-center">
                          <img
                            src={activeProduct.imageUrl}
                            alt="Reference"
                            referrerPolicy="no-referrer"
                            className="max-h-[260px] object-contain rounded-lg"
                          />
                          <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-zinc-900/90 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
                            Reference: {activeProduct.brandName}
                          </span>
                        </div>

                        {/* Generated Mockup side */}
                        <div className="relative bg-zinc-950 p-2 flex flex-col items-center justify-center">
                          <img
                            src={frame.imageUrl}
                            alt={frame.mediumName}
                            referrerPolicy="no-referrer"
                            className="max-h-[260px] object-contain rounded-lg"
                          />
                          <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-yellow-400/90 text-zinc-950 px-2 py-0.5 rounded border border-yellow-500 font-mono">
                            Nano Banana Mockup
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-[320px] flex items-center justify-center bg-zinc-950 p-2">
                        <img
                          src={frame.imageUrl}
                          alt={frame.mediumName}
                          referrerPolicy="no-referrer"
                          className="max-h-[300px] w-auto max-w-full object-contain rounded-lg group-hover:scale-[1.01] transition-transform duration-300"
                        />
                        <button
                          onClick={() => setLightboxFrame(frame)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Fullscreen Lightbox"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Frame Card Bottom Bar: Actions & Notes */}
              <div className="p-4 bg-zinc-950/40 border-t border-zinc-800/80 space-y-3">
                {/* Notes or prompt preview */}
                <p className="text-[11px] text-zinc-400 line-clamp-1 italic">
                  &ldquo;{frame.promptUsed}&rdquo;
                </p>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/40">
                  <div className="flex items-center gap-1.5">
                    {/* Prompt Edit button (Satisfies feature request) */}
                    <button
                      onClick={() => onOpenPromptEditor(frame)}
                      disabled={!isCompleted}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition disabled:opacity-40"
                      title="Refine or edit this frame with Gemini Flash Image"
                    >
                      <Edit3 className="w-3 h-3 text-yellow-400" />
                      <span>Edit Prompt</span>
                    </button>

                    {/* AI Consistency Audit button */}
                    <button
                      onClick={() => onAuditConsistency(frame)}
                      disabled={!isCompleted || frame.isAuditing}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition disabled:opacity-40"
                      title="Evaluate brand fidelity using Gemini 3.8 Flash"
                    >
                      {frame.isAuditing ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                          <span>Auditing...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>
                            {frame.auditReport ? 'Re-Audit' : 'Audit Consistency'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Re-generate */}
                    <button
                      onClick={() => onRegenerate(frame)}
                      disabled={isGenerating}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                      title="Re-generate this medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Download */}
                    {isCompleted && frame.imageUrl && (
                      <button
                        onClick={() =>
                          downloadImage(
                            frame.imageUrl!,
                            `BananaBrand_${activeProduct.brandName}_${frame.mediumName.replace(/\s+/g, '_')}.png`
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 transition shadow-sm"
                        title="Download high-resolution mockup"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxFrame && lightboxFrame.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxFrame(null)}
        >
          <div
            className="max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {lightboxFrame.mediumName}
                </span>
                <span className="text-xs text-zinc-400">
                  ({activeProduct.brandName})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    downloadImage(
                      lightboxFrame.imageUrl!,
                      `BananaBrand_${lightboxFrame.mediumName}.png`
                    )
                  }
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-yellow-400 text-zinc-950 hover:bg-yellow-300 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setLightboxFrame(null)}
                  className="text-xs text-zinc-400 hover:text-white px-2 py-1"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center bg-zinc-950 rounded-xl p-4 min-h-[400px]">
              <img
                src={lightboxFrame.imageUrl}
                alt={lightboxFrame.mediumName}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            <p className="text-xs text-zinc-400 font-mono italic">
              {lightboxFrame.promptUsed}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

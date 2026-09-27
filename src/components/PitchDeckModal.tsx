import React from 'react';
import { Presentation, X, Download, ShieldCheck, Sparkles, Layers, Printer } from 'lucide-react';
import { MockupFrame, Product } from '../types';

interface PitchDeckModalProps {
  activeProduct: Product;
  mockupFrames: MockupFrame[];
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({
  activeProduct,
  mockupFrames,
  onClose,
}) => {
  const completedFrames = mockupFrames.filter((f) => f.status === 'completed' && f.imageUrl);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-400 flex items-center justify-center">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Brand Marketing Campaign Pitch Deck
              </h3>
              <p className="text-xs text-zinc-400">
                Nano Banana Multimodal Consistency Showcase • {activeProduct.brandName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
              title="Print or export as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deck Content Canvas */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto bg-zinc-950">
          {/* Executive Brand Banner */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  Global Marketing Rollout
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {completedFrames.length} Visual Channels
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {activeProduct.name}
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                {activeProduct.description}
              </p>

              {/* Brand Color Swatches */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Brand Palette:
                </span>
                <div className="flex items-center gap-2">
                  {activeProduct.colorPalette.map((color, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[10px] font-mono text-zinc-400">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Reference Product Showcase */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-zinc-950 border-2 border-yellow-400/50 p-2 shadow-2xl relative">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl"
                />
                <div className="absolute -bottom-2.5 bg-zinc-950 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>MASTER ANCHOR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mediums Campaign Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-yellow-400" />
                Cross-Medium Visual Collateral
              </h3>
              <span className="text-xs text-zinc-400">
                Generated via Gemini Nano Banana Multimodal Diffusion
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedFrames.map((frame) => (
                <div
                  key={frame.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg space-y-3 p-3 flex flex-col justify-between"
                >
                  <div className="relative rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center min-h-[220px]">
                    <img
                      src={frame.imageUrl}
                      alt={frame.mediumName}
                      referrerPolicy="no-referrer"
                      className="max-h-[220px] object-contain rounded-lg"
                    />
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-zinc-300 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800">
                      {frame.aspectRatio}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {frame.mediumName}
                      </h4>
                      {frame.auditReport && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {frame.auditReport.consistencyScore}% Match
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 italic">
                      &ldquo;{frame.promptUsed}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
            <span>BananaBrand Generative Marketing Studio • Powered by Nano Banana</span>
            <span>Commercial License • 1K Resolution Master Renders</span>
          </div>
        </div>
      </div>
    </div>
  );
};

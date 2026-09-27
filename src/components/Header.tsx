import React from 'react';
import { Sparkles, Layers, ShieldCheck, Download, Presentation } from 'lucide-react';
import { Product, MockupFrame } from '../types';

interface HeaderProps {
  activeProduct: Product;
  mockupFrames: MockupFrame[];
  onOpenPitchDeck: () => void;
  onDownloadAll: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProduct,
  mockupFrames,
  onOpenPitchDeck,
  onDownloadAll,
  onReset,
}) => {
  const completedCount = mockupFrames.filter((f) => f.status === 'completed').length;
  const isGenerating = mockupFrames.some((f) => f.status === 'generating');

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-400 p-[1.5px] shadow-lg shadow-yellow-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl select-none" role="img" aria-label="Banana">
                🍌
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg tracking-tight">BananaBrand</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                Nano Banana Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Photorealistic consistent marketing mockups across mediums
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Consistency Lock badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">Lock:</span>
            <span className="font-medium text-zinc-200">{activeProduct.brandName}</span>
          </div>

          {/* Completed badge */}
          {completedCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
              <span>{completedCount} mockups</span>
            </div>
          )}

          {/* Presentation pitch deck button */}
          <button
            onClick={onOpenPitchDeck}
            disabled={completedCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="View client brand pitch deck presentation"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Pitch Deck</span>
          </button>

          {/* Download all button */}
          {completedCount > 0 && (
            <button
              onClick={onDownloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
              title="Download all generated campaign mockups"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export All</span>
            </button>
          )}

          {/* Reset / New Product */}
          <button
            onClick={onReset}
            className="text-xs text-zinc-400 hover:text-white px-2 py-1 transition"
          >
            Change Product
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Coffee,
  Maximize2,
  Shirt,
  ShoppingBag,
  Box,
  Smartphone,
  Store,
  BookOpen,
  Building2,
  Sparkles,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Plus,
  Play,
  Layers,
  Wand2,
} from 'lucide-react';
import { MarketingMedium, MediumCategory, MockupFrame } from '../types';
import { MARKETING_MEDIUMS } from '../data/mockData';

interface MediumGridProps {
  mockupFrames: MockupFrame[];
  onGenerateMedium: (medium: MarketingMedium, customPrompt?: string, customAspect?: string) => void;
  onGenerateBatch: (mediums: MarketingMedium[]) => void;
  isGeneratingBatch: boolean;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Coffee,
  Maximize2,
  Shirt,
  ShoppingBag,
  Box,
  Smartphone,
  Store,
  BookOpen,
  Building2,
};

export const MediumGrid: React.FC<MediumGridProps> = ({
  mockupFrames,
  onGenerateMedium,
  onGenerateBatch,
  isGeneratingBatch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MediumCategory>('all');
  const [selectedMediumIds, setSelectedMediumIds] = useState<string[]>([
    'coffee_mug',
    'billboard',
    'tshirt',
  ]);
  const [customSceneModal, setCustomSceneModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customAspect, setCustomAspect] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [expandedMediumId, setExpandedMediumId] = useState<string | null>(null);
  const [customPromptTweaks, setCustomPromptTweaks] = useState<Record<string, string>>({});

  const filteredMediums =
    selectedCategory === 'all'
      ? MARKETING_MEDIUMS
      : MARKETING_MEDIUMS.filter((m) => m.category === selectedCategory);

  const toggleSelect = (id: string) => {
    setSelectedMediumIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMediumIds.length === MARKETING_MEDIUMS.length) {
      setSelectedMediumIds([]);
    } else {
      setSelectedMediumIds(MARKETING_MEDIUMS.map((m) => m.id));
    }
  };

  const handleStartBatch = () => {
    const toGenerate = MARKETING_MEDIUMS.filter((m) => selectedMediumIds.includes(m.id));
    if (toGenerate.length > 0) {
      onGenerateBatch(toGenerate);
    }
  };

  const handleCreateCustom = () => {
    if (!customName.trim()) return;
    const customMedium: MarketingMedium = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: 'essentials',
      description: customDescription.trim() || `Commercial product mockup on ${customName}`,
      iconName: 'Sparkles',
      defaultPrompt: `A photorealistic high-end commercial advertising mockup featuring the reference product on ${customName}. ${customDescription}. The product branding, logo, and signature colors are seamlessly integrated with authentic materials, perspective distortion, and natural commercial lighting.`,
      suggestedAspect: customAspect,
      badge: 'Custom Medium',
    };
    onGenerateMedium(customMedium);
    setCustomSceneModal(false);
    setCustomName('');
    setCustomDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Category Filters & Batch Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-yellow-400" />
              Marketing Mediums Catalog
            </h3>
            <span className="text-xs text-zinc-400">
              ({MARKETING_MEDIUMS.length} commercial mediums)
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Select one or multiple mediums to generate a coordinated marketing campaign with Nano Banana consistency.
          </p>
        </div>

        {/* Batch action bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition underline underline-offset-4"
          >
            {selectedMediumIds.length === MARKETING_MEDIUMS.length ? 'Deselect All' : 'Select All (9)'}
          </button>

          <button
            onClick={handleStartBatch}
            disabled={selectedMediumIds.length === 0 || isGeneratingBatch}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 shadow-md shadow-yellow-400/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGeneratingBatch ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Campaign...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  Generate Campaign ({selectedMediumIds.length})
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(
          [
            { id: 'all', label: 'All Mediums' },
            { id: 'essentials', label: '☕ Essentials (Mugs)' },
            { id: 'outdoor', label: '🏙️ Outdoor (Billboards)' },
            { id: 'apparel', label: '👕 Apparel & Merch' },
            { id: 'packaging', label: '📦 Packaging & Boxes' },
            { id: 'digital', label: '📱 Digital & Social' },
            { id: 'retail', label: '🏬 Retail & Editorial' },
          ] as const
        ).map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as MediumCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Mediums Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMediums.map((medium) => {
          const IconComponent = ICON_MAP[medium.iconName] || Sparkles;
          const isSelectedForBatch = selectedMediumIds.includes(medium.id);
          const existingFrame = mockupFrames.find((f) => f.mediumId === medium.id);
          const isGeneratingThis = existingFrame?.status === 'generating';
          const isCompletedThis = existingFrame?.status === 'completed';
          const isExpanded = expandedMediumId === medium.id;

          return (
            <div
              key={medium.id}
              className={`group bg-zinc-900/60 border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between ${
                isCompletedThis
                  ? 'border-emerald-500/40 bg-zinc-900/90 shadow-lg shadow-emerald-500/5'
                  : isGeneratingThis
                  ? 'border-yellow-500/50 bg-yellow-950/10 shadow-lg shadow-yellow-500/10'
                  : isSelectedForBatch
                  ? 'border-zinc-700 bg-zinc-900/80'
                  : 'border-zinc-800/80 hover:border-zinc-750'
              }`}
            >
              <div>
                {/* Card Top: Checkbox, Badge, Aspect */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isSelectedForBatch}
                      onChange={() => toggleSelect(medium.id)}
                      className="w-4 h-4 rounded border-zinc-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-zinc-950 bg-zinc-950 cursor-pointer"
                    />
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {medium.badge}
                    </span>
                  </label>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {medium.suggestedAspect}
                    </span>
                    {isCompletedThis && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body: Icon & Titles */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isCompletedThis
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isGeneratingThis
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                        : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/80 group-hover:text-yellow-400 group-hover:border-yellow-500/30'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      {medium.name}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {medium.description}
                    </p>
                  </div>
                </div>

                {/* Optional expanded prompt tweak drawer */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2 animate-fadeIn">
                    <label className="block text-[11px] font-semibold text-zinc-300">
                      Creative Direction Prompt:
                    </label>
                    <textarea
                      value={customPromptTweaks[medium.id] ?? medium.defaultPrompt}
                      onChange={(e) =>
                        setCustomPromptTweaks((prev) => ({
                          ...prev,
                          [medium.id]: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full text-xs p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-yellow-400 resize-none font-mono"
                      placeholder="Custom scene details, lighting, camera angle..."
                    />
                    <div className="flex justify-between items-center text-[10px] text-zinc-400">
                      <span>Nano Banana locks logo & colors automatically</span>
                      <button
                        onClick={() =>
                          setCustomPromptTweaks((prev) => {
                            const copy = { ...prev };
                            delete copy[medium.id];
                            return copy;
                          })
                        }
                        className="text-yellow-400/80 hover:text-yellow-300"
                      >
                        Reset Prompt
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Action button & Tweak toggle */}
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedMediumId(isExpanded ? null : medium.id)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition py-1"
                >
                  <Sliders className="w-3 h-3 text-zinc-400" />
                  <span>{isExpanded ? 'Hide Prompt' : 'Tweak Scene'}</span>
                </button>

                <button
                  onClick={() =>
                    onGenerateMedium(
                      medium,
                      customPromptTweaks[medium.id],
                      medium.suggestedAspect
                    )
                  }
                  disabled={isGeneratingThis}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isGeneratingThis
                      ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                      : isCompletedThis
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                      : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm'
                  }`}
                >
                  {isGeneratingThis ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : isCompletedThis ? (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      <span>Re-visualize</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>Visualize</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Custom Medium Card */}
        <div
          onClick={() => setCustomSceneModal(true)}
          className="group cursor-pointer bg-zinc-950/40 border-2 border-dashed border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all hover:bg-yellow-400/5 min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-200 group-hover:text-yellow-400 transition-colors">
              Custom Marketing Medium
            </h4>
            <p className="text-xs text-zinc-400 max-w-[200px]">
              Visualize on anything: delivery vans, sports gear, subway wraps, airplane livery...
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Custom Marketing Medium */}
      {customSceneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-yellow-400" />
                Add Custom Marketing Medium
              </h3>
              <button
                onClick={() => setCustomSceneModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Medium Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Electric Delivery Van Livery, Skateboard Deck, Coffee Shop Apron"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Scene & Environment Description
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe lighting, environment, materials, placement (e.g. side door decals on a matte grey delivery van in a rain-slicked London street)..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-yellow-400 resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['1:1', '16:9', '4:3', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setCustomAspect(ratio)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-medium border ${
                        customAspect === ratio
                          ? 'bg-yellow-400 text-zinc-950 border-yellow-400 font-bold'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCustomSceneModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustom}
                disabled={!customName.trim()}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 transition disabled:opacity-40"
              >
                Visualize Custom Medium
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

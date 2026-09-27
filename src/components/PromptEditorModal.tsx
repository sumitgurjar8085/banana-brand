import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, X, Check, Image as ImageIcon } from 'lucide-react';
import { MockupFrame } from '../types';

interface PromptEditorModalProps {
  frame: MockupFrame;
  onClose: () => void;
  onApplyEdit: (frameId: string, instruction: string) => Promise<void>;
}

const PRESET_MODIFIERS = [
  'Add morning golden hour sunlight and warm shadows',
  'Add rain-slicked pavement reflections and night neon lights',
  'Make the surface lighting high-contrast luxury studio spotlight',
  'Add realistic condensation water droplets and ice freshness',
  'Zoom in closer to emphasize the logo branding and fine surface texture',
  'Add a modern minimalist urban coffee shop background with bokeh',
];

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({
  frame,
  onClose,
  onApplyEdit,
}) => {
  const [instruction, setInstruction] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    try {
      setIsApplying(true);
      setError(null);
      await onApplyEdit(frame.id, instruction.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to edit image');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-400 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Prompt Editor & Image Refiner
              </h3>
              <p className="text-xs text-zinc-400">
                Powered by Gemini 3.1 Flash Image • Direct prompt-based image transformation
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Current Frame Preview */}
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            {frame.imageUrl && (
              <img
                src={frame.imageUrl}
                alt={frame.mediumName}
                referrerPolicy="no-referrer"
                className="w-32 h-32 object-contain rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
              />
            )}
            <div className="space-y-1.5 text-xs text-zinc-400 flex-1">
              <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20">
                Active Frame: {frame.mediumName}
              </span>
              <p className="font-mono text-[11px] text-zinc-300 italic line-clamp-2">
                &ldquo;{frame.promptUsed}&rdquo;
              </p>
              <p className="text-[11px] text-zinc-500">
                Nano Banana preserves the brand logo, silhouette, and colors while applying your prompt edits.
              </p>
            </div>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Text Prompt Edit Instructions:</span>
                <span className="text-[11px] text-zinc-400">Natural language instructions</span>
              </label>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={3}
                placeholder="e.g. Add warm morning cafe sunlight and steam rising from the mug, with a newspaper on the wooden table..."
                className="w-full text-xs p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 resize-none font-mono"
                required
              />
            </div>

            {/* Quick preset modifiers */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Quick Creative Modifiers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_MODIFIERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setInstruction((prev) =>
                        prev ? `${prev}. ${preset}` : preset
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isApplying}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isApplying || !instruction.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 shadow-md shadow-yellow-400/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isApplying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Applying Prompt Edit...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Nano Banana Edit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

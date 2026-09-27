import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ProductSelector } from './components/ProductSelector';
import { MediumGrid } from './components/MediumGrid';
import { CampaignGallery } from './components/CampaignGallery';
import { PromptEditorModal } from './components/PromptEditorModal';
import { ConsistencyAuditModal } from './components/ConsistencyAuditModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { MarketingMedium, MockupFrame, Product } from './types';
import { SAMPLE_PRODUCTS, MARKETING_MEDIUMS, INITIAL_MOCKUP_FRAMES } from './data/mockData';
import { urlToDataUrl, downloadImage } from './utils/imageHelpers';
import { Sparkles, Zap, ShieldCheck, Layers, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeProduct, setActiveProduct] = useState<Product>(SAMPLE_PRODUCTS[0]);
  const [mockupFrames, setMockupFrames] = useState<MockupFrame[]>(INITIAL_MOCKUP_FRAMES);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [editingFrame, setEditingFrame] = useState<MockupFrame | null>(null);
  const [auditModalFrame, setAuditModalFrame] = useState<MockupFrame | null>(null);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [serverHealth, setServerHealth] = useState<{ status: string; hasApiKey: boolean } | null>(null);
  const [notification, setNotification] = useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null);

  // Check backend server health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch((err) => console.warn('Could not check server health:', err));
  }, []);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  }, []);

  // When switching product, prompt user or reset frames
  const handleSelectProduct = (newProduct: Product) => {
    if (newProduct.id === activeProduct.id) return;
    setActiveProduct(newProduct);
    setMockupFrames([]);
    showToast(`Locked onto ${newProduct.brandName}. Generate new marketing frames.`, 'info');
  };

  const handleCustomProductUploaded = (newProduct: Product) => {
    setActiveProduct(newProduct);
    setMockupFrames([]);
    showToast(`Custom product "${newProduct.name}" locked for consistent visualization!`, 'success');
  };

  // Generate a single marketing medium
  const handleGenerateMedium = async (
    medium: MarketingMedium,
    customPrompt?: string,
    customAspect?: string
  ) => {
    const frameId = `${activeProduct.id}_${medium.id}_${Date.now()}`;
    const promptToUse = customPrompt || medium.defaultPrompt;
    const aspectToUse = customAspect || medium.suggestedAspect;

    const newFrame: MockupFrame = {
      id: frameId,
      productId: activeProduct.id,
      mediumId: medium.id,
      mediumName: medium.name,
      promptUsed: promptToUse,
      aspectRatio: aspectToUse,
      timestamp: Date.now(),
      modelUsed: 'gemini-3.1-flash-image',
      status: 'generating',
    };

    // Update state to show generating frame
    setMockupFrames((prev) => {
      // Remove any existing frame for this medium or replace
      const filtered = prev.filter((f) => f.mediumId !== medium.id);
      return [newFrame, ...filtered];
    });

    try {
      const base64Image = await urlToDataUrl(activeProduct.imageUrl);

      const response = await fetch('/api/mockup/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          medium: medium.id,
          mediumName: medium.name,
          mediumPrompt: promptToUse,
          aspectRatio: aspectToUse,
          modelPreference: 'gemini-3.1-flash-image',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate frame');
      }

      setMockupFrames((prev) =>
        prev.map((f) =>
          f.id === frameId
            ? {
                ...f,
                status: 'completed',
                imageUrl: data.imageUrl,
                notes: data.notes,
                modelUsed: data.modelUsed,
              }
            : f
        )
      );

      showToast(`${medium.name} generated with Nano Banana consistency!`, 'success');
    } catch (err: any) {
      console.error('Error generating frame:', err);
      setMockupFrames((prev) =>
        prev.map((f) =>
          f.id === frameId
            ? {
                ...f,
                status: 'failed',
                error: err.message || 'Generation failed',
              }
            : f
        )
      );
      showToast(`Could not generate ${medium.name}: ${err.message}`, 'error');
    }
  };

  // Generate batch of selected mediums in sequence
  const handleGenerateBatch = async (mediums: MarketingMedium[]) => {
    setIsGeneratingBatch(true);
    showToast(`Starting campaign generation for ${mediums.length} mediums...`, 'info');

    for (const medium of mediums) {
      await handleGenerateMedium(medium);
    }

    setIsGeneratingBatch(false);
    showToast(`Campaign generation complete!`, 'success');
  };

  // Audit consistency between reference and mockup
  const handleAuditConsistency = async (frame: MockupFrame) => {
    if (!frame.imageUrl) return;

    setMockupFrames((prev) =>
      prev.map((f) => (f.id === frame.id ? { ...f, isAuditing: true } : f))
    );

    try {
      const originalBase64 = await urlToDataUrl(activeProduct.imageUrl);

      const response = await fetch('/api/mockup/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImage: originalBase64,
          mockupImage: frame.imageUrl,
          mediumName: frame.mediumName,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to perform audit');
      }

      setMockupFrames((prev) =>
        prev.map((f) =>
          f.id === frame.id
            ? {
                ...f,
                isAuditing: false,
                auditReport: data.report,
                consistencyScore: data.report.consistencyScore,
              }
            : f
        )
      );

      // Open audit modal to show report
      setAuditModalFrame({
        ...frame,
        auditReport: data.report,
        consistencyScore: data.report.consistencyScore,
      });

      showToast(
        `Audit complete: ${data.report.consistencyScore}% consistency score!`,
        'success'
      );
    } catch (err: any) {
      console.error('Audit failed:', err);
      setMockupFrames((prev) =>
        prev.map((f) => (f.id === frame.id ? { ...f, isAuditing: false } : f))
      );
      showToast(`Audit failed: ${err.message}`, 'error');
    }
  };

  // Edit an existing mockup using text prompt (satisfies feature request)
  const handleApplyEdit = async (frameId: string, instruction: string) => {
    const target = mockupFrames.find((f) => f.id === frameId);
    if (!target || !target.imageUrl) return;

    const response = await fetch('/api/mockup/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: target.imageUrl,
        instruction,
        aspectRatio: target.aspectRatio,
        modelPreference: 'gemini-3.1-flash-image',
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to edit image');
    }

    setMockupFrames((prev) =>
      prev.map((f) =>
        f.id === frameId
          ? {
              ...f,
              imageUrl: data.imageUrl,
              promptUsed: `${f.promptUsed} | Edit: ${instruction}`,
              notes: data.notes,
              // reset previous audit if modified
              auditReport: undefined,
              consistencyScore: undefined,
            }
          : f
      )
    );

    showToast(`Applied prompt edit to ${target.mediumName}!`, 'success');
  };

  const handleDeleteFrame = (frameId: string) => {
    setMockupFrames((prev) => prev.filter((f) => f.id !== frameId));
  };

  const handleDownloadAll = () => {
    const completed = mockupFrames.filter((f) => f.status === 'completed' && f.imageUrl);
    if (completed.length === 0) return;

    completed.forEach((frame, idx) => {
      setTimeout(() => {
        downloadImage(
          frame.imageUrl!,
          `BananaBrand_${activeProduct.brandName}_${frame.mediumName.replace(/\s+/g, '_')}.png`
        );
      }, idx * 250);
    });

    showToast(`Exporting ${completed.length} campaign assets...`, 'info');
  };

  const handleReset = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-zinc-950">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-fadeIn">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-2xl backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                : notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
                : 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
            }`}
          >
            {notification.type === 'success' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {notification.type === 'info' && <Sparkles className="w-4 h-4 text-yellow-400" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        activeProduct={activeProduct}
        mockupFrames={mockupFrames}
        onOpenPitchDeck={() => setShowPitchDeck(true)}
        onDownloadAll={handleDownloadAll}
        onReset={handleReset}
      />

      {/* Hero Intro Banner */}
      <div className="border-b border-zinc-900 bg-gradient-to-b from-zinc-900/50 via-zinc-950 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                  Multimodal Generative AI
                </span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-400">Strict Product Consistency Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Visualize Products Across Every Marketing Medium
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Take any product image and generate consistent marketing mockups on coffee mugs, billboards, t-shirts, packaging, and digital ads. Nano Banana locks your logo, typography, and palette across every frame.
              </p>
            </div>

            {/* Consistency Highlights Card */}
            <div className="hidden lg:flex items-center gap-4 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center font-bold">
                  🍌
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Nano Banana Conditioning</p>
                  <p className="text-[11px] text-zinc-400">Multimodal prompt alignment</p>
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-400">100% Consistent</p>
                <p className="text-[11px] text-zinc-400">AI Brand Auditing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex-1 w-full">
        {/* Step 1: Reference Product Anchor */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-zinc-950 font-black flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Reference Product Anchor (Nano Banana Consistency Lock)</span>
            </span>
          </div>

          <ProductSelector
            activeProduct={activeProduct}
            onSelectProduct={handleSelectProduct}
            onCustomProductUploaded={handleCustomProductUploaded}
          />
        </section>

        {/* Step 2: Marketing Medium Catalog */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-zinc-950 font-black flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Select Marketing Mediums to Visualize</span>
            </span>
          </div>

          <MediumGrid
            mockupFrames={mockupFrames}
            onGenerateMedium={handleGenerateMedium}
            onGenerateBatch={handleGenerateBatch}
            isGeneratingBatch={isGeneratingBatch}
          />
        </section>

        {/* Step 3: Generated Marketing Campaign Collateral */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-zinc-950 font-black flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Marketing Campaign Renders & Consistency Inspector</span>
            </span>
          </div>

          <CampaignGallery
            mockupFrames={mockupFrames}
            activeProduct={activeProduct}
            onAuditConsistency={handleAuditConsistency}
            onOpenPromptEditor={(frame) => setEditingFrame(frame)}
            onRegenerate={(frame) => {
              const medium = MARKETING_MEDIUMS.find((m) => m.id === frame.mediumId) || {
                id: frame.mediumId,
                name: frame.mediumName,
                category: 'essentials' as const,
                description: frame.promptUsed,
                iconName: 'Sparkles',
                defaultPrompt: frame.promptUsed,
                suggestedAspect: frame.aspectRatio as any,
                badge: 'Custom',
              };
              handleGenerateMedium(medium, frame.promptUsed, frame.aspectRatio);
            }}
            onDeleteFrame={handleDeleteFrame}
            onViewAuditReport={(frame) => setAuditModalFrame(frame)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div className="flex items-center gap-2">
            <span>🍌 BananaBrand Studio</span>
            <span>•</span>
            <span>Nano Banana Multimodal Consistency Engine</span>
          </div>
          <div>
            Powered by Google Gemini 3.1 Flash Image & Gemini 3.8 Flash
          </div>
        </div>
      </footer>

      {/* Prompt Editor Modal */}
      {editingFrame && (
        <PromptEditorModal
          frame={editingFrame}
          onClose={() => setEditingFrame(null)}
          onApplyEdit={handleApplyEdit}
        />
      )}

      {/* Consistency Audit Modal */}
      {auditModalFrame && auditModalFrame.auditReport && (
        <ConsistencyAuditModal
          frame={auditModalFrame}
          activeProduct={activeProduct}
          onClose={() => setAuditModalFrame(null)}
        />
      )}

      {/* Pitch Deck Modal */}
      {showPitchDeck && (
        <PitchDeckModal
          activeProduct={activeProduct}
          mockupFrames={mockupFrames}
          onClose={() => setShowPitchDeck(false)}
        />
      )}
    </div>
  );
}

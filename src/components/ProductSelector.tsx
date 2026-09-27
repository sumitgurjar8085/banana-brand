import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Lock, Palette, CheckCircle2, RefreshCw, Info } from 'lucide-react';
import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/mockData';
import { fileToDataUrl } from '../utils/imageHelpers';

interface ProductSelectorProps {
  activeProduct: Product;
  onSelectProduct: (product: Product) => void;
  onCustomProductUploaded: (product: Product) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  activeProduct,
  onSelectProduct,
  onCustomProductUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('My Brand');
  const [customProductName, setCustomProductName] = useState('Flagship Product');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempImageData, setTempImageData] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await fileToDataUrl(file);
      setTempImageData(dataUrl);
      setShowCustomModal(true);
    } catch (err) {
      console.error('Error reading file:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmCustomProduct = () => {
    if (!tempImageData) return;
    const newProduct: Product = {
      id: `custom_${Date.now()}`,
      name: customProductName.trim() || 'Custom Product',
      brandName: customBrandName.trim().toUpperCase() || 'CUSTOM BRAND',
      tagline: 'Custom Product Marketing Campaign',
      category: 'Uploaded Product',
      imageUrl: tempImageData,
      colorPalette: ['#18181B', '#3B82F6', '#10B981', '#F43F5E'],
      description: 'Custom user uploaded product reference with Nano Banana visual identity lock.',
      isSample: false,
    };
    onCustomProductUploaded(newProduct);
    setShowCustomModal(false);
    setTempImageData(null);
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between relative z-10">
        {/* Left: Active Reference Product Display */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          {/* Product thumbnail with consistency lock badge */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-950 border-2 border-yellow-500/40 shadow-lg shadow-yellow-500/10 p-1">
              <img
                src={activeProduct.imageUrl}
                alt={activeProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-zinc-950 border border-emerald-500/50 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Lock className="w-2.5 h-2.5 text-emerald-400" />
              <span>LOCKED</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-yellow-400 px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20">
                {activeProduct.category}
              </span>
              <span className="text-xs text-zinc-400 font-medium">Brand:</span>
              <span className="text-xs font-bold text-white tracking-wide bg-zinc-800/80 px-2 py-0.5 rounded">
                {activeProduct.brandName}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
              {activeProduct.name}
            </h2>
            <p className="text-xs text-zinc-400 line-clamp-1">{activeProduct.tagline}</p>

            {/* Nano Banana Brand Color Palette */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Palette className="w-3 h-3 text-zinc-400" />
                <span>Identity Colors:</span>
              </span>
              <div className="flex items-center gap-1.5">
                {activeProduct.colorPalette.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-4 h-4 rounded-full border border-zinc-700 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={`Brand color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Switch Sample Products or Upload */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Sample Product Selector Pills */}
          <div className="flex items-center gap-2 bg-zinc-950/60 p-1.5 rounded-xl border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold px-2 hidden xl:inline">
              Samples:
            </span>
            {SAMPLE_PRODUCTS.map((prod) => {
              const isSelected = activeProduct.id === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-md object-cover"
                  />
                  <span className="truncate max-w-[85px] sm:max-w-[100px]">{prod.brandName}</span>
                </button>
              );
            })}
          </div>

          {/* Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Product Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nano Banana Consistency Guarantee Banner */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300 font-medium">Nano Banana Multimodal Conditioning Engine:</span>
          <span>Each marketing medium frame locks onto this reference product&apos;s geometry, logo vector, and lighting.</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <span>• 100% Brand Consistency</span>
          <span>• Photorealistic Materials</span>
          <span>• Commercial 1K Output</span>
        </div>
      </div>

      {/* Modal for setting uploaded product details */}
      {showCustomModal && tempImageData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Configure Uploaded Product
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="flex gap-4 items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <img
                src={tempImageData}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-20 h-20 object-contain rounded-lg bg-zinc-900 border border-zinc-800"
              />
              <div className="text-xs text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-200">Product Image Detected</p>
                <p>Nano Banana will analyze the logo, container shape, and colors for all mockups.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  placeholder="e.g. ACME LABS"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  placeholder="e.g. Cold Brew Bottle, Wireless Earbuds"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCustomProduct}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Lock Product & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { InfographicPrompt } from '../types';
import { generateInfographic } from '../services/geminiService';
import { Image, Loader2, Copy, Check, Lock, Unlock } from 'lucide-react';

const PROMPTS: InfographicPrompt[] = [
  {
    id: 'divergence',
    title: 'The Great Divergence',
    description: 'Visualizes the split between productivity and compensation.',
    prompt: 'A split screen infographic. Left side: 1970s, warm vintage colors, a factory worker with a full shopping cart and a house in background, smiling. Right side: 2024, cool harsh blue tones, a gig worker with an empty basket and bills floating around, stressed. A graph line overlays the scene: a red line for productivity skyrocketing, a green line for wages staying flat. Minimalist high-fidelity 3D vector art style, infographic.',
  },
  {
    id: 'ceo_scale',
    title: 'The Ratio Scale',
    description: 'A stark comparison of CEO vs Worker accumulation.',
    prompt: 'A stylized isometric infographic. A large golden balance scale. On the left pan, a massive, overflowing pile of gold bars and a CEO in a suit sitting on top, weighing it down heavily. On the right pan, a tiny stack of copper coins with a large group of diverse workers trying to hold it up. A label floating above says "399:1 RATIO". Clean dark background, vibrant gold and teal accents.',
  },
  {
    id: 'cost_balloon',
    title: 'Inflation vs Stagnation',
    description: 'Metaphorical representation of the cost of living crisis.',
    prompt: 'An editorial illustration infographic. A large hot air balloon labeled "HOUSING & HEALTHCARE" rising rapidly into the clouds. Attached to the ground by a heavy iron chain is a person labeled "WAGES", unable to fly. The sky has percentage markers showing +400% cost increase. Detailed, cinematic lighting, 8k resolution, financial visualization style.',
  }
];

export const InfographicGenerator: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<InfographicPrompt>(PROMPTS[0]);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const has = await window.aistudio.hasSelectedApiKey();
      setHasKey(has);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success to avoid race condition
        setHasKey(true);
      } catch (e) {
        console.error("Key selection failed", e);
      }
    }
  };

  const handleGenerate = async () => {
    if (!hasKey) {
      await handleSelectKey();
      // Proceed without re-checking hasSelectedApiKey to avoid race condition
    }

    setLoading(true);
    setError(null);

    try {
      const imageUrl = await generateInfographic(selectedPrompt.prompt);
      setGeneratedImages(prev => ({
        ...prev,
        [selectedPrompt.id]: imageUrl
      }));
    } catch (err: any) {
      console.error(err);
      // Handle "Requested entity was not found" by resetting key selection
      if (err.message && err.message.includes("Requested entity was not found")) {
        setHasKey(false);
      }
      setError("Failed to generate image. Ensure you have a valid API key with billing enabled.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedPrompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white font-serif flex items-center gap-2">
            <Image className="text-emerald-500" />
            AI Infographic Studio
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Generate visual evidence using Gemini 3 Pro (Nano Banana Pro).
          </p>
        </div>
        {!hasKey && (
            <button 
                onClick={handleSelectKey}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/50 rounded hover:bg-amber-500/20 transition-colors text-sm"
            >
                <Lock size={14} />
                Unlock Image Generation
            </button>
        )}
        {hasKey && (
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs border border-emerald-500/20">
                <Unlock size={12} />
                Ready to Generate
             </div>
        )}
      </div>

      <div className="grid md:grid-cols-12 min-h-[400px]">
        {/* Sidebar */}
        <div className="md:col-span-4 border-r border-slate-800 bg-slate-900/80 p-4 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Select Concept</p>
          {PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPrompt(p)}
              className={`w-full text-left p-3 rounded transition-all ${
                selectedPrompt.id === p.id 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="font-bold text-sm mb-1">{p.title}</div>
              <div className={`text-xs ${selectedPrompt.id === p.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                {p.description}
              </div>
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="md:col-span-8 p-6 flex flex-col">
          <div className="flex-grow flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 min-h-[300px] relative overflow-hidden group">
            
            {generatedImages[selectedPrompt.id] ? (
              <img 
                src={generatedImages[selectedPrompt.id]} 
                alt={selectedPrompt.title} 
                className="w-full h-full object-contain animate-fade-in"
              />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <Image className="text-slate-700" size={32} />
                </div>
                <p className="text-slate-500">Select a concept and click generate</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="text-center">
                    <Loader2 className="animate-spin text-emerald-500 mx-auto mb-2" size={32} />
                    <p className="text-emerald-400 text-sm animate-pulse">Rendering high-fidelity infographic...</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-4">
             <div className="bg-slate-950 p-3 rounded border border-slate-800 relative">
                <p className="text-xs text-slate-500 font-mono break-words pr-8">
                    {selectedPrompt.prompt}
                </p>
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy Prompt"
                >
                    {copied ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} />}
                </button>
             </div>

             <div className="flex justify-end gap-3">
                <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 px-6 rounded transition-colors flex items-center gap-2"
                >
                    {loading ? 'Generating...' : 'Generate Slide'}
                </button>
             </div>
             
             {error && (
                 <p className="text-red-400 text-xs text-right">{error}</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

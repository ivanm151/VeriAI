import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Image as ImageIcon, 
  Type, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  Eye, 
  EyeOff,
  ExternalLink,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { detectAI, DetectionResult } from './services/detector';

// --- Components ---

const Badge = ({ probability, type }: { probability: number, type: string }) => {
  const isAI = probability > 0.5;
  const percentage = Math.round(probability * 100);
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
      isAI 
        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    }`}>
      {isAI ? <AlertTriangle size={10} /> : <CheckCircle size={10} />}
      {isAI ? `AI Generated (${percentage}%)` : `Human (${100 - percentage}%)`}
      <span className="opacity-50 ml-1">[{type}]</span>
    </div>
  );
};

const DemoPage = ({ results, hideAI }: { results: DetectionResult[], hideAI: boolean }) => {
  const textResult = results.find(r => r.type === 'text');
  const imageResults = results.filter(r => r.type === 'image');

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
        </div>
        <div className="flex-1 bg-white border border-zinc-200 rounded px-2 py-0.5 text-[10px] text-zinc-400 font-mono truncate">
          https://simulated-article.com/ai-future
        </div>
      </div>
      
      <div className="p-8 space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif italic text-zinc-900 leading-tight">
            The Silent Transformation of Modern Industries
          </h1>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span>By Alex Rivera</span>
            <span>•</span>
            <span>March 7, 2026</span>
          </div>
        </div>

        <div className="relative group">
          {textResult && (
            <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge probability={textResult.ai_probability} type={textResult.generation_type} />
            </div>
          )}
          <p className={`text-zinc-600 leading-relaxed font-sans transition-all duration-500 ${hideAI && textResult && textResult.ai_probability > 0.5 ? 'blur-md select-none opacity-20' : ''}`}>
            AI is transforming many industries by automating complex tasks and providing insights that were previously impossible to obtain. From healthcare to finance, the integration of large language models is reshaping how professionals approach their daily workflows.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {imageResults.map((img, idx) => {
            const isAI = img.ai_probability > 0.5;
            if (hideAI && isAI) return null;

            return (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-100 aspect-square bg-zinc-50">
                <img 
                  src={img.url} 
                  alt="Article visual" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge probability={img.ai_probability} type={img.generation_type} />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-zinc-600 leading-relaxed font-sans">
          As we move forward, the distinction between human-created and machine-generated content becomes increasingly blurred. This highlights the urgent need for transparency layers that can help users navigate the digital landscape with confidence.
        </p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [hideAI, setHideAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [error, setError] = useState<string | null>(null);

  const demoData = {
    texts: ["AI is transforming many industries by automating complex tasks and providing insights that were previously impossible to obtain."],
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"
    ]
  };

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await detectAI(demoData);
      setResults(data);
    } catch (err) {
      setError('Failed to connect to detection server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleScan();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-zinc-900 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Shield size={18} />
            </div>
            <span className="font-bold tracking-tight text-lg">Veri <span className="text-emerald-600">AI</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setHideAI(!hideAI)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                hideAI 
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' 
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              {hideAI ? <EyeOff size={14} /> : <Eye size={14} />}
              {hideAI ? 'AI Filter Active' : 'Filter AI Content'}
            </button>
            <button 
              onClick={handleScan}
              disabled={loading}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">


        {/* Main Content Area */}
        <section className="lg:col-span-9 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-zinc-200/50 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Live Preview
            </button>
            <button 
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'raw' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Raw Analysis
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'preview' ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight">Transparency Layer</h2>
                  <span className="text-xs text-zinc-400 font-mono">Simulating browser extension overlay</span>
                </div>
                <DemoPage results={results} hideAI={hideAI} />
              </motion.div>
            ) : (
              <motion.div 
                key="raw"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {results.map((res, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-400">
                        {res.type === 'image' ? <ImageIcon size={16} /> : <Type size={16} />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">{res.type} Analysis</span>
                      </div>
                      <Badge probability={res.ai_probability} type={res.generation_type} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">AI Probability</span>
                        <span className="font-bold">{Math.round(res.ai_probability * 100)}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${res.ai_probability * 100}%` }}
                          className={`h-full ${res.ai_probability > 0.5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                    </div>

                    {res.type === 'image' ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100">
                        <img src={res.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-600 italic line-clamp-3">"{res.text}"</p>
                    )}

                    <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-400 uppercase font-bold">Source Model</span>
                        <span className="text-xs font-medium text-zinc-700">{res.generation_type || 'Unknown'}</span>
                      </div>
                      <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

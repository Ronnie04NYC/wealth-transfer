import React, { useEffect, useState } from 'react';
import { fetchEconomicData } from './services/geminiService';
import { ReportData } from './types';
import { ProductivityChart, CeoPayChart, CostOfLivingChart } from './components/Charts';
import { Calculator } from './components/Calculator';
import { ArrowDown, Info, DollarSign, TrendingUp, AlertTriangle, ExternalLink, Terminal, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<string>("ESTABLISHING_UPLINK...");

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const statusTimer = setTimeout(() => {
            if (mounted) setLoadingStatus("DECRYPTING_ARCHIVES...");
        }, 2000);
        
        const secondStatusTimer = setTimeout(() => {
            if (mounted) setLoadingStatus("COMPILING_VISUALIZATION...");
        }, 5000);

        const result = await fetchEconomicData();
        
        clearTimeout(statusTimer);
        clearTimeout(secondStatusTimer);

        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false); 
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-cyan-500 p-4 font-mono relative overflow-hidden">
        <div className="cyber-grid absolute inset-0 opacity-20"></div>
        <div className="relative z-10 text-center">
            <Cpu className="w-16 h-16 mb-6 mx-auto animate-pulse text-fuchsia-500" />
            <h2 className="text-2xl tracking-widest mb-2 border-r-2 border-cyan-500 pr-2 animate-pulse inline-block">
                {loadingStatus}
            </h2>
            <div className="w-64 h-1 bg-slate-900 mx-auto mt-4 overflow-hidden">
                <div className="h-full bg-cyan-500 animate-[shimmer_2s_infinite]"></div>
            </div>
            <p className="text-slate-600 text-xs mt-4 uppercase">System: Gemini 2.5 Flash</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-white text-center p-10 font-mono">CONNECTION_FAILED. REFRESH_SYSTEM.</div>;

  return (
    <div className="min-h-screen bg-black text-slate-300 selection:bg-fuchsia-500 selection:text-white relative overflow-x-hidden">
      <div className="cyber-grid absolute inset-0 opacity-20 fixed pointer-events-none h-screen"></div>
      
      {/* Hero Section */}
      <header className="relative py-24 px-6 md:px-12 text-center max-w-6xl mx-auto z-10">
        <div className="inline-block border border-cyan-500/30 px-4 py-1 rounded-full bg-cyan-950/30 backdrop-blur mb-6">
            <span className="text-cyan-400 text-xs font-mono uppercase tracking-[0.2em] animate-pulse">
                System Alert: Wealth Transfer Detected
            </span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500 neon-text-shadow font-mono uppercase leading-tight">
          The Great<br/>Wealth Transfer
        </h1>
        
        <p className="text-xl md:text-2xl text-cyan-100/80 max-w-3xl mx-auto leading-relaxed mb-12 font-light border-l-2 border-fuchsia-500 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
          {data.summary}
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 text-sm font-mono text-slate-500">
            <span className="flex items-center justify-center gap-2">
                <Terminal size={14} className="text-fuchsia-500" /> 
                SOURCE: RAND_CORP_DB
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center justify-center gap-2">
                 <Terminal size={14} className="text-cyan-500" /> 
                SOURCE: EPI_REPORTS
            </span>
        </div>
        
        <div className="mt-20 animate-bounce text-cyan-700 flex justify-center opacity-50">
            <ArrowDown size={32} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-40 relative z-10">
        
        {/* Section 1: The Split */}
        <section className="scroll-mt-24 group">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-12">
            <div>
              <div className="flex items-center gap-2 text-fuchsia-400 mb-4 font-bold uppercase tracking-[0.2em] text-xs font-mono">
                <TrendingUp size={16} /> Data_Stream: Productivity_Gap
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-none">
                We <span className="text-cyan-400">Worked</span> Harder.<br/> 
                They <span className="text-fuchsia-500">Took</span> It All.
              </h2>
              <div className="space-y-6 text-lg text-slate-400 font-light border-l border-slate-800 pl-6">
                <p>
                    <span className="text-white font-mono text-sm block mb-2">> 1948 - 1979</span>
                    Hourly compensation rose 91%, tracking perfectly with productivity gains (97%). The system was balanced.
                </p>
                <p>
                    <span className="text-white font-mono text-sm block mb-2">> 1979 - Present</span>
                    A deliberate code injection. American efficiency skyrocketed, but wages were hard-coded to flatline. The surplus? Extracted by the 1%.
                </p>
              </div>
            </div>
            <div className="bg-black/80 p-1 md:p-6 rounded-none border border-cyan-900 shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] relative">
                <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-500"></div>
                <ProductivityChart data={data.productivityVsWages} />
               <p className="text-right text-[10px] text-slate-600 mt-4 font-mono uppercase tracking-widest">>> Index 1975-1979 = 100 // BLS_DATA</p>
            </div>
          </div>
          <div className="bg-slate-900/50 border-l-4 border-fuchsia-600 p-8 max-w-4xl mx-auto backdrop-blur-sm">
            <h3 className="font-bold text-fuchsia-400 mb-2 font-mono uppercase tracking-widest text-sm">>> The $50 Trillion Theft</h3>
            <p className="text-slate-300 font-mono text-sm leading-relaxed">{data.randReportContext}</p>
          </div>
        </section>

        {/* Section 2: CEO Pay */}
        <section>
           <div className="mb-16 text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4 font-bold uppercase tracking-[0.2em] text-xs font-mono">
                <DollarSign size={16} /> Data_Stream: Executive_Comp
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                System Error: <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Unbounded Growth</span>
              </h2>
              <p className="text-lg text-slate-400 font-light">
                1965 Ratio: 20:1<br/>
                Current Ratio: <span className="text-white font-bold bg-yellow-500/20 px-2 py-0.5 rounded">399:1</span>
              </p>
           </div>
           
           <div className="bg-black/80 p-1 md:p-10 border-y border-yellow-500/30 backdrop-blur-sm relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <CeoPayChart data={data.ceoVsWorker} />
              <p className="text-center text-[10px] text-slate-600 mt-4 font-mono uppercase">>> % Growth Since 1978 // EPI_DATABASE</p>
           </div>
        </section>

        {/* Section 3: Cost of Living */}
        <section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-black/80 p-1 md:p-6 border border-slate-800 shadow-[0_0_40px_-10px_rgba(239,68,68,0.1)] relative">
                {/* Decorative UI elements */}
                <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                </div>
               <CostOfLivingChart data={data.costOfLiving} />
               <p className="text-center text-[10px] text-slate-600 mt-4 font-mono uppercase">>> Inflation Adjusted Index (1980=100)</p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-2 text-red-500 mb-4 font-bold uppercase tracking-[0.2em] text-xs font-mono">
                <AlertTriangle size={16} /> Critical_Warning: Cost_Spike
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                The Survival<br/><span className="text-red-500 neon-text-shadow">Paradox</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed font-light">
                Commodities required for biological survival have been inflated beyond sustainable parameters.
              </p>
              <ul className="space-y-6 mt-6 font-mono text-sm">
                <li className="flex items-center gap-4 bg-slate-900/30 p-3 border-l-2 border-red-500">
                    <span className="text-red-400 font-bold uppercase tracking-wider min-w-[100px]">Housing</span>
                    <span className="text-slate-300">Ownership access denied. Rents > Wages.</span>
                </li>
                <li className="flex items-center gap-4 bg-slate-900/30 p-3 border-l-2 border-green-500">
                    <span className="text-green-400 font-bold uppercase tracking-wider min-w-[100px]">Health</span>
                    <span className="text-slate-300">Premiums absorb all margin.</span>
                </li>
                 <li className="flex items-center gap-4 bg-slate-900/30 p-3 border-l-2 border-fuchsia-500">
                    <span className="text-fuchsia-400 font-bold uppercase tracking-wider min-w-[100px]">Education</span>
                    <span className="text-slate-300">Debt trap initated.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pt-20 border-t border-slate-900">
          <Calculator />
        </section>

        {/* Footer / Sources */}
        <footer className="pt-20 pb-32 md:pb-24">
            <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-[0.3em] mb-8 text-center">Encrypted Source Links</h4>
            <div className="grid md:grid-cols-3 gap-6 font-mono text-xs">
                {data.sources.map((source, idx) => (
                    <a key={idx} href={source.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-slate-950 hover:bg-black border border-slate-900 hover:border-cyan-700 transition-all group text-slate-500 hover:text-cyan-400 h-full">
                        <ExternalLink size={12} className="shrink-0" />
                        <span className="uppercase text-left whitespace-normal break-words leading-tight">{source.title}</span>
                    </a>
                ))}
            </div>
            <p className="text-center text-slate-800 text-[10px] mt-16 font-mono uppercase tracking-widest">
                System Build: v2.0.4 // Gemini_Flash_Powered // React_Core
            </p>
        </footer>

      </main>
    </div>
  );
};

export default App;
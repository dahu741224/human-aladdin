
import React from 'react';
import { AladdinAnalysis } from '../types';
import PhaseVisualizer from './PhaseVisualizer';
import { 
  AlertTriangle, 
  ShieldAlert, 
  RefreshCcw, 
  Activity, 
  Info,
  BarChart3,
  Zap,
  UserCheck
} from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: AladdinAnalysis;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Phase Section */}
      <div className="glass-panel rounded-3xl p-8 border-l-4 border-amber-500 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-amber-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity size={16} /> 目前狀態分析
          </h3>
          <span className="text-[10px] text-slate-500 font-bold bg-slate-800 px-3 py-1 rounded-full uppercase border border-white/5">狀態描述</span>
        </div>
        
        <PhaseVisualizer currentPhase={analysis.phase} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500"><Zap size={20} /></div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">系統承受度</p>
                    <p className="text-slate-200 font-bold">{analysis.resilience}</p>
                </div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500"><UserCheck size={20} /></div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">人的狀態</p>
                    <p className="text-slate-200 font-bold">{analysis.humanState}</p>
                </div>
            </div>
        </div>

        <p className="mt-6 text-slate-300 text-sm md:text-base leading-relaxed italic border-t border-white/5 pt-6">
          「{analysis.phaseReasoning}」
        </p>
      </div>

      {/* Risk Signals */}
      {analysis.riskSignals && analysis.riskSignals.length > 0 && (
        <div className="glass-panel rounded-3xl p-8 border-t border-amber-900/50">
          <h3 className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart3 size={18} /> 關鍵風險信號
          </h3>
          <div className="space-y-4">
            {analysis.riskSignals.map((sig, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-start gap-4 p-5 bg-slate-800/20 rounded-2xl border border-white/5">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex-shrink-0 text-center w-16 ${
                  sig.riskLevel === '高' ? 'bg-red-500 text-white' : 
                  sig.riskLevel === '中' ? 'bg-amber-500 text-slate-900' : 
                  'bg-emerald-500 text-white'
                }`}>
                  {sig.riskLevel}
                </div>
                <div>
                  <h4 className="text-slate-100 font-bold text-sm mb-1">{sig.signal}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{sig.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dangerous Behaviors */}
        <div className="glass-panel rounded-3xl p-8 border-t border-slate-700">
          <h3 className="text-red-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <AlertTriangle size={18} /> 容易失誤的地方
          </h3>
          <p className="text-[10px] text-slate-500 mb-6 leading-tight uppercase tracking-wider">
            這些行為通常是為了對抗不安，而非理性評估。
          </p>
          <ul className="space-y-4">
            {analysis.dangerousBehaviors.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-300">
                <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Guardrails */}
        <div className="glass-panel rounded-3xl p-8 border-t-2 border-red-600 bg-red-900/5">
          <h3 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldAlert size={18} /> 風險護欄（狀態限定）
          </h3>
          <p className="text-[10px] text-red-400/70 mb-6 leading-tight uppercase tracking-wider">
            在目前狀態下風險顯著提高的行為，並非永久禁止。
          </p>
          <ul className="space-y-4">
            {analysis.guardrails.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-red-100 bg-red-900/10 p-3 rounded-xl border border-red-900/20">
                <span className="font-bold flex-shrink-0 text-[10px] mt-0.5 bg-red-600 px-2 py-0.5 rounded-full uppercase">禁止</span>
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Safe Action Radius */}
      <div className="glass-panel rounded-3xl p-8 border-l-4 border-emerald-500 bg-emerald-950/5">
        <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <RefreshCcw size={18} /> 安全行動半徑（特徵）
        </h3>
        <p className="text-[10px] text-emerald-500/70 mb-6 leading-tight uppercase tracking-wider">
          特徵：可暫停、可縮小、可撤回、不改核心結構。是為了保留選擇權。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.safeActionRadius.map((item, idx) => (
            <div key={idx} className="p-4 bg-emerald-900/10 rounded-2xl border border-emerald-900/20 text-emerald-100 text-sm flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Survival Metric */}
      <div className="glass-panel rounded-3xl p-8 border border-amber-900/30">
        <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-3 rounded-2xl text-slate-900 shadow-xl shadow-amber-500/20">
                <Info size={24} />
            </div>
            <div>
                <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">核心存續指標</h4>
                <p className="text-amber-100 font-bold text-lg">{analysis.survivalMetric}</p>
            </div>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl text-[10px] md:text-xs text-slate-400 uppercase tracking-widest text-center leading-relaxed font-bold opacity-60">
        {analysis.disclaimer}
      </div>
    </div>
  );
};

export default AnalysisDisplay;


import React from 'react';
import { LifePhase } from '../types';

interface PhaseVisualizerProps {
  currentPhase: LifePhase;
}

const PHASE_LABELS: Record<LifePhase, string> = {
  [LifePhase.START]: '啟動',
  [LifePhase.ADVANCE]: '擴張',
  [LifePhase.INFLECTION]: '轉折',
  [LifePhase.MATURE]: '成熟',
  [LifePhase.DECLINE]: '衰退'
};

const PhaseVisualizer: React.FC<PhaseVisualizerProps> = ({ currentPhase }) => {
  const phases = Object.values(LifePhase);
  
  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between items-center px-4 md:px-12">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
        <div 
            className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 transition-all duration-1000 ease-in-out z-0"
            style={{ width: `${(phases.indexOf(currentPhase) / (phases.length - 1)) * 100}%` }}
        ></div>

        {phases.map((phase) => {
          const isActive = phase === currentPhase;
          const isPassed = phases.indexOf(phase) < phases.indexOf(currentPhase);
          
          return (
            <div key={phase} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-4 h-4 rounded-full transition-all duration-500 border-2 ${
                  isActive 
                    ? 'bg-amber-500 border-amber-300 scale-150 shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                    : isPassed 
                    ? 'bg-amber-900 border-amber-700' 
                    : 'bg-slate-900 border-slate-700'
                }`}
              />
              <span className={`mt-3 text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                isActive ? 'text-amber-400' : 'text-slate-500'
              }`}>
                {PHASE_LABELS[phase]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseVisualizer;

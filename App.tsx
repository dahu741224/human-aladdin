
import React, { useState } from 'react';
import { analyzeSituation } from './geminiService';
import { AladdinAnalysis, RiskCategory } from './types';
import AnalysisDisplay from './components/AnalysisDisplay';
import { 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  Heart,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0: Onboarding, 1: Category, 2: Form, 3: Result
  const [category, setCategory] = useState<RiskCategory | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AladdinAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => {
    if (step === 3) setResult(null);
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleCategorySelect = (cat: RiskCategory) => {
    setCategory(cat);
    setFormData({});
    setStep(2);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeSituation(category, formData);
      setResult(data);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "風險護欄系統遭遇內部錯誤。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderOnboarding = () => (
    <div className="max-w-2xl mx-auto text-center space-y-12 py-12 animate-in fade-in zoom-in duration-500">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">這不是算命。</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Human Aladdin 不告訴你該怎麼做，只幫你避免在不可逆的錯誤中掉進懸崖。
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <ShieldCheck size={20} />, title: "不提供指令", desc: "保留您的自主權" },
          { icon: <ShieldCheck size={20} />, title: "只標註懸崖", desc: "識別不可逆風險" },
          { icon: <ShieldCheck size={20} />, title: "誠實分析", desc: "基於您的現狀描述" }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3">
            <div className="text-amber-500 mx-auto w-fit">{item.icon}</div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest">{item.title}</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed uppercase font-bold">{item.desc}</p>
          </div>
        ))}
      </div>
      <button 
        onClick={handleNextStep}
        className="group flex items-center gap-2 mx-auto px-10 py-5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full font-black tracking-widest transition-all hover:scale-105"
      >
        開始分析 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-white">選擇你現在要處理的事</h2>
        <p className="text-slate-400">請一次只處理一件事，不要混在一起分析。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'business', icon: <Briefcase size={32} />, title: "商業經營", desc: "關於營運、現金流、成本、結構風險。" },
          { id: 'investment', icon: <TrendingUp size={32} />, title: "投資倉位", desc: "關於資產比例、時間壓力、出局風險。" },
          { id: 'life', icon: <Heart size={32} />, title: "個人決策", desc: "關於精力狀態、心理焦慮、可回收性。" }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id as RiskCategory)}
            className="group glass-panel p-8 rounded-[40px] border border-white/5 text-left hover:border-amber-500/50 transition-all hover:bg-amber-500/5"
          >
            <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform">{cat.icon}</div>
            <h3 className="text-xl font-black text-white mb-3">{cat.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderForm = () => {
    const isBusiness = category === 'business';
    const isInvestment = category === 'investment';
    const isLife = category === 'life';

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="flex items-center justify-between mb-8">
            <button onClick={handlePrevStep} className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                <ChevronLeft size={16} /> 返回選擇
            </button>
            <div className="text-right">
                <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">目前類別</span>
                <h3 className="text-lg font-black text-white uppercase">{category}</h3>
            </div>
        </div>

        <form onSubmit={handleAnalyze} className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/5 space-y-8">
          <div className="space-y-6">
            {isBusiness && (
              <>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">每月平均營收與趨勢</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="平均月營收" className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('avg_revenue', e.target.value)} />
                    <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('revenue_trend', e.target.value)}>
                        <option value="">營收趨勢</option>
                        <option value="上升">上升</option>
                        <option value="持平">持平</option>
                        <option value="下降">下降</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">可用現金與續航力</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="目前可用現金" className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('current_cash', e.target.value)} />
                    <input type="number" placeholder="可支撐月數" className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('cash_runway', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">決策者精力與重要性</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('energy', e.target.value)}>
                        <option value="">精力狀態</option>
                        <option value="充足">充足</option>
                        <option value="緊繃">緊繃</option>
                        <option value="過載">過載</option>
                    </select>
                    <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('importance', e.target.value)}>
                        <option value="">重要度</option>
                        <option value="低">低</option>
                        <option value="中">中</option>
                        <option value="高">高</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {isInvestment && (
              <>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">資產比例與時間壓力</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="number" placeholder="投入資金佔總資產 (%)" className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('asset_ratio', e.target.value)} />
                    <input type="text" placeholder="這筆錢多久內一定要用？" className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('time_limit', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">心理狀態</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('emotional_impact', e.target.value)}>
                        <option value="">是否影響情緒/睡眠？</option>
                        <option value="是">是</option>
                        <option value="否">否</option>
                    </select>
                    <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('win_back_urgency', e.target.value)}>
                        <option value="">多想把它「做回來」？ (1-5)</option>
                        <option value="1">1 (不急)</option>
                        <option value="3">3 (普通)</option>
                        <option value="5">5 (極度焦慮)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {isLife && (
              <>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">能量與壓力指標</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('sleep_quality', e.target.value)}>
                        <option value="">睡眠品質</option>
                        <option value="好">好</option>
                        <option value="普通">普通</option>
                        <option value="差">差</option>
                    </select>
                    <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('urgency_feel', e.target.value)}>
                        <option value="">現在不做就來不及？</option>
                        <option value="是">是</option>
                        <option value="否">否</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">可回收性評估</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('has_retreat', e.target.value)}>
                            <option value="">做錯是否有退路？</option>
                            <option value="是">是</option>
                            <option value="否">否</option>
                        </select>
                        <select className="bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50" onChange={(e) => handleInputChange('anxiety_level', e.target.value)}>
                            <option value="">焦慮程度 (1-5)</option>
                            <option value="1">1 (平靜)</option>
                            <option value="3">3 (中等)</option>
                            <option value="5">5 (極度焦慮)</option>
                        </select>
                    </div>
                </div>
              </>
            )}

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">補充說明 (自由描述)</label>
              <textarea 
                className="w-full h-32 bg-slate-900/50 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
                placeholder="請誠實描述目前的具體狀況，這不是為了給 AI 看，是為了幫您整理思緒。"
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className={`w-full flex items-center justify-center gap-2 py-5 rounded-3xl font-black tracking-widest transition-all ${
              isAnalyzing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-xl shadow-amber-500/30'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                正在計算風險邊界...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                標註懸崖
              </>
            )}
          </button>
        </form>
      </div>
    );
  };

  const renderResult = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-8">
        <button onClick={handlePrevStep} className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /> 重新分析
        </button>
        <div className="text-right">
            <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">分析報告</span>
            <h3 className="text-lg font-black text-white uppercase">{category} Risk Readout</h3>
        </div>
      </div>
      {result && <AnalysisDisplay analysis={result} />}
    </div>
  );

  return (
    <div className="min-h-screen pb-40 selection:bg-amber-500/30">
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 py-6 px-8 mb-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/40">
              <ShieldCheck className="text-slate-900" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white leading-none">HUMAN ALADDIN</h1>
              <p className="text-[10px] text-amber-500 font-black tracking-[0.3em] uppercase mt-1">決策護欄系統</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <span className="hover:text-amber-500 transition-colors cursor-help">不操控</span>
            <span className="hover:text-amber-500 transition-colors cursor-help">不恐嚇</span>
            <span className="hover:text-amber-500 transition-colors cursor-help">不預言</span>
          </div>
        </div>
      </nav>

      <main className="px-6">
        {step === 0 && renderOnboarding()}
        {step === 1 && renderCategorySelection()}
        {step === 2 && renderForm()}
        {step === 3 && renderResult()}
      </main>

     <footer
  aria-hidden="true"
  className="fixed bottom-0 w-full glass-panel border-t border-white/5 py-4 px-8 z-50 pointer-events-none"
>
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 uppercase tracking-[0.2em] gap-4 font-bold">
    <span className="text-center opacity-70">
      Human Aladdin 僅提供風險與狀態提示，不構成預測或建議。
    </span>
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
      <span>系統狀態：核心護欄運行中</span>
    </div>
    <span className="text-amber-600">所有決定仍由你自行判斷與承擔</span>
  </div>
</footer>

    </div>
  );
};

export default App;

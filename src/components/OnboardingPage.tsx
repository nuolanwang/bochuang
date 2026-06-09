import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Brain, Cpu, Leaf, Heart, Briefcase, Rocket, Globe, 
  Shield, Compass, Sparkles, BookOpen, AlertCircle, 
  ArrowRight, ArrowLeft, Check, FileText, Landmark, Users
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onComplete: () => void;
}

// 自身发展领域 preset options
const DOMAIN_OPTIONS = [
  { id: 'ai', label: '人工智能与大模型', desc: '深度学习、生成式AI、机器视觉', icon: Brain, gradient: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-100/30' },
  { id: 'chips', label: '集成电路与微电子', desc: '芯片设计、半导体工艺、系统开发', icon: Cpu, gradient: 'from-indigo-500/10 to-purple-500/10 text-indigo-600 border-indigo-100/30' },
  { id: 'energy', label: '新能源与绿色低碳', desc: '氢能、光伏、储能技术、碳中和', icon: Leaf, gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100/30' },
  { id: 'biotech', label: '生物医药与生命科学', desc: '靶向药研发、智慧医疗、基因工程', icon: Heart, gradient: 'from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-100/30' },
  { id: 'robots', label: '智能机器人高端装备', desc: '工业臂、无人机、精密智造、工业4.0', icon: Rocket, gradient: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100/30' },
  { id: 'iot', label: '物联网与数字孪生', desc: '高精度传感器、边缘计算、孪生工厂', icon: Globe, gradient: 'from-cyan-500/10 to-sky-500/10 text-cyan-600 border-cyan-100/30' },
  { id: 'security', label: '网络安全与可信计算', desc: '数据加密、防篡改沙箱、区块链开发', icon: Shield, gradient: 'from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-100/30' },
  { id: 'materials', label: '新材料与先进化工', desc: '高温合金、超导材料、纳米新材料', icon: Compass, gradient: 'from-teal-500/10 to-emerald-500/10 text-teal-600 border-teal-100/30' },
  { id: 'fintech', label: '金融科技与量化分析', desc: '高频交易、智能投研、风控模型', icon: Briefcase, gradient: 'from-sky-500/10 to-blue-500/10 text-sky-600 border-sky-100/30' },
  { id: 'space', label: '空天信息与遥感技术', desc: '低轨卫星、地理测绘、气象遥感数据', icon: Sparkles, gradient: 'from-purple-500/10 to-fuchsia-500/10 text-purple-600 border-purple-100/30' }
];

// 感兴趣的资讯 preset options
const NEWS_OPTIONS = [
  { id: 'policy', label: '国家与地方政策解读', desc: '专精特新、高新技术企业、高额财政奖补申请指南', icon: Landmark, tag: '官方政策', color: 'from-[#0045c4]/10 to-blue-500/10 text-[#0045c4]' },
  { id: 'competition', label: '双创大赛与杯赛动态', desc: '“互联网+”、“挑战杯”、绿色低碳设计大赛实时报名与赛制变更', icon: Trophy, tag: '黄金赛事', color: 'from-amber-500/10 to-yellow-500/10 text-amber-600' },
  { id: 'tech', label: '前沿技术突破与查新', desc: '国内外顶尖期刊论文、首创技术方案与行业BP查新说明', icon: Cpu, tag: '科技查新', color: 'from-indigo-500/10 to-purple-500/10 text-indigo-600' },
  { id: 'finance', label: '投融资与专项研发补贴', desc: '天使投资对接、政府引导基金跟投计划及校企支撑奖金', icon: FileText, tag: '资金链条', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600' },
  { id: 'talent', label: '高层次人才与落户名额', desc: '省市级领军人才评选、创业团队高阶持股与住房直补政策', icon: Users, tag: '人才落户', color: 'from-rose-500/10 to-pink-500/10 text-rose-600' },
  { id: 'academic', label: '顶级学术会议与高峰论坛', desc: '工作站院士入驻、重大会议发表、路演实况及高峰沙龙入场券', icon: BookOpen, tag: '学术沙龙', color: 'from-cyan-500/10 to-sky-500/10 text-cyan-600' }
];

export const OnboardingPage: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedNews, setSelectedNews] = useState<string[]>([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const toggleDomain = (id: string) => {
    if (selectedDomains.includes(id)) {
      setSelectedDomains(selectedDomains.filter(item => item !== id));
      setShowLimitWarning(false);
    } else {
      if (selectedDomains.length >= 5) {
        setShowLimitWarning(true);
        return;
      }
      setSelectedDomains([...selectedDomains, id]);
    }
  };

  const toggleNews = (id: string) => {
    if (selectedNews.includes(id)) {
      setSelectedNews(selectedNews.filter(item => item !== id));
    } else {
      setSelectedNews([...selectedNews, id]);
    }
  };

  const handleNext = () => {
    if (selectedDomains.length === 0) {
      alert('请至少选择 1 个您自身的发展领域');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleFinish = () => {
    if (selectedNews.length === 0) {
      alert('请至少选择 1 个您感兴趣的资讯类型');
      return;
    }
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/40 backdrop-blur-[12px] flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
      
      {/* Exquisite Apple-Design Modal Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="w-full max-w-[1080px] bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] border border-white/40 flex flex-col justify-between overflow-hidden relative min-h-[620px]"
      >
        
        {/* Apple-style delicate top chrome bar indicator */}
        <div className="absolute top-4 left-6 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-450/75" />
          <div className="w-3 h-3 rounded-full bg-amber-450/75" />
          <div className="w-3 h-3 rounded-full bg-emerald-450/75" />
        </div>

        {/* Dynamic decorative backdrop subtle gradient accents inside the modal */}
        <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-blue-100/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-emerald-50/20 rounded-full blur-[70px] pointer-events-none" />

        {/* Modal Header */}
        <header className="px-8 lg:px-12 pt-8 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100/40 shrink-0 relative z-25">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0045c4] to-blue-500 p-0.5 shadow-md shadow-blue-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5.5 h-5.5 text-white" stroke="currentColor" strokeWidth="2.5">
                <path d="M4.53 10.9A9.7 9.7 0 0112 3a9.7 9.7 0 017.47 7.9A9.9 9.9 0 0112 21a9.9 9.9 0 01-7.47-10.1z" strokeLinecap="round" />
                <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-left font-sans">
              <h1 className="text-sm font-black text-slate-850 tracking-wider">博 创 园</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest -mt-0.5">BOCHUANG SYSTEM</p>
            </div>
          </div>

          {/* Elegant Stepper Wizard Pill */}
          <div className="flex bg-slate-100/50 backdrop-blur p-0.8 rounded-xl items-center gap-1 border border-slate-200/20 select-none">
            <button 
              type="button"
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                step === 1 
                  ? "bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] scale-100" 
                  : "text-slate-450 hover:text-slate-700"
              )}
              onClick={() => step === 2 && setStep(1)}
            >
              1. 自身发展领域
            </button>
            <div className="w-2 h-px bg-slate-250" />
            <button 
              type="button" 
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                step === 2 
                  ? "bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] scale-100" 
                  : "text-slate-450 hover:text-slate-700"
              )}
              onClick={() => step === 1 && selectedDomains.length > 0 && setStep(2)}
            >
              2. 感兴趣资讯
            </button>
          </div>
        </header>

        {/* Content Box */}
        <div className="px-8 lg:px-12 py-6 flex-1 flex flex-col justify-between relative z-20 min-h-[420px]">
          <AnimatePresence mode="wait">
            
            {step === 1 ? (
              /* CARD DECORATIVE GRID OPTION 1: CHOOSE CORE DOMAINS (APPLE STYLE) */
              <motion.div
                key="step-domains"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Title Segment */}
                <div className="text-left">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#0045c4] rounded-full inline-block" />
                    请选择您自身的发展领域
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-1">
                    博创园将为您量身定制高价值的项目立项概率及企业政策白皮书。最多可选择 5 个。
                  </p>
                </div>

                {/* Overlimit Warning Bubble */}
                {showLimitWarning && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#fff9eb] border border-[#fbe9b7] rounded-xl px-4 py-3 flex items-center gap-2.5 text-amber-700 text-xs font-bold leading-tight"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>最多可选择 5 个领域。请先取消已选定的项目以进行其他配置。</span>
                  </motion.div>
                )}

                {/* Apple-Style Beautiful Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 py-2">
                  {DOMAIN_OPTIONS.map((item) => {
                    const isSelected = selectedDomains.includes(item.id);
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleDomain(item.id)}
                        className={cn(
                          "group p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative flex flex-col justify-between text-left select-none relative overflow-hidden",
                          isSelected
                            ? "bg-white border-[#0045c4] shadow-[0_12px_28px_rgba(0,69,196,0.06)] scale-[1.01]"
                            : "bg-white/45 border-slate-200/50 hover:border-slate-300 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)]"
                        )}
                      >
                        {/* Selector indicator bullet */}
                        <div className="absolute top-4 right-4 flex items-center justify-center">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300",
                            isSelected
                              ? "bg-[#0045c4] border-[#0045c4] text-white scale-110"
                              : "border-slate-300/80 bg-white"
                          )}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3.5]" />}
                          </div>
                        </div>

                        {/* Top layout decoration with Icon */}
                        <div className="space-y-4">
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", item.gradient)}>
                            <IconComp className="w-5 h-5" />
                          </div>
                          
                          <div className="space-y-1 pr-4">
                            <h3 className="text-xs font-extrabold text-slate-850 tracking-tight leading-snug">
                              {item.label}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        {/* Selected overlay shadow line */}
                        {isSelected && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#0045c4]" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Subtext info count badge */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400 text-[11px] font-semibold">
                    * 精准的核心定义可大幅拉伸AI沙盘立项模型的测算拟合度。
                  </span>
                  
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold border transition-colors",
                    selectedDomains.length > 0 
                      ? "bg-blue-50 text-[#0045c4] border-blue-150"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  )}>
                    已选：{selectedDomains.length} / 5 项
                  </span>
                </div>

              </motion.div>
            ) : (
              /* CARD DECORATIVE GRID OPTION 2: CHOOSE INTERESTED NEWS (APPLE STYLE) */
              <motion.div
                key="step-news"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Title segment */}
                <div className="text-left">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-emerald-600 rounded-full inline-block" />
                    请选择您感兴趣的资讯
                  </h2>
                  <p className="text-slate-400 text-xs font-medium mt-1">
                    系统将基于您的订阅情报进行高保真重构，24小时轮询省市公示公告。请自由勾选。
                  </p>
                </div>

                {/* Apple-style News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                  {NEWS_OPTIONS.map((item) => {
                    const isSelected = selectedNews.includes(item.id);
                    const IconComp = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleNews(item.id)}
                        className={cn(
                          "p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between text-left select-none",
                          isSelected
                            ? "bg-white border-emerald-600 shadow-[0_12px_28px_rgba(16,185,129,0.06)] scale-[1.01]"
                            : "bg-white/45 border-slate-200/50 hover:border-slate-300 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)]"
                        )}
                      >
                        {/* Selected Indicator inside Top */}
                        <div className="absolute top-4.5 right-4.5">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300",
                            isSelected
                              ? "bg-emerald-600 border-emerald-600 text-white scale-110"
                              : "border-slate-300 bg-white"
                          )}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3.5]" />}
                          </div>
                        </div>

                        {/* Top layout */}
                        <div className="space-y-3.5">
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", item.color)}>
                            <IconComp className="w-5 h-5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-black text-slate-850 tracking-tight leading-snug">
                                {item.label}
                              </h3>
                              <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-1.5 py-0.2 rounded shrink-0 scale-90">
                                {item.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        {/* Bottom colored border accent on active selection */}
                        {isSelected && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-600" />
                        )}

                      </div>
                    );
                  })}
                </div>

                {/* News Subscription Banner Counts */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400 text-[11px] font-semibold">
                    * 订阅后可在主应用「资讯纵横」看板中随时取消或变更主题配置。
                  </span>

                  <span className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-bold border transition-colors",
                    selectedNews.length > 0 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-150"
                      : "bg-slate-50 text-slate-400 border-slate-200"
                  )}>
                    已选择：{selectedNews.length} 门情报源
                  </span>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Modal Wizard Navigation Actions Footer (Apple-style pill actions) */}
        <footer className="px-8 lg:px-12 py-5 bg-slate-50/50 backdrop-blur border-t border-slate-100/40 shrink-0 relative z-20 flex items-center justify-between">
          <div>
            {step === 2 && (
              <button
                type="button"
                onClick={handleBack}
                className="text-xs text-slate-500 hover:text-slate-800 font-extrabold flex items-center gap-1.5 py-2.5 px-4 hover:bg-slate-100 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>上一步：配置核心领域</span>
              </button>
            )}
            {step === 1 && (
              <p className="text-[10px] text-slate-400 font-bold select-none">
                博创园 100% 保护企业商业机密 · 256 位 SSL 链路传输保护
              </p>
            )}
          </div>

          <div>
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0045c4] hover:bg-blue-700 text-white font-extrabold text-xs px-8 py-3 rounded-2xl transition-all duration-300 active:scale-95 shadow-md shadow-blue-500/10 hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>下一步：筛选感兴趣资讯</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-10 py-3 rounded-2xl transition-all duration-300 active:scale-95 shadow-md shadow-emerald-500/10 hover:shadow-lg flex items-center gap-2 cursor-pointer animate-in fade-in"
              >
                <span>开启智能博创之旅</span>
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </footer>

      </motion.div>

    </div>
  );
};

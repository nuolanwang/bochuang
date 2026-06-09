import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Sparkles, Brain, Target, Shield, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { PersonalityRadar } from './PersonalityRadar';

interface Question {
  id: number;
  text: string;
  options: { text: string; value: string; weight: Record<string, number> }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "面对核心技术难题被竞争对手率先突破时，您的第一反应是？",
    options: [
      { text: "立即组织团队进行技术复盘，寻找差异化切入点", value: "A", weight: { strategy: 10, execution: 5 } },
      { text: "寻找法律途径保护专利，通过诉讼争取时间", value: "B", weight: { logic: 10, risk: 5 } },
      { text: "快速跟进并实现功能超越，发起价格战抢夺存量", value: "C", weight: { execution: 10, intuition: 5 } }
    ]
  },
  {
    id: 2,
    text: "在公司融资关键期，大客户突然要求大幅降价，否则撤资，您会？",
    options: [
      { text: "坚持价值定价，哪怕融资失败也要保护商业模式", value: "A", weight: { vision: 10, risk: 5 } },
      { text: "与其深度绑定，通过资源置换抵消降价损失", value: "B", weight: { logic: 10, strategy: 5 } },
      { text: "暂时妥协以保住估值，融资到账后再调整策略", value: "C", weight: { intuition: 10, execution: 5 } }
    ]
  },
  {
    id: 3,
    text: "团队内部对产品方向产生严重分歧，且双方皆有理有据？",
    options: [
      { text: "采用 AB 测试，由数据决定最终胜负", value: "A", weight: { logic: 10, execution: 5 } },
      { text: "作为创始人乾纲独断，承担全部决策后果", value: "B", weight: { vision: 10, risk: 5 } },
      { text: "寻找更权威的外部顾问进行第三方评估", value: "C", weight: { intuition: 5, strategy: 5 } }
    ]
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'intro' | 'result';
}

export const AssessmentModal: React.FC<Props> = ({ isOpen, onClose, initialStep = 'intro' }) => {
  const [step, setStep] = useState<'intro' | 'testing' | 'loading' | 'result'>(initialStep);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setCurrentIdx(0);
      setAnswers([]);
    }
  }, [isOpen, initialStep]);

  useEffect(() => {
    if (step === 'testing') {
      setProgress(((currentIdx) / QUESTIONS.length) * 100);
    }
  }, [currentIdx, step]);

  const handleNext = (value: string) => {
    const nextAnswers = [...answers, value];
    setAnswers(nextAnswers);
    
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setStep('loading');
      setTimeout(() => setStep('result'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div
        layoutId="assessment-modal"
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
        style={{ height: '600px' }}
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {step === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20 rotate-12">
               <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">AI 深度创业人格测评 v4.0</h2>
            <p className="text-slate-500 max-w-md leading-relaxed mb-12">
              通过 12 个维度的深度逻辑驱动分析，穿透表象，揭秘您作为潜在创业者的思维模型与能力边界。
            </p>
            <button 
              onClick={() => setStep('testing')}
              className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 group flex items-center gap-2"
            >
              开始深度测评
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {step === 'testing' && (
          <div className="flex-1 flex flex-col pt-12">
            <div className="px-12 mb-12">
              <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                />
              </div>
              <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                <span>Phase {currentIdx + 1}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>

            <div className="flex-1 px-12 relative overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentIdx}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40, x: -20, rotate: -5, scale: 1.05 }}
                  transition={{ 
                    type: 'spring', 
                    damping: 20, 
                    stiffness: 150 
                  }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                    {QUESTIONS[currentIdx].text}
                  </h3>
                  <div className="space-y-4">
                    {QUESTIONS[currentIdx].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleNext(option.value)}
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-white hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-sm font-bold text-slate-600 group flex items-center justify-between"
                      >
                        {option.text}
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-blue-600 group-hover:bg-blue-600 transition-all flex items-center justify-center">
                           <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-8">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-600 rounded-full blur-3xl"
              />
              <div className="relative w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                 <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">AI 神经元建模中...</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              正在穿透表象，分析您的潜在思维模型
            </p>
          </div>
        )}

        {step === 'result' && (
          <div className="flex-1 overflow-y-auto p-12 pt-16">
            <div className="flex flex-col items-center text-center mb-12">
               <div className="px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20 mb-6">
                  Core Identity
               </div>
               <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">战略型潜伏者</h2>
               <p className="text-sm font-bold text-slate-400 italic">"逻辑严密的执行机器，拥有极强的市场敏感度"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center h-[300px]">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Digitial Modeling</div>
                  <PersonalityRadar data={[
                    { subject: 'Strategy', value: 95 },
                    { subject: 'Execution', value: 88 },
                    { subject: 'Vision', value: 72 },
                    { subject: 'Risk', value: 65 },
                    { subject: 'Logic', value: 92 },
                    { subject: 'Intuition', value: 80 }
                  ]} />
               </div>
               <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Insight</div>
                  {[
                    { icon: Target, label: "精准打击", color: "blue", desc: "您倾向于在数据支撑下发起精准的竞对压制。" },
                    { icon: Shield, label: "合规防御", color: "emerald", desc: "极强的风险控制意识，但在早期可能错失机会。" },
                    { icon: Zap, label: "极致执行", color: "amber", desc: "团队意志的直接投射，没有任何冗余动作。" }
                  ].map((insight, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-start gap-4">
                       <div className={cn("mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0", 
                          insight.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                          insight.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       )}>
                          <insight.icon className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">{insight.label}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{insight.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    黄金建议 (Golden Rule)
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
                    目前您的“风险意识”得分极高，但在扩张阶段建议引入一名具备“野蛮生长感”的联创，以对冲您的过度理性，博取更高的上限。
                  </p>
                  <button 
                    onClick={() => {
                      setStep('intro');
                      setCurrentIdx(0);
                      setAnswers([]);
                    }}
                    className="px-6 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    重新生成测评
                  </button>
               </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

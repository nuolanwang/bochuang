import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Sparkles, 
  RefreshCw, 
  X, 
  ChevronRight,
  TrendingUp,
  Award,
  Milestone,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import CircularGallery from './CircularGallery';
import { TimelineEvent } from '../types';

interface PersonalGrowthTrajectoryProps {
  timelineEvents: TimelineEvent[];
  onStartAssessment: () => void;
}

export const PersonalGrowthTrajectory: React.FC<PersonalGrowthTrajectoryProps> = ({
  timelineEvents,
  onStartAssessment
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Generate 10 items for the gallery
  const galleryItems = Array.from({ length: 10 }).map((_, idx) => {
    const event = timelineEvents[idx % timelineEvents.length];
    return {
      id: `ev-${idx}`,
      title: event.title,
      date: event.date,
      description: event.description,
      image: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&q=50&grayscale=true`,
      text: event.title
    };
  });

  return (
    <div id="personal-growth-trajectory" className="space-y-8 animate-fade-in">
      {/* Module Title / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/40 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">个人成长轨迹</h1>
          </div>
          <p className="text-xs text-slate-550 pl-11 font-medium">
            全生命周期在硬科技与创新赛道上所累积的业务资质、高光历程及AI综合能力评判模型
          </p>
        </div>

        <div className="flex items-center gap-3 pl-11 md:pl-0">
          <button 
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-650 hover:text-blue-600 font-bold text-xs transition-all shadow-sm group cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all shrink-0" />
            <span>全景全息视图</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Match User screenshot precisely with layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline Part (Left) - styled precisely to fit screen density */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">成长历程</h2>
              <p className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
                核心高光里程碑与业务轨迹记录
              </p>
            </div>
            <span className="text-xs font-black text-blue-600 bg-blue-50 rounded-full px-3 py-1">
              第 3 阶段主线
            </span>
          </div>
          
          <div className="relative space-y-10 pl-6 border-l-2 border-slate-100/80">
            {timelineEvents.map((event, idx) => (
              <div key={event.id} className="relative group">
                <div className={cn(
                  "absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-md z-15 transition-all duration-300 group-hover:scale-130",
                  idx === 0 ? "bg-blue-600 ring-4 ring-blue-105" : idx === 1 ? "bg-amber-400 ring-4 ring-amber-105" : "bg-indigo-600 ring-4 ring-indigo-105"
                )} />
                <div className="space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-transparent hover:border-slate-200/80 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all cursor-default">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-350" />
                      {event.date}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-black tracking-wide uppercase",
                      event.type === 'award' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                      event.type === 'certificate' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    )}>
                      {event.type === 'award' ? "荣誉奖项" : event.type === 'certificate' ? "认定资质" : "核心里程碑"}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Card (Right) - Shrunk Assessment Card matching Tencent/Byte styling */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden self-stretch min-h-[480px]">
          {/* Subtle light flares */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/10 rounded-full blur-[70px] pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse fill-blue-400" />
                <h4 className="text-sm font-black tracking-tight text-white">系统评测结果</h4>
              </div>
              <span className="text-xs bg-blue-500/25 text-blue-300 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-400/10">
                AI 智能研判
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4.5 space-y-1.5">
                <p className="text-xs font-black text-blue-300 uppercase tracking-widest leading-none">综合评估结论</p>
                <p className="text-xs font-bold text-slate-205 leading-relaxed pt-1 select-none">
                  业务核心技术实力雄厚，具备顶尖的 AI 数据工程落地可能，未来在材料库的支撑下直通度极佳。
                </p>
              </div>

              {/* Metric Progress Bars - beautifully formatted */}
              <div className="space-y-4 pt-2">
                {[
                  { name: '创新开发能力', val: 92, color: 'bg-blue-400' },
                  { name: '商业落地效能', val: 78, color: 'bg-amber-400' },
                  { name: '资本投向契合度', val: 85, color: 'bg-emerald-400' },
                ].map((bar) => (
                  <div key={bar.name} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300 select-none">
                      <span>{bar.name}</span>
                      <span className="text-white font-black">{bar.val}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-500", bar.color)} style={{ width: `${bar.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10 border-t border-white/5 mt-auto">
            <button 
              onClick={onStartAssessment}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs hover:scale-101 active:scale-98 transition-all shadow-md shadow-blue-900/40 cursor-pointer border-none outline-none"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow shrink-0" />
              <span>重新评测与匹配检测</span>
            </button>
            <span className="text-xs text-slate-400 font-bold block text-center mt-3 select-none">
              上次对标校准完成：刚刚
            </span>
          </div>
        </div>
      </div>

      {/* Trajectory Timeline Panorama Preview Modal */}
      <AnimatePresence>
        {showGallery && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 overflow-hidden select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-6xl h-full max-h-[85vh] bg-slate-950/80 border border-white/10 rounded-[2.5rem] relative overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Top ambient lights */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full" />
              </div>
              
              {/* Close button */}
              <button 
                onClick={() => setShowGallery(false)}
                className="absolute top-8 right-8 w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all z-50 group cursor-pointer active:scale-90"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Title Section */}
              <div className="absolute top-8 left-8 md:top-10 md:left-10 z-20">
                <h2 className="text-white text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                  <span className="p-1.5 bg-blue-500/25 text-blue-400 rounded-lg">
                    <Layers className="w-5 h-5" />
                  </span>
                  成长全景全息预览
                </h2>
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] mt-1.5 pl-0.5">
                  GROWTH TRAJECTORY PANORAMA PREVIEW
                </p>
              </div>

              {/* Circular Gallery Container */}
              <div className="flex-1 w-full relative flex items-center justify-center pt-24 pb-8">
                <div className="w-full h-full relative">
                  <CircularGallery 
                    items={galleryItems}
                    bend={1}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    scrollSpeed={2}
                    scrollEase={0.1}
                    onScroll={setScrollProgress}
                  />
                </div>
              </div>

              {/* Curve Timeline Navigation path at bottom of preview */}
              <div className="w-full max-w-5xl mx-auto px-8 md:px-20 pb-8 shrink-0">
                <div className="relative h-20">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path 
                      d="M 50 80 Q 500 20 950 80" 
                      fill="none" 
                      stroke="rgba(59, 130, 246, 0.2)" 
                      strokeWidth="1.5" 
                    />
                    
                    {galleryItems.map((item, idx) => {
                      const total = galleryItems.length;
                      const normalizedProgress = ((scrollProgress % 1) + 1) % 1;
                      let t = (idx / total - normalizedProgress);
                      
                      if (t < -0.5) t += 1;
                      if (t > 0.5) t -= 1;
                      
                      const curveT = t + 0.5;
                      const x = 50 + curveT * 900;
                      const y = 80 * (1-curveT)**2 + 20 * 2 * (1-curveT) * curveT + 80 * curveT**2;
                      
                      const distFromCenter = Math.abs(t);
                      const focusIntensity = Math.max(0, 1 - distFromCenter / 0.12);
                      const isActive = distFromCenter < 0.035;

                      return (
                        <g key={item.id}>
                          <AnimatePresence>
                            {isActive && (
                              <motion.circle
                                initial={{ r: 6, opacity: 0.5 }}
                                animate={{ r: 24, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                cx={x} cy={y}
                                fill="#3b82f6"
                              />
                            )}
                          </AnimatePresence>

                          <motion.circle 
                            animate={{ 
                              r: isActive ? 10 : 4, 
                              fill: isActive ? "#1e40af" : "#3b82f6", 
                              stroke: isActive ? "#60a5fa" : "rgba(255,255,255,0.1)",
                              strokeWidth: isActive ? 2.5 : 0,
                              opacity: 0.4 + focusIntensity * 0.6 
                            }} 
                            cx={x} cy={y} 
                          />

                          <motion.g
                            animate={{ 
                              y: isActive ? y + 36 : y + 28, 
                              opacity: focusIntensity, 
                              scale: isActive ? 1.15 : 1 
                            }}
                          >
                            <text 
                              x={x} 
                              textAnchor="middle" 
                              fill={isActive ? "#60a5fa" : "rgba(255,255,255,0.4)"}
                              className="text-[9px] font-black uppercase tracking-wider select-none pointer-events-none"
                            >
                              {item.date}
                            </text>
                          </motion.g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

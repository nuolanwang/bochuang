import React from 'react';
import { Mail, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface UserProfileBannerProps {
  activeTab: 'profile' | 'growth';
  onTabChange: (tab: 'profile' | 'growth') => void;
  onNotificationsClick?: () => void;
  onCollectionsClick?: () => void;
  onCompleteProfileClick?: () => void;
  onViewAssessmentResultClick?: () => void;
  onSyncProfileClick?: () => void;
  activeView: string;
}

export const UserProfileBanner: React.FC<UserProfileBannerProps> = ({
  activeTab,
  onTabChange,
  onNotificationsClick,
  onCompleteProfileClick,
  onViewAssessmentResultClick,
  onSyncProfileClick,
  activeView
}) => {
  // Add interactive state for equipping the achievement badge dynamically
  const [isEquipped, setIsEquipped] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-slate-900/5 border border-slate-100 relative flex flex-col xl:flex-row items-center justify-between gap-6"
    >
      {/* Left section: Avatar, Username with integrated "人才大佬" medal badge, Senior Partner status */}
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full xl:w-auto">
        {/* Profile Avatar with double-ring drop shadow */}
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md group-hover:bg-blue-500/20 transition-all" />
          <div className="relative w-20 h-20 sm:w-[84px] sm:h-[84px] rounded-full bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0045c4] to-[#0A66FF] flex items-center justify-center text-white font-black text-xl select-none">
              张
            </div>
          </div>
        </div>

        {/* Name, ID & Medal称号 */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">张嘉诚</h1>
              {/* Premium Medal Achievement Badge Next to the name with elegant and high-contrast text layout */}
              <AnimatePresence>
                {isEquipped && (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500 font-bold text-white rounded-md shadow-sm shadow-amber-500/20 text-[11px] select-none cursor-default shrink-0"
                    style={{ border: '1px solid rgba(251, 191, 36, 0.5)' }}
                  >
                    <span>🏅</span> 
                    <span className="font-extrabold tracking-wide">人才大佬</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start flex-wrap">
            <p className="text-xs text-slate-400 font-bold select-none">
              ID: NEX-8829-2024
            </p>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500 animate-pulse" />
                <span>发现新路径！已获得“人才大佬”称号</span>
              </span>
              <button 
                onClick={() => setIsEquipped(!isEquipped)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer select-none",
                  isEquipped 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-500/10" 
                    : "bg-slate-900 hover:bg-[#0045c4] text-white"
                )}
              >
                {isEquipped ? (
                  <>
                    <span>已佩戴</span>
                    <span className="text-[10px] font-black">✓</span>
                  </>
                ) : (
                  <>
                    <span>佩戴</span>
                    <span className="text-[8px] animate-pulse">➔</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right section: Overflow Sticker BPTI Owl Card */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto shrink-0 justify-center">
        {/* Tilted Sticker BPTI Owl Card - Sticking out/halfway visible from the banner boundary on desktop */}
        <div 
          className={cn(
            "relative text-left select-none group flex flex-col",
            "bg-gradient-to-b from-sky-100/95 via-sky-50/50 to-white",
            "border border-sky-200/80 rounded-2xl p-3.5 w-[220px] shadow-sm",
            "duration-300 ease-out transition-all overflow-hidden shrink-0",
            // Desktop: absolute, overlapping, tilted, sticking out
            "md:absolute md:-top-14 md:right-8 md:z-20 md:transform md:rotate-4 md:hover:rotate-0 md:hover:scale-[1.03] md:shadow-md",
            // Mobile: relative flow layout, small tilt
            "transform rotate-1 hover:rotate-0 hover:scale-[1.02] mx-auto mt-4 sm:mt-0"
          )}
        >
          {/* Twinkling Star Background Accents */}
          <div className="absolute top-2 right-12 text-[10px] text-sky-400 select-none animate-pulse">★</div>
          <div className="absolute bottom-3 left-4 text-[8px] text-sky-300 select-none animate-bounce">★</div>
          <div className="absolute top-6 left-2 text-[11px] text-sky-400/60 select-none">★</div>

          {/* Header: Tag and Twinkle Row */}
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[10px] font-black bg-sky-500/10 text-sky-600 px-2 py-0.5 rounded-full tracking-wider scale-90 -origin-left">
              BPTI
            </span>
            <div className="flex items-center gap-0.5 text-[8px] text-amber-400/80 animate-pulse">
              <span>★</span><span>★</span>
            </div>
          </div>

          {/* Inner Content: Left Text & Right Cute Vector Owl */}
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-black text-slate-800 tracking-tight leading-tight">
                你的商业人格是什么？
              </h4>
              <p className="text-[9px] text-slate-400 font-bold block leading-relaxed shrink-0">
                发现天赋风格 · 5分钟
              </p>
            </div>

            {/* Vector mascot: Adorable Baby Owl representing Image 1 */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <div className="relative w-10 h-10 bg-white rounded-t-full rounded-b-2xl shadow-md border border-sky-100 flex flex-col items-center justify-center transition-transform group-hover:scale-105 duration-300">
                {/* Ears/Tufts */}
                <div className="absolute -top-0.5 left-1.5 w-2 h-2 bg-white border-t border-l border-sky-100 rounded-tl-full transform -rotate-12" />
                <div className="absolute -top-0.5 right-1.5 w-2 h-2 bg-white border-t border-r border-sky-100 rounded-tr-full transform rotate-12" />
                
                {/* Sky-Blue Wings */}
                <div className="absolute -left-1 top-3.5 w-2.5 h-4.5 bg-sky-400 rounded-full transform -rotate-12 group-hover:-rotate-30 transition-transform" />
                <div className="absolute -right-1 top-3.5 w-2.5 h-4.5 bg-sky-400 rounded-full transform rotate-12 group-hover:rotate-30 transition-transform" />

                {/* Big shiny round eyes */}
                <div className="flex gap-1 mt-1 z-10">
                  <div className="w-3.5 h-3.5 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100 relative shadow-sm">
                    <div className="w-2.5 h-2.5 bg-slate-900 rounded-full flex items-center justify-center relative">
                      <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="w-3.5 h-3.5 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100 relative shadow-sm">
                    <div className="w-2.5 h-2.5 bg-slate-900 rounded-full flex items-center justify-center relative">
                      <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Beak */}
                <div className="w-1.5 h-2 bg-amber-500 rounded-b-full mt-0.5 z-10" />
              </div>
            </div>
          </div>

          {/* Bottom Button Action: 2 separate premium buttons */}
          <div className="w-full mt-3 flex items-center gap-2">
            <button
              onClick={onCompleteProfileClick}
              className="flex-1 py-1 px-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-0.5 cursor-pointer shadow-sm active:scale-95 border-none outline-none"
            >
              <span>测一测</span>
              <ArrowRight className="w-2.5 h-2.5 shrink-0" />
            </button>
            <button
              onClick={onViewAssessmentResultClick}
              className="flex-1 py-1 px-1 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-0.5 cursor-pointer shadow-2xs active:scale-95 outline-none"
            >
              <span>查看结果</span>
              <Eye className="w-2.5 h-2.5 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* Space reserving placeholder so that the notifications card is positioned beautifully next to it */}
        <div className="hidden xl:block w-[220px] h-2 bg-transparent shrink-0" />
      </div>
    </motion.div>
  );
};

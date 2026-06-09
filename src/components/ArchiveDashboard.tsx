import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  TrendingUp, 
  Search, 
  Plus, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Zap,
  Layout,
  BookOpen,
  PieChart,
  Download,
  Trash2,
  MoreVertical,
  Briefcase,
  Upload,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Eye,
  X,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Link,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GrowthTimeline } from './GrowthTimeline';
import { GrowthAnalytics } from './GrowthAnalytics';
import { PersonalityRadar } from './PersonalityRadar';
import CircularGallery from './CircularGallery';
import { TimelineEvent, GrowthDataPoint, PersonalityData } from '../types';

const COMPETITIONS = [
  {
    id: 1,
    title: "全国创新创业大赛 2024",
    tagline: "报名进行中",
    description: "汇聚全国顶尖创新力量，为创业者提供展示舞台、资本对接与顶尖导师资源。总奖金池高达 ¥ 500万。",
    deadline: "2024.03.15",
    location: "北京 · 中国",
    reward: "500",
    rewardUnit: "万",
    image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=1400"
  },
  {
    id: 2,
    title: "全球 AI 挑战赛 2024",
    tagline: "火热筹备中",
    description: "探索人工智能的极限，挑战最前沿的算法难题。与全球顶尖开发者同台竞技，赢取丰厚奖金与硅谷交流机会。",
    deadline: "2024.05.20",
    location: "上海 · 中国",
    reward: "800",
    rewardUnit: "万",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1400"
  },
  {
    id: 3,
    title: "未来城市建构大赛",
    tagline: "作品征集中",
    description: "重新构想我们的居住空间。关注可持续发展、智慧建筑与人文关怀，为未来的城市生活提供创新的设计方案。",
    deadline: "2024.06.10",
    location: "深圳 · 中国",
    reward: "300",
    rewardUnit: "万",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1400"
  }
];

const sliderVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
};

interface Props {
  timelineEvents: TimelineEvent[];
  growthData: GrowthDataPoint[];
  personalityData: PersonalityData[];
  onStartAssessment: () => void;
  onRegisterCompetition?: () => void;
  onGoToBPEdit?: () => void;
  onGoToIntelligenceStation?: (category?: string) => void;
  activeHeaderTab?: 'profile' | 'growth';
}

export const ArchiveDashboard: React.FC<Props> = ({ 
  timelineEvents, 
  growthData, 
  personalityData,
  onStartAssessment,
  onRegisterCompetition,
  onGoToBPEdit,
  onGoToIntelligenceStation,
  activeHeaderTab
}) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'assessment'>('growth');
  const [intelTab, setIntelTab] = useState<'all' | 'investment' | 'policy' | 'industry' | 'competitions'>('all');

  useEffect(() => {
    if (activeHeaderTab === 'profile') {
      setActiveTab('assessment');
    } else if (activeHeaderTab === 'growth') {
      setActiveTab('growth');
    }
  }, [activeHeaderTab]);
  const [documentFilter, setDocumentFilter] = useState('全部');
  const [showGallery, setShowGallery] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [[compPage, compDirection], setCompPage] = useState([0, 0]);
  const [isCompHovered, setIsCompHovered] = useState(false);
  const compTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCompIndex = Math.abs(compPage % COMPETITIONS.length);

  const paginateComp = useCallback((newDirection: number) => {
    setCompPage([compPage + newDirection, newDirection]);
  }, [compPage]);

  const goToCompSlide = (index: number) => {
    const newDirection = index > currentCompIndex ? 1 : -1;
    setCompPage([index, newDirection]);
  };

  useEffect(() => {
    if (!isCompHovered) {
      compTimerRef.current = setInterval(() => {
        paginateComp(1);
      }, 5000);
    }
    return () => {
      if (compTimerRef.current) clearInterval(compTimerRef.current);
    };
  }, [isCompHovered, paginateComp]);

  const currentComp = COMPETITIONS[currentCompIndex];

  const [members, setMembers] = useState([
    { id: '1', name: '王发', role: '创建人', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop' },
    { id: '2', name: '陆小凤', role: '协作员', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop' },
    { id: '3', name: '司空摘星', role: '协作员', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop' },
  ]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('https://bochuang.com/bp/share/129381');
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  // Generate 10 items for the gallery
  const galleryItems = Array.from({ length: 10 }).map((_, idx) => {
    const event = timelineEvents[idx % timelineEvents.length];
    return {
      id: `ev-${idx}`,
      title: event.title,
      date: event.date,
      description: event.description,
      image: `https://picsum.photos/seed/tech-${idx}/800/600?grayscale`,
      text: event.title
    };
  });

  const initialCategories = [
    { 
      id: 'industry', 
      title: '行业前沿', 
      desc: 'AI与城市建模最新动态', 
      icon: <Zap className="w-8 h-8" />, 
      color: 'indigo', 
      badge: '5条新见解',
      bgIcon: <Zap className="w-48 h-48" />
    },
    { 
      id: 'investment', 
      title: '投资机会', 
      desc: '全网创投资资本实时追踪', 
      icon: <TrendingUp className="w-8 h-8" />, 
      color: 'emerald', 
      badge: '2条新匹配',
      bgIcon: <TrendingUp className="w-48 h-48" />
    },
    { 
      id: 'policy', 
      title: '政策解读', 
      desc: '政策专案中心', 
      icon: <FileText className="w-8 h-8" />, 
      color: 'white', 
      badge: '本月更新',
      avtars: [1, 2, 3]
    },
    { 
      id: 'thinktank', 
      title: '智库动态', 
      desc: '全球顶尖智库报告分析', 
      icon: <BookOpen className="w-8 h-8" />, 
      color: 'slate', 
      badge: '新增3份'
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
        const { scrollLeft } = scrollRef.current;
        const scrollTo = direction === 'left' ? scrollLeft - 400 : scrollLeft + 400;
        scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const docCategories = ['全部', '学术论文', '专利技术', '荣誉奖项', '资质证件'];

  const mockDocuments = [
    { title: '深度学习图像识别技术综述报告', size: '2.3 MB', category: '学术论文', date: '2025.03.01', status: '已发表' },
    { title: '基于AI的分布式计算架构设计方案', size: '1.8 MB', category: '学术论文', date: '2024.11.15', status: '实审中' },
    { title: '多模态融合的智慧城市交通感知研究', size: '3.1 MB', category: '学术论文', date: '2024.07.22', status: '已发表' },
    { title: '新型深度学习模型训练效率优化专利申请', size: '0.9 MB', category: '专利技术', date: '2023.08.10', status: '实审中' },
    { title: '全国大学生创业大赛金奖荣誉证书', size: '1.2 MB', category: '荣誉奖项', date: '2023.11.20', status: '有效' },
    { title: '个人有效身份证件扫描件', size: '0.5 MB', category: '资质证件', date: '2020.01.01', status: '有效', showActions: true },
    { title: '中国护照扫描件', size: '0.4 MB', category: '资质证件', date: '2019.06.15', status: '有效' },
    { title: '单样本识别下的对比学习性能提升研究', size: '2.7 MB', category: '学术论文', date: '2024.04.10', status: '已发表' },
  ];

  const filteredDocuments = mockDocuments.filter(doc => 
    documentFilter === '全部' || doc.category === documentFilter
  );

  return (
    <div className="space-y-10 pb-20 relative">
      <AnimatePresence>
        {showCopySuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-4 left-1/2 z-[1000] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            共享链接已复制
          </motion.div>
        )}
      </AnimatePresence>


      {/* 3. Core Intelligence Station */}
      <section className="space-y-8 bg-slate-50/40 p-8 rounded-[3rem] border border-slate-100/80 shadow-inner">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
          <div className="space-y-2">
             <h2 className="text-3xl font-black text-slate-800 tracking-tight">精选推荐 · 核心情报站</h2>
          </div>
          
          <div className="self-start lg:self-center shrink-0">
             <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50/60 border border-indigo-100 rounded-full text-[11px] font-black text-indigo-600 uppercase tracking-wider shadow-sm">
               <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500 fill-indigo-100" />
               <span>智能引擎精准配对</span>
             </div>
          </div>
        </div>

        {/* Horizontal Navigation channel pill buttons (aligned with Image screenshot) */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-2 rounded-[24px] border border-slate-200/50">
          {[
            { id: 'all', title: '最新动态', icon: <Clock className="w-4 h-4" /> },
            { id: 'investment', title: '投资机会', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'policy', title: '政策解读', icon: <FileText className="w-4 h-4" /> },
            { id: 'industry', title: '行业前沿', icon: <Zap className="w-4 h-4" /> },
            { id: 'competitions', title: '推荐赛事', icon: <Trophy className="w-4 h-4" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setIntelTab(item.id as any)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all cursor-pointer border",
                intelTab === item.id
                  ? "bg-white text-slate-950 border-slate-200 shadow-md scale-102 font-black"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Tab content renderer panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={intelTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {intelTab !== 'competitions' ? (
              /* Custom list design that matches user's screenshot details */
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden divide-y divide-slate-100/85">
                {[
                  {
                    id: 'dt-1',
                    title: '数字经济算力基础设施普惠申领与补贴指南发布符合申报资质',
                    category: 'policy',
                    categoryName: '政策解读',
                    matchScore: 95,
                    infoSource: '政务公开办 · 数据与工业信息化系统公告',
                    reason: '您的数字孪生与实空间建模高新技术草案在专利指标上对标吻合度极佳，可申请算力免申优惠。',
                    actionLabel: '一键申领普惠权',
                    actionCategory: 'policy'
                  },
                  {
                    id: 'dt-2',
                    title: '红杉数智未来探索专项成长基金开放本季度投资申报渠道',
                    category: 'investment',
                    categoryName: '投资机会',
                    matchScore: 88,
                    infoSource: '红杉中国 Sequoia Capital 早期投融资网络部',
                    reason: '红杉正在寻找拥有核心算法及落地订单的硬科技。您的大赛草案符合其Pre-A至B轮主要范围。',
                    actionLabel: '分析匹配偏好',
                    actionCategory: 'investment'
                  },
                  {
                    id: 'dt-3',
                    title: '麦肯锡：2026年全球智能体（AI Agent）软件订阅模式迎来爆发期',
                    category: 'industry',
                    categoryName: '行业前沿',
                    matchScore: 82,
                    infoSource: '麦肯锡技术展望 McKinsey Global Tech Insights',
                    reason: '全球Gartner与麦肯锡最新科技前沿指出，80%的企业配合自动化采购结算，可在材料中融合说明。',
                    actionLabel: '缓存智库报告',
                    actionCategory: 'thinktank'
                  },
                  {
                    id: 'dt-4',
                    title: '全国创新创业高规格科创大赛截止申报通告',
                    category: 'competitions',
                    categoryName: '推荐赛事',
                    matchScore: 91,
                    infoSource: '科技部创新创业发展司赛事发布处',
                    reason: '历届金奖得主可获得高达 500 万发展补贴并获取核心示范区入驻，目前通道倒计时开放。',
                    actionLabel: '立即报名赛事',
                    actionCategory: 'competitions'
                  },
                  {
                    id: 'inv-1',
                    title: '真格未来之星早期种子培育专项：高校极客与硬核算法组',
                    category: 'investment',
                    categoryName: '投资机会',
                    matchScore: 86,
                    infoSource: '真格基金 (ZhenFund) 全球极客发现通道',
                    reason: '该种子计划偏好小样本高算力开发原型，主力额度 150万 - 500万 极速下发，契合初创阶段。',
                    actionLabel: '对标早期匹配',
                    actionCategory: 'investment'
                  },
                  {
                    id: 'pol-1',
                    title: '《促进大模型底座在专精特新企业中重叠发展的税收支持政策》',
                    category: 'policy',
                    categoryName: '政策解读',
                    matchScore: 80,
                    infoSource: '国家税务总局、科技部高科技认定联合宣讲文件',
                    reason: '拥有至少1项算法软著、上年度研发投入总额占比10%的企业，享受最高200%研发费用加计全损扣除。',
                    actionLabel: '核算税费减免',
                    actionCategory: 'policy'
                  }
                ]
                .filter(item => intelTab === 'all' || item.category === intelTab)
                .map((row) => (
                  <div key={row.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/40 transition-colors group">
                    <div className="flex items-start gap-5">
                      {/* Category Badge Icon instead of Picture */}
                      <div className="relative shrink-0">
                        <div className={cn(
                          "w-12 h-12 rounded-full border flex items-center justify-center shadow-xs",
                          row.category === 'policy' ? "bg-blue-50 border-blue-100 text-[#0045c4]" :
                          row.category === 'investment' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                          row.category === 'industry' ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
                          "bg-amber-50 border-amber-100 text-amber-600"
                        )}>
                          {row.category === 'policy' ? <FileText className="w-5 h-5" /> :
                           row.category === 'investment' ? <TrendingUp className="w-5 h-5" /> :
                           row.category === 'industry' ? <Zap className="w-5 h-5" /> :
                           <Trophy className="w-5 h-5" />}
                        </div>
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>

                      {/* Content Info */}
                      <div className="space-y-1.5 flex-1 select-none">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                            row.category === 'investment' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            row.category === 'policy' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                            row.category === 'industry' ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                          )}>
                            {row.categoryName}
                          </span>
                          
                          {/* Highlighting 80%+ Matching Metrics */}
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse fill-current" />
                            {row.matchScore}% 匹配度
                          </span>
                        </div>
                        
                        <h4 className="text-base font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                          {row.title}
                        </h4>
                        
                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-4xl">
                          {row.reason}
                        </p>
                        
                        {/* Information Source Badge layout */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 select-none">信息来源：</span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded font-black max-w-fit">
                            <span className="w-1 h-1 rounded-full bg-slate-400 animate-pulse" />
                            {row.infoSource}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons matching click targets */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => onGoToIntelligenceStation?.(row.actionCategory)}
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>{row.actionLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* recommended competitions grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[
                  {
                    id: 1,
                    title: "全国创新创业大赛 2024",
                    description: "汇聚全国顶尖创新力量，为创业者提供展示舞台、优厚红利与海量创投资本。总奖金池高达 ¥ 500万。",
                    deadline: "2024.03.15",
                    location: "北京 · 中国",
                    reward: "500",
                    rewardUnit: "万",
                    image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800",
                    status: "报名征集中",
                    color: "from-amber-500 to-orange-600"
                  },
                  {
                    id: 2,
                    title: "全球 AI 挑战赛 2024",
                    description: "探索多模态与神经训练极限，挑战前瞻性城市大脑算法课题。赢取丰厚奖金与硅谷交流推荐入场券。",
                    deadline: "2024.05.20",
                    location: "上海 · 中国",
                    reward: "800",
                    rewardUnit: "万",
                    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
                    status: "火热筹备中",
                    color: "from-blue-500 to-indigo-600"
                  },
                  {
                    id: 3,
                    title: "未来城市建构创新大赛",
                    description: "构想智慧数字绿能居住空间，重点专注NeRF建模及3D渲染降耗工艺。一等奖可直接挂靠试点实施合同。",
                    deadline: "2024.06.10",
                    location: "深圳 · 中国",
                    reward: "300",
                    rewardUnit: "万",
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
                    status: "作品选拔中",
                    color: "from-violet-500 to-purple-600"
                  },
                  {
                    id: 4,
                    title: "中国国际 “互联网+” 科创新星赛",
                    description: "聚焦AI Agent流程微循环自反馈与自主业务流接驳。全国高校及双创园区团队同台竞技。",
                    deadline: "2024.08.12",
                    location: "杭州 · 中国",
                    reward: "200",
                    rewardUnit: "万",
                    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
                    status: "作品征集中",
                    color: "from-emerald-500 to-teal-600"
                  }
                ].map((comp) => (
                  <motion.div
                    key={comp.id}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={onRegisterCompetition}
                    className="h-[380px] rounded-[32px] relative overflow-hidden group/card cursor-pointer flex flex-col justify-between p-8 bg-slate-950 text-white shadow-xl border border-slate-900"
                  >
                    {/* Background Slate with Dark Mesh Gradient Accent (No Image) */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 to-indigo-950">
                      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                    </div>

                    {/* Card Top section */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                        <Trophy className="w-5 h-5 text-amber-300 fill-current animate-pulse shrink-0" />
                      </div>
                      <div className="bg-brand-blue/90 border border-blue-400/20 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-white">
                        {comp.status}
                      </div>
                    </div>

                    {/* Card Middle info */}
                    <div className="relative z-10 space-y-2 mt-auto">
                      <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm self-start px-2 py-0.5 rounded-md text-[9px] text-amber-300 font-bold uppercase tracking-widest border border-amber-300/15">
                        最新推荐概率 90%
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-white leading-tight line-clamp-1">
                        {comp.title}
                      </h3>
                      <p className="text-xs text-white/55 line-clamp-3 leading-relaxed font-medium">
                        {comp.description}
                      </p>
                    </div>

                    {/* Card Bottom meta & triggers */}
                    <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <button
                        onClick={(e) => { e.stopPropagation(); if (onRegisterCompetition) onRegisterCompetition(); }}
                        className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-xl text-xs font-black hover:scale-105 transition-transform"
                      >
                        立即报名
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-white/40 font-bold">一等奖扶持</span>
                        <span className="text-sm font-black text-amber-300">¥ {comp.reward}万</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. Growth Section (Timeline & Compact Assessment Side-by-Side) */}
      <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Timeline Left */}
            <div className="lg:col-span-8 lg:border-r lg:border-slate-100 lg:pr-12">
               <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-slate-800 tracking-tight">成长历程</h2>
                     <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">个人在硬科技与创新赛道上所累积的业务轨迹与核心高光</p>
                  </div>
                  <button 
                    onClick={() => setShowGallery(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-[#0045c4] hover:bg-white transition-all shadow-sm group"
                  >
                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">全景预览</span>
                  </button>
               </div>
               
               <div className="relative space-y-10 pl-6 border-l-2 border-slate-100/60">
                  {timelineEvents.map((event, idx) => (
                    <div key={event.id} className="relative group">
                       <div className={cn(
                          "absolute -left-[31px] top-0 w-3 h-3 rounded-full border-2 border-white shadow-md z-10",
                          idx === 0 ? "bg-[#0045c4] ring-4 ring-blue-100" : idx === 1 ? "bg-amber-400" : "bg-blue-600"
                       )} />
                       <div className="space-y-4 bg-slate-50/50 p-6 rounded-[2rem] border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-default">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{event.date}</span>
                          <h4 className="font-bold text-slate-800 text-lg group-hover:text-[#0045c4] transition-colors">{event.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">{event.description}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Shrunk Assessment Card Right */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group/card self-stretch min-h-[460px]">
                {/* Background lighting flare */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none group-hover/card:bg-indigo-500/25 transition-colors" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

                <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse fill-current" />
                            <h4 className="text-base font-black tracking-tight text-white">系统评测结果</h4>
                        </div>
                        <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-400/20">
                          AI 智能研判
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">综合评估结论</p>
                            <p className="text-xs font-bold text-slate-200 leading-relaxed pt-1.5">
                              业务核心技术实力雄厚，具备顶尖的 AI 数据工程落地可能，未来在材料库的支撑下直通度极佳。
                            </p>
                        </div>

                        {/* Shrunk indicator metric progress bars */}
                        <div className="space-y-3 pt-2">
                            {[
                                { name: '创新开发', val: 92, color: 'bg-indigo-400' },
                                { name: '商业落地', val: 78, color: 'bg-amber-400' },
                                { name: '资本契合', val: 85, color: 'bg-emerald-400' },
                            ].map((bar) => (
                                <div key={bar.name} className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-300">
                                        <span>{bar.name}</span>
                                        <span className="text-white">{bar.val}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className={cn("h-full", bar.color)} style={{ width: `${bar.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-8 relative z-10 border-t border-white/5 mt-auto">
                    <button 
                        onClick={onStartAssessment}
                        className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-white text-indigo-950 font-black rounded-2xl text-xs hover:bg-indigo-55 transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>重新评测与匹配检测</span>
                    </button>
                    <span className="text-[9px] text-slate-400 font-bold block text-center mt-3">上次评测于：刚刚对标校准完成</span>
                </div>
            </div>
        </div>
      </section>

      {/* Growth Preview Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-3xl flex items-center justify-center p-8 overflow-hidden"
          >
            {/* Modal Container (Green Box Area) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-6xl h-full max-h-[85vh] bg-white/[0.01] border border-white/5 rounded-[3.5rem] backdrop-blur-[60px] relative overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Background Glows inside container */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full" />
              </div>
              
              {/* Close Button (Red Box area) */}
              <button 
                onClick={() => setShowGallery(false)}
                className="absolute top-10 right-10 w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all z-50 group active:scale-90"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Header Text */}
              <div className="absolute top-12 left-12 z-20">
                <h2 className="text-white text-3xl font-black tracking-tight">成长全景预览</h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mt-2">GROWTH PANORAMA PREVIEW</p>
              </div>

              {/* Circular Gallery */}
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

              {/* 时间轴 SVG */}
              <div className="w-full max-w-5xl mx-auto px-20 pb-10">
                <div className="relative h-24">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 100">
                    <path 
                      d="M 50 80 Q 500 20 950 80" 
                      fill="none" 
                      stroke="rgba(59, 130, 246, 0.2)" 
                      strokeWidth="1" 
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
                                initial={{ r: 8, opacity: 0.5 }}
                                animate={{ r: 30, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                cx={x} cy={y}
                                fill="#3b82f6"
                              />
                            )}
                          </AnimatePresence>

                          <motion.circle 
                            animate={{ 
                              r: isActive ? 12 : 5, 
                              fill: isActive ? "#1e40af" : "#3b82f6", 
                              stroke: isActive ? "#60a5fa" : "rgba(255,255,255,0.1)",
                              strokeWidth: isActive ? 3 : 0,
                              opacity: 0.4 + focusIntensity * 0.6 
                            }} 
                            cx={x} cy={y} 
                          />

                          <motion.g
                            animate={{ 
                              y: isActive ? y + 50 : y + 40, 
                              opacity: focusIntensity, 
                              scale: isActive ? 1.2 : 1 
                            }}
                          >
                            <motion.text 
                              x={x} 
                              textAnchor="middle" 
                              fill={isActive ? "#60a5fa" : "white"}
                              className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none transition-colors",
                                isActive ? "fill-blue-400" : "fill-white/40"
                              )}
                            >
                              {item.date}
                            </motion.text>
                          </motion.g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


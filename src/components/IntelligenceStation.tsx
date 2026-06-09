import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Trophy, 
  ChevronRight, 
  X,
  Search, 
  Filter, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award,
  DollarSign,
  User,
  ExternalLink,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Project } from '../types';

interface IntelligenceStationProps {
  projects?: Project[];
  onRegisterCompetition?: () => void;
  defaultChannel?: ChannelType;
}

type ChannelType = 'all' | 'industry' | 'investment' | 'policy' | 'thinktank' | 'competitions';

export const IntelligenceStation: React.FC<IntelligenceStationProps> = ({ 
  projects = [],
  onRegisterCompetition,
  defaultChannel
}) => {
  const [activeChannel, setActiveChannel] = useState<ChannelType>(defaultChannel || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Competition filters state
  const [compCategory, setCompCategory] = useState<string>('all');
  const [compRegion, setCompRegion] = useState<string>('all');
  const [compTime, setCompTime] = useState<string>('all');

  // Sync active channel if defaultChannel changes externally
  React.useEffect(() => {
    if (defaultChannel) {
      setActiveChannel(defaultChannel);
    }
  }, [defaultChannel]);
  
  // States for interactive components
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    type: string;
    title: string;
    content: any;
  } | null>(null);
  
  // Investor match evaluation state
  const [matchingProject, setMatchingProject] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  // Policy eligibility checker state
  const [eligibilityAnswers, setEligibilityAnswers] = useState({
    registeredTime: 'moreThan1',
    hasPatents: 'yes',
    teamSize: 'under50'
  });
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  // Mock Data
  const industryTrends = [
    {
      id: 'ind-1',
      title: '2026年城市数字孪生NeRF实景三维建模突破关键阈值',
      desc: '利用多模态视觉大模型加持的NeRF（神经辐射场）技术，在智慧城市建模中的单场景重建耗时从14小时缩短至12分钟，极具商用空间。',
      date: '2026-05-24',
      author: '科创研究院 · AI新视觉室',
      tag: '技术突破',
      impact: '★★★★★',
      fullStory: '传统的智慧城市三维建模成本高昂，周期极长。近日，顶级三维重建实验室发表最新框架，首次引入物理常识先验，大幅度减少渲染不确定性。业界预测，城市级渲染成本未来将压缩至现有的5%。该技术突破预示着面向数字孪生、交通仿真等方向的系统即将进入平民化普及期。'
    },
    {
      id: 'ind-2',
      title: '具身智能（Embodied AI）在大型园区安防巡检商用比例翻倍',
      desc: '结合动态足式机器人与大语言模型规划的安防巡检方案，已在全国30+座万级产业园正式部署，整体人力协作成本降低达48.5%。',
      date: '2026-05-18',
      author: '数字中国战略智库',
      tag: '商用落地',
      impact: '★★★★☆',
      fullStory: '安防领域正式进入「AI Agent + 实体运动」时代。大语言模型不仅用于交互，更能翻译任务逻辑，直接控制机械臂和四足机体完成紧急异常巡查与设备阀门修复。在消防预警反应速度上，AI巡检较传统人工监控提高了两倍以上。'
    },
    {
      id: 'ind-3',
      title: '多智能体网络（Multi-Agent）在区域物流微循环的成功实践',
      desc: '针对最后三公里的立体配送，通过全网Agent共享位置态势，物流网络在自适应高峰拥堵方面效率提高整整28%。',
      date: '2026-05-10',
      author: '前沿物链周刊',
      tag: '算法演进',
      impact: '★★★★☆',
      fullStory: '去中心化的多Agent防碰撞与接驳路径动态优化算法取得新成果。面对复杂的天气、不规则的路况以及随机性派单，模型通过小规模分布式试错和强化学习快速收敛，并在华东数个大型居民圈完成了长达6个月的无事故试运行。'
    }
  ];

  const investmentOpportunities = [
    {
      id: 'inv-1',
      title: '红杉数智未来探索专项成长基金',
      desc: '聚焦：AI Agent底座、数字孪生核心组件、智能硬件传感器。',
      fundSize: '15.0 亿元',
      ticketSize: '1000万 - 5000万',
      stage: 'PRE-A 至 B轮',
      leadPartner: '张卓远 (Managing Director)',
      contactEmail: 'seq-digital@sequoiacap.com',
      requirement: '商业计划书逻辑清晰，有明确落地订单支撑或技术原型跑通。'
    },
    {
      id: 'inv-2',
      title: '真格未来之星早期种子培育专项',
      desc: '聚焦：青年极客团队、智慧大模型应用层、多模态创意。',
      fundSize: '4.5 亿元',
      ticketSize: '150万 - 500万',
      stage: '种子 / 天使轮',
      leadPartner: '陈静敏 (Partner)',
      contactEmail: 'zg-stars@zhenfund.com',
      requirement: '偏爱高校前沿课题负责人、大厂资深算法科学家离职创业团队。'
    },
    {
      id: 'inv-3',
      title: '高瓴智造智慧城市数字底座合伙基金',
      desc: '聚焦：新基建、大算力集群调度、低碳智慧建筑碳中和建模。',
      fundSize: '25.0 亿元',
      ticketSize: '3000万 - 8000万',
      stage: 'B轮 至 Pre-IPO',
      leadPartner: '陆世杰 (Investment Advisor)',
      contactEmail: 'gl-smartcity@hillhousecap.com',
      requirement: '偏好已经拥有国家高新技术企业资质，或者已获得地方重大示范合同的硬科技研发组。'
    }
  ];

  const policyBlueprints = [
    {
      id: 'pol-1',
      title: '《2026年数字经济算力基础设施普惠申领与补贴指南》',
      desc: '针对通过国家核心大赛优胜的科技中小企业，提供10万-50万不等算力现金券直达与算力租赁自付额50%减免。',
      issuer: '国家发展与改革委员会',
      applyDeadline: '2026-10-31',
      subsidy: '¥ 10 - 50万元 算力直达基金',
      qualifications: [
        '注册时间满1年的科技型中小企业。',
        '拥有自主研发核心算法并取得软著或发明专利。',
        '获得过经认定的创新创业国际、国家级赛事省/市级以上奖项（大赛定版方案优先）。'
      ]
    },
    {
      id: 'pol-2',
      title: '《关于促进大模型底座在专精特新企业中重叠发展的税收政策》',
      desc: '专精特新企业自研算法并产生软硬件研发投入时，享受高达200%的研发费用加计扣除，且免去前三年地方存量所得。',
      issuer: '国家税务总局 / 科技部',
      applyDeadline: '2026-12-15',
      subsidy: '研发费用 200% 加计全额扣除',
      qualifications: [
        '取得至少1项与大模型/深度学习相关的技术专利（在审亦可）。',
        '上年度研发投入总额占主营收入比不低于10%。',
        '企业在库属于国家「专精特新」或具备相当体量的技术实干组。'
      ]
    }
  ];

  const thinkTanks = [
    {
      id: 'tkt-1',
      title: '麦肯锡：2026年全球智能体（AI Agent）产业化前景与痛点分析',
      desc: '报告详细指出，AI Agent真正的商业溢价在从单纯Chat界面走向工作流闭环。全球80%的企业更愿意配合API自动化结算来购买降本效益。',
      source: 'Mckinsey Core Research Group',
      pages: '48页 全文PDF',
      rating: '9.8 行业声誉',
      keyTakeaways: [
        '核心机遇在于：将重度人工操作的文件审批流转为AI自主多方会商。',
        '痛点突破：目前最大的痛点是由于指令级数长导致的逻辑漂移与重试算力积压，高精度推理依然昂贵。',
        '变现预测：预计到2027年，全自动流式的软件订阅租金模式将逐步挤占传统一买性项目部署形式。'
      ]
    },
    {
      id: 'tkt-2',
      title: 'Gartner 2026：硬科技新航道超自动化（Hyperautomation）图谱',
      desc: '定义全链路自感知、自执行、自优化的复合体系，报告梳理了42种核心支持组件，其中国家级3D城市重构在未来拥有爆发式市场红利。',
      source: 'Gartner Frontier Tech Circle',
      pages: '62页 精简解读版',
      rating: '9.6 权威指引',
      keyTakeaways: [
        '技术解耦：未来的城市大脑不再依靠单一庞大神经元，是由超过10000个微型任务Agent自动编排。',
        '中国红利：依托完备的基础工业传感器基础，中国在空地一体物流编排、全天候综合算力节电上优势独到。'
      ]
    }
  ];

  const featuredCompetitions = [
    {
      id: 'comp-1',
      title: '全国创新创业大赛 2026',
      tagline: "报名进行中",
      description: "汇聚全国顶尖创新力量，为创业者提供展示舞台、资本对接与顶尖导师资源。总奖金池高达 ¥ 500万。",
      deadline: "2026-07-15",
      location: "北京 · 中国",
      reward: "500万",
      type: '科创综合',
      category: '科创综合',
      region: '北京',
      status: 'active'
    },
    {
      id: 'comp-2',
      title: '全球 AI 挑战赛 2026',
      tagline: "火热筹备中",
      description: "探索人工智能的极限，挑战最前沿的算法难题。与全球顶尖开发者同台竞技，赢取丰厚奖金与中国算力中心交流机会。",
      deadline: "2026-06-25",
      location: "上海 · 中国",
      reward: "800万",
      type: '人工智能',
      category: '人工智能',
      region: '上海',
      status: 'pending'
    },
    {
      id: 'comp-3',
      title: '未来城市建构与空地指挥大赛',
      tagline: "作品征集中",
      description: "重新构想我们的立体交通与人居空间。关注数字化孪生、高保真渲染与低空物流，为未来城市提供卓越的设计方案。",
      deadline: "2026-09-10",
      location: "深圳 · 中国",
      reward: "300万",
      type: '创意设计',
      category: '创意设计',
      region: '深圳',
      status: 'active'
    },
    {
      id: 'comp-4',
      title: '绿色低碳设计与先进建筑环保大赛',
      tagline: "报名进行中",
      description: "关注大规模碳中和、节能降碳控制以及新能源负荷智能算法。优秀方案将获绿色园区实地示范培育机会。",
      deadline: "2026-07-01",
      location: "深圳 · 中国",
      reward: "200万",
      type: '低碳环保',
      category: '低碳环保',
      region: '深圳',
      status: 'active'
    },
    {
      id: 'comp-5',
      title: '“互联网+”双创大赛全国选送站',
      tagline: "报名筹备中",
      description: "覆盖高校及初创组的最具商业推广价值、最强科技转化潜质综合性科创大主线挑战，对接头部投资机构。",
      deadline: "2026-10-15",
      location: "西安 · 中国",
      reward: "600万",
      type: '科创综合',
      category: '科创综合',
      region: '西安',
      status: 'active'
    },
    {
      id: 'comp-6',
      title: '智慧制造与工业互联算法专项赛',
      tagline: "火热报名中",
      description: "深耕工业数字化控制、传感器高并发通讯、离群自适应回归调优。旨在挖掘最硬核的底层软件与物联网算法方案。",
      deadline: "2026-06-15",
      location: "上海 · 中国",
      reward: "400万",
      type: '人工智能',
      category: '人工智能',
      region: '上海',
      status: 'active'
    }
  ];

  // Map filters output
  const filteredAllItems = () => {
    let result: any[] = [];
    
    // Aggregate according to type or channel
    if (activeChannel === 'all' || activeChannel === 'industry') {
      result = [...result, ...industryTrends.map(x => ({ ...x, _category: 'industry' }))];
    }
    if (activeChannel === 'all' || activeChannel === 'investment') {
      result = [...result, ...investmentOpportunities.map(x => ({ ...x, _category: 'investment' }))];
    }
    if (activeChannel === 'all' || activeChannel === 'policy') {
      result = [...result, ...policyBlueprints.map(x => ({ ...x, _category: 'policy' }))];
    }
    if (activeChannel === 'all' || activeChannel === 'thinktank') {
      result = [...result, ...thinkTanks.map(x => ({ ...x, _category: 'thinktank' }))];
    }
    if (activeChannel === 'all' || activeChannel === 'competitions') {
      let comps = featuredCompetitions.map(x => ({ ...x, _category: 'competitions' }));
      
      // Multi-dimensional filters for competitions
      if (compCategory !== 'all') {
        comps = comps.filter(item => item.category === compCategory);
      }
      if (compRegion !== 'all') {
        comps = comps.filter(item => item.region === compRegion);
      }
      if (compTime !== 'all') {
        if (compTime === 'june') {
          comps = comps.filter(item => item.deadline.startsWith('2026-06'));
        } else if (compTime === 'july') {
          comps = comps.filter(item => item.deadline.startsWith('2026-07'));
        } else if (compTime === 'later') {
          comps = comps.filter(item => !item.deadline.startsWith('2026-06') && !item.deadline.startsWith('2026-07'));
        }
      }
      
      result = [...result, ...comps];
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      result = result.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = (item.desc || item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
      });
    }

    return result;
  };

  const allItems = filteredAllItems();

  // Evaluates investor match logic
  const runInvestorEvaluation = (investorId: string, projectId: string) => {
    if (!projectId) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      const selectedProject = projects.find(p => p.id === projectId);
      const investorName = investmentOpportunities.find(i => i.id === investorId)?.title || "该投资机构";

      // Compute interesting pseudo match scores based on project name length and category
      const hash = (selectedProject?.name || "").length + (selectedProject?.competition || "").length;
      const baseScore = 78 + (hash % 18);
      
      let keyMatch = "核心底层算力开发、智慧感知算法闭环。";
      if (investorId === 'inv-2') {
        keyMatch = "青年团队极速行动力、产品直观的视觉交互原型。";
      } else if (investorId === 'inv-3') {
        keyMatch = "项目契合新基建数字底座理念，契合大规模示范潜力。";
      }

      setIsEvaluating(false);
      setEvaluationResult({
        score: baseScore,
        investorName,
        projectName: selectedProject?.name || "未知项目",
        status: baseScore >= 85 ? '极力推介机构直连' : '建议精炼商业计划书再申',
        keyMatch,
        actionAdvice: baseScore >= 85 
          ? `您的大赛定版草案「${selectedProject?.name}」在商业模式和底层方案高度符合需求。AI 助手已自动向该机构负责人的内部推介清单投放预案，可在「项目管理」追踪投递情况。`
          : `项目方案逻辑成立，但「${selectedProject?.name}」目前的研发指标描述需对硬核数据及专精特新作进一步背书。建议通过「在线编辑BP」加入可量化的落地示范合同说明。`
      });
    }, 1500);
  };

  // Policy eligibility calculation
  const runPolicyCheck = () => {
    let score = 100;
    const reasons: string[] = [];

    if (eligibilityAnswers.registeredTime === 'lessThan1') {
      score -= 20;
      reasons.push("公司注册时间不足1年，部分算力直达普惠条款可能需绑定孵化器申报。");
    }
    if (eligibilityAnswers.hasPatents === 'no') {
      score -= 30;
      reasons.push("缺少核心技术软著或在审专利，无法证明产品自主原创性与科研壁垒。");
    }
    
    setEligibilityResult(
      score >= 80 
        ? `估算评级：符合政策扶持 A 级范围！您具有高度资质。预计可直接免审核申报并领用 20万元 先进算力专项基金券。`
        : `评估评级：符合 B 级辅助范围。尚存缺陷（${reasons.join(' ')}），建议补全大赛认证并增加专利发明申报。`
    );
  };

  return (
    <div className="space-y-8">
      {/* Upper Descriptive banner */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0045c4] rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-black uppercase tracking-widest text-amber-300">
            <Sparkles className="w-3.5 h-3.5 animate-bounce text-amber-300 fill-current" />
            前沿专属战略数据库
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            精选推荐 · 核心情报站
          </h1>
          <p className="text-sm md:text-base text-blue-100/90 leading-relaxed font-medium">
            破除信息差，为您的科创硬核大脑提供顶尖政策梳理、全国极客赛事追踪、主力VC创投偏好配对与顶尖智库分析报告。
          </p>
        </div>
      </div>

      {/* Grid Layout Filter and search line */}
      <div className="glass-card p-5 flex flex-col md:flex-row items-center gap-4 relative justify-between">
        {/* Horizontal Navigation channel pill buttons */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {[
            { id: 'all', title: '全部情报', icon: null },
            { id: 'industry', title: '行业前沿', icon: <Zap className="w-4 h-4 text-indigo-500" /> },
            { id: 'investment', title: '投资机会', icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
            { id: 'policy', title: '政策解读', icon: <FileText className="w-4 h-4 text-blue-500" /> },
            { id: 'thinktank', title: '智库动态', icon: <BookOpen className="w-4 h-4 text-slate-500" /> },
            { id: 'competitions', title: '精选赛事', icon: <Trophy className="w-4 h-4 text-amber-500" /> }
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChannel(ch.id as ChannelType);
                setSelectedItem(null);
                setEvaluationResult(null);
                setEligibilityResult(null);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border shrink-0",
                activeChannel === ch.id
                  ? "bg-[#0A66FF] border-[#0A66FF] text-white shadow-lg shadow-blue-500/15"
                  : "bg-white border-slate-150 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {ch.icon}
              <span>{ch.title}</span>
            </button>
          ))}
        </div>

        {/* Action search bar */}
        <div className="relative group w-full md:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
          <input
            type="text"
            placeholder="搜索您关注的前沿关键字..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
          />
        </div>
      </div>

      {/* Competitions Search and Dimensions Filter Panel */}
      {activeChannel === 'competitions' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#DDE8F5] rounded-[1.5rem] p-5 space-y-4 shadow-[0_4px_20px_rgba(34,86,160,0.04)] text-xs"
        >
          {/* Category Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3 border-b border-slate-100">
            <span className="font-extrabold text-[#52657A] w-20 shrink-0 uppercase tracking-wider">赛事类别:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', title: '全部类别' },
                { id: '科创综合', title: '科创综合' },
                { id: '人工智能', title: '人工智能 / 算法' },
                { id: '创意设计', title: '创意设计 / 孪生' },
                { id: '低碳环保', title: '低碳环保 / 能源' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCompCategory(cat.id);
                    setSelectedItem(null);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border text-xs",
                    compCategory === cat.id
                      ? "bg-[#F3F8FF] border-[#BFD8FF] text-[#0A66FF]"
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#0A66FF]"
                  )}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Region Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3 border-b border-slate-100">
            <span className="font-extrabold text-[#52657A] w-20 shrink-0 uppercase tracking-wider">赛区地区:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', title: '全部地区' },
                { id: '北京', title: '北京赛区' },
                { id: '上海', title: '上海赛区' },
                { id: '深圳', title: '深圳赛区' },
                { id: '西安', title: '西安赛区' }
              ].map(reg => (
                <button
                  key={reg.id}
                  onClick={() => {
                    setCompRegion(reg.id);
                    setSelectedItem(null);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border text-xs",
                    compRegion === reg.id
                      ? "bg-[#F3F8FF] border-[#BFD8FF] text-[#0A66FF]"
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#0A66FF]"
                  )}
                >
                  {reg.title}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-extrabold text-[#52657A] w-20 shrink-0 uppercase tracking-wider">截止时间:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', title: '全部截止时间' },
                { id: 'june', title: '2026年6月截止 (近30天)' },
                { id: 'july', title: '2026年7月截止' },
                { id: 'later', title: '更晚截止 / 筹备中' }
              ].map(time => (
                <button
                  key={time.id}
                  onClick={() => {
                    setCompTime(time.id);
                    setSelectedItem(null);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer border text-xs",
                    compTime === time.id
                      ? "bg-[#F3F8FF] border-[#BFD8FF] text-[#0A66FF]"
                      : "bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#0A66FF]"
                  )}
                >
                  {time.title}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Interactive Division */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Grid List of cards */}
        <div className={cn("space-y-6", selectedItem ? "lg:col-span-7" : "lg:col-span-12")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allItems.length === 0 ? (
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-[2rem] p-16 text-center text-slate-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-sm font-bold">没有找到匹配的情报，换个搜索词或筛选条件试试吧</p>
              </div>
            ) : (
              allItems.map((item) => {
                // Determine layout details dynamically based on category
                const cat = item._category || activeChannel;
                let colorClass = "";
                let iconEl = null;
                let badgeTxt = "";

                if (cat === 'industry') {
                  colorClass = "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100 text-indigo-900";
                  iconEl = <Zap className="w-6 h-6 text-indigo-600" />;
                  badgeTxt = item.tag || "前沿动向";
                } else if (cat === 'investment') {
                  colorClass = "bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100 text-emerald-900";
                  iconEl = <TrendingUp className="w-6 h-6 text-emerald-600" />;
                  badgeTxt = item.stage || "VC创投";
                } else if (cat === 'policy') {
                  colorClass = "bg-blue-50/50 hover:bg-blue-50 border-blue-100 text-blue-900";
                  iconEl = <FileText className="w-6 h-6 text-blue-600" />;
                  badgeTxt = "重大政策";
                } else if (cat === 'thinktank') {
                  colorClass = "bg-slate-50/70 hover:bg-slate-50 border-slate-200 text-slate-900";
                  iconEl = <BookOpen className="w-6 h-6 text-slate-700" />;
                  badgeTxt = item.source ? "全球智库" : "行业分析";
                } else {
                  colorClass = "bg-amber-50/50 hover:bg-amber-50 border-amber-100 text-amber-900";
                  iconEl = <Trophy className="w-6 h-6 text-amber-500" />;
                  badgeTxt = item.type || "推荐赛事";
                }

                const isCurrentlySelected = selectedItem?.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`card-${item.id}`}
                    onClick={() => {
                      setSelectedItem({
                        id: item.id,
                        type: cat,
                        title: item.title,
                        content: item
                      });
                      setEvaluationResult(null);
                      setEligibilityResult(null);
                    }}
                    className={cn(
                      "flex flex-col justify-between p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group",
                      isCurrentlySelected 
                        ? "border-[#0045c4] bg-white ring-4 ring-[#0045c4]/10 shadow-2xl scale-[1.01]" 
                        : "hover:scale-[1.01] bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 shadow-md hover:shadow-xl"
                    )}
                  >
                    <div>
                      {/* Badge in card */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100">
                          {iconEl}
                        </div>
                        <span className="text-[10px] font-black bg-white/80 border border-slate-200/60 px-3 py-1 rounded-full text-slate-500 tracking-wide shadow-sm uppercase">
                          {badgeTxt}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base font-black text-slate-800 leading-snug group-hover:text-[#0045c4] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium line-clamp-3 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action strip */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100/60">
                      {cat === 'investment' && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-xs font-black text-emerald-600">{item.ticketSize}</span>
                        </div>
                      )}
                      {cat === 'competitions' && (
                        <div className="text-xs font-black text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>截止 {item.deadline}</span>
                        </div>
                      )}
                      {cat === 'policy' && (
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                          申报中
                        </span>
                      )}
                      {cat === 'industry' && (
                        <span className="text-xs font-black text-slate-400">{item.author}</span>
                      )}
                      {cat === 'thinktank' && (
                        <span className="text-xs font-black text-slate-400">{item.rating}</span>
                      )}

                      <div className="flex items-center gap-1.5 text-xs font-black text-[#0045c4] group-hover:translate-x-1.5 transition-transform duration-300">
                        <span>
                          {cat === 'competitions' ? '立即报名' : cat === 'policy' ? '查看详情' : '申请建联'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#0045c4]" />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Interactive Detail Workspace (reveals beautifully on card click) */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              layoutId={`workspace-${selectedItem.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5 bg-[#fafbfd] border-2 border-blue-50 rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Decorative side badge */}
              <div className="absolute top-0 right-0 h-32 w-16 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/55">
                <span className="text-xs font-black bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-1 animate-pulse shadow-sm shadow-blue-500/10">
                  <Sliders className="w-3.5 h-3.5" />
                  前沿研判交互面板
                </span>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setEvaluationResult(null);
                    setEligibilityResult(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body based on category */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800 leading-tight">
                    {selectedItem.title}
                  </h2>
                </div>

                {/* 1. Industry Dynamics Details */}
                {selectedItem.type === 'industry' && (
                  <div className="space-y-5">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-sm text-slate-600 leading-relaxed space-y-4">
                      <p className="font-medium indent-8">
                        {selectedItem.content.fullStory}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold pt-2 border-t border-slate-100">
                        <span>发布时间: {selectedItem.content.date}</span>
                        <span>影响力系数: <span className="text-amber-500">{selectedItem.content.impact}</span></span>
                      </div>
                    </div>
                    
                    <div className="bg-[#F3F8FF] border border-[#BFD8FF] rounded-2xl p-5 space-y-2">
                      <h4 className="text-xs font-black text-[#0A66FF] tracking-wider uppercase flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-[#0A66FF] fill-current" />
                        AI 智能解读与破局方针
                      </h4>
                      <p className="text-xs text-slate-600 leading-normal font-medium">
                        该顶尖技术不仅意味着科研上限升高点，更为在库小微创业团队提供了从「纯定制化交付」向「标准化数字视场景订阅」升级的理论依据，建议BP编写时深度融合此技术，以获取加分项。
                      </p>
                    </div>

                    <button
                      onClick={() => alert(`【申请建联】对标请求已发给：${selectedItem.content.author}，将通过系统信使通知您。`)}
                      className="w-full bg-[#0A66FF] hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                    >
                      申请建联
                    </button>
                  </div>
                )}

                {/* 2. Custom Investment Pipeline matching current portfolio */}
                {selectedItem.type === 'investment' && (
                  <div className="space-y-5">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm/50 space-y-3.5 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-400 block font-bold">总管理规模</span>
                          <span className="text-sm font-black text-slate-700">{selectedItem.content.fundSize}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="text-slate-400 block font-bold">主力单笔额度</span>
                          <span className="text-sm font-black text-emerald-600">{selectedItem.content.ticketSize}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold">投资阶段范围:</span>
                        <p className="text-slate-600 font-bold text-xs">{selectedItem.content.stage}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold">主要合伙人:</span>
                        <p className="text-slate-600 font-black text-xs">{selectedItem.content.leadPartner}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold">直投核心偏好要求:</span>
                        <p className="text-slate-600 font-medium leading-relaxed bg-amber-50/50 p-2 rounded-lg border border-amber-50 text-amber-900">{selectedItem.content.requirement}</p>
                      </div>
                    </div>

                    {/* INTERACTIVE COMPONENT: PROJECT-VC ALIGNMENT APPRAISER */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm/50">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                        <Sliders className="w-4 h-4 text-emerald-500" />
                        机构投递匹配度·智能算法测试
                      </h4>

                      {projects.length === 0 ? (
                        <p className="text-xs text-slate-400 font-bold">请先在「项目管理」创建任何一个科研或大赛项目方案。</p>
                      ) : (
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 block">选择您要进行匹配分析的项目</label>
                            <select
                              value={matchingProject}
                              onChange={(e) => setMatchingProject(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none focus:border-brand-blue"
                            >
                              <option value="">-- 请选择要匹配的项目 --</option>
                              {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => runInvestorEvaluation(selectedItem.id, matchingProject)}
                            disabled={!matchingProject || isEvaluating}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10"
                          >
                            {isEvaluating ? (
                              <>
                                <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                                正在解构大语言技术对标性...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                                启动 500大机构 定向匹配度研判
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Result visualization */}
                      <AnimatePresence>
                        {evaluationResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3 text-[11px]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-900">对标评估得分:</span>
                              <span className="text-base font-black text-emerald-700">{evaluationResult.score} / 100</span>
                            </div>
                            <div className="w-full bg-emerald-200/50 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${evaluationResult.score}%` }} />
                            </div>
                            <div className="text-emerald-800 leading-normal space-y-1.5 font-medium">
                              <p className="font-black text-xs text-emerald-900">✓ 研判反馈: {evaluationResult.status}</p>
                              <p><span className="font-bold">对标吻合:</span> {evaluationResult.keyMatch}</p>
                              <p className="bg-white/80 p-2.5 rounded-lg border border-emerald-200 text-slate-600 leading-relaxed">{evaluationResult.actionAdvice}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={() => alert(`【申请建联成功】已向 ${selectedItem.content.leadPartner} 提交商业计划书及深度对标申请，前沿信使将通过系统消息提醒您。`)}
                      className="w-full bg-[#0A66FF] hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                    >
                      申请建联
                    </button>
                  </div>
                )}

                {/* 3. National Policy Translation & Eligibility Validator */}
                {selectedItem.type === 'policy' && (
                  <div className="space-y-5">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm/50 space-y-3.5 text-xs text-slate-600 leading-relaxed">
                      <div className="flex justify-between items-center bg-blue-50/50 p-2.5 rounded-xl border border-blue-50 mb-1">
                        <span className="font-bold text-blue-900">资助主体额度:</span>
                        <span className="font-black text-blue-700">{selectedItem.content.subsidy}</span>
                      </div>
                      <div className="space-y-2">
                        <span className="text-slate-500 font-bold">申报起跑资质底线</span>
                        <ul className="space-y-1.5 pl-4 list-decimal text-[11px]">
                          {selectedItem.content.qualifications.map((q: string, i: number) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* INTERACTIVE COMPONENT: POLICY ELIGIBILITY CHECKER */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm/50">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-4.5 h-4.5 text-blue-500" />
                        普惠奖补免审领用 · 资格自筛器
                      </h4>

                      <div className="space-y-3 text-xs text-slate-600">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">1. 注册成立或科研挂靠项目耗时</label>
                          <select
                            value={eligibilityAnswers.registeredTime}
                            onChange={(e) => setEligibilityAnswers({...eligibilityAnswers, registeredTime: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                          >
                            <option value="moreThan1">已达 1 年以上（或取得大赛入库资格）</option>
                            <option value="lessThan1">未满 1 年的新生项目组</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold block">2. 是否拥有核心原创技术软著或发明储备</label>
                          <select
                            value={eligibilityAnswers.hasPatents}
                            onChange={(e) => setEligibilityAnswers({...eligibilityAnswers, hasPatents: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                          >
                            <option value="yes">是 (软著已取得 / 专利在实审阶段也算)</option>
                            <option value="no">否 (目前尚等同于纯方案书概念，仍需沉淀)</option>
                          </select>
                        </div>

                        <button
                          onClick={runPolicyCheck}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-600/10"
                        >
                          开始资格概率自动算判
                        </button>
                      </div>

                      {/* Result visualization */}
                      <AnimatePresence>
                        {eligibilityResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl font-bold text-xs text-blue-900 leading-normal"
                          >
                            {eligibilityResult}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={() => alert(`【查看详情】已加载全套《${selectedItem.title}》官方实施指南及申报材料模板包，请前往材料库查看。`)}
                      className="w-full bg-[#0A66FF] hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                    >
                      查看详情
                    </button>
                  </div>
                )}

                {/* 4. Global Think Tank Analysis takeaways */}
                {selectedItem.type === 'thinktank' && (
                  <div className="space-y-5">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-xs space-y-4">
                      <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-100 pb-2">
                        <span>文源: {selectedItem.content.source}</span>
                        <span>规格: {selectedItem.content.pages}</span>
                      </div>
                      <div className="space-y-3.5">
                        <span className="font-black text-slate-700 text-xs block">核心提炼见解:</span>
                        <ul className="space-y-3 pl-4 list-disc text-[11px] text-slate-600 leading-relaxed font-medium">
                          {selectedItem.content.keyTakeaways.map((k: string, i: number) => (
                            <li key={i}>{k}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => alert(`【报告下载成功】已自动通过加密信道投递至您的「我的材料库」- 学术智库。`)}
                        className="flex-1 bg-white border border-[#DDE8F5] text-[#0A66FF] hover:bg-[#F3F8FF] py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        缓存报告
                      </button>
                      <button
                        onClick={() => alert(`【申请建联】建联请求已提交至前沿智库《${selectedItem.content.source}》课题编委会，请静候信使通知。`)}
                        className="flex-1 bg-[#0A66FF] hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-500/10"
                      >
                        申请建联
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Star Competitions direct bindings to local Projects */}
                {selectedItem.type === 'competitions' && (
                  <div className="space-y-5">
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm/50 space-y-3 text-xs font-medium text-slate-600 leading-relaxed">
                      <p className="text-slate-800 font-bold bg-amber-50/55 p-3 rounded-xl border border-amber-100">
                        {selectedItem.content.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>举办地: {selectedItem.content.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>倒计时截止: {selectedItem.content.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>一等奖总扶持: <strong className="text-amber-600 font-black ml-1">¥ {selectedItem.content.reward}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onRegisterCompetition) {
                          onRegisterCompetition();
                        }
                      }}
                      className="w-full bg-[#0A66FF] hover:bg-blue-700 text-white py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                      立即报名
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

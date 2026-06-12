import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Bot, Send, Paperclip, ChevronDown, Check, FileText, 
  TrendingUp, BarChart3, PieChart, Activity, Users, Settings, 
  HelpCircle, RefreshCw, ArrowRight, ShieldAlert, BadgeCheck, Zap,
  Loader2, Globe, Building, Coins, GraduationCap, Briefcase,
  Home, PlusSquare, BookOpen, MessageSquare, MoreHorizontal, SquarePen
} from 'lucide-react';
import { cn } from '../lib/utils';

// Shared interfaces
interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  analysisReport?: AnalysisReport;
  fileName?: string;
}

interface AnalysisReport {
  projectName: string;
  score: number;
  marketPotential: string;
  investmentGrade: string;
  valuationEstimate: string;
  radarMetrics: { name: string; value: number }[];
  positives: string[];
  risks: string[];
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

interface AssistantAgent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  skills: string[];
  status: string;
  statusColor: string;
}

export function Workstation() {
  // Sub-sidebar active state matching Image 2
  const [subActiveTab, setSubActiveTab] = useState<'home' | 'new_project' | 'journals'>('home');
  const [activeProjectItem, setActiveProjectItem] = useState<string>('博创赛创业组计划书');

  // Input UI mode states
  const [expertMode, setExpertMode] = useState<'document' | 'website' | 'slides'>('document');
  const [isExpertDropdownOpen, setIsExpertDropdownOpen] = useState(false);
  
  const [selectedScenario, setSelectedScenario] = useState<string>('可行性分析报告');
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  
  const [speedMode, setSpeedMode] = useState<'rapid' | 'deep'>('rapid');
  const [isSpeedDropdownOpen, setIsSpeedDropdownOpen] = useState(false);

  // Attachment states
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat/Analysis states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: '嘿，您好！我是您的智能诊断工作台，特别针对科技应用、商业计划书、可行性研究报告与投资申请书提供企业级诊断。您可以直接输入诉求，或者在下方上传您的待分析项目文件，我将即刻为您生成深度的投资回报估算与多维度的可行性、行业趋势分析报告。',
      timestamp: '刚刚'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Selected agent state
  const [activeAgentId, setActiveAgentId] = useState('agent-1');

  // List of assistants mimicking the uploaded UI
  const assistants: AssistantAgent[] = [
    {
      id: 'agent-1',
      name: '可行性分析专家',
      title: '主攻：项目立项与可行性评级',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&h=120&auto=format&fit=crop',
      description: '擅长项目风控及宏观可行性、宏观投资回报论证，可自动化撰写专业章程。',
      skills: ['多因子风险研判', '资本可行性测算', '高保真合规核对'],
      status: '今日已服务 14 次',
      statusColor: 'text-[#0A66FF]'
    },
    {
      id: 'agent-2',
      name: '商业估值专家',
      title: '主攻：估值计算与财务建模',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=120&h=120&auto=format&fit=crop',
      description: '擅长BP财务预测、现金流回归推演，提供精确到千万元级的主权估值方案。',
      skills: ['高精现金流测算', '同业标杆对标', '资本杠杆还原'],
      status: '就绪中',
      statusColor: 'text-slate-400'
    },
    {
      id: 'agent-3',
      name: '行业多面手',
      title: '主攻：行业洞察与竞品穿透',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&h=120&auto=format&fit=crop',
      description: '全网高并发检索前沿研报与细分赛道变迁，解构竞争对手底层逻辑。',
      skills: ['研报穿透性提炼', '红海规避路径', '技术壁垒评级'],
      status: '就绪中',
      statusColor: 'text-slate-400'
    }
  ];

  // Scenarios options for dropdown (16 options matching image)
  const scenarios = [
    { label: '通用', desc: '一专多能智能精准' },
    { label: '方案书', desc: '逻辑严谨创意加分' },
    { label: '计划书', desc: '直指目标高效落地' },
    { label: '报告', desc: '数据论证效率倍增' },
    { label: '创业计划书', desc: '构建蓝图稳步开局' },
    { label: '融资计划书', desc: '亮点聚焦绝胜在握' },
    { label: '调研报告', desc: '深度挖掘精准洞察' },
    { label: '调查报告', desc: '客观呈现甄能商业决策' },
    { label: '项目报告', desc: '架构清晰重点突出' },
    { label: '课题报告', desc: '高效梳理快速生成' },
    { label: '行业分析报告', desc: '数据驱动洞见先机' },
    { label: '施工方案', desc: '智能校验安全合规' },
    { label: '可行性分析报告', desc: '全面论证规避风险' },
    { label: '技术方案', desc: '逻辑严密细节周全' },
    { label: '项目计划书', desc: '智能规划高效落地' },
    { label: '商业计划书', desc: '价值凸显深度专业' }
  ];

  // Suggested questions (Guess what you want to ask)
  const suggestions = [
    { text: '帮我分析我目前商业计划书的核心风险点在哪？', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> },
    { text: '人工智能领域的科研/双创项目如何撰写可行性报告？', icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
    { text: '请提供一份“物联网硬件车间项目”的投资估算结构。', icon: <Coins className="w-3.5 h-3.5 text-indigo-500" /> },
    { text: '近期科创项目融资估算有哪些行业平均溢价率？', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> }
  ];

  // File analysis generator
  const simulateFileAnalysis = (fileName: string) => {
    setIsThinking(true);
    
    setTimeout(() => {
      const isTraffic = fileName.includes('交通') || fileName.includes('路车') || fileName.includes('排班');
      const isEnergy = fileName.includes('能源') || fileName.includes('能效') || fileName.includes('低碳');
      
      let prjName = fileName.replace(/\.[^/.]+$/, "");
      let score = isTraffic ? 94 : isEnergy ? 91 : 88;
      
      const newReport: AnalysisReport = {
        projectName: prjName,
        score: score,
        marketPotential: isTraffic ? '极高（特大型城市多点联动示范区核心承建潜力）' : isEnergy ? '强劲（绿色双碳重点示范培育目录）' : '良好（通用赛道，成长性明确）',
        investmentGrade: isTraffic ? 'A+ 级（准一梯队技术壁垒）' : isEnergy ? 'A 级（国家低碳基金推荐资质）' : 'B+ 级（财务模型自洽，适合天使/A轮）',
        valuationEstimate: isTraffic ? '¥ 7,500 万人民币 (算法及软硬件体系)' : isEnergy ? '¥ 4,800 万人民币 (算法测算中枢)' : '¥ 2,800 万人民币',
        radarMetrics: [
          { name: '技术先进性', value: isTraffic ? 96 : isEnergy ? 92 : 85 },
          { name: '财务自洽度', value: isTraffic ? 88 : isEnergy ? 85 : 82 },
          { name: '市场真实痛点', value: isTraffic ? 94 : isEnergy ? 90 : 80 },
          { name: '行业壁垒(专利)', value: isTraffic ? 95 : isEnergy ? 88 : 75 },
          { name: '落地可行水平', value: isTraffic ? 91 : isEnergy ? 93 : 84 },
        ],
        positives: isTraffic ? [
          '使用了前沿的重光照、多目标轨迹追踪及强化学习红绿灯决策系统。',
          '技术自洽度高、算法经过省/市级赛区专家函评充分认可，极高落地商业化成熟度。',
          '与四大主导产业紧密贴合，能够快速获取地方基建与数字化路网特许经营支持。'
        ] : isEnergy ? [
          '依托博创能效测算单元智能自适应回归算法，离群工况抓取成功率达99.2%。',
          '针对工业车间多工段能级损耗有精细的负荷建模，满足目前低碳零碳园区的极刚性节能降耗诉求。'
        ] : [
          '项目结构逻辑完整，极速模式对项目定位进行了全面修润。',
          '核心要素高度整合，契合大赛及投资申报标准框架体系。'
        ],
        risks: isTraffic ? [
          '路网数据获取受到有关保密规章制约，实际部署或需申请专线或机房托管。',
          '初建期软硬件总体采购成本较高，需通过示范标杆合作来实现资本杠杆释放。'
        ] : isEnergy ? [
          '不同厂家生产的重工业传感器在底层通讯规格上存在一定差异，草稿中缺失对该差异的详细软硬件解耦防护说明。'
        ] : [
          '暂无具体专利防篡改溯源印签或权威检测机构的技术评测报告作为客观支撑，说服力稍显单一。'
        ],
        swotAnalysis: {
          strengths: isTraffic ? ['全自研的多源流智能融和算法', '第一发明人及核心研究力量具备省/市一级高密集成果'] : ['99.2%离群自适应高阶智能回归精度', '拥有配套回归有效性评测报告支撑'],
          weaknesses: ['初期客户付费周期较长', '对核心高端研发工程师的薪酬依存度较高'],
          opportunities: ['国家重点强化立体数字孪生与综合枢纽指挥升级', '新一代智能化物联网通信节点迎来重构潮'],
          threats: ['国际通用算法开源步伐加快导致软件毛利被适度稀释', '数据合规管理红线日益严苛']
        }
      };

      setMessages(prev => [
        ...prev,
        {
          id: `resp-${Date.now()}`,
          sender: 'agent',
          text: `针对您上传的文件「${fileName}」，我已切换至【${selectedScenario}】专家模式，并结合【${speedMode === 'deep' ? '深度推演' : '极速评估'}】算法模块完成了详尽的项目投资及可行性诊断评估。以下是为您专属提炼的分析报告：`,
          timestamp: '刚刚',
          analysisReport: newReport,
          fileName: fileName
        }
      ]);
      
      setIsThinking(false);
      setUploadedFile(null);
    }, 2800);
  };

  // Human dialog handles
  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() && !uploadedFile) return;

    const userMsgId = `user-${Date.now()}`;
    const userFileName = uploadedFile?.name;

    // Append User Message
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: rawText,
      timestamp: '刚刚',
      fileName: userFileName
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    if (userFileName) {
      simulateFileAnalysis(userFileName);
    } else {
      // Natural dialogue simulate
      setIsThinking(true);
      setTimeout(() => {
        let responseText = '';
        if (rawText.includes('风险') || rawText.includes('问题')) {
          responseText = `通过对您提问中的【风险点】进行切片式抓取，该类高精创赛项目普遍的核心瓶颈通常集中在 **“场景落地可行性”** 这一项指标。要打动大基金评委，您的商业计划书（BP）中必须明确指明：1. 初期如何拿到精准的数据集？ 2. 现金流预测部分，销售客单价与大客户续签周期的自洽。建议您可以上传更详尽的技术方案或BP文件，让我直接为您进行更全面的多因子核对。`;
        } else if (rawText.includes('人工智能') || rawText.includes('AI') || rawText.includes('算法')) {
          responseText = `AI/算法项目的可行性报告重点在于阐述**“为何此处的深度学习是必需的，而不是为了概念而强行封装”**。我们智能体的大赛定版套路指出，此类报告应主要突出：技术参数指标（例如推理延迟、精准度回归比、多传感边缘吞吐率）与传统的低端逻辑之代际差距。这正好是我们【${selectedScenario}】的核心强项。`;
        } else {
          responseText = `收到！我已让「${assistants.find(a => a.id === activeAgentId)?.name}」对您的诉求开展关联深度研判。当前选择的专家模式为【${selectedScenario}】，采用【${speedMode === 'deep' ? '深度推断' : '极速验证'}】技术栈。让我们携手把这份商业材料推敲至极致，您可以试着上传具体的 .docx / .pdf 文件以解锁大盘多因子雷达打分。`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: `resp-${Date.now()}`,
            sender: 'agent',
            text: responseText,
            timestamp: '刚刚'
          }
        ]);
        setIsThinking(false);
      }, 1200);
    }
  };

  // Fake drag-and-drop file upload triggers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
      processUploadSimulation(file.name);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const processUploadSimulation = (name: string) => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            // Auto prompt send if file uploaded
            setInputText(`请针对我最新上传的文件「${name}」进行深度投资分析与可行性诊断评分。`);
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full" id="ai_agent_studio_main_container">
      
      {/* 1:1 Replica secondary sidebar matching Image 2 exactly - Left Column */}
      <div className="w-full lg:w-76 shrink-0" id="my_assistants_secondary_sidebar">
        <div className="bg-white border border-[#DDE8F5] rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(34,86,160,0.02)] flex flex-col justify-between h-[660px] sticky top-8 hover:shadow-[0_8px_30px_rgba(34,86,160,0.04)] transition-all">
          
          {/* Top section containing Header and Menus */}
          <div className="space-y-4 flex-1">
            
            {/* Header with geometric folding logo, title and toggle icon */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100/65">
              <div className="flex items-center gap-2.5">
                {/* High-fidelity Origami folding gradient arrow logo */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-blue-50/40 to-cyan-50/40 relative">
                  <svg viewBox="0 0 24 24" className="w-5.5 h-5.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13L21 4L16 19L11.5 13.5L3 13Z" fill="url(#airplane-grad-main-v)" />
                    <path d="M11.5 13.5L21 4L16 19L11.5 13.5Z" fill="url(#airplane-grad-fold-v)" />
                    <defs>
                      <linearGradient id="airplane-grad-main-v" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                      </linearGradient>
                      <linearGradient id="airplane-grad-fold-v" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-base font-bold text-slate-800 tracking-tight">超级智能体</span>
              </div>
              
              {/* Thin stroke layout column split action icon */}
              <button 
                onClick={() => {
                  setInputText("您点击了侧栏收起。当前主窗体正最大化展示核心工作台模式。");
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100/80 transition-colors cursor-pointer group"
                title="收起侧栏"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-550 group-hover:text-[#0A66FF] transition-colors" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v16" />
                </svg>
              </button>
            </div>

            {/* Navigation list matching Image 2 */}
            <div className="space-y-1 pt-1.5 select-none">
              
              {/* Item: 首页 */}
              <button 
                onClick={() => {
                  setSubActiveTab('home');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left",
                  subActiveTab === 'home'
                    ? "bg-[#F3F8FF] text-[#0A66FF]" 
                    : "text-slate-655 hover:text-slate-900 hover:bg-slate-55"
                )}
              >
                <Home className={cn("w-4 h-4", subActiveTab === 'home' ? "text-[#0A66FF]" : "text-slate-450")} strokeWidth={subActiveTab === 'home' ? 2.5 : 2} />
                <span>首页</span>
              </button>

              {/* Item: 新建项目 */}
              <button 
                onClick={() => {
                  setSubActiveTab('new_project');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left",
                  subActiveTab === 'new_project'
                    ? "bg-[#F3F8FF] text-[#0A66FF]" 
                    : "text-slate-450 hover:text-slate-900 hover:bg-slate-55"
                )}
              >
                <PlusSquare className={cn("w-4 h-4", subActiveTab === 'new_project' ? "text-[#0A66FF]" : "text-slate-450")} strokeWidth={subActiveTab === 'new_project' ? 2.5 : 2} />
                <span>新建项目</span>
              </button>

              {/* Item: 期刊订阅 */}
              <button 
                onClick={() => {
                  setSubActiveTab('journals');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left",
                  subActiveTab === 'journals'
                    ? "bg-[#F3F8FF] text-[#0A66FF]" 
                    : "text-slate-655 hover:text-slate-900 hover:bg-slate-55"
                )}
              >
                <BookOpen className={cn("w-4 h-4", subActiveTab === 'journals' ? "text-[#0A66FF]" : "text-slate-450")} strokeWidth={subActiveTab === 'journals' ? 2.5 : 2} />
                <span>期刊订阅</span>
              </button>

            </div>

            {/* Subsection heading line: 项目 */}
            <div className="pt-4">
              <span className="text-[11px] font-black uppercase text-slate-400/90 tracking-wider block px-3 mb-2 select-none">
                项目
              </span>

              {/* Project items list with high fidelity layout & dots menu */}
              <div className="space-y-1">
                <div 
                  onClick={() => {
                    setSubActiveTab('home');
                    setActiveProjectItem('博创赛创业组计划书');
                    setInputText("请针对我这篇完整的《博创赛创业组计划书》重新进行雷达评估与离群建模。");
                    handleSendMessage("请针对我这篇完整的《博创赛创业组计划书》重新进行雷达评估与离群建模。");
                  }}
                  className={cn(
                    "group flex items-center justify-between px-2.5 py-2.5 rounded-xl cursor-pointer text-xs transition-all",
                    activeProjectItem === '博创赛创业组计划书'
                      ? "bg-[#F3F8FF]/70 text-[#0A66FF] border border-[#BFD8FF]/30 font-bold"
                      : "text-slate-700 hover:bg-slate-50/80"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Left icon 1: message bubble */}
                    <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2} />
                    
                    {/* Left icon 2: notebook/pencil sign */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <SquarePen className="w-3.5 h-3.5 text-slate-550 shrink-0" strokeWidth={2} />
                      <span className="truncate pr-1 text-[11px] text-slate-700 font-bold tracking-tight">
                        博创赛创业组计划书
                      </span>
                    </div>
                  </div>

                  {/* Rightmark options ellipsis menu */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setInputText("展开博创赛创业组计划书的导出、重命名、分享以及审计操作...");
                    }}
                    className="opacity-60 hover:opacity-100 hover:bg-slate-100 p-1 rouned transition-all shrink-0"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom block: "全部历史" (All History) with a stylish outline card footer layout */}
          <div className="pt-3 border-t border-slate-100/70 select-none">
            <button 
              onClick={() => {
                setSubActiveTab('home');
                setInputText("请帮我拉取当前节点下的完整历史诊断资产及分析报告列表。");
                handleSendMessage("请帮我拉取当前节点下的完整历史诊断资产及分析报告列表。");
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] border border-slate-200/50 hover:bg-[#F1F5F9] text-slate-650 hover:text-slate-800 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-98"
              id="all_history_btn"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" strokeWidth={2} />
              <span>全部历史</span>
            </button>
          </div>

        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0 w-full space-y-8">
        
        {subActiveTab === 'home' && (
          <>
            {/* Immersive Tencent Yuanbao style workspace header */}
            <div className="w-full max-w-4xl mx-auto text-center" id="agent_header_banner">
              {messages.length <= 1 ? (
                <div className="flex flex-col items-center justify-center pt-12 pb-6 text-center select-none animate-fade-in">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight font-sans mb-3 mt-4 select-none">
                    Hi，今天从哪里开始
                  </h1>

                  <p className="text-slate-500 font-semibold text-sm max-w-lg leading-relaxed mb-6">
                    我是你的团队决策 AI 助手。你可以直接向我提问，或者在下方上传项目计划书等文档，我会为你进行精准的项目可行性诊断与行业趋势评估。
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0A66FF]" />
                    <span className="text-sm font-black text-slate-850">正在与「{selectedScenario}助理」进行深度会话</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] text-slate-400 font-bold">超级算子安全合规</span>
                  </div>
                </div>
              )}

              {/* --- Main Interactive Prompting Area --- */}
              <div className="mt-2 bg-white border border-slate-200/80 rounded-[1.5rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative focus-within:ring-2 focus-within:ring-[#8BBEFF]/40 transition-all text-left" id="super_prompt_box">
                
                {/* Badge indicator inside prompt box */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black bg-[#EAF2FF] text-[#0A66FF] border border-[#BFD8FF]">
                    {expertMode === 'document' ? '文档模式' : expertMode === 'website' ? '网站模式' : '幻灯片模式'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    请输入报告主题或具体需求，甚至直接上传文件，让超级智能体辅助进行投资测算与趋势预测。
                  </span>
                </div>

                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="在此键入您的项目核心痛点或者直接输入分析诉求（如：请帮我分析工业传感器通信离群回归BP）..."
                  className="w-full min-h-[90px] h-24 bg-transparent outline-none border-none resize-none text-slate-800 text-sm placeholder:text-slate-400 font-medium focus:ring-0"
                  id="prompt_textarea"
                />

                {/* Under Prompt Action bar mimicking screenshot */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-[#52657A] font-bold relative" id="prompt_action_bar">
                  
                  {/* Left Options Group */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Dropdown 1: Expert mode selector (幻灯片/网站/文档) */}
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setIsExpertDropdownOpen(!isExpertDropdownOpen);
                          setIsScenarioDropdownOpen(false);
                          setIsSpeedDropdownOpen(false);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-[#F3F8FF] hover:bg-[#EAF2FF] text-[#0A66FF] rounded-lg transition-colors cursor-pointer"
                        id="btn_expert_mode"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {expertMode === 'document' ? '文档模式' : expertMode === 'website' ? '网站模式' : '幻灯片模式'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>
                      
                      <AnimatePresence>
                        {isExpertDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-[#DDE8F5] rounded-xl shadow-lg p-1.5 z-50 text-slate-700"
                          >
                            {[
                              { id: 'document', title: '文档模式', desc: '高效搞定长文创作需求' },
                              { id: 'website', title: '网站模式', desc: '轻松建站增强转化' },
                              { id: 'slides', title: '幻灯片模式', desc: '一键搞定PPT创作' }
                            ].map(mode => (
                              <button
                                key={mode.id}
                                onClick={() => {
                                  setExpertMode(mode.id as any);
                                  setIsExpertDropdownOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left p-2 rounded-lg hover:bg-[#F3F8FF] hover:text-[#0A66FF] flex items-center justify-between transition-all font-bold text-xs",
                                  expertMode === mode.id && "bg-[#F3F8FF] text-[#0A66FF]"
                                )}
                              >
                                <div>
                                  <p>{mode.title}</p>
                                  <span className="text-[9px] text-slate-400 font-normal">{mode.desc}</span>
                                </div>
                                {expertMode === mode.id && <Check className="w-3.5 h-3.5 text-[#0A66FF]" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dropdown 2: Apply Scenario matching exact image */}
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setIsScenarioDropdownOpen(!isScenarioDropdownOpen);
                          setIsExpertDropdownOpen(false);
                          setIsSpeedDropdownOpen(false);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-slate-50 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer text-slate-700"
                        id="btn_apply_scenario"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        <span>{selectedScenario}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>

                      <AnimatePresence>
                        {isScenarioDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 bottom-full mb-2 w-72 max-h-80 bg-white border border-[#DDE8F5] rounded-xl shadow-xl p-2 z-50 overflow-y-auto scrollbar-none"
                          >
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase px-2 py-1.5 tracking-wider border-b border-slate-50">适用场景</p>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              {scenarios.map(s => (
                                <button
                                  key={s.label}
                                  onClick={() => {
                                    setSelectedScenario(s.label);
                                    setIsScenarioDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "text-left p-1.5 rounded-lg hover:bg-slate-50 flex flex-col justify-center transition-all cursor-pointer border border-transparent",
                                    selectedScenario === s.label && "bg-[#F3F8FF] border-[#BFD8FF] text-[#0A66FF]"
                                  )}
                                >
                                  <span className="text-xs font-bold leading-tight">{s.label}</span>
                                  <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">{s.desc}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Dropdown 3: Speed / Deep selector */}
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setIsSpeedDropdownOpen(!isSpeedDropdownOpen);
                          setIsExpertDropdownOpen(false);
                          setIsScenarioDropdownOpen(false);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-[#FFF9E6] hover:bg-[#FFE7A8]/60 text-amber-600 rounded-lg transition-colors cursor-pointer"
                        id="btn_speed_mode"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{speedMode === 'rapid' ? '极速模式' : '深度模式'}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>

                      <AnimatePresence>
                        {isSpeedDropdownOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 bottom-full mb-2 w-56 bg-white border border-[#DDE8F5] rounded-xl shadow-lg p-2.5 z-50 text-slate-700 text-xs"
                          >
                            {[
                              { id: 'rapid', title: '极速模式', desc: '专为高效创作设计，省去繁复环节，助你直达目标，快速完成内容构建与输出，实现快速验证。' },
                              { id: 'deep', title: '深度模式', desc: '功能全面，内核强大。致力于处理复杂任务，助你透彻解析问题，获得周密洞察与精准结果。' }
                            ].map(mode => (
                              <button
                                key={mode.id}
                                onClick={() => {
                                  setSpeedMode(mode.id as any);
                                  setIsSpeedDropdownOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left p-2 rounded-lg hover:bg-[#FFF9E6] hover:text-amber-700 flex flex-col transition-all font-bold gap-0.5 mb-1 last:mb-0",
                                  speedMode === mode.id && "bg-[#FFF9E6] text-amber-700 border border-amber-200"
                                )}
                              >
                                <span className="flex items-center justify-between w-full">
                                  <span>{mode.title}</span>
                                  {speedMode === mode.id && <Check className="w-3.5 h-3.0 text-amber-600" />}
                                </span>
                                <span className="text-[9px] text-slate-400 font-normal leading-normal">{mode.desc}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* Right Group: Upload & Send buttons */}
                  <div className="flex items-center gap-3">
                    {/* File Upload Hidden Input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".docx,.doc,.pdf,.pptx,.ppt,.xlsx,.xls,.txt"
                    />

                    <button 
                      onClick={triggerFileUpload}
                      disabled={isUploading}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 border border-[#DDE8F5] hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer text-slate-600 font-bold",
                        isUploading ? "opacity-70 pointer-events-none" : ""
                      )}
                      id="btn_upload_attachment"
                    >
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0A66FF]" />
                      ) : (
                        <Paperclip className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploading ? `上传中 ${uploadProgress}%` : uploadedFile ? `已就绪: ${uploadedFile.name.substring(0, 10)}...` : '上传附件'}</span>
                    </button>

                    <button 
                      onClick={() => handleSendMessage()}
                      disabled={inputText.trim() === '' && !uploadedFile}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 bg-[#0A66FF] hover:bg-[#0A66FF]/95 text-white font-bold rounded-lg transition-all active:scale-95 cursor-pointer shadow-md shadow-blue-500/15 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
                      )}
                      id="btn_prompt_submit"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>求解</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Suggestion Guides - "Guess What You Want to Ask" */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs" id="guess_you_ask_container">
                <span className="text-slate-400 font-extrabold flex items-center gap-1 mr-1 select-none whitespace-nowrap">
                  <HelpCircle className="w-3.5 h-3.5" />
                  猜你想问：
                </span>
                {suggestions.map((sg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(sg.text);
                      handleSendMessage(sg.text);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE8F5] text-slate-600 rounded-full font-bold hover:bg-[#F3F8FF] hover:border-[#8BBEFF] hover:text-[#0A66FF] transition-all cursor-pointer"
                  >
                    {sg.icon}
                    <span>{sg.text}</span>
                  </button>
                ))}
              </div>

            </div>

            {/* Wide, immersive centered dialogue history with no left side assistants */}
            {messages.length > 1 && (
              <div className="w-full max-w-4xl mx-auto space-y-6" id="dialogue_history_container">
                
                <div className="bg-white border border-slate-200/80 rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] min-h-[500px] flex flex-col relative" id="dialogue_scrollable_card">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#12A870] animate-pulse" />
                <h3 className="text-sm font-black text-slate-800">当前会话洞察记录</h3>
              </div>
              <button 
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome',
                      sender: 'agent',
                      text: '嘿，您好！工作台会话已重置。您可以直接键入新痛点或在框中重新拖入项目计划。',
                      timestamp: '刚刚'
                    }
                  ]);
                }}
                className="text-xs font-bold text-slate-400 hover:text-[#0A66FF] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>置空记录</span>
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar min-h-[350px]">
              {messages.map((msg, mIdx) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div key={msg.id} className="space-y-2">
                    {/* Message Header */}
                    <div className={cn(
                      "flex items-center gap-2.5",
                      isAgent ? "justify-start" : "justify-end"
                    )}>
                      {isAgent && (
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A66FF]">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      
                      <span className="text-[11px] font-black text-slate-400">
                        {isAgent ? `${selectedScenario}助理` : '您'} · {msg.timestamp}
                      </span>

                      {!isAgent && (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                          <Users className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Message Content Bubble */}
                    <div className={cn(
                      "flex",
                      isAgent ? "justify-start" : "justify-end"
                    )}>
                      <div className={cn(
                        "max-w-[90%] rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-sm",
                        isAgent
                          ? "bg-[#FBFDFF] border border-[#DDE8F5] text-slate-800 rounded-tl-none"
                          : "bg-[#0A66FF] text-white rounded-tr-none"
                      )}>
                        {msg.fileName && (
                          <div className="mb-2 bg-white/10 dark:bg-black/10 px-3 py-2 rounded-xl flex items-center gap-2 font-bold mb-2 text-[11px]">
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate">{msg.fileName}</span>
                            <span className="text-[10px] opacity-70 shrink-0">(分析载体)</span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>

                    {/* Highly Structured Investment Analysis Output Card */}
                    {msg.analysisReport && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-[#FAFCFF] to-[#FFFFFF] border-2 border-[#8BBEFF]/45 rounded-2xl shadow-md space-y-6 relative overflow-hidden"
                      >
                        {/* Apple delicate top progress rating tag */}
                        <div className="absolute top-0 right-0 p-4 shrink-0 flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">可行性核评得分</span>
                            <span className="text-2xl font-black text-[#0A66FF]">{msg.analysisReport.score}</span>
                          </div>
                          <div className="w-10 h-10 bg-[#EAF2FF] text-[#0A66FF] rounded-full flex items-center justify-center font-black">
                            <BadgeCheck className="w-6 h-6 shrink-0" />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#0045c4] font-black uppercase tracking-wider block">项目立项资产深度分析报告</span>
                          <h4 className="text-lg font-black text-slate-800 pr-24 mt-1 border-b border-slate-100 pb-3">{msg.analysisReport.projectName}</h4>
                        </div>

                        {/* Comparative metrics sliders */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-4">
                            <h5 className="font-extrabold text-slate-700 text-xs flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5 text-[#0A66FF]" />
                              多因子雷达特征自洽打分
                            </h5>
                            
                            <div className="space-y-3">
                              {msg.analysisReport.radarMetrics.map((met, mIdx) => (
                                <div key={mIdx} className="space-y-1">
                                  <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-slate-600">{met.name}</span>
                                    <span className="text-[#0A66FF]">{met.value}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                                    <div 
                                      className="h-full bg-gradient-to-r from-blue-400 to-[#0A66FF] rounded-full transition-all duration-1000" 
                                      style={{ width: `${met.value}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Primary Valuations and Category grade */}
                          <div className="bg-[#F3F8FF]/50 border border-blue-100 p-4 rounded-xl flex flex-col justify-between space-y-4">
                            <div>
                              <span className="text-[9px] text-[#0045c4] font-black uppercase tracking-wider block">智能投前估值回归模型</span>
                              <p className="text-xl font-black text-slate-800 tracking-tight mt-1">{msg.analysisReport.valuationEstimate}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 pt-3">
                              <div>
                                <span className="text-slate-400 font-bold block">推荐投资系数</span>
                                <span className="text-slate-700 font-extrabold mt-0.5 block">{msg.analysisReport.investmentGrade}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block">目标方向适配度</span>
                                <span className="text-emerald-600 font-extrabold mt-0.5 block truncate">{msg.analysisReport.marketPotential}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Major highlights (Positives) & Identified issues (Risks) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-2">
                            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider block">项目亮点及可行策略 (Strengths)</span>
                            <div className="bg-emerald-50/40 border border-emerald-100 p-3.5 rounded-xl space-y-2">
                              {msg.analysisReport.positives.map((p, pIdx) => (
                                <div key={pIdx} className="flex gap-2">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-[11px] text-slate-700 leading-normal">{p}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider block">潜在制约与合规安全缺陷 (Gaps)</span>
                            <div className="bg-rose-50/40 border border-rose-100 p-3.5 rounded-xl space-y-2">
                              {msg.analysisReport.risks.map((r, rIdx) => (
                                <div key={rIdx} className="flex gap-2">
                                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full shrink-0 mt-1.5" />
                                  <p className="text-[11px] text-slate-700 leading-normal">{r}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Extracted SWOT analysis details (苹果淡蓝面板风格) */}
                        <div className="border-t border-slate-100 pt-4" id="swot_section">
                          <span className="text-[10px] text-indigo-500 font-black uppercase tracking-wider block mb-3">多因次 SWOT 离散矩阵图谱</span>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                              <span className="text-[9px] font-extrabold text-blue-600 block">S (优势力量)</span>
                              <p className="text-[10px] text-slate-600 leading-tight mt-1 line-clamp-2">{msg.analysisReport.swotAnalysis.strengths[0]}</p>
                            </div>
                            <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                              <span className="text-[9px] font-extrabold text-amber-500 block">W (软肋与缺失)</span>
                              <p className="text-[10px] text-slate-600 leading-tight mt-1 line-clamp-2">{msg.analysisReport.swotAnalysis.weaknesses[0]}</p>
                            </div>
                            <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                              <span className="text-[9px] font-extrabold text-emerald-500 block">O (外部溢价机遇)</span>
                              <p className="text-[10px] text-slate-600 leading-tight mt-1 line-clamp-2">{msg.analysisReport.swotAnalysis.opportunities[0]}</p>
                            </div>
                            <div className="p-2.5 bg-white border border-slate-100 rounded-lg">
                              <span className="text-[9px] font-extrabold text-rose-500 block">T (技术壁垒威胁)</span>
                              <p className="text-[10px] text-slate-600 leading-tight mt-1 line-clamp-2">{msg.analysisReport.swotAnalysis.threats[0]}</p>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Waiting Agent Dialogue State */}
              {isThinking && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0A66FF]">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0A66FF]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      超级智能体正在通过【{selectedScenario || '可行性分析报告'} / {speedMode === 'deep' ? '深度推理算子' : '微循环专家网络'}】解构回归中...
                    </span>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-[#F0F6FF]/60 border border-[#8BBEFF]/20 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 shadow-inner flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#0A66FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#0A66FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#0A66FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                      <span>正在提炼同赛道千条研报及风险论证因子，并生成立项分析指标，请稍等...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
            )}
          </>
        )}

        {/* 2. CREATE PROJECT TAB (新建项计划书评估) */}
        {subActiveTab === 'new_project' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            id="new_project_tab_view"
          >
            {/* Header section with description */}
            <div className="bg-white border border-[#DDE8F5] rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(34,86,160,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-800">新建投资与项目可行性评估</h3>
                <p className="text-xs text-slate-400 font-bold mt-1">您可在此填写项目基本因子，或直接拖入立项及商业计划文档启动离群推演、多维度测算。</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0A66FF] animate-pulse" />
                <span className="text-xs font-bold text-slate-500">双创特设极速通道</span>
              </div>
            </div>

            {/* Main Interactive Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Entry Column - 7 Cols */}
              <div className="lg:col-span-7 bg-white border border-[#DDE8F5] rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(34,86,160,0.02)] space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">第一阶段: 立项基础信息参数录入</h4>
                </div>

                <div className="space-y-4">
                  {/* Project Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">项目/计划书官方名称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      placeholder="例如：智慧冷链运输温控制冷中枢系统计划书"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] text-xs font-bold rounded-xl outline-none transition-all placeholder:text-slate-400"
                      value={inputText.startsWith("我想评估项目：") ? inputText.replace("我想评估项目：", "") : ""}
                      onChange={(e) => setInputText(`我想评估项目：${e.target.value}`)}
                    />
                  </div>

                  {/* Advisor Mode & Scenario Selectors side-by-side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">偏好专家辅助模型</label>
                      <select 
                        value={activeAgentId}
                        onChange={(e) => setActiveAgentId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl outline-none text-slate-700 focus:bg-white focus:border-[#0A66FF]"
                      >
                        <option value="agent-1">可行性分析专家</option>
                        <option value="agent-2">商业估值专家</option>
                        <option value="agent-3">行业多面手</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">拟申报成果类别</label>
                      <select 
                        value={selectedScenario}
                        onChange={(e) => setSelectedScenario(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl outline-none text-slate-700 focus:bg-white focus:border-[#0A66FF]"
                      >
                        {scenarios.map(s => (
                          <option key={s.label} value={s.label}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Goal Focus */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">核心研究定位与需求诉求</label>
                    <textarea 
                      rows={3}
                      placeholder="在此描述项目创新度，例如：「高精医疗芯片边缘制冷」或「冷链多联运节点调度系统」..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] text-xs font-bold rounded-xl outline-none transition-all leading-relaxed placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* ROI slider & Cloud chain authorization */}
                  <div className="bg-[#FAFBFD] border border-slate-100 rounded-xl p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">预期投资回报期限制约</span>
                        <span className="text-xs font-black text-[#0A66FF]">{speedMode === 'deep' ? '深度推算 24个月起' : '常规 36个月估测'}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        defaultValue="3"
                        className="w-full accent-[#0A66FF] cursor-pointer"
                        onChange={(e) => {
                          if (parseInt(e.target.value) >= 4) {
                            setSpeedMode('deep');
                          } else {
                            setSpeedMode('rapid');
                          }
                        }}
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
                        <span>1年(超常)</span>
                        <span>2年</span>
                        <span>3年(平均)</span>
                        <span>4年</span>
                        <span>5年以上</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                      <input 
                        type="checkbox" 
                        id="cloud_chain_auth_ch" 
                        defaultChecked
                        className="mt-0.5 rounded border-slate-300 text-[#0A66FF] focus:ring-[#0A66FF] cursor-pointer w-3.5 h-3.5" 
                      />
                      <label htmlFor="cloud_chain_auth_ch" className="text-[11px] text-slate-550 font-bold select-none cursor-pointer leading-tight">
                        我同意授权博创网智能大模型在评估流程中提取项目脱敏摘要，并将其哈希值锚定至防篡改分布式安全数据库中，以防止内容抄袭与泄密。
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              {/* Document Drag-Drop Upload Column - 5 Cols */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Drag Frame */}
                <div className="bg-white border border-[#DDE8F5] rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(34,86,160,0.02)] space-y-5 flex flex-col justify-between h-[350px]">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">第二阶段: 双创诊断源文件上传</h4>
                  </div>

                  <div 
                    onClick={triggerFileUpload}
                    className={cn(
                      "flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer select-none",
                      isUploading 
                        ? "border-[#8BBEFF] bg-[#F4F9FF]" 
                        : uploadedFile 
                          ? "border-[#4ADE80]/70 bg-[#F0FDF4]/50" 
                          : "border-slate-200 bg-slate-50 hover:bg-[#F3F8FF] hover:border-[#8BBEFF]"
                    )}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".docx,.doc,.pdf,.txt"
                      className="hidden"
                    />

                    {isUploading ? (
                      <div className="space-y-3 w-full max-w-[200px]">
                        <Loader2 className="w-8 h-8 animate-spin text-[#0A66FF] mx-auto" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">正在高速提取语义...</p>
                          <p className="text-[10px] text-slate-400 mt-1">进度: {uploadProgress}%</p>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#0A66FF] h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    ) : uploadedFile ? (
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-[#E8FDF0] border border-[#A7F3D0] rounded-xl flex items-center justify-center text-emerald-600 mx-auto">
                          <Check className="w-5 h-5" strokeWidth={3} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 line-clamp-1">{uploadedFile.name}</p>
                          <p className="text-[10px] text-emerald-600 font-extrabold mt-0.5">上传并读取完成 ({uploadedFile.size})</p>
                        </div>
                        <span className="inline-block text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded mt-1 hover:bg-slate-200 transition-colors">重新上传文件</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#0A66FF] mx-auto">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800">将您的项目材料拖至此处，或点击浏览</p>
                          <p className="text-[10px] text-slate-400 mt-1">支持 Word, PDF, Text 格式 (最大限制 40MB)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (!uploadedFile) {
                        // Generate a dummy demo file for interactive feedback
                        setUploadedFile({ name: '交通枢纽低耗绿能自适应系统商业计划书.docx', size: '2.4 MB' });
                        processUploadSimulation('交通枢纽低耗绿能自适应系统商业计划书.docx');
                      } else {
                        // File exists, run standard evaluation in Home tab
                        const fn = uploadedFile.name;
                        setSubActiveTab('home');
                        setInputText(`请针对我最新上传的文件「${fn}」进行深度投资分析与可行性诊断评分。`);
                        simulateFileAnalysis(fn);
                      }
                    }}
                    className={cn(
                      "w-full py-3 text-xs font-bold rounded-xl transition-all duration-200 shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer",
                      uploadedFile 
                        ? "bg-[#0A66FF] hover:bg-[#0055e0] text-white" 
                        : "bg-[#F3F8FF] hover:bg-[#E2EFFF] text-[#0A66FF] border border-[#BFD8FF]/70"
                    )}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{uploadedFile ? "启动一键全因子智能评估" : "使用测试示例文件评估"}</span>
                  </button>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-tr from-[#003cb5] to-[#0A66FF] rounded-[1.5rem] p-6 text-white space-y-4 shadow-lg select-none relative overflow-hidden">
                  <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
                    <TrendingUp className="w-44 h-44" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" strokeWidth={2.5} />
                    <span className="text-xs font-black tracking-wider uppercase">博创数智流一揽子校准指标</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-95">
                    根据「首发发明人学术链路」及「百人种子基金池离群估值评定」双重检验协议，凡通过本工作台导出的 PDF 报告，均可享有机密防伪链上认证资质，提升融资与申报双创竞赛的通过概率。
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* 3. JOURNALS TAB (学术期刊/竞赛精选订阅) */}
        {subActiveTab === 'journals' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
            id="journals_tab_view"
          >
            {/* Header and Filter categories with high-end matching layout */}
            <div className="bg-white border border-[#DDE8F5] rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(34,86,160,0.02)] space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-800 font-sans tracking-tight font-extrabold text-slate-800">博创智能期刊精选订阅</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">汇聚国家级双创竞赛特等奖计划书范本与各行业专家学者对投资可行性的前瞻共识评级。</p>
                </div>
                <span className="text-[10px] font-bold text-[#0A66FF] bg-[#F3F8FF] px-2.5 py-1 rounded shadow-sm shrink-0 uppercase tracking-tight">更新至 2026 最新赛季</span>
              </div>

              {/* Compact horizontal category filter row */}
              <div className="flex flex-wrap items-center gap-1.5 select-none" id="journals_compact_category_filters">
                <span className="text-[10px] font-black uppercase text-slate-400 mr-2 tracking-wide">期刊分类 :</span>
                {['全部订阅', '双创国赛冠军样本', '投资立项白皮书', '行业多源流回归', '学者论文共识'].map((cat, catIdx) => (
                  <button 
                    key={cat} 
                    onClick={() => {
                      setInputText(`我想筛选关于【${cat}】的权威期刊并展开分析...`);
                      handleSendMessage(`我想筛选关于【${cat}】的权威期刊并展开分析...`);
                    }}
                    className={cn(
                      "px-3 py-1 text-[11px] font-bold rounded-lg cursor-pointer transition-all border",
                      catIdx === 0
                        ? "bg-[#0A66FF] border-[#0A66FF] text-white hover:bg-[#0055e0]"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Bento Grid: 3 Column Journals Collection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'j-1',
                  title: '国家级特等奖: 城市高密集无人网格低延迟红绿灯优化商业书',
                  author: '李博川等团队 · 2025创赛特等奖',
                  category: '双创国赛冠军样本',
                  categoryColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                  icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
                  stats: { score: '99.2%', citation: '1240+ 频次' },
                  desc: '对多源流智能融合算法与边缘端GPU超帧微调架构提供了完整的可行性商业论证。'
                },
                {
                  id: 'j-2',
                  title: '智慧节能与工业能效优化系统：重工业多机舱工况回归白皮书',
                  author: '张建军教授 · 国家低耗能工程中心',
                  category: '投资立项白皮书',
                  categoryColor: 'bg-indigo-55 text-indigo-600 border-indigo-100',
                  icon: <Activity className="w-5 h-5 text-indigo-600" />,
                  stats: { score: '98.5%', citation: '840+ 频次' },
                  desc: '深入剖析工业变压传感高频波动过滤模型，提供精确的折旧损耗与千万级财务估测方法。'
                },
                {
                  id: 'j-3',
                  title: '2026年投资风口解读：具身智能与大模型联合边缘侧制密合规白皮书',
                  author: '博创智能创投研究院 · 首席宏观顾问',
                  category: '行研专家共识',
                  categoryColor: 'bg-purple-50 text-purple-600 border-purple-100',
                  icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
                  stats: { score: '97.9%', citation: '1690+ 频次' },
                  desc: '拆解多因子红海规避路径，阐明目前天使轮投资极刚性数据要素合规审查红线。'
                },
                {
                  id: 'j-4',
                  title: '离群自适应高阶智能回归：学术原理与分布式水印防伪安全溯源报告',
                  author: '王丽华博士 · 国家信息网金融审计小组',
                  category: '学者论文共识',
                  categoryColor: 'bg-amber-50 text-amber-600 border-amber-100',
                  icon: <Check className="w-5 h-5 text-amber-600 font-extrabold" />,
                  stats: { score: '99.5%', citation: '450+ 频次' },
                  desc: '该研究彻底论证了博创防篡改数字安全在创投契约文件中的防泄漏原理。'
                },
                {
                  id: 'j-5',
                  title: '农业大棚多光谱无人机智巡与农情评估诊断完整项目方案',
                  author: '博创双创百强优秀计划 · 天使种子池',
                  category: '双创国赛冠军样本',
                  categoryColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                  icon: <Coins className="w-5 h-5 text-emerald-600" />,
                  stats: { score: '95.4%', citation: '520+ 频次' },
                  desc: '展示了如何利用高分辨率对地测算对特定果作物生长曲线进行ROI投资回报推算。'
                },
                {
                  id: 'j-6',
                  title: '跨国技术供应链摩擦背景下：科创企业高密集硬件采购风险缓解方案',
                  author: '亚太半导体材料联合会 · 高级审计组',
                  category: '行研专家共识',
                  categoryColor: 'bg-purple-50 text-purple-600 border-purple-100',
                  icon: <Building className="w-5 h-5 text-purple-600" />,
                  stats: { score: '94.8%', citation: '310+ 频次' },
                  desc: '对大算力芯片采购周期、多联海运、供应链应急托管提供了多条自洽的可行性防御措施。'
                }
              ].map(journal => (
                <div 
                  key={journal.id}
                  className="bg-white border border-[#DDE8F5] rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(34,86,160,0.02)] flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(34,86,160,0.06)] hover:border-[#BFD8FF] hover:translate-y-[-2px] transition-all duration-200"
                >
                  <div className="space-y-3.5">
                    {/* Header badge & icon */}
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider", journal.categoryColor)}>
                        {journal.category}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-500">
                        {journal.icon}
                      </div>
                    </div>

                    {/* Article title */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 line-clamp-2 hover:text-[#0A66FF] transition-colors cursor-pointer leading-tight">
                        {journal.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold leading-none">{journal.author}</p>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-3">{journal.desc}</p>
                  </div>

                  {/* Actions & Stats footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between font-sans">
                    <div className="flex items-center gap-2.5 animate-none">
                      <div>
                        <p className="text-[8px] uppercase font-black text-slate-400 leading-none">相关度</p>
                        <p className="text-[11px] font-extrabold text-[#0A66FF] mt-0.5">{journal.stats.score}</p>
                      </div>
                      <div className="border-l border-slate-200 h-6 shrink-0" />
                      <div>
                        <p className="text-[8px] uppercase font-black text-slate-400 leading-none">研究引用</p>
                        <p className="text-[11px] font-extrabold text-slate-700 mt-0.5">{journal.stats.citation}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSubActiveTab('home');
                        const journalPrompt = `我读了您推荐的权威期刊《${journal.title}》，请结合该文中：【${journal.category}】核心学术理论，特别是其“${journal.stats.score}”精准匹配机制，帮我重新微调并论证我们当前项目方案中的可行性与投资溢价水平！`;
                        setInputText(journalPrompt);
                        handleSendMessage(journalPrompt);
                      }}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-[#F3F8FF] hover:border-[#BFD8FF] hover:text-[#0A66FF] text-slate-650 border border-slate-200/50 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                    >
                      阅读期刊
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
}

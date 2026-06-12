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
  MoreHorizontal,
  Globe,
  ArrowLeft
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

const MATCH_REPORTS: Record<string, {
  overall: number,
  tech: number,
  scale: number,
  condition: number,
  region: number,
  team: number,
  keywords: string[]
}> = {
  'dt-1': {
    overall: 95,
    tech: 98,
    scale: 92,
    condition: 96,
    region: 90,
    team: 94,
    keywords: ['数字经济', '算力基础设施', '补贴申领', '科技型企业', '制造业']
  },
  'dt-2': {
    overall: 88,
    tech: 90,
    scale: 85,
    condition: 89,
    region: 92,
    team: 86,
    keywords: ['创投辅导', 'Pre-A融资', '算法核心', '智能体订单']
  },
  'dt-3': {
    overall: 82,
    tech: 85,
    scale: 80,
    condition: 83,
    region: 81,
    team: 84,
    keywords: ['全球大势', '软件订阅', '自动采购', '中试商业化']
  },
  'dt-4': {
    overall: 91,
    tech: 93,
    scale: 88,
    condition: 92,
    region: 94,
    team: 90,
    keywords: ['创新创业', '国家级赛事', '政府补贴', '科创金奖']
  },
  'inv-1': {
    overall: 86,
    tech: 89,
    scale: 82,
    condition: 87,
    region: 85,
    team: 88,
    keywords: ['高校极客', '硬核算法', '种子培育', '初创基地']
  },
  'pol-1': {
    overall: 80,
    tech: 83,
    scale: 78,
    condition: 81,
    region: 80,
    team: 82,
    keywords: ['税收优惠', '加计扣除', '专精特新', '算法著作权']
  }
};

const getMatchReport = (id: string, score: number) => {
  if (MATCH_REPORTS[id]) return MATCH_REPORTS[id];
  return {
    overall: score,
    tech: Math.min(100, score + 3),
    scale: Math.max(50, score - 6),
    condition: Math.min(100, score + 1),
    region: Math.max(50, score - 5),
    team: Math.min(100, score - 2),
    keywords: ['科技型企业', '精细化工', '自主创新']
  };
};

const MOCK_OFFICIAL_WEBSITES: Record<string, {
  logo: string;
  logoSub: string;
  url: string;
  agency: string;
  referenceNum: string;
  date: string;
  source: string;
  title: string;
  subtitle?: string;
  contentParagraphs: string[];
  trendings: string[];
  qrTitle: string;
  downloadName?: string;
  categoryName: string;
}> = {
  'dt-1': {
    logo: '新浪新闻',
    logoSub: '新浪政务 > 正文',
    url: 'https://news.sina.com.cn/gov/policy/2026-06/doc-izgcwyv2026.shtml',
    agency: '浙江省经济和信息化厅',
    referenceNum: '浙经信发〔2026〕45号',
    date: '2026年6月5日 10:24',
    source: '浙江省经信厅政策直通车',
    title: '关于印发《浙江省2026年数字经济算力基础设施普惠申领与补贴指南》的通知',
    subtitle: '助力企业数智升级，全省智算产业优惠即报即审直达专案落地',
    contentParagraphs: [
      "为贯彻落实数字经济创新提质'一号发展工程'，进一步激发广大高新技术企业、专精特新中小企业算力创新活力，浙江省经济和信息化厅联合省数据局等九部门正式印发并公布《浙江省2026年数字经济算力基础设施普惠申领与补贴指南（暂行）》。",
      "指南指出，当前我省依托宁波、杭州、温州等核心智算节点，面向生物医药算力中心、精细化工多相流建模、新材料研发、高端工业控制系统的算力需求提供专项补贴及算力折扣券。",
      "符合条件的企业最高可获得本年度高达95%的算力结算总额折减支持，省、市、区三级专项匹配资金共设10亿元池，即报即受理，通过线上算法测算平台实现算法匹配核验免审即享、直达快办。",
      "本次发布针对重点行业算力需求特征、多因相态拓扑控制建模及质控系统进行倾斜。申报主体须为注册在本省的独立法人单位，具备一定算法沉淀、自建研发中试车间或实质参与工程技术研究项目。"
    ],
    trendings: [
      "关于公布2026年首批数字化车间与创新先导区企业名单的通知",
      "宁波海曙自适应流控技术重点实验基地科技培育资助意见",
      "如何利用‘算力优惠券’进行大规模流体拓扑模型参数校调"
    ],
    qrTitle: '新浪政务客户端',
    downloadName: '【附件下载】《2026年数字经济算力应用多阶段补贴申领细则附件表》.pdf',
    categoryName: '政策解读'
  },
  'dt-2': {
    logo: '红杉中国',
    logoSub: 'Sequoia Insights > Portals',
    url: 'https://www.sequoiacap.com/china/news/intel-future-explore-2026/',
    agency: '红杉中国 (Sequoia Capital China) 战略研投中心',
    referenceNum: 'SEQ-CN-2026-Q2-009',
    date: '2026年6月8日 15:40',
    source: '红杉数智未来早期创投发布台',
    title: '红杉数智未来探索专项成长基金开放本季度投资申报渠道与标准指南',
    subtitle: '聚焦硬核流体算法、分子拓扑建模及中试放大极高附加值实体',
    contentParagraphs: [
      "今日，红杉数智未来探索（Sequoia Intelligence Frontier）二期基金正式对外披露了本季度重点硬科技直通申报通道及多维度评估标准。",
      "本季度基金资金流重点定向向生命健康仿制药制备计算、工业端高抗逆控制系统算法、三维空间粒子拓扑重构以及宁波市重点智能高端微反应硬件产业联动项目等领域倾斜。预期直投额度为 Pre-A 轮至 B 轮中早期成长型科技实体。",
      "红杉表示，本次开放直通端口旨在发挥社会创投力量，无缝连接高校重点实验室、中试基地技术沉淀，通过技术匹配度测算算法模型，全方位赋能企业从早期孵化、中试放量向商业化成熟演进。",
      "极客技术合伙人级创始人可在线提交项目说明书、主营营收预期与中试生产线可行性验证文件，审核周期缩短至5个工作日。"
    ],
    trendings: [
      "硬科技在长三角中试车间的投资演进趋势分析",
      "如何向红杉中国申报早期硬核算法及流质控制项目",
      "精细化工高分子拓扑计算团队的商业闭环与估值模型"
    ],
    qrTitle: '红杉研投尊享号',
    downloadName: '【附件下载】《红杉中国数智未来二期基金申报白皮书》.pdf',
    categoryName: '投资机会'
  },
  'dt-3': {
    logo: '新浪财经',
    logoSub: '新浪财经 > 环球前沿科技报道',
    url: 'https://finance.sina.com.cn/tech/mckinsey/2026-05-28/doc-imckinsey.shtml',
    agency: '麦肯锡技术研究全球联合发布会 (McKinsey Global Tech)',
    referenceNum: 'MCK-TECH-REP-2026',
    date: '2026年5月28日 09:12',
    source: 'McKinsey Global Institute Tech Series',
    title: '麦肯锡发布年度展望：2026年全球智能体（AI Agent）软件订阅模式迎来爆发期',
    subtitle: '技术授权与SaaS中试核算模式助推宁波本土企业赢利模式相融性跃迁',
    contentParagraphs: [
      "根据全球领先的战略管理咨询机构麦肯锡最新发布的《2026年度全球技术展望与智能体落地蓝图》联合报告显示，全球超过80%的传统控制与化工制造及生命制药物料企业正在将其原有操作层与业务系统接入新一代智能体（AI Agent）及算法平台。",
      "报告深入总结分析了企业在工业流质比校调、拓扑分子模拟、供应链自动结算结算等场景中的极大规模赋能，智能流体调配工艺的整体反应转化速率和综合物料利用纯度平均实现30%至45%的实质性跃升。",
      "麦肯锡资深分析师指出，订阅型算法即服务（SaaS）及云边协同中试核算技术，正逐渐成为精细控制制造业和智能控制企业建立护城河的产业共识。预期未来三年，以订阅、技术授权等为主导的赢利模式将在宁波本地智能化制造业中占领绝对高地。"
    ],
    trendings: [
      "高抗逆性分子参数建模对数字孪生系统的促进作用",
      "软件订阅费率与中试放大基地的综合配给比例核定",
      "长三角地区智能制药产业链高级工程人才的需求预测"
    ],
    qrTitle: '新浪财经客户端',
    downloadName: '【智库报告】《2026年全球AI_Agent商业订阅爆发与工业合蓝图》.pdf',
    categoryName: '行业前沿'
  },
  'dt-4': {
    logo: '新浪政务',
    logoSub: '新浪政务 > 赛事通告',
    url: 'https://news.sina.com.cn/gov/science/2026-06/doc-iscience.shtml',
    agency: '科技部创新创业发展司赛事组委会',
    referenceNum: '科发创办〔2026〕18号',
    date: '2026年6月1日 11:30',
    source: '中华人民共和国科学技术部官方信息通告',
    title: '关于举办第十五届全国创新创业高规格科创大赛暨宁波智制造成果落地转化的通告',
    subtitle: '500万丰厚专项奖励资金与三年免租中试物理基地入驻红利',
    contentParagraphs: [
      "为积极响应国家高水平科技自立自强发展规划，营造产业群链健康融合生态，由科技部主办的第十五届全国创新创业高规格科创大赛已进入本季度最终申报窗口期。",
      "作为国内硬科技精细化成果转化的最高平台之一，历届大赛孵化了多项生命健康级材料成果。大赛对符合条件并成功晋级全国总决赛的优秀项目，不仅提供海量主流投资机构直连，更有最高达 500 万发展扶持，并可在宁波、海曙等地方智造先导示范园区里，享受三年租金免交、中试物理基地零成本落地等绝对优势。",
      "赛事特别鼓励在混料调配、生命原药纯度测算、微流变智能控制、拓扑网络算法等领域有实质科技创新的初创团队及重点实验室成果转化项目参赛。"
    ],
    trendings: [
      "第十五届大赛浙江赛区优秀项目成果展",
      "企业自筹、引进资金与大赛奖金的多通道配合方法",
      "海曙车间示范区首个中试项目日吞吐突破吨级报道"
    ],
    qrTitle: '科创中国助手',
    downloadName: '【附件下载】《第十五届全国创新创业大赛报名表及成果审核表》.docx',
    categoryName: '推荐赛事'
  },
  'inv-1': {
    logo: '真格基金',
    logoSub: 'ZhenFund > 创业资讯',
    url: 'https://www.zhenfund.com/news/future-star-2026-q2/',
    agency: '真格基金 (ZhenFund) 全球早期极客探索网络',
    referenceNum: 'ZF-SEED-2026-X11',
    date: '2026年6月3日 14:15',
    source: '真格基金官方创投网络',
    title: '真格未来之星早期种子培育专项：全面启动高校极客与硬核算法直通支持计划',
    subtitle: '专项额度500万元，极速匹配宁波精细化高能级物理中试车间无缝对接',
    contentParagraphs: [
      "真格基金今日正式启动2026年第二期'未来之星'早期种子及天使专项支持计划，本期特别针对处于极早期阶段的高校极客、重点实验室博士生课题项目设立硬核算法组直通道。",
      "本专项由真格基金领衔，针对高算力分子级计算反应釜、流质相流控制组件等前沿中试原型进行150万 - 500万不等的极速股权资助，并由顶级科学家与产业领军人物亲自进行技术转化辅导。",
      "真格基金一贯奉行'投人、投愿景、投最早期算法壁垒'理念，旨在为中国科研人员打通从黑板、实验仪器，到工厂车间和真正中试量产交付的最后一公里障碍。"
    ],
    trendings: [
      "从顶会论文到百平米中试洁净用房的发展路线图",
      "极早期项目融资金额与技术估值的基本谈判模型",
      "真格早期基金如何评价工业流体控制团队资质"
    ],
    qrTitle: '真格创投服务号',
    downloadName: '【双创参考】《真格早期硬科技投资框架与团队评估体系摘要》.pdf',
    categoryName: '投资机会'
  },
  'pol-1': {
    logo: '新浪政务',
    logoSub: '新浪政务 > 正文',
    url: 'https://news.sina.com.cn/gov/tax/2026-06/doc-itax.shtml',
    agency: '国家税务总局 科技部联合发布厅',
    referenceNum: '国税发〔2026〕28号',
    date: '2026年6月7日 08:30',
    source: '国家税务网地方及高新政策普惠厅',
    title: '《促进大模型底座在专精特新企业中重叠发展的税收支持政策解读》',
    subtitle: '自建中试放大基地、精密混料研判大设备购入允许百分之百一次性全额税前扣除',
    contentParagraphs: [
      "为强化企业科技创新主体地位，落实高新技术激励举措，国家税务总局、科技部于今日召开新闻联合会，对新版《关于促进大模型底座与工业级计算在专精特新中小企业重叠发展的精准税收扶持办法（暂行）》进行要点宣讲解读。",
      "政策明确：对年度内应用高水平多因拓扑模型、自主开发算法著作权、并用于实体工业混合动力质控的企业，享受最高达200%的研发费用加计扣除全损折价；对自建中试实验基地、配备特征光谱检测及精密反应釜等先进设备的购入，允许一次性全额税前扣除，全防方位支持地方实体硬科技企业突破产业链瓶颈。"
    ],
    trendings: [
      "专精特新中小企业如何做好年度研发投入总额申报比例核算",
      "算法著作权与软著发明证书加计扣除申报详规",
      "精细化工高分子混料车间绿色生产低碳能耗标准政策解读"
    ],
    qrTitle: '浙江税务微服务',
    downloadName: '【附件下载】《大模型及多因子拓扑算法税收支持加计扣除申报模版》.xlsx',
    categoryName: '政策解读'
  }
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

  const [activePopoverRowId, setActivePopoverRowId] = useState<string | null>(null);
  const [hoveredPopoverRowId, setHoveredPopoverRowId] = useState<string | null>(null);
  const [selectedOfficialArticleId, setSelectedOfficialArticleId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActivePopoverRowId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

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

  if (selectedOfficialArticleId) {
    const article = MOCK_OFFICIAL_WEBSITES[selectedOfficialArticleId];
    if (article) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="w-full bg-[#F4F5F7] border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[85vh] text-slate-800"
        >
          {/* News top service ribbon - updated with exit & back controls for clean layout */}
          <div className="bg-[#900000] text-red-50 text-[11px] sm:text-xs py-3 px-4 font-bold select-none flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setSelectedOfficialArticleId(null)}
                className="flex items-center gap-1.5 bg-red-950/70 hover:bg-black/30 border border-red-500/35 px-3 py-1 rounded-md transition-all text-[11px] font-black text-white cursor-pointer shadow-sm"
                title="返回推荐首页"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回推荐</span>
              </button>
              <span className="opacity-30 font-normal">|</span>
              <span>各级相关合作单位直属试点发布专栏</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline font-normal opacity-95">无障碍阅读</span>
              <span className="bg-red-800 px-1.5 py-0.5 rounded text-[10px]">智能匹配专区</span>
              <button 
                onClick={() => setSelectedOfficialArticleId(null)}
                className="text-white/80 hover:text-white hover:bg-red-800/80 p-1 rounded-md transition-colors cursor-pointer text-sm font-black ml-1 flex items-center justify-center w-5.5 h-5.5"
                title="返回综合推荐"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Fake official website header: Sina/Gov template */}
          <div className="bg-white border-b border-slate-200 py-5 px-4 sm:px-8 select-none">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="bg-red-700 text-white font-extrabold px-3 py-1 rounded font-serif text-lg tracking-wider">
                  {article.logo}
                </div>
                <div className="h-5 w-px bg-slate-300" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  {article.logoSub}
                </span>
              </div>

              {/* Mini QR Codes references */}
              <div className="hidden md:flex items-center gap-4 text-[10px] text-slate-400 font-bold">
                <div className="flex items-center gap-1 border border-slate-200/80 p-1 bg-slate-50 rounded">
                  <div className="w-6 h-6 bg-slate-400 rounded-sm flex items-center justify-center text-[10px] text-white">QR</div>
                  <span>手机版</span>
                </div>
                <div className="flex items-center gap-1 border border-slate-200/80 p-1 bg-slate-50 rounded">
                  <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center text-[10px] text-white">公众号</div>
                  <span>官方微信</span>
                </div>
              </div>

              {/* Portal Search */}
              <div className="flex items-center border border-slate-350 rounded overflow-hidden text-xs max-w-xs w-full">
                <input 
                  type="text" 
                  placeholder="请输入政策关键字..." 
                  className="px-2.5 py-1.5 bg-slate-50 focus:bg-white flex-1 outline-none text-slate-600" 
                  disabled
                />
                <button className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 font-bold shrink-0 transition-colors">
                  搜索
                </button>
              </div>
            </div>
          </div>

          {/* Main webpage document workspace */}
          <div className="flex-1 bg-white p-4 sm:p-10 select-text overflow-y-auto">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* Webpage Left Column (Article primary area - 3/4) */}
              <div className="lg:col-span-3 space-y-6">
                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-serif text-slate-900 leading-normal tracking-tight animate-fade-in text-left">
                  {article.title}
                </h1>

                {/* Optional subtitle */}
                {article.subtitle && (
                  <h2 className="text-base sm:text-lg font-bold text-slate-500/90 leading-relaxed font-serif pl-3 border-l-4 border-red-700/85 text-left">
                    {article.subtitle}
                  </h2>
                )}

                {/* Article meta information line */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-slate-400 font-bold border-b border-slate-200 pb-4">
                  <span>发布日期: {article.date}</span>
                  <span>发布单位: <span className="text-red-700 font-extrabold">{article.agency}</span></span>
                  <span className="hidden sm:inline">|</span>
                  <span>公文文号: <span className="font-mono text-slate-700 font-black">{article.referenceNum}</span></span>
                </div>

                {/* Classic authoritative double lines red barrier */}
                <div className="border-b-[3px] border-double border-red-700 w-full" />

                {/* Paragraphs of content */}
                <div className="space-y-6 font-serif text-[15px] sm:text-[16px] text-slate-800/95 leading-relaxed tracking-wide text-justify">
                  {article.contentParagraphs.map((para, pIdx) => (
                    <p key={pIdx} className="indent-8 whitespace-pre-wrap leading-loose">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Official circular red seal */}
                <div className="flex justify-end pt-10 select-none">
                  <div className="relative w-36 h-36 border-4 double border-red-500/80 rounded-full flex flex-col items-center justify-center p-3 rotate-[-12deg] shadow-inner select-none bg-red-50/10 shrink-0">
                    <span className="text-2xl text-red-500/95">★</span>
                    <span className="text-[10px] font-black text-red-500/90 tracking-widest text-center uppercase leading-none mt-1">
                      {article.logo === '红杉中国' ? '红杉基金研投中心' : '省经济和信息化厅'}
                    </span>
                    <span className="text-[8px] font-bold text-red-400/90 text-center leading-none mt-1.5">
                      审核匹配公章专用
                    </span>
                    <div className="absolute inset-1.5 border border-dashed border-red-500/40 rounded-full pointer-events-none" />
                  </div>
                </div>

                {/* Attachment download drawer */}
                {article.downloadName && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 select-none">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-10 h-10 text-rose-500 shrink-0" />
                        <div className="space-y-1 text-left">
                          <p className="text-xs sm:text-sm font-black text-slate-700 leading-tight">
                            {article.downloadName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            格式：PDF电子公文文档存档版 | 大小：2.42MB | 安全状态：已通过安全云查杀
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsDownloading(true);
                          setTimeout(() => {
                            setIsDownloading(false);
                            setDownloadSuccessId(article.downloadName || null);
                            setTimeout(() => setDownloadSuccessId(null), 3000);
                          }, 1200);
                        }}
                        className="px-4 py-2 bg-[#0A66FF] hover:bg-blue-700 text-white text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 self-center sm:self-auto cursor-pointer"
                      >
                        {isDownloading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>极速生成并下载中...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>一键申领极速下载</span>
                          </>
                        )}
                      </button>
                    </div>

                    {downloadSuccessId === article.downloadName && (
                      <div className="mt-3 bg-emerald-50 text-emerald-800 text-[11px] font-black p-3.5 rounded-lg border border-emerald-200/90 animate-fade-in flex items-center gap-2 text-left">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
                        <span>公文下载生成成功！系统已为您自动匹配极速下载，请检查您的浏览器本地下载目录专本。</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Webpage Right Column (Sidebar widget/related reading - 1/4) */}
              <div className="border-t lg:border-t-0 lg:border-l border-slate-200 pt-8 lg:pt-0 lg:pl-8 space-y-8 select-none text-left">
                {/* Match validation badge */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4.5 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-600 animate-pulse fill-current" />
                    <span className="text-xs font-black tracking-tight">智能资质校验通过</span>
                  </div>
                  <p className="text-[11px] text-emerald-700/85 leading-relaxed font-bold">
                    该官方信息源已成功与您当前的阶段性目标及自主研发项目大纲全方位对标。
                  </p>
                </div>

                {/* Interactive scanning validation */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
                  <p className="text-xs font-black text-slate-800 leading-tight">手机扫码带走阅读</p>
                  <div className="p-2 border border-slate-200 rounded bg-slate-50 flex items-center justify-center relative group">
                    <div className="w-28 h-28 grid grid-cols-6 gap-0.5 opacity-90 p-1">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-full h-full rounded-[2px]", 
                            (i * 13 + i * 2) % 3 === 0 ? "bg-slate-800" :
                            (i * 7) % 5 === 0 ? "bg-red-800" :
                            "bg-white"
                          )} 
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-slate-900/80 rounded flex items-center justify-center text-white text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      数字政务安全加密链
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold leading-tight">扫描通过安全资质一网通办</p>
                </div>

                {/* Other policy/articles recommendations */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                    推荐最新综合公告
                  </h3>
                  <div className="space-y-3.5 col-span-1">
                    {Object.entries(MOCK_OFFICIAL_WEBSITES)
                      .filter(([key]) => key !== selectedOfficialArticleId)
                      .map(([key, site]) => (
                        <div 
                          key={key}
                          onClick={() => {
                            setSelectedOfficialArticleId(key);
                            setDownloadSuccessId(null);
                          }}
                          className="space-y-1.5 group/side cursor-pointer"
                        >
                          <span className="inline-block text-[9px] font-black uppercase text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-xs leading-none">
                            {site.categoryName}
                          </span>
                          <p className="text-xs font-black text-slate-705/90 leading-snug group-hover/side:text-red-700 transition-colors line-clamp-2">
                            {site.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold leading-none">
                            {site.date} · 来源: 权威门户
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portal Footer copy indicator */}
          <div className="bg-[#1C2025] text-slate-400/95 border-t border-slate-800 mt-auto py-8 px-4 font-sans select-none text-center space-y-2 shrink-0">
            <p className="text-xs font-bold">
              版权所有：国家重点试点发布直属平台
            </p>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
              公网安备 11000002000001号 | 网许可〔2026〕5001-01号 | 政务数据直达专区
            </p>
          </div>
        </motion.div>
      );
    }
  }

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
                  <div 
                    key={row.id} 
                    onClick={() => setSelectedOfficialArticleId(row.id)}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 hover:shadow-lg hover:border-slate-200/80 active:scale-[0.99] transition-all duration-200 group border border-transparent rounded-[24px] cursor-pointer"
                  >
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
                          
                          {/* Highlighting 80%+ Matching Metrics with hover/click Popover */}
                          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                            <span 
                              onMouseEnter={() => setHoveredPopoverRowId(row.id)}
                              onMouseLeave={() => setHoveredPopoverRowId(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePopoverRowId(activePopoverRowId === row.id ? null : row.id);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-[#ECFDF5] hover:bg-emerald-100/90 border border-emerald-100 px-2.5 py-1 rounded-full cursor-pointer select-none transition-all duration-200"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse fill-current" />
                              <span>{row.matchScore}% 匹配度</span>
                            </span>
                            
                            {/* Hover/Click Popover content styled to match image 1 perfectly */}
                            {(hoveredPopoverRowId === row.id || activePopoverRowId === row.id) && (() => {
                              const report = getMatchReport(row.id, row.matchScore);
                              return (
                                <div 
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute top-full left-0 mt-3.5 z-55 w-76 sm:w-80 bg-white rounded-2xl border border-slate-200/85 shadow-2xl p-5 text-left text-slate-800 animate-fade-in font-sans"
                                  style={{ zIndex: 100 }}
                                >
                                  {/* Pointer angle */}
                                  <div className="absolute -top-1.5 left-8 w-3 h-3 bg-white border-t border-l border-slate-200/80 rotate-45" />
                                  
                                  {/* Title & Overall Match */}
                                  <div className="flex items-center justify-between pb-3.5 border-b border-dashed border-slate-100 select-none">
                                    <span className="text-sm font-black text-slate-800 tracking-tight">匹配报告</span>
                                    <div className="text-right">
                                      <div className="text-3xl font-extrabold text-[#0A66FF] tracking-tight leading-none">
                                        {report.overall}<span className="text-xs font-black ml-0.5">%</span>
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-bold block mt-1 tracking-wider">综合匹配度</span>
                                    </div>
                                  </div>

                                  {/* Component match breakdowns */}
                                  <div className="py-4 space-y-3 select-none">
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-black text-slate-500 min-w-[56px]">技术方向</span>
                                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0A66FF] rounded-full transition-all duration-300" style={{ width: `${report.tech}%` }} />
                                      </div>
                                      <span className="text-xs font-bold text-slate-600 w-10 text-right">{report.tech}%</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-black text-slate-500 min-w-[56px]">企业规模</span>
                                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0A66FF] rounded-full transition-all duration-300" style={{ width: `${report.scale}%` }} />
                                      </div>
                                      <span className="text-xs font-bold text-slate-600 w-10 text-right">{report.scale}%</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-black text-slate-500 min-w-[56px]">申报条件</span>
                                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#10B981] rounded-full transition-all duration-300" style={{ width: `${report.condition}%` }} />
                                      </div>
                                      <span className="text-xs font-bold text-slate-600 w-10 text-right">{report.condition}%</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-black text-slate-500 min-w-[56px]">地域范围</span>
                                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#10B981] rounded-full transition-all duration-300" style={{ width: `${report.region}%` }} />
                                      </div>
                                      <span className="text-xs font-bold text-slate-600 w-10 text-right">{report.region}%</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-black text-slate-500 min-w-[56px]">团队资质</span>
                                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0A66FF] rounded-full transition-all duration-300" style={{ width: `${report.team}%` }} />
                                      </div>
                                      <span className="text-xs font-bold text-slate-600 w-10 text-right">{report.team}%</span>
                                    </div>
                                  </div>

                                  {/* Divider & Keywords */}
                                  <div className="border-t border-slate-100 pt-3">
                                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 select-none">命中关键词</div>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                      {report.keywords.map((kw, i) => {
                                        const isSpecial = kw === '制造业' || kw === '初创基地' || kw === '自建基地';
                                        return (
                                          <span 
                                            key={i} 
                                            className={cn(
                                              "px-2.5 py-1 text-[10px] font-black rounded-full select-none",
                                              isSpecial 
                                                ? "bg-slate-50 text-slate-600 border border-slate-200/60" 
                                                : "bg-[#EBF3FF] text-[#0A66FF] border border-[#D1E5FF]"
                                            )}
                                          >
                                            {kw}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Footer Action - Aligned to request: no more view report button */}
                                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] select-none text-slate-400 font-bold">
                                    <span>AI 综合评估 · 仅供参考</span>
                                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      高精度契合
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
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

                    {/* Action buttons matching click targets */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOfficialArticleId(row.id);
                        }}
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

    </div>
  );
};


import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Filter, 
  Download, 
  X, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Trophy,
  Sparkles,
  ArrowRight,
  Calendar,
  Building2,
  ExternalLink,
  Layers,
  ClipboardList,
  FileCheck,
  FileSpreadsheet,
  Image,
  Lock,
  PenSquare,
  MoreHorizontal
} from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';

// Helper to resolve associated competitions for custom expandable project rows
const getCompetitionsForProject = (projectName: string) => {
  if (projectName.includes('交通') || projectName.includes('智能')) {
    return [
      { 
        name: '2024 全国高校人工智能创新大赛', 
        type: '自主申报重点项', 
        status: 'reviewing', 
        statusText: '初审通过', 
        date: '2024-06-20', 
        role: '核心技术组长', 
        bpName: '智能多模态城市交通排班自适应设计书.pdf',
        steps: [
          { label: '项目申报', active: true, done: true },
          { label: '立项批复', active: true, done: true },
          { label: '网络评审', active: true, done: true },
          { label: '决赛答辩', active: true, done: false },
          { label: '结果公示', active: false, done: false }
        ]
      },
      { 
        name: '"创青春" 全国大学生创业专项挑战赛', 
        type: '推荐选送项', 
        status: 'pending', 
        statusText: '资料待补全', 
        date: '2024-07-15', 
        role: '主讲申报人', 
        bpName: '城市低空交通与物流智能规划系统BP.docx',
        steps: [
          { label: '项目申报', active: true, done: true },
          { label: '立项批复', active: true, done: false },
          { label: '网络评审', active: false, done: false },
          { label: '决赛答辩', active: false, done: false },
          { label: '结果公示', active: false, done: false }
        ]
      }
    ];
  } else if (projectName.includes('工厂') || projectName.includes('孪生') || projectName.includes('虚拟')) {
    return [
      { 
        name: '工业 4.0 数字化转型创新实践赛', 
        type: '领航工程赛', 
        status: 'pending', 
        statusText: '待补充材料', 
        date: '2024-05-30', 
        role: '第一发明人', 
        bpName: '3D高斯泼溅高保真重现智能车间方案.pptx',
        steps: [
          { label: '项目申报', active: true, done: true },
          { label: '立项批复', active: false, done: false },
          { label: '网络评审', active: false, done: false },
          { label: '决赛答辩', active: false, done: false },
          { label: '结果公示', active: false, done: false }
        ]
      },
      { 
        name: '"挑战杯" 全国大学生课外学术科技作品竞赛', 
        type: '学术科研主线', 
        status: 'reviewing', 
        statusText: '复审评审中', 
        date: '2024-08-05', 
        role: '系统演示负责人', 
        bpName: '基于重光照算子的虚拟现实数字孪生模型.pdf',
        steps: [
          { label: '项目申报', active: true, done: true },
          { label: '立项批复', active: true, done: true },
          { label: '网络评审', active: true, done: true },
          { label: '决赛答辩', active: true, done: false },
          { label: '结果公示', active: false, done: false }
        ]
      }
    ];
  } else {
    return [
      { 
        name: '可持续发展科技创新大奖', 
        type: '绿色发展项', 
        status: 'completed', 
        statusText: '省一等奖・已出线', 
        date: '2024-05-15', 
        role: '技术首席专家', 
        bpName: '低碳协同控制与新能源负荷智能算法书.pdf',
        steps: [
          { label: '项目申报', active: true, done: true },
          { label: '立项批复', active: true, done: true },
          { label: '网络评审', active: true, done: true },
          { label: '决赛答辩', active: true, done: true },
          { label: '结果公示', active: true, done: true }
        ]
      },
      { 
        name: '全国绿色建筑与低碳技术设计创新大赛', 
        type: '示范培育项', 
        status: 'reviewing', 
        statusText: '专家函评中', 
        date: '2024-07-01', 
        role: '首位申报人', 
        bpName: '智慧能源多点测算平台商业策划书.pdf',
        steps: [
          { label: '项目申报', active: true, done: true },
          { label: '立项批复', active: true, done: true },
          { label: '网络评审', active: true, done: false },
          { label: '决赛答辩', active: false, done: false },
          { label: '结果公示', active: false, done: false }
        ]
      }
    ];
  }
};

interface Props {
  projects: Project[];
  onCreateNew: () => void;
  onViewDetails: (project: Project) => void;
  onViewCompetition?: () => void;
  onEditProjectBP?: (project: Project) => void;
  onCopyProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

// Interfaces & Types for expandable customizable metrics requested by user
export interface MaterialItem {
  id: string;
  info: string;
  bp: string;
  attachments: string[];
  updatedAt: string;
}

export interface CompDetailsItem {
  name: string;
  info: string; // 参赛信息 text
  bpName: string; // bp Name (can be edited/selected)
  attachments: string[]; // Clickable to view/preview
  date: string; // 参赛时间
  stage: '初赛' | '复赛' | '决赛'; // Primary stages
  enterprise: string; // 关联企业
  role?: string; // 参赛角色
  type?: string;
  status?: string;
  statusText?: string;
}

const PRESET_BPS = [
  "【博创核心】智能排班多源强化算法商业计划书.pdf",
  "【推荐专项】基于深度微型算力自调节自适应决策Bp.docx",
  "【主推荐版】3D高斯高分辨三维复现车间项目发展计划书.pdf",
  "【绿色示范】极低碳排放耦合回归能效平台投资可研报告.pptx",
  "【通用模版】高校杰出科技成果转化与孵化标准商业计划书.pdf",
  "【极简一页】核心科技团队配比一页纸BP摘要.pdf"
];

const generateDefaultDetails = (projectName: string): { materials: MaterialItem[]; competitions: CompDetailsItem[] } => {
  const isTraffic = projectName.includes('交通') || projectName.includes('智能');
  const isFactory = projectName.includes('工厂') || projectName.includes('孪生') || projectName.includes('虚拟');

  const materials: MaterialItem[] = isTraffic ? [
    {
      id: 'm-1',
      info: '博创智能排班高阶多AGENT路由自适应算法立项报告',
      bp: '智能交通自适应决策核心商业计划书_v1.pdf',
      attachments: ['神经网络收敛跑分.xlsx', '立项批件复印件.pdf'],
      updatedAt: '2024-05-22'
    },
    {
      id: 'm-2',
      info: '一期核心专利交底书：路网流自适应分流节点控制权法',
      bp: '节点控制核心底层技术规格BP_v3.docx',
      attachments: ['专利公开说明书_Draft.pdf'],
      updatedAt: '2024-05-19'
    }
  ] : isFactory ? [
    {
      id: 'm-1',
      info: '3D高斯泼溅无损光照微秒级仿真系统可研报告',
      bp: '高斯泼溅数字孪生工厂产业化BP_v2.pdf',
      attachments: ['全真渲染引擎基准测试.xlsx', '中试基地合作协议_盖章版.pdf'],
      updatedAt: '2024-05-21'
    },
    {
      id: 'm-2',
      info: '博创数字化车间低成本毫米级时延感知专利声明',
      bp: '毫米级感知工厂智能监测体系商业BP.pptx',
      attachments: ['专利申报回执和公开书.pdf'],
      updatedAt: '2024-05-15'
    }
  ] : [
    {
      id: 'm-1',
      info: '可持续绿色低碳园区能量流多级耦合测试大纲',
      bp: '绿色低碳能量流耦合系统BP_v4.pdf',
      attachments: ['用电荷载预测矩阵.xlsx', '省发改委试点通知.pdf'],
      updatedAt: '2024-05-22'
    },
    {
      id: 'm-2',
      info: '博创能效控制单元离群工况自适应回归算法细节',
      bp: '能效测算单元智能回归BP.docx',
      attachments: ['回归算法有效性论证证明.pdf'],
      updatedAt: '2024-05-12'
    }
  ];

  const competitions: CompDetailsItem[] = isTraffic ? [
    {
      name: '2024 全国高校人工智能创新大赛',
      info: '以深度自适应学习架构获评审最高分，获大赛主委会一等奖保举。',
      bpName: '智能多模态城市交通排班自适应设计书.pdf',
      attachments: ['决赛答辩幻灯片_张嘉诚.pptx', '路网跑分实况演示.mp4'],
      date: '2024-06-20',
      stage: '决赛',
      enterprise: '百度 Apollo 智能路网、国铁集团',
      role: '核心技术组长'
    },
    {
      name: '"创青春" 全国大学生创业专项挑战赛',
      info: '作为创新标杆案例入省选拔，全要素路演方案，提供闭环场景支持。',
      bpName: '城市低空交通与物流智能规划系统BP.docx',
      attachments: ['创青春商业计划白皮书_加印盖章.pdf', '物流三期测点概况表.xlsx'],
      date: '2024-07-15',
      stage: '复赛',
      enterprise: '大疆创新、中国公路学会',
      role: '主讲申报人'
    }
  ] : isFactory ? [
    {
      name: '工业 4.0 数字化转型创新实践赛',
      info: '重工流水线无损重建赛道。利用100Hz高频时序传感器与高精确3D点云，实现微秒瞬态拟真。',
      bpName: '3D高斯泼溅高保真重现智能车间方案.pptx',
      attachments: ['中车装配车间点云高阶采样.png', '工业4.0重载物理验证.xlsx'],
      date: '2024-05-30',
      stage: '初赛',
      enterprise: '中国中车、三一重工集团',
      role: '第一发明人'
    },
    {
      name: '"挑战杯" 全国大学生课外学术科技作品竞赛',
      info: '虚实全天候交互工坊，被教育部高等司评定为国家重点大创课题项目。',
      bpName: '基于重光照算子的虚拟现实数字孪生模型.pdf',
      attachments: ['挑战杯组委会正式回信说明.pdf', '虚拟重光照试验跑跑视频.mp4'],
      date: '2024-08-05',
      stage: '复赛',
      enterprise: '中兴通讯、沈阳精密机床大联盟',
      role: '系统演示负责人'
    }
  ] : [
    {
      name: '可持续发展科技创新大奖',
      info: '专注于多微网柔性控制与碳配额回馈，在新能源消纳与预测中展现出超高鲁棒性。',
      bpName: '低碳协同控制与新能源负荷智能算法书.pdf',
      attachments: ['省科技厅高精尖成果查新通知.pdf', '微电网实时负荷调优表现.mp4'],
      date: '2024-05-15',
      stage: '决赛',
      enterprise: '国网综能服务开发公司、远景能源',
      role: '技术首席专家'
    },
    {
      name: '全国绿色建筑与低碳技术设计创新大赛',
      info: '构建跨业态绿色建筑物能耗预测算模型，经实测其离群预测精度提升了43.2%。',
      bpName: '智慧能源多点测算平台商业策划书.pdf',
      attachments: ['博创绿色低碳建筑测算说明.pdf'],
      date: '2024-07-01',
      stage: '复赛',
      enterprise: '中建建筑科学研究院、博安物联',
      role: '首位申报人'
    }
  ];

  return { materials, competitions };
};

export const ProjectWorkspace: React.FC<Props> = ({ 
  projects, 
  onCreateNew, 
  onViewDetails, 
  onViewCompetition,
  onEditProjectBP,
  onCopyProject,
  onDeleteProject
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState([{ id: 1, field: '', operator: '', value: '' }]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);

  // Local state to support dynamic updates of Project details (Materials & Competitions)
  const [projectData, setProjectData] = useState<Record<string, { materials: MaterialItem[]; competitions: CompDetailsItem[] }>>({});

  // Helper getter for competitions
  const getCompetitionsForProject = (projectName: string) => generateDefaultDetails(projectName).competitions;

  // Trigger states for user edit & view actions
  const [editingBp, setEditingBp] = useState<{
    projectId: string;
    type: 'material' | 'competition';
    index: number;
    currentName: string;
  } | null>(null);

  const [viewingAttachment, setViewingAttachment] = useState<{
    fileName: string;
    projectId: string;
    projectName: string;
    source: string;
  } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);

  // Initialize data
  React.useEffect(() => {
    const initial: Record<string, { materials: MaterialItem[]; competitions: CompDetailsItem[] }> = {};
    projects.forEach(p => {
      initial[p.id] = generateDefaultDetails(p.name);
    });
    setProjectData(initial);
  }, [projects]);

  // Safe getter for a project's details
  const getProjectDetails = (projectId: string, projectName: string) => {
    if (projectData[projectId]) {
      return projectData[projectId];
    }
    return generateDefaultDetails(projectName);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

  const handleSaveBp = (newName: string) => {
    if (!editingBp) return;
    const { projectId, type, index } = editingBp;
    
    setProjectData(prev => {
      const copy = { ...prev };
      if (!copy[projectId]) {
        // Fallback initialize if not yet present
        const foundProj = projects.find(p => p.id === projectId);
        copy[projectId] = generateDefaultDetails(foundProj ? foundProj.name : '');
      }
      
      const projState = { ...copy[projectId] };
      if (type === 'material') {
        const listCopy = [...projState.materials];
        listCopy[index] = { ...listCopy[index], bp: newName, updatedAt: new Date().toISOString().split('T')[0] };
        projState.materials = listCopy;
      } else {
        const listCopy = [...projState.competitions];
        listCopy[index] = { ...listCopy[index], bpName: newName };
        projState.competitions = listCopy;
      }
      
      copy[projectId] = projState;
      return copy;
    });

    showToast(`商业计划书(BP)名称更新为：「${newName}」`);
    setEditingBp(null);
  };

  const addCondition = () => {
    setFilterConditions([...filterConditions, { id: Date.now(), field: '', operator: '', value: '' }]);
  };

  const removeCondition = (id: number) => {
    if (filterConditions.length > 1) {
      setFilterConditions(filterConditions.filter(c => c.id !== id));
    }
  };

  const toggleAll = () => {
    if (selectedProjectIds.length === projects.length) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(projects.map(p => p.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedProjectIds.includes(id)) {
      setSelectedProjectIds(selectedProjectIds.filter(pid => pid !== id));
    } else {
      setSelectedProjectIds([...selectedProjectIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="bg-white border border-[#DDE8F5] p-4 flex flex-col md:flex-row items-center gap-4 relative rounded-2xl shadow-[0_12px_32px_rgba(34,86,160,0.08)]">
          <div className="relative flex-1 group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0A66FF] transition-colors" />
              <input 
                  type="text" 
                  placeholder="请输入您想搜索的内容" 
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8BBEFF]/40 transition-all shadow-inner text-[#102033] font-medium placeholder-slate-420"
              />
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border shadow-xs cursor-pointer",
                isFilterOpen 
                  ? "bg-[#0A66FF] border-[#0A66FF] text-white shadow-[0_8px_18px_rgba(10,102,255,0.22)]" 
                  : "bg-white border-[#DDE8F5] text-[#52657A] hover:bg-[#F3F8FF] hover:text-[#0A66FF]"
              )}
            >
              <Filter className="w-4 h-4" />
              筛选
            </button>

            {/* Advanced Filter Panel - Now as an absolute popover */}
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-[800px] z-50 bg-white border border-[#DDE8F5] rounded-2xl p-6 shadow-[0_18px_48px_rgba(34,86,160,0.14)] animate-in zoom-in-95 fade-in duration-200 origin-top-right">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#102033]">筛选</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#52657A] font-medium">符合以下:</span>
                        <select className="bg-[#FBFDFF] border border-[#DDE8F5] rounded-lg px-2 py-1 text-[#52657A] outline-none focus:border-[#8BBEFF] font-medium">
                          <option>所有</option>
                          <option>任一</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => setFilterConditions([{ id: 1, field: '', operator: '', value: '' }])}
                        className="text-sm text-slate-400 hover:text-[#E5484D] transition-colors font-medium border-l border-slate-100 pl-4 cursor-pointer"
                      >
                        清空筛选条件
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filterConditions.map((condition, index) => (
                      <div key={condition.id} className="flex items-center gap-3 group">
                        <GripVertical className="w-4 h-4 text-slate-200 flex-shrink-0" />
                        <select className="flex-1 min-w-[160px] bg-white border border-[#DDE8F5] rounded-xl px-4 py-2 text-sm text-[#52657A] outline-none focus:border-[#8BBEFF] focus:ring-2 focus:ring-[#0A66FF]/10 transition-all font-medium">
                          <option value="">请选择筛选的字段</option>
                          <option>项目名称</option>
                          <option>大赛名称</option>
                          <option>截止日期</option>
                        </select>
                        <select className="w-32 flex-shrink-0 bg-white border border-[#DDE8F5] rounded-xl px-4 py-2 text-sm text-[#52657A] outline-none focus:border-[#8BBEFF] transition-all font-medium">
                          <option value="">请选择</option>
                          <option>等于</option>
                          <option>包含</option>
                          <option>不包含</option>
                          <option>开始于</option>
                          <option>结束于</option>
                        </select>
                        <div className="flex-[2]">
                          <input 
                            type="text" 
                            placeholder="请输入内容"
                            className="w-full bg-white border border-[#DDE8F5] rounded-xl px-4 py-2 text-sm text-[#102033] outline-none focus:border-[#8BBEFF] transition-all font-medium placeholder-slate-400"
                          />
                        </div>
                        <div className="flex items-center gap-4 pl-4 border-l border-slate-100 flex-shrink-0">
                          <label className="flex items-center gap-2 cursor-pointer group/check">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0A66FF] focus:ring-[#0A66FF]/20 cursor-pointer" />
                            <span className="text-sm text-[#52657A] group-hover/check:text-[#102033] transition-colors font-medium">常用</span>
                          </label>
                          <button 
                            onClick={() => removeCondition(condition.id)}
                            className="p-2 text-slate-350 hover:text-[#E5484D] hover:bg-[#FFF5F5] rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={addCondition}
                    className="mt-6 flex items-center gap-2 text-[#0A66FF] hover:text-[#0057D9] text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    添加筛选条件
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
                onClick={onCreateNew}
                className="bg-[#0A66FF] hover:bg-[#0057D9] text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                创建新项目
            </button>
            <button 
                onClick={() => setShowCheckboxes(!showCheckboxes)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 border cursor-pointer",
                  showCheckboxes 
                    ? "bg-[#102033] border-[#102033] text-white shadow-md shadow-slate-900/10" 
                    : "bg-white border-[#DDE8F5] text-[#52657A] hover:bg-[#F3F8FF] hover:text-[#0A66FF]"
                )}
            >
                <Download className="w-4 h-4" />
                {showCheckboxes ? '确认导出' : '导出'}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#DDE8F5] rounded-2xl shadow-[0_12px_32px_rgba(34,86,160,0.08)] overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F3F8FF] border-b border-[#DDE8F5]">
              <tr>
                {showCheckboxes && (
                  <th className="pl-6 py-4 w-12">
                     <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-[#0A66FF] focus:ring-[#0A66FF]/20 cursor-pointer" 
                      checked={selectedProjectIds.length === projects.length && projects.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                <th className={cn("px-6 py-4 text-[11px] font-semibold text-[#52657A] uppercase tracking-wider w-[65%]", showCheckboxes && "pl-2")}>项目名称</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#52657A] uppercase tracking-wider w-[20%] text-center">关联项目</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-[#52657A] uppercase tracking-wider w-[15%] text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F8]">
              {projects.map((project, idx) => {
                const isExpanded = expandedProjectIds.includes(project.id);
                const competitions = getCompetitionsForProject(project.name);

                return (
                  <React.Fragment key={project.id}>
                    <tr className={cn(
                      "hover:bg-[#F3F8FF]/30 transition-colors group cursor-default",
                      selectedProjectIds.includes(project.id) && "bg-[#EAF2FF]/50",
                      isExpanded && "bg-[#F3F8FF]/20"
                    )}>
                      {showCheckboxes && (
                        <td className="pl-6 py-4">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-[#0A66FF] focus:ring-[#0A66FF]/20 cursor-pointer" 
                            checked={selectedProjectIds.includes(project.id)}
                            onChange={() => toggleOne(project.id)}
                          />
                        </td>
                      )}
                      <td className={cn("px-6 py-4", showCheckboxes && "pl-2")}>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onEditProjectBP ? onEditProjectBP(project) : onViewDetails(project)}
                            className="text-left font-semibold text-[#0A66FF] hover:text-[#0057D9] hover:underline transition-all cursor-pointer text-sm flex items-center gap-2 group/title"
                          >
                            <span className="bg-[#EAF2FF] group-hover/title:bg-[#BFD8FF] text-[#0A66FF] p-1.5 rounded-lg transition-colors">
                              <FileText className="w-4 h-4" />
                            </span>
                            <span>{project.name}</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (expandedProjectIds.includes(project.id)) {
                              setExpandedProjectIds(expandedProjectIds.filter(pid => pid !== project.id));
                            } else {
                              setExpandedProjectIds([...expandedProjectIds, project.id]);
                            }
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer",
                            isExpanded 
                              ? "bg-[#102033] border-[#102033] text-white shadow-sm hover:bg-slate-800" 
                              : "text-[#52657A] border-[#DDE8F5] hover:border-[#BFD8FF] bg-white hover:bg-[#FBFDFF]"
                          )}
                        >
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isExpanded ? '收起关联' : '关联的赛事'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center overflow-visible relative">
                        <div className="relative inline-block text-left" id={`project-menu-container-${project.id}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuProjectId(openMenuProjectId === project.id ? null : project.id);
                            }}
                            className={cn(
                              "p-2 rounded-xl bg-transparent hover:bg-slate-50/80 text-slate-400 hover:text-slate-700 transition-all cursor-pointer border border-transparent active:scale-95 inline-flex items-center justify-center",
                              openMenuProjectId === project.id && "bg-slate-50 border-slate-200 text-slate-800 shadow-xs"
                            )}
                            id={`project-menu-btn-${project.id}`}
                          >
                            <MoreHorizontal className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          {openMenuProjectId === project.id && (
                            <>
                              {/* Overlaid transparent dismiss layer click-outside */}
                              <div 
                                className="fixed inset-0 z-40 bg-transparent" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuProjectId(null);
                                }}
                              />
                              <div 
                                className={cn(
                                  "absolute right-0 w-48 bg-white border border-[#DDE8F5] rounded-xl shadow-[0_18px_48px_rgba(34,86,160,0.14)] p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-left",
                                  idx === projects.length - 1 && projects.length >= 2 ? "bottom-full mb-2" : "top-full mt-2"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-0.5">
                                  <button
                                    onClick={() => {
                                      setOpenMenuProjectId(null);
                                      showToast(`已开始导出项目「${project.name}」的赛事申报书`);
                                    }}
                                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-[#52657A] hover:text-[#102033] hover:bg-[#F3F8FF] transition-all flex items-center gap-2.5 cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5 text-slate-400" />
                                    <span>导出为</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setOpenMenuProjectId(null);
                                      if (onCopyProject) {
                                        onCopyProject(project);
                                        showToast(`已复制并新建副本「${project.name} - 副本」`);
                                      }
                                    }}
                                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0A66FF] hover:bg-[#EAF2FF] transition-all flex items-center gap-2.5 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5 text-[#0A66FF] stroke-[2.5]" />
                                    <span>复制项目</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setOpenMenuProjectId(null);
                                      if (onDeleteProject) {
                                        onDeleteProject(project);
                                        showToast(`项目「${project.name}」已成功删除`);
                                      } else {
                                        showToast(`无法删除该项目（请检查权限）`);
                                      }
                                    }}
                                    className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-[#E5484D] hover:bg-[#FFF5F5] transition-all flex items-center gap-2.5 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-[#E5484D]" />
                                    <span>删除项目</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Collapsible Region for Project details */}
                    {isExpanded && (
                      <tr className="bg-[#F7FAFF]/50">
                        <td colSpan={showCheckboxes ? 4 : 3} className="p-0 border-t border-b border-[#DDE8F5]">
                          <div className="px-8 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                            
                            {/* Header row inside expansion showing details */}
                            <div className="flex items-center justify-between border-b border-[#DDE8F5] pb-2">
                              <span className="text-xs font-semibold text-[#102033] tracking-wide flex items-center gap-2">
                                <span className="w-1.5 h-3 bg-[#0A66FF] rounded-full inline-block"></span>
                                赛事的关联数据 (关联的大赛名单)
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">点击行数据或查看详情按钮进入项目详情</span>
                            </div>

                            {/* Two data rows with field columns */}
                            <div className="overflow-hidden border border-[#DDE8F5] rounded-xl bg-white shadow-sm">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-[#F3F8FF] border-b border-[#DDE8F5] text-[11px] text-[#52657A] font-semibold uppercase tracking-wider">
                                    <th className="px-5 py-3 w-[28%]">关联大赛名称</th>
                                    <th className="px-5 py-3 w-[12%]">截止日期</th>
                                    <th className="px-5 py-3 w-[15%]">当前状态</th>
                                    <th className="px-5 py-3 w-[15%]">参赛职责/角色</th>
                                    <th className="px-5 py-3 w-[18%]">关联支撑商业计划书</th>
                                    <th className="px-5 py-3 w-[12%]">操作</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EEF3F8] text-[#102033]">
                                  {competitions.map((comp, compIdx) => (
                                    <tr 
                                      key={comp.name} 
                                      onClick={() => {
                                        onViewDetails(project);
                                      }}
                                      className="hover:bg-[#F3F8FF]/50 transition-colors cursor-pointer group"
                                    >
                                      <td className="px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-7 h-7 rounded-lg bg-[#EAF2FF] text-[#0A66FF] flex items-center justify-center shrink-0 border border-[#BFD8FF]">
                                            <Trophy className="w-4 h-4 text-amber-500" />
                                          </div>
                                          <div>
                                            <div className="text-[#102033] font-semibold tracking-tight text-xs group-hover:text-[#0A66FF] transition-colors">{comp.name}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{comp.type}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                          <span>{comp.date}</span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-4">
                                        <span className={cn(
                                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                                          comp.status === 'completed' ? "bg-[#E6F7F0] text-[#12A870] border-[#A7E7CD]" :
                                          comp.status === 'reviewing' ? "bg-[#EAF2FF] text-[#0A66FF] border-[#BFD8FF]" :
                                          "bg-[#FFF0F0] text-[#E5484D] border-[#FFD1D2]"
                                        )}>
                                          ● {comp.statusText || '审核中'}
                                        </span>
                                      </td>
                                      <td className="px-5 py-4 text-[#52657A] font-semibold text-xs">
                                        {comp.role || '核心技术组长'}
                                      </td>
                                      <td className="px-5 py-4">
                                        <div className="flex flex-col gap-0.5 max-w-[160px]">
                                          <span className="text-[#52657A] text-[11px] font-mono font-semibold truncate" title={comp.bpName}>
                                            {comp.bpName}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-4">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onViewDetails(project);
                                          }}
                                          className="flex items-center gap-1 bg-[#0A66FF] hover:bg-[#0057D9] text-white font-semibold text-[11px] px-3.5 py-1.5 rounded-xl transition-all active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
                                        >
                                          <span>查看详情</span>
                                          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-[#FBFDFF] p-4 flex items-center justify-between border-t border-[#DDE8F5]">
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#52657A] font-medium">共 {projects.length} 个项目</span>
              {selectedProjectIds.length > 0 && (
                <span className="text-xs text-[#0A66FF] font-semibold bg-[#EAF2FF] px-2.5 py-0.5 rounded-full border border-[#BFD8FF] animate-in fade-in zoom-in-95">
                  已选择 {selectedProjectIds.length} 项
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-[#0A66FF] transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg bg-[#0A66FF] text-white text-xs font-bold shadow-md shadow-blue-500/10">1</button>
                <button className="w-8 h-8 rounded-lg text-[#52657A] text-xs font-semibold hover:bg-[#F3F8FF] hover:text-[#0A66FF] transition-all cursor-pointer">2</button>
                <button className="w-8 h-8 rounded-lg text-[#52657A] text-xs font-semibold hover:bg-[#F3F8FF] hover:text-[#0A66FF] transition-all cursor-pointer">3</button>
                <button className="p-2 text-slate-400 hover:text-[#0A66FF] transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 1. EDIT & SELECT BUSINESS PLAN MODAL */}
      {editingBp && (
        <div className="fixed inset-0 bg-[#102033]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-[0_18px_48px_rgba(34,86,160,0.14)] overflow-hidden border border-[#DDE8F5] animate-in zoom-in-95 duration-200 text-left">
            <div className="p-6 border-b border-[#DDE8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#0A66FF] flex items-center justify-center">
                  <PenSquare className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#102033] text-[15px]">编辑与选择商业计划书 (BP)</h3>
              </div>
              <button 
                onClick={() => setEditingBp(null)}
                className="p-1.5 text-slate-500 hover:text-[#102033] rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Type directly field */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#52657A] uppercase tracking-wider block">直接重命名或编辑 (Direct Filename Edit)</label>
                <input 
                  type="text" 
                  value={editingBp.currentName}
                  onChange={(e) => setEditingBp({ ...editingBp, currentName: e.target.value })}
                  placeholder="请输入您的商业计划书新文件名"
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] rounded-xl px-4 py-2.5 text-xs text-[#102033] focus:outline-none focus:ring-2 focus:ring-[#8BBEFF]/40 transition-all font-mono font-semibold"
                />
              </div>

              {/* Select preset list */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-semibold text-[#52657A] uppercase tracking-wider block">或从备选云库一键替换为推荐预设 BP (Apply Preset Template)</label>
                <div className="grid grid-cols-1 gap-2 max-h-[190px] overflow-y-auto pr-1">
                  {PRESET_BPS.map((preset) => {
                    const isSelected = editingBp.currentName === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => setEditingBp({ ...editingBp, currentName: preset })}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border text-[11px] font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer",
                          isSelected
                            ? "bg-[#EAF2FF] border-[#0A66FF] text-[#0A66FF]"
                            : "bg-white border-[#DDE8F5] hover:bg-[#F3F8FF] text-[#52657A] hover:border-[#BFD8FF]"
                        )}
                      >
                        <span className="truncate">{preset}</span>
                        {isSelected ? (
                          <span className="text-[10px] bg-[#0A66FF] text-white px-2 py-0.5 rounded-full font-semibold">已选</span>
                        ) : (
                          <span className="text-[10px] bg-[#F3F8FF] text-[#52657A] border border-[#E8F0FA] px-2 py-0.5 rounded-full font-semibold">套用</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal buttons */}
            <div className="bg-[#FBFDFF] px-6 py-4 flex items-center justify-end gap-3 border-t border-[#DDE8F5]">
              <button 
                onClick={() => setEditingBp(null)}
                className="px-4 py-2 bg-white border border-[#DDE8F5] hover:bg-[#F3F8FF] text-[#52657A] rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                取消
              </button>
              <button 
                onClick={() => handleSaveBp(editingBp.currentName)}
                className="px-5 py-2 bg-[#0A66FF] text-white hover:bg-[#0057D9] rounded-xl text-xs font-semibold shadow-md shadow-brand-blue/15 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>保存并更新关联</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECURE CLOUD ATTACHMENT LIGHTBOX PREVIEW */}
      {viewingAttachment && (
        <div className="fixed inset-0 bg-[#102033]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-[0_18px_48px_rgba(34,86,160,0.14)] overflow-hidden border border-[#DDE8F5] animate-in zoom-in-95 duration-200 text-left flex flex-col h-[85vh]">
            
            {/* Left aligned header with indicators */}
            <div className="p-6 border-b border-[#DDE8F5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F3F8FF] text-[#0A66FF] flex items-center justify-center border border-[#E8F0FA]">
                  {viewingAttachment.fileName.endsWith('.xlsx') ? (
                    <FileSpreadsheet className="w-5 h-5 text-[#12A870]" />
                  ) : viewingAttachment.fileName.endsWith('.png') || viewingAttachment.fileName.endsWith('.jpg') ? (
                    <Image className="w-5 h-5 text-purple-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#0A66FF]" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[#102033] text-[14px] leading-snug truncate max-w-[400px]">
                    {viewingAttachment.fileName}
                  </h3>
                  <p className="text-[11px] text-[#52657A] font-medium">
                    所属项目: <strong className="text-[#102033] font-semibold">{viewingAttachment.projectName}</strong> ({viewingAttachment.source})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setViewingAttachment(null)}
                className="p-1.5 text-slate-400 hover:text-[#102033] rounded-lg hover:bg-[#F3F8FF] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated viewer body scrollable */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#F7FAFF]/80 text-[#102033] font-sans space-y-6">
              
              {/* Document Checksum & Safe Notice */}
              <div className="bg-[#E6F7F0] border border-[#A7E7CD] p-3.5 rounded-2xl flex items-center justify-between text-xs text-[#12A870] font-semibold gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#12A870] shrink-0" />
                  <span>博创云安全沙箱已载入密级预览 • 大小: {(Math.random() * 5 + 1).toFixed(2)} MB • 网安哈希校准通过</span>
                </div>
                <span className="text-[10px] font-semibold uppercase text-[#12A870] tracking-wider hidden sm:inline bg-[#A7E7CD]/35 px-2.5 py-0.5 rounded-full border border-[#A7E7CD]">Secure Ssl</span>
              </div>

              {/* Doc details generator */}
              <div className="bg-white rounded-2xl p-6 border border-[#DDE8F5] shadow-sm space-y-5">
                <div className="border-b border-[#DDE8F5] pb-3">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">数字化支撑印证附件大纲 (Support Materials Proof Ledger)</span>
                  <h4 className="text-sm font-semibold text-[#102033] mt-1">{viewingAttachment.fileName}</h4>
                </div>

                {viewingAttachment.fileName.endsWith('.xlsx') ? (
                  /* Excel View Sandbox Sheet Simulation */
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-4 bg-[#F3F8FF] text-[11px] font-semibold uppercase text-[#52657A] rounded p-1.5 text-center font-mono border border-[#DDE8F5]">
                      <div>研究科目</div>
                      <div>预算预估</div>
                      <div>匹配度</div>
                      <div>占比</div>
                    </div>
                    {[
                      { item: '神经网络收敛层算力成本', val: '¥24,500', rate: '0.85', ratio: '24%' },
                      { item: '微秒级高分辨率传感器阵列采购', val: '¥68,000', rate: '0.90', ratio: '42%' },
                      { item: '大模型Token运行与冷启动保障', val: '¥18,000', rate: '0.95', ratio: '18%' },
                      { item: '产学研联合实验室运营管理经费', val: '¥12,000', rate: '1.00', ratio: '16%' }
                    ].map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-4 text-[11px] font-medium text-[#102033] p-2 border-b border-[#EEF3F8] text-center font-mono">
                        <div className="text-left font-sans truncate">{row.item}</div>
                        <div className="text-[#12A870] font-semibold">{row.val}</div>
                        <div>{row.rate}</div>
                        <div className="text-slate-500">{row.ratio}</div>
                      </div>
                    ))}
                    <div className="pt-2 text-right">
                      <span className="text-[11px] text-[#52657A]">核定联合申报预算额: </span>
                      <strong className="text-[#0A66FF] font-mono font-bold text-sm ml-1">¥122,500</strong>
                    </div>
                  </div>
                ) : (
                  /* Standard PDF Outline view with beautiful chapters */
                  <div className="space-y-4 text-xs font-medium leading-relaxed text-[#102033]/80">
                    <div className="space-y-2 text-left">
                      <h5 className="font-semibold text-[#102033] text-xs">一、学术背景及核心攻关指标陈述</h5>
                      <p className="text-slate-500 bg-[#FBFDFF] p-2.5 rounded-xl border border-[#DDE8F5] text-[11px] leading-relaxed">
                        该项目秉承“双创高精尖科研课题深度孵化”的核心宗旨，开展了多分支核心算法的系统性调优。印证物料中所提报的研究材料与专利申报项，均已通关多模型仿真环境的严格抗离群性能测试，并取得高校联合实验室的盖章备案。
                      </p>
                    </div>

                    <div className="space-y-2 text-left">
                      <h5 className="font-semibold text-[#102033] text-xs">二、产学研实测佐证 & 深度合作场景</h5>
                      <p className="text-slate-500 bg-[#FBFDFF] p-2.5 rounded-xl border border-[#DDE8F5] text-[11px] leading-relaxed">
                        项目旨在推倒产学研边界，不以纯粹空谈学术为终点，现已成功联合战略关联伙伴进行实机中试打磨。在与 {viewingAttachment.source === '项目资料' ? '各大联合战略实体' : viewingAttachment.source} 的测定验证中，该方案被证明能够让高算力耗损直线缩短 25% 以上。
                      </p>
                    </div>

                    <div className="space-y-2 text-left">
                      <h5 className="font-semibold text-[#102033] text-xs">三、大创组委会盖章与赛事备档备注</h5>
                      <p className="text-slate-500 bg-[#FBFDFF] p-2.5 rounded-xl border border-[#DDE8F5] text-[11px] leading-relaxed">
                        本数字加密快照件由博创数据云端签名链进行追溯，在您查阅的同时，水印已被后台静密登记。该证书仅供备战各大杯赛决赛、商业展示计划（BP）对接路演所用，受到防泄密规则严控。
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Security and auditing info panel */}
              <div className="p-4 bg-[#EAF2FF] border border-[#BFD8FF] rounded-2xl text-left space-y-2">
                <span className="text-[10px] font-semibold text-[#0A66FF] uppercase tracking-widest block">云审阅与防篡改痕迹 (Digital Footprint & Ledger)</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-[#52657A] font-medium font-sans">
                  <div>校对印：<span className="text-[#12A870] font-semibold">国家级赛区验证</span></div>
                  <div>审阅状态：<span className="text-[#102033]">只读安全模式</span></div>
                  <div>数字证书：<span className="text-[#102033] font-mono">BC-928X-FF</span></div>
                  <div>安全校验：<span className="text-[#102033]">印签双控通过</span></div>
                </div>
              </div>
            </div>

            {/* Lightbox footer buttons */}
            <div className="bg-[#FBFDFF] px-6 py-4 flex items-center justify-between border-t border-[#DDE8F5] shrink-0">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">数字阅览链路校验正常 • 2026-05-22</span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button 
                  onClick={() => {
                    showToast(`文件自博创系统拉取下载中: ${viewingAttachment.fileName}`);
                  }}
                  className="px-4 py-2 bg-white hover:bg-[#F3F8FF] text-[#52657A] border border-[#DDE8F5] rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>下载原档</span>
                </button>
                <button 
                  onClick={() => setViewingAttachment(null)}
                  className="px-5 py-2 bg-[#102033] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  已阅关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TOAST SUCCESS NOTIFICATION POPUP */}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#102033] border border-slate-800 text-white text-[11px] font-semibold shadow-2xl px-5 py-3 rounded-2xl flex items-center gap-2.5 z-[9999] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-[#12A870] animate-pulse shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

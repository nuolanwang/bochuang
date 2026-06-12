import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Upload, Sparkles, FileText, Loader2, Check, User, Save, FileCheck, Layers, Award, ShieldAlert, GitBranch, Edit3, HelpCircle, Link, Image, Table, Maximize2, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';

interface Props {
  onBack: () => void;
  onSubmit: (newProjectData: Partial<Project>) => void;
  isPrefilled?: boolean;
  uploadedFileName?: string;
  uploadedFileSize?: string;
}

const AI_CONTENTS: Record<string, string> = {
  '项目简要介绍 (500字以内的文字介绍)': '基于甬江高分子拓扑网络预测模型与动态计算化学反应技术，本项目致力打造一站式生命健康核心原药研发与精细化工中试投产全栈数智平台。通过独创算法优化分子混配流体动力，攻克微反应釜物理中试参数失真顽疾。',
  '项目背景意义': '针对多相精细合成反应中温度/速率冗余容易导致偶合聚失效的行业卡脖子痛点，本项目首创自主可控的三维空间高分子拓扑态自适应重构算法。依托宁波本地及海曙区智能制造产业基础，替代进口物料流质控标准，全方位筑牢生物医药产业链底座。',
  '主要研发产品、拟解决的关键技术，以及核心竞争力、赢利模式和宁波本地产业的相融性。': '1. 主要研发产品：高解析近红外偏振光谱芯片及配套在线快速多通道拓扑模拟检测平台。\n2. 拟解决的关键技术：多通道微秒级极速物料温敏相态流变控制算法、宽波段光学散射特征谱自清洗反演。\n3. 核心竞争力：团队掌握华东地区领先的分子级计算拓扑参数库，流质稳定性提升40%，反应转化率高达99.8%。\n4. 赢利模式：一站式全周期流体组分技术授权服务、中试流变参数校调云端订阅、芯片模组硬件定制。\n5. 与宁波本地产业的相融性：紧密贴合宁波市及海曙区先进智能制造与生命健康重点产业规划，打通本土制药中试供应链核心卡脖子卡点。',
  '项目阶段性科研与商业落地节点 and 目标': '1. 2026年Q3：配合海曙基地完成DCS中试总装，原药分子活性突破99.855%。\n2. 2026年Q4：与头部合伙产业方签署应用中试包协议，授权核心专利3项。\n3. 2027年Q2：中试产线实现满载日吞吐级流转，预期形成首期销售额突破2500万元。',
  '现有核心团队技术沉淀与研发实验资源基础': '核心成员出自生命化学与计算智能重点实验室，在算法与高分子工艺学交叉沉淀达12年以上。团队已在宁波自建有350㎡标准化中试洁净用房，配有超高解析单分子色谱仪等450万元配套资源，具备良好的转化基础。',
  '预期能耗指标、知识产权及科技成果考核验收指标': '1. 绿色验收：废液循环率提升35%，综合碳强度能耗降低30%。\n2. 知识产权：主导制定中试级原药精细对照质谱分析草率1项，申请发明专利3项、软著3项。\n3. 考核成果：获取省市级重点创新成果登记证书2套。',
  '项目投入运行后的产值、利税与就业拉动情况': '投产第一年预计核心物料主营收入突破 1.2 亿元，新增税收约 1200 万元；项目进入量产平稳期（第三年起）后年综合收益可达 3.5 亿元，拉动当地 20 个高端高技术控制或生物医药高级工程师人才高质量就业岗位。'
};

const getAiContent = (lbl: string): string => {
  const matches = Object.keys(AI_CONTENTS).filter(k => lbl.includes(k) || k.includes(lbl) || k.replace(/\s+/g, '').includes(lbl.replace(/\s+/g, '')));
  if (matches.length > 0) return AI_CONTENTS[matches[0]];
  // Substring matching as backup
  if (lbl.includes('实施') || lbl.includes('研发') || lbl.includes('产品') || lbl.includes('关键') || lbl.includes('竞争力') || lbl.includes('相融性')) return AI_CONTENTS['主要研发产品、拟解决的关键技术，以及核心竞争力、赢利模式和宁波本地产业的相融性。'];
  if (lbl.includes('目标') || lbl.includes('阶段')) return AI_CONTENTS['项目阶段性科研与商业落地节点 and 目标'];
  if (lbl.includes('基础') || lbl.includes('资源')) return AI_CONTENTS['现有核心团队技术沉淀与研发实验资源基础'];
  if (lbl.includes('能耗') || lbl.includes('产权')) return AI_CONTENTS['预期能耗指标、知识产权及科技成果考核验收指标'];
  if (lbl.includes('产值') || lbl.includes('利税') || lbl.includes('经济')) return AI_CONTENTS['项目投入运行后的产值、利税与就业拉动情况'];
  if (lbl.includes('介绍') || lbl.includes('简要')) return AI_CONTENTS['项目简要介绍 (500字以内的文字介绍)'];
  if (lbl.includes('背景') || lbl.includes('意义')) return AI_CONTENTS['项目背景意义'];
  return `${lbl}：根据对高分子精细物理反应的研究和深度推演，本项目通过工业级配方控制引擎 and 自主开发的高精度流体动力学预测算法，全方位重构造数字化交付体系，打造高精度、高活性、高转化的一站式中试工艺。`;
};

interface RichEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

const RichTextEditor: React.FC<RichEditorProps> = ({ label, value, onChange, placeholder, required = true }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState('12px');
  const [fontFamily, setFontFamily] = useState('标准字体');

  const [isGenerating, setIsGenerating] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleStyle = (style: 'bold' | 'italic' | 'underline' | 'strike') => {
    if (style === 'bold') setIsBold(!isBold);
    if (style === 'italic') setIsItalic(!isItalic);
    if (style === 'underline') setIsUnderline(!isUnderline);
    if (style === 'strike') setIsStrike(!isStrike);
  };

  const handleAiGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    const fullText = getAiContent(label);
    
    let currentText = '';
    let index = 0;
    
    onChange('AI智能撰写正在多维自适应模型中生成高纯度工艺内容...\n');
    
    const intervalTime = 12; // ms per character
    
    // 1-second dynamic pre-analysis to look very authentic
    setTimeout(() => {
      const timer = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText[index];
          onChange(currentText);
          index++;
        } else {
          clearInterval(timer);
          setIsGenerating(false);
        }
      }, intervalTime);
    }, 1200);
  };

  const insertTextTemplate = (template: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const scrollPos = textarea.scrollTop;
    
    let headingMarker = '';
    if (template === 'h1') headingMarker = '\n# ';
    if (template === 'h2') headingMarker = '\n## ';
    if (template === 'ul') headingMarker = '\n- ';
    if (template === 'ol') headingMarker = '\n1. ';
    if (template === 'link') headingMarker = ' [链接名称](https://...)';
    if (template === 'image') headingMarker = ' ![图片描述](https://...)';
    if (template === 'table') headingMarker = '\n| 字段1 | 字段2 | 字段3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |\n';

    const newText = text.substring(0, start) + headingMarker + text.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + headingMarker.length;
      textarea.setSelectionRange(newCursor, newCursor);
      textarea.scrollTop = scrollPos;
    }, 50);
  };

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-slate-700 flex items-center gap-1 select-none">
          {required && <span className="text-rose-500 font-extrabold">*</span>}
          <span>{label}</span>
          {(label === '现有创业基础' || label.includes('创业基础')) && (
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600 shrink-0" />
          )}
        </label>
        
        {/* Glossy Gradient Blue capsule button with shimmer/sparkles matching Image 4 but in Blue */}
        <button
          type="button"
          onClick={handleAiGenerate}
          disabled={isGenerating}
          className="relative overflow-hidden h-6.5 px-3.5 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-extrabold text-[10px] rounded-full flex items-center gap-1 hover:from-blue-700 hover:to-sky-600 shadow-md shadow-blue-500/15 border border-white/10 active:scale-95 transition-all select-none disabled:opacity-75 cursor-pointer outline-none focus:outline-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-2.5 h-2.5 animate-spin" />
              <span className="animate-pulse">正在生成...</span>
            </>
          ) : (
            <>
              <span>智能撰写</span>
              <Sparkles className="w-2.5 h-2.5 text-blue-100" />
            </>
          )}
        </button>
      </div>
      
      {/* Editor Main Wrapper Box */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-[#0A66FF] focus-within:ring-1 focus-within:ring-blue-100 transition-all flex flex-col">
        {/* Toolbar Header */}
        <div className="bg-[#F8FAFC] border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-x-1 sm:gap-x-1.5 gap-y-1.5 text-slate-500 text-xs select-none">
          <button
            type="button"
            onClick={() => toggleStyle('bold')}
            className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer ${isBold ? 'bg-slate-200 text-[#0A66FF]' : ''}`}
            title="加粗"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleStyle('italic')}
            className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer ${isItalic ? 'bg-slate-200 text-[#0A66FF]' : ''}`}
            title="斜体"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleStyle('underline')}
            className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer ${isUnderline ? 'bg-slate-200 text-[#0A66FF]' : ''}`}
            title="下划线"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={() => toggleStyle('strike')}
            className={`p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer text-[10px] font-black w-6 text-center ${isStrike ? 'bg-slate-200 text-[#0A66FF]' : ''}`}
            title="删除线"
          >
            S
          </button>
          
          <span className="w-px h-4 bg-slate-200 shrink-0 self-center mx-1" />
          
          <button
            type="button"
            onClick={() => insertTextTemplate('h1')}
            className="p-1 rounded hover:bg-slate-200 font-black text-[10px] w-6 text-center cursor-pointer"
            title="主标题 (H1)"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => insertTextTemplate('h2')}
            className="p-1 rounded hover:bg-slate-200 font-extrabold text-[9px] w-6 text-center cursor-pointer"
            title="副标题 (H2)"
          >
            H2
          </button>
          
          <span className="w-px h-4 bg-slate-200 shrink-0 self-center mx-1" />
          
          <button
            type="button"
            onClick={() => insertTextTemplate('ul')}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
            title="无序列表"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextTemplate('ol')}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
            title="有序列表"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-px h-4 bg-slate-200 shrink-0 self-center mx-1" />
          
          <button
            type="button"
            onClick={() => setAlign('left')}
            className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer ${align === 'left' ? 'bg-slate-200 text-[#0A66FF]' : ''}`}
            title="靠左对齐"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlign('center')}
            className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer ${align === 'center' ? 'bg-slate-200 text-[#0A66FF]' : ''}`}
            title="居中对齐"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAlign('right')}
            className={`p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer ${align === 'right' ? 'bg-slate-200 text-[#0A66FF]' : ''}`}
            title="靠右对齐"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-px h-4 bg-slate-200 shrink-0 self-center mx-1" />
          
          <span className="text-[10px] text-slate-400 select-none font-bold">字号</span>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="bg-transparent border border-slate-200 text-slate-600 rounded px-1 py-0.5 text-[10px] font-black outline-none cursor-pointer focus:border-[#0A66FF]"
          >
            <option value="11px">11px</option>
            <option value="12px">12px</option>
            <option value="13px">13px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
          </select>
          
          <span className="w-px h-4 bg-slate-200 shrink-0 self-center mx-1" />
          
          <span className="text-[10px] text-slate-400 select-none font-bold">字体</span>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-transparent border border-slate-200 text-slate-600 rounded px-1 py-0.5 text-[10px] font-black outline-none cursor-pointer focus:border-[#0A66FF]"
          >
            <option value="标准字体">标准字体</option>
            <option value="黑体">黑体</option>
            <option value="宋体">宋体</option>
            <option value="楷体">楷体</option>
          </select>
          
          <span className="w-px h-4 bg-slate-200 shrink-0 self-center mx-1" />
          
          <button
            type="button"
            onClick={() => insertTextTemplate('link')}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
            title="超链接"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextTemplate('image')}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
            title="图片"
          >
            <Image className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertTextTemplate('table')}
            className="p-1.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
            title="插入表格"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => alert('已开启最大化沉浸式无干扰填报保护框')}
            className="p-1.5 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer ml-auto"
            title="全屏画布"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
        
        {/* Editor Body Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '在此处输入丰富的技术阐述和指标规划...'}
          className={`w-full min-h-[160px] px-4 py-3 text-slate-800 focus:bg-white text-xs leading-relaxed resize-none outline-none bg-white transition-all ${
            isBold ? 'font-black' : 'font-semibold'
          } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''} ${isStrike ? 'line-through' : ''} ${
            align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
          }`}
          style={{
            fontSize: fontSize,
            fontFamily: fontFamily === '黑体' ? 'SimHei, sans-serif' : fontFamily === '楷体' ? 'KaiTi, serif' : fontFamily === '宋体' ? 'SimSun, serif' : 'inherit'
          }}
        />
      </div>
    </div>
  );
};

export const ProjectCreatePage: React.FC<Props> = ({ 
  onBack, 
  onSubmit, 
  isPrefilled = true, 
  uploadedFileName, 
  uploadedFileSize 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idPhotoInputRef = useRef<HTMLInputElement>(null);
  const oneInchPhotoInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(() => {
    if (isPrefilled && uploadedFileName) {
      return {
        name: uploadedFileName,
        size: uploadedFileSize || '12.4 MB'
      };
    }
    return null;
  });

  // Form Tabs State
  const [activeFormTab, setActiveFormTab] = useState<'cover' | 'members' | 'info' | 'ai_advice'>('cover');
  const [isReevaluating, setIsReevaluating] = useState(false);
  const [activeAdviceDimension, setActiveAdviceDimension] = useState<'expert' | 'investor' | 'market'>('expert');

  // Form State
  const [formData, setFormData] = useState(() => {
    if (!isPrefilled) {
      return {
        planNamePart1: '宁波市甬江人才工程',
        planNamePart2: '制造业创业项目',
        declarationType: '创业人才',
        projectName: '',
        specialtyField: '生命健康-基础化学原材料、化学原材料、仿制药',
        specialtyDirection: '',
        landingArea: '海曙区',
        enterpriseProposedName: '',
        
        // Tab 2: Members
        members: [] as any[],
        
        // Tab 3: Detailed Tech Info
        patentCount: '',
        marketSize: '',
        seedFund: '',
        projectDesc: '',
        projectBrief: '',
        projectBackground: '',
        projectImplementation: '',
        projectMilestones: '',
        projectFoundation: '',
        projectMainMetrics: '',
        inventionPatentApply: 0,
        inventionPatentAuthorize: 0,
        utilityModelPatentApply: 0,
        utilityModelPatentAuthorize: 0,
        internationalPatentApply: 0,
        internationalPatentAuthorize: 0,
        patentDescription: '无',
        projectEconomicAnnualRevenue: '',
        projectEconomicAnnualProfitTax: '',
        projectEconomicJobsGenerated: '',
        projectEconomicDetails: '',
        
        // Structured Milestone Form Fields matches Image 2
        milestonesTable: [] as any[],
        totalInvestmentForecast: '',
        employerPlannedInvestment: '',
        districtReceivedSupport: '',
        employerAlreadyInvested: '',

        // Tab 4: Submit status
        smsCode: '',
        phone: '',

        // Tab 5: Opinion
        expertFeedback: '未匹配到初审意见，请先保存信息、确认验证后交由地方评审委员会线上裁决。'
      };
    }

    return {
      planNamePart1: '宁波市甬江人才工程',
      planNamePart2: '制造业创业项目',
      declarationType: '创业人才',
      projectName: '123',
      specialtyField: '生命健康-基础化学原材料、化学原材料、仿制药',
      specialtyDirection: '基础化学原材料、化学原材料、仿制药',
      landingArea: '海曙区',
      enterpriseProposedName: '123',
      
      // Tab 2: Members
      members: [
        {
          id: '1',
          memberType: '带头人',
          name: '李瑞华',
          idType: '身份证',
          idNumber: '220625200110092426',
          phoneNumber: '18888888888',
          birthDate: '2001-10-09',
          age: '24',
          nationality: '中国',
          birthPlace: '吉林省',
          isGreenCard: '否',
          greenCardNationality: '',
          sequenceNumber: '1',
          firstNameCh: '瑞华',
          lastNameCh: '李'
        },
        {
          id: '2',
          memberType: '骨干人才',
          name: '王敏婕',
          idType: '护照',
          idNumber: 'EE9852231',
          phoneNumber: '13912345678',
          birthDate: '1992-04-15',
          age: '34',
          nationality: '中国',
          birthPlace: '北京市',
          isGreenCard: '否',
          greenCardNationality: '',
          sequenceNumber: '2',
          firstNameCh: '敏婕',
          lastNameCh: '王'
        }
      ],
      
      // Tab 3: Detailed Tech Info
      patentCount: '15 项',
      marketSize: '年产值预计超 3 亿人民币',
      seedFund: '2000 万人民币',
      projectDesc: '通过人工智能精密计算与脱敏数据存储技术，围绕生命健康基础化学原材料与仿制药生产进行优化预测。',
      projectBrief: '基于高分子拓扑 network 预测模型与动态计算化学技术，打造生命健康核心原料中试放大与仿制药开发全栈数智平台。解决基础原材料国产替代和分子结构精准比对瓶颈。',
      projectBackground: '在生命健康和新材料工程领域，本项目致力于突破高分子拓扑网络预测等核心技术，实现仿制药重点原材料的安全稳定本地化量产，填补华东地区工业级微反应算力中试链条空白。结合宁波市及海曙区先进智能制造生产线，首批中试样品分子纯度及活性均突破 99.8% 行业极限，全面解决基础原料高度进口依赖的重大卡脖子隐患，满足国际和地方双重高纯度化学物料流监测质量规范。',
      projectImplementation: '1. 算法流体控制子系统集成：开展高分子混合动力学物料三维动态分布推演。\n2. 连续微通道反应装置中试测试：搭建由多段精馏段 and 配方比例分配阀构成的微流体测试舱完成验证。\n3. 配糖体工艺分子质谱级数据实时脱敏监控。',
      projectMilestones: '1. 2026年Q3：搭建多温区流体物相突变智能监控组件，并适配中试车间基础DCS系统。\n2. 2026年Q4：完成生命健康仿制药基础原材料联合实验中试产线首批投产，申请发明软件著作权 3 项。\n3. 2027年Q2：高分子混料工艺多相流阀群完成第二跑车间投料，完成营收超 4000 万元。',
      projectFoundation: '团队项目主要包括团队组建情况、合作基础及每个成员分工，项目研发和知识产权情况，市场开拓情况等。个人项目主要包括项目研发和知识产权情况，市场开拓情况等。',
      projectMainMetrics: '1. 突破生命健康高精细混料拓扑计算技术，在中试环境下物料调配工艺反应速率提升30%。\n2. 绿色能耗达标：综合碳排放强度降低25%-30%以上。\n3. 年审成果：获得具有自主所有权的配套高分子工艺库并获软件著作权和发明证书。',
      inventionPatentApply: 0,
      inventionPatentAuthorize: 0,
      utilityModelPatentApply: 0,
      utilityModelPatentAuthorize: 0,
      internationalPatentApply: 0,
      internationalPatentAuthorize: 0,
      patentDescription: '无',
      projectEconomicAnnualRevenue: '',
      projectEconomicAnnualProfitTax: '',
      projectEconomicJobsGenerated: '',
      projectEconomicDetails: '',
      
      // Structured Milestone Form Fields matches Image 2
      milestonesTable: [
        { phase: '阶段一', startTime: '2026-07-01', endTime: '2026-12-31', investment: '400', target: '搭建双温流体拓扑模型框架，完成海曙车间设备联调。' },
        { phase: '阶段二', startTime: '2027-01-01', endTime: '2027-06-30', investment: '350', target: '首批原料物性检测纯度超99.8%，并提交国家发明专利。' },
        { phase: '阶段三', startTime: '2027-07-01', endTime: '2027-12-31', investment: '450', target: '中试投产，打通多通道反应试制，并完成首单物料结算。' }
      ],
      totalInvestmentForecast: '1200',
      employerPlannedInvestment: '800',
      districtReceivedSupport: '200',
      employerAlreadyInvested: '300',

      // Tab 4: Submit status
      smsCode: '',
      phone: '',

      // Tab 5: Opinion
      expertFeedback: '未匹配到初审意见，请先保存信息、确认验证后交由地方评审委员会线上裁决。'
    };
  });

  // Saving Countdown & Sub-tabs state inside Project Info (Tab 3)
  const [activeInfoSubTab, setActiveInfoSubTab] = useState<'background' | 'implementation' | 'milestones' | 'foundation' | 'contribution' | 'economic'>('background');
  const [autoSaveSeconds, setAutoSaveSeconds] = useState(30);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return now.toTimeString().split(' ')[0];
    };
    setLastAutoSaveTime(formatTime());

    const timer = setInterval(() => {
      setAutoSaveSeconds(prev => {
        if (prev <= 1) {
          setIsAutoSaving(true);
          setTimeout(() => {
            setIsAutoSaving(false);
            setLastAutoSaveTime(formatTime());
          }, 1500);
          return 30; // resets countdown to 30
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddMilestoneRow = () => {
    const newRow = {
      phase: '',
      startTime: '',
      endTime: '',
      investment: '',
      target: ''
    };
    setFormData(prev => ({
      ...prev,
      milestonesTable: [...(prev.milestonesTable || []), newRow]
    }));
  };

  const handleRemoveMilestoneRow = (index: number) => {
    setFormData(prev => {
      const updatedTable = [...(prev.milestonesTable || [])];
      updatedTable.splice(index, 1);
      return {
        ...prev,
        milestonesTable: updatedTable
      };
    });
  };

  const handleEditMilestoneRow = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedTable = [...(prev.milestonesTable || [])];
      updatedTable[index] = {
        ...updatedTable[index],
        [field]: value
      };
      return {
        ...prev,
        milestonesTable: updatedTable
      };
    });
  };

  // Member lists selection, filtering and inline editor states
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  
  // Search Filters State
  const [filterName, setFilterName] = useState('');
  const [filterProjectName, setFilterProjectName] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterIdNumber, setFilterIdNumber] = useState('');
  const [filterPhone, setFilterPhone] = useState('');

  // Active Filter Applied parameters
  const [activeFilters, setActiveFilters] = useState({
    name: '',
    projectName: '',
    batch: '',
    idNumber: '',
    phone: ''
  });

  // Inline Editing Form State
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null); // 'new' or specific id
  const [memberForm, setMemberForm] = useState({
    memberType: '带头人',
    firstNameCh: '',
    lastNameCh: '',
    isGreenCard: '否',
    greenCardNationality: '',
    idType: '身份证',
    idNumber: '',
    age: '',
    birthDate: '',
    birthPlace: '北京市',
    phoneNumber: '',
    nationality: '中国',
    sequenceNumber: '0',
    idPhoto: '',
    oneInchPhoto: ''
  });

  const filteredMembers = formData.members.filter(member => {
    if (activeFilters.name && !member.name.includes(activeFilters.name)) return false;
    if (activeFilters.projectName && !(formData.projectName || '').toLowerCase().includes(activeFilters.projectName.toLowerCase())) return false;
    if (activeFilters.idNumber && !member.idNumber.toLowerCase().includes(activeFilters.idNumber.toLowerCase())) return false;
    if (activeFilters.phone && !member.phoneNumber.includes(activeFilters.phone)) return false;
    return true;
  });

  const handleSearch = () => {
    setActiveFilters({
      name: filterName,
      projectName: filterProjectName,
      batch: filterBatch,
      idNumber: filterIdNumber,
      phone: filterPhone
    });
  };

  const handleReset = () => {
    setFilterName('');
    setFilterProjectName('');
    setFilterBatch('');
    setFilterIdNumber('');
    setFilterPhone('');
    setActiveFilters({
      name: '',
      projectName: '',
      batch: '',
      idNumber: '',
      phone: ''
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMemberIds(filteredMembers.map(m => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMemberIds(prev => [...prev, id]);
    } else {
      setSelectedMemberIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedMemberIds.length === 0) return;
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(item => !selectedMemberIds.includes(item.id))
    }));
    setSelectedMemberIds([]);
    if (editingMemberId && selectedMemberIds.includes(editingMemberId)) {
      setEditingMemberId(null);
    }
  };

  const handleDeleteOne = (id: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(item => item.id !== id)
    }));
    setSelectedMemberIds(prev => prev.filter(item => item !== id));
    if (editingMemberId === id) {
      setEditingMemberId(null);
    }
  };

  const handleAddNewMemberClick = () => {
    setEditingMemberId('new');
    setMemberForm({
      memberType: '带头人',
      firstNameCh: '',
      lastNameCh: '',
      isGreenCard: '否',
      greenCardNationality: '',
      idType: '身份证',
      idNumber: '',
      age: '',
      birthDate: '',
      birthPlace: '北京市',
      phoneNumber: '',
      nationality: '中国',
      sequenceNumber: String(formData.members.length + 1),
      idPhoto: '',
      oneInchPhoto: ''
    });
  };

  const handleEditMemberClick = (member: any) => {
    setEditingMemberId(member.id);
    setMemberForm({
      memberType: member.memberType || '带头人',
      firstNameCh: member.firstNameCh || '',
      lastNameCh: member.lastNameCh || '',
      isGreenCard: member.isGreenCard || '否',
      greenCardNationality: member.greenCardNationality || '',
      idType: member.idType || '身份证',
      idNumber: member.idNumber || '',
      age: member.age || '',
      birthDate: member.birthDate || '',
      birthPlace: member.birthPlace || '北京市',
      phoneNumber: member.phoneNumber || '',
      nationality: member.nationality || '中国',
      sequenceNumber: member.sequenceNumber || '0',
      idPhoto: member.idPhoto || '',
      oneInchPhoto: member.oneInchPhoto || ''
    });
  };

  const handleSaveMemberInline = () => {
    if (!memberForm.lastNameCh.trim() && !memberForm.firstNameCh.trim()) {
      alert('请输入姓名');
      return;
    }
    const fullName = `${memberForm.lastNameCh.trim()}${memberForm.firstNameCh.trim()}`;
    
    if (editingMemberId === 'new') {
      const newMember = {
        id: `m-${Date.now()}`,
        memberType: memberForm.memberType,
        name: fullName,
        idType: memberForm.idType,
        idNumber: memberForm.idNumber,
        phoneNumber: memberForm.phoneNumber,
        birthDate: memberForm.birthDate,
        age: memberForm.age || '24',
        nationality: memberForm.nationality,
        birthPlace: memberForm.birthPlace,
        isGreenCard: memberForm.isGreenCard,
        greenCardNationality: memberForm.greenCardNationality,
        sequenceNumber: memberForm.sequenceNumber,
        firstNameCh: memberForm.firstNameCh,
        lastNameCh: memberForm.lastNameCh,
        idPhoto: memberForm.idPhoto,
        oneInchPhoto: memberForm.oneInchPhoto
      };
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, newMember]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        members: prev.members.map(item => {
          if (item.id === editingMemberId) {
            return {
              ...item,
              memberType: memberForm.memberType,
              name: fullName,
              idType: memberForm.idType,
              idNumber: memberForm.idNumber,
              phoneNumber: memberForm.phoneNumber,
              birthDate: memberForm.birthDate,
              age: memberForm.age || '24',
              nationality: memberForm.nationality,
              birthPlace: memberForm.birthPlace,
              isGreenCard: memberForm.isGreenCard,
              greenCardNationality: memberForm.greenCardNationality,
              sequenceNumber: memberForm.sequenceNumber,
              firstNameCh: memberForm.firstNameCh,
              lastNameCh: memberForm.lastNameCh,
              idPhoto: memberForm.idPhoto,
              oneInchPhoto: memberForm.oneInchPhoto
            };
          }
          return item;
        })
      }));
    }
    setEditingMemberId(null);
  };

  const getProjectScore = () => {
    let score = 55;
    const isVagueName = !formData.projectName || 
                        formData.projectName.trim() === '123' || 
                        formData.projectName.trim().length < 5 ||
                        formData.projectName.trim() === '新项目';
    if (!isVagueName) {
      score += 15;
    }
    if (formData.members && formData.members.length >= 3) {
      score += 15;
    }
    const hasPhotos = formData.members && formData.members.length > 0 && formData.members.every((m: any) => m.idPhoto || m.oneInchPhoto);
    if (hasPhotos) {
      score += 15;
    }
    // Check if totalInvestmentForecast is filled and is reasonably sized
    const hasBudget = formData.totalInvestmentForecast && parseInt(formData.totalInvestmentForecast) >= 300;
    if (hasBudget) {
      score += 10;
    }
    return Math.min(100, score);
  };

  const getDetailedScores = () => {
    const score = getProjectScore();
    
    const isVagueName = !formData.projectName || 
                        formData.projectName.trim() === '123' || 
                        formData.projectName.trim().length < 5 ||
                        formData.projectName.trim() === '新项目';
    const nameScore = isVagueName ? 10 : 30;
    
    const hasPhotos = formData.members && formData.members.length > 0 && formData.members.every((m: any) => m.idPhoto || m.oneInchPhoto);
    const hasMembers = formData.members && formData.members.length >= 3;
    let teamScore = 15;
    if (hasMembers && hasPhotos) {
      teamScore = 30;
    } else if (hasMembers) {
      teamScore = 25;
    } else if (hasPhotos) {
      teamScore = 20;
    }
    
    const hasBudget = formData.totalInvestmentForecast && parseInt(formData.totalInvestmentForecast) >= 300;
    const financeScore = hasBudget ? 20 : 10;
    
    const milestoneScore = (formData.milestonesTable && formData.milestonesTable.length >= 2) ? 10 : 5;
    
    // Overall adjusts dynamically so sum equals target score
    const subtotal = nameScore + teamScore + financeScore + milestoneScore;
    const overallScore = Math.max(5, Math.min(10, score - subtotal));
    const total = Math.min(100, nameScore + teamScore + financeScore + milestoneScore + overallScore);
    
    let grade = 'E';
    let desc = '多项关键硬性指标严重空缺，存在形式初审不通过可能性，建议尽快修正。';
    let gradeColor = 'text-[#A02C45]'; // matching a nice deep red/crimson in picture 1
    let progressColor = 'bg-[#A02C45] opacity-95';
    
    if (total >= 90) {
      grade = 'A';
      desc = '核心要素完美备齐，符合高规格制造业评审规范，获评极速推荐级别。';
      gradeColor = 'text-emerald-600';
      progressColor = 'bg-emerald-500';
    } else if (total >= 75) {
      grade = 'B';
      desc = '材料总体表现良好，具备较高的形式契合度与中上等申报合规机率。';
      gradeColor = 'text-[#0A66FF]';
      progressColor = 'bg-[#0A66FF]';
    } else if (total >= 60) {
      grade = 'D';
      desc = '信息架构大体就位，但学术成色不足且含有多处次级合规细节需要补全。';
      gradeColor = 'text-amber-500';
      progressColor = 'bg-amber-500';
    }
    
    return {
      nameScore,
      teamScore,
      financeScore,
      milestoneScore,
      overallScore,
      total,
      grade,
      desc,
      gradeColor,
      progressColor
    };
  };

  const handleAdoptProjectName = () => {
    setFormData(prev => ({
      ...prev,
      projectName: '基于生命高特性的靶向高纯度医药原材料合成工艺及产业化中试研究'
    }));
    alert('✅ 已自动采纳！已将符合符合行业和宁波人社专家评委要求的精准学术项目名称同步至核心封面。');
  };

  const handleAdoptPhotos = () => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((m: any, idx: number) => {
        if (idx === 0) {
          return {
            ...m,
            idPhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23e2e8f0"/><text x="100" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2364748b" text-anchor="middle">已扫描身份证件正面</text></svg>',
            oneInchPhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160" viewBox="0 0 120 160"><rect width="120" height="160" fill="%23dbeafe"/><text x="60" y="85" font-family="sans-serif" font-size="10" font-weight="bold" fill="%232563eb" text-anchor="middle">已补全一寸红底照片</text></svg>'
          };
        }
        return m;
      })
    }));
    alert('✅ 已补齐首发带头人证照！审核合规率获得阶段性提升。');
  };

  const handleAdoptBudgetAndMilestone = () => {
    setFormData(prev => ({
      ...prev,
      totalInvestmentForecast: '650',
      employerPlannedInvestment: '350',
      employerAlreadyInvested: '150',
      milestonesTable: [
        { id: '1', time: '2026-12', content: '完成高纯度靶向化工工艺中试研发，申报并受理由3项发明专利' },
        { id: '2', time: '2027-12', content: '建成首条年产30吨标准化生产线，试运行合格率达到99.6%以上' },
        { id: '3', time: '2028-12', content: '实现商用量产销售突破1200万元，产生地方纳税额200万元以上' }
      ]
    }));
    alert('✅ 预算及工程化量化里程碑采纳成功！目前已自适应调整到标准制造业500万级投资水平，并按SMART机制补正阶段。');
  };

  const handleMockAddSalesPartner = () => {
    const newPartner = {
      id: `m-${Date.now()}`,
      memberType: '骨干人才',
      name: '陈建国',
      idType: '身份证',
      idNumber: '330212198501254421',
      phoneNumber: '13857410029',
      birthDate: '1985-01-25',
      age: '41',
      nationality: '中国',
      birthPlace: '浙江省宁波市',
      isGreenCard: '否',
      greenCardNationality: '',
      sequenceNumber: String(formData.members.length + 1),
      firstNameCh: '建国',
      lastNameCh: '陈',
      idPhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23e2e8f0"/><text x="100" y="80" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2364748b" text-anchor="middle">已扫描身份证件正面</text></svg>',
      oneInchPhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160" viewBox="0 0 120 160"><rect width="120" height="160" fill="%23dbeafe"/><text x="60" y="85" font-family="sans-serif" font-size="10" font-weight="bold" fill="%232563eb" text-anchor="middle">已补全一寸蓝底照片</text></svg>'
    };
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, newPartner]
    }));
    alert('✅ 成功加入产业副总裁(陈建国)！主创业团队销售拓展及中试量产双核齐备。');
  };

  const handleTriggerReevaluating = () => {
    setIsReevaluating(true);
    setTimeout(() => {
      setIsReevaluating(false);
    }, 1200);
  };

  const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberForm(prev => ({
          ...prev,
          idPhoto: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOneInchPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberForm(prev => ({
          ...prev,
          oneInchPhoto: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      
      // Simulate AI analysis & progress
      setIsAnalyzing(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsAnalyzing(false);
              // Fill with mock data matching the new fields
              const clearName = file.name.replace(/\.[^/.]+$/, "");
              setFormData(prevForm => ({
                ...prevForm,
                projectName: clearName,
                enterpriseProposedName: clearName + '智造科技有限公司',
                specialtyDirection: '新一代智能分子化学配方研发与工艺匹配',
                specialtyField: '生命健康-基础化学原材料、化学原材料、仿制药'
              }));
              setActiveFormTab('cover');
            }, 500);
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleNextSubTab = () => {
    const infoSubTabs = [
      { id: 'background' },
      { id: 'implementation' },
      { id: 'milestones' },
      { id: 'foundation' },
      { id: 'contribution' },
      { id: 'economic' }
    ];
    const currentIndex = infoSubTabs.findIndex(t => t.id === activeInfoSubTab);
    if (currentIndex < infoSubTabs.length - 1) {
      setActiveInfoSubTab(infoSubTabs[currentIndex + 1].id as any);
    } else {
      setActiveFormTab('ai_advice');
    }
  };

  const handleSaveSubmit = () => {
    const projName = formData.projectName.trim() || '未命名智能项目';
    onSubmit({
      id: `p-${Date.now()}`,
      name: projName,
      industry: formData.planNamePart2 || '商业与智能系统',
      stage: '在研草稿',
      growthScore: 72,
      completeness: 35,
      riskIndex: 8,
      description: formData.projectDesc || '围绕生命健康化学配方领域的创新创业申报。',
      lastActivity: '刚刚保存',
      competitionsCount: 0,
      businessPlanCount: uploadedFile ? 1 : 0,
      status: 'draft',
      owner: '张江/海曙申报负责人',
      registeredDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="space-y-6 max-w-7xl mx-auto pb-16"
      id="new_project_page_container"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5" id="new_project_page_header">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 sm:p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
            title="返回项目列表"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-850">新建项目申请</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">创建独立项目资产，填写申报新信息或通过上传项目材料快速自律建模。</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50/60 border border-blue-100 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0A66FF] animate-pulse" />
          <span className="text-[10px] font-black tracking-wider text-slate-500">双创极速验证通道</span>
        </div>
      </div>

      {/* Main Single Column Area (fills the content space strictly as requested) */}
      <div className="w-full space-y-6">
        
        {/* Module 1: Upload Declaration File */}
        {isPrefilled && (
          <div className="bg-white border border-[#DDE8F5] rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(34,86,160,0.02)] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-[#0A66FF] rounded-full" />
              <h3 className="text-sm font-black text-slate-800">上传项目申报书</h3>
            </div>
            <p className="text-xs text-slate-400 font-bold leading-normal">
              系统将通过内置的安全智能算法识别您的申报书文件内容，并智能填充下方表格项（支持 PDF、WORD、PPT 等格式，最大 40MB）。
            </p>

            <div 
              onClick={triggerFileUpload}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none ${
                isAnalyzing 
                  ? 'border-[#8BBEFF] bg-[#F4F9FF]' 
                  : uploadedFile 
                    ? 'border-emerald-300 bg-emerald-50/10' 
                    : 'border-slate-200 bg-slate-50 hover:bg-[#F3F8FF] hover:border-[#8BBEFF]'
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".docx,.doc,.pdf,.txt,.pptx,.ppt"
                className="hidden"
              />

              {isAnalyzing ? (
                <div className="space-y-3 w-full max-w-[240px]">
                  <Loader2 className="w-10 h-10 animate-spin text-[#0A66FF] mx-auto" />
                  <div>
                    <p className="text-xs font-black text-slate-700">正在高速智能识别并预填表单...</p>
                    <p className="text-[10px] text-slate-400 mt-1">解析进度: {uploadProgress}%</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#0A66FF] h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mx-auto">
                    <Check className="w-6 h-6" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 line-clamp-1">{uploadedFile.name}</p>
                    <p className="text-[10px] text-emerald-600 font-extrabold mt-0.5">申报书读取成功并完成表单同步 ({uploadedFile.size})</p>
                  </div>
                  <span className="inline-block text-[9px] bg-slate-100 text-slate-500 font-black px-2.5 py-1 rounded hover:bg-slate-200 transition-colors mt-2">重新选择文件</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#0A66FF] mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">拖拽您的项目申报书到此处，或点击浏览本地文件</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">防泄密保护：上传材料仅用于本次多因子校准检测，实行脱敏保存模式</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Module 2: Enterprise Tabbed Forms (Fills Content Area) */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(34,86,160,0.015)] flex flex-col">
          
          {/* Form Tab Navigation (Compact Chinese SaaS style) */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100/60 flex flex-wrap items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'cover', name: '封面' },
                { id: 'members', name: '项目成员' },
                { id: 'info', name: '项目信息' },
                { id: 'ai_advice', name: 'AI建议反馈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all whitespace-nowrap outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
                    activeFormTab === tab.id
                      ? 'bg-white text-[#0A66FF] shadow-sm border border-slate-105'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            
            <div className="text-[11px] font-bold text-red-500/90 flex items-center gap-1.5 animate-pulse shrink-0">
              <span>←</span>
              <span>点击标签切换操作其它信息</span>
            </div>
          </div>

          {/* Form Workspace View area */}
          <div className="p-6 md:p-8 space-y-6">

            {/* Tab 1: 封面 (Cover Page Details matching picture perfectly) */}
            {activeFormTab === 'cover' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Project Dynamic Main Title Header */}
                <div className="border-b border-dashed border-slate-100 pb-5">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight select-all">
                    {formData.projectName || '123'}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
                  
                  {/* Row 1, Left: 计划名称 */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <span className="text-rose-500 font-extrabold">*</span>
                      <span>计划名称</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <select 
                        value={formData.planNamePart1}
                        onChange={(e) => setFormData({...formData, planNamePart1: e.target.value})}
                        className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-800 shadow-sm"
                      >
                        <option>宁波市甬江人才工程</option>
                        <option>北京市北京亦庄创新人才工程</option>
                        <option>上海市张江海外高层次创新项目</option>
                      </select>
                      <span className="text-slate-400 text-sm font-bold">-</span>
                      <select 
                        value={formData.planNamePart2}
                        onChange={(e) => setFormData({...formData, planNamePart2: e.target.value})}
                        className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-850 shadow-sm"
                      >
                        <option>制造业创业项目</option>
                        <option>数字智能化创新人才</option>
                        <option>生命健康高精尖方向</option>
                        <option>软件与算法系统配套</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 1, Right: 申报类型 */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <span className="text-rose-500 font-extrabold">*</span>
                      <span>申报类型</span>
                    </label>
                    <select 
                      value={formData.declarationType}
                      onChange={(e) => setFormData({...formData, declarationType: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-800 shadow-sm"
                    >
                      <option>创业人才</option>
                      <option>创新人才</option>
                      <option>青年拔尖带头人</option>
                      <option>校企联合重大专项</option>
                    </select>
                  </div>

                  {/* Row 2, Left: 项目名称 */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <span className="text-rose-500 font-extrabold">*</span>
                      <span>项目名称</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.projectName}
                      onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-800 shadow-sm" 
                    />
                  </div>

                  {/* Row 2, Right: 专业领域 */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <span className="text-rose-500 font-extrabold">*</span>
                      <span>专业领域</span>
                    </label>
                    <select 
                      value={formData.specialtyField}
                      onChange={(e) => setFormData({...formData, specialtyField: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-800 shadow-sm"
                    >
                      <option>生命健康-基础化学原材料、化学原材料、仿制药</option>
                      <option>新一代集成电路及微纳制程</option>
                      <option>新能源车联网与自主底盘解算</option>
                      <option>智能制造核心控制算法研发</option>
                    </select>
                  </div>

                  {/* Row 3, Left: 专业方向 */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <span className="text-rose-500 font-extrabold">*</span>
                      <span>专业方向</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.specialtyDirection}
                      onChange={(e) => setFormData({...formData, specialtyDirection: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-800 shadow-sm" 
                    />
                  </div>

                  {/* Row 3, Right: 引进地 */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <span className="text-rose-500 font-extrabold">*</span>
                      <span>引进地</span>
                    </label>
                    <select 
                      value={formData.landingArea}
                      onChange={(e) => setFormData({...formData, landingArea: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-800 shadow-sm"
                    >
                      <option>海曙区</option>
                      <option>北京亦庄开发区</option>
                      <option>浦东生命科学产业园</option>
                      <option>南山核心软件园</option>
                    </select>
                  </div>

                  {/* Row 4, Left: （拟）创办企业名称 */}
                  <div className="space-y-2.5 lg:col-span-1">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                      <span className="text-rose-500 font-extrabold">*</span>
                      <span>（拟）创办企业名称</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.enterpriseProposedName || ''}
                      onChange={(e) => setFormData({...formData, enterpriseProposedName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-xs font-black outline-none focus:border-[#0A66FF] transition-all text-slate-800 shadow-sm" 
                    />
                  </div>

                </div>

              </div>
            )}

            {/* Tab 2: 项目成员 */}
            {activeFormTab === 'members' && (
              <div className="space-y-6 animate-fade-in" id="members_tab_container">

                {/* 1. Action Toolbar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="members_action_toolbar">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleAddNewMemberClick}
                      className="px-4 py-2 bg-[#E1EEFF] hover:bg-[#D0E5FF] text-[#0A66FF] border border-[#B8D7FF]/30 rounded-lg text-xs font-black transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>+ 新增</span>
                    </button>
                    <button 
                      onClick={handleDeleteSelected}
                      disabled={selectedMemberIds.length === 0}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                        selectedMemberIds.length > 0
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/50'
                          : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                      }`}
                    >
                      <span>删除</span>
                    </button>
                  </div>
                  
                  {/* Tool info icons matching Image 1 */}
                  <div className="flex items-center gap-3 text-slate-400">
                    <button 
                      onClick={handleSearch} 
                      className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600" 
                      title="重载"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleReset}
                      className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600" 
                      title="重置"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* 2. Table Container */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm" id="members_table_container">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
                      <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-700 font-extrabold select-none">
                        <tr>
                          {/* Checked Checkbox Header */}
                          <th className="py-3 px-4 w-10 text-center">
                            <input 
                              type="checkbox"
                              checked={filteredMembers.length > 0 && selectedMemberIds.length === filteredMembers.length}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              className="w-3.5 h-3.5 text-[#0A66FF] border-slate-300 rounded focus:ring-[#0A66FF]/25 cursor-pointer"
                            />
                          </th>
                          <th className="py-3 px-4">成员类型</th>
                          <th className="py-3 px-4">姓名</th>
                          <th className="py-3 px-4">证件号</th>
                          <th className="py-3 px-4">手机号</th>
                          <th className="py-3 px-4">出生日期</th>
                          <th className="py-3 px-4">年龄</th>
                          <th className="py-3 px-4">国籍</th>
                          <th className="py-3 px-4 text-center">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-slate-400 font-bold bg-white">
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <span className="text-sm">暂无数据</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((member) => (
                            <tr 
                              key={member.id} 
                              className={`hover:bg-slate-50/50 transition-colors ${
                                selectedMemberIds.includes(member.id) ? 'bg-blue-50/20' : ''
                              }`}
                            >
                              <td className="py-3.5 px-4 text-center">
                                <input 
                                  type="checkbox"
                                  checked={selectedMemberIds.includes(member.id)}
                                  onChange={(e) => handleSelectOne(member.id, e.target.checked)}
                                  className="w-3.5 h-3.5 text-[#0A66FF] border-slate-300 rounded focus:ring-[#0A66FF]/20 cursor-pointer"
                                />
                              </td>
                              <td className="py-3.5 px-4 text-slate-800 font-bold">{member.memberType}</td>
                              <td className="py-3.5 px-4 font-extrabold text-[#0A66FF]">
                                <div className="flex items-center gap-1.5">
                                  <span>{member.name}</span>
                                  {member.idPhoto && (
                                    <span className="inline-flex items-center text-[8px] font-black bg-blue-50 text-[#0A66FF] border border-blue-100 px-1 py-0.2 rounded select-none" title="已上传置换证件照">证件照</span>
                                  )}
                                  {member.oneInchPhoto && (
                                    <span className="inline-flex items-center text-[8px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-1 py-0.2 rounded select-none" title="已上传免冠一寸照">一寸照</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-500">{member.idNumber || '—'}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-500">{member.phoneNumber || '—'}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-500">{member.birthDate || '—'}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-500">{member.age || '—'}</td>
                              <td className="py-3.5 px-4">{member.nationality || '中国'}</td>
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleEditMemberClick(member)}
                                    className="text-[#0A66FF] hover:text-blue-700 font-black cursor-pointer text-[11px]"
                                  >
                                    编辑
                                  </button>
                                  <span className="text-slate-200">|</span>
                                  <button 
                                    onClick={() => handleDeleteOne(member.id)}
                                    className="text-rose-500 hover:text-rose-700 font-black cursor-pointer text-[11px]"
                                  >
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Popup Dialog Form Editor Overlay (shown when editingMemberId is active) */}
                {editingMemberId !== null && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px]">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
                      id="members_popup_modal"
                    >
                      
                      {/* Header with Title and Warning Alert matches Image 2 perfectly */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 p-6">
                        <div>
                          <h4 className="text-base font-black text-slate-800">
                            {editingMemberId === 'new' ? `添加项目成员` : `编辑项目成员 - ${memberForm.lastNameCh}${memberForm.firstNameCh}`}
                          </h4>
                          <p className="text-[10px] text-red-500/95 font-extrabold mt-1">
                            * 请确保本人知悉申报事宜，避免引起不必要的误会
                          </p>
                        </div>
                        <button 
                          onClick={() => setEditingMemberId(null)}
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full font-bold text-base cursor-pointer transition-colors"
                          title="关闭"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Scrollable Form Body */}
                      <div className="overflow-y-auto p-6 space-y-6">
                        {/* Highly Polished Forms Grid of 13 Fields matches Image 2 layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          
                          {/* Field 1: 成员类型 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 成员类型
                            </label>
                            <select
                              value={memberForm.memberType}
                              onChange={(e) => setMemberForm({...memberForm, memberType: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800"
                            >
                              <option value="带头人">带头人</option>
                              <option value="骨干人才">骨干人才</option>
                              <option value="核心成员">核心成员</option>
                              <option value="普通成员">普通成员</option>
                            </select>
                          </div>

                          {/* Field 2: 国籍 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 国籍
                            </label>
                            <select
                              value={memberForm.nationality}
                              onChange={(e) => setMemberForm({...memberForm, nationality: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800"
                            >
                              <option value="中国">中国</option>
                              <option value="美国">美国</option>
                              <option value="德国">德国</option>
                              <option value="英国">英国</option>
                              <option value="日本">日本</option>
                              <option value="加拿大">加拿大</option>
                            </select>
                          </div>

                          {/* Field 3: 姓（中） */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 姓(中)
                            </label>
                            <input 
                              type="text"
                              placeholder="请输入中文姓"
                              value={memberForm.lastNameCh}
                              onChange={(e) => setMemberForm({...memberForm, lastNameCh: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800" 
                            />
                          </div>

                          {/* Field 4: 名（中） */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 名(中)
                            </label>
                            <input 
                              type="text"
                              placeholder="请输入中文名"
                              value={memberForm.firstNameCh}
                              onChange={(e) => setMemberForm({...memberForm, firstNameCh: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800" 
                            />
                          </div>

                          {/* Field 5: 是否绿卡 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">是否绿卡</label>
                            <div className="flex gap-2">
                              {['是', '否'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setMemberForm({...memberForm, isGreenCard: opt})}
                                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all border ${
                                    memberForm.isGreenCard === opt
                                      ? 'bg-[#0A66FF] border-[#0A66FF] text-white shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Field 6: 绿卡国籍 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">绿卡国籍</label>
                            <select
                              disabled={memberForm.isGreenCard === '否'}
                              value={memberForm.greenCardNationality}
                              onChange={(e) => setMemberForm({...memberForm, greenCardNationality: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800 disabled:opacity-50 disabled:bg-slate-105 disabled:cursor-not-allowed"
                            >
                              <option value="">请选择国籍</option>
                              <option value="美国">美国</option>
                              <option value="德国">德国</option>
                              <option value="英国">英国</option>
                              <option value="加拿大">加拿大</option>
                            </select>
                          </div>

                          {/* Field 7: 证件类型 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 证件类型
                            </label>
                            <select
                              value={memberForm.idType}
                              onChange={(e) => setMemberForm({...memberForm, idType: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800"
                            >
                              <option value="身份证">身份证</option>
                              <option value="护照">护照</option>
                              <option value="港澳通行证">港澳居民往来内地通行证</option>
                            </select>
                          </div>

                          {/* Field 8: 证件号 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 证件号
                            </label>
                            <input 
                              type="text"
                              placeholder="请输入合规登记证件号"
                              value={memberForm.idNumber}
                              onChange={(e) => setMemberForm({...memberForm, idNumber: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800" 
                            />
                          </div>

                          {/* Field 9: 申报年龄 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 申报年龄
                            </label>
                            <input 
                              type="number"
                              placeholder="请输入申报年龄"
                              value={memberForm.age}
                              onChange={(e) => setMemberForm({...memberForm, age: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800" 
                            />
                          </div>

                          {/* Field 10: 出生日期 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 出生日期
                            </label>
                            <input 
                              type="date"
                              value={memberForm.birthDate}
                              onChange={(e) => setMemberForm({...memberForm, birthDate: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800 cursor-pointer" 
                            />
                          </div>

                          {/* Field 11: 出生地 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 出生地
                            </label>
                            <select
                              value={memberForm.birthPlace}
                              onChange={(e) => setMemberForm({...memberForm, birthPlace: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800"
                            >
                              <option value="吉林省">吉林省</option>
                              <option value="北京市">北京市</option>
                              <option value="浙江省">浙江省</option>
                              <option value="上海市">上海市</option>
                              <option value="广东省">广东省</option>
                            </select>
                          </div>

                          {/* Field 12: 手机号 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 手机号
                            </label>
                            <input 
                              type="text"
                              placeholder="请输入常用手机号"
                              value={memberForm.phoneNumber}
                              onChange={(e) => setMemberForm({...memberForm, phoneNumber: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800" 
                            />
                          </div>

                          {/* Field 13: 顺序位 */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700">
                              <span className="text-rose-500 font-extrabold">*</span> 顺序位
                            </label>
                            <input 
                              type="number"
                              value={memberForm.sequenceNumber}
                              onChange={(e) => setMemberForm({...memberForm, sequenceNumber: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2 text-xs font-extrabold outline-none focus:border-[#0A66FF] shadow-sm text-slate-800" 
                            />
                          </div>

                          {/* Field 14: 上传证件照片 */}
                          <div className="space-y-1.5 col-span-1">
                            <label className="text-xs font-black text-slate-700 block">
                              上传证件照片
                            </label>
                            <input 
                              type="file"
                              ref={idPhotoInputRef}
                              onChange={handleIdPhotoChange}
                              accept="image/*"
                              className="hidden"
                            />
                            {memberForm.idPhoto ? (
                              <div className="relative border border-slate-150 rounded-xl p-3 bg-slate-50/50 flex items-center gap-3">
                                <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
                                  <img 
                                    src={memberForm.idPhoto} 
                                    alt="证件照片" 
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black text-slate-700 truncate">证件照片已就绪</p>
                                  <p className="text-[9px] text-[#0A66FF] font-extrabold">点击更换或清除</p>
                                </div>
                                <div className="flex flex-col gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => idPhotoInputRef.current?.click()}
                                    className="px-2 py-0.5 text-[9px] font-black bg-[#0A66FF] text-white rounded hover:bg-md-blue transition-colors"
                                  >
                                    更换
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setMemberForm(prev => ({ ...prev, idPhoto: '' }))}
                                    className="px-2 py-0.5 text-[9px] font-black bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                                  >
                                    清除
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                onClick={() => idPhotoInputRef.current?.click()}
                                className="border border-dashed border-slate-200 hover:border-[#0A66FF] hover:bg-slate-50/50 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none bg-slate-50/20"
                              >
                                <div className="w-8 h-8 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0A66FF] mb-1.5">
                                  <Upload className="w-4 h-4" />
                                </div>
                                <p className="text-[10px] font-black text-slate-800">点击上传证件照 (国籍对应身份证件)</p>
                                <p className="text-[8px] text-slate-400 font-bold mt-0.5">支持 JPG、PNG 格式</p>
                              </div>
                            )}
                          </div>

                          {/* Field 15: 上传一寸证件照片 */}
                          <div className="space-y-1.5 col-span-1">
                            <label className="text-xs font-black text-slate-700 block">
                              上传一寸证件照片
                            </label>
                            <input 
                              type="file"
                              ref={oneInchPhotoInputRef}
                              onChange={handleOneInchPhotoChange}
                              accept="image/*"
                              className="hidden"
                            />
                            {memberForm.oneInchPhoto ? (
                              <div className="relative border border-slate-150 rounded-xl p-3 bg-slate-50/50 flex items-center gap-3">
                                <div className="w-10 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
                                  <img 
                                    src={memberForm.oneInchPhoto} 
                                    alt="一寸证件照片" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black text-slate-700 truncate">尺寸与免冠正常</p>
                                  <p className="text-[9px] text-[#0A66FF] font-extrabold">点击更换或清除</p>
                                </div>
                                <div className="flex flex-col gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => oneInchPhotoInputRef.current?.click()}
                                    className="px-2 py-0.5 text-[9px] font-black bg-[#0A66FF] text-white rounded hover:bg-md-blue transition-colors"
                                  >
                                    更换
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setMemberForm(prev => ({ ...prev, oneInchPhoto: '' }))}
                                    className="px-2 py-0.5 text-[9px] font-black bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                                  >
                                    清除
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                onClick={() => oneInchPhotoInputRef.current?.click()}
                                className="border border-dashed border-slate-200 hover:border-[#0A66FF] hover:bg-slate-50/50 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none bg-slate-50/20"
                              >
                                <div className="w-8 h-8 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0A66FF] mb-1.5">
                                  <User className="w-4 h-4" />
                                </div>
                                <p className="text-[10px] font-black text-slate-800">点击上传一寸彩色免冠照片</p>
                                <p className="text-[8px] text-slate-400 font-bold mt-0.5">标准证件比，通常用于申报备案</p>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                      {/* Submit Actions Area inside layout strictly, matching Image 2 perfectly */}
                      <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                        <button 
                          type="button"
                          onClick={() => setEditingMemberId(null)}
                          className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black cursor-pointer transition-colors outline-none focus:outline-none"
                        >
                          取消
                        </button>
                        <button 
                          type="button"
                          onClick={handleSaveMemberInline}
                          className="px-8 py-2 bg-[#0A66FF] hover:bg-blue-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
                        >
                          确定
                        </button>
                      </div>

                    </motion.div>
                  </div>
                )}

              </div>
            )}

            {/* Tab 3: 项目信息 */}
            {activeFormTab === 'info' && (
              <div className="space-y-6 animate-fade-in text-left">

                {/* Main subtab content zone with visual consistency - super light border per design instructions */}
                <div className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm space-y-6">
                  {/* Embedded Subtabs Header Area */}
                  <div className="flex items-center justify-between border-b border-dashed border-slate-100 pb-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight select-all">
                      {formData.projectName || '123'}
                    </h2>
                  </div>

                  {/* Nested Sub Tabs Nav - extremely light border to prevent any black lines */}
                  <div className="flex border-b border-slate-100/60 overflow-x-auto scrollbar-none pb-0.5 whitespace-nowrap">
                    {[
                      { id: 'background', label: '项目背景意义' },
                      { id: 'implementation', label: '项目实施内容' },
                      { id: 'milestones', label: '阶段性目标' },
                      { id: 'foundation', label: '现有创业基础' },
                      { id: 'contribution', label: '预期贡献及验收指标' },
                      { id: 'economic', label: '预期经济效益指标' }
                    ].map((subTab) => (
                      <button
                        key={subTab.id}
                        type="button"
                        onClick={() => setActiveInfoSubTab(subTab.id as any)}
                        className={`px-4 py-2 text-xs font-black relative whitespace-nowrap transition-all outline-none focus:outline-none focus:ring-0 cursor-pointer ${
                          activeInfoSubTab === subTab.id
                            ? 'text-[#0A66FF]'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>{subTab.label}</span>
                        {activeInfoSubTab === subTab.id && (
                          <motion.div
                            layoutId="activeSubTabLine"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A66FF]"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Subtab Panels */}
                  <div className="space-y-6">
                    {/* Background Significance (項目背景意義) */}
                    {activeInfoSubTab === 'background' && (
                      <div className="space-y-6 animate-fade-in text-left">
                        {/* 1. 项目简要介绍 with Rich Text Editor */}
                        <RichTextEditor
                          label="项目简要介绍 (500字以内的文字介绍)"
                          value={formData.projectBrief}
                          onChange={(val) => setFormData({ ...formData, projectBrief: val })}
                          placeholder="请输入相关的技术和产品壁垒介绍并支持多因子粗体标注（500字以内）..."
                        />

                        {/* 2. 项目背景意义 with Rich Text Editor */}
                        <RichTextEditor
                          label="项目背景意义"
                          value={formData.projectBackground}
                          onChange={(val) => setFormData({ ...formData, projectBackground: val })}
                          placeholder="请输入立项背景意义、痛点分析及当前宁波地方配料替代需求优势..."
                        />
                      </div>
                    )}

                    {/* Implementation Content (項目實施內容) */}
                    {activeInfoSubTab === 'implementation' && (
                      <div className="space-y-6 animate-fade-in text-left">
                        <RichTextEditor
                          label="主要研发产品、拟解决的关键技术，以及核心竞争力、赢利模式和宁波本地产业的相融性。"
                          value={formData.projectImplementation}
                          onChange={(val) => setFormData({ ...formData, projectImplementation: val })}
                          placeholder="请输入主要研发产品、拟解决的关键技术，以及核心竞争力、赢利模式和宁波本地产业的相融性等内容..."
                        />
                      </div>
                    )}

                    {/* Milestone Goals (階段性目標) - Structured Fields per User Input */}
                    {activeInfoSubTab === 'milestones' && (
                      <div className="space-y-6 animate-fade-in text-left">
                        {/* Warning Banner with Save Button */}
                        <div className="bg-[#ECFDF5] border border-emerald-100 p-3 px-4 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-black select-none gap-4">
                          <div className="flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>项目资助经费拨付将与阶段任务目标完成情况以及企业自身投入挂钩，请务必谨慎如实填写！</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert('阶段性任务及指标保存成功！')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1 rounded-lg text-[10px] font-black tracking-wider shadow transition-all cursor-pointer active:scale-95 outline-none focus:outline-none"
                          >
                            保存
                          </button>
                        </div>

                        {/* Title of Table */}
                        <div className="flex items-center justify-between border-b border-dashed border-slate-100 pb-2">
                          <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                            <span className="text-rose-500 font-extrabold">*</span>
                            阶段性目标（简述未来5年&lt;不含申报年份&gt;的技术服务、投入产出、预期社会效益等阶段性目标；每年1阶段，不少于5阶段）
                          </span>
                        </div>

                        {/* Table of phase stages */}
                        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
                          <table className="min-w-full divide-y divide-slate-100 text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-black">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left whitespace-nowrap w-24">阶段 (第N阶段)</th>
                                <th scope="col" className="px-4 py-3 text-left whitespace-nowrap w-32">开始时间</th>
                                <th scope="col" className="px-4 py-3 text-left whitespace-nowrap w-32">结束时间</th>
                                <th scope="col" className="px-4 py-3 text-left whitespace-nowrap w-32">预计投入 (万元)</th>
                                <th scope="col" className="px-5 py-3 text-left whitespace-nowrap">阶段性目标</th>
                                <th scope="col" className="px-4 py-3 text-center whitespace-nowrap w-28 min-w-[110px]">
                                  <div className="flex items-center justify-center gap-1.5 select-none">
                                    <span>操作</span>
                                    <button
                                      type="button"
                                      onClick={handleAddMilestoneRow}
                                      className="text-blue-600 hover:text-blue-800 font-extrabold cursor-pointer flex items-center gap-0.5 hover:underline whitespace-nowrap"
                                    >
                                      <span>+ 新增</span>
                                    </button>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {(formData.milestonesTable || []).map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/40">
                                  <td className="px-4 py-2.5">
                                    <input
                                      type="text"
                                      placeholder="如：第一阶段"
                                      value={row.phase}
                                      onChange={(e) => handleEditMilestoneRow(idx, 'phase', e.target.value)}
                                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none text-slate-850"
                                    />
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <input
                                      type="date"
                                      value={row.startTime}
                                      onChange={(e) => handleEditMilestoneRow(idx, 'startTime', e.target.value)}
                                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-2 py-1.5 text-xs font-bold outline-none text-slate-850 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <input
                                      type="date"
                                      value={row.endTime}
                                      onChange={(e) => handleEditMilestoneRow(idx, 'endTime', e.target.value)}
                                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-2 py-1.5 text-xs font-bold outline-none text-slate-850 cursor-pointer"
                                    />
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <input
                                      type="number"
                                      placeholder="万元"
                                      value={row.investment}
                                      onChange={(e) => handleEditMilestoneRow(idx, 'investment', e.target.value)}
                                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none text-slate-850"
                                    />
                                  </td>
                                  <td className="px-5 py-2.5">
                                    <input
                                      type="text"
                                      placeholder="请输入阶段任务和预期成果"
                                      value={row.target}
                                      onChange={(e) => handleEditMilestoneRow(idx, 'target', e.target.value)}
                                      className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none text-slate-850"
                                    />
                                  </td>
                                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveMilestoneRow(idx)}
                                      className="text-rose-500 hover:text-rose-700 font-extrabold hover:underline cursor-pointer transition-colors whitespace-nowrap inline-block"
                                    >
                                      删除
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {(formData.milestonesTable || []).length === 0 && (
                                <tr>
                                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium">
                                    暂无阶段明细数据，请点击右上角 <span className="text-blue-600 font-black hover:underline cursor-pointer" onClick={handleAddMilestoneRow}>+ 新增</span> 添加
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Title: Project Expected Investment */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-l-2 border-blue-600 pl-2">
                            项目预期投入情况
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-black text-slate-700 flex items-center gap-1 select-none">
                                <span className="text-rose-500 font-extrabold">*</span>
                                <span>项目总投入预测 (万元, 按项目执行5年估算, 不含申报年份)</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" title="对应企业自筹、引进资金及地方支持政策总合算额度。" />
                              </label>
                              <input
                                type="text"
                                placeholder="项目总投入预测 (万元)"
                                value={formData.totalInvestmentForecast || ''}
                                onChange={(e) => setFormData({ ...formData, totalInvestmentForecast: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-black text-slate-700 flex items-center gap-1 select-none">
                                <span className="text-rose-500 font-extrabold">*</span>
                                <span>未来5年用人单位计划投入资金 (单位: 万元)</span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" title="主要指用人单位在实验研发、厂房中试及高级雇员团队的计划投入预算资金。" />
                              </label>
                              <input
                                type="text"
                                placeholder="请输入以万元为单位的整数 (小数) 数字"
                                value={formData.employerPlannedInvestment || ''}
                                onChange={(e) => setFormData({ ...formData, employerPlannedInvestment: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Existing Foundation (现有创业基础) */}
                    {activeInfoSubTab === 'foundation' && (
                      <div className="space-y-6 animate-fade-in text-left">
                        <RichTextEditor
                          label="现有创业基础说明 (团队组建情况、合作基础及成员分工，项目研发/知识产权/市场开拓情况等)"
                          value={formData.projectFoundation}
                          onChange={(val) => setFormData({ ...formData, projectFoundation: val })}
                          placeholder="请输入现有创业基础说明（团队及知识产权/市场开拓等）。"
                        />

                        {/* Title: Patents */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-l-2 border-blue-600 pl-2">
                            国内外专利申请及授权情况
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-black text-slate-700 flex items-center gap-1 select-none">
                                <span className="text-rose-500 font-extrabold">*</span>
                                <span>国际专利：申请 数量 (单位: 项)</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={formData.internationalPatentApply ?? 0}
                                onChange={(e) => setFormData({ ...formData, internationalPatentApply: parseInt(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-black text-slate-700 flex items-center gap-1 select-none">
                                <span className="text-rose-500 font-extrabold">*</span>
                                <span>国际专利：授权 数量 (单位: 项)</span>
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={formData.internationalPatentAuthorize ?? 0}
                                onChange={(e) => setFormData({ ...formData, internationalPatentAuthorize: parseInt(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-700 flex items-center gap-1 select-none">
                              <span className="text-rose-500 font-extrabold">*</span>
                              <span>专利描述（请对照上面填报数量进行文字描述，200字内）</span>
                            </label>
                            <textarea
                              rows={3}
                              value={formData.patentDescription || ''}
                              onChange={(e) => setFormData({ ...formData, patentDescription: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm"
                              placeholder="专利物性及申报专利明细对应描述并支持国际检索"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expected Contribution and Acceptance Indicators (预期贡献及验收指标) */}
                    {activeInfoSubTab === 'contribution' && (
                      <div className="space-y-6 animate-fade-in text-left">
                        <RichTextEditor
                          label="预期能耗指标、知识产权及科技成果考核验收指标 (800字以内的文字表述已由智能助手自动补全，可按需精简)"
                          value={formData.projectMainMetrics}
                          onChange={(val) => setFormData({ ...formData, projectMainMetrics: val })}
                          placeholder="请输入预期能耗指标、知识产权及科技成果考核验收指标内容..."
                        />
                      </div>
                    )}

                    {/* Economic Benefits (預期經濟效益指標) */}
                    {activeInfoSubTab === 'economic' && (
                      <div className="space-y-6 animate-fade-in text-left">
                        {/* Section Header */}
                        <div className="text-slate-800 text-xs sm:text-sm font-bold select-none text-left mb-2">
                          项目实施期内预期经济效益指标 (未来5年，不含申报年份)
                        </div>

                        {/* Economic numbers in 2-column grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          {/* (1) 累计新增销售额 */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 flex items-center select-none gap-1">
                              <span className="text-rose-500 font-extrabold">*</span>
                              <span>(1) 累计新增销售额（万元）</span>
                            </label>
                            <input
                              type="text"
                              value={formData.projectEconomicAnnualRevenue || ''}
                              onChange={(e) => setFormData({ ...formData, projectEconomicAnnualRevenue: e.target.value })}
                              className="w-full bg-white border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-4 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm transition-all placeholder:text-slate-350"
                              placeholder="请输入以万元为单位的整数（小数）数字，没有的填&ldquo;0&rdquo;。"
                            />
                          </div>

                          {/* (2) 累计新增净利润 */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 flex items-center select-none gap-1">
                              <span className="text-rose-500 font-extrabold">*</span>
                              <span>(2) 累计新增净利润（万元）</span>
                            </label>
                            <input
                              type="text"
                              value={formData.projectEconomicAnnualProfitTax || ''}
                              onChange={(e) => setFormData({ ...formData, projectEconomicAnnualProfitTax: e.target.value })}
                              className="w-full bg-white border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-4 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm transition-all placeholder:text-slate-350"
                              placeholder="请输入以万元为单位的整数（小数）数字，没有的填&ldquo;0&rdquo;。"
                            />
                          </div>

                          {/* (3) 累计新增上缴税额 */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 flex items-center select-none gap-1">
                              <span className="text-rose-500 font-extrabold">*</span>
                              <span>(3) 累计新增上缴税额（万元）</span>
                            </label>
                            <input
                              type="text"
                              value={formData.projectEconomicJobsGenerated || ''}
                              onChange={(e) => setFormData({ ...formData, projectEconomicJobsGenerated: e.target.value })}
                              className="w-full bg-white border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-4 py-2.5 text-xs font-bold outline-none text-slate-800 shadow-sm transition-all placeholder:text-slate-350"
                              placeholder="请输入以万元为单位的整数（小数）数字，没有的填&ldquo;0&rdquo;。"
                            />
                          </div>
                        </div>

                        {/* 4. 预期经济效益指标说明 */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 flex items-center select-none gap-1">
                            <span className="text-rose-500 font-extrabold">*</span>
                            <span>预期经济效益指标说明 (800字以内)</span>
                          </label>
                          <textarea
                            rows={6}
                            value={formData.projectEconomicDetails || ''}
                            onChange={(e) => setFormData({ ...formData, projectEconomicDetails: e.target.value })}
                            className="w-full bg-white border border-slate-200 focus:bg-white focus:border-[#0A66FF] rounded-lg px-4 py-3 text-xs font-bold outline-none text-slate-800 shadow-sm h-48 resize-none transition-all placeholder:text-slate-350"
                            placeholder="预期经济效益指标说明，没有内容可填&ldquo;无&rdquo;。（800字以内）"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Local Action Sub-Tab Switcher matching perfect flow */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleNextSubTab}
                      className="px-8 py-2 bg-[#0A66FF] hover:bg-blue-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      下一步
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: AI Intelligent Recommendations */}
            {activeFormTab === 'ai_advice' && (
              <div className="space-y-6 animate-fade-in select-none">
                
                {/* 1. New Elegant Multi-Dimensional Match Quality Score Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                    <Activity className="w-5 h-5 text-[#0A66FF]" />
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">项目申报 · 多维配比体检报告</h4>
                    <span className="ml-auto text-[9px] bg-blue-50 text-[#0A66FF] border border-blue-100 px-2 py-0.5 rounded-full font-black">AI 实时智能测算</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Left side: Large dynamic score with Grade like Picture 1 layout */}
                    <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left justify-center md:pr-8 md:border-r border-slate-100 h-full">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-6xl font-black tracking-tight font-mono ${getDetailedScores().gradeColor}`}>
                          {getDetailedScores().total}
                        </span>
                        <span className="text-xs font-bold text-slate-400">分</span>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-black bg-slate-50 border border-slate-200 ${getDetailedScores().gradeColor}`}>
                          等级 {getDetailedScores().grade}
                        </span>
                      </div>
                      
                      <p className="text-[11px] leading-relaxed text-slate-500 font-semibold mt-3">
                        {getDetailedScores().desc}
                      </p>
                      
                      <button 
                        type="button"
                        onClick={handleTriggerReevaluating}
                        className="mt-4 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-[#0A66FF] font-black transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        {isReevaluating ? '正在扫描材料重新评估...' : '重新检测 / 刷新分数'}
                      </button>
                    </div>
                    
                    {/* Right side: 5 Detailed Dimension Progress Rows corresponding to Dimension Scores */}
                    <div className="md:col-span-8 space-y-3.5">
                      {/* Dimension 1 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-450">
                          <span className="text-slate-600 font-bold">1. 政策准入门槛</span>
                          <span className="font-mono text-slate-705">{getDetailedScores().nameScore} <span className="text-slate-300">/ 30</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getDetailedScores().nameScore === 30 ? 'bg-emerald-500' : 'bg-[#A02C45]'}`} 
                            style={{ width: `${(getDetailedScores().nameScore / 30) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Dimension 2 */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-450">
                          <span className="text-slate-600 font-bold">2. 团队主体与照片合规度</span>
                          <span className="font-mono text-slate-705">{getDetailedScores().teamScore} <span className="text-slate-300">/ 30</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getDetailedScores().teamScore === 30 ? 'bg-emerald-500' : 'bg-[#A02C45]'}`} 
                            style={{ width: `${(getDetailedScores().teamScore / 30) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Dimension 3 */}
                      <div className="space-y-1 text-slate-450 font-bold text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">3. 财务自筹经费比重</span>
                          <span className="font-mono text-slate-705">{getDetailedScores().financeScore} <span className="text-slate-300">/ 20</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getDetailedScores().financeScore === 20 ? 'bg-emerald-500' : 'bg-[#A02C45]'}`} 
                            style={{ width: `${(getDetailedScores().financeScore / 20) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Dimension 4 */}
                      <div className="space-y-1 text-slate-450 font-bold text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">4. 阶段考核节点可行性</span>
                          <span className="font-mono text-slate-705">{getDetailedScores().milestoneScore} <span className="text-slate-300">/ 10</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getDetailedScores().milestoneScore === 10 ? 'bg-emerald-500' : 'bg-[#A02C45]'}`} 
                            style={{ width: `${(getDetailedScores().milestoneScore / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Dimension 5 */}
                      <div className="space-y-1 text-slate-450 font-bold text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">5. 材料要素整体质量</span>
                          <span className="font-mono text-slate-705">{getDetailedScores().overallScore} <span className="text-slate-300">/ 10</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getDetailedScores().overallScore === 10 ? 'bg-emerald-500' : 'bg-[#A02C45]'}`} 
                            style={{ width: `${(getDetailedScores().overallScore / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Redesigned Premium Segment Tab Switcher */}
                <div className="flex justify-center p-1.5 bg-slate-50 border border-slate-150 rounded-2xl">
                  <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {[
                      { id: 'expert', name: '专家评审维度', icon: <Award className="w-3.5 h-3.5" /> },
                      { id: 'investor', name: '投资人视角', icon: <FileText className="w-3.5 h-3.5" /> },
                      { id: 'market', name: '商业化风险', icon: <Layers className="w-3.5 h-3.5" /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveAdviceDimension(tab.id as any)}
                        className={`px-6 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap ${
                          activeAdviceDimension === tab.id
                            ? 'bg-white text-[#0A66FF] shadow-sm border border-slate-200/60 font-black'
                            : 'text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-50/60'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Dimension Advice Cards Render */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  {isReevaluating ? (
                    <div className="py-16 flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0A66FF]" />
                      <p className="text-xs font-black text-slate-500">正在调用专家评审系统，重新计算多维度建议数据...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Tab Content A: Expert Review Dimension */}
                      {activeAdviceDimension === 'expert' && (
                        <div className="space-y-6 animate-fade-in">
                          
                          {/* Card 1: Project Name合规性 */}
                          <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-5">
                            {/* 1. Header Row */}
                            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                {(!formData.projectName || formData.projectName.trim() === '123' || formData.projectName.trim().length < 5 || formData.projectName.trim() === '新项目') ? (
                                  <span className="bg-rose-50 border border-rose-100 text-[#A02C45] px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    🚨 学术聚焦隐忧
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    ✨ 优秀名称设计
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">封面 · 申报项目名称合规度</h5>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
                                关联：封面.项目名称
                              </span>
                            </div>

                            {/* 2. Unified Grid Content */}
                            <div className="space-y-4">
                              {/* Block A: 用户原话 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">用户原话</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                                  <span className={(!formData.projectName || formData.projectName.trim() === '123' || formData.projectName.trim().length < 5 || formData.projectName.trim() === '新项目') ? "text-[#A02C45] font-extrabold text-xs" : "text-emerald-600 font-extrabold text-xs"}>
                                    「{formData.projectName || '（未命名）'}」
                                  </span>
                                </div>
                              </div>

                              {/* Block B: 行业标准规则 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">行业标准规则</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-semibold text-slate-655 leading-relaxed">
                                  甬江人才工程项目评审专家多来自行业领军实业和一流智库高管。项目名称命名建议紧扣“先进机制工艺，并兼顾中试产业化重置”等高端材料制备字眼。
                                </div>
                              </div>

                              {/* Block C: 修改建议 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">修改建议</span>
                                <div className="text-xs font-semibold text-slate-600 leading-relaxed mb-3">
                                  当前填写的项目名称技术范围不严谨、偏向通用，在人社以及科技联审初筛中，容易被低估并判定为低技术门槛或不具备产业重大自主突破可能，影响首轮选拔率。
                                </div>
                                
                                <div className="bg-emerald-50/25 border border-emerald-150 rounded-xl p-4 space-y-2 mt-2">
                                  <span className="text-[10px] font-black text-emerald-800 block uppercase tracking-wider">★ 修正及润色后推荐文本</span>
                                  <div className="bg-white border border-emerald-100 p-3 rounded-lg text-xs leading-relaxed font-black text-emerald-950 shadow-xs font-mono select-text">
                                    基于生命高特性的靶向高纯度医药原材料合成工艺及产业化中试研究
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: 骨干成员照片资质 */}
                          <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-5">
                            {/* 1. Header Row */}
                            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                {(!formData.members[0]?.idPhoto || !formData.members[0]?.oneInchPhoto) ? (
                                  <span className="bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    ⚠️ 优化建议 / 资质核查
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    ✨ 带头人资质就位
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">成员 · 第一带头人身份资质及真实备档</h5>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
                                关联：项目成员.骨干带头人
                              </span>
                            </div>

                            {/* 2. Unified Grid Content */}
                            <div className="space-y-4">
                              {/* Block A: 用户原话 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">用户原话</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                                  <div className="text-slate-800 font-extrabold text-xs">
                                    李瑞华（研发总负责人，24岁）
                                  </div>
                                  {(!formData.members[0]?.idPhoto || !formData.members[0]?.oneInchPhoto) && (
                                    <div className="text-[#A02C45] font-extrabold text-[10px] mt-1.5 flex items-center gap-1 bg-red-50/50 p-2 rounded-lg border border-red-100/45">
                                      <span>未上传正反身份证扫描件、免冠证件照</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Block B: 行业标准规则 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">行业标准规则</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-semibold text-slate-655 leading-relaxed">
                                  制造业领军人才项目需严格遵循实名穿透初审。主申请人信息在系统内应上传标准彩印的高像素身份证照与一寸免冠近照。
                                </div>
                              </div>

                              {/* Block C: 修改建议 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">修改建议</span>
                                <div className="text-xs font-semibold text-slate-600 leading-relaxed mb-3">
                                  带头人年龄较年轻（24岁），材料如果不配齐彩色硬本或一寸免冠近照（白底/红底/蓝底），极易因缺少原件判定为学术虚构或草拟材料，形式合规通过率低。
                                </div>
                                
                                <div className="bg-emerald-50/25 border border-emerald-150 rounded-xl p-4 space-y-2 mt-2">
                                  <span className="text-[10px] font-black text-[#0A66FF] block uppercase tracking-wider">★ 修正建议与推荐实操</span>
                                  <div className="bg-white border border-blue-100 p-3 rounded-lg text-xs leading-relaxed font-semibold text-slate-750 shadow-xs">
                                    请在“项目成员”子模块内点击第一创始人李瑞华进行信息编辑，上传彩色清晰的正反面身份证件和一寸电子证件照，以供政务部门极速通关。
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Tab Content B: Investor Perspective Dimension */}
                      {activeAdviceDimension === 'investor' && (
                        <div className="space-y-6 animate-fade-in">
                          
                          {/* Card 1: 创业团队联合梯队 */}
                          <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-5">
                            {/* 1. Header Row */}
                            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                {(!formData.members.some((m: any) => m.name === '陈建国')) ? (
                                  <span className="bg-rose-50 border border-rose-100 text-[#A02C45] px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    🚨 核心分工缺乏闭环
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    ✨ 黄金搭档三角齐全
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">团队 · 商业合伙人及大客户市场VP缺失</h5>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
                                关联：项目成员.联合创始人
                              </span>
                            </div>

                            {/* 2. Unified Grid Content */}
                            <div className="space-y-4">
                              {/* Block A: 用户原话 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">用户原话</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                                  <div className="flex flex-wrap gap-1.5">
                                    {formData.members?.length > 0 ? (
                                      formData.members.map((m: any, idx: number) => (
                                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-black text-slate-700 shadow-xs">
                                          [{m.memberType}] {m.name}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[#A02C45] font-extrabold text-xs">（尚未配置核心团队合伙人体系）</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Block B: 行业标准规则 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">行业标准规则</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-semibold text-slate-655 leading-relaxed">
                                  高精材料和高新技术制造业的高增长属性高度依仗渠道。标准优质团队形态推荐包含【1名硬核首席技术/学术科学家 + 1名工艺厂长/技术落地VP + 1名极强江浙沪大客户销售背景的副总裁/销售合伙人】。
                                </div>
                              </div>

                              {/* Block C: 修改建议 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">修改建议</span>
                                <div className="text-xs font-semibold text-slate-600 leading-relaxed mb-3">
                                  当前团队结构单一，无专业商务与渠道转化负责人。资本和宁波市级扶持考核高度介意“技术自嗨、量产卡死、销售抓瞎”的项目，配备具有资深行业背景与实战拿单合伙人可极大消除创投答辩疑虑。
                                </div>
                                
                                <div className="bg-emerald-50/25 border border-emerald-150 rounded-xl p-4 space-y-2 mt-2">
                                  <span className="text-[10px] font-black text-emerald-805 block uppercase tracking-wider">★ 修正建议与推荐配置商合伙人</span>
                                  <div className="bg-white border border-emerald-100 p-3 rounded-lg text-xs leading-relaxed font-semibold text-slate-750 shadow-xs">
                                    建议在原有成员计划中，正式物色并加入 1名占股 10% 左右、具备 15 年以上新材料/生物原药长三角市场及本地头部药企连锁通路经验的销售副总裁/商业合伙人（例如配置以「陈建国（副总裁）」为标签的市场负责人），以此向创投评委充分证明本地研发产品可以光速敲定长三角药企第一期订单。
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Tab Content C: Commercialization Risks Dimension */}
                      {activeAdviceDimension === 'market' && (
                        <div className="space-y-6 animate-fade-in">
                          
                          {/* Card 1: 预算偏小与财务合理性 */}
                          <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-5">
                            {/* 1. Header Row */}
                            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                {(!formData.totalInvestmentForecast || parseInt(formData.totalInvestmentForecast) < 300) ? (
                                  <span className="bg-rose-50 border border-rose-100 text-[#A02C45] px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    🚨 自筹投资额偏低
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    ✨ 财务自筹配比科学
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">经费 · 自筹投入规模与行业匹配度</h5>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
                                关联：项目信息.投资自筹
                              </span>
                            </div>

                            {/* 2. Unified Grid Content */}
                            <div className="space-y-4">
                              {/* Block A: 用户原话 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">用户原话</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                                  <span className="text-slate-800 font-extrabold text-xs">
                                    {formData.totalInvestmentForecast ? `${formData.totalInvestmentForecast} 万元` : '未填写（或不足300万）'}
                                  </span>
                                </div>
                              </div>

                              {/* Block B: 行业标准规则 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">行业标准规则</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-semibold text-slate-655 leading-relaxed">
                                  针对制造业及医药健康原药项目，前期反应合成设备、GMP洁净用房升级与原料损耗资金沉淀极高。首轮总估价原则上应处于 300 万 - 800 万元之间，折中申报多以 500-650 万自筹为黄金预算比例。
                                </div>
                              </div>

                              {/* Block C: 修改建议 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">修改建议</span>
                                <div className="text-xs font-semibold text-slate-600 leading-relaxed mb-3">
                                  如果自筹投入和设备经费估算预算过少，核减评委会对项目是否属于小作坊甚至非制造业代理产生疑问，且极可能因底座资金量少被列入不可行方案而扣分退回。
                                </div>
                                
                                <div className="bg-emerald-50/25 border border-emerald-150 rounded-xl p-4 space-y-2 mt-2">
                                  <span className="text-[10px] font-black text-emerald-800 block uppercase tracking-wider">★ 推荐自筹投资修正方案</span>
                                  <div className="bg-white border border-emerald-100 p-3 rounded-lg text-xs leading-relaxed font-semibold text-slate-750 shadow-xs">
                                    建议将主自筹基金池合并企业改造折算调整至 <span className="text-[#0A66FF] font-black">500 - 650万元</span>，并在“项目信息.资金筹措与预算”科目里按 35% 设备改造折旧、25% 流动原药材料费、20% 首批研发人员费以及 10% 检测外协费科学分配账目。
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: 里程碑定量规划 */}
                          <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-5">
                            {/* 1. Header Row */}
                            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                {(!formData.milestonesTable || formData.milestonesTable.length < 2) ? (
                                  <span className="bg-rose-50 border border-rose-100 text-[#A02C45] px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    🚨 里程碑量化考核缺项
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    ✨ 阶段量化完美匹配
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">里程碑 · 考核要素可度量性</h5>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
                                关联：项目信息.阶段里程碑 (共 {formData.milestonesTable?.length || 0} 个)
                              </span>
                            </div>

                            {/* 2. Unified Grid Content */}
                            <div className="space-y-4">
                              {/* Block A: 用户原话 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">用户原话</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                                  {(() => {
                                    const validMilestones = (formData.milestonesTable || []).filter((m: any) => m && (m.time?.trim() || m.content?.trim()));
                                    return validMilestones.length > 0 ? (
                                      <div className="space-y-1.5">
                                        {validMilestones.map((m: any, idx: number) => (
                                          <div key={idx} className="text-xs text-slate-800 font-bold flex items-start gap-1">
                                            <span className="text-[#0A66FF] font-black select-none">[{m.time || '未定时间'}]</span> 
                                            <span>{m.content || '未定内容'}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-[#A02C45] font-extrabold text-xs">（尚未完善具体的里程碑，多栏考核处于定性空泛状态）</span>
                                    );
                                  })()}
                                </div>
                              </div>

                              {/* Block B: 行业标准规则 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">行业标准规则</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-semibold text-slate-655 leading-relaxed">
                                  所有阶段考核节点验收终点必须锚定“已受理发明专利XX项”、“建车间、购备反应罐并达产XX吨”或“利税收入突破XX万”等定量审计指标。
                                </div>
                              </div>

                              {/* Block C: 修改建议 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">修改建议</span>
                                <div className="text-xs font-semibold text-slate-600 leading-relaxed mb-3">
                                  若里程碑陈述带有大量“努力推进研发”、“建立核心网络”、“完成大客户合作意向”等模糊定性，在人社审计和政府财务合规初审中往往因指标不可测而被刷下。
                                </div>
                                
                                <div className="bg-emerald-50/25 border border-emerald-150 rounded-xl p-4 space-y-2 mt-2">
                                  <span className="text-[10px] font-black text-emerald-805 block uppercase tracking-wider">★ 推荐考核点量化方案 (以符合审核认定)</span>
                                  <div className="bg-white border border-emerald-100 p-3 rounded-lg text-xs leading-relaxed font-semibold text-slate-755 shadow-xs font-mono">
                                    <div className="space-y-1.5 text-slate-700 font-semibold">
                                      <div><strong className="text-slate-900 font-black">【一期目标（1年内）】：</strong> 完成宁波主体所属3项核心合成工艺发明专利声明，搭建首套流力仿真数据模型。</div>
                                      <div className="pt-1 border-t border-emerald-100/50"><strong className="text-slate-900 font-black">【二期目标（2年内）】：</strong> 添置并落位1套PLC高规格合成微釜中试线，全套系统通过本地化生防与环评安全核定。</div>
                                      <div className="pt-1 border-t border-emerald-100/50"><strong className="text-slate-900 font-black">【三期目标（3年内）】：</strong> 开发宁波本地医药大客户2家，季度主营突破1200万元，实现本市主营利税150万元以上。</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Tab Content B: Investor Perspective Dimension */}
                      {activeAdviceDimension === 'investor' && (
                        <div className="space-y-6 animate-fade-in">
                          
                          {/* Card 1: 团队架构合伙人配置 */}
                          <div className="border border-slate-150 rounded-2xl p-6 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-5">
                            {/* 1. Header Row */}
                            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                {(!formData.members || formData.members.length < 3) ? (
                                  <span className="bg-rose-50 border border-rose-100 text-[#A02C45] px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    🚨 业务线合伙人单一
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-black inline-flex items-center">
                                    ✨ 团队班子高度互补
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">团队 · 股权结构与复合商业合伙人配置</h5>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200/60">
                                关联：项目成员.骨干合伙人
                              </span>
                            </div>

                            {/* 2. Unified Grid Content */}
                            <div className="space-y-4">
                              {/* Block A: 用户原话 / 当前现状 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">当前现状</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-bold text-slate-700">
                                  <span className="text-slate-500 block text-[10px] uppercase font-black mb-1">当前治理架构名单</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {formData.members?.length > 0 ? (
                                      formData.members.map((m: any, idx: number) => (
                                        <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-805">
                                          [{m.memberType || '成员'}] {m.name || '未命名'}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[#A02C45] font-extrabold text-xs">（尚未配置核心团队合伙人体系）</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Block B: 行业标准规则 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">行业标准规则</span>
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs font-semibold text-slate-655 leading-relaxed">
                                  高精材料和高新技术制造业的高增长属性高度依仗渠道。标准优质团队形态推荐包含【1名硬核首席技术/学术科学家 + 1名工艺厂长/技术落地VP + 1名极强江浙沪大客户销售背景的副总裁/销售合伙人】。
                                </div>
                              </div>

                              {/* Block C: 修改建议 */}
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-1.5 tracking-wider">修改建议</span>
                                <div className="text-xs font-semibold text-slate-600 leading-relaxed mb-3">
                                  当前团队结构单一，无专业商务与渠道转化负责人。资本和投资机构在考察扶持项目时，非常关注是否属于“技术自嗨、量产卡死、销售抓瞎”的项目。配备具有资深行业背景与实战拿单合伙人可极大消除创投答辩疑虑。
                                </div>
                                
                                <div className="bg-emerald-50/25 border border-emerald-150 rounded-xl p-4 space-y-2 mt-2">
                                  <span className="text-[10px] font-black text-[#0A66FF] block uppercase tracking-wider">★ 修正建议与推荐配置商合伙人</span>
                                  <div className="bg-white border border-blue-100 p-3 rounded-lg text-xs leading-relaxed font-semibold text-slate-755 shadow-xs">
                                    建议在原有成员计划中，正式物色并加入 1名占股 10% 左右、具备 15 年以上新材料/生物原药长三角市场及本地头部药企连锁通路经验的销售副总裁/商业合伙人（例如配置以「陈建国（副总裁）」为标签的市场负责人），以此向创投评委充分证明本地研发产品可以光速敲定长三角药企第一期订单。
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Tab Content C: Commercialization Risks Dimension */}
                      {activeAdviceDimension === 'market' && (
                        <div className="space-y-6 animate-fade-in">
                          
                          {/* Card 1: 预算偏小与财务合理性 */}
                          <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-4">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-2">
                                {(!formData.totalInvestmentForecast || parseInt(formData.totalInvestmentForecast) < 300) ? (
                                  <span className="bg-rose-50 border border-rose-100 text-[#A02C45] px-2.5 py-0.5 rounded text-[9px] font-black animate-pulse">
                                    🚨 自筹投资额偏低
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded text-[9px] font-black">
                                    ✨ 财务自筹配比科学
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">经费 · 自筹投入规模与行业匹配度</h5>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">关联：项目信息.投资自筹</span>
                            </div>

                            <div className="text-xs text-slate-650 leading-relaxed font-bold bg-slate-50/50 p-4 rounded-lg border border-slate-100 flex flex-col gap-3">
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">目前填写的预算总投资</span>
                                <span className="text-slate-800 font-extrabold text-xs">
                                  {formData.totalInvestmentForecast ? `${formData.totalInvestmentForecast} 万元` : '未填写（或不足300万）'}
                                </span>
                              </div>
                              <div className="pt-2 border-t border-slate-150">
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">行业标准对标规则</span>
                                <p className="text-xs font-semibold text-slate-655 leading-normal">
                                  针对制造业及医药健康原药项目，前期反应合成设备、GMP洁净用房升级与原料损耗资金沉淀极高。首轮总估价原则上应处于 300 万 - 800 万元之间，折中申报多以 500-650 万自筹为黄金预算比例。
                                </p>
                              </div>
                              <div className="pt-2 border-t border-slate-150 font-bold">
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">修改建议及原因 (Why)</span>
                                <p className="text-xs font-semibold text-slate-550 leading-normal">
                                  如果自筹投入和设备经费估算预算过少，核减评委会对项目是否属于小作坊甚至非制造业代理产生疑问，且极可能因底座资金量少被列入不可行方案而扣分退回。
                                </p>
                              </div>
                            </div>

                            <div className="bg-emerald-50/20 border border-emerald-100 rounded-lg p-4 space-y-1.5">
                              <span className="text-[10px] font-black text-emerald-800 block uppercase">★ 推荐自筹投资修正方案</span>
                              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                                建议将主自筹基金池合并企业改造折算调整至 <span className="text-[#0A66FF] font-black">500 - 650万元</span>，并在“项目信息.资金筹措与预算”科目里按 35% 设备改造折旧、25% 流动原药材料费、20% 首批研发人员费以及 10% 检测外协费科学分配账目。
                              </p>
                            </div>
                          </div>

                          {/* Card 2: 里程碑定量规划 */}
                          <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-xs hover:border-slate-200 hover:shadow-xs transition-all space-y-4">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-2">
                                {(!formData.milestonesTable || formData.milestonesTable.length < 2) ? (
                                  <span className="bg-rose-50 border border-rose-100 text-[#A02C45] px-2.5 py-0.5 rounded text-[9px] font-black animate-pulse">
                                    🚨 里程碑量化考核缺项
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded text-[9px] font-black">
                                    ✨ 阶段量化完美匹配
                                  </span>
                                )}
                                <h5 className="text-xs font-black text-slate-800">里程碑 · 考核要素可度量性</h5>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">关联：项目信息.阶段里程碑 (共 {formData.milestonesTable?.length || 0} 个)</span>
                            </div>

                            <div className="text-xs text-slate-650 leading-relaxed font-bold bg-slate-50/50 p-4 rounded-lg border border-slate-100 flex flex-col gap-3">
                              <div>
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">当前里程碑节点说明</span>
                                <div className="space-y-1 mt-1">
                                  {formData.milestonesTable && formData.milestonesTable.length > 0 ? (
                                    formData.milestonesTable.map((m: any, idx: number) => (
                                      <div key={idx} className="text-[11px] text-slate-800 font-bold">
                                        <span className="text-[#0A66FF] font-black">[{m.time}]</span> {m.content}
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-[#A02C45] font-extrabold text-xs">（尚未完善具体的里程碑，多栏考核处于定性空泛状态）</span>
                                  )}
                                </div>
                              </div>
                              <div className="pt-2 border-t border-slate-150">
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">行业标准对标规则</span>
                                <p className="text-xs font-semibold text-slate-655 leading-normal">
                                  所有阶段考核节点验收终点必须锚定“已受理发明专利XX项”、“建车间、购备反应罐并达产XX吨”或“利税收入突破XX万”等定量审计指标。
                                </p>
                              </div>
                              <div className="pt-2 border-t border-slate-150">
                                <span className="text-slate-400 block text-[10px] font-black uppercase mb-0.5">为什么修改 (Why)</span>
                                <p className="text-xs font-semibold text-slate-550 leading-normal">
                                  若里程碑陈述带有大量“努力推进研发”、“建立核心网络”、“完成大客户合作意向”等模糊定性，人设审计和政府财务合规初审中往往因指标不可测而被刷下。
                                </p>
                              </div>
                            </div>

                            <div className="bg-emerald-50/20 border border-emerald-100 rounded-lg p-4 space-y-1.5">
                              <span className="text-[10px] font-black text-emerald-805 block uppercase">★ 推荐考核点量化方案 (以符合审核认定)</span>
                              <div className="text-xs space-y-1 font-semibold text-slate-705 leading-relaxed font-mono">
                                <div><strong className="text-slate-800">一期目标（1年内）：</strong> 完成宁波主体所属3项核心合成工艺发明专利声明，搭建首套流力仿真数据模型。</div>
                                <div><strong className="text-slate-800">二期目标（2年内）：</strong> 添置并落位1套PLC高规格合成微釜中试线，全套系统通过本地化生防与环评安全核定。</div>
                                <div><strong className="text-slate-800">三期目标（3年内）：</strong> 开发宁波本地医药大客户2家，季度主营突破1200万元，实现本市主营利税150万元以上。</div>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>
            )}
            {/* Footer Form Action Panel (Bottom Right matches design perfectamente) */}
            <div className="pt-6 border-t border-slate-100/60 flex justify-end items-center gap-3">
              <div className="mr-auto hidden sm:flex items-center gap-2 select-none">
                {isAutoSaving ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A66FF] animate-ping" />
                    <span className="text-[10px] font-black text-[#0A66FF]">系统正在自动保存草稿...</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-400 font-extrabold">
                      系统已开启自动保存 ({autoSaveSeconds}秒后刷新，上次: {lastAutoSaveTime})
                    </span>
                  </>
                )}
              </div>
              <button 
                onClick={onBack}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 outline-none focus:outline-none"
              >
                取消
              </button>
              <button 
                onClick={handleSaveSubmit}
                className="px-8 py-2.5 bg-[#0066FF] hover:bg-[#0055e0] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};

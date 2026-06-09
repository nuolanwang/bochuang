import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Layers, 
  Award, 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  AlertCircle, 
  ShieldAlert, 
  UserCheck,
  FileCheck, 
  Fingerprint, 
  DollarSign, 
  Compass,
  Users,
  ChevronDown,
  ChevronUp,
  Edit3,
  PenTool,
  Upload,
  X as CloseIcon,
  CreditCard,
  Sliders,
  History,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export interface BillingAccount {
  id: string;
  invoicingHeader: string;
  creditCode: string;
  bankName: string;
  accountNumber: string;
  email: string;
  accountType: string;
  isMain: boolean;
}

interface EnterpriseInfo {
  companyName: string;
  creditCode: string;
  legalPerson: string;
  registeredCapital: string;
  industry: string;
  scale: string;
  address: string;
  foundedDate: string;
  description: string;
  structure: '境内' | 'VIE';
  changeDate: string;
  netAssets: string;
}

interface EnterpriseManagementProps {
  allEnterprises: any[];
  setAllEnterprises: React.Dispatch<React.SetStateAction<any[]>>;
  selectedId: string;
  setSelectedId: (id: string) => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  onAddEnterprise?: () => void;
}

export const EnterpriseManagement: React.FC<EnterpriseManagementProps> = ({
  allEnterprises,
  setAllEnterprises,
  selectedId,
  setSelectedId,
  activeSubTab,
  setActiveSubTab,
  onAddEnterprise
}) => {
  // Toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Tab-state mirroring the sub-menus of the screenshot
  const [selectedMenuTab, setSelectedMenuTab] = useState<'info' | 'capital' | 'bank' | 'settings' | 'products' | 'meetings'>('info');

  // Product management states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    version: 'v1.0.0',
    techStack: '',
    userCount: '',
    status: 'active'
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Meeting management states
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [meetingFormData, setMeetingFormData] = useState({
    title: '',
    time: '',
    attendees: '',
    conclusions: ''
  });
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);

  // Billing account state list (pre-filled with default matching the default enterprises nicely)
  const [billingAccounts, setBillingAccounts] = useState<BillingAccount[]>([
    {
      id: 'settle-1',
      invoicingHeader: '发发大王的AI公司',
      creditCode: '91110108MA01X9YY8R',
      bankName: '中国工商银行北京分行中关村支行',
      accountNumber: '0200 0012 0920 1123 456',
      email: 'finance@fafajidi.ai',
      accountType: '基本存款账户',
      isMain: true
    },
    {
      id: 'settle-2',
      invoicingHeader: '北京博创数字科技有限公司',
      creditCode: '91110108MA01X9YY7A',
      bankName: '中国建设银行北京中关村分理处',
      accountNumber: '6217 0019 1002 8831 234',
      email: 'account@bochuang.com',
      accountType: '一般存款账户',
      isMain: false
    }
  ]);

  // Billing account modal form state
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [billingModalMode, setBillingModalMode] = useState<'add' | 'edit'>('add');
  const [editingBillingId, setEditingBillingId] = useState<string | null>(null);
  const [billingFormData, setBillingFormData] = useState({
    invoicingHeader: '',
    creditCode: '',
    bankName: '',
    accountNumber: '',
    email: '',
    accountType: '基本存款账户',
    isMain: false
  });

  const openAddBillingModal = () => {
    setBillingModalMode('add');
    setEditingBillingId(null);
    setBillingFormData({
      invoicingHeader: formData.companyName || currentEnterprise.name || '发发大王的AI公司',
      creditCode: formData.creditCode || '91110108MA01X9YY8R',
      bankName: '',
      accountNumber: '',
      email: '',
      accountType: '基本存款账户',
      isMain: false
    });
    setIsBillingModalOpen(true);
  };

  const openEditBillingModal = (account: BillingAccount) => {
    setBillingModalMode('edit');
    setEditingBillingId(account.id);
    setBillingFormData({
      invoicingHeader: account.invoicingHeader,
      creditCode: account.creditCode,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      email: account.email,
      accountType: account.accountType || '基本存款账户',
      isMain: account.isMain || false
    });
    setIsBillingModalOpen(true);
  };

  const handleSaveBilling = () => {
    if (!billingFormData.bankName.trim()) {
      triggerToast('请输入开户银行全称');
      return;
    }
    if (!billingFormData.accountNumber.trim()) {
      triggerToast('请输入对公结算人民币账号');
      return;
    }

    // Ensure only one account is designated as the Main account if billingFormData.isMain is true
    let updatedAccounts = [...billingAccounts];
    if (billingFormData.isMain) {
      updatedAccounts = updatedAccounts.map(item => ({ ...item, isMain: false }));
    }

    if (billingModalMode === 'add') {
      const newAcc: BillingAccount = {
        id: `settle-${Date.now()}`,
        invoicingHeader: billingFormData.invoicingHeader || '发发大王的AI公司',
        creditCode: billingFormData.creditCode || '91110108MA01X9YY8R',
        bankName: billingFormData.bankName,
        accountNumber: billingFormData.accountNumber,
        email: billingFormData.email,
        accountType: billingFormData.accountType,
        isMain: billingFormData.isMain
      };
      setBillingAccounts([newAcc, ...updatedAccounts]);
      triggerToast('已成功添加新的收款与结算账户！');
    } else {
      setBillingAccounts(updatedAccounts.map(item => {
        if (item.id === editingBillingId) {
          return {
            ...item,
            invoicingHeader: billingFormData.invoicingHeader,
            creditCode: billingFormData.creditCode,
            bankName: billingFormData.bankName,
            accountNumber: billingFormData.accountNumber,
            email: billingFormData.email,
            accountType: billingFormData.accountType,
            isMain: billingFormData.isMain
          };
        }
        return item;
      }));
      triggerToast('收款与结算账户信息已更新！');
    }
    setIsBillingModalOpen(false);
  };

  const handleDeleteBilling = (id: string) => {
    setBillingAccounts(prev => prev.filter(item => item.id !== id));
    triggerToast('已成功移除该结算收款渠道');
  };

  // Interactive popup modals
  const [isCompanySelectorOpen, setIsCompanySelectorOpen] = useState(false);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStructure, setNewStructure] = useState<'境内' | 'VIE'>('境内');
  const [newType, setNewType] = useState('');
  const [newRegDate, setNewRegDate] = useState('2026-06-01');
  const [newRegCapital, setNewRegCapital] = useState('0');
  const [newTotalShares, setNewTotalShares] = useState('0');
  const [newSplitRatio, setNewSplitRatio] = useState('0');
  const [newCreditCode, setNewCreditCode] = useState('');

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureType, setSignatureType] = useState<'draw' | 'font'>('draw');
  const [fontSignatureName, setFontSignatureName] = useState('张嘉诚');
  const [activeSignatureFont, setActiveSignatureFont] = useState<'cursive' | 'brush'>('cursive');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStampDemoOpen, setIsStampDemoOpen] = useState(false);
  
  // Drawing canvas states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);

  // Active enterprise selection
  const currentEnterprise = allEnterprises.find(e => e.id === selectedId) || allEnterprises[0] || {};
  
  // Local editable synchronized state
  const [formData, setFormData] = useState<EnterpriseInfo>({
    companyName: '',
    creditCode: '91110108MA01X9YY8R',
    legalPerson: '张嘉诚',
    registeredCapital: '1500万人民币',
    industry: '人工智能 / 人工智能基础支持',
    scale: '1~50',
    address: '北京市海淀区中关村前沿技术创新中心4层',
    foundedDate: '2020-03-12',
    description: '科技创新型企业。',
    structure: '境内',
    changeDate: '',
    netAssets: '0'
  });

  // Sync state whenever selected enterprise changes
  useEffect(() => {
    if (currentEnterprise) {
      setFormData({
        companyName: currentEnterprise.name || '',
        creditCode: currentEnterprise.info?.creditCode || '',
        legalPerson: currentEnterprise.info?.legalPerson || '张嘉诚',
        registeredCapital: currentEnterprise.info?.registeredCapital || '1500万人民币',
        industry: currentEnterprise.info?.industry || '人工智能 / 人工智能基础支持',
        scale: currentEnterprise.info?.scale || '1~50',
        address: currentEnterprise.info?.address || '北京市海淀区中关村前沿技术创新中心4层',
        foundedDate: currentEnterprise.info?.foundedDate || '2020-03-12',
        description: currentEnterprise.info?.description || '',
        structure: currentEnterprise.info?.structure || '境内',
        changeDate: currentEnterprise.info?.changeDate || '',
        netAssets: currentEnterprise.info?.netAssets || '0'
      });
      setFontSignatureName(currentEnterprise.info?.legalPerson || '张嘉诚');
      if (currentEnterprise.info?.signatureImage) {
        setSavedSignature(currentEnterprise.info.signatureImage);
      } else {
        setSavedSignature(null);
      }
    }
  }, [selectedId, allEnterprises]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Save edits back to App context
  const handleSaveSettings = () => {
    setAllEnterprises(prev => prev.map(ent => {
      if (ent.id === selectedId) {
        return {
          ...ent,
          name: formData.companyName,
          info: {
            ...ent.info,
            companyName: formData.companyName,
            creditCode: formData.creditCode,
            legalPerson: formData.legalPerson,
            registeredCapital: formData.registeredCapital,
            industry: formData.industry,
            scale: formData.scale,
            address: formData.address,
            foundedDate: formData.foundedDate,
            description: formData.description,
            structure: formData.structure,
            changeDate: formData.changeDate,
            netAssets: formData.netAssets,
            signatureImage: savedSignature
          }
        };
      }
      return ent;
    }));
    triggerToast('设置保存成功，数据已完成本地持久化同步！');
  };

  const handleAddNewCompanySubmit = () => {
    if (!newName.trim()) {
      triggerToast('请填写企业全称');
      return;
    }
    if (!newType) {
      triggerToast('请选择企业类型');
      return;
    }

    const newCompanyId = `ent-${Date.now()}`;
    const newCompany = {
      id: newCompanyId,
      name: newName.trim(),
      status: 'registered',
      info: {
        companyName: newName.trim(),
        creditCode: newCreditCode.trim(),
        legalPerson: '张嘉诚',
        registeredCapital: `${newRegCapital || '0'}万人民币`,
        industry: `人工智能 / ${newType}`,
        scale: '1~55',
        address: '北京市海淀区中关村前沿技术创新中心4层',
        foundedDate: newRegDate || '2026-06-01',
        description: '自主创立登记企业，系统自动建档。',
        structure: newStructure,
        netAssets: '0',
        changeDate: '',
        totalShares: newTotalShares || '0',
        splitRatio: newSplitRatio || '0'
      },
      products: [
        {
          id: `prod-${Date.now()}-1`,
          name: `${newName.trim()} 核心数智交付系统`,
          version: 'v1.0.0',
          techStack: 'React / FastAPI / Python / Tailwind',
          userCount: '2项种子项目正在运行试点',
          status: 'active'
        }
      ],
      qualifications: [
        {
          id: `qual-${Date.now()}-1`,
          name: '国家级中小型科技企业评定认定 (拟申报)',
          issuer: '当地科技创新委员会',
          expiryDate: '2027-12-31',
          status: 'active',
          remarks: '由于本主体新激活开通，处于首期科技资格诊断审核之中。'
        }
      ],
      meetings: [
        {
          id: `meet-${Date.now()}-1`,
          title: `${newName.trim()} 首次数字合规诊断会议`,
          time: '2026-06-01 10:00 - 11:30',
          body: '',
          attendees: '张嘉诚、合规财务、技术总监',
          conclusions: '1. 工商基础要件已经通过一键认证。2. 下阶段将着手启动防范重复资质证书申报，降低冗余开支。'
        }
      ]
    };

    setAllEnterprises(prev => [newCompany, ...prev]);
    setSelectedId(newCompanyId);
    triggerToast('企业创建成功，已自动切换！');
    setIsCreateCompanyOpen(false);

    // Reset Form
    setNewName('');
    setNewStructure('境内');
    setNewType('');
    setNewRegDate('2026-06-01');
    setNewRegCapital('0');
    setNewTotalShares('0');
    setNewSplitRatio('0');
    setNewCreditCode('');
  };

  // Product management helpers
  const handleOpenAddProduct = () => {
    setProductFormData({
      name: '',
      version: 'v1.0.0',
      techStack: '',
      userCount: '',
      status: 'active'
    });
    setEditingProductId(null);
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setProductFormData({
      name: prod.name || '',
      version: prod.version || 'v1.0.0',
      techStack: prod.techStack || '',
      userCount: prod.userCount || '',
      status: prod.status || 'active'
    });
    setEditingProductId(prod.id);
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = () => {
    if (!productFormData.name.trim()) {
      triggerToast('请输入产品/系统名称');
      return;
    }
    setAllEnterprises(prev => prev.map(ent => {
      if (ent.id === selectedId) {
        const existingProducts = ent.products || [];
        if (editingProductId) {
          return {
            ...ent,
            products: existingProducts.map((p: any) => p.id === editingProductId ? { ...p, ...productFormData } : p)
          };
        } else {
          return {
            ...ent,
            products: [
              ...existingProducts,
              {
                id: `prod-${Date.now()}`,
                ...productFormData
              }
            ]
          };
        }
      }
      return ent;
    }));
    triggerToast(editingProductId ? '产品信息更新成功' : '新增产品成功');
    setIsAddProductOpen(false);
  };

  const handleDeleteProduct = (prodId: string) => {
    setAllEnterprises(prev => prev.map(ent => {
      if (ent.id === selectedId) {
        const existingProducts = ent.products || [];
        return {
          ...ent,
          products: existingProducts.filter((p: any) => p.id !== prodId)
        };
      }
      return ent;
    }));
    triggerToast('产品已成功移除');
  };

  // Meeting file auto extraction helper
  const handleFileAndAutoExtract = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsRecognizing(true);

    setTimeout(() => {
      setIsRecognizing(false);
      
      const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      
      // Smart matching based on keywords in the file name
      let parsedTitle = `关于《${fileNameWithoutExt}》的研究部署会`;
      let parsedTime = `${new Date().toISOString().split('T')[0]} 10:00 - 11:30 (主会议室)`;
      let parsedAttendees = '张嘉诚(法定代表人)、技术主管、核心开发骨干团队、财务负责人';
      let parsedConclusions = `1. 会议审议通过了关于【${fileNameWithoutExt}】的实质性立项报告与进度目标规划。\n2. 财务确认首期自筹研发资金到位，批准购置配套的调试及软硬件环境设备。\n3. 各技术大组联名签署本期核心成果技术保密协议，保障项目能安全稳健推进。`;

      if (file.name.toLowerCase().includes('ailane') || file.name.toLowerCase().includes('algorithm') || file.name.includes('算法')) {
        parsedTitle = '关于 AI 边缘解算平台与多源数据空间融合自研算法技术评审会';
        parsedAttendees = '吴光速 (首席算法专家)、张嘉诚 (法人代表)、控制算法组、系统工程部代表';
        parsedConclusions = '1. 确定开展下一代 AILane 软硬件融合计算节点的试制工作，重点攻克在恶劣工况环境下的零丢包与高频滤波降噪算法精度。\n2. 会议一致裁定将本研究形成的3项发明专利与2项软件著作权提交至知识保护审查系统，为申报国家级专精特新项目奠定基础。\n3. 下季度测试样品成果已就位，进入外挂调试阶段。';
      } else if (file.name.toLowerCase().includes('finance') || file.name.toLowerCase().includes('budget') || file.name.includes('财务') || file.name.includes('预算')) {
        parsedTitle = '科技成果转化资金配置及年度自筹研发科目合规审计会议';
        parsedAttendees = '张嘉诚 (法人代表)、外部合作财务专家、出纳团队、核心研发负责人代表';
        parsedConclusions = '1. 审计了近三个季度以来的直接研发开支科目明细，确定各项软材料、硬件打样、算力采购支出归集完全合规、有迹可循。\n2. 决定自下月起，进一步理顺技术转化台账，按研发小组产出匹配单独的预算返点激励，充分调动人才主观能动性。\n3. 确认预留不低于120万元的流动资金专项，做下一步重点知识产权申报和成果鉴定之备用。';
      } else if (file.name.toLowerCase().includes('patent') || file.name.toLowerCase().includes('qualification') || file.name.includes('专利') || file.name.includes('资质')) {
        parsedTitle = '高新技术企业认定资质条件对标与核心发明专利申报专题会议';
        parsedAttendees = '张嘉诚 (总经理)、知识产权代理事务所老师、核心算法组组长、研发项目经理';
        parsedConclusions = '1. 对标国家高新技术企业资质认定的“三表一数”指标要求：自主知识产权满分占比需大于60%，会议决议由专利负责团队在一周内补足新一季度的核心算法专利申报文件。\n2. 审议完成了历年研发项目立项合同书的规范性整理，重点确保立项题目和实物、软著等技术指标完全承接、形成科学证据链。';
      }

      setMeetingFormData({
        title: parsedTitle,
        time: parsedTime,
        attendees: parsedAttendees,
        conclusions: parsedConclusions
      });
      triggerToast('AI 智能提取成功！相关要素已填充至表单');
    }, 1500);
  };

  // Meeting management helpers
  const handleOpenAddMeeting = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    setMeetingFormData({
      title: '',
      time: `${todayStr} 10:00 - 11:30`,
      attendees: '',
      conclusions: ''
    });
    setEditingMeetingId(null);
    setUploadedFileName('');
    setIsRecognizing(false);
    setIsAddMeetingOpen(true);
  };

  const handleOpenEditMeeting = (meet: any) => {
    setMeetingFormData({
      title: meet.title || '',
      time: meet.time || '',
      attendees: meet.attendees || '',
      conclusions: meet.conclusions || ''
    });
    setEditingMeetingId(meet.id);
    setUploadedFileName('');
    setIsRecognizing(false);
    setIsAddMeetingOpen(true);
  };

  const handleSaveMeeting = () => {
    if (!meetingFormData.title.trim()) {
      triggerToast('请输入会议名称/主题');
      return;
    }
    setAllEnterprises(prev => prev.map(ent => {
      if (ent.id === selectedId) {
        const existingMeetings = ent.meetings || [];
        if (editingMeetingId) {
          return {
            ...ent,
            meetings: existingMeetings.map((m: any) => m.id === editingMeetingId ? { ...m, ...meetingFormData } : m)
          };
        } else {
          return {
            ...ent,
            meetings: [
              ...existingMeetings,
              {
                id: `meet-${Date.now()}`,
                body: '',
                ...meetingFormData
              }
            ]
          };
        }
      }
      return ent;
    }));
    triggerToast(editingMeetingId ? '会议信息更新成功' : '新增会议成功');
    setIsAddMeetingOpen(false);
  };

  const handleDeleteMeeting = (meetId: string) => {
    setAllEnterprises(prev => prev.map(ent => {
      if (ent.id === selectedId) {
        const existingMeetings = ent.meetings || [];
        return {
          ...ent,
          meetings: existingMeetings.filter((m: any) => m.id !== meetId)
        };
      }
      return ent;
    }));
    triggerToast('会议已成功移除');
  };

  // Logo uploading handler
  const triggerLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/svg+xml';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        triggerToast(`成功上传LOGO：${file.name}`);
      }
    };
    input.click();
  };

  // Stamp uploading handler
  const triggerStampUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        triggerToast(`企业公章上传成功：${file.name}`);
      }
    };
    input.click();
  };

  // Digital Signature canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0045c4';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveCursiveSignature = () => {
    if (signatureType === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        triggerToast('请先在画板上进行签名再保存');
        return;
      }
      const dataUrl = canvas.toDataURL();
      setSavedSignature(dataUrl);
      // Also update back into form/enterprise state
      setAllEnterprises(prev => prev.map(ent => {
        if (ent.id === selectedId) {
          return {
            ...ent,
            info: { ...ent.info, signatureImage: dataUrl }
          };
        }
        return ent;
      }));
    } else {
      // Font watermark option
      if (!fontSignatureName.trim()) {
        triggerToast('名字不能为空');
        return;
      }
      setSavedSignature(`font:${activeSignatureFont}:${fontSignatureName}`);
    }
    setIsSignatureModalOpen(false);
    triggerToast('法人签字配置已更新，请点击下方「保存设置」保存。');
  };

  return (
    <div className="space-y-6" id="enterprise-dashboard-viewport">
      
      {/* Toast feedback alerts */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0A66FF]/95 backdrop-blur-md text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-[#BFD8FF] text-xs font-medium tracking-wide"
          >
            <Check className="w-4 h-4 shrink-0 text-white stroke-[3]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main body: Split view with Sub-menus on Left, Fields on Right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start animate-fadeIn" id="enterprise-management-panel">
        
        {/* LEFT VERTICAL MENUS BLOCK */}
        <div className="w-full lg:w-72 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-5 shrink-0 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.01)]" id="enterprise-submenus-wrapper">
          
          {/* Direct Enterprise Selector List styled with Swiss premium minimalist design */}
          <div className="flex flex-col gap-2 mb-6" id="company-switcher-container">
            {/* Header: All Companies label with hovering plus button */}
            <div className="flex items-center justify-between px-1 mb-1.5 select-none" id="all-companies-header">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider block uppercase">
                所有企业
              </span>
              <div className="relative group/tooltip">
                <button
                  type="button"
                  onClick={() => setIsCreateCompanyOpen(true)}
                  className="p-1 hover:bg-slate-200/50 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  id="create-company-plus-btn"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                {/* Tooltip hovering layout */}
                <div className="absolute right-0 bottom-full mb-1.5 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity bg-[#102033] text-white text-[10px] font-normal py-1 px-2.5 rounded-md shadow-lg whitespace-nowrap z-50">
                  创建企业
                </div>
              </div>
            </div>

            {/* List of direct switchers */}
            <div className="flex flex-col gap-1.5 max-h-55 overflow-y-auto scrollbar-none pr-0.5" id="direct-companies-list">
              {allEnterprises.map((ent) => {
                const isActive = ent.id === selectedId;
                const isActivated = !!(ent.info?.creditCode && ent.info.creditCode.trim());
                return (
                  <button
                    key={ent.id}
                    onClick={() => setSelectedId(ent.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-between gap-1 border cursor-pointer group",
                      isActive
                        ? "bg-[#0A66FF] text-white border-[#0A66FF] shadow-[0_4px_12px_rgba(10,102,255,0.15)]"
                        : "bg-white text-slate-600 border-[#EEF3F8] hover:bg-[#F3F8FF] hover:border-[#BFD8FF] hover:text-[#0A66FF]"
                    )}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden flex-1 min-w-0">
                      <Building2 className={cn("w-3.5 h-3.5 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-[#0A66FF]")} />
                      <span className="truncate block font-medium flex-1 min-w-0 pr-1">
                        {ent.name}
                      </span>
                    </div>
                    {/* Status indicator badge */}
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tight shrink-0 select-none border",
                      isActivated 
                        ? (isActive ? "bg-emerald-500/25 text-emerald-100 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-[#DDE8F5]")
                        : (isActive ? "bg-blue-600 text-blue-100 border-blue-500" : "bg-[#F7FAFF] text-slate-400 border-[#EEF3F8]")
                    )}>
                      {isActivated ? "已激活" : "未激活"}
                    </span>
                    {isActive && (
                      <Check className="w-2.5 h-2.5 text-white shrink-0 stroke-[3.5] ml-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-b border-slate-100 pb-2 mb-3.5 select-none">
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider block uppercase">主控面板导航</span>
          </div>

          {/* 4 sub-menus, aligning with picture 1-to-1 */}
          <div className="flex flex-col gap-1.5" id="submenus-tab-list">
            
            <button
              onClick={() => setSelectedMenuTab('info')}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium text-xs border border-transparent",
                selectedMenuTab === 'info'
                  ? "bg-white text-slate-900 font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              )}
            >
              <Building2 className="w-4 h-4 shrink-0 transition-colors" />
              <span>企业基本信息</span>
            </button>

            <button
              onClick={() => setSelectedMenuTab('capital')}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium text-xs border border-transparent",
                selectedMenuTab === 'capital'
                  ? "bg-white text-slate-900 font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              )}
            >
              <DollarSign className="w-4 h-4 shrink-0 transition-colors" />
              <span>资本与估值信息</span>
            </button>

            <button
              onClick={() => setSelectedMenuTab('bank')}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium text-xs border border-transparent",
                selectedMenuTab === 'bank'
                  ? "bg-white text-slate-900 font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              )}
            >
              <CreditCard className="w-4 h-4 shrink-0 transition-colors" />
              <span>收款与结算信息</span>
            </button>

            <button
              onClick={() => setSelectedMenuTab('products')}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium text-xs border border-transparent",
                selectedMenuTab === 'products'
                  ? "bg-white text-slate-900 font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              )}
            >
              <Layers className="w-4 h-4 shrink-0 transition-colors" />
              <span>产品列表</span>
            </button>

            <button
              onClick={() => setSelectedMenuTab('meetings')}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium text-xs border border-transparent",
                selectedMenuTab === 'meetings'
                  ? "bg-white text-slate-900 font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              )}
            >
              <Calendar className="w-4 h-4 shrink-0 transition-colors" />
              <span>会议管理</span>
            </button>

            <button
              onClick={() => setSelectedMenuTab('settings')}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 font-medium text-xs border border-transparent",
                selectedMenuTab === 'settings'
                  ? "bg-white text-slate-900 font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-slate-200/60"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              )}
            >
              <Sliders className="w-4 h-4 shrink-0 transition-colors" />
              <span>个性化设置</span>
            </button>

          </div>
        </div>

        {/* RIGHT COLUMN AREA: Pixel-Perfect matched form list */}
        <div className="flex-1 w-full bg-white border border-slate-200/65 rounded-2xl p-6 lg:p-8 shadow-sm min-h-[600px]" id="enterprise-right-details-canvas">
          
          {/* TAB 1: 企业基本信息 - 100% 1-to-1 match with the screenshot */}
          {selectedMenuTab === 'info' && (
            <div className="space-y-6 animate-fadeIn" id="basic-info-details-view">
              
              {/* Heading Title Block */}
              <div className="space-y-1 select-none" id="info-header-block">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight" id="info-tab-title">企业基本信息</h2>
                <p className="text-xs text-slate-500 font-normal" id="info-tab-subtitle">请认真核对并校正以下信息，以免影响系统正常使用</p>
              </div>

              {/* Upper panel: Logo & Business License Thumbnail */}
              <div className="flex flex-col sm:flex-row gap-6 items-center pb-4 border-b border-slate-100" id="logo-license-panel">
                
                {/* Simulated Business License SVG Thumbnail */}
                <div 
                  className="w-24 h-32 rounded-lg border border-slate-200 bg-slate-50/50 p-2 relative shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.01)] group cursor-pointer overflow-hidden flex flex-col justify-between"
                  id="business-license-preview"
                  onClick={() => triggerToast('展示当前关联营业执照原件档案。去认证可对齐工商电子密钥。')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.01]" />
                  {/* Outer border lines mimicking state license certificate */}
                  <div className="absolute inset-0.5 border border-slate-300/30 rounded" />
                  
                  {/* Top stamp text */}
                  <div className="text-[7px] font-bold text-center text-slate-600 scale-90 block mt-1 tracking-tight">营业执照</div>
                  
                  {/* Rows mimicking core license lines */}
                  <div className="space-y-1 px-1 my-auto">
                    <div className="h-1 bg-slate-200 rounded w-5/6" />
                    <div className="h-0.5 bg-slate-200 rounded w-full" />
                    <div className="h-0.5 bg-slate-200 rounded w-2/3" />
                    <div className="h-1 bg-slate-200 rounded w-4/5" />
                    <div className="h-0.5 bg-slate-200 rounded w-3/4" />
                  </div>

                  {/* Red official seal watermark */}
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full border border-red-500/20 flex items-center justify-center opacity-70">
                    <div className="text-[4px] font-bold text-red-500 scale-75">*</div>
                  </div>

                  <div className="bg-[#0A66FF]/80 text-white text-[7px] font-medium py-0.5 absolute bottom-0 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    双击大图
                  </div>
                </div>

                {/* Left controls column */}
                <div className="space-y-4" id="logo-license-actions">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* 上传LOGO Button */}
                    <button
                      onClick={triggerLogoUpload}
                      className="px-4 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(10,102,255,0.1)] cursor-pointer active:scale-95"
                      id="upload-logo-btn"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>上传LOGO</span>
                    </button>

                    {/* 去认证 Button with minimalist look and profile check icon */}
                    <button
                      onClick={() => triggerToast('即将跳转国家一体化政务平台电子营业执照核准页面...')}
                      className="px-4 py-2 border border-[#DDE8F5] text-[#0A66FF] hover:bg-[#F3F8FF] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer bg-white active:scale-95"
                      id="certify-license-btn"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>去认证</span>
                    </button>
                  </div>

                  {/* Hint details block */}
                  <div className="space-y-1 text-slate-400 text-[11px] font-normal select-none" id="upload-tips-span">
                    <span className="block text-slate-400">温馨提示：</span>
                    <span className="block text-slate-400">图片仅支持jpg/png/svg格式</span>
                  </div>
                </div>

              </div>

              {/* Form Grid Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="basic-info-fields-grid">
                
                {/* 1. 企业全称 with Required Star */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 flex items-center mb-1">
                    <span className="text-rose-500 mr-1">*</span>企业全称
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    placeholder="请输入企业官方全称"
                  />
                </div>

                {/* 社会信用代码 / 税号 (非必填) */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 flex items-center mb-1">
                    社会信用代码 / 税号 <span className="text-[10px] text-slate-400 font-normal ml-1.5">(非必填)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.creditCode}
                    onChange={(e) => setFormData({ ...formData, creditCode: e.target.value })}
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)] placeholder-slate-300"
                    placeholder="请输入社会信用代码或纳税人识别号"
                  />
                </div>

                {/* 2. 企业规模 with option list */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 flex items-center mb-1">
                    <span className="text-rose-500 mr-1">*</span>企业规模
                  </label>
                  <div className="relative">
                    <select
                      value={formData.scale}
                      onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                      className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all cursor-pointer appearance-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    >
                      <option value="1~50">1~50</option>
                      <option value="50~100">50~100</option>
                      <option value="100~500">100~500</option>
                      <option value="500人以上">500人以上</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                  </div>
                </div>

                {/* 3. 行业类型 selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 flex items-center mb-1">
                    <span className="text-rose-500 mr-1">*</span>行业类型
                  </label>
                  <div className="relative">
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all cursor-pointer appearance-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    >
                      <option value="人工智能 / 人工智能基础支持">人工智能 / 人工智能基础支持</option>
                      <option value="核心自研算法 / 大数据底座开发">核心自研算法 / 大数据底座开发</option>
                      <option value="新一代信息技术与信息安全">新一代信息技术与信息安全</option>
                      <option value="中高端绿色供应链、新能源制造">中高端绿色供应链、新能源制造</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                  </div>
                </div>

                {/* 4. 企业结构 Radio buttons: 境内 and VIE */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 mb-1">企业结构</label>
                  <div className="flex items-center gap-6 py-2.5">
                    {/* INLAND (境内, checked by default) */}
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <input
                        type="radio"
                        name="structure-group"
                        checked={formData.structure === '境内'}
                        onChange={() => setFormData({ ...formData, structure: '境内' })}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        formData.structure === '境内' ? "border-[#0A66FF] bg-[#0A66FF]" : "border-slate-300 group-hover:border-slate-400"
                      )}>
                        {formData.structure === '境内' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-scaleIn" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-700">境内</span>
                    </label>

                    {/* VIE (Offshore) */}
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <input
                        type="radio"
                        name="structure-group"
                        checked={formData.structure === 'VIE'}
                        onChange={() => setFormData({ ...formData, structure: 'VIE' })}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        formData.structure === 'VIE' ? "border-[#0A66FF] bg-[#0A66FF]" : "border-slate-300 group-hover:border-slate-400"
                      )}>
                        {formData.structure === 'VIE' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-scaleIn" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-700">VIE</span>
                    </label>
                  </div>
                </div>

                {/* 5. 变更日期 calendar outline */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 flex items-center mb-1">
                    <span className="text-rose-500 mr-1">*</span>变更日期
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.changeDate}
                      onChange={(e) => setFormData({ ...formData, changeDate: e.target.value })}
                      className="w-full bg-slate-50/30 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                  </div>
                </div>

                {/* 6. 净资产值 with inline 变更历史 link */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600 mb-1">净资产值</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.netAssets}
                      onChange={(e) => setFormData({ ...formData, netAssets: e.target.value })}
                      className="w-full bg-slate-50/30 border border-slate-200 rounded-lg pl-4 pr-24 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    />
                    <button
                      type="button"
                      onClick={() => setIsHistoryModalOpen(true)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border-b border-dashed border-slate-300 hover:border-slate-800 leading-tight"
                      id="net-assets-history-trigger"
                    >
                      变更历史
                    </button>
                  </div>
                </div>

              </div>

              {/* Save settings action */}
              <div className="pt-2" id="info-submit-dock">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-blue-500/10 active:scale-98 cursor-pointer"
                  id="save-info-settings-btn"
                >
                  保存设置
                </button>
              </div>

              {/* Custom section separator title: 签字&盖章 */}
              <div className="pt-6 space-y-4" id="signature-stamp-block">
                
                <div className="flex items-center justify-between" id="subblock-sec-headings">
                  <span className="text-base font-medium text-slate-800">签字&盖章</span>
                </div>
                
                <div className="w-full border-t border-slate-100" />

                {/* Double uploads grid (法人签字, 企业盖章) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="double-signature-zones-row">
                  
                  {/* ZONE 1: 法人签字 */}
                  <div className="space-y-3" id="signature-left-zone">
                    <span className="text-xs font-medium text-slate-600 block">法人签字</span>
                    
                    <div 
                      className="h-[200px] rounded-xl border border-slate-200 bg-slate-50/30 relative flex items-center justify-center p-6 select-none overflow-hidden hover:bg-slate-50/75 transition-all cursor-pointer group"
                      onClick={() => setIsSignatureModalOpen(true)}
                      title="点击设置法人手写/电脑艺术版签名"
                    >
                      {/* Render loaded signature */}
                      {savedSignature ? (
                        savedSignature.startsWith('font:') ? (
                          <div className={cn(
                            "text-4xl tracking-wide text-slate-800 text-center select-none uppercase",
                            savedSignature.split(':')[1] === 'cursive' ? "font-serif italic font-light font-style-cursive" : "font-mono font-bold tracking-wider"
                          )}>
                            {savedSignature.split(':')[2]}
                          </div>
                        ) : (
                          <img 
                            src={savedSignature} 
                            alt="Signature Preview" 
                            className="max-h-32 max-w-full object-contain filter leading-none pointer-events-none" 
                          />
                        )
                      ) : (
                        <div className="text-4xl text-slate-300 font-serif select-none italic tracking-wider py-12 block text-center font-light">
                          签字
                        </div>
                      )}

                      <div className="bg-[#0A66FF]/80 text-white rounded-lg px-2.5 py-1 text-[9px] font-bold absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        点击修改签字
                      </div>
                    </div>

                    {/* Bottom stylized pen action button */}
                    <button
                      onClick={() => setIsSignatureModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F3F8FF] hover:bg-[#EAF2FF] text-[#0A66FF] border border-[#BFD8FF] font-medium text-xs rounded-lg transition-all cursor-pointer"
                      id="setup-signature-btn"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>点击设置</span>
                    </button>
                  </div>

                  {/* ZONE 2: 企业盖章 */}
                  <div className="space-y-3" id="stamp-right-zone">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">企业盖章</span>
                      <button
                        onClick={() => setIsStampDemoOpen(true)}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-0.5 border-b border-dashed border-slate-300 hover:border-slate-800 leading-tight"
                        id="stamp-demo-link"
                      >
                        查看示例
                      </button>
                    </div>
                    
                    <div 
                      className="h-[200px] rounded-xl border border-slate-200 bg-slate-50/30 relative flex items-center justify-center p-6 select-none overflow-hidden hover:bg-slate-50/75 transition-all cursor-pointer group"
                      onClick={triggerStampUpload}
                      title="点击上传企业公章图片"
                    >
                      {/* Dyn-Curved Red Seal SVG representing active company trademark! using authentic cinnabar color */}
                      <div className="relative transform hover:scale-105 duration-300">
                        <svg width="112" height="112" viewBox="0 0 100 100" className="opacity-90 select-none">
                          <circle cx="50" cy="50" r="46" stroke="#c53030" strokeWidth="2" fill="none" />
                          <circle cx="50" cy="50" r="44.2" stroke="#c53030" strokeWidth="0.5" fill="none" strokeDasharray="1.5,1" />
                          
                          {/* Inner traditional watermark star */}
                          <polygon points="50,28 54.5,39 67,40 57.5,48.5 61,61 50,53.5 39,61 42.5,48.5 33,40 45.5,39" fill="#c53030" />
                          
                          {/* Standard top circumference path for curving text */}
                          <path d="M 12,50 A 38,38 0 1,1 88,50" id="stamp-text-arch" fill="none" stroke="none" />
                          
                          <text fill="#c53030" fontSize="6.2" fontWeight="bold" letterSpacing="0.6">
                            <textPath href="#stamp-text-arch" startOffset="50%" textAnchor="middle">
                              {formData.companyName || currentEnterprise.name || '核心企业有限公司'}
                            </textPath>
                          </text>
                        </svg>
                      </div>

                      <div className="bg-[#0A66FF]/80 text-white rounded-lg px-2.5 py-1 text-[9px] font-bold absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        点击更换公章
                      </div>
                    </div>

                    {/* Bottom upload action button */}
                    <button
                      onClick={triggerStampUpload}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F3F8FF] hover:bg-[#EAF2FF] text-[#0A66FF] border border-[#BFD8FF] font-medium text-xs rounded-lg transition-all cursor-pointer"
                      id="upload-stamp-btn"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>点击上传</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: 资本与估值信息 */}
          {selectedMenuTab === 'capital' && (
            <div className="space-y-6 animate-fadeIn" id="capital-tab-page-wrapper">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight" id="capital-tab-title">资本与估值信息</h2>
                <p className="text-xs text-slate-500 font-normal" id="capital-tab-subtitle">查看及维护本企业历次融资情况、持股比例及对内估值认定</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="capital-fields-grid">
                
                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium text-slate-600 block mb-1">实缴资本额</label>
                  <input
                    type="text"
                    defaultValue="1,000 万人民币"
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium text-slate-600 block mb-1">融资阶段首选项</label>
                  <div className="relative">
                    <select className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all cursor-pointer appearance-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                      <option>种子轮 / 团队启动</option>
                      <option>天使轮 / 创投资本接入</option>
                      <option>Pre-A轮 / 首期研发推进</option>
                      <option defaultValue>A轮 / 核心盈利验证</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium text-slate-600 block mb-1">外部战略估值指标 (元)</label>
                  <input
                    type="text"
                    defaultValue="80,000,000"
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-mono font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium text-slate-600 block mb-1">估值审计签署机构</label>
                  <input
                    type="text"
                    defaultValue="华泰联合证券及外部审计联合认定"
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-slate-700 tracking-wider uppercase mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-slate-500" />
                  <span>股东结构与持股比例表格</span>
                </h3>
                
                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50/65 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">大股东/发起人名称</th>
                        <th className="px-4 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">认缴出资 (元)</th>
                        <th className="px-4 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">实持比例</th>
                        <th className="px-4 py-3 font-semibold text-slate-500 text-[11px] tracking-wider uppercase">投票表决属性</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600 bg-white">
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-3 text-slate-950 font-semibold">{formData.legalPerson}创始团队</td>
                        <td className="px-4 py-3 font-mono">12,000,000</td>
                        <td className="px-4 py-3 text-slate-900 font-semibold font-mono">80.00%</td>
                        <td className="px-4 py-3 text-slate-600">核心决定权 (自控)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-3 text-slate-900">北京低碳科创直投基金</td>
                        <td className="px-4 py-3 font-mono">2,000,000</td>
                        <td className="px-4 py-3 text-slate-600 font-mono">13.33%</td>
                        <td className="px-4 py-3 text-slate-600">一票否决(合规安全限)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-3 text-slate-900">合肥声谷数字算法中心（有限合伙）</td>
                        <td className="px-4 py-3 font-mono">1,000,000</td>
                        <td className="px-4 py-3 text-slate-600 font-mono">6.67%</td>
                        <td className="px-4 py-3 text-slate-600">单纯参股无表决权</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => triggerToast('资本与估值增补节点添加成功！')}
                  className="px-6 py-2.5 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium transition shadow-md shadow-blue-500/10 active:scale-98 cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: 收款与结算信息 */}
          {selectedMenuTab === 'bank' && (
            <div className="space-y-6 animate-fadeIn text-left" id="bank-accounting-tab-page">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-slate-700" />
                    <span>收款与结算信息</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">配置和管理您名下企业的对公银行账号、开票税号、收款通道等核心资金往来结算账户</p>
                </div>
                
                <button
                  onClick={openAddBillingModal}
                  className="px-4 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span>添加结算账户</span>
                </button>
              </div>

              {/* Accounts list table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.01)] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] tracking-wider uppercase min-w-[200px]">开户银行全称</th>
                        <th className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] tracking-wider uppercase min-w-[180px]">对公结算人民币账号</th>
                        <th className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] tracking-wider uppercase min-w-[165px]">企业绑定对公邮箱</th>
                        <th className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] tracking-wider uppercase min-w-[130px]">账户类型</th>
                        <th className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] tracking-wider uppercase min-w-[100px] text-center">主账户</th>
                        <th className="px-5 py-3.5 font-semibold text-slate-500 text-[11px] tracking-wider uppercase text-center w-24">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {billingAccounts.length > 0 ? (
                        billingAccounts.map((acc) => (
                          <tr key={acc.id} className="hover:bg-slate-50/40 transition-colors">
                            {/* ① 开户银行全称 */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", acc.isMain ? "bg-emerald-500" : "bg-slate-300")} />
                                <span className="text-slate-900 font-semibold text-xs block max-w-[250px] truncate" title={acc.bankName}>
                                  {acc.bankName}
                                </span>
                              </div>
                            </td>
                            {/* ② 对公结算人民币账号 */}
                            <td className="px-5 py-4 font-mono text-slate-800 text-xs tracking-wider select-all" title={acc.accountNumber}>
                              {acc.accountNumber}
                            </td>
                            {/* ③ 企业绑定对公邮箱 */}
                            <td className="px-5 py-4 text-slate-600 font-normal tracking-normal text-xs" title={acc.email}>
                              {acc.email || '--'}
                            </td>
                            {/* ④ 账户类型 */}
                            <td className="px-5 py-4">
                              <span className={cn(
                                "inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border",
                                acc.accountType === '基本存款账户' 
                                  ? "bg-slate-100 text-slate-800 border-slate-200"
                                  : acc.accountType === '一般存款账户'
                                    ? "bg-slate-50 text-slate-700 border-slate-200/60"
                                    : "bg-slate-50/50 text-slate-600 border-slate-100"
                              )}>
                                {acc.accountType || '基本存款账户'}
                              </span>
                            </td>
                            {/* ⑤ 主账户 */}
                            <td className="px-5 py-4 text-center">
                              {acc.isMain ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>主要账户</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setBillingAccounts(prev => prev.map(item => ({
                                      ...item,
                                      isMain: item.id === acc.id
                                    })));
                                    triggerToast('已成功切换默认主账户！');
                                  }}
                                  className="text-[11px] text-slate-400 hover:text-slate-900 font-medium hover:underline cursor-pointer transition-colors"
                                  title="设为默认主账户"
                                >
                                  设为默认
                                </button>
                              )}
                            </td>
                            {/* ⑥ 操作 */}
                            <td className="px-5 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEditBillingModal(acc)}
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  title="编辑账户参数"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('确认要删除此结算账户吗？')) {
                                      handleDeleteBilling(acc.id);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-550/10 rounded-lg transition-colors cursor-pointer"
                                  title="删除账户"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <CreditCard className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                              <span>暂无绑定的结算账务资料</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-600 font-normal leading-relaxed">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 stroke-[2]" />
                <span>
                  本系统结算模块由博创数智中枢全权托管，对公账户修改需企业法定代表人持有印信、执照、手机密钥多因子核验。如有疑问请致电博创技术中心专属通道咨询。
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: 个性化设置 */}
          {selectedMenuTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn text-left" id="personalization-settings-tab">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight" id="settings-tab-title">个性化设置</h2>
                <p className="text-xs text-slate-500 font-normal" id="settings-tab-subtitle">定义本主体的智能分析首选项、PDF生成水印、报告文字模式及工作协同环境参数</p>
              </div>

              <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200">
                {/* 1 Toggle */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#0A66FF] block">PDF 智能报告水印护锁</span>
                    <span className="text-[11px] text-slate-400 block font-normal">自动在导出的申报书中内嵌该公司简称的专属防伪防漏浅雕印记</span>
                  </div>
                  <div className="w-10 h-5.5 bg-[#0A66FF] rounded-full p-0.5 flex items-center justify-end cursor-pointer transition-all">
                    <div className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                {/* 2 Toggle */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-800 block">敏感资产底稿数据高密度遮脱</span>
                    <span className="text-[11px] text-slate-400 block font-normal">在工作流、预览底稿或公开表格中对股东出资实缴等敏感字段高安全度遮罩</span>
                  </div>
                  <div className="w-10 h-5.5 bg-slate-200 rounded-full p-0.5 flex items-center justify-start cursor-pointer transition-all">
                    <div className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>

                {/* 3 Toggle */}
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#0A66FF] block">智能分析大中枢文本深度调优</span>
                    <span className="text-[11px] text-slate-400 block font-normal">生成申报或招商材料时，优先调优博创LLM并针对主体特定行业特定行业调优</span>
                  </div>
                  <div className="w-10 h-5.5 bg-[#0A66FF] rounded-full p-0.5 flex items-center justify-end cursor-pointer transition-all">
                    <div className="w-4.5 h-4.5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 产品列表 */}
          {selectedMenuTab === 'products' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                    <Layers className="w-5 h-5 text-slate-700" />
                    <span>产品与交付系统</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">记录和管理您公司旗下的核心自研产品、云交付系统与软硬件研发档案</p>
                </div>
                
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span>新增产品/系统</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEnterprise?.products && currentEnterprise.products.length > 0 ? (
                  currentEnterprise.products.map((prod: any) => (
                    <div 
                      key={prod.id} 
                      className="bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Header style */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <h3 className="text-xs font-bold text-slate-900 truncate" title={prod.name}>
                              {prod.name}
                            </h3>
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-mono">
                              {prod.version || 'v1.0.0'}
                            </span>
                          </div>
                          
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tight shrink-0 border",
                            prod.status === 'active' 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-150" 
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          )}>
                            {prod.status === 'active' ? '运行中' : '已停维护'}
                          </span>
                        </div>

                        {/* Technology Stack / Specs */}
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-400">
                            <span className="font-semibold text-slate-500">技术栈：</span>
                            <span className="truncate text-slate-600 font-mono" title={prod.techStack}>
                              {prod.techStack || '未指定'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-400">
                            <span className="font-semibold text-slate-500">部署状态：</span>
                            <span className="truncate text-slate-600" title={prod.userCount}>
                              {prod.userCount || '完成首期部署'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('确认要删除该产品建设档案吗？')) {
                              handleDeleteProduct(prod.id);
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 rounded-md transition-all cursor-pointer"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full border border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Layers className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <span>本企业暂未录入发布任何自研产品或业务系统</span>
                      <button
                        onClick={handleOpenAddProduct}
                        className="mt-3 text-xs font-semibold text-[#0A66FF] bg-[#EAF2FF] hover:bg-[#D0E2FF] px-3.5 py-2 rounded-lg transition-all"
                      >
                        立即新增首个产品
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: 会议管理 */}
          {selectedMenuTab === 'meetings' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-700" />
                    <span>会议管理与决议纪要</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">全面留档公司内部核心研讨、董事会决议与合规性评估诊断纪要</p>
                </div>
                
                <button
                  onClick={handleOpenAddMeeting}
                  className="px-4 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span>添加会议纪要</span>
                </button>
              </div>

              {/* Timeline layout of meetings */}
              <div className="space-y-4">
                {currentEnterprise?.meetings && currentEnterprise.meetings.length > 0 ? (
                  currentEnterprise.meetings.map((meet: any) => (
                    <div 
                      key={meet.id} 
                      className="bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-xs transition-all space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Title & metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">
                            {meet.title}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 whitespace-nowrap self-start sm:self-auto">
                            {meet.time}
                          </span>
                        </div>

                        {/* Attendees */}
                        <div className="flex items-start gap-1.5 text-xs text-slate-600">
                          <span className="font-semibold text-slate-400 shrink-0">参会人员：</span>
                          <span className="font-medium text-slate-700">{meet.attendees || '全体董事/核心团队成员'}</span>
                        </div>

                        {/* Conclusions */}
                        {meet.conclusions && (
                          <div className="bg-slate-50/70 border border-slate-150/50 rounded-lg p-3 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">会议决议 & 合规纪要</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                              {meet.conclusions}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-1 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditMeeting(meet)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('确认删除该条会议决议纪要档案吗？')) {
                              handleDeleteMeeting(meet.id);
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 rounded-md transition-all cursor-pointer"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Calendar className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <span>该企业暂无登记任何会议纪要或决策信息</span>
                      <button
                        onClick={handleOpenAddMeeting}
                        className="mt-3 text-xs font-semibold text-[#0A66FF] bg-[#EAF2FF] hover:bg-[#D0E2FF] px-3.5 py-2 rounded-lg transition-all"
                      >
                        立即安排首次会议
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: INTERACTIVE法人签字 SETTING DRAWER (Handwritten sketch Signature Canvas!) */}
      {isSignatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top close button */}
            <button
              onClick={() => setIsSignatureModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-705 rounded-lg transition-all cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Modal Heading and description */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 tracking-tight">设置法人电子签字</h3>
              <p className="text-xs text-slate-500 font-normal">请选择签名配置方式，支持高精手写画板或名字一键排版生成</p>
            </div>

            {/* Selector: draw or auto-type */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg" id="signature-toggle-bar">
              <button
                onClick={() => setSignatureType('draw')}
                className={cn(
                  "flex-1 py-1.5 text-xs text-center font-medium rounded-md transition-all cursor-pointer",
                  signatureType === 'draw' ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                )}
              >
                手写签名板
              </button>
              <button
                onClick={() => setSignatureType('font')}
                className={cn(
                  "flex-1 py-1.5 text-xs text-center font-medium rounded-md transition-all cursor-pointer",
                  signatureType === 'font' ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                )}
              >
                智能排版生成
              </button>
            </div>

            {/* Drawer Area */}
            {signatureType === 'draw' ? (
              <div className="space-y-3">
                <span className="text-[11px] text-slate-400 font-normal block">在下方空白区域手写划动，支持鼠标或者移动端触摸划线。</span>
                
                {/* HTML Drawing Pad */}
                <div className="border border-slate-200 rounded-lg bg-slate-50/20 w-full relative flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="bg-transparent block cursor-crosshair max-w-full touch-none"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs font-normal pointer-events-none select-none">
                      鼠标划行进行电子签名
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={clearCanvas}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition cursor-pointer"
                  >
                    重写清空
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-medium text-slate-600 block mb-1">输入法人姓名</label>
                  <input
                    type="text"
                    value={fontSignatureName}
                    onChange={(e) => setFontSignatureName(e.target.value)}
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-slate-900 focus:bg-white transition-all"
                    placeholder="输入名字，如 张嘉诚"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600 block mb-1">选择艺术印线风格</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => setActiveSignatureFont('cursive')}
                      className={cn(
                        "p-4 border rounded-lg text-center cursor-pointer transition-all bg-slate-55/20 hover:bg-slate-100",
                        activeSignatureFont === 'cursive' ? "border-slate-900 bg-white text-slate-950 font-semibold" : "border-slate-200 text-slate-500"
                      )}
                    >
                      <span className="text-2xl font-serif italic text-center block font-light">
                        {fontSignatureName || '毛笔体'}
                      </span>
                      <span className="text-[10px] opacity-70 block mt-1 font-medium">手写意境风</span>
                    </div>

                    <div 
                      onClick={() => setActiveSignatureFont('brush')}
                      className={cn(
                        "p-4 border rounded-lg text-center cursor-pointer transition-all bg-slate-55/20 hover:bg-slate-100",
                        activeSignatureFont === 'brush' ? "border-slate-900 bg-white text-slate-950 font-semibold" : "border-slate-200 text-slate-500"
                      )}
                    >
                      <span className="text-2xl font-mono block font-semibold tracking-wider text-center">
                        {fontSignatureName || '拼音大写'}
                      </span>
                      <span className="text-[10px] opacity-70 block mt-1 font-medium">英文正规格港风</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Submitter buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsSignatureModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium cursor-pointer transition"
              >
                取消
              </button>
              <button
                onClick={saveCursiveSignature}
                className="px-6 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium cursor-pointer transition shadow-md shadow-blue-500/10"
              >
                确认应用
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* MODAL 2: 变更历史 POPUP */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsHistoryModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-705 rounded-lg transition-all cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 stroke-[2]" />
            </button>

            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              <span>净资产变更历史</span>
            </h3>

            <div className="space-y-3.5 pt-2">
              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-dashed border-slate-100">
                <div className="space-y-0.5 text-left">
                  <span className="text-slate-800 block font-medium">2026年度中期财务认定</span>
                  <span className="text-[10px] text-slate-400">核定操作人：对公财务官林嘉楠</span>
                </div>
                <span className="text-slate-900 font-semibold font-mono font-style-normal">+ 15,200,000 元</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2.5 border-b border-dashed border-slate-100">
                <div className="space-y-0.5 text-left">
                  <span className="text-slate-800 block font-medium">2025年度资产转让与购入出入账</span>
                  <span className="text-[10px] text-slate-400">核定操作人：对公财务官林嘉楠</span>
                </div>
                <span className="text-slate-900 font-semibold font-mono font-style-normal">+ 8,000,000 元</span>
              </div>

              <div className="flex justify-between items-center text-xs pb-2.5">
                <div className="space-y-0.5 text-left">
                  <span className="text-slate-800 block font-medium">首创天使轮投资本溢价划出</span>
                  <span className="text-[10px] text-slate-400">核定操作人：创始人张嘉诚</span>
                </div>
                <span className="text-slate-900 font-semibold font-mono font-style-normal">+ 0 元</span>
              </div>
            </div>

            <div className="text-center pt-2.5 border-t border-slate-100">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-full py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium transition cursor-pointer shadow-md shadow-blue-500/10"
              >
                已阅并关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: 公章上传示例 POPUP 1-to-1 Match */}
      {isStampDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none border-none">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsStampDemoOpen(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-705 rounded-lg transition-all cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Instruction description in the photo */}
            <div className="text-center text-xs font-normal text-slate-500 leading-relaxed max-w-xs mx-auto pt-4 select-none px-2">
              请将印章盖在纯白纸上，冷光无阴影正面居中拍摄，上传格式jpg，文件大小20M以内
            </div>

            {/* 2x2 comparison grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* GRID 1: 正面、白底 */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-3xs flex flex-col">
                <div className="h-28 bg-[#fafbff] flex items-center justify-center p-3 relative">
                  <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-95">
                    <circle cx="50" cy="50" r="45" stroke="#c53030" strokeWidth="2" fill="none" />
                    <polygon points="50,30 54,40 65,40 56,48 59,59 50,52 41,59 44,48 35,40 46,40" fill="#c53030" />
                    <path d="M 15,50 A 35,35 0 1,1 85,50" id="m-path-1" fill="none" stroke="none" />
                    <text fill="#c53030" fontSize="8.2" fontWeight="bold">
                      <textPath href="#m-path-1" startOffset="50%" textAnchor="middle">本主体有限责任公司</textPath>
                    </text>
                    <text x="50" y="72" fill="#c53030" fontSize="7" fontWeight="bold" textAnchor="middle">公印专用章</text>
                  </svg>
                </div>
                <div className="border-t border-slate-200 bg-slate-50/50 py-1.5 flex items-center justify-center gap-1 text-center text-[10px] font-medium text-slate-600 select-none">
                  <span>正面、白底</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-semibold">✓</div>
                </div>
              </div>

              {/* GRID 2: 泛黄、泛灰 */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-3xs flex flex-col">
                <div className="h-28 bg-[#bfb4a5] flex items-center justify-center p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-amber-900/10 mix-blend-multiply" />
                  <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-75 filter contrast-125 saturate-75">
                    <circle cx="50" cy="50" r="45" stroke="#9b2c2c" strokeWidth="2" fill="none" />
                    <polygon points="50,30 54,40 65,40 56,48 59,59 50,52 41,59 44,48 35,40 46,40" fill="#9b2c2c" />
                    <path d="M 15,50 A 35,35 0 1,1 85,50" id="m-path-2" fill="none" stroke="none" />
                    <text fill="#9b2c2c" fontSize="8.2" fontWeight="bold">
                      <textPath href="#m-path-2" startOffset="50%" textAnchor="middle">本主体有限责任公司</textPath>
                    </text>
                    <text x="50" y="72" fill="#9b2c2c" fontSize="7" fontWeight="bold" textAnchor="middle">公印专用章</text>
                  </svg>
                </div>
                <div className="border-t border-slate-200 bg-slate-50/50 py-1.5 flex items-center justify-center gap-1 text-center text-[10px] font-medium text-slate-600 select-none">
                  <span>泛黄、泛灰</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[7px] font-semibold">✕</div>
                </div>
              </div>

              {/* GRID 3: 阴影 */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-3xs flex flex-col">
                <div className="h-28 bg-[#dedad6] relative flex items-center justify-center p-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/20 to-transparent pointer-events-none" />
                  <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-80">
                    <circle cx="50" cy="50" r="45" stroke="#c53030" strokeWidth="2" fill="none" />
                    <polygon points="50,30 54,40 65,40 56,48 59,59 50,52 41,59 44,48 35,40 46,40" fill="#c53030" />
                    <path d="M 15,50 A 35,35 0 1,1 85,50" id="m-path-3" fill="none" stroke="none" />
                    <text fill="#c53030" fontSize="8.2" fontWeight="bold">
                      <textPath href="#m-path-3" startOffset="50%" textAnchor="middle">本主体有限责任公司</textPath>
                    </text>
                    <text x="50" y="72" fill="#c53030" fontSize="7" fontWeight="bold" textAnchor="middle">公印专用章</text>
                  </svg>
                </div>
                <div className="border-t border-slate-200 bg-slate-50/50 py-1.5 flex items-center justify-center gap-1 text-center text-[10px] font-medium text-slate-600 select-none">
                  <span>阴影</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 text-white flex items-center justify-center text-[7px] font-semibold">✕</div>
                </div>
              </div>

              {/* GRID 4: 折痕 */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-3xs flex flex-col">
                <div className="h-28 bg-[#ecebe9] relative flex items-center justify-center p-3 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 right-1/2 bg-white/20 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 left-1/2 bg-black/5 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-400/20 pointer-events-none" />
                  <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-85">
                    <circle cx="50" cy="50" r="45" stroke="#c53030" strokeWidth="2" fill="none" />
                    <polygon points="50,30 54,40 65,40 56,48 59,59 50,52 41,59 44,48 35,40 46,40" fill="#c53030" />
                    <path d="M 15,50 A 35,35 0 1,1 85,50" id="m-path-4" fill="none" stroke="none" />
                    <text fill="#c53030" fontSize="8.2" fontWeight="bold">
                      <textPath href="#m-path-4" startOffset="50%" textAnchor="middle">本主体有限责任公司</textPath>
                    </text>
                    <text x="50" y="72" fill="#c53030" fontSize="7" fontWeight="bold" textAnchor="middle">公印专用章</text>
                  </svg>
                </div>
                <div className="border-t border-slate-200 bg-slate-50/50 py-1.5 flex items-center justify-center gap-1 text-center text-[10px] font-medium text-slate-600 select-none">
                  <span>折痕</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 text-white flex items-center justify-center text-[7px] font-semibold">✕</div>
                </div>
              </div>

            </div>

            {/* Bottom action button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsStampDemoOpen(false)}
                className="w-full py-2.5 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-md shadow-blue-500/10"
              >
                我知道了
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 4: 收款结算信息弹窗表单 - Perfect 1-to-1 Match with List Columns and styled with premium no-black outline borders */}
      {isBillingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none border-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl bg-white rounded-2xl p-6 sm:p-7 shadow-xl relative text-left border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top close button */}
            <button
              onClick={() => setIsBillingModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-705 rounded-lg transition-all cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Modal Heading Description */}
            <div className="mb-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <CreditCard className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  {billingModalMode === 'add' ? '添加对公及收款结算账户' : '编辑对公收款结算账户'}
                </h3>
                <p className="text-xs text-slate-500 font-normal font-sans">请精准核对并录入企业的对公及收款结算参数，系统将全权进行结算匹配</p>
              </div>
            </div>

            {/* Exactly replicates list headers for premium visual layout */}
            <div className="space-y-4">
              
              {/* Field 1: 开户银行全称 */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  ① 开户银行全称
                </label>
                <input
                  type="text"
                  value={billingFormData.bankName}
                  onChange={(e) => setBillingFormData({ ...billingFormData, bankName: e.target.value })}
                  className="w-full bg-slate-55/10 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                  placeholder="请输入银行全称，例：中国工商银行北京分行中关村支行"
                />
              </div>

              {/* Field 2: 对公结算人民币账号 */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  ② 对公结算人民币账号
                </label>
                <input
                  type="text"
                  value={billingFormData.accountNumber}
                  onChange={(e) => setBillingFormData({ ...billingFormData, accountNumber: e.target.value })}
                  className="w-full bg-slate-55/10 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-mono font-medium text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                  placeholder="请输入对公人民币账号，例：0200 0012 0920 1123 456"
                />
              </div>

              {/* Grid block for Field 3 and Field 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* Field 3: 企业绑定对公邮箱 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    ③ 企业绑定对公邮箱
                  </label>
                  <input
                    type="email"
                    value={billingFormData.email}
                    onChange={(e) => setBillingFormData({ ...billingFormData, email: e.target.value })}
                    className="w-full bg-slate-55/10 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    placeholder="如 finance@company.com"
                  />
                </div>

                {/* Field 4: 账户类型 */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    ④ 账户类型
                  </label>
                  <div className="relative">
                    <select
                      value={billingFormData.accountType}
                      onChange={(e) => setBillingFormData({ ...billingFormData, accountType: e.target.value })}
                      className="w-full bg-slate-55/10 border border-slate-200 rounded-lg px-4 py-2.5 pr-10 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all cursor-pointer appearance-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                    >
                      <option value="基本存款账户">基本存款账户</option>
                      <option value="一般存款账户">一般存款账户</option>
                      <option value="临时存款账户">临时存款账户</option>
                      <option value="专用存款账户">专用存款账户</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                  </div>
                </div>
              </div>

              {/* Field 5: 主账户 Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mt-2 select-none">
                <div className="space-y-0.5 text-left">
                  <span className="text-xs font-medium text-slate-800 block">⑤ 设为主账户</span>
                  <span className="text-[11px] font-normal text-slate-500 block">开启后会自动将此对公账户设定为本主体首位主结算途径</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setBillingFormData({ ...billingFormData, isMain: !billingFormData.isMain })}
                  className={cn(
                    "w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer duration-205 outline-none",
                    billingFormData.isMain ? "bg-[#0A66FF] justify-end" : "bg-slate-200 justify-start"
                  )}
                >
                  <motion.div 
                    layout 
                    className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-5 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBillingModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveBilling}
                className="px-6 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium transition cursor-pointer shadow-md shadow-blue-500/10 active:scale-98 font-semibold"
              >
                保存确定
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 5: 添加企业 popup modal - matching Image 2 fields precisely */}
      {isCreateCompanyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            id="company-creation-dialog"
          >
            {/* Top close button */}
            <button
              onClick={() => setIsCreateCompanyOpen(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Modal Heading */}
            <div className="text-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-805 tracking-tight">添加企业</h3>
            </div>

            {/* Form body */}
            <div className="space-y-4">
              {/* Field 1: 企业全称 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-755 flex items-center gap-1">
                  <span className="text-rose-500">*</span>
                  <span>企业全称</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  placeholder="企业全称"
                />
              </div>

              {/* Optional Field: 社会信用代码 / 税号 */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <span>社会信用代码 / 税号</span>
                  <span className="text-[10px] text-slate-400 font-normal">(非必填)</span>
                </label>
                <input
                  type="text"
                  value={newCreditCode}
                  onChange={(e) => setNewCreditCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs placeholder-slate-300"
                  placeholder="请输入统一社会信用代码或纳税人识别号"
                />
              </div>

              {/* Row 2: 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Field 2: 企业结构 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-755 flex items-center gap-1">
                    <span className="text-rose-500">*</span>
                    <span>企业结构</span>
                  </label>
                  <div className="flex gap-4 py-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                      <input
                        type="radio"
                        name="newStructure"
                        value="境内"
                        checked={newStructure === '境内'}
                        onChange={() => setNewStructure('境内')}
                        className="hidden"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        newStructure === '境内' ? "border-[#0045c4] bg-[#0045c4]/5" : "border-slate-300 bg-white"
                      )}>
                        {newStructure === '境内' && (
                          <div className="w-2 h-2 rounded-full bg-[#0045c4]" />
                        )}
                      </div>
                      <span>境内</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                      <input
                        type="radio"
                        name="newStructure"
                        value="VIE"
                        checked={newStructure === 'VIE'}
                        onChange={() => setNewStructure('VIE')}
                        className="hidden"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        newStructure === 'VIE' ? "border-[#0045c4] bg-[#0045c4]/5" : "border-slate-300 bg-white"
                      )}>
                        {newStructure === 'VIE' && (
                          <div className="w-2 h-2 rounded-full bg-[#0045c4]" />
                        )}
                      </div>
                      <span>VIE</span>
                    </label>
                  </div>
                </div>

                {/* Field 3: 企业类型 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-755 flex items-center gap-1">
                    <span className="text-rose-500">*</span>
                    <span>企业类型</span>
                  </label>
                  <div className="relative">
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs text-slate-800 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all cursor-pointer appearance-none"
                    >
                      <option value="">请选择</option>
                      <option value="有限责任公司">有限责任公司</option>
                      <option value="股份有限公司">股份有限公司</option>
                      <option value="合伙企业">合伙企业</option>
                      <option value="外商投资企业">外商投资企业</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
                  </div>
                </div>
              </div>

              {/* Row 3: 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Field 4: 注册时间 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-755 flex items-center gap-1">
                    <span className="text-rose-500">*</span>
                    <span>注册时间</span>
                  </label>
                  <input
                    type="date"
                    value={newRegDate}
                    onChange={(e) => setNewRegDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>

                {/* Field 5: 注册资本 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-755 flex items-center gap-1">
                    <span className="text-rose-500">*</span>
                    <span>注册资本</span>
                  </label>
                  <input
                    type="text"
                    value={newRegCapital}
                    onChange={(e) => setNewRegCapital(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Row 4: 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Field 6: 总股本 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-755 flex items-center gap-1">
                    <span className="text-rose-500">*</span>
                    <span>总股本</span>
                  </label>
                  <input
                    type="text"
                    value={newTotalShares}
                    onChange={(e) => setNewTotalShares(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-955 focus:bg-white transition-all font-mono"
                    placeholder="0"
                  />
                </div>

                {/* Field 7: 拆股比例 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <span>拆股比例</span>
                  </label>
                  <input
                    type="text"
                    value={newSplitRatio}
                    onChange={(e) => setNewSplitRatio(e.target.value)}
                    className="w-full bg-slate-55/10 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 font-medium outline-none focus:border-slate-900 transition-all font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateCompanyOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddNewCompanySubmit}
                className="px-6 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium transition cursor-pointer shadow-md shadow-blue-500/10 active:scale-98 font-semibold"
              >
                确定
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL: 新增/编辑产品 */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 stroke-[2]" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {editingProductId ? '编辑产品档案' : '新增自研产品档案'}
              </h3>
              <p className="text-xs text-slate-500 font-normal">请录入用于备案、资质诊断比对、成果盘点所必备的产品核心指标</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">产品/系统名称 *</label>
                <input
                  type="text"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  placeholder="例如：智慧数智空间管理云系统"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">产品当前版本</label>
                  <input
                    type="text"
                    value={productFormData.version}
                    onChange={(e) => setProductFormData({ ...productFormData, version: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                    placeholder="v1.0.0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">产品运营状态</label>
                  <select
                    value={productFormData.status}
                    onChange={(e) => setProductFormData({ ...productFormData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  >
                    <option value="active">运行中</option>
                    <option value="inactive">已停维</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">技术栈构成</label>
                <input
                  type="text"
                  value={productFormData.techStack}
                  onChange={(e) => setProductFormData({ ...productFormData, techStack: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  placeholder="例如：React / Python / FastAPI"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">运营部署规模 / 试点对象</label>
                <input
                  type="text"
                  value={productFormData.userCount}
                  onChange={(e) => setProductFormData({ ...productFormData, userCount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  placeholder="例如：目前运行在数个智慧节点上"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-medium hover:bg-[#F3F8FF] hover:text-[#0A66FF] hover:border-[#BFD8FF] active:scale-95 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                className="px-4 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium active:scale-95 cursor-pointer shadow-md shadow-blue-500/10"
              >
                确定保存
              </button>
            </div>
          </motion.div>
        </div>
      )}


      {/* MODAL: 新增/编辑会议 */}
      {isAddMeetingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddMeetingOpen(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-705 rounded-lg transition-all cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 stroke-[2]" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {editingMeetingId ? '编辑会议纪要' : '新增会议决议备案'}
              </h3>
              <p className="text-xs text-slate-500 font-normal">请录入会议研讨及通过的决议信息，用于证明科技企业实质性研发活动</p>
            </div>

            <div className="space-y-3">
              {/* AI Paper-to-Digital Extract Upload Box */}
              <div className="border border-dashed border-slate-200 hover:border-slate-300 bg-slate-50/50 rounded-xl p-3.5 transition-all text-center relative group">
                <input
                  type="file"
                  id="meeting-file-upload"
                  className="hidden"
                  accept=".docx,.pdf,.doc,.txt"
                  onChange={handleFileAndAutoExtract}
                />
                <label htmlFor="meeting-file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-1.5 py-1">
                  {isRecognizing ? (
                    <div className="flex flex-col items-center gap-1.5 py-1">
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] text-slate-500 font-medium">正在 AI 扫描并提取会议要素...</span>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="flex flex-col items-center gap-1">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs text-emerald-700 font-bold tracking-tight">智能导入识别成功！</span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium max-w-[280px] truncate">
                        解析档案: {uploadedFileName}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <Upload className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">上传会议纪要点选解析</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal">支持拖头或选择 .docx / .pdf / .txt 文件，一键识别填充</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">会议名称 / 备案主题 *</label>
                <input
                  type="text"
                  value={meetingFormData.title}
                  onChange={(e) => setMeetingFormData({ ...meetingFormData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  placeholder="例如：智慧数智交付首期可行性技术攻关研讨会"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">会议开展时间与环境</label>
                <input
                  type="text"
                  value={meetingFormData.time}
                  onChange={(e) => setMeetingFormData({ ...meetingFormData, time: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  placeholder="例如：2026-06-01 10:00 - 11:30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">出席/参会人员联名</label>
                <input
                  type="text"
                  value={meetingFormData.attendees}
                  onChange={(e) => setMeetingFormData({ ...meetingFormData, attendees: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs"
                  placeholder="例如：张嘉诚、技术主管、财务合伙人"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">核心研究结论 / 通过决议条款</label>
                <textarea
                  value={meetingFormData.conclusions}
                  rows={4}
                  onChange={(e) => setMeetingFormData({ ...meetingFormData, conclusions: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium outline-none focus:border-slate-900 focus:bg-white transition-all shadow-3xs resize-none"
                  placeholder="例如：1. 评估了国家重点科技项目的可行性配套方案。&#10;2. 财务确认下季度技术自筹开发准备就。..."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddMeetingOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-medium hover:bg-[#F3F8FF] hover:text-[#0A66FF] hover:border-[#BFD8FF] active:scale-95 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveMeeting}
                className="px-4 py-2 bg-[#0A66FF] hover:bg-[#0052D6] text-white rounded-lg text-xs font-medium active:scale-95 cursor-pointer shadow-md shadow-blue-500/10"
              >
                确定保存
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default EnterpriseManagement;

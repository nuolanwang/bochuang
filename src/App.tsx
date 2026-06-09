/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileHeader } from './components/ProfileHeader';
import { UserProfileBanner } from './components/UserProfileBanner';
import { UserProfileForm } from './components/UserProfileForm';
import { GrowthTimeline } from './components/GrowthTimeline';
import { GrowthAnalytics } from './components/GrowthAnalytics';
import { PersonalityRadar } from './components/PersonalityRadar';
import { ProjectWorkspace } from './components/ProjectWorkspace';
import { ProjectFormModal } from './components/ProjectFormModal';
import { NotificationPopover } from './components/NotificationPopover';
import { AssessmentModal } from './components/AssessmentModal';
import { BPManager } from './components/BPManager';
import { BPEditor } from './components/BPEditor';
import { BPSelectionModal } from './components/BPSelectionModal';
import { ProjectDetails } from './components/ProjectDetails';
import { BPPreviewModal } from './components/BPPreviewModal';
import { ArchiveDashboard } from './components/ArchiveDashboard';
import { IntelligenceStation } from './components/IntelligenceStation';
import { CompetitionDetail } from './components/CompetitionDetail';
import { UserProfileMenu } from './components/UserProfileMenu';
import { LoginPage } from './components/LoginPage';
import { OnboardingPage } from './components/OnboardingPage';
import { ProjectModule2 } from './components/ProjectModule2';
import { EnterpriseManagement } from './components/EnterpriseManagement';
import { EnterpriseFormModal } from './components/EnterpriseFormModal';
import { MaterialsLibrary } from './components/MaterialsLibrary';
import { Workstation } from './components/Workstation';
import { MyCollections } from './components/MyCollections';
import { PersonalityData, TimelineEvent, GrowthDataPoint, Project, BusinessPlan } from './types';
import { User, TrendingUp, Search, Bell, Settings, MessageSquare, Briefcase, Calendar, LayoutDashboard, HelpCircle, ChevronDown, RefreshCw, Upload, Globe, Check, X as CloseIcon, FileText, Sparkles, Building2, ShieldAlert, FileCheck, Layers, Award, CalendarDays, Plus, Archive, Bookmark } from 'lucide-react';
import { cn } from './lib/utils';

const PERSONALITY_DATA: PersonalityData[] = [
  { subject: '技术洞察', value: 95, fullMark: 100 },
  { subject: '市场直觉', value: 85, fullMark: 100 },
  { subject: '领导力', value: 90, fullMark: 100 },
  { subject: '风险意识', value: 75, fullMark: 100 },
  { subject: '创新能级', value: 92, fullMark: 100 },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'ev-1',
    date: '2024-03-15',
    title: '高级合伙人认证',
    description: '成功通过博创网（BoChuang）高级合伙人层级考核，具备多项目管理与风控决策权。',
    type: 'certificate',
    icon: 'certificate'
  },
  {
    id: 'ev-2',
    date: '2023-11-20',
    title: '全国大学生创业大赛金奖',
    description: '主导的“AI+分布式算力”项目在万人重围中脱颖而出，获得年度最具创新潜力奖。',
    type: 'award',
    icon: 'award'
  },
  {
    id: 'ev-3',
    date: '2023-06-05',
    title: '首次获得天使轮融资',
    description: '通过Nexus平台对接，成功获得国内顶尖风投机构300万天使轮投资。',
    type: 'milestone',
    icon: 'milestone'
  },
];

const GROWTH_DATA: GrowthDataPoint[] = [
  { date: 'Jan', technical: 65, market: 40, health: 80, aiAdoption: 30, riskControl: 70 },
  { date: 'Feb', technical: 72, market: 48, health: 75, aiAdoption: 45, riskControl: 72 },
  { date: 'Mar', technical: 85, market: 60, health: 85, aiAdoption: 70, riskControl: 85 },
  { date: 'Apr', technical: 92, market: 75, health: 84, aiAdoption: 120, riskControl: 92 },
];

const PROJECTS: Project[] = [
  { id: 'prj-1', name: '智能城市交通管理系统', competition: '2024 全国高校人工智能创新大赛', deadline: '2024-06-20', status: 'pending', bpLink: '#', remainingDays: 2 },
  { id: 'prj-2', name: '智能城市交通管理系统', competition: '2024 全国高校人工智能创新大赛', deadline: '2024-06-20', status: 'pending', bpLink: '#', remainingDays: 2 },
  { id: 'prj-3', name: '智能城市交通管理系统', competition: '2024 全国高校人工智能创新大赛', deadline: '2024-06-20', status: 'pending', bpLink: '#', remainingDays: 2 },
  { id: 'prj-4', name: '智能城市交通管理系统', competition: '2024 全国高校人工智能创新大赛', deadline: '2024-06-20', status: 'reviewing', bpLink: '#', remainingDays: 2 },
  { id: 'prj-5', name: '智能城市交通管理系统', competition: '2024 全国高校人工智能创新大赛', deadline: '2024-06-20', status: 'pending', bpLink: '#', remainingDays: 2 },
  { id: 'prj-6', name: '虚拟现实数字孪生工厂', competition: '工业 4.0 数字化转型竞赛', deadline: '2024-05-30', status: 'pending', bpLink: '#', remainingDays: 2 },
  { id: 'prj-7', name: '绿色能源监控平台', competition: '可持续发展科技创新奖', deadline: '2024-05-15', status: 'pending', bpLink: '#', remainingDays: 2 },
  { id: 'prj-8', name: '绿色能源监控平台', competition: '可持续发展科技创新奖', deadline: '2024-05-15', status: 'completed', bpLink: '#', remainingDays: 2 },
];

const BP_MOCKS: BusinessPlan[] = [
  {
    id: 'bp-1',
    title: '商业计划书1',
    lastModified: '15:21',
    previewText: '以本项目代表了我们下一财年的核心计划...',
    isLinked: true
  },
  {
    id: 'bp-2',
    title: '商业计划书1',
    lastModified: '昨日 10:30',
    previewText: '基于AI算法的城市交通疏导方案...',
    isLinked: false
  }
];

type ViewMode = 'cockpit' | 'intelligence_station' | 'bp_edit' | 'workspace' | 'project_details' | 'competition_detail' | 'project_module_2' | 'enterprise_management' | 'materials_library' | 'workstation' | 'my_collections';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => localStorage.getItem('onboardingCompleted') === 'true');
  const [activeView, setActiveView] = useState<ViewMode>('cockpit');
  const [competitionSourceView, setCompetitionSourceView] = useState<ViewMode>('cockpit');
  const [activeTab, setActiveTab] = useState<'profile' | 'growth'>('growth');
  const [intelligenceDefaultChannel, setIntelligenceDefaultChannel] = useState<string>('all');

  // Missing UI States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<BusinessPlan | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [assessmentInitialStep, setAssessmentInitialStep] = useState<'intro' | 'result'>('intro');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<BusinessPlan | null>(null);
  
  // Reupload Flow states
  const [isReuploadOptionsOpen, setIsReuploadOptionsOpen] = useState(false);
  const [isOnlineBPSelectOpen, setIsOnlineBPSelectOpen] = useState(false);
  
  // Header / Profile menus
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Current active project
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  // Multi-Enterprise Management states
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>('ent-1');
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'products' | 'qualifications' | 'meetings'>('info');
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Lifted state for Multi-Enterprise Management
  const [allEnterprises, setAllEnterprises] = useState<any[]>(() => {
    const cached = localStorage.getItem('all_enterprises_data_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 'ent-1',
        name: '发发大王的AI公司',
        status: 'registered',
        info: {
          companyName: '发发大王的AI公司',
          creditCode: '91110108MA01X9YY8R',
          legalPerson: '张嘉诚',
          registeredCapital: '1500万人民币',
          industry: '人工智能 / 人工智能基础支持',
          scale: '1~50',
          address: '北京市海淀区中关村前沿技术创新中心4层',
          foundedDate: '2020-03-12',
          description: '公司专注于智慧交通中枢管理软件和城市多维数字化空间大数据的全自研算法研发，核心产品已成功赋能多条国家高增幅低碳骨干铁路线及干线航道。'
        },
        products: [
          {
            id: 'prod-1',
            name: 'OmniTraffic 城市级交通自适应疏导平台',
            version: 'v2.4.1',
            techStack: 'PyTorch / Spark / React',
            userCount: '15+ 地级市政大厅',
            status: 'active'
          },
          {
            id: 'prod-2',
            name: 'AILane 智能多模态视觉微秒控制节点',
            version: 'v1.8.0-beta',
            techStack: 'C++ / CUDA / Rust',
            userCount: '3家高新设备厂',
            status: 'beta'
          }
        ],
        qualifications: [
          {
            id: 'qual-1',
            name: '国家级高新技术企业证书',
            issuer: '北京市科学技术委员会',
            expiryDate: '2026-11-20',
            status: 'active',
            remarks: '核心背书资质，享企业税收15%减免优惠。'
          },
          {
            id: 'qual-2',
            name: 'ISO9001 质量管理体系认证 (已过期升级)',
            issuer: '中国质量认证中心',
            expiryDate: '2023-04-15',
            status: 'redundant',
            remarks: '由于2024版本全新管理规范已下发，此版处于资质冗余、失效弃用状态。'
          },
          {
            id: 'qual-3',
            name: '中小型科技企业评定认定',
            issuer: '科技部火炬高技术产业开发中心',
            expiryDate: '2027-02-18',
            status: 'active',
            remarks: '每年可申请研发加计扣除。'
          }
        ],
        meetings: [
          {
            id: 'meet-1',
            title: '1.15 AILane 边缘解算节点首期定调会议',
            time: '2025-01-15 10:00 (线上会议)',
            attendees: '张嘉诚, 研发部王工, 交付组陈经理',
            conclusions: '确认产品AILane将于2025年Q2开展首次闭环路测，并评估国家重点专精特新项目配套的资质提交细则。'
          },
          {
            id: 'meet-2',
            title: '2.22 智慧交通资质冗余与续期审计研讨会',
            time: '2025-02-22 14:30 (主会议室)',
            attendees: '张嘉诚, 法工委李总程, 财务总监林姐',
            conclusions: '对历史过剩的ISO9001过期资质作出冗余资产标记，停止续费，预计本年度以此裁撤不当的差旅支出预算 ￥18,500 元。'
          }
        ]
      },
      {
        id: 'ent-2',
        name: '上海零迹智能设备有限公司',
        status: 'registered',
        info: {
          companyName: '上海零迹智能设备有限公司',
          creditCode: '91310115MA1H7TL35R',
          legalPerson: '刘逸航',
          registeredCapital: '1000万人民币',
          industry: '先进制造 / 自动驾驶',
          scale: '20 - 49人',
          address: '上海市浦东新区张江高科技园区科苑路88号',
          foundedDate: '2021-08-18',
          description: '致力于高精度SLAM室内定位导航设备与工厂无人化配送小车的一体化柔性硬件制造，打通仓储物流的底层物理节点。'
        },
        products: [
          {
            id: 'prod-3',
            name: 'SLAM巡航精控底盘 v3.0',
            version: 'v3.0.0',
            techStack: 'ROS2 / C++ / LiDAR SDK',
            userCount: '12个大型智能仓储中心',
            status: 'active'
          },
          {
            id: 'prod-4',
            name: '零迹无人仓配送集群管理大脑',
            version: 'v1.5.0',
            techStack: 'Go / GRPC / Kubernetes',
            userCount: '5家智能车间试点代表',
            status: 'active'
          }
        ],
        qualifications: [
          {
            id: 'qual-4',
            name: '专精特新“小巨人”企业证书',
            issuer: '上海市经济和信息化委员会',
            expiryDate: '2028-05-10',
            status: 'active',
            remarks: '重磅省级荣誉称号，代表企业在前沿细分产业拥有领导地位。'
          },
          {
            id: 'qual-5',
            name: 'ISO14001 环境管理体系认证书',
            issuer: '中国质量认证中心',
            expiryDate: '2026-09-12',
            status: 'active',
            remarks: '绿色供应链合规必备资质。'
          },
          {
            id: 'qual-6',
            name: '2022上海高技术示范专项 (失效弃展)',
            issuer: '上海市普陀区科委',
            expiryDate: '2022-12-30',
            status: 'redundant',
            remarks: '该示范项目于2022年底结题，处于历史记录状态，属合规诊断中清理出的冗余指标。'
          }
        ],
        meetings: [
          {
            id: 'meet-3',
            title: '3.10 无人配送车底盘稳定性总审纪要',
            time: '2025-03-10 11:30 (研发前沿基地)',
            attendees: '刘逸航, 硬件主管孙工, SLAM算法架构师',
            conclusions: '测试了LiDAR与IMU组合导航在复杂干涉环境下的解算灵敏度，拟将固件发布包标注为v3.0并向用户侧定推升级。'
          },
          {
            id: 'meet-4',
            title: '4.05 SLAM专利技术申报暨资质削损评估会',
            time: '2025-04-05 16:00 (会议室B)',
            attendees: '刘逸航, 知识产权专家',
            conclusions: '评估了在实空间建图领域的3项发明专利与企业资质的挂钩形式，确定了最新提报时间表。'
          }
        ]
      },
      {
        id: 'ent-3',
        name: '深圳深盟航空固态动力研究院',
        status: 'registered',
        info: {
          companyName: '深圳深盟航空固态动力研究院',
          creditCode: '91440300MA5EXY7T2L',
          legalPerson: '李向东',
          registeredCapital: '5000万人民币',
          industry: '先进制造 / 新材料动力',
          scale: '20 - 49人',
          address: '深圳市坪山区金牛东路创新电池研发示范园3楼',
          foundedDate: '2022-05-18',
          description: '专业致力于航空高倍率固态锂电池及高应力软包封装关键核心工艺的研发与先导制备工程。'
        },
        products: [
          {
            id: 'prod-ent3-1',
            name: 'AeroVolt-G600 超高能双极固态航空电池原机',
            version: 'v1.0.5',
            techStack: '固态电解质 / PVDF / 柔性陶瓷纤维',
            userCount: '3家eVTOL大型研发总装厂',
            status: 'active'
          },
          {
            id: 'prod-ent3-2',
            name: 'FlyCell 智能电池热失控云端极低误报预警平台',
            version: 'v0.9.0-beta',
            techStack: 'Python / Flask / Wavelet Transform',
            userCount: '2项民航支线原型论证中',
            status: 'beta'
          }
        ],
        qualifications: [
          {
            id: 'qual-ent3-1',
            name: '重点民用航空动力先锋孵化站认定',
            issuer: '坪山区工信与科技局',
            expiryDate: '2027-12-31',
            status: 'active',
            remarks: '获得低空经济创新联合产业基金重点资助标的。'
          }
        ],
        meetings: [
          {
            id: 'meet-ent3-1',
            title: '5.10 固态软包高应力膨胀拟测定及多孔介质界面合规会议',
            time: '2025-05-10 14:00 (坪山总部圆桌室)',
            attendees: '李向东, 黄博士, 先导流水线组长',
            conclusions: '解决了固态电解质在高应力长循环中晶界开裂的测试方法，准备针对专精特新提报相关专利证明。'
          }
        ]
      },
      {
        id: 'ent-4',
        name: '杭州云极量子计算科技有限公司',
        status: 'registered',
        info: {
          companyName: '杭州云极量子计算科技有限公司',
          creditCode: '91330106MA2H99K86U',
          legalPerson: '赵云极',
          registeredCapital: '2000万人民币',
          industry: '新一代信息技术 / 量子测控',
          scale: '20 - 49人',
          address: '浙江省杭州市西湖科技园量子科技大厦702室',
          foundedDate: '2021-12-05',
          description: '专注超导量子比特精密微波调谐测控仪、变温量子编译器、极低温相干降噪系统等全栈物理硬件与算法底座。'
        },
        products: [
          {
            id: 'prod-ent4-1',
            name: 'CloudGate-Qubit 68比特超导微波相干调谐测控箱',
            version: 'v1.4.0',
            techStack: 'FPGA / RF / Python SDK / C++',
            userCount: '4家高校国家级前沿量子重点实验室',
            status: 'active'
          },
          {
            id: 'prod-ent4-2',
            name: 'Q-Simul 变温非谐量子计算模拟编译器',
            version: 'v2.0-beta',
            techStack: 'Rust / WebAssembly / PyTorch',
            userCount: '2项开源学术集群测试中',
            status: 'beta'
          }
        ],
        qualifications: [
          {
            id: 'qual-ent4-1',
            name: '浙江省前沿量子实验室产业协作常务骨干单位',
            issuer: '浙江省科学技术厅',
            expiryDate: '2028-06-30',
            status: 'active',
            remarks: '超前性产业认定，支持多维量子保密链路底层研发加计扣除。'
          }
        ],
        meetings: [
          {
            id: 'meet-ent4-1',
            title: '4.18 低温液氦稀释制冷微弱谐振信号抗噪算法论证组会',
            time: '2025-04-18 09:30 (杭州前沿研究所)',
            attendees: '赵云极, 钱教授, 控制器研发组',
            conclusions: '设计了数字梳状滤波降噪的测试样机，计划作为今年核心主推的前沿自研产品档案更新。'
          }
        ]
      },
      {
        id: 'ent-5',
        name: '常州极锋精密超硬工具工程中心',
        status: 'registered',
        info: {
          companyName: '常州极锋精密超硬工具工程中心',
          creditCode: '91320411MA2Y9PLX4F',
          legalPerson: '周极锋',
          registeredCapital: '800万人民币',
          industry: '先进制造 / 超硬半导体耗材',
          scale: '20 - 49人',
          address: '常州市新北区河海西路399号超硬工具制造园A5栋',
          foundedDate: '2020-07-28',
          description: '研究超精密多轴加工用多晶金刚石(PCD)刀具、耐磨硬制合金等，满足半导体高端划片工艺急需，实现高精材料国产替代。'
        },
        products: [
          {
            id: 'prod-ent5-1',
            name: 'ApexCrystalline 金刚石超高硬晶半导体划片刀',
            version: 'v4.1.2',
            techStack: 'PCD烧结 / 真空焊接 / 精密微纳研磨',
            userCount: '8家大型半导体封装测试代工厂',
            status: 'active'
          },
          {
            id: 'prod-ent5-2',
            name: 'NanoGlide 多层特种涂层耐磨超精偏心铣切刀柄',
            version: 'v2.2.0',
            techStack: 'TiAlN Coating / 高硬基合金',
            userCount: '3家高端五轴装备配套商',
            status: 'active'
          }
        ],
        qualifications: [
          {
            id: 'qual-ent5-1',
            name: '国家千级高精密材料表面工程试点基地',
            issuer: '中国机械工业联合会',
            expiryDate: '2026-10-15',
            status: 'active',
            remarks: '超硬工具行业资质，对高碳化材料及硅晶圆精密划切起技术领航作用。'
          }
        ],
        meetings: [
          {
            id: 'meet-ent5-1',
            title: '5.22 蓝宝石高硬基片柔弹性偏轴切削工艺应变数据通报会',
            time: '2025-05-22 15:00 (中心第三大会议室)',
            attendees: '周极锋, 材料工程部刘主任, 性能检测组',
            conclusions: '评定了进刀深度与表层微痕损伤的数学对应模型，该参数包将直接打包附属于PCD刀片出厂固件。'
          }
        ]
      },
      {
        id: 'ent-6',
        name: '武汉光速致远激光装备制造有限公司',
        status: 'registered',
        info: {
          companyName: '武汉光速致远激光装备制造有限公司',
          creditCode: '91420100MA3TXF8R5E',
          legalPerson: '吴光速',
          registeredCapital: '1500万人民币',
          industry: '先进制造 / 激光装备',
          scale: '50 - 99人',
          address: '武汉东湖新技术开发区高新二路未来科技城F组团',
          foundedDate: '2019-10-14',
          description: '致力于三维半导体精密剥离皮秒/飞秒工业极快冷激光微精深雕成套装备体系的研发创新和机加控制软件的国产化定制。'
        },
        products: [
          {
            id: 'prod-ent6-1',
            name: 'LaserStrip-3D 紫外激光剥离机组控制软件',
            version: 'v3.2.0',
            techStack: 'C++ / Qt / OpenCV / Real-time Thread',
            userCount: '11家国内面板/车规功率芯片封装厂',
            status: 'active'
          },
          {
            id: 'prod-ent6-2',
            name: 'LightForm 五轴超高快激光微精超导微雕一体系统',
            version: 'v1.6-beta',
            techStack: 'Embedded Linux / Python GUI',
            userCount: '2家大型国防装备试样单位',
            status: 'beta'
          }
        ],
        qualifications: [
          {
            id: 'qual-ent6-1',
            name: '东湖高新区光谷自主创新种子科技小巨人',
            issuer: '武汉东湖新技术开发区管委会',
            expiryDate: '2027-04-12',
            status: 'active',
            remarks: '光电子产业集群明星主体，享受房租及研发补助。'
          }
        ],
        meetings: [
          {
            id: 'meet-ent6-1',
            title: '4.29 大功率短波长冷激光加工形貌残余热应力评估发布会',
            time: '2025-04-29 11:00 (激光工程部报告厅)',
            attendees: '吴光速, 激光理论专家, 控制算法组长',
            conclusions: '确定了超快紫外波段在12nm薄膜上的烧蚀形貌无损微观检测标准，该流程已写入控制软件后台模块。'
          }
        ]
      },
      {
        id: 'ent-7',
        name: '成都微纳晶圆半导体系统有限公司',
        status: 'registered',
        info: {
          companyName: '成都微纳晶圆半导体系统有限公司',
          creditCode: '91510100MA6H2WK8XY',
          legalPerson: '孙微纳',
          registeredCapital: '3000万人民币',
          industry: '新一代信息技术 / 射频半导体',
          scale: '20 - 49人',
          address: '成都高新区天府大道北段1480号高新高新孵化大厦C座',
          foundedDate: '2022-02-20',
          description: '专业研制第三代氮化镓(GaN)基高功率密度及低噪声射频遥测前端自研芯片及双路收发一体封装微型雷达组网系统。'
        },
        products: [
          {
            id: 'prod-ent7-1',
            name: 'WaveCore GaN射频微波大功率无线遥测组件',
            version: 'v1.0.8',
            techStack: '氮化镓外延 / 宽禁带射频微组装 / C++ Sdk',
            userCount: '6家卫星遥感及空天通信联合研制组',
            status: 'active'
          },
          {
            id: 'prod-ent7-2',
            name: 'VoxelGaN 精密低噪声射频多芯片三通道收发前置放大模块',
            version: 'v0.9.5-beta',
            techStack: 'GaAs/GaN混合工艺 / 多芯片组装',
            userCount: '3个5G毫米波示范基底正在评测',
            status: 'beta'
          }
        ],
        qualifications: [
          {
            id: 'qual-ent7-1',
            name: '四川省集成电路前瞻射频元技术优秀技术转移标定',
            issuer: '四川省科学技术厅 / 省工信厅',
            expiryDate: '2028-11-20',
            status: 'active',
            remarks: '大功率宽禁带半导体优秀资质认定，利于申请产业特大无偿周转金。'
          }
        ],
        meetings: [
          {
            id: 'meet-ent7-1',
            title: '4.02 GaN单片及系统级气孔率X-ray合规合机质检研讨',
            time: '2025-04-02 14:30 (成都天府软甲外包基地5层)',
            attendees: '孙微纳, 封测总工, 军工合规审计主管',
            conclusions: '针对焊料空洞率开展红外热阻与X-ray二维穿透对比诊断，升级自研固件中的安全警报容忍门限。'
          }
        ]
      },
      {
        id: 'ent-8',
        name: '广州脉象智能生命信息科技中心',
        status: 'registered',
        info: {
          companyName: '广州脉象智能生命信息科技中心',
          creditCode: '91440101MA3WXKYD4G',
          legalPerson: '陈脉象',
          registeredCapital: '500万人民币',
          industry: '生物医药 / 智能可穿戴代谢监测',
          scale: '25人以下',
          address: '广州市天河区五山科技路102号华工前沿产业加速孵化港',
          foundedDate: '2021-06-15',
          description: '致力于研制利用微多光谱生物特征传感、人体皮下间质液微差测算算法对葡萄糖代谢等生化特征实现无创高精度的连续在线数字健康管理仪。'
        },
        products: [
          {
            id: 'prod-ent8-1',
            name: 'GlycoPulse 柔性多光谐感无创连续血糖皮下组织监测穿戴仪',
            version: 'v2.1.0',
            techStack: 'Multispectral Sensor / ESP32-LowPower / BLE 5.3',
            userCount: '2500+ 名先导内测注册志愿者临床体验',
            status: 'active'
          },
          {
            id: 'prod-ent8-2',
            name: 'MetabolicData 个人基础代谢特征AI关联自研演化多维引擎',
            version: 'v1.1-beta',
            techStack: 'Python / XGBoost / PyTorch / iOS CoreML',
            userCount: '智能穿戴APP首期活跃尝鲜池',
            status: 'beta'
          }
        ],
        qualifications: [
          {
            id: 'qual-ent8-1',
            name: '大湾区医疗科技绿色通道创新器械先导诊断权',
            issuer: '广东省药品监督管理局 / 粤港合作产业委',
            expiryDate: '2027-09-18',
            status: 'active',
            remarks: '极大缩短了无创血糖仪申请国家药监局两类医疗器械注册许可证的过审与排队时长。'
          }
        ],
        meetings: [
          {
            id: 'meet-ent8-1',
            title: '5.12 动态糖基特征光谱标定及第二类数字医疗器械合规研判会',
            time: '2025-05-12 16:00 (广州加速孵化中心大堂B区)',
            attendees: '陈脉象, 中山医科大学特约技术顾问, 光电传感总监',
            conclusions: '通过了第二批20名不同肤色和基础代谢系数测试人员的标定算法测试，证实光电法信噪比满足设计规范要求。'
          }
        ]
      }
    ];
  });

  const [projectsList, setProjectsList] = useState<Project[]>(() => {
    const cached = localStorage.getItem('projects_list_v2');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('projects_list_v2', JSON.stringify(projectsList));
  }, [projectsList]);

  const [bpPlans, setBpPlans] = useState<BusinessPlan[]>(() => {
    const cached = localStorage.getItem('bp_plans_v2');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return BP_MOCKS;
  });

  useEffect(() => {
    localStorage.setItem('bp_plans_v2', JSON.stringify(bpPlans));
  }, [bpPlans]);

  useEffect(() => {
    localStorage.setItem('all_enterprises_data_v2', JSON.stringify(allEnterprises));
  }, [allEnterprises]);

  const handleEditProjectBP = (project: Project) => {
    let matchedPlan = bpPlans.find(plan => 
      plan.title === `${project.name}商业计划书` || 
      plan.title === project.name ||
      plan.id === `bp-${project.id}`
    );

    if (!matchedPlan) {
      matchedPlan = {
        id: `bp-${project.id}-${Date.now()}`,
        title: `${project.name}商业计划书`,
        lastModified: '刚刚',
        previewText: `针对「${project.name}」的最新BP在线编辑草稿...`,
        isLinked: true
      };
      setBpPlans(prev => [matchedPlan!, ...prev]);
    }

    setCurrentPlan(matchedPlan);
    setIsEditorOpen(true);
    setActiveView('bp_edit');
  };

  const handleCopyProject = (project: Project) => {
    const nextId = `prj-${Date.now()}`;
    const newProject: Project = {
      ...project,
      id: nextId,
      name: `${project.name} - 副本`,
      status: 'draft',
      remainingDays: project.remainingDays || 2
    };
    setProjectsList(prev => [...prev, newProject]);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectsList(prev => prev.filter(p => p.id !== project.id));
  };

  const handlePreviewBP = (plan: BusinessPlan) => {
    setPreviewPlan(plan);
    setIsPreviewOpen(true);
  };

  const handleRegisterQuick = () => {
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleReuploadOnline = () => {
    setIsReuploadOptionsOpen(false);
    setIsOnlineBPSelectOpen(true);
  };

  const handleReuploadLocal = () => {
    setIsReuploadOptionsOpen(false);
    setIsProjectModalOpen(true); // Re-use the existing form for local upload
  };

  const handleCreateBP = () => {
    setCurrentPlan(null);
    setIsEditorOpen(true);
  };

  const handleEditBP = (plan: BusinessPlan) => {
    setCurrentPlan(plan);
    setIsEditorOpen(true);
    setActiveView('bp_edit');
  };

  const handleCreateProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setCurrentProject(project);
    setActiveView('project_details');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col lg:flex-row relative overflow-x-hidden antialiased text-[#1f2937]"
      style={{
        background: 'radial-gradient(circle at 45% 48%, rgba(192, 224, 255, 0.7) 0%, rgba(214, 218, 255, 0.6) 28%, rgba(255, 255, 255, 0.85) 65%, rgba(255, 255, 255, 1) 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <AnimatePresence>
        {!onboardingCompleted && (
          <OnboardingPage onComplete={() => setOnboardingCompleted(true)} />
        )}
        {isProjectModalOpen && (
          <ProjectFormModal 
            key="project-modal"
            isOpen={isProjectModalOpen} 
            onClose={() => setIsProjectModalOpen(false)} 
            onlinePlans={bpPlans}
          />
        )}
        {isEditorOpen && (
          <BPEditor 
            key="bp-editor"
            plan={currentPlan} 
            onClose={() => setIsEditorOpen(false)} 
          />
        )}
        {isAssessmentOpen && (
          <AssessmentModal 
            key="assessment-modal"
            isOpen={isAssessmentOpen} 
            initialStep={assessmentInitialStep}
            onClose={() => setIsAssessmentOpen(false)} 
          />
        )}
        <BPPreviewModal 
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewPlan(null);
          }}
          plan={previewPlan}
        />

        {/* Reupload Flow Modals */}
        <ReuploadOptionsModal 
          key="reupload-options"
          isOpen={isReuploadOptionsOpen} 
          onClose={() => setIsReuploadOptionsOpen(false)} 
          onLocal={handleReuploadLocal}
          onOnline={handleReuploadOnline}
        />

        <BPSelectionModal 
          key="online-bp-select"
          isOpen={isOnlineBPSelectOpen} 
          onClose={() => setIsOnlineBPSelectOpen(false)} 
          plans={bpPlans}
          onSelect={(plan) => {
            console.log('Selected plan for reupload:', plan);
            setIsOnlineBPSelectOpen(false);
            // In a real app, logic to associate this BP with the project would go here
          }}
        />
      </AnimatePresence>

      <AnimatePresence>
        {activeView === 'competition_detail' && (
          <CompetitionDetail 
            onBack={() => setActiveView(competitionSourceView)} 
            onRegisterOfficial={() => setIsProjectModalOpen(true)}
            onRegisterQuick={handleRegisterQuick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[2000] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span>报名成功！</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar - Desktop only */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white/30 backdrop-blur-md border-r border-slate-200/40 p-6 shrink-0 z-30 overflow-y-auto">
        {/* Logo Brand section */}
        <div className="flex items-center gap-3 mb-8 shrink-0">
          <div className="w-12 h-12 relative bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg group cursor-pointer overflow-hidden border border-slate-100 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="w-full h-full bg-[#0045c4] rounded-xl flex items-center justify-center">
              <span className="text-white font-black italic text-lg tracking-tighter">B</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight leading-none text-slate-800">博创网</span>
            <span className="text-[8px] text-[#0045c4] font-black uppercase tracking-wider block mt-1">AI Cockpit</span>
          </div>
        </div>

        {/* Taskbar Navigation menu stacked vertically */}
        <div className="flex-1 flex flex-col gap-1.5 p-1.5 bg-slate-100/85 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-y-auto select-none">
          <button 
            onClick={() => {
              setActiveView('cockpit');
              setActiveTab('profile');
            }}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer text-left",
              activeView === 'cockpit' && activeTab === 'profile'
                ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <User className="w-4 h-4 text-[#0045c4]" />
            <span>个人档案</span>
          </button>

          <button 
            onClick={() => {
              setActiveView('cockpit');
              setActiveTab('growth');
            }}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer text-left",
              activeView === 'cockpit' && activeTab === 'growth'
                ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <TrendingUp className="w-4 h-4 text-[#0045c4]" />
            <span>资源推荐</span>
          </button>

          <button 
            onClick={() => setActiveView('workstation')}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer text-left",
              activeView === 'workstation' 
                ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                : "text-slate-600 hover:text-[#0045c4] hover:bg-white/40"
            )}
          >
            <Sparkles className="w-4 h-4 text-[#0045c4] animate-pulse" />
            <span>AI 工作台</span>
          </button>

          <button 
            onClick={() => setActiveView('workspace')}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer text-left",
              activeView === 'workspace' 
                ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <Briefcase className="w-4 h-4 text-slate-600" />
            <span>项目管理</span>
          </button>

          <button 
            onClick={() => setActiveView('bp_edit')}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer text-left",
              activeView === 'bp_edit' 
                ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>在线编辑BP</span>
          </button>

          <button 
            onClick={() => setActiveView('enterprise_management')}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer text-left",
              activeView === 'enterprise_management' 
                ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <Building2 className="w-4 h-4 text-[#0045c4]" />
            <span>企业管理</span>
          </button>

          <button 
            onClick={() => setActiveView('project_module_2')}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer group/item text-left",
              activeView === 'project_module_2' 
                ? "bg-white text-amber-650 shadow-sm font-black border border-amber-100" 
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-amber-500 group-hover/item:scale-110 transition-transform shrink-0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 3.93 3H2a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" fill="currentColor" fillOpacity="0.15" />
            </svg>
            <span>项目模块2</span>
          </button>

          <button 
            onClick={() => setActiveView('materials_library')}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer group/item text-left",
              activeView === 'materials_library' 
                ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                : "text-slate-600 hover:text-[#0045c4] hover:bg-white/40"
            )}
          >
            <Archive className="w-4 h-4 text-slate-650 group-hover/item:text-[#0045c4]" />
            <span>我的材料库</span>
          </button>

          <button 
            onClick={() => setActiveView('my_collections')}
            className={cn(
              "w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer group/item text-left",
              activeView === 'my_collections' 
                ? "bg-white text-rose-600 shadow-sm font-black border border-rose-100" 
                : "text-slate-600 hover:text-[#0045c4] hover:bg-white/40"
            )}
          >
            <Bookmark className="w-4 h-4 text-rose-500 group-hover/item:scale-115 transition-transform text-rose-500" />
            <span>我的收藏</span>
          </button>
        </div>
      </aside>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0 flex flex-col relative lg:overflow-x-visible">
        {/* Main Top Section (Header + Profile) */}
        <div className={cn("relative bg-transparent transition-all duration-300", activeView === 'cockpit' ? "pb-12" : "pb-4")}>
          <nav className="flex items-center justify-between p-4 px-8 text-slate-800 w-full animate-fade-in animate-once">
            {/* Logo Brand section - Shown only on mobile/tablet */}
            <div className="flex lg:hidden items-center gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 relative bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg group cursor-pointer overflow-hidden border border-slate-100">
                          <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                          <div className="w-full h-full bg-[#0045c4] rounded-xl flex items-center justify-center">
                             <span className="text-white font-black italic text-xl tracking-tighter">B</span>
                          </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-2xl tracking-tight leading-none text-slate-800">博创网</span>
                        <span className="text-[9px] text-[#0045c4] font-black uppercase tracking-wider block mt-1">AI Cockpit</span>
                    </div>
                </div>
            </div>

            {/* Central Navigation - Traditional SaaS style on Mobile Fallback */}
            <div className="flex lg:hidden items-center gap-1 p-1 bg-slate-100/85 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm max-w-[55%] xl:max-w-none overflow-x-auto scrollbar-none">
              <button 
                onClick={() => {
                  setActiveView('cockpit');
                  setActiveTab('profile');
                }}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap",
                  activeView === 'cockpit' && activeTab === 'profile'
                    ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                )}
              >
                <User className="w-4 h-4 text-[#0045c4]" />
                <span>个人档案</span>
              </button>

              <button 
                onClick={() => {
                  setActiveView('cockpit');
                  setActiveTab('growth');
                }}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap",
                  activeView === 'cockpit' && activeTab === 'growth'
                    ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                )}
              >
                <TrendingUp className="w-4 h-4 text-[#0045c4]" />
                <span>资源推荐</span>
              </button>

              <button 
                onClick={() => setActiveView('workstation')}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap",
                  activeView === 'workstation' 
                    ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                    : "text-slate-600 hover:text-[#0045c4] hover:bg-white/40"
                )}
              >
                <Sparkles className="w-4 h-4 text-[#0045c4] animate-pulse" />
                <span>AI 工作台</span>
              </button>


              <button 
                onClick={() => setActiveView('workspace')}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap",
                  activeView === 'workspace' 
                    ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                )}
              >
                <Briefcase className="w-4 h-4 text-slate-600" />
                <span>项目管理</span>
              </button>

              <button 
                onClick={() => setActiveView('bp_edit')}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap",
                  activeView === 'bp_edit' 
                    ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                )}
              >
                <FileText className="w-4 h-4 text-slate-600" />
                <span>在线编辑BP</span>
              </button>

              <button 
                onClick={() => setActiveView('enterprise_management')}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap",
                  activeView === 'enterprise_management' 
                    ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                )}
              >
                <Building2 className="w-4 h-4 text-[#0045c4]" />
                <span>企业管理</span>
              </button>

              <button 
                onClick={() => setActiveView('project_module_2')}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap group/item",
                  activeView === 'project_module_2' 
                    ? "bg-white text-amber-650 shadow-sm font-black border border-amber-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                )}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-amber-500 group-hover/item:scale-110 transition-transform" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 3.93 3H2a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" fill="currentColor" fillOpacity="0.15" />
                </svg>
                <span>项目模块2</span>
              </button>

              <button 
                onClick={() => setActiveView('materials_library')}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap group/item",
                  activeView === 'materials_library' 
                    ? "bg-white text-[#0045c4] shadow-sm font-black border border-slate-100" 
                    : "text-slate-600 hover:text-[#0045c4] hover:bg-white/40"
                )}
              >
                <Archive className="w-4 h-4 text-slate-650 group-hover/item:text-[#0045c4]" />
                <span>我的材料库</span>
              </button>

              <button 
                onClick={() => setActiveView('my_collections')}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-250 active:scale-95 cursor-pointer whitespace-nowrap group/item",
                  activeView === 'my_collections' 
                    ? "bg-white text-rose-600 shadow-sm font-black border border-rose-100" 
                    : "text-slate-600 hover:text-[#0045c4] hover:bg-white/40"
                )}
              >
                <Bookmark className="w-4 h-4 text-rose-500 group-hover/item:scale-115 transition-transform" />
                <span>我的收藏</span>
              </button>
            </div>
            
            {/* Right end utilities (Notification and User Profile Menu) */}
            <div className="flex items-center gap-8 shrink-0 lg:ml-auto">
                <div className="flex items-center gap-6 relative">
                    <div className="relative">
                      <Bell 
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="w-5 h-5 cursor-pointer text-slate-700 hover:opacity-80 transition-opacity" 
                      />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                      
                      <AnimatePresence>
                        {isNotificationOpen && (
                          <NotificationPopover isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200 relative">
                      <div 
                        className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0045c4] to-[#0A66FF] flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-all select-none font-sans"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      >
                        王
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-500 cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
                      
                      <AnimatePresence>
                        {isProfileMenuOpen && (
                          <UserProfileMenu 
                            isOpen={isProfileMenuOpen} 
                            onClose={() => setIsProfileMenuOpen(false)} 
                            onLogout={() => {
                              localStorage.setItem('isLoggedIn', 'false');
                              localStorage.setItem('onboardingCompleted', 'false');
                              setIsLoggedIn(false);
                              setOnboardingCompleted(false);
                              setIsProfileMenuOpen(false);
                            }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                </div>
            </div>
          </nav>

          {/* Display UserProfileBanner with integrated horizontal navigation bar on ALL views */}
          <div className="max-w-[1800px] mx-auto px-8 w-full mt-4 md:mt-12">
            <UserProfileBanner 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                if (activeView !== 'cockpit') {
                  setActiveView('cockpit');
                }
              }}
              onNotificationsClick={() => setIsNotificationOpen(!isNotificationOpen)}
              onCollectionsClick={() => {
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 2000);
              }}
              onCompleteProfileClick={() => {
                setAssessmentInitialStep('intro');
                setIsAssessmentOpen(true);
              }}
              onViewAssessmentResultClick={() => {
                setAssessmentInitialStep('result');
                setIsAssessmentOpen(true);
              }}
              onSyncProfileClick={() => {
                setActiveTab('profile');
                if (activeView !== 'cockpit') {
                  setActiveView('cockpit');
                }
                setTimeout(() => {
                  const uploaderEl = document.getElementById('resume-uploader-section');
                  if (uploaderEl) {
                    uploaderEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
              activeView={activeView}
            />
          </div>
        </div>

      <div className="flex-1 px-8 relative z-10 max-w-[1800px] mx-auto w-full">
        <div className={cn(activeView === 'cockpit' ? "mt-3" : "mt-8")}>
            {/* Content Body takes full horizontal width */}
            <main className="w-full min-h-[600px] pb-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                            "min-h-full transition-all duration-300",
                            (activeView === 'cockpit' || activeView === 'workstation')
                                ? "bg-transparent p-0 border-none shadow-none space-y-10" 
                                : "bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-8"
                        )}
                    >



                        {activeView === 'cockpit' && (
                            activeTab === 'profile' ? (
                                <UserProfileForm />
                            ) : (
                                <ArchiveDashboard 
                                    timelineEvents={TIMELINE_EVENTS}
                                    growthData={GROWTH_DATA}
                                    personalityData={PERSONALITY_DATA}
                                    onStartAssessment={() => setIsAssessmentOpen(true)}
                                    onRegisterCompetition={() => {
                                        setCompetitionSourceView('cockpit');
                                        setActiveView('competition_detail');
                                    }}
                                    onGoToBPEdit={() => setActiveView('bp_edit')}
                                    onGoToIntelligenceStation={(category) => {
                                        if (category) {
                                            setIntelligenceDefaultChannel(category);
                                        } else {
                                            setIntelligenceDefaultChannel('all');
                                        }
                                        setActiveView('intelligence_station');
                                    }}
                                    activeHeaderTab={activeTab}
                                />
                            )
                        )}

                        {activeView === 'intelligence_station' && (
                            <IntelligenceStation 
                                projects={projectsList}
                                defaultChannel={intelligenceDefaultChannel as any}
                                onRegisterCompetition={() => {
                                    setCompetitionSourceView('intelligence_station');
                                    setActiveView('competition_detail');
                                }}
                            />
                        )}

                                



                        {activeView === 'workspace' && (
                            <div className="space-y-8">
                                <section>
          <div className="flex items-center mb-6">
                                     <h2 className="text-xl font-bold text-slate-800">项目管理</h2>
                                  </div>
                                  <ProjectWorkspace 
                                    projects={projectsList} 
                                    onCreateNew={handleCreateProject}
                                    onViewDetails={handleViewProject}
                                    onViewCompetition={() => {
                                        setCompetitionSourceView('workspace');
                                        setActiveView('competition_detail');
                                    }}
                                    onEditProjectBP={handleEditProjectBP}
                                    onCopyProject={handleCopyProject}
                                    onDeleteProject={handleDeleteProject}
                                  />
                                </section>
                            </div>
                        )}

                        {activeView === 'project_details' && currentProject && (
                            <ProjectDetails 
                                project={currentProject} 
                                onBack={() => setActiveView('workspace')}
                                onEditBP={handleEditBP}
                                onReupload={() => setIsReuploadOptionsOpen(true)}
                            />
                        )}

                        {activeView === 'bp_edit' && (
                            <BPManager 
                              plans={bpPlans} 
                               onCreateNew={handleCreateBP}
                              onEdit={handleEditBP}
                              onPreview={handlePreviewBP}
                            />
                        )}

                        {activeView === 'project_module_2' && (
                            <ProjectModule2 />
                        )}

                        {activeView === 'enterprise_management' && (
                            <EnterpriseManagement 
                                allEnterprises={allEnterprises}
                                setAllEnterprises={setAllEnterprises}
                                selectedId={selectedEnterpriseId}
                                setSelectedId={setSelectedEnterpriseId}
                                activeSubTab={activeSubTab}
                                setActiveSubTab={setActiveSubTab}
                                onAddEnterprise={() => setIsEnterpriseModalOpen(true)}
                            />
                        )}

                        {activeView === 'materials_library' && (
                            <MaterialsLibrary />
                        )}

                        {activeView === 'workstation' && (
                            <Workstation />
                        )}

                        {activeView === 'my_collections' && (
                            <MyCollections />
                        )}
                    </motion.div>
                </AnimatePresence>

            </main>
        </div>
      </div>
    </div>

      <EnterpriseFormModal
        isOpen={isEnterpriseModalOpen}
        onClose={() => setIsEnterpriseModalOpen(false)}
        onSave={(newEnt) => {
          setAllEnterprises(prev => [newEnt, ...prev]);
          setSelectedEnterpriseId(newEnt.id);
        }}
      />

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-2xl glow-blue z-50 overflow-hidden"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

// --- Reupload Flow Components ---

interface ReuploadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocal: () => void;
  onOnline: () => void;
}

const ReuploadOptionsModal: React.FC<ReuploadOptionsModalProps> = ({ isOpen, onClose, onLocal, onOnline }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
        >
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-lg font-bold text-slate-800">重新上传</h3>
            <p className="text-sm text-slate-400">请选择您的 BP 来源</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={onLocal}
              className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-brand-blue/30 hover:bg-white transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">本地文件上传</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Device</p>
              </div>
            </button>
            <button 
              onClick={onOnline}
              className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-brand-blue/30 hover:bg-white transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">在线 BP 选择</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cloud Space</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);


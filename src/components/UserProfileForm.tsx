import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  Plus, 
  Trash2, 
  Upload, 
  Sparkles, 
  Check, 
  Save, 
  FileText, 
  Heart,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// Interfaces for our repeatable lists
interface EduExperience {
  id: string;
  duration: string;     // 起止时间
  school: string;       // 学校
  degree: string;       // 学历层次
  major: string;        // 专业
}

interface WorkExperience {
  id: string;
  duration: string;     // 起止时间
  company: string;      // 工作单位
  position: string;     // 担任职务
  experienceLength: string; // 担任时长
}

interface ProjectExperience {
  id: string;
  duration: string;     // 起止时间
  position: string;     // 担任职务
  achievements: string; // 取得成果
}

interface BasicInfo {
  name: string;
  gender: string;
  phone: string;
  email: string;
  university: string;
  gradDate: string;
  nativePlace: string;
  marriage: string;
}

export const UserProfileForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeName, setResumeName] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'warning' | 'info'; msg: string } | null>(null);

  const showToastMsg = (msg: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initial dummy state or localStorage load
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(() => {
    const cached = localStorage.getItem('user_profile_basic');
    if (cached) return JSON.parse(cached);
    return {
      name: '张嘉诚',
      gender: '男',
      phone: '13888292024',
      email: 'jiacheng.zhang@nexus-cap.com',
      university: '北京大学',
      gradDate: '2020-07-01',
      nativePlace: '浙江杭州',
      marriage: '未婚'
    };
  });

  const [eduList, setEduList] = useState<EduExperience[]>(() => {
    const cached = localStorage.getItem('user_profile_edu');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'edu-1',
        duration: '2016.09 - 2020.07',
        school: '北京大学',
        degree: '硕士研究生',
        major: '人工智能与智能控制'
      }
    ];
  });

  const [workList, setWorkList] = useState<WorkExperience[]>(() => {
    const cached = localStorage.getItem('user_profile_work');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'work-1',
        duration: '2020.07 - 2023.12',
        company: '北京博创数字科技有限公司',
        position: '风控专家 / 架构合伙人',
        experienceLength: '3年5个月'
      }
    ];
  });

  const [projectList, setProjectList] = useState<ProjectExperience[]>(() => {
    const cached = localStorage.getItem('user_profile_project');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'proj-1',
        duration: '2022.03 - 2023.06',
        position: '项目核心主导人',
        achievements: '主导研发了第二代大模型城市交通仿真中枢，部署至3个地级市，使得通行效率提升22%。'
      }
    ];
  });

  // Keep track of active state
  useEffect(() => {
    const cachedResume = localStorage.getItem('user_profile_resume');
    if (cachedResume) {
      setResumeName(cachedResume);
    }
  }, []);

  // Handle saving to localStorage
  const handleSave = () => {
    localStorage.setItem('user_profile_basic', JSON.stringify(basicInfo));
    localStorage.setItem('user_profile_edu', JSON.stringify(eduList));
    localStorage.setItem('user_profile_work', JSON.stringify(workList));
    localStorage.setItem('user_profile_project', JSON.stringify(projectList));
    if (resumeName) {
      localStorage.setItem('user_profile_resume', resumeName);
    }
    showToastMsg('个人档案已成功安全地存储。', 'success');
  };

  // Upload Resume handler
  const triggerResumeUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeName(file.name);
      localStorage.setItem('user_profile_resume', file.name);
      
      // Also show micro success feedback
      showToastMsg('简历已成功上传并关联。', 'success');
    }
  };

  const removeResume = () => {
    setResumeName('');
    localStorage.removeItem('user_profile_resume');
  };

  // repeatable operations - Education
  const addEdu = () => {
    const newEdu: EduExperience = {
      id: `edu-${Date.now()}`,
      duration: '',
      school: '',
      degree: '本科',
      major: ''
    };
    setEduList([...eduList, newEdu]);
  };

  const updateEdu = (id: string, field: keyof EduExperience, value: string) => {
    setEduList(eduList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteEdu = (id: string) => {
    if (eduList.length <= 1) {
      showToastMsg('请至少保留一条教育经历数据！', 'warning');
      return;
    }
    setEduList(eduList.filter(item => item.id !== id));
  };

  // repeatable operations - Work
  const addWork = () => {
    const newWork: WorkExperience = {
      id: `work-${Date.now()}`,
      duration: '',
      company: '',
      position: '',
      experienceLength: ''
    };
    setWorkList([...workList, newWork]);
  };

  const updateWork = (id: string, field: keyof WorkExperience, value: string) => {
    setWorkList(workList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteWork = (id: string) => {
    if (workList.length <= 1) {
      showToastMsg('请至少保留一条工作经历数据！', 'warning');
      return;
    }
    setWorkList(workList.filter(item => item.id !== id));
  };

  // repeatable operations - Project
  const addProject = () => {
    const newProject: ProjectExperience = {
      id: `proj-${Date.now()}`,
      duration: '',
      position: '',
      achievements: ''
    };
    setProjectList([...projectList, newProject]);
  };

  const updateProject = (id: string, field: keyof ProjectExperience, value: string) => {
    setProjectList(projectList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteProject = (id: string) => {
    if (projectList.length <= 1) {
      showToastMsg('请至少保留一条项目经历数据！', 'warning');
      return;
    }
    setProjectList(projectList.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Dynamic Toast Message */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed bottom-8 right-8 z-[100] px-5 py-3.5 rounded-2xl shadow-[0_12px_32px_rgba(10,102,255,0.12)] flex items-center gap-3 border transition-all duration-300",
              toast.type === 'success' && "bg-white border-[#BFD8FF] text-[#102033]",
              toast.type === 'warning' && "bg-[#FFF9F2] border-[#FFE2C2] text-[#B25E00]",
              toast.type === 'info' && "bg-white border-[#DDE8F5] text-[#102033]"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
              toast.type === 'success' && "bg-[#EAF2FF] text-[#0A66FF]",
              toast.type === 'warning' && "bg-[#FFF0E0] text-[#E58A3C]",
              toast.type === 'info' && "bg-[#F3F8FF] text-[#0A66FF]"
            )}>
              {toast.type === 'warning' ? (
                <span className="text-xs font-bold font-mono">!</span>
              ) : (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </div>
            <div>
              <p className="font-bold text-xs leading-tight">
                {toast.type === 'success' ? '操作成功' : toast.type === 'warning' ? '提示' : '通知'}
              </p>
              <p className="text-[11px] text-[#52657A] font-medium mt-0.5">{toast.msg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input for native select */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.jpg,.png" 
        className="hidden" 
      />

      {/* Header Panel with prompt & Resume Upload Actions */}
      <div id="resume-uploader-section" className="bg-[#F7FAFF] border border-[#DDE8F5] rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-[0_12px_32px_rgba(34,86,160,0.03)] text-left">
        {/* Soft decorative background circles */}
        <div className="absolute top-1/2 left-32 w-48 h-48 bg-[#EAF2FF]/50 rounded-full blur-[80px] -z-10" />
        <div className="absolute -bottom-10 right-10 w-36 h-36 bg-[#EAF2FF]/40 rounded-full blur-[60px] -z-10" />

        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="flex items-center gap-1.2 px-3 py-1 text-[10px] uppercase font-semibold tracking-wider bg-[#EAF2FF] text-[#0A66FF] rounded-full select-none border border-[#BFD8FF]">
              <Sparkles className="w-3 h-3 text-[#0A66FF] fill-current animate-pulse mr-1" />
              智能配对就绪
            </span>
            <span className="text-[10px] font-semibold text-[#52657A] select-none">
              档案状态：已实名审核
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#102033] tracking-tight">个人档案填报</h2>
          <p className="text-xs text-[#52657A] font-semibold leading-relaxed flex items-center justify-center md:justify-start gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#0A66FF]" />
            提示：<span className="text-[#0A66FF] font-semibold">均为非必填</span>、您可<span className="text-[#12A870] font-semibold">随时保存</span>或更新资料。
          </p>
        </div>

        {/* Upload & Save controls wrapper */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto shrink-0">
          {/* Upload Resume Button */}
          <button
            onClick={triggerResumeUpload}
            className="w-full sm:w-auto bg-white hover:bg-[#F3F8FF] text-[#52657A] hover:text-[#102033] active:scale-95 transition-all py-3 px-5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border border-[#DDE8F5] shadow-xs"
          >
            <Upload className="w-4 h-4 text-[#0A66FF]" />
            <span>{resumeName ? '重新上传简历' : '上传本地简历'}</span>
          </button>

          {/* Quick Save Header Action */}
          <button
            onClick={handleSave}
            className="w-full sm:w-auto bg-[#0A66FF] text-white hover:bg-[#0052D6] active:scale-95 transition-all py-3 px-7 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10"
          >
            <Save className="w-4 h-4" />
            保存资料
          </button>
        </div>
      </div>

      {/* Uploaded File Chip Indicator if selected */}
      {resumeName && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#F2FAF5] border border-[#C2EAD2] rounded-2xl p-4 flex items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E2F5E9] text-[#12A870] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#102033] leading-tight">已成功解析本地简历：</p>
              <p className="text-xs text-[#52657A] font-semibold mt-0.5">{resumeName}</p>
            </div>
          </div>
          <button 
            onClick={removeResume}
            className="text-[#52657A] hover:text-rose-600 transition-colors px-3 py-1.5 bg-white hover:bg-rose-50 border border-[#DDE8F5] hover:border-rose-100 rounded-xl text-xs font-semibold cursor-pointer active:scale-95"
          >
            删除
          </button>
        </motion.div>
      )}



      {/* SECTION 1: 基础信息 */}
      <div className="bg-white rounded-[2rem] border border-[#DDE8F5] shadow-[0_12px_32px_rgba(34,86,160,0.06)] p-8 space-y-6 text-left">
        <div className="flex items-center gap-3 border-[#EEF3F8] pb-4 border-b">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#0A66FF] flex items-center justify-center shrink-0">
            <User className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#102033] tracking-tight font-sans">一、基本信息</h3>
            <p className="text-[11px] text-[#52657A] font-semibold mt-0.5">请录入您的真实学研及联系特征</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">姓名</label>
            <input 
              type="text" 
              value={basicInfo.name}
              onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
              placeholder="请输入您的姓名"
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">性别</label>
            <select 
              value={basicInfo.gender}
              onChange={(e) => setBasicInfo({ ...basicInfo, gender: e.target.value })}
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all cursor-pointer"
            >
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="保密">保密</option>
            </select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">联系电话</label>
            <input 
              type="tel" 
              value={basicInfo.phone}
              onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
              placeholder="11位手机号码"
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">电子邮箱</label>
            <input 
              type="email" 
              value={basicInfo.email}
              onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
              placeholder="username@domain.com"
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Graduation School */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">最高毕业院校</label>
            <input 
              type="text" 
              value={basicInfo.university}
              onChange={(e) => setBasicInfo({ ...basicInfo, university: e.target.value })}
              placeholder="例如：北京大学"
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Graduation Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">毕业日期</label>
            <input 
              type="date" 
              value={basicInfo.gradDate}
              onChange={(e) => setBasicInfo({ ...basicInfo, gradDate: e.target.value })}
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all cursor-pointer"
            />
          </div>

          {/* Native Place */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">籍贯省市辖区</label>
            <input 
              type="text" 
              value={basicInfo.nativePlace}
              onChange={(e) => setBasicInfo({ ...basicInfo, nativePlace: e.target.value })}
              placeholder="如浙江杭州"
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#52657A]">婚姻状况</label>
            <select 
              value={basicInfo.marriage}
              onChange={(e) => setBasicInfo({ ...basicInfo, marriage: e.target.value })}
              className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all cursor-pointer"
            >
              <option value="未婚">未婚</option>
              <option value="已婚">已婚</option>
              <option value="保密">保密</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: 教育经历 */}
      <div className="bg-white rounded-[2rem] border border-[#DDE8F5] shadow-[0_12px_32px_rgba(34,86,160,0.06)] p-8 space-y-6 text-left">
        <div className="flex items-center justify-between border-[#EEF3F8] pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#0A66FF] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#102033] tracking-tight">二、教育经历</h3>
              <p className="text-[11px] text-[#52657A] font-semibold mt-0.5">记录自本科开始的学识提升、专业历练</p>
            </div>
          </div>
          <button
            onClick={addEdu}
            className="flex items-center gap-1.5 bg-[#EAF2FF] hover:bg-[#D0E2FF] text-[#0A66FF] transition-all font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#0A66FF]" />
            增教育经历
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {eduList.map((edu, index) => (
              <motion.div 
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 bg-[#FBFDFF] rounded-2xl border border-[#EEF3F8] relative group/card hover:bg-white hover:border-[#BFD8FF] hover:shadow-[0_12px_24px_rgba(34,86,160,0.04)] transition-all"
              >
                {/* Delete button positioned at top corners */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400/80">
                    历练栏 #{index + 1}
                  </span>
                  {eduList.length > 1 && (
                    <button
                      onClick={() => deleteEdu(edu.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors pointer-events-auto cursor-pointer"
                      title="删除此教育经历"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                  {/* 起止时间 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">起止时间</label>
                    <input 
                      type="text" 
                      value={edu.duration}
                      onChange={(e) => updateEdu(edu.id, 'duration', e.target.value)}
                      placeholder="如 2016.09 - 2020.07"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* 学校 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">学校</label>
                    <input 
                      type="text" 
                      value={edu.school}
                      onChange={(e) => updateEdu(edu.id, 'school', e.target.value)}
                      placeholder="输入就读院校"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* 学历层次 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">学历层次</label>
                    <select 
                      value={edu.degree}
                      onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)}
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all cursor-pointer"
                    >
                      <option value="大专">大专</option>
                      <option value="本科">本科</option>
                      <option value="硕士研究生">硕士研究生</option>
                      <option value="博士研究生">博士研究生</option>
                      <option value="博士后">博士后</option>
                    </select>
                  </div>

                  {/* 专业 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">专业</label>
                    <input 
                      type="text" 
                      value={edu.major}
                      onChange={(e) => updateEdu(edu.id, 'major', e.target.value)}
                      placeholder="就读专业名称"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 3: 工作经历 */}
      <div className="bg-white rounded-[2rem] border border-[#DDE8F5] shadow-[0_12px_32px_rgba(34,86,160,0.06)] p-8 space-y-6 text-left">
        <div className="flex items-center justify-between border-[#EEF3F8] pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#0A66FF] flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#102033] tracking-tight">三、工作经历</h3>
              <p className="text-[11px] text-[#52657A] font-semibold mt-0.5">记录您所服务过的单位及核心管理经验</p>
            </div>
          </div>
          <button
            onClick={addWork}
            className="flex items-center gap-1.5 bg-[#EAF2FF] hover:bg-[#D0E2FF] text-[#0A66FF] transition-all font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#0A66FF]" />
            增工作经历
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {workList.map((work, index) => (
              <motion.div 
                key={work.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 bg-[#FBFDFF] rounded-2xl border border-[#EEF3F8] relative group/card hover:bg-white hover:border-[#BFD8FF] hover:shadow-[0_12px_24px_rgba(34,86,160,0.04)] transition-all"
              >
                {/* Delete button */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400/80">
                    岗位栏 #{index + 1}
                  </span>
                  {workList.length > 1 && (
                    <button
                      onClick={() => deleteWork(work.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors pointer-events-auto cursor-pointer"
                      title="删除此工作经历"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                  {/* 起止时间 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">起止时间</label>
                    <input 
                      type="text" 
                      value={work.duration}
                      onChange={(e) => updateWork(work.id, 'duration', e.target.value)}
                      placeholder="如 2020.07 - 2023.12"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* 工作单位 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">工作单位</label>
                    <input 
                      type="text" 
                      value={work.company}
                      onChange={(e) => updateWork(work.id, 'company', e.target.value)}
                      placeholder="就职公司/机构名称"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* 担任职务 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">担任职务</label>
                    <input 
                      type="text" 
                      value={work.position}
                      onChange={(e) => updateWork(work.id, 'position', e.target.value)}
                      placeholder="担任岗位/职务名称"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* 担任时长 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">担任时长</label>
                    <input 
                      type="text" 
                      value={work.experienceLength}
                      onChange={(e) => updateWork(work.id, 'experienceLength', e.target.value)}
                      placeholder="如 3年5个月"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 4: 项目经历 */}
      <div className="bg-white rounded-[2rem] border border-[#DDE8F5] shadow-[0_12px_32px_rgba(34,86,160,0.06)] p-8 space-y-6 text-left">
        <div className="flex items-center justify-between border-[#EEF3F8] pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#0A66FF] flex items-center justify-center shrink-0">
              <FolderGit2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#102033] tracking-tight">四、项目经历</h3>
              <p className="text-[11px] text-[#52657A] font-semibold mt-0.5">请录入您过往核心攻坚、独立攻防、创业实践项目点滴</p>
            </div>
          </div>
          <button
            onClick={addProject}
            className="flex items-center gap-1.5 bg-[#EAF2FF] hover:bg-[#D0E2FF] text-[#0A66FF] transition-all font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#0A66FF]" />
            增项目经历
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {projectList.map((proj, index) => (
              <motion.div 
                key={proj.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 bg-[#FBFDFF] rounded-2xl border border-[#EEF3F8] relative group/card hover:bg-white hover:border-[#BFD8FF] hover:shadow-[0_12px_24px_rgba(34,86,160,0.04)] transition-all"
              >
                {/* Delete button */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400/80">
                    攻坚项目 #{index + 1}
                  </span>
                  {projectList.length > 1 && (
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors pointer-events-auto cursor-pointer"
                      title="删除此项目经历"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  {/* 起止时间 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">起止时间</label>
                    <input 
                      type="text" 
                      value={proj.duration}
                      onChange={(e) => updateProject(proj.id, 'duration', e.target.value)}
                      placeholder="如 2022.03 - 2023.06"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* 担任职务 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#52657A]">担任职务</label>
                    <input 
                      type="text" 
                      value={proj.position}
                      onChange={(e) => updateProject(proj.id, 'position', e.target.value)}
                      placeholder="如 核心技术负责人"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* 取得成果 */}
                  <div className="space-y-2 col-span-1 md:col-span-3">
                    <label className="text-xs font-semibold text-[#52657A]">取得成果 / 主要内容</label>
                    <textarea 
                      value={proj.achievements}
                      onChange={(e) => updateProject(proj.id, 'achievements', e.target.value)}
                      rows={3}
                      placeholder="请重点量化说明主要职责、战法提炼、获得的业绩等"
                      className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all resize-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER SAVE ACTIONS */}
      <div className="p-8 bg-[#F7FAFF] border border-[#DDE8F5] rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_12px_32px_rgba(34,86,160,0.03)] text-left">
        <p className="text-xs text-[#52657A] font-medium text-center md:text-left select-none leading-relaxed max-w-2xl">
          您的填报信息将由 Nexus-Network 进行符合最高合规等级的安全非对称加密，保障个人隐私权。
        </p>
        <div className="flex gap-4 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={handleSave}
            className="w-full md:w-auto bg-[#0A66FF] text-white hover:bg-[#0052D6] active:scale-95 transition-all text-xs font-semibold px-10 py-3.5 rounded-2xl shadow-md shadow-blue-500/10 cursor-pointer text-center"
          >
            保存并应用到系统
          </button>
        </div>
      </div>
    </div>
  );
};

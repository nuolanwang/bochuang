import React, { useState } from 'react';
import { X, Building2, UserCheck, ShieldAlert, BadgeAlert, Plus, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface EnterpriseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEnt: any) => void;
}

export const EnterpriseFormModal: React.FC<EnterpriseFormModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [tab, setTab] = useState<'registered' | 'unregistered'>('unregistered');
  const [companyName, setCompanyName] = useState('');
  const [creditCode, setCreditCode] = useState('');
  const [legalPerson, setLegalPerson] = useState('');
  const [registeredCapital, setRegisteredCapital] = useState('');
  const [industry, setIndustry] = useState('');
  const [scale, setScale] = useState('1 - 19人');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    // Validate creditCode if registered
    if (tab === 'registered' && !creditCode.trim()) {
      alert('已注册企业必须填入统一社会信用代码！');
      return;
    }

    const isReg = tab === 'registered';
    const newId = `ent-${Date.now()}`;

    const newEnt = {
      id: newId,
      name: companyName.trim(),
      status: isReg ? 'registered' : 'unregistered',
      info: {
        companyName: companyName.trim(),
        creditCode: creditCode.trim() || (isReg ? '91440300MA' + Math.floor(Math.random() * 90000000 + 10000000) + 'X' : ''),
        legalPerson: legalPerson.trim() || (isReg ? '林嘉楠' : ''),
        registeredCapital: registeredCapital.trim() || '100万人民币',
        industry: industry.trim() || '新一代信息技术与自研算法',
        scale: scale || '1 - 19人',
        address: address.trim() || '全国高新数字孵化园区A座',
        foundedDate: new Date().toISOString().split('T')[0],
        description: description.trim() || (isReg ? '快速登记及工商档案校对。' : '请在上方填报登记表单，以便系统解锁多层级产品管理和资质冗余测算科室。')
      },
      products: isReg ? [
        {
          id: `prod-${Date.now()}-1`,
          name: `${companyName.trim()} 核心数智交付系统`,
          version: 'v1.0.0',
          techStack: 'React / FastAPI / Python / Tailwind',
          userCount: '2项种子项目正在运行试点',
          status: 'active'
        }
      ] : [],
      qualifications: isReg ? [
        {
          id: `qual-${Date.now()}-1`,
          name: '国家级中小型科技企业评定认定 (拟申报)',
          issuer: '当地科技创新委员会',
          expiryDate: '2027-12-31',
          status: 'active',
          remarks: '由于本主体新激活开通，处于首期科技资格诊断审核之中。'
        }
      ] : [],
      meetings: isReg ? [
        {
          id: `meet-${Date.now()}-1`,
          title: `${companyName.trim()} 首次数字合规诊断会议`,
          time: new Date().toISOString().split('T')[0] + ' 10:00 - 11:30',
          body: '',
          attendees: `${legalPerson.trim() || '团队负责人'}、合规财务、技术总监`,
          conclusions: '1. 工商基础要件已经通过一键认证。2. 下阶段将着手启动防范重复资质证书申报，降低冗余开支。'
        }
      ] : []
    };

    onSave(newEnt);
    // Reset fields
    setCompanyName('');
    setCreditCode('');
    setLegalPerson('');
    setRegisteredCapital('');
    setIndustry('');
    setScale('1 - 19人');
    setAddress('');
    setDescription('');
    // Close modal
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 max-h-[92vh]"
        >
          {/* Top Header */}
          <div className="p-6 border-b border-[#EEF3F8] flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-[#EAF2FF] text-[#0A66FF] rounded-lg">
                <Building2 className="w-5 h-5 stroke-[2]" />
              </span>
              <div>
                <h2 className="text-base font-bold text-[#102033] tracking-tight">新增申报企业主体</h2>
                <p className="text-[10px] text-[#52657A] font-semibold">填报、对接您的项目或实体，解锁科技管理看板</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#F3F8FF] text-slate-400 hover:text-[#102033] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
            {/* Tab Selection */}
            <div className="flex flex-col gap-2.5 shrink-0">
              <label className="text-[11px] font-bold text-[#52657A] block tracking-wider uppercase">企业注册状态登记</label>
              <div className="flex bg-[#F3F8FF] p-1 rounded-2xl border border-[#DDE8F5] w-fit">
                <button
                  type="button"
                  onClick={() => setTab('unregistered')}
                   className={cn(
                    "px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                    tab === 'unregistered'
                      ? "bg-amber-500 text-white shadow-md shadow-amber-500/10"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>未注册创研项目</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('registered')}
                  className={cn(
                    "px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                    tab === 'registered'
                      ? "bg-[#0A66FF] text-white shadow-md shadow-blue-500/10"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>已注册企业主体</span>
                </button>
              </div>
            </div>

            {/* Smart Prompt banner */}
            <div className={cn(
              "p-4 rounded-2xl text-[11px] font-semibold leading-relaxed flex gap-2.5 items-start border",
              tab === 'registered'
                ? "bg-[#F3F8FF] border-[#BFD8FF] text-[#0A66FF]"
                : "bg-[#FFF9F2] border-[#FFE2C2] text-[#E58A3C]"
            )}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                {tab === 'registered' ? (
                  <span>您正在登记 <strong>已注册企业主体</strong>。系统将验证您的 <strong>统一社会信用代码</strong> 以对齐后续软件、资质评估及自动防冗、合规诊断。</span>
                ) : (
                  <span>您正在登记 <strong>未注册创研项目</strong>（适用于自研初期、早期路演等），<strong>仅需填写 “企业全称”</strong>，其他选项均选填或由系统自动留空，即可零门槛极速建档激活。</span>
                )}
              </div>
            </div>

            {/* Fields list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#52657A] flex items-center gap-1">
                  <span>拟填报企业/项目全称</span>
                  <span className="text-rose-500 text-[10px] font-semibold">*必填</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="例如：深圳云翼低碳动力系统有限公司"
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#52657A] flex items-center gap-1">
                  <span>统一社会信用代码</span>
                  {tab === 'registered' ? (
                    <span className="text-rose-500 text-[10px] font-semibold">*必填</span>
                  ) : (
                    <span className="text-[#52657A] text-[10px] font-medium">(选填)</span>
                  )}
                </label>
                <input
                  type="text"
                  required={tab === 'registered'}
                  value={creditCode}
                  onChange={(e) => setCreditCode(e.target.value)}
                  placeholder={tab === 'registered' ? "如 91440300MA..." : "18位统一信用代码 (选填)"}
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#52657A] flex items-center gap-1">
                  <span>注册资本与资金规模</span>
                  <span className="text-[#52657A] text-[10px] font-medium">(选填)</span>
                </label>
                <input
                  type="text"
                  value={registeredCapital}
                  onChange={(e) => setRegisteredCapital(e.target.value)}
                  placeholder="如 100万人民币"
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#52657A] flex items-center gap-1">
                  <span>法定代表人/项目负责人</span>
                  <span className="text-[#52657A] text-[10px] font-medium">(选填)</span>
                </label>
                <input
                  type="text"
                  value={legalPerson}
                  onChange={(e) => setLegalPerson(e.target.value)}
                  placeholder="如 林嘉楠"
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Collapsible/Secondary inputs with optional tagging */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#52657A] flex items-center gap-1">
                  <span>行业细分领域</span>
                  <span className="text-[#52657A] text-[10px] font-medium">(选填)</span>
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="如 新一代信息技术与自研算法"
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#52657A]">职工人数规模 (选填)</label>
                <select
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all cursor-pointer"
                >
                  <option value="1 - 19人">1 - 19人</option>
                  <option value="20 - 49人">20 - 49人</option>
                  <option value="50 - 99人">50 - 99人</option>
                  <option value="100 - 499人">100 - 499人</option>
                  <option value="500人以上">500人以上</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-[#52657A] flex items-center gap-1">
                  <span>经营联络及通信地址</span>
                  <span className="text-[#52657A] text-[10px] font-medium">(选填)</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="输入具体工商挂靠或办公地址"
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-semibold text-[#102033] outline-none focus:ring-2 focus:ring-[#8BBEFF]/20 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-[#52657A] flex items-center gap-1">
                  <span>核心主营业务/发展理念</span>
                  <span className="text-[#52657A] text-[10px] font-medium">(选填)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="简述自主创立理念及应用场景诊断意图"
                  className="w-full bg-[#FBFDFF] border border-[#DDE8F5] focus:border-[#BFD8FF] focus:bg-white rounded-xl px-4 py-3 text-xs font-semibold text-[#102033] outline-none resize-none leading-relaxed placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Sticky Actions */}
            <div className="pt-6 border-t border-[#EEF3F8] flex items-center justify-end gap-3 bg-white shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-xs font-semibold bg-[#FBFDFF] border border-[#DDE8F5] text-[#52657A] hover:bg-[#F3F8FF] hover:text-[#102033] transition-all cursor-pointer"
              >
                取消返回
              </button>
              <button
                type="submit"
                className={cn(
                  "px-8 py-3 rounded-2xl text-xs font-semibold text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1.5",
                  tab === 'registered'
                    ? "bg-[#0A66FF] hover:bg-[#0052D6] shadow-md shadow-blue-500/10"
                    : "bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/10"
                )}
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>立即填报保存此企业</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

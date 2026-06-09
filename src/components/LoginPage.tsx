import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, ArrowRight, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onLogin: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [activeTab, setActiveTab] = useState<'phone' | 'wechat'>('phone');
  const [showQrSuccess, setShowQrSuccess] = useState(false);

  // Timer for countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setErrorMsg('请输入正确的 11 位手机号码');
      return;
    }
    setErrorMsg('');
    setCountdown(60);
    alert('【博创园】验证码已发送。测试快捷验证码为: 123456');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreed) {
      setErrorMsg('请勾选同意《用户协议》与《隐私条款》');
      return;
    }
    if (!phone) {
      setErrorMsg('请输入手机号码');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setErrorMsg('请输入正确的 11 位手机号码');
      return;
    }
    if (!code) {
      setErrorMsg('请输入验证码');
      return;
    }
    if (code !== '123456') {
      setErrorMsg('验证码验证失败，测试验证码为: 123456');
      return;
    }

    // Success login
    localStorage.setItem('isLoggedIn', 'true');
    onLogin();
  };

  const handleSimulateWeChatScan = () => {
    setShowQrSuccess(true);
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#eef4fc] via-[#f5f8fc] to-white flex flex-col justify-between font-sans antialiased text-[#1f2937] overflow-x-hidden relative">
      
      {/* Soft radial ambient glow layers mimicking the image */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Decorative smooth wavy shapes reminiscent of modern portal background */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 opacity-30 pointer-events-none">
        <svg viewBox="0 0 1440 320" fill="none" className="w-full h-full object-cover">
          <path d="M0,288L120,266.7C240,245,480,203,720,202.7C960,203,1200,245,1320,266.7L1440,288L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#EFF6FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Invisible spacer */}
      <div className="h-4 hidden lg:block" />

      {/* Main Container Section */}
      <div className="max-w-[1200px] w-full mx-auto px-6 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between relative z-10">
        
        {/* Left column: Highly styled copy of the image's layout */}
        <div className="lg:col-span-7 col-span-12 space-y-8 text-left select-none pr-4">
          
          {/* Brand Flag / Logo block */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0045c4] shadow-lg shadow-blue-500/25 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5 text-white" stroke="currentColor" strokeWidth="2.5">
                <path d="M4.53 10.9A9.7 9.7 0 0112 3a9.7 9.7 0 017.47 7.9A9.9 9.9 0 0112 21a9.9 9.9 0 01-7.47-10.1z" strokeLinecap="round" />
                <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wider text-slate-850 flex items-center gap-1.5">
                <span>博创园</span>
                <span className="text-[10px] bg-[#0045c4]/10 text-[#0045c4] px-1.5 py-0.5 rounded font-black tracking-normal">BOCHUANG</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">一站式科研项目与双创申报中枢</p>
            </div>
          </div>

          {/* Large elegant copy inspired strictly by "优质流量 自主经营" */}
          <div className="space-y-4 pt-4">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.25]">
              博创园 <br />
              <span className="text-[#0045c4] bg-gradient-to-r from-[#0045c4] to-blue-600 bg-clip-text text-transparent">创业陪伴系统</span>
            </h2>
            <p className="text-slate-500 font-semibold text-sm max-w-[480px] leading-relaxed">
              支持10余个国家与市级重点科研杯赛规则一键解构。
              依托大数据查新查重链条，大幅跃升您的商业计划书（BP）过审可能。
            </p>
          </div>

          {/* Minimalist modern metrics layer row for styling premium feel */}
          <div className="flex gap-8/12 gap-8 pt-2 items-center text-left">
            <div>
              <div className="text-lg font-black text-[#0045c4]">99.8%</div>
              <div className="text-[10px] text-slate-450 font-bold">主流项目覆盖率</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-lg font-black text-[#0045c4]">10,000+</div>
              <div className="text-[10px] text-slate-450 font-bold">成功辅导申报案例</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="text-lg font-black text-emerald-600">3秒</div>
              <div className="text-[10px] text-slate-450 font-bold">快速拉取微信扫码</div>
            </div>
          </div>

        </div>

        {/* Right column: The Pristine Login card */}
        <div className="lg:col-span-5 col-span-12 flex justify-center">
          <div className="w-full max-w-[390px] bg-white rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,40,120,0.08)] border border-[#e2effd]/60 overflow-hidden relative">
            
            {/* Top tiny colored highlight */}
            <div className="h-1 bg-gradient-to-r from-[#0045c4] via-blue-500 to-indigo-600" />

            {/* Form padding area */}
            <div className="p-8 space-y-6">
              
              {/* Box Title Header: Cleaned up as requested (no redundant text) */}
              <div className="text-left">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">欢迎登录</h3>
              </div>

              {/* Tab Selection Row (ONLY Two tabs: Mobile or WeChat) */}
              <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab('phone')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer",
                    activeTab === 'phone'
                      ? "bg-[#0045c4] text-white shadow-md shadow-blue-500/10"
                      : "text-slate-500 hover:text-[#0045c4]"
                  )}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>手机号登录</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('wechat')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer",
                    activeTab === 'wechat'
                      ? "bg-[#0045c4] text-white shadow-md shadow-blue-500/10"
                      : "text-slate-500 hover:text-[#0045c4]"
                  )}
                >
                  {/* WeChat logo */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M8.5 13.5a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 5.8 2 10.5c0 2.65 1.43 5 3.68 6.53L5 19.5l3.15-1.57c1.2.37 2.49.57 3.85.57 5.52 0 10-3.8 10-8.5S17.52 2 12 2zm6.5 15.5l1.9 1.1-1-2.9c1.37-1.12 2.24-2.8 2.24-4.7 0-3.59-3.32-6.5-7.39-6.5-4.07 0-7.39 2.91-7.39 6.5s3.32 6.5 7.4 6.5c.87 0 1.7-.13 2.47-.38l1.77 1.38z" clipRule="evenodd"/>
                  </svg>
                  <span>微信扫码</span>
                </button>
              </div>

              {/* Form elements switcher */}
              {activeTab === 'phone' ? (
                /* Mobile Phone login input */
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  
                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-1.5 text-rose-600 text-xs font-bold animate-shake leading-snug">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Input 1: phone num */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">手机号码</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-slate-800 font-extrabold text-xs">
                        <span className="text-sm select-none">🇨🇳</span>
                        <span>CN +86</span>
                        <span className="text-slate-300 ml-1 text-[8px]">▼</span>
                      </div>
                      <div className="absolute left-[88px] h-5 w-px bg-slate-200 shrink-0" />
                      <input 
                        type="tel"
                        maxLength={11}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="请输入手机号"
                        className="w-full bg-slate-50/20 hover:bg-slate-50 focus:bg-white border-2 border-slate-100 focus:border-[#0045c4] rounded-xl pl-[102px] pr-4 py-3 text-xs font-black font-mono text-slate-800 transition-all placeholder:text-slate-350 placeholder:font-sans outline-none focus:ring-4 focus:ring-blue-100/50"
                      />
                    </div>
                  </div>

                  {/* Input 2: verification code */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">验证码</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="请输入验证码"
                        className="flex-1 bg-slate-50/20 hover:bg-slate-50 focus:bg-white border-2 border-slate-100 focus:border-[#0045c4] rounded-xl px-4 py-3 text-xs font-black font-mono text-slate-800 transition-all placeholder:text-slate-350 placeholder:font-sans outline-none focus:ring-4 focus:ring-blue-100/50"
                      />
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                        className={cn(
                          "px-4 rounded-xl text-xs font-black tracking-tight transition-all active:scale-95 text-center shrink-0 cursor-pointer border min-w-[105px]",
                          countdown > 0 
                            ? "bg-slate-50 text-slate-400 border-slate-150 cursor-not-allowed" 
                            : "bg-[#0045c4]/5 hover:bg-[#0045c4]/10 text-[#0045c4] border-[#0045c4]/10"
                        )}
                      >
                        {countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </button>
                    </div>
                  </div>

                  {/* Agreement details checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-[11px] font-semibold text-slate-400 leading-snug">
                      <input 
                        type="checkbox"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                        className="w-4 h-4 text-[#0045c4] bg-slate-100 rounded border-slate-200 focus:ring-[#0045c4] transition-all cursor-pointer mt-0.5 shrink-0"
                      />
                      <span>
                        登录即代表同意
                        <a href="#" className="underline text-[#0045c4] hover:text-[#0045c4] mx-1 font-bold">《用户协议》</a>
                        和
                        <a href="#" className="underline text-[#0045c4] hover:text-[#0045c4] mx-1 font-bold">《隐私条款》</a>
                      </span>
                    </label>
                  </div>

                  {/* Main login trigger button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0045c4] hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all active:scale-98 shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    <span>登录 / 注册</span>
                  </button>

                </form>
              ) : (
                /* WeChat Scan code mode */
                <div className="flex flex-col items-center justify-center py-4 space-y-4 animate-in fade-in duration-200">
                  {showQrSuccess ? (
                    <div className="py-8 flex flex-col items-center justify-center space-y-3">
                      <CheckCircle2 className="w-14 h-14 text-emerald-500 stroke-[2] animate-bounce" />
                      <h4 className="text-sm font-black text-slate-800">扫码成功，正在进入系统...</h4>
                    </div>
                  ) : (
                    <>
                      {/* Stylized QR placeholder mimicking modern login scan boxes */}
                      <div 
                        onClick={handleSimulateWeChatScan}
                        className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm relative group cursor-pointer hover:border-blue-500/30 transition-all hover:scale-102"
                        title="点击模拟微信扫码成功"
                      >
                        <div className="w-36 h-36 bg-slate-50 border-2 border-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                          {/* Generative blocks */}
                          <div className="grid grid-cols-4 gap-2.5 w-28 h-28 opacity-75">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "rounded", 
                                  (i % 3 === 0 || i % 7 === 1 || i === 0 || i === 3 || i === 12 || i === 15) ? "bg-[#0045c4]" : "bg-slate-200"
                                )}
                              />
                            ))}
                          </div>
                          {/* Center floating brand wechat microicon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-[#0045c4]">
                              <QrCode className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                        {/* Scanning bar */}
                        <div className="absolute left-6 right-6 top-8 h-0.5 bg-blue-500 shadow-md animate-bounce opacity-40" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 max-w-[220px] text-center leading-relaxed">
                        请使用微信 App 扫描上述二维码
                        <br />
                        <span className="text-[#0045c4] font-extrabold">(点击可模拟扫码成功进入)</span>
                      </p>
                    </>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* Footer Area mirroring the clean doudian look/links */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-slate-250/20 py-8 text-center select-none text-[10px] font-bold text-slate-405 shrink-0 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          
          {/* Quick links header */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-[#0045c4] transition-colors">关于博创</a>
            <span className="text-slate-250">|</span>
            <a href="#" className="hover:text-[#0045c4] transition-colors">科研白名单标准</a>
            <span className="text-slate-250">|</span>
            <a href="#" className="hover:text-[#0045c4] transition-colors">专精特新智能匹配</a>
            <span className="text-slate-250">|</span>
            <a href="#" className="hover:text-[#0045c4] transition-colors">人才住房及补贴指引</a>
            <span className="text-slate-250">|</span>
            <a href="#" className="hover:text-[#0045c4] transition-colors text-amber-600">赛事组委会合作</a>
            <span className="text-slate-250">|</span>
            <a href="#" className="hover:text-[#0045c4] transition-colors text-emerald-600">高校联合申报接口</a>
          </div>

          <div className="text-slate-400 leading-relaxed font-semibold">
            版权所有 © 1997-2026 博创园科技智联网络 · 粤公网安备 44010602000308 号 · ICP备案：粤B2-20090191-3
          </div>
        </div>
      </footer>

    </div>
  );
};

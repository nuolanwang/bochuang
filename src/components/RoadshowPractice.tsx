import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Square, Video, VideoOff, Mic, MicOff, Sparkles, 
  CheckCircle2, Award, Volume2, Loader2, Camera, AlertTriangle, 
  TrendingUp, ChevronRight, MessageSquare, Flame, Check, ShieldCheck,
  User, Calendar, Clock, RotateCcw, Monitor, FileText, Moon, Sun, ArrowRight, Video as CamIcon,
  X, Trash2
} from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface Props {
  project: Project;
}

export const RoadshowPractice: React.FC<Props> = ({ project }) => {
  const [status, setStatus] = useState<'simulation' | 'analyzing' | 'reported'>('simulation');
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [time, setTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // List of historical roadshow records
  const [records, setRecords] = useState<any[]>([
    {
      id: 'rec-1',
      title: '主板架构与能耗模型路演预演',
      date: '2026-05-24 16:30',
      duration: '02:15',
      grade: 'A',
      score: 89,
      scores: { tech: 90, business: 85, delivery: 91 },
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
      feedback: [
        "核心自研算法及低能耗比性能论述透彻。技术前沿首创度和查新支撑是第一梯级高分项。",
        "商业模式偏重重资产，建议调整为‘标准产品授权 + 阶梯定制化 SaaS 服务方案’开展中试冷启动。",
        "提问环节作答思路极其明晰，但第二个问题时由于语速稍有急促略显紧张，整体肢体舒展度极佳。"
      ]
    },
    {
      id: 'rec-2',
      title: '创业首期冷启动大客户策略路演演练',
      date: '2026-05-25 08:15',
      duration: '01:50',
      grade: 'A-',
      score: 84,
      scores: { tech: 81, business: 89, delivery: 82 },
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600",
      feedback: [
        "大客户及政企场景联合推广路径十分扎实，盈利测算逻辑精密，商业切入极为可信。",
        "核心前沿技术描述偏弱，未着墨展示本系统与同质竞品的对比查新优势，易受评委质疑。",
        "答辩音强、音调波动完美契合商务演讲韵律，每分钟 180 词左右的黄金节拍极大博取了好感。"
      ]
    }
  ]);

  // Current record being displayed in reported view. If null, falls back securely
  const [activeRecord, setActiveRecord] = useState<any | null>(null);

  // Modal display toggler
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Timeline playback state variables for the simulation player
  const [isPlayingSim, setIsPlayingSim] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  
  // Camera feed states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Roadshow questions specific to tech/startup evaluation
  const questions = [
    {
      id: 1,
      text: `你好！我是本场博创智能路演的 AI 首席科学官。针对你的项目《${project.name}》，请在 2 分钟之内介绍一下你们最核心的【技术护城河】与【产品突破口】是什么？`,
      tips: "侧重强调自研算法专利、查新报告的首创度，以及与传统解决方案的能耗比差异。"
    },
    {
      id: 2,
      text: "非常抗打的技术亮点！接下来请阐述一下本项目的【商业变现模型】是什么？如何实现低门槛的客户冷启动并保障健康的毛利率？",
      tips: "分析 SaaS 订阅模式、私有化部署、技术支持或一次性买断，并提供获客周期预测。"
    },
    {
      id: 3,
      text: "最后，针对你们的【核心团队架构】，清华以及知名企业的技术背景毋庸置疑，但针对销售、政企落地端，你们有什么应对或扩充计划吗？",
      tips: "说明核心骨干中是否有行业老兵，或分享目前的校企、政研试点落地成果。"
    }
  ];

  // Timer effect for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Player ticks simulation for the recorded video playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingSim) {
      interval = setInterval(() => {
        const total = activeRecord?.duration 
          ? parseInt(activeRecord.duration.split(':')[0]) * 60 + parseInt(activeRecord.duration.split(':')[1]) 
          : 120;
        
        setPlayedSeconds(prev => {
          if (prev >= total) {
            setIsPlayingSim(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingSim, activeRecord]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // Request/release camera & audio
  const startMedia = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn("Media stream access failed, using premium simulation fallback:", err);
      setPermissionError("无法获取到您的摄像头或麦克风权限。系统已自动为您开启极客仿真路演模拟视图，可正常运作试炼。");
    }
  };

  const stopMedia = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleStartPractice = async () => {
    setIsRecording(true);
    await startMedia();
  };

  const handleStopAndAnalyze = () => {
    stopMedia();
    setIsRecording(false);
    setStatus('analyzing');
    setIsPlayingSim(false);
    setPlayedSeconds(0);
    
    // Auto complete assessment after short delay
    setTimeout(() => {
      const liveDurationText = formatTime(time || 68);
      const newLiveRecord = {
        id: `rec-live-${Date.now()}`,
        title: `实时模拟路演 - 最新质询试练`,
        date: new Date().toLocaleString('zh-CN', { hour12: false }),
        duration: liveDurationText,
        grade: 'A+',
        score: 91,
        scores: { tech: 93, business: 88, delivery: 91 },
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
        feedback: [
          `对技术独创度与实现深度点赞。在对《${project.name}》的本场演练里，您准确阐述了突破性的自研算法。建议保持并继续放大！`,
          `商业变现相对合理，唯主评委关注您的冷启动规划。建议强调“如何联合当前几家标杆企业开展小试”，以运行协议证明造血功能。`,
          "开头语速稍开频（字频 220词/分），中后段渐臻完美（每分钟黄金180词）。合伙人架构充实，回答自信，肢体得体。"
        ]
      };

      setRecords(prev => [newLiveRecord, ...prev]);
      setActiveRecord(newLiveRecord);
      setStatus('reported');
    }, 3000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleStopAndAnalyze();
    }
  };

  const handleRestart = () => {
    setStatus('simulation');
    setIsRecording(false);
    setCurrentQuestionIndex(0);
    setPermissionError(null);
    setTime(0);
    setIsPlayingSim(false);
    setPlayedSeconds(0);
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    if (activeRecord?.id === id) {
      if (updated.length > 0) {
        setActiveRecord(updated[0]);
      } else {
        setActiveRecord(null);
        setStatus('simulation');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-50/50 rounded-3xl border border-slate-100 p-4 md:p-6 space-y-6 select-none text-left">
      
      {/* 1. Header Toolbar (Perfect replicate of top bar inside the screenshot) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f8fafc]/90 border border-slate-100 p-4 rounded-2xl shadow-sm">
        
        {/* Left App Brand / Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#3b82f6] text-white flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Camera className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-extrabold text-[#1e293b] leading-tight flex items-center gap-1.5">
              AI 模拟路演
              <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                专家评级
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              高级路演答辩与创业项目深度诊断服务
            </p>
          </div>
        </div>

        {/* Right Navigation Controls (Perfect copy of the button group inside image) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-100 flex items-center gap-1">
            <button 
              type="button"
              className="px-4 py-1.8 bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-black rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Monitor className="w-3.5 h-3.5" />
              实时路演
            </button>
            <button 
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className={cn(
                "px-4 py-1.8 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all outline-none",
                showHistoryModal 
                  ? "bg-[#3b82f6]/10 text-[#3b82f6]" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              路演记录
            </button>
          </div>
        </div>

      </div>

      <AnimatePresence mode="wait">
        
        {/* State 1: SIMULATION / ACTIVE INTERACTIVE MODE */}
        {status === 'simulation' && (
          <motion.div 
            key="simulation-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          >
            {/* Left Box: AI Presenter Screen (Replica of leftmost block in image) */}
            <div className="lg:col-span-8 bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 min-h-[480px]">
              
              {/* Top Watermarks Overlay */}
              <div className="flex items-center justify-between relative z-10 select-none">
                <div className="flex items-center gap-2 bg-[#1e293b]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase">
                    AI 路演评委
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-[#1e293b]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
                  <span className="text-[10px] font-black tracking-wider text-slate-300 uppercase">
                    {isRecording ? "聆听中" : "连线中"}
                  </span>
                </div>
              </div>

              {/* Core Portrait: Elegant professional AI voice visualizer block */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0b1329] via-[#0f2a63] to-[#151b2e] flex flex-col items-center justify-center p-8 gap-4 select-none">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-ping" />
                  <div className="w-20 h-20 rounded-full bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                    <span className="text-sm font-black tracking-widest uppercase text-center animate-pulse">ROADSHOW<br/>CRITIC</span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-blue-300 font-extrabold tracking-widest uppercase">智能AI路演深度诊断智囊团</p>
                  <p className="text-[10px] text-slate-500 font-bold">全向语音感知及逻辑校验模块已就绪</p>
                </div>
                {/* Visual Darkness Gradient for subtitle alignment */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/45" />
              </div>

              {/* Large Semitransparent glassmorphic "Play" interactive ring button in the center */}
              {!isRecording && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.button 
                    onClick={handleStartPractice}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl cursor-pointer hover:bg-white/30 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#3b82f6] shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </motion.button>
                </div>
              )}

              {/* Lower Overlay text content area */}
              <div className="space-y-4 z-10 mt-auto">
                
                {/* Subtitle text balloon for questions */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-left select-none relative max-w-2xl mx-auto space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-[#60a5fa] uppercase">
                    <span>问题 {currentQuestionIndex + 1} / {questions.length}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-amber-400">答辩重点</span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-slate-100 leading-relaxed">
                    {questions[currentQuestionIndex].text}
                  </p>
                </div>

                {/* Simulated message input box "输入您的回答..." (matching visual mockup at the bottom center of video) */}
                <div className="max-w-xl mx-auto w-full relative">
                  <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 px-5 py-3.5 flex items-center justify-between shadow-xl">
                    <span className="text-xs font-semibold text-slate-400">
                      {isRecording ? "AI 首席科学官正在通过音频与影像捕捉您的路演陈述..." : "输入您的回答..."}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                      <Mic className="w-4 h-4" />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: User Camera Block & Telemetry Matrix (Replica of rightmost block in image) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6">
              
              {/* Webcam Widget Container */}
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-xl p-4 flex flex-col justify-between relative min-h-[300px]">
                
                {/* Small indicator label */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#1e293b] tracking-tight">参会画面</span>
                  <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                    在线
                  </div>
                </div>

                {/* Webcam Preview Screen */}
                <div className="flex-1 rounded-2xl bg-[#0f172a] relative overflow-hidden flex items-center justify-center min-h-[170px] border border-slate-100 shadow-inner">
                  {permissionError ? (
                    <div className="p-4 text-center space-y-2 relative z-10 select-none">
                      {/* Stylized placeholder matching the emoji character visual mockup */}
                      <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700/50 flex items-center justify-center mx-auto text-3xl">
                        😏
                      </div>
                      <div className="text-slate-3300 text-[10px] font-extrabold">我 (候选人)</div>
                      <p className="text-[9px] text-slate-400 leading-normal max-w-[200px] font-semibold">
                        极客模拟路演视图已就绪。正式开始后将尝试调动硬件，也可随时以全拟真沙盘答辩直接演练。
                      </p>
                    </div>
                  ) : (
                    /* Real Live Video */
                    <>
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        muted={!audioEnabled}
                        className={cn("absolute inset-0 w-full h-full object-cover rounded-2xl transform scale-x-[-1] transition-opacity duration-300", videoEnabled ? "opacity-100" : "opacity-0")}
                      />
                      
                      {/* Indicator of Candidate if video is blank */}
                      {!videoStreamActive() && (
                        <div className="p-4 text-center space-y-2 relative z-10 select-none">
                          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mx-auto text-3xl">
                            😏
                          </div>
                          <div className="text-slate-300 text-[10px] font-extrabold">我 (候选人)</div>
                          <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                            点击下方开始路演，获取相机与音视频通道
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Device disabled visual mask */}
                  {!videoEnabled && videoStreamActive() && (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2">
                      <div className="p-3 bg-white/5 rounded-xl text-slate-500">
                        <VideoOff className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold font-sans">摄像头已关闭</span>
                    </div>
                  )}

                  {/* Bottom overlay badge */}
                  {videoEnabled && videoStreamActive() && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold text-white z-20">
                      我 (候选人)
                    </div>
                  )}
                </div>

                {/* Device switches and indicators */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-50 mt-3">
                  <button 
                    type="button"
                    onClick={() => {
                      if (mediaStream) {
                        const audioTrack = mediaStream.getAudioTracks()[0];
                        if (audioTrack) audioTrack.enabled = !audioEnabled;
                      }
                      setAudioEnabled(!audioEnabled);
                    }}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95",
                      audioEnabled 
                        ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100" 
                        : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                    )}
                    title={audioEnabled ? "静音麦克风" : "打开麦克风"}
                  >
                    {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      if (mediaStream) {
                        const videoTrack = mediaStream.getVideoTracks()[0];
                        if (videoTrack) videoTrack.enabled = !videoEnabled;
                      }
                      setVideoEnabled(!videoEnabled);
                    }}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all cursor-pointer active:scale-95",
                      videoEnabled 
                        ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100" 
                        : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                    )}
                    title={videoEnabled ? "关闭镜头" : "开启镜头"}
                  >
                    {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                </div>

              </div>

              {/* Network, System Status & Interactive Control Panel (Replicates details list in image) */}
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-xl p-5 space-y-4 text-[11px] text-slate-550 font-bold relative overflow-hidden flex-1 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 flex-wrap gap-2">
                    <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[9px]">数字链路诊断</span>
                    <span className="text-[#3b82f6] font-mono uppercase font-black">在线</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">网络延迟</span>
                    <span className="font-mono text-emerald-600 text-right font-black">24 ms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">录制时长</span>
                    <span className="font-mono text-slate-700 text-right font-black">
                      {formatTime(time)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">当前状态</span>
                    <span className={cn(
                      "font-sans text-right font-extrabold",
                      isRecording ? "text-[#3b82f6] animate-pulse" : "text-amber-500"
                    )}>
                      {isRecording ? "等待回答" : "连线待命中"}
                    </span>
                  </div>
                </div>

                {/* Primary Action Button Wizard: Clicking starts, Clicking next answers, Clicking stop ends */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-50">
                  {!isRecording ? (
                    <button 
                      onClick={handleStartPractice}
                      className="w-full py-3.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>开始录制与路演</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button 
                        onClick={handleStopAndAnalyze}
                        className="w-full py-3.5 bg-gradient-to-tr from-purple-500 to-indigo-600 hover:opacity-90 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-lg shadow-indigo-500/10"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>结束录制，获取AI深度点评</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* State 2: ANALYZING AI ASSESSMENT */}
        {status === 'analyzing' && (
          <motion.div 
            key="analyzing-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-16 text-center rounded-3xl bg-white border border-slate-100 shadow-xl flex flex-col items-center justify-center min-h-[440px] space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#3b82f6] animate-spin" />
              </div>
              <div className="absolute inset-0 bg-blue-100/30 rounded-full blur-xl animate-pulse -z-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-black text-slate-800 tracking-tight">AI 智能科学评估中...</h4>
              <p className="text-slate-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                主评委正全面比对“挑战杯”、“创青春”金奖数据库，分析您的路演声学、表达顿挫及商业切入点的严谨性...
              </p>
            </div>

            <div className="w-max bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 flex gap-8 text-[11px] font-mono text-slate-500 font-bold select-none divide-x divide-slate-200">
              <div className="space-y-1">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] block">声标特征检测等</span>
                <span>COM (100%)</span>
              </div>
              <div className="space-y-1 pl-8">
                <span className="text-slate-400 uppercase tracking-widest text-[9px] block">表达完备性拟合</span>
                <span className="text-[#3b82f6] animate-pulse">ANALYZING...</span>
              </div>
              <div className="space-y-1 pl-8">
                <span className="text-slate-405 uppercase tracking-widest text-[9px] block">商业模式判定</span>
                <span className="text-[#3b82f6] animate-pulse">EVALUATING...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 3: DETAILED EXQUISITE REPORT */}
        {status === 'reported' && (
          <motion.div 
            key="report-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Upper Scorecard layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#3b82f6] text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">综合诊断评级</span>
                <div>
                  <h4 className="text-5xl font-black font-mono leading-none">{activeRecord?.grade || "A+"}</h4>
                  <p className="text-xs font-bold text-blue-50 mt-1.5 flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg w-max select-none">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-100" />
                    具备省市级金奖潜质
                  </p>
                </div>
              </div>

              {[
                { title: "核心创新与技术护城河 (技术底座)", score: activeRecord?.scores?.tech || "93", flag: (activeRecord?.scores?.tech || 93) >= 90 ? "卓越" : "良好", icon: Award, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
                { title: "商业路径可行度 (落地规划)", score: activeRecord?.scores?.business || "88", flag: (activeRecord?.scores?.business || 88) >= 88 ? "良好" : "中等", icon: TrendingUp, color: "text-blue-500 bg-blue-50 border-blue-105" },
                { title: "路演表达临场渲染力 (表现技巧)", score: activeRecord?.scores?.delivery || "91", flag: (activeRecord?.scores?.delivery || 91) >= 90 ? "优秀" : "良好", icon: MessageSquare, color: "text-purple-500 bg-purple-50 border-purple-105" }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[140px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{m.title}</span>
                      <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-md border", m.color)}>{m.flag}</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black font-mono text-slate-800 leading-none">{m.score}</span>
                        <span className="text-xs font-bold text-slate-400">/ 100</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>已调入智能质询诊断权重数据</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* In-depth Review Bento Grid Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Details Feedback (Takes 2 blocks width) */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-4.5 bg-[#3b82f6] rounded-full inline-block" />
                    AI 评委会深度回馈建议
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    路演记录: {activeRecord ? activeRecord.date : "刚由路演试炼分析生成"}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Technology item */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">核心优势</span>
                      <h5 className="text-xs font-black text-slate-800">对技术独创度与实现深度点赞</h5>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {activeRecord ? activeRecord.feedback[0] : `答辩中您对《${project.name}》的技术演化路径及底座能耗、吞吐参数非常熟悉，能够准确阐述突破性的专有算法。这极大博取了工科专家的第一步认可，建议在正版答辩 PPT 第一幕中继续保持并放大！`}
                    </p>
                  </div>

                  {/* Profit item */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">商业微调建议</span>
                      <h5 className="text-xs font-black text-slate-800">关于商业冷启动路径的可控建议</h5>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {activeRecord ? activeRecord.feedback[1] : "不过，主评委注意到您的变现闭环在汇报中略偏重。为了让评委不认为这是“飘在空中的实验室作品”，建议着重强调“如何联合当前几家政企、标杆领头企业开展小规模商业验证”，用具体的试运行财务合同证明本技术具有实际造血机能。"}
                    </p>
                  </div>

                  {/* Delivery item */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-[#3b82f6] border border-blue-105 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">演讲演练提升</span>
                      <h5 className="text-xs font-black text-slate-800">演说停顿及答问话术精修</h5>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {activeRecord ? activeRecord.feedback[2] : "语速在第一个提问时略显急促（字频近 220字/分），建议调节在 170-190字/分 的黄金节点。另外，团队组成介绍时需要适度补充在“项目推广、财务预算方面”等核心合伙人的资历和分工职责。"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: AI Video Replay Player */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-4.5 bg-indigo-500 rounded-full inline-block" />
                      路演片段视频回放
                    </h4>
                    <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                      高清重构
                    </span>
                  </div>

                  {/* Simulated interactive player */}
                  <div className="rounded-2xl bg-slate-950 aspect-video relative overflow-hidden flex flex-col justify-between p-3 border border-slate-800 shadow-md group select-none">
                    
                    {/* Dark gradient mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-0" />

                    {/* Camera snapshot/background matching historical blueprint or real feedback */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 gap-2">
                      <div className="w-12 h-12 rounded-full border border-slate-700/80 flex items-center justify-center text-slate-500 font-bold font-mono text-sm tracking-widest animate-pulse select-none bg-slate-950/40">
                        HD PLAYBACK
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">连线还原中</span>
                    </div>

                    {/* Equalizer Visualizer Bars at the bottom (bouncing when playing!) */}
                    {isPlayingSim && (
                      <div className="absolute bottom-10 left-4 right-4 h-6 flex items-end justify-center gap-0.5 z-10 pointer-events-none opacity-40">
                        {Array.from({ length: 24 }).map((_, idx) => (
                          <motion.div 
                            key={idx}
                            animate={{ height: [4, 16, 6, 20, 4][idx % 5] }}
                            transition={{ repeat: Infinity, duration: 0.6 + (idx * 0.05), ease: "easeInOut" }}
                            className="bg-indigo-400 w-1 rounded-full"
                          />
                        ))}
                      </div>
                    )}

                    {/* Top Watermarks */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[8px] font-black tracking-widest text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-2 py-0.5 rounded-full uppercase">
                        录制回放
                      </span>
                      <span className="text-[8px] font-mono text-white/50 bg-black/40 px-2 py-0.5 rounded-full">
                        {activeRecord?.duration || "02:00"}
                      </span>
                    </div>

                    {/* Center Large Glassmorphic Play Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <button 
                        onClick={() => setIsPlayingSim(!isPlayingSim)}
                        className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-xl active:scale-95 hover:bg-white/30"
                      >
                        {isPlayingSim ? (
                          <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-md">
                            <Square className="w-4 h-4 fill-current" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-md translate-x-[1px]">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Bottom Video Controls Toolbar overlay */}
                    <div className="w-full relative z-10 space-y-1.5 pt-6">
                      
                      {/* Timeline bar with slider */}
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-white/80 select-none">
                          {formatTime(playedSeconds)}
                        </span>
                        
                        {/* Interactive bar */}
                        <div 
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickPos = (e.clientX - rect.left) / rect.width;
                            const total = activeRecord?.duration ? parseInt(activeRecord.duration.split(':')[0]) * 60 + parseInt(activeRecord.duration.split(':')[1]) : 120;
                            setPlayedSeconds(Math.floor(clickPos * total));
                          }}
                          className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                        >
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(playedSeconds / (activeRecord?.duration ? parseInt(activeRecord.duration.split(':')[0]) * 60 + parseInt(activeRecord.duration.split(':')[1]) : 120)) * 100}%` 
                            }}
                          />
                        </div>

                        <span className="text-[9px] font-mono text-white/40 select-none pt-0.5">
                          {activeRecord?.duration || "02:00"}
                        </span>
                      </div>

                      {/* Video actions/badges */}
                      <div className="flex items-center justify-between text-[9px] text-white/60 font-medium">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-3.5 h-3.5 text-white/50" />
                          <span>100% 音量质检</span>
                        </div>
                        <span>1080P 自主评阅</span>
                      </div>

                    </div>
                  </div>

                  {/* Informational checklist / stats for video audit */}
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/60 space-y-2.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-dashed border-slate-200/60 pb-1.5">
                      <span>音画分析指标</span>
                      <span className="text-indigo-600">正常合格</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                      <span>表情专注度 (情感传达)</span>
                      <span className="text-slate-700 font-mono">92% (平稳微笑)</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                      <span>手势舒展频率 (商务礼仪)</span>
                      <span className="text-slate-700 font-mono">0.15 次/秒</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                      <span>环境杂噪噪对比比对</span>
                      <span className="text-emerald-600 font-mono">15 dB (通透录音)</span>
                    </div>
                  </div>
                </div>

                {/* Train Again (再次训练) Big button */}
                <div className="pt-3 border-t border-slate-100">
                  <button 
                    onClick={handleRestart}
                    className="w-full py-3.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-500/10 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>再次训练 (重新启动路演模拟)</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* 4. History Records Backdrop Modal Drawer */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end select-none">
            {/* Dark blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            
            {/* Drawer Body Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between p-6 border-l border-slate-100/80 z-10 text-left"
            >
              {/* Drawer Title Block */}
              <div className="space-y-4 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">历史路演答辩档案</h4>
                      <p className="text-[10px] text-slate-400 font-bold">历次科学质询与视频回放库</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowHistoryModal(false)}
                    className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* History Session Records List */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar min-h-0">
                  {records.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-semibold text-xs h-40 flex flex-col justify-center items-center gap-2 select-none border border-dashed border-slate-100 rounded-3xl">
                      <p>暂无路演历史记录</p>
                      <p className="text-[10px] text-slate-300">请进行一次模拟路演测试来生成质询报告</p>
                    </div>
                  ) : (
                    records.map((rec) => {
                      const isSelected = activeRecord?.id === rec.id;
                      return (
                        <div 
                          key={rec.id}
                          onClick={() => {
                            setActiveRecord(rec);
                            setStatus('reported');
                            setShowHistoryModal(false);
                            setIsPlayingSim(false);
                            setPlayedSeconds(0);
                          }}
                          className={cn(
                            "p-4 rounded-2xl border transition-all cursor-pointer text-left hover:shadow-md relative overflow-hidden group/item",
                            isSelected 
                              ? "bg-indigo-50/40 border-indigo-200/60 shadow-sm" 
                              : "bg-white border-slate-100 hover:border-slate-200"
                          )}
                        >
                          {/* Selected overlay neon line */}
                          {isSelected && (
                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#3b82f6]" />
                          )}

                          <div className="space-y-2 relative z-10">
                            {/* Inner Row 1 */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-slate-400 font-bold">{rec.date}</span>
                              <div className="flex items-center gap-1.5 font-mono">
                                <span className="text-[9px] text-slate-400 font-bold">{rec.duration}</span>
                                <span className={cn(
                                  "text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center leading-none",
                                  rec.grade.startsWith('A') ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                )}>
                                  {rec.grade}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteRecord(rec.id, e)}
                                  title="删除此条记录"
                                  className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-1 outline-none flex items-center justify-center"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Record Topic Theme Title */}
                            <h5 className="text-xs font-black text-slate-700 leading-snug group-hover/item:text-brand-blue transition-colors">
                              {rec.title}
                            </h5>

                            {/* Scores metrics row */}
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono font-bold">
                              <span>得分: <strong className="text-slate-700">{rec.score}</strong></span>
                              <span>•</span>
                              <span>技术: <strong className="text-slate-700">{rec.scores.tech}</strong></span>
                              <span>•</span>
                              <span>商业: <strong className="text-slate-700">{rec.scores.business}</strong></span>
                            </div>

                            {/* Mini visual image of recording */}
                            <div className="relative aspect-video rounded-xl overflow-hidden mt-1 opacity-80 group-hover/item:opacity-100 transition-opacity bg-gradient-to-br from-[#0c1a30] to-slate-900 border border-slate-800 flex items-center justify-center">
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-5 h-5 text-white fill-current opacity-80 group-hover/item:scale-110 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Drawer footer close guide */}
              <div className="border-t border-slate-100 pt-4 shrink-0">
                <button 
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-400 font-black text-xs rounded-xl text-center active:scale-95 transition-all outline-none"
                >
                  关闭历史档案
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );

  // Small helper checking if camera stream is set up
  function videoStreamActive() {
    return !!mediaStream && mediaStream.active;
  }
};

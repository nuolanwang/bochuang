import React, { useState, useRef } from 'react';
import { 
  Folder, 
  FolderPlus, 
  UploadCloud, 
  Search, 
  Plus, 
  FileText, 
  FileSpreadsheet, 
  File, 
  Trash2, 
  Download, 
  Check, 
  X, 
  Archive,
  ArrowLeft,
  Pin,
  Settings,
  ChevronDown,
  Paperclip,
  Share2,
  Image as ImageIcon,
  Eye,
  Calendar,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface MaterialFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  type: 'pdf' | 'spreadsheet' | 'doc' | 'image' | 'other';
}

interface MaterialModule {
  id: string;
  title: string;
  description: string;
  badge: string;
  pinned?: boolean;
  coverStyle: string; // Tailwind background gradient / color
  files: MaterialFile[];
}

// Three highly distinct, gorgeously-covered default modules based on Image 1 & 2 guidelines
const DEFAULT_MODULES: MaterialModule[] = [
  {
    id: 'mod-1',
    title: '企业工商资质要件',
    description: '营业执照正副本、法人代表任职证明、银行基本户开户许可。',
    badge: '企业公开',
    pinned: true,
    coverStyle: 'from-slate-700 via-indigo-950 to-slate-900 text-white',
    files: [
      { id: 'file-1-1', name: '营业执照正副本扫描件_高清版.pdf', size: '2.4 MB', uploadDate: '2026-05-10', type: 'pdf' },
      { id: 'file-1-2', name: '企业主体核名批准通知书.pdf', size: '840 KB', uploadDate: '2026-04-20', type: 'pdf' },
      { id: 'file-1-3', name: '企业统一社会信用代码证原件照片.png', size: '1.6 MB', uploadDate: '2026-05-15', type: 'image' },
      { id: 'file-1-4', name: '法人代表交接任职证明及身份证复印件.pdf', size: '1.2 MB', uploadDate: '2026-05-12', type: 'pdf' },
    ]
  },
  {
    id: 'mod-2',
    title: '自研技术核心知识产权',
    description: '自研OmniTraffic自适应算法软件著作权证书、各项发明专利申报稿。',
    badge: '内部特许',
    pinned: false,
    coverStyle: 'from-[#1e1510] via-[#4d2516] to-[#1a1c24] text-white',
    files: [
      { id: 'file-2-1', name: 'OmniTraffic自适应算法软件著作权证书.pdf', size: '1.8 MB', uploadDate: '2026-05-02', type: 'pdf' },
      { id: 'file-2-2', name: '网络数字拓扑特征识别与专利图纸.jpg', size: '920 KB', uploadDate: '2026-05-20', type: 'image' },
      { id: 'file-2-3', name: '发明专利_一种路侧微秒感知决策系统申报稿.pdf', size: '5.2 MB', uploadDate: '2026-05-18', type: 'doc' },
      { id: 'file-2-4', name: '第三次核心技术性能鉴定结论表.xlsx', size: '460 KB', uploadDate: '2026-05-24', type: 'spreadsheet' },
    ]
  },
  {
    id: 'mod-3',
    title: '商业计划及路演材料',
    description: '博创数智_10年交通微系统路演精品商业 PPT大纲与财务测算表。',
    badge: '核心保密',
    pinned: false,
    coverStyle: 'from-[#0b1b3d] via-[#10344d] to-[#16503c] text-white',
    files: [
      { id: 'file-3-1', name: '博创数智_10年交通微系统商业路演完美PPT.pdf', size: '14.5 MB', uploadDate: '2026-05-25', type: 'pdf' },
      { id: 'file-3-2', name: '未来三年全维度财务测算与资金需求表.xlsx', size: '1.1 MB', uploadDate: '2026-05-15', type: 'spreadsheet' },
    ]
  }
];

// Presets for new module covers inside creation modal
const COVER_PRESETS = [
  { id: 'blue-gradient', label: '深海数智', style: 'from-slate-700 via-indigo-950 to-slate-900 text-white' },
  { id: 'sunset', label: '琥珀斜阳', style: 'from-[#1e1510] via-[#4d2516] to-[#1a1c24] text-white' },
  { id: 'emerald', label: '翡翠星河', style: 'from-[#0b1b3d] via-[#10344d] to-[#16503c] text-white' },
  { id: 'cyan', label: '科技极光', style: 'from-[#112233] via-[#094050] to-[#112233] text-white' },
  { id: 'purple', label: '炫彩高新', style: 'from-slate-900 via-purple-950 to-indigo-950 text-white' },
];

export const MaterialsLibrary: React.FC = () => {
  const [modules, setModules] = useState<MaterialModule[]>(() => {
    const cached = localStorage.getItem('bochuang_material_modules_v1');
    return cached ? JSON.parse(cached) : DEFAULT_MODULES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null); // null means showing all folders grid
  const [previewFile, setPreviewFile] = useState<MaterialFile | null>(null); // for viewing files & images
  
  // Create / Upload modal trigger bindings
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isNewDropdownOpen, setIsNewDropdownOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveModules = (updated: MaterialModule[]) => {
    setModules(updated);
    localStorage.setItem('bochuang_material_modules_v1', JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Pinned status
  const togglePin = (modId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = modules.map(m => {
      if (m.id === modId) {
        return { ...m, pinned: !m.pinned };
      }
      return m;
    });
    saveModules(updated);
    showToast('📌 材料库置顶设置已更新！');
  };

  // Create new library module
  const handleCreateModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;

    const chosenPreset = COVER_PRESETS[selectedPresetIndex];
    const newMod: MaterialModule = {
      id: `mod-${Date.now()}`,
      title: newModuleName.trim(),
      description: newModuleDesc.trim() || '自定义导入的系统档案包，支持极速上传资质。',
      badge: '企业公开',
      pinned: false,
      coverStyle: chosenPreset.style,
      files: []
    };

    const updated = [...modules, newMod];
    saveModules(updated);
    setIsNewModuleModalOpen(false);
    setNewModuleName('');
    setNewModuleDesc('');
    showToast(`✨ 材料库分类「${newMod.title}」已新建成功！`);
  };

  // Remove a library module
  const handleDeleteModule = (modId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = modules.filter(m => m.id !== modId);
    saveModules(filtered);
    if (activeModuleId === modId) {
      setActiveModuleId(null);
    }
    showToast('🗑️ 分类材料库已清退归档！');
  };

  // Trigger file upload (evoke local picker)
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle uploaded files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // If uploading while viewing a folder, drop there. Otherwise, default to the first module
    const destinationId = activeModuleId || (modules[0]?.id);
    if (!destinationId) {
      showToast('⚠️ 暂无任何材料分类库，请先新建材料库大类！');
      return;
    }

    const targetModule = modules.find(m => m.id === destinationId);
    if (!targetModule) return;

    const fileObjects: MaterialFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = f.name.split('.').pop()?.toLowerCase();
      let type: 'pdf' | 'spreadsheet' | 'doc' | 'image' | 'other' = 'other';
      if (ext === 'pdf') type = 'pdf';
      else if (['xlsx', 'xls', 'csv'].includes(ext || '')) type = 'spreadsheet';
      else if (['docx', 'doc', 'txt'].includes(ext || '')) type = 'doc';
      else if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || '')) type = 'image';

      const sizeStr = f.size > 1024 * 1024 
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(f.size / 1024).toFixed(0)} KB`;

      fileObjects.push({
        id: `file-${Date.now()}-${i}`,
        name: f.name,
        size: sizeStr,
        uploadDate: new Date().toISOString().split('T')[0],
        type
      });
    }

    const updated = modules.map(m => {
      if (m.id === destinationId) {
        return {
          ...m,
          files: [...fileObjects, ...m.files]
        };
      }
      return m;
    });

    saveModules(updated);
    showToast(`✅ 成功向「${targetModule.title}」上传了 ${fileObjects.length} 份本地材料。`);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete file inside a module
  const handleDeleteFile = (modId: string, fileId: string) => {
    const updated = modules.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          files: m.files.filter(f => f.id !== fileId)
        };
      }
      return m;
    });
    saveModules(updated);
    showToast('🗑️ 文件材料下载凭证已安全腾退。');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'doc':
        return <File className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-indigo-500" />;
      default:
        return <Paperclip className="w-5 h-5 text-slate-400" />;
    }
  };

  // Calculate used space based on count of files to mimic "已用空间: 29.49KB / 1GB"
  const totalFilesCount = modules.reduce((acc, m) => acc + m.files.length, 0);
  const simulatedUsedSpace = (totalFilesCount * 3.12 + 10.4).toFixed(2);

  // Filter modules based on query (if showing all) or filter files in active module
  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeModule = modules.find(m => m.id === activeModuleId) || null;
  const filteredFiles = activeModule 
    ? activeModule.files.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6" id="materials-library-panel">
      {/* Hidden file selector remains mounted regardless of view state */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        className="hidden" 
      />

      {/* 
        TOP HEADER PLATFORM - IMAGE 1 MATCHING
        Features title, disk memory usage indicator, and actions that hide in detail-view
      */}
      {activeModuleId === null && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">材料库</h1>
            </div>
            <p className="text-xs text-slate-400 font-bold">查看及沉淀您自主拥有的各项知识资源、创研大纲、佐证文件材料。</p>
          </div>

          {/* Disk space & Action triggers */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Storage tracker */}
            <div className="text-right space-y-1 shrink-0">
              <div className="text-[10px] font-black text-slate-500">
                已用空间：<strong className="text-slate-700 font-mono font-black">{simulatedUsedSpace} KB</strong> / 1GB
              </div>
              <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (parseFloat(simulatedUsedSpace) / 1000) * 100)}%` }} 
                />
              </div>
            </div>

            {/* New Knowledge Base Trigger */}
            <button
              onClick={() => setIsNewModuleModalOpen(true)}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#0045c4]/30 hover:border-[#0045c4]/60 text-[#0045c4] text-xs font-black rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              新建材料库
            </button>

            {/* Upload button replacing the New Dropdown, clicks directly to awake local file selection */}
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 bg-[#0045c4] hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
              <span>上传</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        DASHBOARD VIEW MODES
        Case A: All database cards are listed in the modular Image 2 styled grid layout.
        Case B: Clicked into one folder to drill-down files lists, with smooth back-triggers.
      */}
      {activeModuleId === null ? (
        <div className="space-y-6">
          {/* Section info row + search box matching screenshot 2 */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-black text-slate-800 tracking-tight">全部材料库</span>
            
            {/* Search Box on Right */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索材料库..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-350 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 outline-none transition-all"
              />
            </div>
          </div>

          {/* 
            GORGEOUS GRID OF CARD COVERS (Matching exact aspect & graphics in image 2) 
          */}
          {filteredModules.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredModules.map((mod) => {
                const filesCount = mod.files.length;
                return (
                  <motion.div
                    key={mod.id}
                    layoutId={`mod-card-${mod.id}`}
                    onClick={() => {
                      setActiveModuleId(mod.id);
                      setSearchQuery(''); // reset sub query
                    }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-sm flex flex-col justify-between p-4 border border-slate-200/40 select-none bg-slate-900"
                  >
                    {/* Background styled gradient representing a premium book cover */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br z-0 transition-transform duration-300 group-hover:scale-105", mod.coverStyle)} />
                    
                    {/* Subtle vector grid accent on cover */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

                    {/* Top layout decoration overlay */}
                    <div className="flex items-center justify-end relative z-10">

                      {/* Controls overlay: Pin indicator */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => togglePin(mod.id, e)}
                          className={cn(
                            "p-1 rounded-md transition-all",
                            mod.pinned ? "text-amber-400 bg-amber-400/10" : "text-white/60 hover:text-white hover:bg-white/10"
                          )}
                          title="固顶/取消固定"
                        >
                          <Pin className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Book Cover Typography Layout (Center or focused down) */}
                    <div className="space-y-2 mt-auto relative z-10">
                      <h3 className="text-sm font-black text-white leading-snug tracking-tight drop-shadow-md group-hover:text-blue-200 transition-colors">
                        {mod.title}
                      </h3>
                      
                      <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed drop-shadow">
                        {mod.description}
                      </p>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-white/50">
                        <span>资料库容量</span>
                        <span className="text-white font-black">{filesCount} 份要件</span>
                      </div>
                    </div>

                    {/* Hover settings drawer button decoration at bottom */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 z-20 bg-black/30 backdrop-blur-md p-1 rounded-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`⚠️ 确定要清退整个「${mod.title}」资料分类吗？此操作将移除其下备份文件。`)) {
                            handleDeleteModule(mod.id, e);
                          }
                        }}
                        className="text-white hover:text-rose-400 p-0.5"
                        title="清退分类"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}

              {/* DUMMY DESIGN PREVIEW PLACEHOLDERS (To replicate the magnificent feeling of Image 2) */}
              <div 
                onClick={() => setIsNewModuleModalOpen(true)}
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#0045c4]/60 cursor-pointer flex flex-col items-center justify-center p-6 text-center text-slate-400 hover:text-[#0045c4] bg-slate-50/50 hover:bg-[#0045c4]/5 transition-all group"
              >
                <FolderPlus className="w-8 h-8 opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all mb-2" />
                <h4 className="text-xs font-black">新建材料库分类</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1 leading-normal max-w-[150px]">定制化您的科技商业知识归纳箱</p>
              </div>

            </div>
          ) : (
            <div className="h-[300px] border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-slate-50">
              <Archive className="w-10 h-10 text-slate-400 mb-2 animate-bounce" />
              <h4 className="text-xs font-black text-slate-700">没有查找到任何匹配的材料库</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-sm">请修改筛选字词，或直接点击上方新建材料库按钮。</p>
            </div>
          )}
        </div>
      ) : (
        /* 
          CASE B: DRILL DOWN FILE DETAILS INSIDE SELECTED KNOWLEDGE BASE
          Features nested directory layout, uploading new items directly into active categories, and downloading documents.
        */
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 bg-slate-50/40 rounded-3xl border border-slate-100 p-6"
        >
          {/* Back button and current position breadcrumbs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => {
                setActiveModuleId(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-black cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回全部材料库</span>
            </button>

            {/* Micro-upload button to provide handy file addition inside folders */}
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-1.5 text-xs text-white bg-[#0045c4] hover:bg-blue-700 font-black cursor-pointer px-4.5 py-1.5 rounded-xl shadow-md shadow-blue-500/10 active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>上传材料</span>
            </button>
          </div>

          <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-black text-slate-800">材料文件归集明细</h3>
                  <p className="text-[10px] text-slate-400 font-bold">包含如下已存入材料库的营业凭证与科技资格佐证件</p>
                </div>

                {/* Sub Folder Search input styling */}
                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="在当前目录下检索文件名..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 outline-none focus:border-[#0045c4] focus:ring-1 focus:ring-[#0045c4]/10 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Dynamic list rendering */}
              <div className="space-y-3 min-h-[250px]">
                {filteredFiles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => setPreviewFile(file)}
                        className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all group shadow-sm cursor-pointer hover:translate-x-0.5"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50/55 transition-colors shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-black text-slate-700 truncate group-hover:text-[#0045c4]" title={file.name}>
                              {file.name}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                              <span>大小: <strong className="font-mono text-slate-500">{file.size}</strong></span>
                              <span>•</span>
                              <span>上传期: <strong className="font-mono text-slate-500">{file.uploadDate}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive download/delete/preview controllers */}
                        <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 hover:bg-slate-50 text-[#0045c4] rounded-lg transition-colors cursor-pointer"
                            title="在线查验预览"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => showToast(`💾 成功模拟下载归档材料: ${file.name}`)}
                            className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="查验下载"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(activeModule.id, file.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="清退文件"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[250px] border border-dashed border-slate-200 bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
                      <Archive className="w-5 h-5" />
                    </div>
                    <h5 className="text-xs font-black text-slate-700">没有包含该关键词的文件记录</h5>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">请重新输入或使用上面的上传按钮注入新的科技要件！</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
      )}

      {/* 
        MODAL DIALOG: NEW MODULE SPECIFICATION (Opening on click to enter module name & select covers)
      */}
      <AnimatePresence>
        {isNewModuleModalOpen && (
          <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModuleModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 z-[2600]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-[#0045c4]" />
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">自定义新建材料库分类</h3>
                </div>
                <button
                  onClick={() => setIsNewModuleModalOpen(false)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateModuleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 block">材料库大类名称 <span className="text-rose-500">*必填</span></label>
                  <input
                    type="text"
                    required
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="例如：战略Strategy / 产品研发规范..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0045c4] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 block">材料库简介与要件描述 (选填)</label>
                  <textarea
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    rows={2}
                    placeholder="描述该材料分类归档的方向与科技诊断功能..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0045c4] focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none resize-none leading-relaxed transition-all"
                  />
                </div>

                {/* Cover presets selector matching screenshot 2 colorful vibes */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 block">选择材料库书籍封面背景色</label>
                  <div className="grid grid-cols-5 gap-2">
                    {COVER_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPresetIndex(idx)}
                        className={cn(
                          "aspect-[3/4] rounded-lg relative overflow-hidden flex flex-col items-center justify-center cursor-pointer border border-slate-200 transition-all",
                          selectedPresetIndex === idx ? "ring-4 ring-blue-500/20 scale-105 border-[#0045c4]" : "opacity-80 hover:opacity-100"
                        )}
                      >
                        <div className={cn("absolute inset-0 bg-gradient-to-br", preset.style)} />
                        <span className="text-[8px] font-black text-white relative z-10 leading-none filter drop-shadow">
                          {preset.label}
                        </span>
                        {selectedPresetIndex === idx && (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewModuleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black bg-[#0045c4] hover:bg-blue-700 text-white transition-all cursor-pointer shadow-md"
                  >
                    保存并立即创建
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        HIGH-FIDELITY FILE & IMAGE VIEWER LIGHTBOX MODAL
        Provides interactive simulated previews for images, pdfs, and spreadsheets dynamically as requested.
      */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-[3500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewFile(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0b101d] text-slate-100 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 z-[3600] flex flex-col max-h-[90vh]"
            >
              {/* Lightbox Header */}
              <div className="p-4 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-slate-850 rounded-xl shrink-0 border border-slate-800">
                    {getFileIcon(previewFile.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-slate-200 truncate pr-4">{previewFile.name}</h3>
                    <p className="text-[10px] text-slate-450 font-bold font-mono">
                      分类：{activeModule?.title} • 大小：{previewFile.size} • 上传于 {previewFile.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast(`💾 成功触发下载原件：${previewFile.name}`);
                      setPreviewFile(null);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="下载本地"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lightbox Body Pane */}
              <div className="p-6 overflow-y-auto bg-slate-950 flex-1 flex flex-col items-center justify-center min-h-[400px]">
                {previewFile.type === 'image' && (
                  <div className="w-full max-w-lg aspect-[4/3] rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-950 to-indigo-950 border border-slate-800/80 p-6 flex flex-col justify-between relative overflow-hidden select-none shadow-2xl">
                    {/* Matrix grid backdrop */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                    
                    {/* Top Watermark / Digital Seal */}
                    <div className="flex justify-between items-start relative z-10 w-full mb-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
                          ★ 官方原始要件 ★
                        </span>
                        <h4 className="text-[11px] font-mono text-slate-400 tracking-wider">BOCHUANG DIGITAL ARCHIVES</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 rotate-12">
                        <Lock className="w-5 h-5 text-indigo-400" />
                      </div>
                    </div>

                    {/* Middle Certificate layout mimicking a license image details */}
                    <div className="my-auto space-y-4 text-center relative z-10">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">FILE ATTESTATION STAMP</span>
                        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400 tracking-tight leading-none">
                          博创数智 · 电子凭证核验单
                        </h2>
                      </div>
                      
                      <div className="max-w-xs mx-auto py-3 px-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-left space-y-1.5 backdrop-blur-sm">
                        <div className="text-[9px] text-slate-400 flex justify-between font-mono">
                          <span>证件名称：</span>
                          <span className="text-slate-200 font-bold truncate pr-3">{previewFile.name}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between font-mono">
                          <span>核验码 ID：</span>
                          <span className="text-blue-400 font-black">BC-VERIFY-{previewFile.id.toUpperCase()}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 flex justify-between font-mono">
                          <span>授章级别：</span>
                          <span className="text-emerald-400 font-bold">A-Level 高级数字校验</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom visual signature stamps */}
                    <div className="flex items-end justify-between border-t border-slate-900 pt-4 relative z-10 w-full">
                      <div className="space-y-0.5 text-left text-[9px] font-mono text-slate-450">
                        <div>校验源: bochuang_core_engine</div>
                        <div>时间戳: {previewFile.uploadDate} 08:30:00</div>
                      </div>
                      
                      {/* Red stamp decoration */}
                      <div className="relative flex items-center justify-center mr-2">
                        <div className="w-14 h-14 rounded-full border-2 border-dashed border-rose-500/60 flex items-center justify-center rotate-12 bg-rose-500/[0.04] text-[8px] font-black text-rose-500 text-center leading-tight">
                          已核准件<br />博创数字
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewFile.type === 'pdf' && (
                  <div className="w-full max-w-lg aspect-[3/4] rounded-2xl bg-white text-slate-850 p-6 flex flex-col justify-between border border-slate-200 shadow-2xl relative">
                    <div className="space-y-4">
                      {/* Document Header */}
                      <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-start">
                        <div className="space-y-1">
                          <h1 className="text-base font-extrabold text-slate-900">博创数智专项证明文书</h1>
                          <p className="text-[9px] text-slate-450 font-bold tracking-tight">归属分类：{activeModule?.title}</p>
                        </div>
                        <span className="text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded font-mono">PDF DOCUMENT</span>
                      </div>

                      {/* Content sections */}
                      <div className="space-y-3 pt-2 text-[11px] leading-relaxed text-slate-700">
                        <div className="font-bold text-slate-900 mb-1">■ 核心内容摘要</div>
                        <p>
                          关于报送 <strong className="text-slate-900 font-extrabold">{previewFile.name}</strong> 
                          的各项合规检查已经全部核验通过。调档范围覆盖该企业资产结构、商业计划及知识产权分类，内容真实可靠。
                        </p>
                        <p>
                          特此证明。该备份扫描件由项目经理于 <strong>{previewFile.uploadDate}</strong> 手动归档录入系统，已进入博创网防伪档案库，具备内审调阅效力。
                        </p>
                      </div>

                      {/* Mocked structural ledger table */}
                      <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden text-[9px]">
                        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-1.5 font-bold text-slate-700">
                          <span>审核事项</span>
                          <span>合规等级</span>
                          <span>验证结论</span>
                        </div>
                        <div className="grid grid-cols-3 p-1.5 border-b border-slate-100">
                          <span>主体资质</span>
                          <span className="text-emerald-600 font-bold">Class AAA</span>
                          <span>准予公开</span>
                        </div>
                        <div className="grid grid-cols-3 p-1.5">
                          <span>信息披露</span>
                          <span className="text-[#0045c4] font-bold">完全披露</span>
                          <span>建议置顶</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between border-t border-slate-200 pt-4 text-[9px] text-slate-400">
                      <div>内查号: BC-PDF-{previewFile.id.substring(5,13)}</div>
                      <div className="w-12 h-12 rounded-full border-2 border-red-500/40 text-red-500 flex items-center justify-center scale-95 rotate-12 select-none font-black text-[9px]">
                        博创数智
                      </div>
                    </div>
                  </div>
                )}

                {previewFile.type === 'spreadsheet' && (
                  <div className="w-full max-w-xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-black text-slate-800">数据库结构表格预览: {previewFile.name}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-black">EXCEL STATS</span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-[10px] text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                            <th className="p-2 border-r">报表项</th>
                            <th className="p-2 border-r text-right">第一季度 (Q1)</th>
                            <th className="p-2 border-r text-right">第二季度 (Q2)</th>
                            <th className="p-2 text-right">半年度总计</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium">
                          <tr>
                            <td className="p-2 border-r bg-slate-50/50 font-bold">自研交通微系统经费</td>
                            <td className="p-2 border-r text-right font-mono">¥4,120,000</td>
                            <td className="p-2 border-r text-right font-mono">¥5,460,000</td>
                            <td className="p-2 text-right font-mono font-bold text-blue-600">¥9,580,000</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-r bg-slate-50/50 font-bold">OmniTraffic 业务营收</td>
                            <td className="p-2 border-r text-right font-mono">¥1,850,000</td>
                            <td className="p-2 border-r text-right font-mono">¥2,400,000</td>
                            <td className="p-2 text-right font-mono font-bold text-emerald-600">¥4,250,000</td>
                          </tr>
                          <tr className="bg-slate-50/80 font-bold">
                            <td className="p-2 border-r font-black">博创智融估算余额</td>
                            <td className="p-2 border-r text-right font-mono">¥12,450,000</td>
                            <td className="p-2 border-r text-right font-mono">¥15,800,000</td>
                            <td className="p-2 text-right font-mono font-black text-slate-900">¥28,250,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="text-[9px] text-slate-400 text-center font-bold">
                      * 自主归集成底材料：数据信息已通过博创云区块链核查鉴证无误。
                    </div>
                  </div>
                )}

                {previewFile.type !== 'image' && previewFile.type !== 'pdf' && previewFile.type !== 'spreadsheet' && (
                  <div className="w-full max-w-sm bg-slate-900/40 p-6 rounded-2xl border border-slate-800 text-center space-y-2.5">
                    <Paperclip className="w-8 h-8 text-indigo-400 mx-auto" />
                    <h5 className="text-xs font-black text-slate-200">文档调档中</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
                      该「.doc」或文本资料已生成云端核验标记。点击右上角下载图标可快速获取原始材料文件。
                    </p>
                  </div>
                )}
              </div>

              {/* Lightbox Footer text decoration */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-[9px] text-slate-500 font-mono tracking-wider">
                SECURED BY BOCHUANG DIGITAL CERTIFICATION SERVICES
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION STREAM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[3000] bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-800"
          >
            <div className="w-4.5 h-4.5 rounded-full bg-[#0045c4] flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
            </div>
            <p className="text-[10px] font-black tracking-wide leading-none">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

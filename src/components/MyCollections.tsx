import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, FileText, TrendingUp, Zap, Clock, Search, Trash2, 
  ExternalLink, ChevronRight, Bookmark, Archive, FolderOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CollectionItem {
  id: string;
  title: string;
  category: 'policy' | 'investment' | 'industry' | 'document';
  categoryName: string;
  source: string;
  savedAt: string;
  description: string;
}

export function MyCollections() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'policy' | 'investment' | 'industry' | 'document'>('all');
  
  const [items, setItems] = useState<CollectionItem[]>([
    {
      id: 'col-1',
      title: '数字经济算力基础设施普惠申领与补贴指南',
      category: 'policy',
      categoryName: '政策解读',
      source: '数据与工业信息化部 · 国家发展改革委',
      savedAt: '2026-06-05 10:20',
      description: '您的数字孪生与实空间建模高新技术草案在专利指标上对标吻合度极佳，可申请算力免申优惠。'
    },
    {
      id: 'col-2',
      title: '红杉数智未来探索专项成长基金开放本季度投资申报渠道',
      category: 'investment',
      categoryName: '投资机会',
      source: '红杉中国 (Sequoia Capital) 投资办投后系统',
      savedAt: '2026-06-04 14:15',
      description: '红杉正在寻找拥有核心算法及落地订单的硬科技。您的大赛草案符合其Pre-A至B轮主要范围。'
    },
    {
      id: 'col-3',
      title: '麦肯锡：2026年全球智能体（AI Agent）软件订阅模式迎来爆发期',
      category: 'industry',
      categoryName: '行业前沿',
      source: 'McKinsey Global Institute Tech Trends Pro 2026',
      savedAt: '2026-06-03 09:40',
      description: '全球Gartner与麦肯锡最新科技前沿指出，80%的企业配合自动化采购结算，可在材料中融合说明。'
    },
    {
      id: 'col-4',
      title: '促进大模型底座在专精特新企业中重叠发展的税收支持政策',
      category: 'policy',
      categoryName: '政策解读',
      source: '国家税务总局、科技部高新技术联合宣讲文件',
      savedAt: '2026-06-01 16:30',
      description: '拥有至少1项算法软著、上年度研发投入总额占比10%的企业，享受最高200%研发费用加计全损扣除。'
    }
  ]);

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="my_collections_panel_container">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>我的收藏</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
            My Bookmarked Opportunities & Trends
          </p>
        </div>
        
        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索您收藏的政策、机会..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-[#0A66FF] rounded-xl outline-none transition-all"
          />
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 w-fit">
        {[
          { id: 'all', title: '全部收藏', count: items.length },
          { id: 'policy', title: '政策解读', count: items.filter(i => i.category === 'policy').length },
          { id: 'investment', title: '投资机会', count: items.filter(i => i.category === 'investment').length },
          { id: 'industry', title: '行业前沿', count: items.filter(i => i.category === 'industry').length }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border",
              activeCategory === cat.id
                ? "bg-white text-slate-950 border-slate-100 shadow-sm font-black"
                : "bg-transparent border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <span>{cat.title}</span>
            <span className={cn(
              "text-[9px] px-1.5 py-0.2 rounded-full font-bold",
              activeCategory === cat.id ? "bg-blue-50 text-blue-600" : "bg-slate-200/50 text-slate-400"
            )}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main scannable Table/Row view */}
      {filteredItems.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden divide-y divide-slate-150">
          {filteredItems.map(item => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/30 transition-all group">
              <div className="flex items-start gap-4">
                {/* Category line icon representation instead of pictures */}
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border",
                  item.category === 'policy' ? "bg-blue-50 border-blue-100 text-[#0045c4]" :
                  item.category === 'investment' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                  item.category === 'industry' ? "bg-indigo-50 border-indigo-100 text-indigo-600" :
                  "bg-slate-50 border-slate-200 text-slate-600"
                )}>
                  {item.category === 'policy' ? <FileText className="w-5 h-5" /> :
                   item.category === 'investment' ? <TrendingUp className="w-5 h-5" /> :
                   item.category === 'industry' ? <Zap className="w-5 h-5" /> :
                   <Archive className="w-5 h-5" />}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                      item.category === 'policy' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      item.category === 'investment' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      item.category === 'industry' ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                      "bg-slate-50 text-slate-400"
                    )}>
                      {item.categoryName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      收藏于：{item.savedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-bold flex flex-wrap items-center gap-2 leading-relaxed">
                    <span>{item.description}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#0045c4] bg-slate-100/85 border border-slate-200/60 px-2 py-0.5 rounded font-bold">
                      <span className="w-1 h-1 rounded-full bg-[#0045c4]" />
                      信息来源：{item.source}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  title="取消收藏"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>查看详情</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50/40 border border-dashed border-slate-200 rounded-2xl py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-500">
            暂无相关收藏内容
          </p>
          <p className="text-[11px] text-slate-400">
            当您浏览核心情报站或者资源推荐时，点击收藏图标会将其保存在这里。
          </p>
        </div>
      )}
    </div>
  );
}

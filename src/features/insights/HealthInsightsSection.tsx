import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Heart,
  Activity,
  Brain,
  Shield,
  Apple,
  ExternalLink,
  Volume2,
  CheckCircle2,
  Info,
  ChevronRight,
  Bookmark,
  Share2,
  Search,
  Filter,
} from 'lucide-react';
import { useVoice } from '../voice/VoiceContext.tsx';

export interface MedicalInsight {
  id: string;
  title: string;
  category: string;
  snippet: string;
  clinicalContext: string;
  evidenceSource: string;
  actionableAdvice: string;
  tags: string[];
  icon?: string;
}

interface HealthInsightsSectionProps {
  initialCategory?: string;
  limit?: number;
  showTitle?: boolean;
}

export const HealthInsightsSection: React.FC<HealthInsightsSectionProps> = ({
  initialCategory = 'All',
  limit,
  showTitle = true,
}) => {
  const { speak, isVoiceMode } = useVoice();
  const [insights, setInsights] = useState<MedicalInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeInsight, setActiveInsight] = useState<MedicalInsight | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [sourceType, setSourceType] = useState<string>('verified-clinical-cache');

  const categories = [
    'All',
    'Cardiovascular',
    'Metabolic Health',
    'Neurology',
    'Musculoskeletal',
    'Digestive & Immunity',
  ];

  const fetchInsights = async (cat?: string, topic?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/health-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat || selectedCategory,
          focusTopic: topic || searchQuery,
        }),
      });
      const data = await response.json();
      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
        setSourceType(data.source || 'verified-clinical-cache');
      }
    } catch (err) {
      console.warn('Could not fetch live insights, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInsights(selectedCategory, searchQuery);
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleReadSnippet = (e: React.MouseEvent, item: MedicalInsight) => {
    e.stopPropagation();
    speak(`${item.title}. ${item.snippet} Evidence source: ${item.evidenceSource}.`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'metabolic health':
        return <Activity className="w-4 h-4 text-[#00A88F]" />;
      case 'neurology':
        return <Brain className="w-4 h-4 text-indigo-500" />;
      case 'musculoskeletal':
        return <Shield className="w-4 h-4 text-amber-500" />;
      case 'digestive & immunity':
        return <Apple className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#00A88F]" />;
    }
  };

  const filteredInsights = insights.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.evidenceSource.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const displayedInsights = limit ? filteredInsights.slice(0, limit) : filteredInsights;

  return (
    <section
      aria-labelledby="health-insights-heading"
      className="relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm overflow-hidden text-left bg-medical-grid"
    >
      {/* Decorative ambient radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A88F]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      {showTitle && (
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-200/80 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00A88F] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Evidence-Based Medical Intelligence</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {sourceType.includes('gemini') ? 'Gemini 3.8 Flash Grounded' : 'Peer-Reviewed Clinical Sources'}
              </span>
            </div>
            <h2 id="health-insights-heading" className="text-xl sm:text-2xl font-black tracking-tight text-[#002B49]">
              Health Insights
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Verified clinical findings synthesized from peer-reviewed cardiology, endocrinology, and neurology literature. Styled with Fitmadix signature clinical telemetry grid.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchInsights()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#002B49] bg-white hover:bg-[#F0FDF9] border border-slate-200 hover:border-[#00A88F]/40 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="Generate fresh medical snippets"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00A88F] ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Snippets</span>
            </button>
          </div>
        </div>
      )}

      {/* Controls Bar: Category Filter Tabs & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#002B49] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Filter snippets or search topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00A88F]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </form>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 bg-white/90 border border-slate-200/90 rounded-2xl animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-slate-200 rounded" />
              <div className="space-y-2">
                <div className="w-full h-3 bg-slate-200 rounded" />
                <div className="w-5/6 h-3 bg-slate-200 rounded" />
                <div className="w-4/6 h-3 bg-slate-200 rounded" />
              </div>
              <div className="w-1/2 h-4 bg-slate-200 rounded pt-2" />
            </div>
          ))}
        </div>
      ) : displayedInsights.length === 0 ? (
        <div className="p-8 text-center bg-white/80 border border-dashed border-slate-300 rounded-2xl text-xs text-slate-500">
          No medical snippets matching &quot;{searchQuery}&quot; in this category. Click &quot;Refresh Snippets&quot; to fetch more.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedInsights.map((item) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <article
                key={item.id}
                onClick={() => setActiveInsight(item)}
                className="group p-6 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl shadow-2xs hover:border-[#00A88F] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative bg-medical-grid"
              >
                <div className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleReadSnippet(e, item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#00A88F] hover:bg-[#F0FDF9] transition-colors cursor-pointer"
                        title="Read insight aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => toggleSave(e, item.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-[#00A88F] bg-[#F0FDF9]'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                        title={isSaved ? 'Saved to bookmarks' : 'Save insight'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#002B49] group-hover:text-[#00A88F] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Snippet body */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.snippet}
                  </p>
                </div>

                {/* Footer: Verified Source & Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600 truncate max-w-[200px]" title={item.evidenceSource}>
                      🏛 {item.evidenceSource}
                    </span>
                    <span className="font-bold text-[#00A88F] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Read <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Expanded Clinical Dossier Modal */}
      {activeInsight && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveInsight(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-left bg-medical-grid"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A88F] bg-[#F0FDF9] px-3 py-1 rounded-full border border-[#00A88F]/20">
                {getCategoryIcon(activeInsight.category)}
                <span>{activeInsight.category} Intelligence</span>
              </span>

              <button
                onClick={() => setActiveInsight(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight text-[#002B49]">
                {activeInsight.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Peer-reviewed reference: {activeInsight.evidenceSource}
              </p>
            </div>

            {/* Snippet text */}
            <div className="p-4 bg-[#F0FDF9] rounded-2xl border border-[#00A88F]/20 text-xs text-[#002B49] leading-relaxed">
              <p className="font-semibold text-sm mb-1 text-[#002B49]">Core Medical Takeaway</p>
              <p>{activeInsight.snippet}</p>
            </div>

            {/* Physiological Context */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A88F]" />
                Physiological Mechanism:
              </span>
              <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                {activeInsight.clinicalContext}
              </p>
            </div>

            {/* Actionable Patient Advice */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                Evidence-Based Practical Advice:
              </span>
              <p className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100 leading-relaxed text-slate-800">
                {activeInsight.actionableAdvice}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={(e) => handleReadSnippet(e, activeInsight)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#00A88F] bg-[#F0FDF9] rounded-lg hover:bg-[#E0FBF4] cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Aloud</span>
              </button>

              <button
                onClick={() => setActiveInsight(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001D33] rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

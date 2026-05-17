import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useBusiness } from '../context/BusinessContext';
import { 
  Search, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  Plus, 
  Trash2, 
  Cpu, 
  ShieldCheck, 
  Flame, 
  Globe, 
  AlertTriangle,
  Award,
  Zap,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Link2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#8B5CF6', '#3B82F6', '#06B6D4', '#F59E0B', '#10B981'];

const CompetitorAnalysis = () => {
  const { businessData } = useBusiness();
  
  // State for competitors list
  const [competitors, setCompetitors] = useState([
    { name: '', website_url: '', social_posts: '' }
  ]);
  const [userWebsite, setUserWebsite] = useState(businessData.website || '');
  const [industry, setIndustry] = useState(businessData.industry || '');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState('side-by-side'); 
  const [error, setError] = useState(null);

  // Load from Business Context immediately on boot
  useEffect(() => {
    if (businessData.competitors || businessData.competitorLinks) {
      const names = businessData.competitors 
        ? businessData.competitors.split(',').map(n => n.trim()) 
        : [];
      const links = businessData.competitorLinks 
        ? businessData.competitorLinks.split(',').map(l => l.trim()) 
        : [];

      const initialCompetitors = [];
      const maxLength = Math.max(names.length, links.length);

      for (let i = 0; i < maxLength; i++) {
        if (names[i] || links[i]) {
          initialCompetitors.push({
            name: names[i] || `Competitor ${i + 1}`,
            website_url: links[i] || 'example.com',
            social_posts: ''
          });
        }
      }

      if (initialCompetitors.length > 0) {
        setCompetitors(initialCompetitors);
      }
    }
  }, [businessData]);

  const loadingSteps = [
    "Scanning competitor website structure...",
    "Reading keywords, headings, and description tags...",
    "Running simple search-readiness checklist...",
    "Measuring mobile page loading speed and response time...",
    "Analyzing marketing strategy using AI model...",
    "Cross-referencing keywords with seasonal trends...",
    "Building your custom comparison reports..."
  ];

  const handleAddCompetitor = () => {
    if (competitors.length < 3) {
      setCompetitors([...competitors, { name: '', website_url: '', social_posts: '' }]);
    }
  };

  const handleRemoveCompetitor = (index) => {
    const updated = [...competitors];
    updated.splice(index, 1);
    setCompetitors(updated);
  };

  const handleCompetitorChange = (index, field, value) => {
    const updated = [...competitors];
    updated[index][field] = value;
    setCompetitors(updated);
  };

  const runAnalysis = async () => {
    // Validate inputs
    for (const comp of competitors) {
      if (!comp.name.trim() || !comp.website_url.trim()) {
        setError("Please enter both a Name and Website URL for all competitors.");
        return;
      }
    }

    setError(null);
    setLoading(true);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 2000);

    try {
      const payload = {
        competitors: competitors.map(c => ({
          name: c.name,
          website_url: c.website_url,
          social_posts: c.social_posts ? c.social_posts.split('\n').filter(p => p.trim()) : []
        })),
        user_website_url: userWebsite || null,
        industry: industry || null,
        user_usp: businessData.usp || null,
        user_audience: businessData.audienceType ? businessData.audienceType[0] : null,
        user_brand_tone: businessData.tone ? businessData.tone[0] : null
      };

      const response = await axios.post('http://127.0.0.1:8000/api/analyze-competitor', payload);
      setAnalysisResult(response.data);
      setActiveTab('side-by-side');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Could not connect to analysis engine. Make sure the backend server is running.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Simplified chart comparison data: Side-by-Side Bar Chart
  const getSimpleComparisonData = () => {
    if (!analysisResult) return [];

    const dataPoints = [];

    // Add user data if available
    if (analysisResult.user_analysis) {
      const u = analysisResult.user_analysis;
      dataPoints.push({
        name: 'You (Baseline)',
        'SEO Score': u.seo_score?.total_score || 0,
        'Loading Speed': u.pagespeed?.performance_score || 0,
        'Image Alt %': u.scraped_data?.image_count > 0 
          ? Math.round((u.scraped_data.images_with_alt / u.scraped_data.image_count) * 100)
          : 100
      });
    }

    // Add competitors
    analysisResult.competitors.forEach(c => {
      dataPoints.push({
        name: c.competitor_name,
        'SEO Score': c.seo_score?.total_score || 0,
        'Loading Speed': c.pagespeed?.performance_score || 0,
        'Image Alt %': c.scraped_data?.image_count > 0
          ? Math.round((c.scraped_data.images_with_alt / c.scraped_data.image_count) * 100)
          : 100
      });
    });

    return dataPoints;
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Title Header */}
      <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-accent text-white shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-300 animate-pulse" size={24} />
            <span className="text-sm font-bold uppercase tracking-wider text-white/80">Easy Competitor Analysis</span>
          </div>
          <h2 className="text-4xl font-extrabold mb-4">Compare Your Competitors</h2>
          <p className="text-white/95 text-base leading-relaxed">
            See exactly how your competitor's marketing measures up against yours. We've automatically imported your competitors and baseline details from your <strong>Business Profile</strong> so you can start comparing with a single click.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Cpu size={320} />
        </div>
      </section>

      {/* Input Section */}
      <AnimatePresence mode="wait">
        {!analysisResult && !loading && (
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 glass-card p-8 space-y-8">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Search className="text-accent-start" size={24} />
                  Your Competitors List
                </h3>
                <button 
                  onClick={handleAddCompetitor}
                  disabled={competitors.length >= 3}
                  className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm disabled:opacity-30"
                >
                  <Plus size={16} /> Add Competitor ({competitors.length}/3)
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2 text-sm">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {competitors.map((comp, index) => (
                  <motion.div 
                    layout
                    key={index}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 relative"
                  >
                    {competitors.length > 1 && (
                      <button 
                        onClick={() => handleRemoveCompetitor(index)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-400 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <h4 className="text-lg font-bold text-accent-start flex items-center gap-2">
                      <ChevronRight size={18} /> Competitor #{index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Brand Name</label>
                        <input 
                          type="text"
                          value={comp.name}
                          onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                          placeholder="e.g. Blue Bottle Coffee"
                          className="glass-input w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Website Link</label>
                        <input 
                          type="text"
                          value={comp.website_url}
                          onChange={(e) => handleCompetitorChange(index, 'website_url', e.target.value)}
                          placeholder="e.g. bluebottlecoffee.com"
                          className="glass-input w-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Side Options Panel */}
            <div className="space-y-8">
              <div className="glass-card p-8 bg-accent-start/5 border-accent-start/20 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="text-accent-start" size={20} />
                  Your Website (Baseline)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Website Link</label>
                    <input 
                      type="text"
                      value={userWebsite}
                      onChange={(e) => setUserWebsite(e.target.value)}
                      placeholder="e.g. mycoffeeshop.com"
                      className="glass-input w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Industry Niche</label>
                    <input 
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Coffee"
                      className="glass-input w-full"
                    />
                  </div>
                </div>
                <button 
                  onClick={runAnalysis}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  <Cpu size={20} /> Start Competitor Analysis
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Loading Progress State */}
        {loading && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 max-w-2xl mx-auto text-center space-y-8 border-accent-start/30"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-accent-start/20 border-t-accent-start animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-blue-500/10 border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse' }} />
              <div className="absolute inset-6 flex items-center justify-center">
                <Cpu className="text-accent-start animate-pulse" size={28} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Comparing Websites...</h3>
              <p className="text-gray-400 max-w-md mx-auto text-sm">
                Running direct audits on target competitor website setups and calculating SEO and loading speed baseline metrics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-accent-start font-mono text-xs max-w-sm mx-auto">
              {loadingSteps[loadingStep]}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Analysis Dashboards Display */}
      {analysisResult && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('side-by-side')}
                className={`py-2.5 px-5 rounded-xl font-bold transition-all text-sm ${
                  activeTab === 'side-by-side' ? 'bg-gradient-accent shadow-accent-glow text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                Side-by-Side View
              </button>
              {analysisResult.competitors.map((comp, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTab(idx.toString())}
                  className={`py-2.5 px-5 rounded-xl font-bold transition-all text-sm ${
                    activeTab === idx.toString() ? 'bg-gradient-accent shadow-accent-glow text-white' : 'bg-white/5 hover:bg-white/10 text-gray-400'
                  }`}
                >
                  {comp.competitor_name} Details
                </button>
              ))}
            </div>

            <button 
              onClick={() => setAnalysisResult(null)}
              className="btn-secondary py-2 px-4 text-xs font-bold"
            >
              Start New Analysis
            </button>
          </div>

          {/* TAB 1: Side by Side Matrix */}
          {activeTab === 'side-by-side' && (
            <div className="space-y-10">
              {/* Easy to Understand Comparative Bar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="text-accent-start" size={20} />
                    SEO and Speed Comparison Chart
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    This chart shows key scores for you and your competitors side-by-side. 
                    <strong> Higher columns mean better performance.</strong> Look for metrics where your competitor is scoring lower than you to find advantages!
                  </p>
                  <div className="h-[320px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getSimpleComparisonData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                        <YAxis stroke="#ffffff60" fontSize={12} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Legend />
                        <Bar dataKey="SEO Score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Loading Speed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Image Alt %" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Simplified Content Type Indicator */}
                <div className="glass-card p-8 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="text-blue-500" size={20} />
                    Content Theme Comparison
                  </h3>
                  <p className="text-xs text-gray-400">
                    See what style of copywriting your competitors focus on the most. Are they mostly selling products (Promotional) or educating users (Educational)?
                  </p>
                  <div className="space-y-6 pt-2">
                    {analysisResult.competitors.map((comp, idx) => {
                      const c = comp.content_classification;
                      if (!c) return null;
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-gray-300">{comp.competitor_name}</span>
                            <span className="text-accent-start capitalize font-mono text-[10px]">{c.primary_intent} Focused</span>
                          </div>
                          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex">
                            <div style={{ width: `${c.promotional}%` }} className="bg-purple-600 h-full" title={`Promo: ${c.promotional}%`} />
                            <div style={{ width: `${c.educational}%` }} className="bg-blue-500 h-full" title={`Edu: ${c.educational}%`} />
                            <div style={{ width: `${c.emotional}%` }} className="bg-rose-500 h-full" title={`Emo: ${c.emotional}%`} />
                            <div style={{ width: `${c.community}%` }} className="bg-emerald-500 h-full" title={`Comm: ${c.community}%`} />
                            <div style={{ width: `${c.brand_awareness}%` }} className="bg-amber-500 h-full" title={`Brand: ${c.brand_awareness}%`} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex flex-wrap gap-3 justify-center text-[9px] text-gray-400 font-bold uppercase tracking-wider pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-600" /> Sales</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Useful</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> Story</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Social</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Brand</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Side-by-Side Detail Table */}
              <div className="glass-card p-8 overflow-x-auto">
                <h3 className="text-xl font-bold mb-6">Competitor Score Overview</h3>
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-500 uppercase font-mono">
                      <th className="pb-4">Core Checks</th>
                      {analysisResult.user_analysis && <th className="pb-4 text-orange-400">You (Baseline)</th>}
                      {analysisResult.competitors.map((comp, idx) => (
                        <th key={idx} className="pb-4" style={{ color: COLORS[idx % COLORS.length] }}>{comp.competitor_name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold">Search Ready Score (SEO)</td>
                      {analysisResult.user_analysis && <td className="py-4 font-mono font-bold text-orange-400">{analysisResult.user_analysis.seo_score?.total_score || 0}/100</td>}
                      {analysisResult.competitors.map((comp, idx) => (
                        <td key={idx} className="py-4 font-mono font-bold">{comp.seo_score?.total_score || 0}/100</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold">Website Loading Speed</td>
                      {analysisResult.user_analysis && <td className="py-4 font-mono">{analysisResult.user_analysis.pagespeed?.performance_score || 'N/A'}/100</td>}
                      {analysisResult.competitors.map((comp, idx) => (
                        <td key={idx} className="py-4 font-mono">{comp.pagespeed?.performance_score || 'N/A'}/100</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold">Total Website Words</td>
                      {analysisResult.user_analysis && <td className="py-4 font-mono">{analysisResult.user_analysis.scraped_data?.word_count || 0} words</td>}
                      {analysisResult.competitors.map((comp, idx) => (
                        <td key={idx} className="py-4 font-mono">{comp.scraped_data?.word_count || 0} words</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold">Descriptive Alt Tags</td>
                      {analysisResult.user_analysis && (
                        <td className="py-4 font-mono">
                          {analysisResult.user_analysis.scraped_data?.images_with_alt || 0} of {analysisResult.user_analysis.scraped_data?.image_count || 0} images
                        </td>
                      )}
                      {analysisResult.competitors.map((comp, idx) => (
                        <td key={idx} className="py-4 font-mono">
                          {comp.scraped_data?.images_with_alt || 0} of {comp.scraped_data?.image_count || 0} images
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-bold">Main Content Type</td>
                      {analysisResult.user_analysis && <td className="py-4 text-orange-400 capitalize">Baseline</td>}
                      {analysisResult.competitors.map((comp, idx) => (
                        <td key={idx} className="py-4 font-bold text-accent-start capitalize">
                          {comp.content_classification?.primary_intent || 'General'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2+: Individual Competitor Report */}
          {activeTab !== 'side-by-side' && (
            <div className="space-y-12">
              {(() => {
                const comp = analysisResult.competitors[parseInt(activeTab)];
                if (!comp) return null;
                return (
                  <div className="space-y-12">
                    {/* Top Level Summary Badges */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* SEO Score circular widget */}
                      <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <h4 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Search Readiness (SEO)</h4>
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="transparent" 
                              stroke="#8B5CF6" 
                              strokeWidth="8" 
                              strokeDasharray={251.2}
                              strokeDashoffset={251.2 - (251.2 * (comp.seo_score?.total_score || 0)) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-extrabold">{comp.seo_score?.total_score || 0}</span>
                            <span className="text-[9px] text-gray-500 font-bold uppercase">Score</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300">
                          Passed {comp.seo_score?.passed_count} of {comp.seo_score?.total_checks} basic checkpoints.
                        </p>
                      </div>

                      {/* Speed circular widget */}
                      <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <h4 className="text-gray-400 font-bold uppercase tracking-wider text-xs">Website Speed Score</h4>
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="transparent" 
                              stroke="#3B82F6" 
                              strokeWidth="8" 
                              strokeDasharray={251.2}
                              strokeDashoffset={251.2 - (251.2 * (comp.pagespeed?.performance_score || 0)) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-extrabold text-blue-400">{comp.pagespeed?.performance_score || 0}</span>
                            <span className="text-[9px] text-gray-500 font-bold uppercase">Performance</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300">Measured loading speeds across mobile connections.</p>
                      </div>

                      {/* Content Intent description */}
                      <div className="glass-card p-8 space-y-6">
                        <h4 className="text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-white/5 pb-2">Main Writing Style</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <Sparkles size={22} />
                          </div>
                          <div>
                            <p className="text-xl font-extrabold text-purple-400 capitalize">{comp.content_classification?.primary_intent}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">Primary strategy focus</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed font-semibold bg-white/5 p-5 rounded-2xl border border-white/10">
                          "{comp.content_classification?.insight}"
                        </p>
                      </div>
                    </div>

                    {/* Simple checklist view */}
                    <div className="glass-card p-8">
                      <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-green-500" size={24} />
                        Technical SEO checklist
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {comp.seo_score?.checks.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                            {item.passed ? (
                              <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={20} />
                            ) : (
                              <XCircle className="text-red-500 mt-1 shrink-0" size={20} />
                            )}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center gap-3">
                                <span className="font-extrabold text-base text-white">{item.check_name}</span>
                                <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Passed</span>
                              </div>
                              <p className="text-sm text-gray-200 leading-relaxed font-semibold">{item.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Google Trends table */}
                    {comp.trend_gaps?.gaps.length > 0 && (
                      <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <h3 className="text-2xl font-black flex items-center gap-2">
                            <TrendingUp className="text-blue-500" size={24} />
                            Search Keyword Gaps (Google Trends)
                          </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left min-w-[600px]">
                            <thead>
                              <tr className="text-sm text-gray-300 uppercase font-extrabold tracking-wider border-b border-white/5">
                                <th className="pb-4">Trending Topic</th>
                                <th className="pb-4">Interest Growth</th>
                                <th className="pb-4">Competitor Status</th>
                                <th className="pb-4">What we should do</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                              {comp.trend_gaps.gaps.map((item, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="py-5 font-extrabold text-white text-base">{item.trending_topic}</td>
                                  <td className="py-5">
                                    <span className="font-bold font-mono text-blue-400 text-sm">{item.trend_score}% Growth</span>
                                  </td>
                                  <td className="py-5">
                                    {item.competitor_coverage ? (
                                      <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider">Covered</span>
                                    ) : (
                                      <span className="px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 text-xs font-bold uppercase tracking-wider">Not Covered (Opportunity!)</span>
                                    )}
                                  </td>
                                  <td className="py-5 text-gray-200 max-w-sm leading-relaxed font-semibold">{item.gap_insight}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* SWOT Analysis with Proof tags */}
                    {comp.swot && (
                      <div className="space-y-8">
                        <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                          <h3 className="text-2xl font-black flex items-center gap-2">
                            <Sparkles className="text-yellow-400 animate-bounce" size={26} />
                            Competitor Strengths & Weaknesses (Backed by Real Data)
                          </h3>
                          <p className="text-sm text-gray-300 leading-relaxed font-semibold">
                            No guess-work. Every bullet point is direct, verified proof from the competitor's website code and servers.
                          </p>
                        </div>

                        {/* SWOT 2x2 Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Strengths */}
                          <div className="glass-card p-6 border-green-500/15 bg-green-500/5 space-y-4">
                            <h4 className="text-base font-extrabold uppercase tracking-wider text-green-500 flex items-center gap-2">
                              <CheckCircle2 size={18} /> Strengths
                            </h4>
                            <div className="space-y-4">
                              {comp.swot.strengths.map((item, idx) => (
                                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                  <p className="text-sm font-extrabold text-white">{item.insight}</p>
                                  <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/10 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-green-400">
                                      <span className="font-black">Source Proof:</span>
                                      <span className="bg-white/10 px-2 py-0.5 rounded text-white text-[10px]">{item.evidence.source}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 leading-relaxed font-semibold">
                                      Found: <span className="text-white font-mono">"{item.evidence.value}"</span>
                                    </p>
                                    <p className="text-xs text-gray-300 font-bold uppercase leading-relaxed tracking-wide">
                                      Why it matters: {item.evidence.reason}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Weaknesses */}
                          <div className="glass-card p-6 border-red-500/15 bg-red-500/5 space-y-4">
                            <h4 className="text-base font-extrabold uppercase tracking-wider text-red-500 flex items-center gap-2">
                              <XCircle size={18} /> Weaknesses
                            </h4>
                            <div className="space-y-4">
                              {comp.swot.weaknesses.map((item, idx) => (
                                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                  <p className="text-sm font-extrabold text-white">{item.insight}</p>
                                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/10 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-red-400">
                                      <span className="font-black">Source Proof:</span>
                                      <span className="bg-white/10 px-2 py-0.5 rounded text-white text-[10px]">{item.evidence.source}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 leading-relaxed font-semibold">
                                      Found: <span className="text-white font-mono">"{item.evidence.value}"</span>
                                    </p>
                                    <p className="text-xs text-gray-300 font-bold uppercase leading-relaxed tracking-wide">
                                      Why it matters: {item.evidence.reason}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Opportunities */}
                          <div className="glass-card p-6 border-blue-500/15 bg-blue-500/5 space-y-4">
                            <h4 className="text-base font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2">
                              <Lightbulb size={18} /> Opportunities (For Us)
                            </h4>
                            <div className="space-y-4">
                              {comp.swot.opportunities.map((item, idx) => (
                                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                  <p className="text-sm font-extrabold text-white">{item.insight}</p>
                                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/10 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-blue-400">
                                      <span className="font-black">Source Proof:</span>
                                      <span className="bg-white/10 px-2 py-0.5 rounded text-white text-[10px]">{item.evidence.source}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 leading-relaxed font-semibold">
                                      Found: <span className="text-white font-mono">"{item.evidence.value}"</span>
                                    </p>
                                    <p className="text-xs text-gray-300 font-bold uppercase leading-relaxed tracking-wide">
                                      Why it matters: {item.evidence.reason}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div className="glass-card p-6 border-amber-500/15 bg-amber-500/5 space-y-4">
                            <h4 className="text-base font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                              <Zap size={18} /> Strategic Recommendations
                            </h4>
                            <div className="space-y-4">
                              {comp.swot.recommendations.map((item, idx) => (
                                <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                  <p className="text-sm font-extrabold text-white">{item.insight}</p>
                                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/10 space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-400">
                                      <span className="font-black">Source Proof:</span>
                                      <span className="bg-white/10 px-2 py-0.5 rounded text-white text-[10px]">{item.evidence.source}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 leading-relaxed font-semibold">
                                      Found: <span className="text-white font-mono">"{item.evidence.value}"</span>
                                    </p>
                                    <p className="text-xs text-gray-300 font-bold uppercase leading-relaxed tracking-wide">
                                      Why it matters: {item.evidence.reason}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;

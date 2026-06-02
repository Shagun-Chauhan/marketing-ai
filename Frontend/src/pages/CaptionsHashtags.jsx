import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Copy, 
  Hash,
  Sparkles,
  Check,
  Loader2,
  Megaphone,
  Palette,
  LayoutGrid,
  Target,
  Type,
  Image,
  Lightbulb,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  MapPin,
  Maximize2,
  MousePointerClick,
  CheckCircle2,
  ArrowRight,
  FileText,
  Layers
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import axios from 'axios';
import API_URL from '../config/api';

const API_BASE = 'http://127.0.0.1:8000/api/caption';

const CaptionsHashtags = () => {
  const { businessData } = useBusiness();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // History state
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    business_type: businessData?.industry || 'Cafe',
    target_audience: businessData?.audienceType?.[0] || 'Students',
    platform: businessData?.primaryPlatform || 'Instagram',
    tone: businessData?.tone?.[0] || 'Casual',
    campaign: businessData?.campaignDescription || 'Monsoon Special Combo',
    location: businessData?.location || 'Pune',
    marketing_goal: 'Brand Awareness',
  });

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await axios.get(`${API_BASE}/history`);
      setHistory(res.data || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
      // Silently handle — history panel will show empty state
      if (err.response?.status === 503) {
        console.warn('MongoDB Atlas connection issue — history unavailable');
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const viewHistoryDetail = async (docId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/history/${docId}`);
      const doc = res.data;
      if (doc && doc.generated_content) {
        // Convert single saved document back to the results display format
        setResults([{
          caption: doc.generated_content.caption,
          cta: doc.generated_content.cta,
          hashtags: doc.generated_content.hashtags || [],
          advertisement_blueprint: doc.generated_content.advertisement_blueprint || {},
          why_this_will_work: doc.generated_content.why_this_will_work || [],
          poster_layout: doc.generated_content.poster_layout || {},
        }]);
        setActiveTab(0);
        setViewingHistory(true);
        setHistoryOpen(false);
      }
    } catch (err) {
      console.error('Failed to load history detail', err);
      const msg = err.response?.status === 503
        ? 'Database connection failed. Please check your MongoDB Atlas configuration.'
        : err.response?.status === 404
        ? 'This advertisement was not found in the database.'
        : 'Failed to load this entry. Please try again.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCaptions = async () => {
    setLoading(true);
    setResults(null);
    setViewingHistory(false);
    try {
      const response = await axios.post(`${API_BASE}/generate`, formData);
      const response = await axios.post(`${API_URL}/api/caption/generate`, formData);
      if (response.data && response.data.captions) {
        setResults(response.data.captions);
        setActiveTab(0);
        // Refresh history after new generation
        fetchHistory();
      }
    } catch (error) {
      console.error("Error generating captions", error);
      const msg = error.response?.status === 503
        ? 'Database connection failed. Please check your MongoDB Atlas configuration in the .env file.'
        : 'Failed to generate captions. Please check your backend.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeCaptionData = results ? results[activeTab] : null;
  const blueprint = activeCaptionData?.advertisement_blueprint;
  const posterLayout = activeCaptionData?.poster_layout;
  const whyItWorks = activeCaptionData?.why_this_will_work;

  // Helper to map color name strings to CSS colors for swatches
  const colorNameToHex = (name) => {
    const map = {
      red: '#EF4444', blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308',
      orange: '#F97316', purple: '#A855F7', pink: '#EC4899', brown: '#92400E',
      cream: '#FFFDD0', black: '#1F2937', white: '#F9FAFB', gold: '#D4A017',
      teal: '#14B8A6', navy: '#1E3A5F', maroon: '#7F1D1D', coral: '#FF7F50',
      beige: '#F5F5DC', lavender: '#E6E6FA', olive: '#808000', cyan: '#06B6D4',
      magenta: '#D946EF', lime: '#84CC16', indigo: '#6366F1', amber: '#F59E0B',
      emerald: '#10B981', rose: '#F43F5E', slate: '#64748B', zinc: '#71717A',
      sky: '#0EA5E9', violet: '#8B5CF6', fuchsia: '#D946EF', stone: '#78716C',
    };
    const lower = name.toLowerCase().trim();
    return map[lower] || '#8B5CF6';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">

      {/* ═══════════════════════════════════════════════════════════════
          GENERATION HISTORY PANEL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className="w-full glass-card p-4 border-violet-500/20 flex items-center justify-between hover:border-violet-500/40 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/30 transition-colors">
              <Clock size={22} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-white">Generation History</h3>
              <p className="text-xs text-gray-500">
                {history.length > 0 ? `${history.length} saved advertisement${history.length > 1 ? 's' : ''}` : 'No history yet'}
              </p>
            </div>
          </div>
          <div className="text-gray-500 group-hover:text-violet-400 transition-colors">
            {historyOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        <AnimatePresence>
          {historyOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-6 border-violet-500/20 space-y-3 max-h-[360px] overflow-y-auto">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Loading history...
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No advertisements generated yet.</p>
                    <p className="text-xs mt-1">Your generated ads will appear here.</p>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.07] transition-all group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{item.campaign || 'Untitled'}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                              {item.platform || '—'}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => viewHistoryDetail(item._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-violet-400 bg-violet-500/10 rounded-lg hover:bg-violet-500/20 transition-colors shrink-0"
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          INPUT FORM
      ═══════════════════════════════════════════════════════════════ */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Generate Advertisement Content</h2>
            <p className="text-sm text-gray-500">Tell us about your business — we'll create a ready-to-use ad plan</p>
          </div>
        </div>

        <div className="glass-card p-6 border-accent-start/20 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-400">Campaign/Topic</label>
             <input type="text" name="campaign" value={formData.campaign} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-start" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-400">Platform</label>
             <select name="platform" value={formData.platform} onChange={handleInputChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-start">
               <option value="Instagram">Instagram</option>
               <option value="LinkedIn">LinkedIn</option>
               <option value="Facebook">Facebook</option>
               <option value="Twitter">Twitter</option>
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-400">Tone</label>
             <select name="tone" value={formData.tone} onChange={handleInputChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-start">
               <option value="Casual">Casual</option>
               <option value="Professional">Professional</option>
               <option value="Funny">Funny</option>
               <option value="Luxury">Luxury</option>
               <option value="Minimal">Minimal</option>
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-400">Target Audience</label>
             <input type="text" name="target_audience" value={formData.target_audience} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-start" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-400">Business Type</label>
             <input type="text" name="business_type" value={formData.business_type} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-start" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-semibold text-gray-400">Location</label>
             <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-start" />
          </div>
          <div className="md:col-span-2 space-y-2">
             <label className="text-sm font-semibold text-gray-400">Marketing Goal</label>
             <select name="marketing_goal" value={formData.marketing_goal} onChange={handleInputChange} className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent-start">
               <option value="Brand Awareness">Brand Awareness</option>
               <option value="Drive Footfall">Drive Footfall</option>
               <option value="Product Launch">Product Launch</option>
               <option value="Seasonal Offer">Seasonal Offer</option>
               <option value="Lead Generation">Lead Generation</option>
               <option value="Customer Retention">Customer Retention</option>
               <option value="Event Promotion">Event Promotion</option>
             </select>
          </div>
          
          <div className="md:col-span-2 mt-4">
             <button onClick={generateCaptions} disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-bold">
               {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
               {loading ? 'Creating Your Ad Plan...' : 'Generate Ad Content ✨'}
             </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          RESULTS SECTION
      ═══════════════════════════════════════════════════════════════ */}
      {results && results.length > 0 && (
        <>
          {/* Viewing history indicator */}
          {viewingHistory && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-sm text-violet-300"
            >
              <Clock size={16} />
              <span>Viewing a saved advertisement from history.</span>
              <button
                onClick={() => { setResults(null); setViewingHistory(false); }}
                className="ml-auto text-violet-400 hover:text-violet-300 font-bold text-xs"
              >
                Clear
              </button>
            </motion.div>
          )}

          {/* ── Caption Card ── */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-2xl font-bold">Generated Captions</h2>
            </div>

            <div className="glass-card overflow-hidden border-accent-start/20">
              <div className="p-1 bg-white/5 flex gap-1">
                {results.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                      activeTab === idx 
                        ? 'bg-card text-white shadow-lg' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Variant {idx + 1}
                  </button>
                ))}
              </div>

              <div className="p-8 relative">
                <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-bold text-accent-start bg-accent-start/10 px-2 py-1 rounded-full">
                  <Sparkles size={12} />
                  AD STRATEGIST ACTIVE
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-[120px] text-lg leading-relaxed text-gray-200 whitespace-pre-wrap"
                  >
                    {activeCaptionData?.caption}
                    
                    <div className="mt-6 font-bold text-accent-start border-l-4 border-accent-start pl-3 py-1 bg-accent-start/10 rounded-r-lg">
                      CTA: {activeCaptionData?.cta}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => handleCopy(`${activeCaptionData?.caption}\n\n${activeCaptionData?.cta}\n\n${activeCaptionData?.hashtags.join(' ')}`)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copied!' : 'Copy Full Post'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Hashtag Tags Section ── */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
                <Hash size={24} />
              </div>
              <h2 className="text-2xl font-bold">Generated Hashtags</h2>
            </div>

            <div className="glass-card p-8 bg-white/5">
              <div className="flex flex-wrap gap-3">
                {activeCaptionData?.hashtags.map((tag, i) => (
                  <motion.button
                    key={`${tag}-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: 'rgba(139, 92, 246, 0.2)',
                      borderColor: 'rgba(139, 92, 246, 0.5)'
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-gray-400 hover:text-white transition-all"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {activeCaptionData?.hashtags.length} Relevant Hashtags Found
                </p>
                <button 
                  onClick={() => handleCopy(activeCaptionData?.hashtags.join(' '))}
                  className="text-sm font-bold text-accent-start hover:underline"
                >
                  Copy All Hashtags
                </button>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════
              ADVERTISEMENT BLUEPRINT
          ═══════════════════════════════════════════════════════════ */}
          {blueprint && (
            <motion.section 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Advertisement Blueprint</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Step-by-step guide — exactly what to put in your ad</p>
                </div>
              </div>

              <div className="glass-card p-8 border-orange-500/20 space-y-6">
                {/* Post Type Badge */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-4 py-2 bg-orange-500/10 text-orange-400 text-sm font-bold rounded-full border border-orange-500/20">
                    {blueprint.post_type}
                  </span>
                  {blueprint.recommended_size && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-gray-400 text-xs font-bold rounded-full border border-white/10">
                      <Maximize2 size={12} />
                      {blueprint.recommended_size}
                    </span>
                  )}
                </div>

                {/* Main Headline */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Type size={14} />
                    What Headline to Write
                  </div>
                  <p className="text-2xl font-extrabold text-white bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent leading-tight">
                    {blueprint.main_headline}
                  </p>
                </div>

                {/* Main Image */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Image size={14} />
                    What Image to Use
                  </div>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-gray-200 text-sm leading-relaxed">{blueprint.main_image}</p>
                  </div>
                </div>

                {/* Offer Text */}
                {blueprint.offer_text && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <Target size={14} />
                      What Offer Text to Show
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <p className="text-green-300 text-base font-bold">{blueprint.offer_text}</p>
                    </div>
                  </div>
                )}

                {/* Background Idea */}
                {blueprint.background_idea && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <Layers size={14} />
                      What Background to Use
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">{blueprint.background_idea}</p>
                    </div>
                  </div>
                )}

                {/* Logo Position */}
                {blueprint.logo_position && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <MapPin size={14} />
                      Where to Place Your Logo
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed">{blueprint.logo_position}</p>
                    </div>
                  </div>
                )}

                {/* CTA Position */}
                {blueprint.cta_position && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <MousePointerClick size={14} />
                      What Call-to-Action Button to Display
                    </div>
                    <div className="p-4 bg-accent-start/10 border border-accent-start/20 rounded-xl">
                      <p className="text-gray-200 text-sm leading-relaxed">{blueprint.cta_position}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              POSTER LAYOUT GUIDE
          ═══════════════════════════════════════════════════════════ */}
          {posterLayout && (
            <motion.section 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Poster Layout Guide</h2>
                  <p className="text-xs text-gray-500 mt-0.5">How to arrange everything on your poster</p>
                </div>
              </div>

              <div className="glass-card border-pink-500/20 overflow-hidden">
                {/* Visual poster mockup */}
                <div className="p-8 space-y-0">
                  {/* Top Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-5 bg-gradient-to-b from-pink-500/15 to-pink-500/5 rounded-t-2xl border border-pink-500/20 border-b-0"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold text-pink-400 uppercase tracking-wider mb-2">
                      <ArrowRight size={12} />
                      Top of Your Post
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{posterLayout.top_section}</p>
                  </motion.div>

                  {/* Center Section */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                    className="p-5 bg-white/[0.06] border-x border-pink-500/20"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-wider mb-2">
                      <ArrowRight size={12} />
                      Center / Main Area
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{posterLayout.center_section}</p>
                  </motion.div>

                  {/* Bottom Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="p-5 bg-gradient-to-t from-pink-500/15 to-pink-500/5 rounded-b-2xl border border-pink-500/20 border-t-0"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold text-pink-400 uppercase tracking-wider mb-2">
                      <ArrowRight size={12} />
                      Bottom of Your Post
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{posterLayout.bottom_section}</p>
                  </motion.div>
                </div>

                {/* Color Suggestion */}
                {posterLayout.color_suggestion && (
                  <div className="px-8 pb-8 pt-2">
                    <div className="p-5 bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl">
                      <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold mb-2">
                        <Palette size={16} />
                        Colors to Use
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{posterLayout.color_suggestion}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              WHY THIS AD WILL WORK
          ═══════════════════════════════════════════════════════════ */}
          {whyItWorks && whyItWorks.length > 0 && (
            <motion.section 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Why This Ad Will Work</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Business reasons this advertisement will attract customers</p>
                </div>
              </div>

              <div className="glass-card p-8 border-emerald-500/20 space-y-4">
                {whyItWorks.map((reason, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:border-emerald-500/25 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{reason}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </>
      )}

      {/* AI Tips Card */}
      <section className="glass-card p-6 bg-gradient-to-r from-accent-start/20 to-transparent border-accent-start/30 flex items-center gap-6 mt-8">
        <div className="w-16 h-16 rounded-full bg-accent-start flex items-center justify-center shadow-accent-glow shrink-0">
          <Sparkles size={32} className="text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold">Pro-Tip from Ad Strategist</h4>
          <p className="text-gray-400 text-sm">
            Simple, clear ads with a strong offer and a single call-to-action convert 3× more than cluttered designs. We build your ad blueprint for {formData.platform} — just follow the steps!
          </p>
        </div>
      </section>
    </div>
  );
};

export default CaptionsHashtags;

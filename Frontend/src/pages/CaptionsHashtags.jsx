import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Copy, 
  RefreshCw, 
  Save, 
  Hash,
  Sparkles,
  Check,
  Loader2,
  Megaphone,
  Paintbrush,
  Palette,
  LayoutGrid,
  Target,
  Type,
  Image,
  Lightbulb
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import axios from 'axios';

const CaptionsHashtags = () => {
  const { businessData } = useBusiness();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCaptions = async () => {
    setLoading(true);
    setResults(null);
    try {
      // Assuming FastAPI runs on port 8000
      const response = await axios.post('http://127.0.0.1:8000/api/caption/generate', formData);
      if (response.data && response.data.captions) {
        setResults(response.data.captions);
        setActiveTab(0);
      }
    } catch (error) {
      console.error("Error generating captions", error);
      alert("Failed to generate captions. Please check your backend.");
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
  const guidance = activeCaptionData?.post_guidance;

  // Helper to map color name strings to approximate CSS colors for swatches
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

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Input Form */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Generate Advertisement Content</h2>
            <p className="text-sm text-gray-500">Static post guidance • Poster design • Branding strategy</p>
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
               {loading ? 'Generating Ad Strategy...' : 'Generate Ad Content ✨'}
             </button>
          </div>
        </div>
      </section>

      {/* Caption Generator Results */}
      {results && results.length > 0 && (
        <>
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

          {/* ── Advertisement Strategy Card ── */}
          {guidance && (
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
                <h2 className="text-2xl font-bold">Advertisement Post Guidance</h2>
              </div>

              <div className="glass-card p-8 border-orange-500/20 space-y-6">
                {/* Post Type Badge */}
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-orange-500/10 text-orange-400 text-sm font-bold rounded-full border border-orange-500/20">
                    {guidance.post_type}
                  </span>
                </div>

                {/* Poster Headline */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Type size={14} />
                    Poster Headline
                  </div>
                  <p className="text-2xl font-extrabold text-white bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                    {guidance.poster_headline}
                  </p>
                </div>

                {/* Engagement Tip */}
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-bold mb-1">
                    <Target size={16} />
                    Engagement Strategy
                  </div>
                  <p className="text-gray-300 text-sm">{guidance.engagement_tip}</p>
                </div>
              </div>
            </motion.section>
          )}

          {/* ── Design Style Card ── */}
          {guidance && (
            <motion.section 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Paintbrush size={24} />
                </div>
                <h2 className="text-2xl font-bold">Poster Design Suggestions</h2>
              </div>

              <div className="glass-card p-8 border-pink-500/20 space-y-6">
                {/* Design Style */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Paintbrush size={14} />
                    Design Style
                  </div>
                  <p className="text-lg text-gray-200 font-medium">{guidance.design_style}</p>
                </div>

                {/* Visual Elements */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Image size={14} />
                    Visual Elements
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guidance.visual_elements?.map((el, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-sm font-semibold text-pink-300"
                      >
                        {el}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Text Placement */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <LayoutGrid size={14} />
                    Text Placement & Layout
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-gray-300 text-sm leading-relaxed">{guidance.text_placement}</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ── Color Palette Card ── */}
          {guidance && guidance.color_palette && (
            <motion.section 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Palette size={24} />
                </div>
                <h2 className="text-2xl font-bold">Color Palette</h2>
              </div>

              <div className="glass-card p-8 border-cyan-500/20">
                <div className="flex flex-wrap gap-4">
                  {guidance.color_palette.map((color, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-3 group cursor-pointer"
                    >
                      <div 
                        className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-xl"
                        style={{ backgroundColor: colorNameToHex(color) }}
                      />
                      <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">
                        {color}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* ── Branding Suggestions Card ── */}
          {guidance && (
            <motion.section 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                  <Lightbulb size={24} />
                </div>
                <h2 className="text-2xl font-bold">Branding & Layout Suggestions</h2>
              </div>

              <div className="glass-card p-8 border-violet-500/20">
                <div className="p-5 bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/20 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Lightbulb size={22} className="text-violet-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">Branding Tip</h4>
                      <p className="text-gray-300 leading-relaxed">{guidance.branding_tip}</p>
                    </div>
                  </div>
                </div>
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
            Static promotional posts with clear CTAs and consistent branding drive 3× more conversions than unstructured content. We optimize your ad creatives for {formData.platform}!
          </p>
        </div>
      </section>
    </div>
  );
};

export default CaptionsHashtags;

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
  Loader2
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

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Input Form */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold">Generate Content</h2>
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
          
          <div className="md:col-span-2 mt-4">
             <button onClick={generateCaptions} disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-lg text-lg font-bold">
               {loading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
               {loading ? 'Generating...' : 'Generate Magic ✨'}
             </button>
          </div>
        </div>
      </section>

      {/* Caption Generator Results */}
      {results && results.length > 0 && (
        <>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-2xl font-bold">Caption Variants</h2>
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
                  CONTENT AGENT ACTIVE
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

          {/* Hashtag Suggestions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
                <Hash size={24} />
              </div>
              <h2 className="text-2xl font-bold">Hashtags for Variant {activeTab + 1}</h2>
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
        </>
      )}

      {/* AI Tips Card */}
      <section className="glass-card p-6 bg-gradient-to-r from-accent-start/20 to-transparent border-accent-start/30 flex items-center gap-6 mt-8">
        <div className="w-16 h-16 rounded-full bg-accent-start flex items-center justify-center shadow-accent-glow shrink-0">
          <Sparkles size={32} className="text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold">Pro-Tip from Content Agent</h4>
          <p className="text-gray-400 text-sm">
            Using emojis and structured formatting increases engagement by 48%. We automatically optimize your content for {formData.platform}!
          </p>
        </div>
      </section>
    </div>
  );
};

export default CaptionsHashtags;

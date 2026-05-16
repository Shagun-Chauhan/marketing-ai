import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Copy, 
  RefreshCw, 
  Save, 
  Hash,
  Sparkles,
  Check
} from 'lucide-react';

const CaptionsHashtags = () => {
  const [activeTab, setActiveTab] = useState('Professional');
  const [copied, setCopied] = useState(false);

  const variations = {
    Professional: "Indulge in the aromatic journey of our ethically sourced beans. A perfect blend for the discerning palate. #CoffeeConnoisseur #PremiumExperience",
    Trendy: "Rainy days + Hot Coffee = Pure Bliss ✨☕ You know you want one. Stop by today! #RainyVibes #CoffeeLover #CafeVibes",
    Funny: "My coffee and I are in a long-term relationship. It's getting pretty serious. 💍☕ Don't tell my tea. #CoffeeAddict #NoTalkieBeforeCoffee"
  };

  const hashtags = [
    '#PuneCafe', '#CoffeeLovers', '#RainyVibes', '#MonsoonSpecial', 
    '#CafeCulture', '#BrewedFresh', '#InstaCoffee', '#MorningRitual',
    '#LocalBusiness', '#SupportLocal', '#CoffeeAddict', '#AestheticCafe'
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Caption Generator */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-start/20 flex items-center justify-center text-accent-start">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-2xl font-bold">Caption Generator</h2>
        </div>

        <div className="glass-card overflow-hidden border-accent-start/20">
          <div className="p-1 bg-white/5 flex gap-1">
            {['Professional', 'Trendy', 'Funny'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-card text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
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
                className="min-h-[120px] text-lg leading-relaxed text-gray-200"
              >
                {variations[activeTab]}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => handleCopy(variations[activeTab])}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy Caption'}
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <RefreshCw size={20} />
                Regenerate
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Save size={20} />
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
          <h2 className="text-2xl font-bold">Hashtag Suggestions</h2>
        </div>

        <div className="glass-card p-8 bg-white/5">
          <div className="flex flex-wrap gap-3">
            {hashtags.map((tag, i) => (
              <motion.button
                key={tag}
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
              {hashtags.length} Relevant Hashtags Found
            </p>
            <button className="text-sm font-bold text-accent-start hover:underline">
              Copy All Hashtags
            </button>
          </div>
        </div>
      </section>

      {/* AI Tips Card */}
      <section className="glass-card p-6 bg-gradient-to-r from-accent-start/20 to-transparent border-accent-start/30 flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-accent-start flex items-center justify-center shadow-accent-glow">
          <Sparkles size={32} className="text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold">Pro-Tip from Content Agent</h4>
          <p className="text-gray-400 text-sm">
            Using emojis at the end of captions increases engagement by 48%. We've optimized your {activeTab} variation accordingly!
          </p>
        </div>
      </section>
    </div>
  );
};

export default CaptionsHashtags;

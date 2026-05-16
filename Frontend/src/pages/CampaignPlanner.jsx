import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Calendar, 
  PartyPopper, 
  Sparkles, 
  Palette,
  Copy,
  RefreshCw,
  Plus
} from 'lucide-react';

const CampaignPlanner = () => {
  const trends = [
    { label: '🔥 IPL Finals', type: 'Event' },
    { label: '☕ Monsoon Cafes', type: 'Lifestyle' },
    { label: '🎵 Trending Reels', type: 'Viral' },
    { label: '🏃 Fitness Motivation', type: 'Niche' },
    { label: '🌱 Eco-friendly Living', type: 'Global' },
  ];

  const calendar = [
    { day: 'Monday', time: '7 PM', type: 'Instagram Reel', idea: 'Rainy Coffee Mood Reel', impact: 'High Engagement' },
    { day: 'Wednesday', time: '11 AM', type: 'Carousel', idea: 'Top 5 Coffee Blends', impact: 'Educational' },
    { day: 'Friday', time: '5 PM', type: 'Stories', idea: 'Behind the scenes at cafe', impact: 'Community' },
    { day: 'Sunday', time: '10 AM', type: 'Post', idea: 'Weekend Special Offer', impact: 'Sales Boost' },
  ];

  const festivals = [
    { title: 'Monsoon Evening Combo', audience: 'Students', reach: 'High', cta: 'Order Now' },
    { title: 'Rainy Sunday Brunch', audience: 'Families', reach: 'Medium', cta: 'Book Table' },
    { title: 'Cloudy Coffee Vibes', audience: 'Professionals', reach: 'High', cta: 'Visit Us' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Trend Insights */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Flame className="text-orange-500" size={24} />
          <h2 className="text-2xl font-bold">Trend Insights</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {trends.map((trend, i) => (
            <motion.div
              key={trend.label}
              whileHover={{ y: -5, scale: 1.05 }}
              className="glass-card px-6 py-3 bg-white/5 border-white/10 flex items-center gap-3 cursor-default"
            >
              <span className="font-bold">{trend.label}</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{trend.type}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Content Calendar */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-500" size={24} />
            <h2 className="text-2xl font-bold">Weekly Content Calendar</h2>
          </div>
          <button className="btn-secondary py-2 flex items-center gap-2 text-sm">
            <Plus size={18} /> Add Post
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {calendar.map((item, i) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-accent-start font-bold text-lg">{item.day}</h4>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase text-gray-400">
                  {item.type}
                </div>
              </div>
              <p className="text-sm font-semibold mb-6 flex-1">“{item.idea}”</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-green-500/80">{item.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Festival Campaigns */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <PartyPopper className="text-purple-500" size={24} />
          <h2 className="text-2xl font-bold">Festival Campaign Suggestions</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
          {festivals.map((camp, i) => (
            <div 
              key={camp.title}
              className="glass-card min-w-[300px] p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-accent-start/20 snap-start"
            >
              <h4 className="text-xl font-bold mb-4">{camp.title}</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 uppercase font-bold">Audience</span>
                  <span className="text-white font-semibold">{camp.audience}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 uppercase font-bold">Reach Potential</span>
                  <span className="text-green-500 font-bold">{camp.reach}</span>
                </div>
              </div>
              <button className="w-full py-2 bg-accent-start rounded-lg text-sm font-bold shadow-accent-glow">
                {camp.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Poster Prompt Generator */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold">Poster Prompt Generator</h2>
          </div>
          <div className="glass-card p-8 bg-accent-start/5 border-accent-start/20 relative">
            <div className="absolute top-4 right-4">
               <BotPulse />
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">AI Generated Prompt</p>
            <p className="text-lg font-medium leading-relaxed mb-8 italic">
              “Create a cinematic coffee poster with warm lighting, rainy atmosphere, neon reflections, cozy café aesthetic, highly detailed, 8k resolution, volumetric fog.”
            </p>
            <div className="flex gap-4">
              <button className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 text-sm">
                <Copy size={18} /> Copy Prompt
              </button>
              <button className="btn-secondary flex items-center gap-2 py-3 text-sm">
                <RefreshCw size={18} /> Regenerate
              </button>
            </div>
          </div>
        </section>

        {/* Design Suggestions */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Palette className="text-pink-500" size={24} />
            <h2 className="text-2xl font-bold">Design Suggestions</h2>
          </div>
          <div className="glass-card p-6 space-y-8">
            <div className="space-y-4">
              <p className="text-xs text-gray-500 uppercase font-bold">Color Palette</p>
              <div className="flex gap-4">
                {['#4A3728', '#E6D5B8', '#F0A500'].map(color => (
                  <div key={color} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border border-white/10" style={{ backgroundColor: color }} />
                    <span className="text-[10px] font-mono text-gray-500">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-gray-500 uppercase font-bold">Font Pairings</p>
              <div className="space-y-2">
                <p className="text-2xl" style={{ fontFamily: 'Playfair Display' }}>Playfair Display (Heading)</p>
                <p className="text-sm text-gray-400" style={{ fontFamily: 'Poppins' }}>Poppins (Body Text)</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-gray-500 uppercase font-bold">Mood Tags</p>
              <div className="flex gap-2">
                {['Modern', 'Cozy', 'Cinematic'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-accent-start">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const BotPulse = () => (
  <div className="flex items-center gap-2 text-[10px] font-bold text-accent-start bg-accent-start/10 px-2 py-1 rounded-full animate-pulse">
    <div className="w-1.5 h-1.5 bg-accent-start rounded-full" />
    CAMPAIGN AGENT ACTIVE
  </div>
);

export default CampaignPlanner;

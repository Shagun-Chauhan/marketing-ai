import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusiness } from '../context/BusinessContext';
import { 
  Calendar, 
  Sparkles, 
  LayoutDashboard,
  Clock, 
  Target, 
  Zap, 
  RefreshCw,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Globe,
  Users,
  Briefcase,
  List
} from 'lucide-react';

const CalendarPlanner = () => {
  const { businessData } = useBusiness();
  const [plannerView, setPlannerView] = useState('weekly');
  const [isGenerating, setIsGenerating] = useState(false);

  const weeklyData = [
    { day: 'Monday', time: '7 PM', platform: 'Instagram', format: 'Reel', idea: 'Behind the scenes brand story', goal: 'Reach', cta: 'Join the journey' },
    { day: 'Tuesday', time: '10 AM', platform: 'Facebook', format: 'Post', idea: 'Educational tip related to niche', goal: 'Authority', cta: 'Save for later' },
    { day: 'Wednesday', time: '1 PM', platform: 'Instagram', format: 'Story', idea: 'Interactive poll/Q&A session', goal: 'Interaction', cta: 'Vote now' },
    { day: 'Thursday', time: '6 PM', platform: 'LinkedIn', format: 'Carousel', idea: 'Step-by-step process guide', goal: 'Engagement', cta: 'Check link in bio' },
    { day: 'Friday', time: '8 PM', platform: 'Instagram', format: 'Reel', idea: 'Customer testimonial/User content', goal: 'Trust', cta: 'Share your story' },
    { day: 'Saturday', time: '11 AM', platform: 'Facebook', format: 'Post', idea: 'Weekend special offer/Promo', goal: 'Sales', cta: 'Shop Now' },
    { day: 'Sunday', time: '9 PM', platform: 'Instagram', format: 'Post', idea: 'Weekly wrap-up & Zen vibes', goal: 'Community', cta: 'Double tap' },
  ];

  const monthlyData = [
    { week: 'Week 1', focus: 'Brand Awareness', volume: '3 Reels, 2 Posts', strategy: 'Introduce core values and team', distribution: '60% Instagram, 40% FB', goal: 'Reach new audience' },
    { week: 'Week 2', focus: 'Engagement & Community', volume: '4 Stories, 3 Reels', strategy: 'UGC and interactive polls', distribution: '80% Instagram, 20% WhatsApp', goal: 'Increase comments' },
    { week: 'Week 3', focus: 'Educational Push', volume: '3 Carousels, 1 Post', strategy: 'Deep dive into product benefits', distribution: '50% LinkedIn, 50% Instagram', goal: 'Establish authority' },
    { week: 'Week 4', focus: 'Conversion & Sales', volume: '4 Posts, 2 Stories', strategy: 'Limited time offers and testimonials', distribution: '70% FB, 30% Instagram', goal: 'Boost monthly revenue' },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent-start font-bold uppercase tracking-widest text-xs mb-2">
            <Sparkles size={14} /> AI Powered Strategy
          </div>
          <h2 className="text-4xl font-bold mb-2">AI Content Calendar Generator</h2>
          <p className="text-gray-400 max-w-2xl">Generate intelligent weekly and monthly social media strategies tailored to your unique business profile and goals.</p>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2 py-3 px-8 shadow-accent-glow self-start md:self-auto"
        >
          {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
          {isGenerating ? 'Analyzing Trends...' : 'Generate New Strategy'}
        </button>
      </header>

      {/* Business Context Preview */}
      <section className="glass-card p-6 bg-accent-start/5 border-accent-start/10">
        <div className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-400 uppercase tracking-wider">
          <Briefcase size={16} /> Business Context Summary
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: 'Business', val: businessData.businessName || 'Not Set', icon: LayoutDashboard },
            { label: 'Type', val: businessData.industry || 'Not Set', icon: Briefcase },
            { label: 'Audience', val: businessData.audienceType[0] || 'General', icon: Users },
            { label: 'Platform', val: businessData.primaryPlatform || 'All Social', icon: Globe },
            { label: 'Primary Goal', val: businessData.primaryGoal || 'Growth', icon: Target },
            { label: 'Location', val: businessData.location || businessData.targetCity || 'Global', icon: Globe },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase">{item.label}</p>
              <p className="text-sm font-semibold truncate text-gray-200">{item.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planner Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
            <button 
              onClick={() => setPlannerView('weekly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                plannerView === 'weekly' 
                  ? 'bg-accent-start text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <LayoutGrid size={14} /> Weekly
            </button>
            <button 
              onClick={() => setPlannerView('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                plannerView === 'monthly' 
                  ? 'bg-accent-start text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <List size={14} /> Monthly
            </button>
          </div>
          <h3 className="text-xl font-bold capitalize">{plannerView} Strategy</h3>
        </div>
        
        {plannerView === 'weekly' && (
          <div className="flex gap-2">
            {['Instagram', 'Facebook', 'LinkedIn'].map(p => (
              <span key={p} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={plannerView + isGenerating}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isGenerating ? (
            <div className="glass-card min-h-[400px] flex flex-col items-center justify-center space-y-6">
              <div className="w-20 h-20 border-4 border-accent-start/20 border-t-accent-start rounded-full animate-spin shadow-accent-glow" />
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2">Syncing with your Brand DNA...</h4>
                <p className="text-gray-400 text-sm">Optimizing posting times for {businessData.primaryPlatform || 'your platforms'}</p>
              </div>
            </div>
          ) : plannerView === 'weekly' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {weeklyData.map((item, i) => (
                <motion.div 
                  key={item.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 flex flex-col h-full group hover:border-accent-start/40 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-accent-start font-bold text-lg">{item.day}</h4>
                    <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                      <Calendar size={14} />
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                      <Globe size={10} /> {item.platform}
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-gray-400">
                      {item.format}
                    </div>
                  </div>

                  <p className="text-sm font-semibold mb-6 flex-1 text-gray-200">“{item.idea}”</p>
                  
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-gray-500">Goal</span>
                      <span className="text-green-500">{item.goal}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-gray-500">Best Time</span>
                      <span className="text-white flex items-center gap-1"><Clock size={10} /> {item.time}</span>
                    </div>
                    <div className="pt-2 text-[11px] italic text-gray-400 border-t border-white/5 mt-2">
                      <span className="text-accent-start font-bold not-italic">CTA:</span> {item.cta}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {monthlyData.map((week, i) => (
                <motion.div 
                  key={week.week}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 flex flex-col hover:border-accent-start/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-3xl font-bold text-accent-start mb-1">{week.week}</h4>
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-500/20">{week.focus}</span>
                  </div>
                  
                  <div className="flex-1 space-y-4 mb-8">
                    <p className="text-lg font-medium text-gray-200 leading-snug">{week.strategy}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 font-medium">
                        <Zap size={12} className="text-yellow-500" /> {week.volume}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400 font-medium">
                        <Globe size={12} className="text-blue-500" /> {week.distribution}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-gray-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Success KPI: <span className="text-gray-300">{week.goal}</span></span>
                    </div>
                    <ArrowRight size={18} className="text-gray-700 group-hover:text-accent-start transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalendarPlanner;
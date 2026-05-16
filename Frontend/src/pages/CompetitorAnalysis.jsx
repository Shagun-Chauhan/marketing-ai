import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  Upload,
  TrendingUp,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const data = [
  { name: 'Jan', you: 4000, competitor: 2400 },
  { name: 'Feb', you: 3000, competitor: 1398 },
  { name: 'Mar', you: 2000, competitor: 9800 },
  { name: 'Apr', you: 2780, competitor: 3908 },
  { name: 'May', you: 1890, competitor: 4800 },
];

const radarData = [
  { subject: 'Engagement', A: 120, B: 110, fullMark: 150 },
  { subject: 'Consistency', A: 98, B: 130, fullMark: 150 },
  { subject: 'Visuals', A: 86, B: 130, fullMark: 150 },
  { subject: 'Reach', A: 99, B: 100, fullMark: 150 },
  { subject: 'CTA', A: 85, B: 90, fullMark: 150 },
];

const pieData = [
  { name: 'Reels', value: 400 },
  { name: 'Posters', value: 300 },
  { name: 'Stories', value: 300 },
];

const COLORS = ['#8B5CF6', '#3B82F6', '#06B6D4'];

const CompetitorAnalysis = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Input Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Search className="text-accent-start" size={24} />
            Competitor Input
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">Paste Competitor Caption</label>
              <textarea 
                className="glass-input w-full h-32 resize-none" 
                placeholder="Analyze their messaging style..."
              />
            </div>
            <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-accent-start/50 transition-all cursor-pointer group">
              <Upload className="text-gray-500 group-hover:text-accent-start transition-colors" size={32} />
              <p className="text-sm font-bold text-gray-500 group-hover:text-white">Upload Competitor Image</p>
              <p className="text-xs text-gray-600">Analyze visual strategy (JPG, PNG)</p>
            </div>
            <button className="btn-primary w-full">Run AI Analysis</button>
          </div>
        </div>

        <div className="glass-card p-8 bg-accent-start/5 border-accent-start/20">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-accent-start" size={24} />
            <h2 className="text-2xl font-bold">Analysis Overview</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Engagement Score</p>
              <p className="text-3xl font-bold text-accent-start">84/100</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Content Quality</p>
              <p className="text-3xl font-bold text-blue-500">High</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Consistency</p>
              <p className="text-3xl font-bold text-green-500">92%</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-1">Market Position</p>
              <p className="text-3xl font-bold text-purple-500">Leader</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} />
            Engagement Comparison
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} />
                <YAxis stroke="#ffffff50" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="you" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="competitor" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="text-purple-500" size={20} />
            Strategy Radar
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" stroke="#ffffff50" fontSize={10} />
                <Radar name="You" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Radar name="Competitor" dataKey="B" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SWOT Analysis */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 border-green-500/20 bg-green-500/5">
          <div className="flex items-center gap-2 mb-4 text-green-500">
            <CheckCircle2 size={20} />
            <h4 className="font-bold uppercase tracking-widest text-sm">Strengths</h4>
          </div>
          <ul className="space-y-3">
            {['Strong reel strategy', 'Consistent brand voice', 'High user interaction'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <XCircle size={20} />
            <h4 className="font-bold uppercase tracking-widest text-sm">Weaknesses</h4>
          </div>
          <ul className="space-y-3">
            {['Weak CTA', 'Low story engagement', 'Inconsistent posting time'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-2 mb-4 text-blue-500">
            <Lightbulb size={20} />
            <h4 className="font-bold uppercase tracking-widest text-sm">Opportunities</h4>
          </div>
          <ul className="space-y-3">
            {['Add educational posts', 'Collab with influencers', 'Launch weekly contest'].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default CompetitorAnalysis;

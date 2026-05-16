import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  TrendingUp, 
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const { businessData } = useBusiness();

  const quickActions = [
    { 
      title: 'Generate Campaign', 
      desc: 'AI-powered weekly strategy', 
      icon: Zap, 
      color: 'from-purple-500 to-blue-500' 
    },
    { 
      title: 'Create Captions', 
      desc: 'High-engagement social copy', 
      icon: MessageSquare, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      title: 'Analyze Competitor', 
      desc: 'Market intelligence report', 
      icon: TrendingUp, 
      color: 'from-indigo-500 to-purple-500' 
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header section */}
      <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-accent text-white shadow-2xl">
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold mb-2"
          >
            Welcome back 👋
          </motion.h2>
          <p className="text-white/80 text-lg">Let’s grow your brand today.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
          <Zap size={240} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Business Overview */}
        <section className="lg:col-span-1">
          <div className="glass-card p-6 h-full border-accent-start/20 bg-accent-start/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-accent-start rounded-full" />
              Business Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 text-sm">Business Name</span>
                <span className="font-semibold">{businessData.businessName || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 text-sm">Target Audience</span>
                <span className="font-semibold">{businessData.audienceType[0] || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 text-sm">Primary Platform</span>
                <span className="font-semibold">{businessData.primaryPlatform || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-gray-400 text-sm">Brand Tone</span>
                <span className="font-semibold capitalize">{businessData.tone[0] || 'Not set'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`glass-card p-6 cursor-pointer flex flex-col items-center text-center group relative overflow-hidden`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:animate-pulse`}>
                <action.icon size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">{action.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{action.desc}</p>
              <ArrowRight size={20} className="text-accent-start opacity-0 group-hover:opacity-100 transition-all" />
              
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            </motion.div>
          ))}
        </section>
      </div>

      {/* Recent Campaign History */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Recent Campaign History</h3>
        </div>
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">Campaign</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">Platform</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">Reach</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Monsoon Magic Coffee', platform: 'Instagram', date: 'Oct 24, 2023', status: 'Completed', reach: '12.4k' },
                { name: 'Diwali Sparkle Sale', platform: 'Facebook', date: 'Oct 18, 2023', status: 'In Progress', reach: '45.2k' },
                { name: 'Gym Rush 2023', platform: 'LinkedIn', date: 'Oct 12, 2023', status: 'Completed', reach: '8.1k' },
              ].map((campaign) => (
                <tr key={campaign.name} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-semibold">{campaign.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{campaign.platform}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> {campaign.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      campaign.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-accent-start">{campaign.reach}</td>
                  <td className="px-6 py-4">
                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all">
                      <ExternalLink size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

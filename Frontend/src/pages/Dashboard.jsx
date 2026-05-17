import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Generate Campaign',
      desc: 'AI-powered weekly strategy',
      icon: Zap,
      color: 'from-purple-500 to-blue-500',
      path: '/campaign'
    },
    {
      title: 'Create Captions',
      desc: 'High-engagement social copy',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
      path: '/captions'
    },
    {
      title: 'Analyze Competitor',
      desc: 'Market intelligence report',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-500',
      path: '/competitor'
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
              onClick={() => navigate(action.path)}
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
    </div>
  );
};

export default Dashboard;

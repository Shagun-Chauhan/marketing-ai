import React, { useState, useContext } from 'react';
import { BusinessContext } from '../context/BusinessContext';
import { 
  Calendar, 
  Download, 
  RefreshCw, 
  Filter, 
  Send,
  Clock,
  Target,
  Flag,
  Tag
} from 'lucide-react';

const CalendarPlanner = () => {
  const { businessData } = useContext(BusinessContext);
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [duration, setDuration] = useState('weekly');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [error, setError] = useState('');

  const generateCalendar = async () => {
    setCalendarData([]); // Ensure no persistence of old plans
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/calendar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: duration,
          business_data: businessData
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCalendarData(data.calendar_days || []);
    } catch (error) {
      console.error("Failed to generate calendar:", error);
      setError('Failed to generate calendar. Please ensure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/calendar/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: duration,
          business_data: businessData
        }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `content_planner_${duration}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Could not download PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = calendarData.filter(item => 
    (filterPlatform === 'All' || item.platform === filterPlatform) &&
    (filterType === 'All' || item.content_type === filterType) &&
    (filterCategory === 'All' || item.campaign_category === filterCategory)
  );

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-400 bg-red-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Offer': 'text-purple-400 bg-purple-400/10',
      'Product': 'text-blue-400 bg-blue-400/10',
      'Service': 'text-green-400 bg-green-400/10',
      'Educational': 'text-cyan-400 bg-cyan-400/10',
      'Testimonial': 'text-pink-400 bg-pink-400/10',
      'Launch': 'text-orange-400 bg-orange-400/10',
      'Festival': 'text-yellow-400 bg-yellow-400/10',
      'Seasonal': 'text-teal-400 bg-teal-400/10'
    };
    return colors[category] || 'text-gray-400 bg-gray-400/10';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Content Planner</h1>
          <p className="text-gray-400 mt-1">AI-powered strategy for {businessData.businessName || 'your brand'}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-black/30 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setDuration('weekly')}
              className={`px-4 py-2 rounded-lg transition ${duration === 'weekly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >Weekly</button>
            <button 
              onClick={() => setDuration('monthly')}
              className={`px-4 py-2 rounded-lg transition ${duration === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >Monthly</button>
          </div>
          <button 
            onClick={generateCalendar}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-xl font-semibold hover:shadow-blue-500/20 hover:shadow-2xl transition disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
            {calendarData.length > 0 ? 'Regenerate Strategy' : 'Generate Strategy'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Filters */}
      {calendarData.length > 0 && (
        <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5 flex-wrap">
          <Filter size={18} className="text-blue-400" />
          <select 
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Facebook">Facebook</option>
            <option value="X">X</option>
            <option value="YouTube">YouTube</option>
          </select>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Content Types</option>
            <option value="Post">Posts</option>
            <option value="Reel">Reels</option>
            <option value="Story">Stories</option>
            <option value="Carousel">Carousels</option>
            <option value="Video">Videos</option>
          </select>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Offer">Offers</option>
            <option value="Product">Products</option>
            <option value="Service">Services</option>
            <option value="Educational">Educational</option>
            <option value="Testimonial">Testimonials</option>
            <option value="Launch">Launches</option>
            <option value="Festival">Festival</option>
            <option value="Seasonal">Seasonal</option>
          </select>
          <button onClick={generateCalendar} disabled={loading} className="ml-auto flex items-center gap-2 text-sm text-gray-400 hover:text-white transition disabled:opacity-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Regenerate Plan
          </button>
          <button onClick={handleDownloadPDF} disabled={loading} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition disabled:opacity-50">
            <Download size={16} /> Download PDF
          </button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Gemini AI is analyzing your business DNA...</p>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((day, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">
                  {day.date}
                </span>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${getPriorityColor(day.priority)}`}>
                    {day.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${getCategoryColor(day.campaign_category)}`}>
                  {day.campaign_category}
                </span>
              </div>
              
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition">{day.title}</h3>
              
              <div className="space-y-3 mb-4">
                {day.objective && (
                  <p className="text-sm text-blue-300 font-medium">Objective: {day.objective}</p>
                )}
                <p className="text-sm text-gray-400 line-clamp-4">
                  <span className="font-semibold text-gray-300">Tasks:</span> {day.tasks || day.description}
                </p>
                {day.milestones && (
                  <p className="text-xs text-yellow-500/80 italic">Milestone: {day.milestones}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/20 p-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Tag size={10} /> Type
                  </p>
                  <p className="text-xs font-semibold">{day.content_type}</p>
                </div>
                <div className="bg-black/20 p-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Clock size={10} /> Time
                  </p>
                  <p className="text-xs font-semibold">{day.recommended_time}</p>
                </div>
                <div className="bg-black/20 p-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Target size={10} /> Purpose
                  </p>
                  <p className="text-xs font-semibold">{day.purpose}</p>
                </div>
                <div className="bg-black/20 p-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                    <Flag size={10} /> Platform
                  </p>
                  <p className="text-xs font-semibold">{day.platform}</p>
                </div>
              </div>

              <div className="bg-black/20 p-2 rounded-lg mb-4">
                <p className="text-[10px] text-gray-500 uppercase mb-1">CTA</p>
                <p className="text-xs font-semibold text-blue-300">{day.cta}</p>
              </div>

              <div className="flex flex-wrap gap-1 mt-auto">
                {day.hashtags.slice(0, 5).map((tag, i) => (
                  <span key={i} className="text-[10px] text-gray-500">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-96 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-white/5 backdrop-blur-sm">
          <div className="bg-blue-500/10 p-4 rounded-full mb-4">
            <Calendar size={48} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Content Plan Yet</h2>
          <p className="text-gray-400 max-w-md">
            Click the generate button above to create an AI-powered content strategy tailored specifically to your business profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarPlanner;
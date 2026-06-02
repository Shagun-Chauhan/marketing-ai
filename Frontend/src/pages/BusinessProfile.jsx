import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  CheckCircle2,
  Building2,
  Users2,
  Smile,
  Target,
  Share2,
  TrendingDown,
  Palette,
  CalendarDays,
  Bot
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Business Info', icon: Building2 },
  { id: 2, title: 'Target Audience', icon: Users2 },
  { id: 3, title: 'Brand Personality', icon: Smile },
  { id: 4, title: 'Marketing Goals', icon: Target },
  { id: 5, title: 'Platform Prefs', icon: Share2 },
  { id: 6, title: 'Market Insights', icon: TrendingDown },
];

const BusinessProfile = () => {
  const { businessData, updateBusinessData } = useBusiness();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateBusinessData({ [name]: value });
  };

  const handleMultiSelect = (name, value) => {
    const currentValues = businessData[name] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    updateBusinessData({ [name]: newValues });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Business Name</label>
                <input 
                  name="businessName"
                  value={businessData.businessName}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                  placeholder="e.g. Blue Tokai Coffee"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Industry/Category</label>
                <select 
                  name="industry"
                  value={businessData.industry}
                  onChange={handleInputChange}
                  className="glass-input w-full appearance-none bg-card"
                >
                  <option value="">Select Industry</option>
                  {['Cafe', 'Restaurant', 'Gym', 'Clothing Brand', 'Salon', 'Real Estate', 'Coaching Institute', 'E-commerce', 'Tech Startup', 'Fitness Brand', 'Other'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">Business Description</label>
              <textarea 
                name="description"
                value={businessData.description}
                onChange={handleInputChange}
                className="glass-input w-full h-32 resize-none"
                placeholder="Describe your business in a few sentences..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Location/City</label>
                <input 
                  name="location"
                  value={businessData.location}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                  placeholder="e.g. Pune"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Website/Social Link</label>
                <input 
                  name="website"
                  value={businessData.website}
                  onChange={handleInputChange}
                  className="glass-input w-full"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Years in Business</label>
                <select 
                  name="yearsInBusiness"
                  value={businessData.yearsInBusiness}
                  onChange={handleInputChange}
                  className="glass-input w-full bg-card"
                >
                  <option value="">Select Range</option>
                  {['Startup', '1–2 Years', '3–5 Years', '5+ Years'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-400">Primary Audience Type (Multi-select)</label>
              <div className="flex flex-wrap gap-3">
                {['Students', 'Professionals', 'Families', 'Fitness Enthusiasts', 'Luxury Buyers', 'Business Owners', 'Teenagers', 'Travelers'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleMultiSelect('audienceType', opt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      businessData.audienceType.includes(opt)
                        ? 'bg-accent-start border-accent-start text-white shadow-accent-glow'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Target Age Group</label>
                <select name="ageGroup" value={businessData.ageGroup} onChange={handleInputChange} className="glass-input w-full bg-card">
                  <option value="">Select Age</option>
                  {['13–18', '18–24', '25–34', '35–44', '45+'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Income Level</label>
                <select name="incomeLevel" value={businessData.incomeLevel} onChange={handleInputChange} className="glass-input w-full bg-card">
                  <option value="">Select Level</option>
                  {['Budget', 'Mid-range', 'Premium', 'Luxury'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Customer Type</label>
                <select name="customerType" value={businessData.customerType} onChange={handleInputChange} className="glass-input w-full bg-card">
                  <option value="">Select Type</option>
                  {['Local Customers', 'Online Customers', 'Walk-in Customers', 'Subscription Customers'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-400">Brand Tone</label>
              <div className="flex flex-wrap gap-3">
                {['Professional', 'Modern', 'Friendly', 'Funny', 'Luxury', 'Minimal', 'Bold', 'Inspirational', 'Gen-Z'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleMultiSelect('tone', opt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      businessData.tone.includes(opt)
                        ? 'bg-accent-start border-accent-start text-white'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-400">Emoji Usage Level</label>
                    <span className="text-accent-start font-bold">{businessData.emojiLevel}%</span>
                  </div>
                  <input 
                    type="range" 
                    name="emojiLevel"
                    value={businessData.emojiLevel}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-start"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-400">Formal vs Casual</label>
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                      <span className={businessData.formalCasual < 50 ? 'text-accent-start' : 'text-gray-600'}>Formal</span>
                      <span className={businessData.formalCasual >= 50 ? 'text-accent-start' : 'text-gray-600'}>Casual</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    name="formalCasual"
                    value={businessData.formalCasual}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-start"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-400">Preferred Content Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Reels', 'Memes', 'Educational Posts', 'Promotional Offers', 'Storytelling', 'Testimonials', 'Product Showcase'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => handleMultiSelect('contentStyle', opt)}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all text-xs font-semibold ${
                        businessData.contentStyle.includes(opt)
                          ? 'bg-accent-start/20 border-accent-start text-white'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Primary Marketing Goal</label>
                <select name="primaryGoal" value={businessData.primaryGoal} onChange={handleInputChange} className="glass-input w-full bg-card">
                  <option value="">Select Goal</option>
                  {['Increase Sales', 'Increase Followers', 'Boost Engagement', 'Increase Website Traffic', 'Generate Leads', 'Increase Store Visits', 'Promote Events'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">CTA Style</label>
                <select name="ctaStyle" value={businessData.ctaStyle} onChange={handleInputChange} className="glass-input w-full bg-card">
                  <option value="">Select CTA</option>
                  {['Shop Now', 'Visit Today', 'Learn More', 'DM Us', 'Book Now', 'Limited Offer', 'Subscribe'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">Campaign Goal Description</label>
              <textarea 
                name="campaignDescription"
                value={businessData.campaignDescription}
                onChange={handleInputChange}
                className="glass-input w-full h-32 resize-none"
                placeholder="What exactly do you want to achieve with your next campaign?"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
             <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-400">Primary Platform</label>
              <div className="flex flex-wrap gap-4">
                {['Instagram', 'LinkedIn', 'Facebook', 'Twitter/X', 'YouTube', 'WhatsApp'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateBusinessData({ primaryPlatform: opt })}
                    className={`flex-1 min-w-[120px] p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                      businessData.primaryPlatform === opt
                        ? 'bg-accent-start/20 border-accent-start text-white ring-2 ring-accent-start/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    <span className="text-sm font-bold">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Posting Frequency</label>
                <select name="postingFrequency" value={businessData.postingFrequency} onChange={handleInputChange} className="glass-input w-full bg-card">
                  <option value="">Select Frequency</option>
                  {['Daily', '3 Times a Week', 'Weekly', 'Weekends Only'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-400">Content Format</label>
                <div className="flex flex-wrap gap-2">
                  {['Reels', 'Stories', 'Carousels', 'Posters', 'Videos', 'Text Posts', 'Infographics'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleMultiSelect('contentFormat', opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        businessData.contentFormat.includes(opt)
                          ? 'bg-accent-start border-accent-start text-white'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Competitor Names</label>
                  <input name="competitors" value={businessData.competitors} onChange={handleInputChange} className="glass-input w-full" placeholder="e.g. Starbucks, Third Wave" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Competitor Social Links</label>
                  <input name="competitorLinks" value={businessData.competitorLinks} onChange={handleInputChange} className="glass-input w-full" placeholder="Optional" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">What You Like About Competitors</label>
                <textarea name="competitorLikes" value={businessData.competitorLikes} onChange={handleInputChange} className="glass-input w-full h-24 resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">What Makes Your Business Unique (USP)</label>
                <textarea name="usp" value={businessData.usp} onChange={handleInputChange} className="glass-input w-full h-24 resize-none" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-accent-start/10 border border-accent-start/20 flex flex-col items-center text-center">
              <Bot size={48} className="text-accent-start mb-4" />
              <h3 className="text-xl font-bold mb-2">You're almost there!</h3>
              <p className="text-gray-400 text-sm max-w-md mb-6">
                Complete your profile to unlock full AI potential and start growing your brand.
              </p>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary w-full max-w-sm flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Complete Profile
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Business Profile</h2>
          <p className="text-gray-400">Step {currentStep} of 6: {steps.find(s => s.id === currentStep).title}</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                currentStep === step.id 
                  ? 'bg-gradient-accent text-white shadow-accent-glow' 
                  : currentStep > step.id 
                    ? 'bg-green-500/20 text-green-500 border border-green-500/20' 
                    : 'bg-white/5 text-gray-500 border border-white/10'
              }`}
            >
              {currentStep > step.id ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
            </div>
          ))}
        </div>
      </header>

      <div className="glass-card min-h-[500px] flex flex-col">
        <div className="p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-accent-start/10 flex items-center justify-center text-accent-start">
                  {React.createElement(steps.find(s => s.id === currentStep).icon, { size: 24 })}
                </div>
                <h3 className="text-2xl font-bold">{steps.find(s => s.id === currentStep).title}</h3>
              </div>
              
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 bg-white/5 border-t border-white/5 flex justify-between items-center">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-0"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="flex gap-4">
            <button className="btn-secondary hidden md:block">
              Save Draft
            </button>
            {currentStep < 6 ? (
              <button 
                onClick={nextStep}
                className="btn-primary flex items-center gap-2"
              >
                Next Step
                <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : 'Finalize Profile'}
                {!isSaving && <Save size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;

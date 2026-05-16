import React, { createContext, useContext, useState } from 'react';

const BusinessContext = createContext();

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider = ({ children }) => {
  const [businessData, setBusinessData] = useState({
    // Step 1: Business Information
    businessName: '',
    industry: '',
    description: '',
    location: '',
    website: '',
    yearsInBusiness: '',

    // Step 2: Target Audience
    audienceType: [], // multi-select
    ageGroup: '',
    interests: [], // tag input
    incomeLevel: '',
    customerType: '',

    // Step 3: Brand Personality
    tone: [], // multi-select
    personalityKeywords: [], // tag input
    emojiLevel: 50, // slider
    formalCasual: 50, // slider
    contentStyle: [], // multi-select

    // Step 4: Marketing Goals
    primaryGoal: '',
    secondaryGoal: '',
    ctaStyle: '',
    campaignDescription: '',

    // Step 5: Platform Preferences
    primaryPlatform: '',
    secondaryPlatforms: [], // multi-select
    postingFrequency: '',
    contentFormat: [], // multi-select

    // Step 6: Competitor & Market Insights
    competitors: '',
    competitorLinks: '',
    competitorLikes: '',
    usp: '',

    // Step 7: Design & Branding Preferences
    brandColors: ['#8B5CF6', '#3B82F6'], // multi-color
    fonts: [], // multi-select
    visualStyle: [], // multi-select
    brandKeywords: [], // tag input
    logo: null,

    // Step 8: Local & Festival Preferences
    targetCity: '',
    festivalInterest: true,
    preferredFestivals: [], // multi-select
    seasonalInterest: true,

    // Step 9: AI Preferences
    creativityLevel: 70, // slider
    captionLength: 'Medium',
    hashtagDensity: 50, // slider
    toneStrictness: 50, // slider
  });

  const updateBusinessData = (newData) => {
    setBusinessData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <BusinessContext.Provider value={{ businessData, updateBusinessData }}>
      {children}
    </BusinessContext.Provider>
  );
};

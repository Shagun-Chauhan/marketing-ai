import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BusinessProvider } from './context/BusinessContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import CampaignPlanner from './pages/CampaignPlanner';
import CalendarPlanner from './pages/CalendarPlanner';
import CaptionsHashtags from './pages/CaptionsHashtags';
import CompetitorAnalysis from './pages/CompetitorAnalysis';

function App() {
  return (
    <BusinessProvider>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<BusinessProfile />} />
            <Route path="/campaign" element={<CampaignPlanner />} />
            <Route path="/calendar" element={<CalendarPlanner />} />
            <Route path="/captions" element={<CaptionsHashtags />} />
            <Route path="/competitor" element={<CompetitorAnalysis />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </BusinessProvider>
  );
}

export default App;

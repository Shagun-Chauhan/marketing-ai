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
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BusinessProvider } from "./context/BusinessContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import BusinessProfile from "./pages/BusinessProfile";
import CampaignPlanner from "./pages/CampaignPlanner";
import CaptionsHashtags from "./pages/CaptionsHashtags";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";

function PrivateRoute({ children }) {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/business-profile" element={<BusinessProfile />} />
            <Route path="/campaign-planner" element={<CampaignPlanner />} />
            <Route path="/captions-hashtags" element={<CaptionsHashtags />} />
            <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BusinessProvider>
  );
}
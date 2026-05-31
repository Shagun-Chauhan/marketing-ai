import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCircle,
  LayoutGrid,
  Hash,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: UserCircle, label: 'Business Profile', path: '/profile' },
  { icon: Zap, label: 'Campaign Planner', path: '/campaign' },
  { icon: LayoutGrid, label: 'Content Planner', path: '/calendar' },
  { icon: Hash, label: 'Captions & Hashtags', path: '/captions' },
  { icon: BarChart3, label: 'Competitor Analysis', path: '/competitor' },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-white/10 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center shadow-accent-glow">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">BrandPilot <span className="text-accent-start">AI</span></h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

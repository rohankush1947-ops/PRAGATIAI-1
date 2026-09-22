import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { UserRole } from '../../types';
import { 
  Shield, 
  LayoutDashboard, 
  Flag, 
  PlusCircle, 
  Sparkles, 
  Search, 
  Users, 
  FileCheck, 
  Briefcase, 
  Gauge, 
  CheckSquare, 
  ShoppingCart, 
  TrendingUp, 
  BarChart3, 
  History, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown, 
  Award, 
  CheckCircle2, 
  RefreshCw,
  Eye,
  Building2,
  Rocket,
  UserCheck,
  Crown
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    resetDemoData 
  } = usePragati();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    if (role === 'government') navigate('/government/dashboard');
    else if (role === 'startup') navigate('/startup/dashboard');
    else if (role === 'expert') navigate('/expert/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  // Define nav items according to current role
  const getNavSections = () => {
    if (currentRole === 'government') {
      return [
        {
          title: 'Innovation Procurement',
          items: [
            { label: 'Dashboard', path: '/government/dashboard', icon: LayoutDashboard },
            { label: 'Challenges', path: '/government/challenges', icon: Flag },
            { label: 'Create Challenge', path: '/government/create-challenge', icon: PlusCircle },
            { label: 'AI Challenge Assistant', path: '/government/ai-assistant', icon: Sparkles, badge: 'AI' },
            { label: 'Startup Discovery', path: '/government/discovery', icon: Search },
            { label: 'AI Startup Matching', path: '/government/ai-matching', icon: Sparkles, badge: '94%' },
            { label: 'Applications', path: '/government/applications', icon: Users }
          ]
        },
        {
          title: 'Pilot & Scaling Lifecycle',
          items: [
            { label: 'Pilots Management', path: '/government/pilots', icon: Briefcase },
            { label: 'KPI Monitoring', path: '/government/kpi-monitoring', icon: Gauge },
            { label: 'Pilot Validation', path: '/government/validation', icon: CheckSquare, badge: 'Decision' },
            { label: 'Procurement & Contract', path: '/government/procurement', icon: ShoppingCart },
            { label: 'Scale-Up Plan', path: '/government/scale-up', icon: TrendingUp }
          ]
        },
        {
          title: 'Governance & Analytics',
          items: [
            { label: 'Reports & Analytics', path: '/government/reports', icon: BarChart3 },
            { label: 'Audit Log', path: '/government/audit-log', icon: History },
            { label: 'Notifications', path: '/government/notifications', icon: Bell }
          ]
        }
      ];
    }

    if (currentRole === 'startup') {
      return [
        {
          title: 'Startup Innovation Portal',
          items: [
            { label: 'Dashboard', path: '/startup/dashboard', icon: LayoutDashboard },
            { label: 'Find Challenges', path: '/startup/challenges', icon: Flag },
            { label: 'My Applications', path: '/startup/applications', icon: FileCheck },
            { label: 'Eligibility Screening', path: '/startup/eligibility', icon: CheckSquare, badge: 'Eligible' },
            { label: 'Pilot & Milestones', path: '/startup/pilots', icon: Briefcase, badge: '82%' },
            { label: 'Startup Profile', path: '/startup/profile', icon: Building2 },
            { label: 'Notifications', path: '/startup/notifications', icon: Bell }
          ]
        },
        {
          title: 'Connected Government Portals',
          items: [
            { label: 'View KPI Telemetry', path: '/government/kpi-monitoring', icon: Gauge },
            { label: 'Procurement Milestones', path: '/government/procurement', icon: ShoppingCart }
          ]
        }
      ];
    }

    if (currentRole === 'expert') {
      return [
        {
          title: 'Expert Evaluation Portal',
          items: [
            { label: 'Evaluator Dashboard', path: '/expert/dashboard', icon: LayoutDashboard },
            { label: 'Review Challenges', path: '/expert/challenges', icon: Flag },
            { label: 'Scoring Rubric', path: '/expert/evaluate/app-pwd-roadvision', icon: Award, badge: 'Rubric' },
            { label: 'Pilot Monitoring', path: '/government/kpi-monitoring', icon: Gauge },
            { label: 'Outcome Reports', path: '/government/reports', icon: BarChart3 },
            { label: 'Notifications', path: '/government/notifications', icon: Bell }
          ]
        }
      ];
    }

    // Admin role
    return [
      {
        title: 'Platform Administration',
        items: [
          { label: 'Admin Telemetry', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'All Challenges', path: '/government/challenges', icon: Flag },
          { label: 'Startup Marketplace', path: '/government/discovery', icon: Search },
          { label: 'Audit Registry', path: '/government/audit-log', icon: History },
          { label: 'System Reports', path: '/government/reports', icon: BarChart3 }
        ]
      }
    ];
  };

  const navSections = getNavSections();

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'government':
        return { name: 'Gov Officer', icon: Shield, color: 'text-sky-400 bg-sky-950/80 border-sky-800' };
      case 'startup':
        return { name: 'Startup Founder', icon: Rocket, color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' };
      case 'expert':
        return { name: 'Expert Evaluator', icon: UserCheck, color: 'text-purple-400 bg-purple-950/80 border-purple-800' };
      case 'admin':
        return { name: 'System Admin', icon: Crown, color: 'text-amber-400 bg-amber-950/80 border-amber-800' };
    }
  };

  const roleMeta = getRoleBadge();

  return (
    <div className="min-h-screen bg-[#070E1E] text-slate-100 flex flex-col font-sans">
      {/* Top SIH 2026 Prototype Status Banner */}
      <div className="bg-[#0B1528] border-b border-slate-800 px-4 py-1.5 text-xs text-slate-400 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-semibold text-slate-200">PRAGATI AI</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 hidden sm:inline">SIH 2026 Prototype — Team Pragyan</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-sky-400 hidden md:inline text-[11px] font-mono">Demo Story: PWD × RoadVision AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoData}
            title="Reset to default prototype state"
            className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
          <Link
            to="/"
            className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <span>Landing Page</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden lg:flex flex-col border-r border-slate-800 bg-[#0A1224] transition-all duration-300 select-none ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center shrink-0 border border-sky-400/40 shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight">
                  <div className="font-extrabold text-base tracking-tight text-white">
                    PRAGATI <span className="text-sky-400">AI</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">
                    Procurement Engine
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Role Status Tag */}
          {!sidebarCollapsed && (
            <div className="px-4 py-3 bg-[#080E1C] border-b border-slate-800/60">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                Active Portal Role
              </div>
              <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${roleMeta.color}`}>
                <roleMeta.icon className="w-4 h-4" />
                <span>{roleMeta.name}</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}
                      {!sidebarCollapsed && item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isActive 
                            ? 'bg-sky-700 text-white' 
                            : 'bg-slate-800 text-sky-400 border border-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer collapse toggle */}
          <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            {!sidebarCollapsed && (
              <span className="text-[11px] text-slate-400">SIH 2026 Prototype</span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              title="Toggle Sidebar width"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
              onClick={() => setMobileSidebarOpen(false)} 
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-[#0A1224] border-r border-slate-800 p-4 flex flex-col z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-white">PRAGATI AI</span>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {navSections.map((section, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      {section.title}
                    </div>
                    {section.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                            isActive
                              ? 'bg-sky-600 text-white font-semibold'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#070E1E]">
          {/* TOPBAR */}
          <header className="sticky top-0 z-20 h-16 bg-[#0B1528]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & Global Search */}
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative w-full max-w-sm hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search challenges, startups, pilots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#080E1D] border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            {/* Right: Role Switcher, Notifications, Profile */}
            <div className="flex items-center gap-3">
              {/* Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1C36] hover:bg-[#142546] border border-slate-700 text-xs font-medium text-slate-200 transition-all shadow-sm"
                >
                  <roleMeta.icon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline text-slate-400">Viewing as:</span>
                  <span className="font-semibold text-white">{roleMeta.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0F1C36] border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-scale-up">
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Switch Active Role
                    </div>
                    <button
                      onClick={() => handleRoleChange('government')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 ${
                        currentRole === 'government' ? 'text-sky-400 font-semibold bg-slate-800/40' : 'text-slate-300'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-sky-400" />
                      <div>
                        <div>Government Officer</div>
                        <div className="text-[10px] text-slate-400">Public Works Dept (PWD)</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleChange('startup')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 ${
                        currentRole === 'startup' ? 'text-emerald-400 font-semibold bg-slate-800/40' : 'text-slate-300'
                      }`}
                    >
                      <Rocket className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div>Startup Founder</div>
                        <div className="text-[10px] text-slate-400">RoadVision AI</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleChange('expert')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 ${
                        currentRole === 'expert' ? 'text-purple-400 font-semibold bg-slate-800/40' : 'text-slate-300'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-purple-400" />
                      <div>
                        <div>Expert Evaluator</div>
                        <div className="text-[10px] text-slate-400">Dr. Arvind Swaminathan (IITM)</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 ${
                        currentRole === 'admin' ? 'text-amber-400 font-semibold bg-slate-800/40' : 'text-slate-300'
                      }`}
                    >
                      <Crown className="w-4 h-4 text-amber-400" />
                      <div>
                        <div>System Admin</div>
                        <div className="text-[10px] text-slate-400">Platform Governance</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F1C36] border border-slate-700 rounded-xl shadow-2xl z-50 animate-scale-up overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-[#0B1528]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs hover:bg-slate-800/50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-sky-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-semibold text-slate-200">{n.title}</h5>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-1 leading-normal">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Pill */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400">
                  {currentRole === 'government' ? 'PWD' : currentRole === 'startup' ? 'RV' : currentRole === 'expert' ? 'AS' : 'AD'}
                </div>
                <div className="text-left leading-tight hidden xl:block">
                  <div className="text-xs font-semibold text-slate-200">
                    {currentRole === 'government' ? 'Er. Rajeshwar Rao' : currentRole === 'startup' ? 'Ananya Deshmukh' : currentRole === 'expert' ? 'Dr. A. Swaminathan' : 'Pragati Admin'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {currentRole === 'government' ? 'Chief Engineer (PWD)' : currentRole === 'startup' ? 'Founder, RoadVision AI' : currentRole === 'expert' ? 'Evaluation Chair, IITM' : 'SIH 2026 Admin'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

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
  Activity,
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
            { label: 'Scale-Up Plan', path: '/government/scale-up', icon: TrendingUp },
            { label: 'Impact Monitoring', path: '/government/impact-monitoring', icon: Activity, badge: 'Live' }
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
            { label: 'Procurement Milestones', path: '/government/procurement', icon: ShoppingCart },
            { label: 'Scale-Up Roadmap', path: '/government/scale-up', icon: TrendingUp },
            { label: 'Impact Telemetry', path: '/government/impact-monitoring', icon: Activity }
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
            { label: 'Scale-Up Visibility', path: '/government/scale-up', icon: TrendingUp },
            { label: 'Impact Visibility', path: '/government/impact-monitoring', icon: Activity },
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
        return { name: 'Gov Officer', icon: Shield, color: 'text-sky-800 bg-sky-50 border-sky-200' };
      case 'startup':
        return { name: 'Startup Founder', icon: Rocket, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
      case 'expert':
        return { name: 'Expert Evaluator', icon: UserCheck, color: 'text-purple-800 bg-purple-50 border-purple-200' };
      case 'admin':
        return { name: 'System Admin', icon: Crown, color: 'text-amber-800 bg-amber-50 border-amber-200' };
    }
  };

  const roleMeta = getRoleBadge();

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col font-sans">
      {/* Authentic Indian Government Tricolor Header Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] shrink-0" />

      {/* Top SIH 2026 Prototype Status Banner */}
      <div className="gov-top-bar bg-[#0B2545] border-b border-slate-700/80 px-4 py-1.5 text-xs text-slate-200 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-bold text-white tracking-wide">PRAGATI AI</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-200 hidden sm:inline">Smart India Hackathon 2026 Prototype — Team Pragyan</span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-sky-300 hidden md:inline text-[11px] font-mono">Demo Story: PWD × RoadVision AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetDemoData}
            title="Reset to default prototype state"
            className="flex items-center gap-1.5 text-[11px] text-slate-200 hover:text-white bg-[#133763] hover:bg-[#1a477d] px-2.5 py-0.5 rounded border border-sky-900/60 transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
          <Link
            to="/"
            className="text-[11px] text-sky-300 hover:text-white flex items-center gap-1 font-semibold"
          >
            <span>Landing Page</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 select-none shadow-sm ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center shrink-0 border border-sky-400/40 shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight">
                  <div className="font-extrabold text-base tracking-tight text-slate-900">
                    PRAGATI <span className="text-sky-700">AI</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold truncate">
                    Procurement Engine
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Role Status Tag */}
          {!sidebarCollapsed && (
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
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
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
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
                          ? 'bg-sky-700 text-white shadow-sm font-semibold'
                          : 'text-slate-700 hover:text-sky-900 hover:bg-slate-100'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      {!sidebarCollapsed && (
                        <span className={`flex-1 truncate font-medium ${isActive ? 'text-white' : 'text-slate-700'}`}>{item.label}</span>
                      )}
                      {!sidebarCollapsed && item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isActive 
                            ? 'bg-sky-800 text-white' 
                            : 'bg-sky-100 text-sky-800 border border-sky-200'
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
          <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setMobileSidebarOpen(false)} 
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 p-4 flex flex-col z-10 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-700 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-slate-900">PRAGATI AI</span>
                </div>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {navSections.map((section, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
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
                              ? 'bg-sky-700 text-white font-semibold'
                              : 'text-slate-700 hover:text-sky-900 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className={`flex-1 font-medium ${isActive ? 'text-white' : 'text-slate-700'}`}>{item.label}</span>
                          {item.badge && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              isActive
                                ? 'bg-sky-800 text-white'
                                : 'bg-sky-100 text-sky-800 border border-sky-200'
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
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F4F6F9]">
          {/* TOPBAR */}
          <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-sm">
            {/* Left: Mobile hamburger & Global Search */}
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 transition-all"
                />
              </div>
            </div>

            {/* Right: Role Switcher, Notifications, Profile */}
            <div className="flex items-center gap-3">
              {/* Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-medium text-slate-800 transition-all shadow-sm"
                >
                  <roleMeta.icon className="w-3.5 h-3.5 text-sky-700" />
                  <span className="hidden md:inline text-slate-500">Viewing as:</span>
                  <span className="font-bold text-slate-900">{roleMeta.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 animate-scale-up">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Switch Active Role
                    </div>
                    <button
                      onClick={() => handleRoleChange('government')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 ${
                        currentRole === 'government' ? 'text-sky-800 font-semibold bg-sky-50/70' : 'text-slate-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-sky-700" />
                      <div>
                        <div className="font-semibold text-slate-900">Government Officer</div>
                        <div className="text-[10px] text-slate-500">Public Works Dept (PWD)</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleChange('startup')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 ${
                        currentRole === 'startup' ? 'text-emerald-800 font-semibold bg-emerald-50/70' : 'text-slate-700'
                      }`}
                    >
                      <Rocket className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Startup Founder</div>
                        <div className="text-[10px] text-slate-500">RoadVision AI</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleChange('expert')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 ${
                        currentRole === 'expert' ? 'text-purple-800 font-semibold bg-purple-50/70' : 'text-slate-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-semibold text-slate-900">Expert Evaluator</div>
                        <div className="text-[10px] text-slate-500">Dr. Arvind Swaminathan (IITM)</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-50 ${
                        currentRole === 'admin' ? 'text-amber-800 font-semibold bg-amber-50/70' : 'text-slate-700'
                      }`}
                    >
                      <Crown className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-semibold text-slate-900">System Admin</div>
                        <div className="text-[10px] text-slate-500">Platform Governance</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-scale-up overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-sky-700 hover:text-sky-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-sky-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-semibold text-slate-900">{n.title}</h5>
                            <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1 leading-normal">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Pill */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-xs font-bold text-sky-800">
                  {currentRole === 'government' ? 'PWD' : currentRole === 'startup' ? 'RV' : currentRole === 'expert' ? 'AS' : 'AD'}
                </div>
                <div className="text-left leading-tight hidden xl:block">
                  <div className="text-xs font-semibold text-slate-900">
                    {currentRole === 'government' ? 'Er. Rajeshwar Rao' : currentRole === 'startup' ? 'Ananya Deshmukh' : currentRole === 'expert' ? 'Dr. A. Swaminathan' : 'Pragati Admin'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
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

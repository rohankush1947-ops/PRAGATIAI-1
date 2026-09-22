import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Menu, X, ArrowRight, ExternalLink } from 'lucide-react';
import { usePragati } from '../../context/PragatiContext';

export const LandingNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setCurrentRole } = usePragati();
  const navigate = useNavigate();

  const handleQuickRole = (role: 'government' | 'startup' | 'expert' | 'admin', path: string) => {
    setCurrentRole(role);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#070E1E]/90 border-b border-slate-800">
      {/* Top Gov ribbon */}
      <div className="bg-[#0B1528] border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-300">Smart India Hackathon (SIH 2026) Prototype</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">Team: <strong className="text-sky-400 font-semibold">Pragyan</strong></span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">Startup-Friendly Public Procurement Platform</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-800 flex items-center justify-center shadow-md shadow-sky-900/30 border border-sky-400/30 group-hover:border-sky-400 transition-all">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  PRAGATI <span className="text-sky-400">AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60 uppercase">
                  Gov-Tech
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium">
                Public Innovation Procurement
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#hero" className="hover:text-sky-400 transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a>
            <button onClick={() => handleQuickRole('government', '/government/dashboard')} className="hover:text-sky-400 transition-colors">For Government</button>
            <button onClick={() => handleQuickRole('startup', '/startup/dashboard')} className="hover:text-sky-400 transition-colors">For Startups</button>
            <button onClick={() => handleQuickRole('expert', '/expert/dashboard')} className="hover:text-sky-400 transition-colors">For Experts</button>
            <a href="#challenges" className="hover:text-sky-400 transition-colors">Challenges</a>
            <a href="#about" className="hover:text-sky-400 transition-colors">About</a>
          </nav>

          {/* Auth / Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition-all"
            >
              Role Login
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow-sm shadow-sky-900/40 flex items-center gap-1.5 transition-all hover:translate-y-[-1px]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg"
            >
              Launch Demo
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0B1528] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-slate-300">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800">Home</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800">How It Works</a>
            <button onClick={() => { setMobileMenuOpen(false); handleQuickRole('government', '/government/dashboard'); }} className="text-left px-3 py-2 rounded-lg hover:bg-slate-800">For Government</button>
            <button onClick={() => { setMobileMenuOpen(false); handleQuickRole('startup', '/startup/dashboard'); }} className="text-left px-3 py-2 rounded-lg hover:bg-slate-800">For Startups</button>
            <button onClick={() => { setMobileMenuOpen(false); handleQuickRole('expert', '/expert/dashboard'); }} className="text-left px-3 py-2 rounded-lg hover:bg-slate-800">For Experts</button>
            <a href="#challenges" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800">Challenges</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800">About</a>
          </nav>
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <Link
              to="/login"
              className="flex-1 text-center py-2 text-sm font-medium bg-slate-800 text-slate-200 rounded-lg"
            >
              Role Selection
            </Link>
            <Link
              to="/government/dashboard"
              className="flex-1 text-center py-2 text-sm font-semibold bg-sky-600 text-white rounded-lg"
            >
              Live Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

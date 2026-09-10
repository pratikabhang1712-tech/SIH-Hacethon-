import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Layers,
  Compass,
  BookOpen,
  Terminal,
  Award,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Flame,
  ChevronDown,
  LogOut,
  GraduationCap,
  Sliders,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CoderArmyLogo } from './CoderArmyLogo';

interface Props {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenOnboarding: () => void;
}

export const Navigation: React.FC<Props> = ({ currentView, onViewChange, onOpenOnboarding }) => {
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'progress', label: 'Progress Graph', icon: TrendingUp },
    { id: 'gap', label: 'Skill Gap Analysis', icon: Layers, highlight: true },
    { id: 'assessment', label: 'Skill Assessments', icon: Compass },
    { id: 'learning', label: 'Learning Path', icon: BookOpen },
    { id: 'practice', label: 'Practice Lab', icon: Terminal },
    { id: 'readiness', label: 'Career Readiness', icon: Award },
    { id: 'skills', label: 'My Skills', icon: GraduationCap },
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all">
      {/* Top Banner with SIH badge & Quick Demo Switcher */}
      <div className="bg-slate-950 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-linear-to-r from-indigo-500 to-sky-500 text-white font-black px-2 py-0.5 rounded-sm text-[10px] tracking-wider uppercase shadow-xs">
            SIH PROTOTYPE
          </span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            Capacity Connect — Moving beyond passive video completion to verified skill capacity
          </span>
        </div>

        {/* Quick Demo Switcher for Judges & Presentation */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Quick Role Switch:</span>
          <button
            type="button"
            onClick={() => switchRole('student')}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              user?.role === 'student'
                ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👨‍🎓 Student
          </button>
          <button
            type="button"
            onClick={() => {
              switchRole('admin');
              onViewChange('admin');
            }}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              user?.role === 'admin'
                ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏛️ College Admin
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => handleNavClick('dashboard')}
          >
            <CoderArmyLogo
              size={40}
              variant="badge"
              className="shadow-sm shrink-0 rounded-xl transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  CODER ARMY
                </span>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/70 tracking-wide">
                  CAPACITY CONNECT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-tight -mt-0.5">
                Code • Build • Impact — Skill & Capacity Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links with sliding active highlight */}
          <nav className="hidden lg:flex items-center gap-1 relative">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer relative ${
                    isActive
                      ? 'text-indigo-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-indigo-50 border border-indigo-200/80 rounded-lg -z-10 shadow-2xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}

            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer relative ${
                  currentView === 'admin'
                    ? 'text-amber-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentView === 'admin' && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-amber-50 border border-amber-200/80 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Suite</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200/80 text-amber-800 rounded-lg text-xs font-extrabold shadow-2xs hover:shadow-xs transition-shadow">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>7 Day Streak</span>
            </div>

            {/* Profile pill with dropdown/modal trigger */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={onOpenOnboarding}
                title="Re-run Diagnostic Onboarding"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                  {user?.name || 'Student'}
                </div>
                <div className="text-[10px] text-indigo-600 font-semibold truncate max-w-[130px]">
                  {user?.role === 'admin' ? 'College Admin' : user?.profile?.targetCareerId?.replace('career-', '').toUpperCase() || 'SWE'}
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-xl overflow-hidden"
          >
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-xs font-bold">Core</span>}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer ${
                currentView === 'admin' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Management</span>
            </button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                Retake Onboarding
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-rose-600 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};


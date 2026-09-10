import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './views/DashboardView';
import { SkillGapView } from './views/SkillGapView';
import { AssessmentView } from './views/AssessmentView';
import { LearningPathView } from './views/LearningPathView';
import { LearningModuleView } from './views/LearningModuleView';
import { PracticeView } from './views/PracticeView';
import { CareerReadinessView } from './views/CareerReadinessView';
import { ProgressView } from './views/ProgressView';
import { SkillsView } from './views/SkillsView';
import { AdminView } from './views/AdminView';
import { AuthView } from './views/AuthView';
import { CoderArmyLogo } from './components/CoderArmyLogo';
import { api } from './api';
import { Career, Skill } from './types';

function MainApp() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [viewParam, setViewParam] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [careers, setCareers] = useState<Career[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const loadPrerequisites = async () => {
      try {
        const [cList, sList] = await Promise.all([
          api.getCareers(),
          api.getSkills(),
        ]);
        setCareers(cList);
        setSkills(sList);
      } catch (e) {
        console.error('Prerequisites load error', e);
      }
    };
    loadPrerequisites();
  }, []);

  // Open onboarding if student has not completed onboarding
  useEffect(() => {
    if (user && user.role === 'student' && user.profile && !user.profile.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleNavigate = (view: string, extra?: any) => {
    setCurrentView(view);
    setViewParam(extra || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-extrabold text-lg tracking-tight">CAPACITY CONNECT</span>
        <span className="text-xs text-slate-400 mt-1">Initializing Smart Skill Gap Engine...</span>
      </div>
    );
  }

  if (!user) {
    return <AuthView onSuccess={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen subtle-mesh-bg flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={handleNavigate}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
            {currentView === 'progress' && <ProgressView onNavigate={handleNavigate} />}
            {currentView === 'gap' && <SkillGapView onNavigate={handleNavigate} />}
            {currentView === 'assessment' && (
              <AssessmentView initialSkillId={viewParam} onNavigate={handleNavigate} />
            )}
            {currentView === 'learning' && <LearningPathView onNavigate={handleNavigate} />}
            {currentView === 'module' && (
              <LearningModuleView moduleId={viewParam || 'mod-dsa-1'} onNavigate={handleNavigate} />
            )}
            {currentView === 'practice' && <PracticeView />}
            {currentView === 'readiness' && <CareerReadinessView onNavigate={handleNavigate} />}
            {currentView === 'skills' && <SkillsView onNavigate={handleNavigate} />}
            {currentView === 'admin' && <AdminView onNavigate={handleNavigate} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        careers={careers}
        skills={skills}
        onComplete={() => setShowOnboarding(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CoderArmyLogo size={20} variant="badge" roundedClassName="rounded-xs" className="shrink-0" />
            <span className="font-bold text-slate-800">Coder Army • Capacity Connect</span>
            <span>• Smart Student Skill & Capacity Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavigate('progress')}
              className="hover:text-indigo-600 cursor-pointer font-medium"
            >
              Progress Graph
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('gap')}
              className="hover:text-indigo-600 cursor-pointer font-medium"
            >
              Skill Gap Matrix
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('readiness')}
              className="hover:text-indigo-600 cursor-pointer font-medium"
            >
              Readiness Score
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('assessment')}
              className="hover:text-indigo-600 cursor-pointer font-medium"
            >
              Diagnostic Tests
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

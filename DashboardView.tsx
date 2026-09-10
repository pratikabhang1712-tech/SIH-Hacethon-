import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  TrendingUp,
  BookOpen,
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Sparkles,
  ChevronRight,
  Target,
  Zap,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { ProgressAnalyticsResponse, GapAnalysisResponse } from '../types';
import { CapacityPipelineVisual } from '../components/CapacityPipelineVisual';
import { SkillRadarChart } from '../components/SkillRadarChart';
import { AIRecommendationPanel } from '../components/AIRecommendationPanel';
import { ProgressGraph } from '../components/ProgressGraph';

interface Props {
  onNavigate: (view: string, extra?: any) => void;
}

export const DashboardView: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ProgressAnalyticsResponse | null>(null);
  const [gapData, setGapData] = useState<GapAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [anData, gData] = await Promise.all([
          api.getProgressAnalytics(),
          api.getSkillGap(),
        ]);
        setAnalytics(anData);
        setGapData(gData);
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const readinessScore = analytics?.overallCareerReadiness || 68;
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const radarSkills = gapData?.gaps.slice(0, 6).map(g => ({
    name: g.skillName.split(' ')[0], // Short name for clean radar rendering
    currentScore: g.currentScore,
    requiredScore: g.requiredLevel === 'Advanced' ? 85 : g.requiredLevel === 'Intermediate' ? 65 : 45,
  })) || [
    { name: 'C++', currentScore: 75, requiredScore: 65 },
    { name: 'DSA', currentScore: 45, requiredScore: 85 },
    { name: 'DBMS', currentScore: 50, requiredScore: 65 },
    { name: 'OOP', currentScore: 70, requiredScore: 65 },
    { name: 'Problem', currentScore: 55, requiredScore: 80 },
    { name: 'Git', currentScore: 60, requiredScore: 65 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Cockpit Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-slate-950 to-indigo-950 p-6 md:p-8 text-white shadow-xl border border-slate-800"
      >
        {/* Ambient Glows */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                Live Student Capacity Engine
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {user?.profile?.branch || 'Computer Science'} • {user?.profile?.currentYearSemester || '3rd Year'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {greeting}, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Target Goal: <span className="text-white font-extrabold bg-indigo-500/30 px-2 py-0.5 rounded-md border border-indigo-400/30">{gapData?.career.title || 'Software Developer'}</span>.
              Continuous diagnostic capacity stands at <span className="text-emerald-400 font-black">{readinessScore}% verified readiness</span>.
            </p>
          </div>

          {/* Circular Readiness Gauge & Action Hub */}
          <div className="flex items-center gap-5 shrink-0 bg-slate-900/80 p-4 rounded-xl border border-slate-800/90 backdrop-blur-sm shadow-inner">
            {/* SVG Circular Progress Gauge */}
            <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#334155"
                  strokeWidth="5"
                  fill="transparent"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#38bdf8"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 26}
                  initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - (readinessScore / 100)) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black text-white">{readinessScore}%</span>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold">Ready</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onNavigate('gap')}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer justify-center"
              >
                <Layers className="w-3.5 h-3.5" />
                Analyze Gap Matrix
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onNavigate('assessment')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer justify-center"
              >
                <Compass className="w-3.5 h-3.5" />
                Take Assessment
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top 4 Capacity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Readiness */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onClick={() => onNavigate('readiness')}
          className="pro-card rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Career Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {readinessScore}%
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              +14% this month
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-indigo-600 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${readinessScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 line-clamp-1 font-medium">
            Target: {gapData?.career.title || 'Software Developer'}
          </p>
        </motion.div>

        {/* Metric 2: Capacity Development Delta */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onClick={() => onNavigate('skills')}
          className="pro-card rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Skill Leap</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              DSA: Beg → Int
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
              Verified
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-emerald-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 line-clamp-1 font-medium">
            Score surged from 45% to 75%
          </p>
        </motion.div>

        {/* Metric 3: Learning Consistency Streak */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onClick={() => onNavigate('practice')}
          className="pro-card rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Flame className="w-4 h-4 fill-amber-500 group-hover:fill-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {analytics?.stats.streakDays || 7} Days
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
              High Focus
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-amber-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 line-clamp-1 font-medium">
            {analytics?.stats.totalSolvedPractice || 6} problems solved
          </p>
        </motion.div>

        {/* Metric 4: Curriculum Modules Completed */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onClick={() => onNavigate('learning')}
          className="pro-card rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Curriculum Path</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {analytics?.stats.completedModulesCount || 2} / 10
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              Modules
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-sky-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '20%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 line-clamp-1 font-medium">
            Active: DSA Fundamentals
          </p>
        </motion.div>
      </div>

      {/* Central Capacity Progress Visualization */}
      <CapacityPipelineVisual
        currentStage="gap"
        onStageClick={view => onNavigate(view)}
      />

      {/* Interactive Progress Graph */}
      {analytics && (
        <ProgressGraph
          timeline={analytics.timeline}
          careerGoal={gapData?.career.title || 'Software Developer'}
          currentReadiness={analytics.overallCareerReadiness}
        />
      )}

      {/* Main 2-Column Analytics & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Radar Chart & Skill Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skill Radar / Abilities Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skill Competency Radar</h3>
                <p className="text-xs text-slate-500">Student abilities vs Industry target benchmark</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('assessment')}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Reassess
              </button>
            </div>

            <div className="py-2">
              <SkillRadarChart skills={radarSkills} size={290} />
            </div>

            {/* Quick Strong vs Weak skills */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Strong Skills:</span>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                    C++ (75%)
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                    OOP (70%)
                  </span>
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-700 block mb-1">Needs Work:</span>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                    DSA (45%)
                  </span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                    DBMS (50%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Learning Path Progress Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Personalized Learning Roadmap</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('learning')}
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                Full Path <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Active Module #3
                </span>
                <span className="text-xs font-semibold text-slate-600">35% Completed</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">
                Data Structures & Algorithms: Fundamentals & Complexity
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Addressing your critical gap for Software Developer interviews.
              </p>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '35%' }} />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Est. 45 mins remaining</span>
                <button
                  type="button"
                  onClick={() => onNavigate('module', 'mod-dsa-1')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  Resume Lesson
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): AI Recommendation Engine & Skill Gap Spotlight */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gemini AI Mentor */}
          <AIRecommendationPanel
            onSelectSkillToLearn={() => onNavigate('learning')}
          />

          {/* Quick Skill Gap Preview Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skill Gap Diagnosis Spotlight</h3>
                <p className="text-xs text-slate-500">
                  Calculated against <strong>{gapData?.career.title || 'Software Developer'}</strong> requirements
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('gap')}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                Detailed Gap View <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-2">Skill</th>
                    <th className="pb-2">Current</th>
                    <th className="pb-2">Required</th>
                    <th className="pb-2">Gap Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gapData?.gaps.map(g => (
                    <tr key={g.skillId} className="hover:bg-slate-50/70">
                      <td className="py-2.5 font-bold text-slate-800">{g.skillName}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-sm font-medium ${
                          g.currentLevel === 'Advanced' ? 'bg-emerald-100 text-emerald-800' :
                          g.currentLevel === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {g.currentLevel}
                        </span>
                      </td>
                      <td className="py-2.5 font-semibold text-slate-600">{g.requiredLevel}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          g.isMet
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : g.gapType === 'Critical' || g.gapType === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {g.statusText}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (g.isMet) {
                              onNavigate('assessment', g.skillId);
                            } else {
                              onNavigate('learning');
                            }
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                        >
                          {g.isMet ? 'Re-test' : 'Bridge Gap'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

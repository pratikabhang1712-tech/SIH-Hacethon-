import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  ChevronDown,
  Info,
  BookOpen,
  Compass,
  Briefcase,
  Radar
} from 'lucide-react';
import { GapAnalysisResponse, Career } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { SkillRadarChart } from '../components/SkillRadarChart';

interface Props {
  onNavigate: (view: string, extra?: any) => void;
}

export const SkillGapView: React.FC<Props> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string>(
    user?.profile?.targetCareerId || 'career-swe'
  );
  const [gapData, setGapData] = useState<GapAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const list = await api.getCareers();
        setCareers(list);
      } catch (e) {
        console.error('Failed to load careers', e);
      }
    };
    loadCareers();
  }, []);

  const fetchGap = async (careerId: string) => {
    setLoading(true);
    try {
      const res = await api.getSkillGap(careerId);
      setGapData(res);
    } catch (e) {
      console.error('Failed to fetch skill gap', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGap(selectedCareerId);
  }, [selectedCareerId]);

  const handleCareerChange = async (careerId: string) => {
    setSelectedCareerId(careerId);
    try {
      await api.updateProfile({ targetCareerId: careerId });
      await refreshUser();
    } catch (e) {
      console.error('Failed to update target career in profile', e);
    }
  };

  const radarSkills = gapData?.gaps.map(g => ({
    name: g.skillName.length > 10 ? g.skillName.split(' ')[0] : g.skillName,
    currentScore: g.currentScore,
    requiredScore: g.requiredLevel === 'Advanced' ? 85 : g.requiredLevel === 'Intermediate' ? 65 : 45,
  })) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-16"
    >
      {/* Header with Career Switcher */}
      <motion.div
        variants={itemVariants}
        className="pro-card rounded-2xl p-6 sm:p-7 shadow-sm bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-linear-to-l from-amber-50/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600 border border-amber-200/60">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Continuous Skill Gap Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Skill Gap Matrix
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Compare your current verified abilities against industry hiring benchmarks. Identify exactly what is missing and focus your study time on high-impact gaps.
            </p>
          </div>

          {/* Career Goal Dropdown */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 shadow-2xs">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Target Role Benchmark
              </label>
              <select
                value={selectedCareerId}
                onChange={e => handleCareerChange(e.target.value)}
                className="mt-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
              >
                {careers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="pl-3 sm:border-l sm:border-slate-200 text-xs">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Role Readiness</span>
              <span className="font-black text-indigo-600 text-xl">
                {gapData?.stats.overallReadinessPercent || 65}%
              </span>
            </div>
          </div>
        </div>

        {/* Role overview stats bar */}
        {gapData?.career && (
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold">Industry Category</span>
              <span className="font-bold text-slate-800 text-sm">{gapData.career.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold">Avg Fresher Package</span>
              <span className="font-bold text-slate-800 text-sm">{gapData.career.averageSalary || '₹8,00,000 / yr'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold">Market Demand</span>
              <span className="font-bold text-emerald-700 text-sm">{gapData.career.demandLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-semibold">Required Skills</span>
              <span className="font-bold text-slate-800 text-sm">{gapData.stats.totalRequired} Competencies</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ y: -2 }} className="pro-card rounded-2xl p-5 shadow-xs bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Requirements Met</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {gapData?.stats.metCount || 0} of {gapData?.stats.totalRequired || 0}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              Competent
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">Skills currently meeting minimum role proficiency.</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="pro-card rounded-2xl p-5 shadow-xs bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical & High Gaps</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">
              {gapData?.stats.criticalCount || 0}
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
              Priority Focus
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">Must be upgraded to pass technical screening rounds.</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="pro-card-dark rounded-2xl p-5 shadow-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-indigo-300">
              <span className="text-xs font-bold uppercase tracking-wider">Fastest Career Boost</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              DSA & Algorithmic Problem Solving
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Bridging this gap brings your readiness from 65% → 82%.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('learning')}
            className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            Start Learning Path for this Gap
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </motion.div>

      {/* Radar Chart & Comparison Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart Card */}
        <div className="pro-card rounded-2xl p-6 shadow-sm bg-white flex flex-col items-center justify-between">
          <div className="w-full pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                <Radar className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-black text-slate-900">Skill Competency Radar</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Hover nodes</span>
          </div>

          <div className="py-4 w-full flex justify-center">
            {radarSkills.length > 0 && (
              <SkillRadarChart skills={radarSkills} size={280} />
            )}
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Outer dashed polygon indicates the minimum {gapData?.career.title} hiring bar.
          </p>
        </div>

        {/* Gap Matrix Cards */}
        <div className="lg:col-span-2 pro-card rounded-2xl p-6 shadow-sm bg-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Skill-by-Skill Gap Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact comparison of your verified level against the {gapData?.career.title} hiring bar.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" /> Your Score
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" /> Benchmark
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {gapData?.gaps.map(item => {
              const reqScore = item.requiredLevel === 'Advanced' ? 85 : item.requiredLevel === 'Intermediate' ? 65 : 45;
              const currentScore = Math.min(100, Math.max(item.currentScore, 10));

              return (
                <motion.div
                  key={item.skillId}
                  whileHover={{ y: -1 }}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all shadow-2xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Left: Skill title & category */}
                    <div className="md:w-1/4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{item.skillName}</span>
                        <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded-xs font-bold">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>Weight in Role: <strong>{item.weight}x</strong></span>
                      </div>
                    </div>

                    {/* Middle: Level tags */}
                    <div className="flex items-center gap-3 text-xs md:w-1/3">
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex-1 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Current Level</span>
                        <span className={`font-black ${
                          item.currentLevel === 'Advanced' ? 'text-emerald-700' :
                          item.currentLevel === 'Intermediate' ? 'text-blue-700' :
                          'text-amber-700'
                        }`}>
                          {item.currentLevel}
                        </span>
                      </div>

                      <span className="text-slate-400 font-bold">vs</span>

                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex-1 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Required Level</span>
                        <span className="font-black text-slate-900">
                          {item.requiredLevel}
                        </span>
                      </div>
                    </div>

                    {/* Gap Badge */}
                    <div className="md:w-1/5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        item.isMet
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.gapType === 'Critical' || item.gapType === 'High'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.isMet ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {item.statusText}
                      </span>
                    </div>

                    {/* Action CTA */}
                    <div className="md:w-1/6 text-right">
                      {item.isMet ? (
                        <button
                          type="button"
                          onClick={() => onNavigate('assessment', item.skillId)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                        >
                          Re-Assess
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate('learning')}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer shadow-2xs transition-colors"
                        >
                          Bridge Gap
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comparative Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200/70">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                      <span>Current Capacity: <strong>{item.currentScore}%</strong></span>
                      <span>Industry Benchmark Target: <strong>{reqScore}%</strong></span>
                    </div>
                    <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      {/* Benchmark marker line */}
                      <div
                        className="absolute top-0 bottom-0 w-1.5 bg-amber-500 z-20 shadow-xs"
                        style={{ left: `${reqScore}%` }}
                        title={`Target benchmark: ${reqScore}%`}
                      />
                      {/* Current ability fill */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentScore}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          item.isMet ? 'bg-emerald-600' : 'bg-indigo-600'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Button at bottom */}
          <div className="mt-8 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ready to eliminate your skill gaps?</h4>
                <p className="text-xs text-slate-600">
                  Your personalized learning curriculum is ordered specifically to address your high and medium gap skills first.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('learning')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
            >
              Start Learning Path for this Gap
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

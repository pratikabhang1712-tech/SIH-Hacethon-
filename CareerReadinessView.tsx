import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  Compass,
  Check
} from 'lucide-react';
import { CareerReadinessResponse, ProgressAnalyticsResponse } from '../types';
import { api } from '../api';
import { ProgressGraph } from '../components/ProgressGraph';

interface Props {
  onNavigate: (view: string, extra?: any) => void;
}

export const CareerReadinessView: React.FC<Props> = ({ onNavigate }) => {
  const [readiness, setReadiness] = useState<CareerReadinessResponse | null>(null);
  const [analytics, setAnalytics] = useState<ProgressAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [rData, aData] = await Promise.all([
          api.getCareerReadiness(),
          api.getProgressAnalytics(),
        ]);
        setReadiness(rData);
        setAnalytics(aData);
      } catch (e) {
        console.error('Failed to load readiness data', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const overallScore = readiness?.readinessPercent || 72;

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
      {/* Top Banner with Big Capacity Statement */}
      <motion.div
        variants={itemVariants}
        className="pro-card-dark rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-300">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Placement & Industry Preparedness Metric
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Target Career: {readiness?.career.title || 'Software Developer'}
            </h1>

            {/* Crucial Capacity Statement */}
            <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-100 text-sm sm:text-base font-semibold max-w-2xl mt-3">
              "{analytics?.capacityStatement || `You are ${overallScore}% ready for your Software Developer goal.`}"
            </div>

            <p className="text-xs text-slate-300 mt-2">
              Unlike ordinary course certificates, this score verifies actual diagnostic capacity across coding, algorithms, and system fundamentals.
            </p>
          </div>

          {/* Radial Circular Gauge */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/70 border border-indigo-500/30 rounded-2xl shrink-0 shadow-lg">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-800"
                  fill="transparent"
                />
                <motion.circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 60}
                  initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - overallScore / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  className="text-indigo-500"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white">{overallScore}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ready</span>
              </div>
            </div>

            <span className="text-xs text-indigo-300 font-semibold mt-2.5">
              Tier 1 Placement Ready: 85%+
            </span>
          </div>
        </div>
      </motion.div>

      {/* Trajectory Progress Graph */}
      <motion.div variants={itemVariants}>
        {analytics && (
          <ProgressGraph
            timeline={analytics.timeline}
            careerGoal={readiness?.career.title || 'Software Developer'}
            currentReadiness={overallScore}
          />
        )}
      </motion.div>

      {/* Skill List Breakdown */}
      <motion.div variants={itemVariants} className="pro-card rounded-2xl p-6 sm:p-7 shadow-sm bg-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Competency Breakdown for {readiness?.career.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Skill-by-skill capacity score compared with benchmark requirements
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('gap')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer group"
          >
            Inspect Detailed Gap <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="space-y-3">
          {readiness?.skills.map(s => {
            const isReady = s.isReady;
            return (
              <motion.div
                key={s.skillId}
                whileHover={{ y: -1 }}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-all"
              >
                <div className="sm:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{s.skillName}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-xs font-bold">
                      {s.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 block">
                    Current: <strong>{s.currentLevel}</strong> vs Required: <strong>{s.requiredLevel}</strong>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="sm:w-1/3">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1 font-medium">
                    <span>Capacity Score</span>
                    <span className="font-bold text-indigo-600">{s.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        isReady ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}
                    />
                  </div>
                </div>

                <div className="sm:w-1/4 flex items-center justify-end">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isReady
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {isReady ? <Check className="w-3 h-3 text-emerald-700" /> : <AlertTriangle className="w-3 h-3 text-amber-700" />}
                    {isReady ? 'Ready for Interviews' : 'Skill Gap Pending'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Ready Skills vs Weak Skills 2-Column Split */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ready Skills */}
        <div className="pro-card rounded-2xl p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 text-emerald-700 font-black text-sm mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready Skills ({readiness?.readySkills.length || 0})</span>
          </div>
          <div className="space-y-2.5">
            {readiness?.readySkills.map((s: any) => (
              <div key={s.skillId} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-xs text-emerald-950 block">{s.skillName}</span>
                  <span className="text-[11px] text-emerald-700 font-medium">Verified Level: {s.currentLevel} ({s.score}%)</span>
                </div>
                <span className="text-[11px] font-black text-emerald-700 bg-white border border-emerald-200 px-2.5 py-0.5 rounded-md shadow-2xs">
                  Benchmark Met ✓
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Skills */}
        <div className="pro-card rounded-2xl p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 text-amber-700 font-black text-sm mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>Weak Skills ({readiness?.weakSkills.length || 0})</span>
          </div>
          <div className="space-y-2.5">
            {readiness?.weakSkills.map((s: any) => (
              <div key={s.skillId} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-xs text-amber-950 block">{s.skillName}</span>
                  <span className="text-[11px] text-amber-700 font-medium">Current: {s.currentLevel} (Requires {s.requiredLevel})</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('learning')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Start Learning →
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Suggested Next Steps */}
      <motion.div variants={itemVariants} className="pro-card rounded-2xl p-6 shadow-sm bg-white">
        <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          High-Yield Action Checklist to Reach 85%+ Readiness
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {readiness?.suggestedNextSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-xs font-black text-slate-900 block">{step.title}</span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.action}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-black text-emerald-600">{step.impact}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('learning')}
                  className="text-indigo-600 font-bold hover:text-indigo-800"
                >
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

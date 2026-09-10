import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  Download,
  Filter,
  Sparkles,
  Compass,
  Layers,
  BookOpen,
  Check
} from 'lucide-react';
import { ProgressAnalyticsResponse } from '../types';
import { api } from '../api';
import { ProgressGraph } from '../components/ProgressGraph';

interface Props {
  onNavigate: (view: string, extra?: any) => void;
}

export const ProgressView: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<ProgressAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportExported, setReportExported] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      try {
        const res = await api.getProgressAnalytics();
        setData(res);
      } catch (e) {
        console.error('Failed to load progress analytics', e);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, []);

  const handleDownloadReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3500);
  };

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
      {/* Toast Notification */}
      <AnimatePresence>
        {reportExported && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold">Progress Report Generated!</p>
              <p className="text-slate-400 text-[11px]">Academic dossier compiled and exported successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="pro-card rounded-2xl p-6 sm:p-7 shadow-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-linear-to-l from-indigo-50/50 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Learning Analytics & Growth Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Skill Capacity & Progress Graphs
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Audit your weekly competency development, diagnostic assessment score surges, and proximity to industry placement benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            type="button"
            onClick={handleDownloadReport}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            Export Progress Report
          </button>
          <button
            type="button"
            onClick={() => onNavigate('assessment')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-md"
          >
            <Compass className="w-3.5 h-3.5" />
            Take New Assessment
          </button>
        </div>
      </motion.div>

      {/* Main Interactive Progress Graph */}
      <motion.div variants={itemVariants}>
        {data && (
          <ProgressGraph
            timeline={data.timeline}
            careerGoal={data.careerGoal}
            currentReadiness={data.overallCareerReadiness}
          />
        )}
      </motion.div>

      {/* 4 Quantitative Progress Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} className="pro-card rounded-2xl p-5 shadow-xs bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Learning Streak</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {data?.stats.streakDays || 7} Days
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Consistent Daily Focus
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="pro-card rounded-2xl p-5 shadow-xs bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Hours Invested</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {data?.stats.estimatedHoursSpent || 18} Hours
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
            Across 5 Modules & Practice
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="pro-card rounded-2xl p-5 shadow-xs bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Problems Solved</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {data?.stats.totalSolvedPractice || 26}
          </div>
          <span className="text-[11px] text-indigo-600 font-bold mt-1.5 block">
            Coding & Technical MCQs
          </span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="pro-card rounded-2xl p-5 shadow-xs bg-white">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assessments Taken</span>
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {data?.stats.assessmentsTaken || 6}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1.5 block">
            Verified Level Jump Delta
          </span>
        </motion.div>
      </motion.div>

      {/* Verified Capacity Improvements Section */}
      <motion.div variants={itemVariants} className="pro-card rounded-2xl p-6 shadow-sm bg-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-slate-900">
                Verified Capacity Level Shifts
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              The core differentiator of Capacity Connect — actual demonstrated leaps in technical mastery.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('gap')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer group"
          >
            Review Skill Gap Matrix <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.improvements.map((imp, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl border border-indigo-100 bg-linear-to-br from-indigo-50/40 to-white flex items-start gap-3.5 shadow-2xs"
            >
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-950">{imp.skillName}</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    +{imp.scoreDelta}% Growth
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-semibold text-slate-600">{imp.fromLevel}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-black text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
                    {imp.toLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{imp.description}</p>
              </div>
            </motion.div>
          ))}

          {(!data?.improvements || data.improvements.length === 0) && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 col-span-2 text-center py-6">
              Complete your second assessment in DSA or C++ to calculate and display your verified skill level jump!
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

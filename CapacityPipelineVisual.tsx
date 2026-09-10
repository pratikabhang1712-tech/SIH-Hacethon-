import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, ArrowRight, Award, Compass, BookOpen, Terminal, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface Props {
  currentStage?: 'assessment' | 'gap' | 'learning' | 'practice' | 'reassessment';
  onStageClick?: (stage: string) => void;
}

export const CapacityPipelineVisual: React.FC<Props> = ({ currentStage = 'learning', onStageClick }) => {
  const stages = [
    {
      id: 'current',
      title: 'Baseline Check',
      desc: 'Initial Diagnostic',
      icon: Target,
      color: 'bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-400',
      activeColor: 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-300',
      view: 'skills',
    },
    {
      id: 'assessment',
      title: 'Skill Assessment',
      desc: 'Timed Adaptive MCQs',
      icon: Compass,
      color: 'bg-blue-50/60 text-blue-700 border-blue-200/80 hover:border-blue-400',
      activeColor: 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200',
      view: 'assessment',
    },
    {
      id: 'gap',
      title: 'Skill Gap Matrix',
      desc: 'Student vs Benchmark',
      icon: Layers,
      color: 'bg-amber-50/60 text-amber-700 border-amber-200/80 hover:border-amber-400',
      activeColor: 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-200',
      view: 'gap',
    },
    {
      id: 'learning',
      title: 'Personalized Path',
      desc: 'Gap Bridging Roadmap',
      icon: BookOpen,
      color: 'bg-indigo-50/60 text-indigo-700 border-indigo-200/80 hover:border-indigo-400',
      activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200',
      view: 'learning',
    },
    {
      id: 'practice',
      title: 'Targeted Lab',
      desc: 'Hands-on Coding & Tests',
      icon: Terminal,
      color: 'bg-violet-50/60 text-violet-700 border-violet-200/80 hover:border-violet-400',
      activeColor: 'bg-violet-600 text-white border-violet-600 shadow-md ring-2 ring-violet-200',
      view: 'practice',
    },
    {
      id: 'reassessment',
      title: 'Reassessment',
      desc: 'Validate Capacity Delta',
      icon: RefreshCw,
      color: 'bg-teal-50/60 text-teal-700 border-teal-200/80 hover:border-teal-400',
      activeColor: 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-200',
      view: 'assessment',
    },
    {
      id: 'improved',
      title: 'Career Readiness',
      desc: 'Industry Certified Bar',
      icon: Award,
      color: 'bg-emerald-50/60 text-emerald-700 border-emerald-200/80 hover:border-emerald-400',
      activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200',
      view: 'readiness',
    },
  ];

  return (
    <div id="capacity-pipeline-card" className="pro-card rounded-2xl p-6 shadow-sm bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              The Capacity Development Engine
            </span>
            <span className="text-xs text-slate-400 font-semibold hidden md:inline">Smart India Hackathon Architecture</span>
          </div>
          <h3 className="text-base font-black text-slate-900 mt-1">Continuous Skill Capacity Lifecycle</h3>
        </div>
        <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="font-bold text-slate-800">SIH Differentiator:</span>
          <span>Verified capability growth rather than passive attendance</span>
        </div>
      </div>

      {/* Pipeline steps scrollable on mobile */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[780px] justify-between gap-1">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = currentStage === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onStageClick && onStageClick(stage.view)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer flex-1 max-w-[124px] relative ${
                    isCurrent ? stage.activeColor : stage.color
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
                  )}
                  <div className={`p-2 rounded-lg mb-1.5 ${isCurrent ? 'bg-white/20' : 'bg-white shadow-2xs'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black leading-tight line-clamp-1">{stage.title}</span>
                  <span className={`text-[10px] mt-0.5 line-clamp-1 font-medium ${isCurrent ? 'text-white/90' : 'text-slate-500'}`}>
                    {stage.desc}
                  </span>
                </motion.button>

                {idx < stages.length - 1 && (
                  <div className="px-1 text-slate-300 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Comparative Banner: Traditional LMS vs Capacity Connect */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-slate-700">
          <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <div>
            <span className="font-bold text-rose-900 mr-1.5">Traditional Course Portals:</span>
            <span className="text-slate-600">Video Watch → Passive Attendance % → Zero gap verification</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-900 mr-1.5">Capacity Connect Engine:</span>
            <span className="text-slate-600">Diagnostic → Skill Gap → Adaptive Path → Reassessment → Verified Capacity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

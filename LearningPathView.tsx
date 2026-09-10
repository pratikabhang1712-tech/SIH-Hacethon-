import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Play,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Code,
  Award,
  HelpCircle
} from 'lucide-react';
import { LearningPathResponse } from '../types';
import { api } from '../api';

interface Props {
  onNavigate: (view: string, extra?: any) => void;
}

export const LearningPathView: React.FC<Props> = ({ onNavigate }) => {
  const [data, setData] = useState<LearningPathResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPath = async () => {
      setLoading(true);
      try {
        const res = await api.getLearningPath();
        setData(res);
      } catch (e) {
        console.error('Failed to load learning path', e);
      } finally {
        setLoading(false);
      }
    };
    loadPath();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 text-indigo-800">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Personalized Curriculum
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Personalized Learning Path
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Constructed dynamically to close your specific skill gaps for{' '}
              <strong className="text-indigo-600">{data?.careerGoal || 'Software Developer'}</strong>.
              Modules are ordered logically from foundational syntax to algorithmic problem solving.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Curriculum Progress</span>
              <span className="text-lg font-black text-indigo-600">
                {data?.completedModules || 0} / {data?.totalModules || 0} Modules
              </span>
            </div>
            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-indigo-700 text-sm">
              {data?.overallPathPercent || 0}%
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
            <span>Overall Path Completion</span>
            <span>{data?.overallPathPercent || 0}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${data?.overallPathPercent || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step by Step Timeline Sequence */}
      <div className="space-y-3">
        {data?.sequence.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.isCurrent;

          return (
            <div
              key={step.id}
              onClick={() => onNavigate('module', step.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCurrent
                  ? 'bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-200 shadow-sm'
                  : isCompleted
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step Number Badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 mt-0.5 ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isCurrent
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : step.stepNumber}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>

                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white animate-pulse">
                        CURRENT TOPIC
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        COMPLETED ✓
                      </span>
                    )}

                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">
                      {step.skillName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 max-w-2xl line-clamp-2">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {step.estimatedMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Code className="w-3.5 h-3.5" />
                      {step.codeExampleCount} Code Samples
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {step.questionCount} Practice Quizzes
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      Level: {step.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center justify-end">
                {isCurrent ? (
                  <button
                    type="button"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Resume Lesson
                  </button>
                ) : isCompleted ? (
                  <button
                    type="button"
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Review Notes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Start Topic
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

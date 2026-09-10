import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Code,
  HelpCircle,
  Play,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CourseModule } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

interface Props {
  moduleId: string;
  onNavigate: (view: string, extra?: any) => void;
}

export const LearningModuleView: React.FC<Props> = ({ moduleId, onNavigate }) => {
  const { refreshUser } = useAuth();
  const [data, setData] = useState<{
    module: CourseModule;
    skillName: string;
    progress: any;
    nextModuleId: string | null;
    nextModuleTitle: string | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'quiz'>('notes');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadModule = async () => {
      setLoading(true);
      try {
        const res = await api.getModule(moduleId);
        setData(res);
        setIsCompleted(res.progress?.status === 'completed');
      } catch (e) {
        console.error('Failed to load module', e);
      } finally {
        setLoading(false);
      }
    };
    loadModule();
  }, [moduleId]);

  const handleMarkCompleted = async () => {
    setSavingProgress(true);
    try {
      await api.updateModuleProgress(moduleId, 'completed', 100);
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 },
      });
      await refreshUser();
    } catch (e) {
      console.error('Failed to mark complete', e);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleQuizSelect = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  if (loading || !data) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold">Loading Module Content...</p>
      </div>
    );
  }

  const { module, skillName, nextModuleId, nextModuleTitle } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('learning')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Roadmap
        </button>

        <span className="text-xs text-slate-400">
          Module #{module.order} • {skillName}
        </span>
      </div>

      {/* Module Title Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {skillName}
              </span>
              <span className="text-xs text-slate-400">• Level: {module.level}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              {module.title}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{module.description}</p>
          </div>

          <div className="shrink-0 flex sm:flex-col items-end gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-4 h-4" />
              <span>{module.estimatedMinutes} Mins</span>
            </div>

            <button
              type="button"
              disabled={savingProgress}
              onClick={handleMarkCompleted}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Completed ✓' : savingProgress ? 'Saving...' : 'Mark as Completed'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Notes, Code Examples, Practice Quiz) */}
        <div className="mt-8 flex items-center gap-2 border-b border-slate-200">
          {[
            { id: 'notes', label: 'Study Notes & Theory', icon: BookOpen, count: null },
            { id: 'code', label: 'Code Examples', icon: Code, count: module.codeExamples.length },
            { id: 'quiz', label: 'Check Your Understanding', icon: HelpCircle, count: module.practiceQuestions.length },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Theory and Markdown Notes */}
      {activeTab === 'notes' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {module.notes}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600">
              Finished reading the theoretical notes?
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              Inspect Code Examples
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Code Examples */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          {module.codeExamples.map((ex, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-slate-900 text-slate-200 px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">{ex.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Language: {ex.language}</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-sm">
                  {ex.language}
                </span>
              </div>

              <pre className="p-5 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{ex.code}</code>
              </pre>

              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                <strong className="text-slate-800 block mb-1">Concept Breakdown:</strong>
                {ex.explanation}
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-600">
              Ready to test your comprehension?
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              Take Practice Quiz
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Practice Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Module Knowledge Check</h3>
              <p className="text-xs text-slate-500">Answer these quick questions to confirm concept retention.</p>
            </div>
            {quizSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Reset Quiz
              </button>
            )}
          </div>

          <div className="space-y-6">
            {module.practiceQuestions.map((q, qIdx) => {
              const selected = quizAnswers[q.id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    {qIdx + 1}. {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isPicked = selected === oIdx;
                      let optionStyle = 'bg-white border-slate-200 hover:bg-slate-100';

                      if (quizSubmitted) {
                        if (oIdx === q.correctIndex) {
                          optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isPicked && !isCorrect) {
                          optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                        }
                      } else if (isPicked) {
                        optionStyle = 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 font-semibold';
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleQuizSelect(q.id, oIdx)}
                          className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && oIdx === q.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-600" />
                          )}
                          {quizSubmitted && isPicked && !isCorrect && (
                            <X className="w-4 h-4 text-rose-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700">
                      <strong className="text-slate-900">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted && module.practiceQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuizSubmitted(true);
                handleMarkCompleted();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              Verify Answers & Complete Module
            </button>
          )}
        </div>
      )}

      {/* Next Module Step Footer */}
      {nextModuleId && (
        <div className="p-5 rounded-2xl bg-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
              Next Up in Personalized Path
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">{nextModuleTitle}</h4>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('module', nextModuleId)}
            className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            Advance to Next Module
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

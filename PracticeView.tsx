import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Code,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  Award,
  Filter,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PracticeQuestionItem } from '../types';
import { api } from '../api';

export const PracticeView: React.FC = () => {
  const [questions, setQuestions] = useState<PracticeQuestionItem[]>([]);
  const [stats, setStats] = useState<{ totalQuestions: number; solvedCount: number; accuracyPercentage: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Active question modal / runner
  const [activeQuestion, setActiveQuestion] = useState<PracticeQuestionItem | null>(null);
  const [codeSolution, setCodeSolution] = useState<string>('');
  const [selectedMCQ, setSelectedMCQ] = useState<number | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    solved: boolean;
    feedback: string;
    explanation?: string;
  } | null>(null);

  const loadPractice = async () => {
    setLoading(true);
    try {
      const [qList, sData] = await Promise.all([
        api.getPracticeQuestions({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        }),
        api.getPracticeStats(),
      ]);
      setQuestions(qList);
      setStats(sData);
    } catch (e) {
      console.error('Failed to load practice questions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPractice();
  }, [selectedCategory, selectedDifficulty]);

  const openQuestion = (q: PracticeQuestionItem) => {
    setActiveQuestion(q);
    setCodeSolution(q.templateCode || '');
    setSelectedMCQ(null);
    setSubmissionFeedback(null);
  };

  const handleSubmitSolution = async () => {
    if (!activeQuestion || evaluating) return;
    setEvaluating(true);
    try {
      const res = await api.submitPractice(
        activeQuestion.id,
        selectedMCQ !== null ? selectedMCQ : undefined,
        codeSolution || undefined
      );

      setSubmissionFeedback({
        solved: res.solved,
        feedback: res.feedback,
        explanation: res.explanation,
      });

      if (res.solved) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        await loadPractice();
      }
    } catch (e) {
      console.error('Failed to submit practice', e);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-violet-100 text-violet-800">
                <Terminal className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                Interactive Practice Lab
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Practice & Coding Challenges
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Sharpen your implementation muscles across Data Structures, Algorithms, Quantitative Aptitude, and Technical Interview MCQs.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Solved</span>
              <span className="text-lg font-black text-emerald-600">
                {stats?.solvedCount || 0} / {stats?.totalQuestions || 0}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Accuracy</span>
              <span className="text-lg font-black text-indigo-600">
                {stats?.accuracyPercentage || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'MCQ', 'Coding', 'Aptitude', 'Technical'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Practice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map(item => (
          <div
            key={item.id}
            onClick={() => openQuestion(item)}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.skillName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    item.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {item.difficulty}
                  </span>

                  {item.solved && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Solved
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {item.hasCode ? 'Code Simulation Available' : `${item.options?.length || 4} Choices`}
              </span>
              <button
                type="button"
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                {item.hasCode ? <Code className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                {item.solved ? 'Review Solution' : 'Solve Challenge'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Question Modal / Workspace */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-300">
                  <span>{activeQuestion.category}</span>
                  <span>•</span>
                  <span>{activeQuestion.skillName}</span>
                  <span>•</span>
                  <span>Difficulty: {activeQuestion.difficulty}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{activeQuestion.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveQuestion(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Problem Description */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Problem Statement
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {activeQuestion.description}
                </p>
              </div>

              {/* Code Challenge Workspace */}
              {activeQuestion.hasCode ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Code Editor (C++ / Python / JS)</span>
                    <button
                      type="button"
                      onClick={() => setCodeSolution(activeQuestion.templateCode || '')}
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Template
                    </button>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                    <div className="bg-slate-800 text-slate-400 text-xs px-3 py-1.5 font-mono">
                      solution.cpp
                    </div>
                    <textarea
                      rows={10}
                      value={codeSolution}
                      onChange={e => setCodeSolution(e.target.value)}
                      className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs focus:outline-hidden leading-relaxed resize-y"
                      placeholder="Write your optimized solution here..."
                    />
                  </div>
                </div>
              ) : (
                /* MCQ Options */
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Your Answer
                  </h4>
                  {activeQuestion.options?.map((opt, idx) => {
                    const isSelected = selectedMCQ === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedMCQ(idx)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 font-bold text-indigo-950'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Evaluation Feedback */}
              {submissionFeedback && (
                <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                  submissionFeedback.solved
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {submissionFeedback.solved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                    <span>{submissionFeedback.feedback}</span>
                  </div>
                  {submissionFeedback.explanation && (
                    <div className="pt-2 border-t border-emerald-200/60 text-slate-700">
                      <strong className="text-slate-900 block mb-0.5">Solution Logic & Complexity:</strong>
                      {submissionFeedback.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setActiveQuestion(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={evaluating || (!activeQuestion.hasCode && selectedMCQ === null)}
                onClick={handleSubmitSolution}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {evaluating ? 'Compiling & Running...' : activeQuestion.hasCode ? 'Run Code & Evaluate' : 'Submit Answer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Clock,
  Code,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Layers,
  Award,
} from 'lucide-react';
import { QuestionVideoSolution, QuestionBreakdownItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionBreakdownItem[];
  currentQuestionIndex: number;
  onSelectQuestionIndex: (idx: number) => void;
}

export const VideoSolutionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  questions,
  currentQuestionIndex,
  onSelectQuestionIndex,
}) => {
  if (!isOpen || questions.length === 0) return null;

  const currentItem = questions[currentQuestionIndex] || questions[0];
  const solution: QuestionVideoSolution =
    currentItem.videoSolution || {
      questionId: currentItem.id,
      videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw',
      title: `Step-by-Step Video Solution: Question ${currentQuestionIndex + 1}`,
      duration: '4:30 min',
      instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
      keyTakeaway: currentItem.explanation,
      timeComplexity: 'Optimal Linear O(N) or O(1)',
      spaceComplexity: 'O(1) Auxiliary Space',
      codeWalkthrough: currentItem.explanation,
      timestamps: [
        { time: '0:00', label: 'Problem Understanding & Constraints' },
        { time: '1:10', label: 'Logical Deduction & Option Filtering' },
        { time: '2:30', label: 'Code Walkthrough & Edge Cases' },
      ],
    };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <Play className="w-4 h-4 fill-rose-600" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                    Video Solution Masterclass
                  </span>
                  <span className="text-xs font-semibold text-slate-500">• Question {currentQuestionIndex + 1} of {questions.length}</span>
                </div>
                <h3 className="text-base font-black text-slate-900 line-clamp-1">
                  {solution.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Embedded Responsive Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md border border-slate-800">
              <iframe
                src={`${solution.videoUrl}${solution.videoUrl.includes('?') ? '&' : '?'}rel=0&modestbranding=1`}
                title={solution.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Metadata & Instructor Callout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                  RN
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{solution.instructor}</span>
                  <span className="text-[11px] text-slate-500">Video Solution &amp; Algorithmic Walkthrough</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-bold flex items-center gap-1.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {solution.duration}
                </span>
                {solution.timeComplexity && (
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100 font-bold">
                    Time: {solution.timeComplexity}
                  </span>
                )}
                {solution.spaceComplexity && (
                  <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-100 font-bold">
                    Space: {solution.spaceComplexity}
                  </span>
                )}
              </div>
            </div>

            {/* Problem & Code Context */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                Problem Statement &amp; Options:
              </h4>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                <p className="font-bold text-slate-900 text-sm">{currentItem.question}</p>

                {currentItem.codeSnippet && (
                  <pre className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto">
                    <code>{currentItem.codeSnippet}</code>
                  </pre>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentItem.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === currentItem.correctIndex;
                    const isUserChoice = optIdx === currentItem.userAnswerIndex;

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : isUserChoice
                            ? 'bg-rose-50 border-rose-300 text-rose-950'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[11px] text-slate-400">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrect && (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-xs">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Key Takeaways & Logic Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Trainer Rohit's Core Takeaway:
              </h4>

              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
                <p className="text-amber-950 font-medium leading-relaxed">
                  {solution.keyTakeaway}
                </p>

                {solution.codeWalkthrough && (
                  <div className="pt-2 border-t border-amber-200/60 mt-2">
                    <span className="font-bold text-amber-900 block text-[11px] mb-1">
                      Algorithmic Walkthrough:
                    </span>
                    <pre className="text-amber-950 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                      {solution.codeWalkthrough}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Video Chapters / Timestamps */}
            {solution.timestamps && solution.timestamps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  Video Chapters &amp; Timestamps:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {solution.timestamps.map((ts, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <span className="font-mono font-bold text-indigo-600 text-xs bg-indigo-50 px-2 py-0.5 rounded-md">
                        {ts.time}
                      </span>
                      <span className="text-slate-700 font-medium text-xs">{ts.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer with Question Navigation Playlist */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 gap-3">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => onSelectQuestionIndex(currentQuestionIndex - 1)}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Solution
            </button>

            {/* Question Quick Jump Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onSelectQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    idx === currentQuestionIndex
                      ? 'bg-indigo-600 text-white shadow-xs scale-105'
                      : q.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                  title={`Question ${idx + 1} (${q.isCorrect ? 'Correct' : 'Incorrect'})`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentQuestionIndex === questions.length - 1}
              onClick={() => onSelectQuestionIndex(currentQuestionIndex + 1)}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-30 transition-colors"
            >
              Next Solution
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

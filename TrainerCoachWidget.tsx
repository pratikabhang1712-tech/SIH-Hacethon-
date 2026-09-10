import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  X,
  MessageSquare,
  Sparkles,
  Zap,
  HelpCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  trainerName: string;
  trainerAvatar?: string;
  hintText?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  secondsRemaining: number;
}

export const TrainerCoachWidget: React.FC<Props> = ({
  trainerName,
  trainerAvatar,
  hintText,
  currentQuestionIndex,
  totalQuestions,
  secondsRemaining,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button in Quiz Header */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
          isOpen
            ? 'bg-amber-500 text-slate-950 border-amber-600 ring-2 ring-amber-200'
            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 hover:border-amber-300'
        }`}
        title="Get conceptual coaching from Trainer Rohit"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
        <span>Trainer Hint &amp; Advice</span>
      </button>

      {/* Floating Coach Popup / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 right-6 max-w-sm w-[calc(100vw-3rem)] z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 space-y-4"
          >
            {/* Coach Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={trainerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                    alt={trainerName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full ring-2 ring-white" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    {trainerName}
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold">Live Assessment Coach</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hint Content */}
            <div className="space-y-2.5">
              <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  Question {currentQuestionIndex + 1} Conceptual Hint:
                </span>
                <p className="leading-relaxed font-medium">
                  {hintText ||
                    'Remember: Consider time and space constraints. Check boundary conditions and test with a minimal edge-case input.'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Pacing &amp; Strategy:
                </span>
                <p className="text-[11px] leading-relaxed">
                  "Take a breath! You have completed {currentQuestionIndex} of {totalQuestions} questions. Do not guess randomly—eliminate incorrect options first."
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Detailed video solutions after test</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

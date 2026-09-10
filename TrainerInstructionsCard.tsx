import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { TrainerInfo } from '../types';

interface Props {
  trainer: TrainerInfo;
  skillName: string;
  totalQuestions: number;
  timeLimitMinutes: number;
}

export const TrainerInstructionsCard: React.FC<Props> = ({
  trainer,
  skillName,
  totalQuestions,
  timeLimitMinutes,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFullRules, setShowFullRules] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!speechSupported) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak =
        trainer.audioIntroScript ||
        `Hello student! I am ${trainer.name}. Before starting the ${skillName} assessment, please watch the video lecture to reinforce your core concepts. Pace yourself during the test, and remember every question has a step-by-step video solution afterwards. Good luck!`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to choose an English voice
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Male')));
      if (engVoice) utterance.voice = engVoice;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pro-card rounded-2xl bg-white border border-indigo-100 p-6 sm:p-7 shadow-sm relative overflow-hidden"
    >
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-50/70 via-indigo-50/20 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Trainer Header Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            {/* Trainer Avatar with Verified Badge */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-md">
                <img
                  src={trainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={trainer.name}
                  className="w-full h-full object-cover rounded-[14px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white shadow-xs"
                title="Verified Industry Trainer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{trainer.name}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Lead Technical Trainer
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Ex-Uber SDE
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{trainer.organization}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{trainer.experience}</p>
            </div>
          </div>

          {/* Audio Voice Guidance Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {speechSupported && (
              <button
                type="button"
                onClick={toggleAudio}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                  isPlayingAudio
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 ring-2 ring-rose-100 animate-pulse'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80'
                }`}
                title={isPlayingAudio ? 'Stop audio instructions' : 'Listen to Trainer voice instructions'}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-600" />
                    <span>Stop Voice</span>
                    {/* Animated sound bars */}
                    <span className="flex items-center gap-0.5 h-3 ml-1">
                      <span className="w-0.5 h-full bg-rose-500 animate-bounce" />
                      <span className="w-0.5 h-2 bg-rose-500 animate-bounce delay-75" />
                      <span className="w-0.5 h-full bg-rose-500 animate-bounce delay-150" />
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Listen to Trainer</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trainer's Personal Motivational Speech Bubble */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-xs relative">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <span className="font-bold text-indigo-200 uppercase tracking-wider text-[11px]">
                Mentor Briefing for {skillName}:
              </span>
              <p className="text-slate-200 leading-relaxed font-normal">
                "Treat this assessment as an honest self-diagnostic benchmark. Watch the revision video lecture below to clarify common traps (especially edge cases & memory layouts). Spend 60–90 seconds per question. After you submit, review my dedicated video solution on each question to solidify your capacity!"
              </p>
            </div>
          </div>
        </div>

        {/* Quick Test Parameters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-slate-400 text-[11px] block font-medium">Test Format</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{totalQuestions} Diagnostic MCQs</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-slate-400 text-[11px] block font-medium">Time Allotted</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{timeLimitMinutes} Minutes</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-slate-400 text-[11px] block font-medium">Marking Scheme</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">+4 Correct / 0 Wrong</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-slate-400 text-[11px] block font-medium">Advanced Benchmark</span>
            <span className="font-bold text-indigo-700 mt-0.5 block">&ge; 75% Score</span>
          </div>
        </div>

        {/* Expandable Exam Rules & Strategic Tips */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowFullRules(prev => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors py-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Trainer Rohit's 5 Strategic Rules & Test Guidelines
            </span>
            {showFullRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showFullRules && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-3 pt-3 text-xs"
              >
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Essential Guidelines from Trainer:
                  </h4>
                  <ul className="space-y-2 text-slate-600 pl-1">
                    {trainer.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-200/60 mt-3">
                    <h5 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Pro-Tips to Avoid Traps:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                      {trainer.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200/70">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

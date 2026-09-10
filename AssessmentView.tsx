import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  Play,
  Check,
  Code,
  Video,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AssessmentSummaryItem, AssessmentResult, QuestionBreakdownItem } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { TrainerInstructionsCard } from '../components/TrainerInstructionsCard';
import { PreTestVideoLecture } from '../components/PreTestVideoLecture';
import { TrainerCoachWidget } from '../components/TrainerCoachWidget';
import { VideoSolutionModal } from '../components/VideoSolutionModal';
import {
  defaultTrainer,
  getDefaultVideoLecture,
  getQuestionVideoSolution,
  questionTrainerHints,
} from '../data/assessmentTrainerData';

interface Props {
  initialSkillId?: string;
  onNavigate: (view: string, extra?: any) => void;
}

type AssessmentStage = 'catalog' | 'pre_test' | 'quiz' | 'result';

export const AssessmentView: React.FC<Props> = ({ initialSkillId, onNavigate }) => {
  const { refreshUser } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Assessment Stage Flow
  const [stage, setStage] = useState<AssessmentStage>('catalog');
  const [activeSkillId, setActiveSkillId] = useState<string | null>(initialSkillId || null);
  const [quizData, setQuizData] = useState<{
    skill: { id: string; name: string; category: string };
    totalQuestions: number;
    timeLimitMinutes: number;
    trainer?: any;
    preTestLecture?: any;
    questions: any[];
  } | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // Video Solution Modal state
  const [activeVideoModalIndex, setActiveVideoModalIndex] = useState<number | null>(null);

  // Load catalog
  const loadAssessments = async () => {
    setLoading(true);
    try {
      const list = await api.getAssessments();
      setAssessments(list);
    } catch (e) {
      console.error('Failed to load assessments catalog', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  // If initialSkillId passed, auto launch it to pre-test preparation
  useEffect(() => {
    if (initialSkillId) {
      prepareAssessment(initialSkillId);
    }
  }, [initialSkillId]);

  // Prepares the assessment: loads data, then displays the pre-test lecture and trainer briefing
  const prepareAssessment = async (skillId: string) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    try {
      const data = await api.getAssessmentQuestions(skillId);

      // Ensure trainer and video lecture exist with robust client fallback
      const enrichedData = {
        ...data,
        trainer: data.trainer || defaultTrainer,
        preTestLecture: data.preTestLecture || getDefaultVideoLecture(skillId, data.skill.name),
        questions: data.questions.map(q => ({
          ...q,
          trainerHint: q.trainerHint || questionTrainerHints[q.id],
          videoSolution: q.videoSolution || getQuestionVideoSolution(q.id, q.question, data.skill.name),
        })),
      };

      setQuizData(enrichedData);
      setActiveSkillId(skillId);
      setStage('pre_test');
    } catch (err: any) {
      alert(err.message || 'Unable to start assessment');
    } finally {
      setLoading(false);
    }
  };

  // Called when student finishes/skips lecture and starts timed test
  const handleStartTimedTest = () => {
    if (!quizData) return;
    setSecondsRemaining(quizData.timeLimitMinutes * 60);
    setStage('quiz');
  };

  // Timer countdown: runs ONLY when stage === 'quiz'
  useEffect(() => {
    if (stage !== 'quiz' || !activeSkillId || !quizData || result || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, activeSkillId, quizData, result, secondsRemaining]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeSkillId || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitAssessment(activeSkillId, answers);

      // Ensure every question in breakdown has its video solution attached
      const enrichedBreakdown = res.breakdown.map((item, idx) => ({
        ...item,
        videoSolution: item.videoSolution || getQuestionVideoSolution(item.id, item.question, res.skillName),
        trainerHint: item.trainerHint || questionTrainerHints[item.id],
      }));

      const finalResult: AssessmentResult = {
        ...res,
        breakdown: enrichedBreakdown,
      };

      setResult(finalResult);
      setStage('result');

      // Trigger celebratory confetti if high score or level improved
      if (finalResult.summary.percentage >= 60 || finalResult.summary.levelImproved) {
        confetti({
          particleCount: 130,
          spread: 75,
          origin: { y: 0.6 },
        });
      }

      await refreshUser();
      await loadAssessments();
    } catch (e) {
      console.error('Failed to submit assessment', e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ----------------------------------------------------
  // 1. RESULT SCREEN: Scores, Confetti & VIDEO SOLUTIONS FOR EVERY QUESTION
  // ----------------------------------------------------
  if (stage === 'result' && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto space-y-6 pb-16"
      >
        {/* Top Evaluation Result Card */}
        <div className="pro-card rounded-2xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden bg-white">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-4">
            <Award className="w-4 h-4 text-indigo-600" />
            Diagnostic Evaluation Complete
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {result.skillName} Competency Report
          </h2>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-8">
            {/* Score Ring */}
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-indigo-600">
                {result.summary.percentage}%
              </div>
              <span className="text-xs text-slate-500 font-bold mt-1">
                {result.summary.correctCount} of {result.summary.totalQuestions} Questions Correct
              </span>
            </div>

            <div className="h-14 w-px bg-slate-200 hidden sm:block" />

            {/* Level Transition Indicator */}
            <div className="flex flex-col items-center text-left bg-slate-50 border border-slate-200/80 px-6 py-3.5 rounded-2xl shadow-2xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Assessed Capacity Level
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="text-sm font-semibold text-slate-500">
                  {result.summary.previousLevel !== 'None' ? result.summary.previousLevel : 'Unassessed'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-base font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                  {result.summary.estimatedLevel}
                </span>
              </div>
              {result.summary.levelImproved && (
                <span className="text-[11px] font-black text-emerald-600 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Skill Level Upgraded!
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* Watch All Video Solutions Playlist Button */}
            <button
              type="button"
              onClick={() => setActiveVideoModalIndex(0)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch All Video Solutions (Playlist)
            </button>

            <button
              type="button"
              onClick={() => onNavigate('gap')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Layers className="w-4 h-4" />
              Check Updated Skill Gap
            </button>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setActiveSkillId(null);
                setQuizData(null);
                setStage('catalog');
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Browse All Assessments
            </button>
          </div>
        </div>

        {/* Detailed Question Review with VIDEO SOLUTION TO EVERY QUESTION */}
        <div className="pro-card rounded-2xl p-6 sm:p-7 shadow-sm bg-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-600" />
                Per-Question Video Solutions &amp; Logic Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any question's video solution to watch Trainer Rohit Negi's complete algorithmic walkthrough.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveVideoModalIndex(0)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-rose-600" />
              Play All ({result.breakdown.length}) Solutions
            </button>
          </div>

          <div className="space-y-4">
            {result.breakdown.map((item, idx) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : 'border-rose-200 bg-rose-50/15'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Question {idx + 1}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.isCorrect ? 'Correct (+4)' : 'Incorrect (0)'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.question}</h4>

                      {item.codeSnippet && (
                        <pre className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                          <code>{item.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  </div>

                  {/* PROMINENT VIDEO SOLUTION BUTTON */}
                  <button
                    type="button"
                    onClick={() => setActiveVideoModalIndex(idx)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                    title="Watch step-by-step video solution for this question"
                  >
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                    </span>
                    <span>Watch Video Solution</span>
                    <span className="text-[10px] text-rose-500 font-semibold bg-rose-100/70 px-1.5 py-0.5 rounded-sm">
                      {item.videoSolution?.duration || '4 mins'}
                    </span>
                  </button>
                </div>

                {/* Options List */}
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((opt, oIdx) => {
                    const isCorrectOption = oIdx === item.correctIndex;
                    const isUserOption = oIdx === item.userAnswerIndex;

                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                          isCorrectOption
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : isUserOption && !item.isCorrect
                            ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 font-bold text-[11px]">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isCorrectOption && (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded-xs">
                            Correct
                          </span>
                        )}
                        {isUserOption && !isCorrectOption && (
                          <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded-xs">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Explanation Text */}
                {item.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/80">
                    <strong className="text-slate-900 block mb-0.5 font-bold">
                      Theoretical Logic:
                    </strong>
                    {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Solution Modal */}
        <VideoSolutionModal
          isOpen={activeVideoModalIndex !== null}
          onClose={() => setActiveVideoModalIndex(null)}
          questions={result.breakdown}
          currentQuestionIndex={activeVideoModalIndex !== null ? activeVideoModalIndex : 0}
          onSelectQuestionIndex={idx => setActiveVideoModalIndex(idx)}
        />
      </motion.div>
    );
  }

  // ----------------------------------------------------
  // 2. PRE-TEST BRIEFING & VIDEO LECTURE STAGE
  // ----------------------------------------------------
  if (stage === 'pre_test' && quizData) {
    const trainer = quizData.trainer || defaultTrainer;
    const lecture =
      quizData.preTestLecture || getDefaultVideoLecture(quizData.skill.id, quizData.skill.name);

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6 pb-16"
      >
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setStage('catalog');
              setActiveSkillId(null);
              setQuizData(null);
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Assessments</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>Step 1 of 2: Pre-Test Preparation</span>
          </div>
        </div>

        {/* Trainer Briefing & Instructions Card */}
        <TrainerInstructionsCard
          trainer={trainer}
          skillName={quizData.skill.name}
          totalQuestions={quizData.totalQuestions}
          timeLimitMinutes={quizData.timeLimitMinutes}
        />

        {/* Curated Pre-Test Video Lecture Player */}
        <PreTestVideoLecture
          lecture={lecture}
          skillName={quizData.skill.name}
          onStartTest={handleStartTimedTest}
          onSkipTest={handleStartTimedTest}
        />
      </motion.div>
    );
  }

  // ----------------------------------------------------
  // 3. ACTIVE QUIZ SCREEN (With In-Quiz Trainer Coach Widget)
  // ----------------------------------------------------
  if (stage === 'quiz' && activeSkillId && quizData) {
    const currentQ = quizData.questions[currentQuestionIndex];
    const totalQ = quizData.questions.length;
    const answeredCount = Object.keys(answers).length;
    const currentAnswer = answers[currentQ.id];
    const trainer = quizData.trainer || defaultTrainer;
    const currentHint = currentQ.trainerHint || questionTrainerHints[currentQ.id];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6 pb-16"
      >
        {/* Top Quiz Header */}
        <div className="pro-card rounded-2xl p-5 shadow-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {quizData.skill.name} Assessment
              </span>
              <span className="text-xs text-slate-400 font-medium">• {quizData.skill.category}</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              Question {currentQuestionIndex + 1} of {totalQ}
            </h2>
          </div>

          {/* Header Controls: Live Trainer Coach & Countdown Clock */}
          <div className="flex items-center gap-3">
            {/* Live Trainer Coach Hint Widget */}
            <TrainerCoachWidget
              trainerName={trainer.name}
              trainerAvatar={trainer.avatarUrl}
              hintText={currentHint}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQ}
              secondsRemaining={secondsRemaining}
            />

            {/* Countdown Clock */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${
                secondsRemaining < 120
                  ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Time: {formatTime(secondsRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Question Progress Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {quizData.questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-2.5 flex-1 min-w-[24px] rounded-full transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 ring-2 ring-indigo-200 scale-y-110'
                    : isAnswered
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Question ${idx + 1} ${isAnswered ? '(Answered)' : ''}`}
              />
            );
          })}
        </div>

        {/* Question Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="pro-card rounded-2xl p-6 sm:p-8 shadow-sm bg-white space-y-6"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                Difficulty: {currentQ.difficulty || 'Intermediate'}
              </span>
              <span className="font-semibold">
                {answeredCount} of {totalQ} Answered
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Code snippet if provided */}
            {currentQ.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <div className="bg-slate-800 text-slate-400 text-[11px] px-3.5 py-1.5 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>Code Context</span>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Single Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt: string, optIdx: number) => {
                const isSelected = currentAnswer === optIdx;
                return (
                  <motion.div
                    key={optIdx}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm font-medium text-slate-800">{opt}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation & Submit footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-30 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              {currentQuestionIndex < totalQ - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  Next Question <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Evaluating...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  // ----------------------------------------------------
  // 4. CATALOG SCREEN (Browse Assessments)
  // ----------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-16"
    >
      {/* Header with Trainer Highlights */}
      <motion.div
        variants={itemVariants}
        className="pro-card rounded-2xl p-6 sm:p-7 shadow-sm bg-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Diagnostic Verification Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Skill Assessments &amp; Masterclasses
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Before each test, receive mentorship instructions and watch a curated video lecture by{' '}
              <strong className="text-slate-900 font-bold">Er. Rohit Negi (Ex-Uber SDE)</strong>. Complete the diagnostic test to unlock full video solutions for every single problem.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('gap')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              View Gap Analysis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of Assessments */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map(item => (
          <motion.div
            key={item.skillId}
            whileHover={{ y: -3 }}
            className="pro-card rounded-2xl p-5 shadow-xs bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                  {item.category}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.currentLevel === 'Advanced'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.currentLevel === 'Intermediate'
                      ? 'bg-blue-100 text-blue-800'
                      : item.currentLevel === 'Beginner'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.currentLevel}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900">{item.skillName}</h3>

              {/* Per-Card Feature Badges */}
              <div className="flex items-center gap-2 my-2.5 flex-wrap text-[11px]">
                <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md border border-rose-100 flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-rose-600" />
                  Video Lecture
                </span>
                <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100 flex items-center gap-1">
                  <Video className="w-2.5 h-2.5" />
                  Video Solutions
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-500 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Evaluation:</span>
                  <span className="font-bold text-slate-700">{item.questionCount} Questions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Current Score:</span>
                  <span className="font-black text-indigo-600">{item.currentScore}%</span>
                </div>
                {item.lastAttemptDate && (
                  <div className="flex items-center justify-between">
                    <span>Last Taken:</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(item.lastAttemptDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => prepareAssessment(item.skillId)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {item.currentScore > 0 ? 'Retake Assessment' : 'Start Lecture & Assessment'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

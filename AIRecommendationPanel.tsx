import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, ArrowRight, Lightbulb, CheckCircle, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { AIRecommendationResponse } from '../types';
import { api } from '../api';

interface Props {
  onSelectSkillToLearn?: (skillName: string) => void;
}

export const AIRecommendationPanel: React.FC<Props> = ({ onSelectSkillToLearn }) => {
  const [data, setData] = useState<AIRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAIRecommendations();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load AI recommendations', err);
      setError(err.message || 'Could not reach AI mentor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div id="ai-mentor-card" className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 border border-indigo-500/30 shadow-lg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 pb-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">Capacity Mentor AI</span>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Personalized Gap Diagnosis & Academic Guidance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchRecommendations}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200 rounded-lg transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing with Gemini...' : 'Refresh AI Analysis'}
        </button>
      </div>

      {loading && !data && (
        <div className="py-12 flex flex-col items-center justify-center text-center relative z-10">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold text-indigo-200">Evaluating your skill gaps against career benchmarks...</p>
          <p className="text-xs text-slate-400 mt-1">Analyzing DSA, DBMS, and target requirements with Gemini AI</p>
        </div>
      )}

      {error && !data && (
        <div className="py-6 flex items-center gap-3 text-rose-300 text-xs bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl mt-4 relative z-10">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="mt-5 space-y-5 relative z-10">
          {/* Main recommendation callout */}
          <div className="bg-indigo-900/40 border border-indigo-400/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                Priority 1 Skill to Unlock
              </div>
              <h4 className="text-lg font-extrabold text-white">
                {data.recommendedNextSkill}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {data.recommendedSkillReason}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectSkillToLearn && onSelectSkillToLearn(data.recommendedNextSkill)}
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Start Learning Path
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Gap explanation */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Industry Gap Diagnosis
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.gapExplanation}
            </p>
          </div>

          {/* Weak areas & Actionable tips */}
          {data.weakAreaRecommendations && data.weakAreaRecommendations.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                High-Impact Weak Points
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.weakAreaRecommendations.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/50 border border-slate-800 p-3 rounded-xl">
                    <span className="text-xs font-bold text-white block">{item.skillName}</span>
                    <span className="text-[11px] font-semibold text-rose-400 block mt-0.5">{item.gap}</span>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">{item.actionableTip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concrete study suggestions */}
          {data.studySuggestions && data.studySuggestions.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Suggested Academic Action Items
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.studySuggestions.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-lg text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

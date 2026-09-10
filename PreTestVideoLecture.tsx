import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Maximize2,
  FileText,
  ListChecks,
} from 'lucide-react';
import { SkillVideoLecture } from '../types';

interface Props {
  lecture: SkillVideoLecture;
  skillName: string;
  onStartTest: () => void;
  onSkipTest: () => void;
}

export const PreTestVideoLecture: React.FC<Props> = ({
  lecture,
  skillName,
  onStartTest,
  onSkipTest,
}) => {
  const [hasWatched, setHasWatched] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'notes'>('video');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="pro-card rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6"
    >
      {/* Lecture Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1 rounded-md bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1 text-[11px] font-bold">
              <Play className="w-3 h-3 fill-rose-600 text-rose-600" />
              Pre-Assessment Masterclass
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {lecture.durationMinutes} Minutes Revision
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {lecture.instructor}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
            {lecture.title}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {lecture.summary}
          </p>
        </div>

        {/* Tab Selector: Video Player vs Lecture Notes */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Video Lecture
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Revision Notes ({lecture.keyCheatSheetNotes.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'video' ? (
        <div className="space-y-4">
          {/* Responsive 16:9 Video Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md group">
            <iframe
              src={`${lecture.videoUrl}?rel=0&modestbranding=1&enablejsapi=1`}
              title={lecture.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* Video Watermark & Quick Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-700">
                Coder Army Lecture
              </span>
            </div>
          </div>

          {/* Quick Playback & Speed Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-700">Topics in this lecture:</span>
              {lecture.topicsCovered.map((topic, i) => (
                <span
                  key={i}
                  className="bg-white text-slate-700 border border-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-md"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={lecture.videoUrl.replace('/embed/', '/watch?v=')}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-bold text-[11px]"
              >
                <span>Full YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Revision Cheat Sheet Notes Tab */
        <div className="space-y-4">
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h3 className="font-black text-slate-900 text-sm">
                Fast Revision Notes: {skillName}
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Key formulas, theoretical theorems, and common traps condensed by Rohit Negi:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-800">
              {lecture.keyCheatSheetNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Preparation Confirmation & Action CTA Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Checkbox: I reviewed this lecture */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={hasWatched}
            onChange={e => setHasWatched(e.target.checked)}
            className="w-4 h-4 rounded-sm text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
          />
          <span>I have reviewed the video revision and understand the core concepts</span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkipTest}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Skip Video &amp; Start Directly
          </button>

          <button
            type="button"
            onClick={onStartTest}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>Start Timed Diagnostic Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Calendar,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

export interface TimelinePoint {
  week: string;
  capacityScore: number;
  benchmarkTarget?: number;
  dsaScore?: number;
  cppScore?: number;
  dbmsScore?: number;
  oopScore?: number;
  hoursSpent?: number;
  problemsSolved?: number;
  modulesCompleted?: number;
}

interface Props {
  timeline: TimelinePoint[];
  careerGoal: string;
  currentReadiness: number;
}

export const ProgressGraph: React.FC<Props> = ({
  timeline,
  careerGoal,
  currentReadiness,
}) => {
  const [graphMode, setGraphMode] = useState<'readiness' | 'skills' | 'effort'>('readiness');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) {
    return null;
  }

  // Chart dimensions in viewBox coordinates
  const svgWidth = 700;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinate conversion helpers
  const getX = (index: number) => {
    if (timeline.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (timeline.length - 1)) * chartWidth;
  };

  const getYScore = (score: number) => {
    const clamped = Math.max(0, Math.min(100, score));
    return paddingTop + chartHeight - (clamped / 100) * chartHeight;
  };

  // Readiness area & line paths
  const readinessPoints = timeline.map((p, i) => `${getX(i)},${getYScore(p.capacityScore)}`);
  const readinessLinePath = `M ${readinessPoints.join(' L ')}`;
  const readinessAreaPath = `${readinessLinePath} L ${getX(timeline.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  // Skills line paths
  const dsaPath = `M ${timeline.map((p, i) => `${getX(i)},${getYScore(p.dsaScore || 0)}`).join(' L ')}`;
  const cppPath = `M ${timeline.map((p, i) => `${getX(i)},${getYScore(p.cppScore || 0)}`).join(' L ')}`;
  const oopPath = `M ${timeline.map((p, i) => `${getX(i)},${getYScore(p.oopScore || 0)}`).join(' L ')}`;
  const dbmsPath = `M ${timeline.map((p, i) => `${getX(i)},${getYScore(p.dbmsScore || 0)}`).join(' L ')}`;

  // Effort maximum for bar scaling
  const maxEffortVal = Math.max(
    ...timeline.map(p => Math.max(p.hoursSpent || 0, p.problemsSolved || 0)),
    30
  );

  const initialScore = timeline[0]?.capacityScore || 35;
  const growthDelta = currentReadiness - initialScore;
  const activeData = hoveredIndex !== null ? timeline[hoveredIndex] : timeline[timeline.length - 1];

  return (
    <div className="pro-card rounded-2xl p-6 shadow-sm space-y-5 bg-white relative overflow-hidden">
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Verified Diagnostic Trajectory
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">
            Student Capacity & Skill Progression Curve
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time measurement showing skill development across iterations targeting {careerGoal} standards.
          </p>
        </div>

        {/* Graph Mode Buttons with Animated Sliding Indicator */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl shrink-0 self-start sm:self-auto relative">
          {(['readiness', 'skills', 'effort'] as const).map(mode => {
            const isActive = graphMode === mode;
            const labels = {
              readiness: 'Career Readiness',
              skills: 'Core Skills',
              effort: 'Effort & Hours'
            };
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setGraphMode(mode)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer z-10 ${
                  isActive ? 'text-indigo-600 font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="graph-mode-pill"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10 border border-slate-200/60"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {labels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Callout Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.div whileHover={{ y: -2 }} className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Starting Baseline</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-800">{initialScore}%</span>
            <span className="text-[10px] text-slate-400 font-medium">Diagnostic</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-indigo-50/50 border border-indigo-200/60 rounded-xl p-3">
          <span className="text-[10px] font-bold text-indigo-700 uppercase block tracking-wider">Current Capacity</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-indigo-600">{currentReadiness}%</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200/50">
              +{growthDelta}%
            </span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3">
          <span className="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">Target Benchmark</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-emerald-700">85%</span>
            <span className="text-[10px] text-emerald-600/70 font-semibold">Tier-1 Bar</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3">
          <span className="text-[10px] font-bold text-amber-700 uppercase block tracking-wider">Fastest Surge</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-900">DSA</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded-sm">
              +30% Leap
            </span>
          </div>
        </motion.div>
      </div>

      {/* Interactive Legend for Skills Mode */}
      {graphMode === 'skills' && (
        <div className="flex flex-wrap items-center justify-end gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-indigo-600 rounded-full" />
            <span className="text-slate-700">DSA (Data Structures)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-slate-700">C++ Programming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-amber-500 rounded-full" />
            <span className="text-slate-700">OOP Design</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 bg-pink-500 rounded-full" />
            <span className="text-slate-700">DBMS & SQL</span>
          </div>
        </div>
      )}

      {/* Interactive Legend for Effort Mode */}
      {graphMode === 'effort' && (
        <div className="flex flex-wrap items-center justify-end gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-400 rounded-xs shadow-2xs" />
            <span className="text-slate-700">Study Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-indigo-600 rounded-xs shadow-2xs" />
            <span className="text-slate-700">Problems Solved</span>
          </div>
        </div>
      )}

      {/* Main SVG Graph Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Area Gradient for Readiness Mode */}
            <linearGradient id="readinessSvgGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4f46e5" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = getYScore(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-semibold font-sans"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Benchmark 85% Target Line */}
          {graphMode === 'readiness' && (
            <g>
              <line
                x1={paddingLeft}
                y1={getYScore(85)}
                x2={svgWidth - paddingRight}
                y2={getYScore(85)}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={svgWidth - paddingRight}
                y={getYScore(85) - 6}
                textAnchor="end"
                className="text-[10px] fill-emerald-600 font-bold font-sans"
              >
                Target Tier-1 Placement Benchmark: 85%
              </text>
            </g>
          )}

          {/* X-Axis Labels */}
          {timeline.map((p, idx) => {
            const x = getX(idx);
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                <line
                  x1={x}
                  y1={paddingTop + chartHeight}
                  x2={x}
                  y2={paddingTop + chartHeight + 5}
                  stroke="#cbd5e1"
                />
                <text
                  x={x}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  className={`text-[10px] font-sans transition-all ${
                    isHovered ? 'fill-indigo-600 font-bold' : 'fill-slate-500 font-medium'
                  }`}
                >
                  {p.week}
                </text>
              </g>
            );
          })}

          {/* Mode 1: Readiness Area + Line with animation */}
          {graphMode === 'readiness' && (
            <g>
              <path d={readinessAreaPath} fill="url(#readinessSvgGradient)" />
              <motion.path
                d={readinessLinePath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#softGlow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              {timeline.map((p, idx) => {
                const x = getX(idx);
                const y = getYScore(p.capacityScore);
                const isHovered = hoveredIndex === idx;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r={isHovered ? 6.5 : 4.5}
                    fill={isHovered ? '#4f46e5' : '#ffffff'}
                    stroke="#4f46e5"
                    strokeWidth={isHovered ? 3 : 2.5}
                    className="transition-all cursor-pointer"
                  />
                );
              })}
            </g>
          )}

          {/* Mode 2: Core Skills Trajectory */}
          {graphMode === 'skills' && (
            <g>
              {/* DSA Line */}
              <motion.path
                d={dsaPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              {/* C++ Line */}
              <motion.path
                d={cppPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
              />
              {/* OOP Line */}
              <motion.path
                d={oopPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
              {/* DBMS Line */}
              <motion.path
                d={dbmsPath}
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />

              {/* Dots on DSA */}
              {timeline.map((p, idx) => (
                <circle
                  key={idx}
                  cx={getX(idx)}
                  cy={getYScore(p.dsaScore || 0)}
                  r={3.5}
                  fill="#ffffff"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}

          {/* Mode 3: Effort & Hours Bars */}
          {graphMode === 'effort' && (
            <g>
              {timeline.map((p, idx) => {
                const center = getX(idx);
                const barWidth = 14;
                const hoursHeight = ((p.hoursSpent || 0) / maxEffortVal) * chartHeight;
                const solvedHeight = ((p.problemsSolved || 0) / maxEffortVal) * chartHeight;
                const baseY = paddingTop + chartHeight;

                return (
                  <g key={idx}>
                    {/* Hours Bar */}
                    <rect
                      x={center - barWidth - 1}
                      y={baseY - hoursHeight}
                      width={barWidth}
                      height={hoursHeight}
                      rx="3"
                      fill="#fbbf24"
                    />
                    {/* Solved Bar */}
                    <rect
                      x={center + 1}
                      y={baseY - solvedHeight}
                      width={barWidth}
                      height={solvedHeight}
                      rx="3"
                      fill="#4f46e5"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Hover interaction overlay columns */}
          {timeline.map((_, idx) => {
            const x = getX(idx);
            const colWidth = chartWidth / timeline.length;
            return (
              <rect
                key={idx}
                x={x - colWidth / 2}
                y={paddingTop}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}

          {/* Active Crosshair Line on hover */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={paddingTop + chartHeight}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              pointerEvents="none"
            />
          )}
        </svg>

        {/* Dynamic Floating Tooltip */}
        <AnimatePresence>
          {activeData && (
            <motion.div
              key={activeData.week}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="mt-3 p-3.5 bg-slate-950 text-white rounded-xl shadow-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-indigo-400">{activeData.week}:</span>
                <span className="font-extrabold text-white text-sm">{activeData.capacityScore}% Career Readiness</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  (Gap to Benchmark: {Math.max(0, 85 - activeData.capacityScore)}%)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                  DSA: <strong className="text-white">{activeData.dsaScore}%</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  C++: <strong className="text-white">{activeData.cppScore}%</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  Study: <strong className="text-white">{activeData.hoursSpent}h</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                  Solved: <strong className="text-white">{activeData.problemsSolved}</strong>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Educational interpretation footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>
            <strong>Capacity Principle:</strong> Progress is measured through verified assessment accuracy and problem completion, not passive minutes.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Auto-updated after every diagnostic test
        </span>
      </div>
    </div>
  );
};

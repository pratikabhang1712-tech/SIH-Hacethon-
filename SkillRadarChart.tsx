import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RadarSkill {
  name: string;
  currentScore: number; // 0 - 100
  requiredScore: number; // 0 - 100
}

interface Props {
  skills: RadarSkill[];
  size?: number;
}

export const SkillRadarChart: React.FC<Props> = ({ skills, size = 320 }) => {
  const [activeSkill, setActiveSkill] = useState<RadarSkill | null>(null);

  if (!skills || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-xs text-slate-400">
        No skill data available for radar plot
      </div>
    );
  }

  const center = size / 2;
  const radius = (size / 2) - 48;
  const totalAxes = skills.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Levels for concentric grid (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to get coordinates
  const getCoordinates = (value: number, index: number) => {
    const r = (value / 100) * radius;
    const angle = index * angleSlice - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build polygon points string
  const currentPoints = skills
    .map((s, i) => {
      const { x, y } = getCoordinates(Math.max(15, s.currentScore), i);
      return `${x},${y}`;
    })
    .join(' ');

  const requiredPoints = skills
    .map((s, i) => {
      const { x, y } = getCoordinates(s.requiredScore, i);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center relative">
      <svg width={size} height={size} className="overflow-visible select-none">
        <defs>
          <linearGradient id="radarFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Concentric grid polygons */}
        {levels.map((lvl, lIdx) => {
          const gridPoints = skills
            .map((_, i) => {
              const r = lvl * radius;
              const angle = i * angleSlice - Math.PI / 2;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={`grid-${lIdx}`}
              points={gridPoints}
              fill={lIdx % 2 === 0 ? '#f8fafc' : '#ffffff'}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Radial axes and labels */}
        {skills.map((skill, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const axisX = center + radius * Math.cos(angle);
          const axisY = center + radius * Math.sin(angle);

          // Label coordinates slightly further out
          const labelDist = radius + 22;
          const labelX = center + labelDist * Math.cos(angle);
          const labelY = center + labelDist * Math.sin(angle);
          const isSelected = activeSkill?.name === skill.name;

          return (
            <g
              key={`axis-${i}`}
              className="cursor-pointer"
              onMouseEnter={() => setActiveSkill(skill)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              <line
                x1={center}
                y1={center}
                x2={axisX}
                y2={axisY}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[11px] font-sans transition-colors ${
                  isSelected ? 'fill-indigo-600 font-extrabold' : 'fill-slate-600 font-bold'
                }`}
              >
                {skill.name}
              </text>
            </g>
          );
        })}

        {/* Required Career Target Polygon (dashed stroke) */}
        <polygon
          points={requiredPoints}
          fill="rgba(245, 158, 11, 0.08)"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Current Student Abilities Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          points={currentPoints}
          fill="url(#radarFillGrad)"
          stroke="#4f46e5"
          strokeWidth="2.5"
        />

        {/* Data points for current skills */}
        {skills.map((skill, i) => {
          const { x, y } = getCoordinates(Math.max(15, skill.currentScore), i);
          const isSelected = activeSkill?.name === skill.name;
          return (
            <g
              key={`point-${i}`}
              className="cursor-pointer"
              onMouseEnter={() => setActiveSkill(skill)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? '#4338ca' : '#4f46e5'}
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating or fixed hover info */}
      <div className="h-6 flex items-center justify-center my-1">
        <AnimatePresence>
          {activeSkill && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs bg-slate-900 text-white px-3 py-0.5 rounded-full font-semibold shadow-sm flex items-center gap-2"
            >
              <span className="font-bold text-indigo-300">{activeSkill.name}:</span>
              <span>Current: <strong className="text-white">{activeSkill.currentScore}%</strong></span>
              <span className="text-slate-400">|</span>
              <span>Target: <strong className="text-amber-400">{activeSkill.requiredScore}%</strong></span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-xs bg-indigo-600 border border-indigo-700 shadow-2xs" />
          <span className="font-bold text-slate-700">Current Ability</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 border-b-2 border-dashed border-amber-500" />
          <span className="font-bold text-slate-700">Career Benchmark</span>
        </div>
      </div>
    </div>
  );
};

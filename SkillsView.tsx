import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  TrendingUp,
  Plus,
  Compass,
  Clock,
  History,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserSkill, Skill, ProficiencyLevel } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigate: (view: string, extra?: any) => void;
}

export const SkillsView: React.FC<Props> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [allSystemSkills, setAllSystemSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Add/edit skill modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>('Intermediate');
  const [skillScore, setSkillScore] = useState<number>(65);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const [uSkills, sysSkills] = await Promise.all([
        api.getUserSkills(),
        api.getSkills(),
      ]);
      setSkills(uSkills);
      setAllSystemSkills(sysSkills);
      if (sysSkills.length > 0) setSelectedSkillId(sysSkills[0].id);
    } catch (e) {
      console.error('Failed to load user skills', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSaveSkill = async () => {
    if (!selectedSkillId) return;
    setSaving(true);
    try {
      await api.updateUserSkill(selectedSkillId, selectedLevel, skillScore, note || undefined);
      await refreshUser();
      await loadSkills();
      setShowModal(false);
      setNote('');
    } catch (e) {
      console.error('Failed to save skill', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 text-indigo-800">
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Capacity Inventory
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Verified Skills & Capacity Profile
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Track your individual competencies, assessment scores, and historical skill level jumps. Verified through automated diagnostic assessments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add / Update Skill
            </button>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map(us => (
          <div
            key={us.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">
                  {us.category || 'Engineering'}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  us.level === 'Advanced' ? 'bg-emerald-100 text-emerald-800' :
                  us.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {us.level}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{us.skillName}</h3>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{us.description}</p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Capacity Score</span>
                  <span className="font-bold text-indigo-600">{us.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      us.level === 'Advanced' ? 'bg-emerald-600' :
                      us.level === 'Intermediate' ? 'bg-indigo-600' :
                      'bg-amber-500'
                    }`}
                    style={{ width: `${us.score}%` }}
                  />
                </div>
              </div>

              {/* History log entries */}
              {us.history && us.history.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Progression Milestones
                  </span>
                  {us.history.slice(-2).map((h, hIdx) => (
                    <div key={hIdx} className="text-xs flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-800">{h.level} ({h.score}%)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{h.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Last Assessed: {new Date(us.lastAssessedAt).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={() => onNavigate('assessment', us.skillId)}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" /> Re-test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Update Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Add or Update Competency</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Skill
              </label>
              <select
                value={selectedSkillId}
                onChange={e => setSelectedSkillId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              >
                {allSystemSkills.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Proficiency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as ProficiencyLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setSkillScore(lvl === 'Advanced' ? 85 : lvl === 'Intermediate' ? 65 : 45);
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="uppercase">Capacity Score</span>
                <span className="text-indigo-600">{skillScore}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={skillScore}
                onChange={e => setSkillScore(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Progression Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Completed college lab assignment 4"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveSkill}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Skill'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

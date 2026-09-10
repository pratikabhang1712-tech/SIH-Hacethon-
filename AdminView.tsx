import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  HelpCircle,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

interface Props {
  onNavigate: (view: string) => void;
}

export const AdminView: React.FC<Props> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'skills' | 'careers' | 'courses' | 'questions'>('students');
  const [loading, setLoading] = useState(true);

  // New Skill form
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState<'Programming' | 'Computer Science' | 'Web Development' | 'Core Engineering' | 'Soft Skills'>('Programming');
  const [skillDesc, setSkillDesc] = useState('');

  // New Question form
  const [qSkillId, setQSkillId] = useState('skill-dsa');
  const [qText, setQText] = useState('');
  const [qCode, setQCode] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  // Status message
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sData, stuData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminStudents(),
      ]);
      setStats(sData);
      setStudents(stuData);
    } catch (e: any) {
      console.error('Failed to load admin suite', e);
      setStatusMsg(e.message || 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;
    try {
      await api.createAdminSkill({
        name: skillName,
        category: skillCategory,
        description: skillDesc,
      });
      setStatusMsg(`Skill "${skillName}" successfully created!`);
      setSkillName('');
      setSkillDesc('');
      await loadAdminData();
    } catch (err: any) {
      setStatusMsg(err.message || 'Failed to create skill');
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || qOptions.some(o => !o.trim())) return;
    try {
      await api.createAdminQuestion({
        skillId: qSkillId,
        question: qText,
        codeSnippet: qCode || undefined,
        options: qOptions,
        correctIndex: qCorrectIndex,
        explanation: qExplanation,
      });
      setStatusMsg('Assessment question added to pool!');
      setQText('');
      setQCode('');
      setQOptions(['', '', '', '']);
      setQExplanation('');
      await loadAdminData();
    } catch (err: any) {
      setStatusMsg(err.message || 'Failed to create question');
    }
  };

  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to reset the database to initial SIH hackathon demo state?')) return;
    try {
      await api.resetDemoDb();
      setStatusMsg('Database reset to fresh demo state!');
      await refreshUser();
      await loadAdminData();
    } catch (err: any) {
      setStatusMsg(err.message || 'Failed to reset database');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Institution Administration & Oversight
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            College Academic Admin Suite
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Monitor student capacity distributions across departments, audit skill gaps, manage curriculum competencies, and configure placement career benchmarks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDemo}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Database
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs rounded-xl flex items-center justify-between">
          <span>{statusMsg}</span>
          <button type="button" onClick={() => setStatusMsg(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.totalStudents || 5}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Skills Tracked</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.totalSkills || 12}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Career Roles</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.totalCareers || 5}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Assessments Taken</span>
            <HelpCircle className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.totalAssessmentsTaken || 8}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/70 p-2 overflow-x-auto">
          {[
            { id: 'students', label: 'Students Directory & Capacity', icon: Users },
            { id: 'skills', label: 'Add New Skill', icon: GraduationCap },
            { id: 'questions', label: 'Add Assessment Question', icon: HelpCircle },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Students Directory */}
        {activeTab === 'students' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">College & Branch</th>
                    <th className="pb-3">Target Career</th>
                    <th className="pb-3">Verified Skills</th>
                    <th className="pb-3">Modules Done</th>
                    <th className="pb-3 text-right">Assessments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/70">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </td>
                      <td className="py-3 text-slate-700 font-medium">
                        <div>{s.branch}</div>
                        <div className="text-[10px] text-slate-400">{s.college} ({s.currentYearSemester})</div>
                      </td>
                      <td className="py-3 font-semibold text-indigo-700">
                        {s.targetCareer}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.topSkills?.map((sk: string, idx: number) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-sm text-[10px] font-semibold">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 font-bold text-slate-800">
                        {s.completedModules} Completed
                      </td>
                      <td className="py-3 text-right font-extrabold text-indigo-600">
                        {s.assessmentsTaken} Taken
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Add Skill */}
        {activeTab === 'skills' && (
          <div className="p-6 max-w-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create New Competency</h3>
            <p className="text-xs text-slate-500 mb-5">
              Add a new technical or fundamental domain skill for students to track.
            </p>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  placeholder="e.g. Next.js & Server Components"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={skillCategory}
                  onChange={e => setSkillCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Programming">Programming</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Core Engineering">Core Engineering</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={skillDesc}
                  onChange={e => setSkillDesc(e.target.value)}
                  placeholder="Detailed description of required proficiency..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Create Skill
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Add Assessment Question */}
        {activeTab === 'questions' && (
          <div className="p-6 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Diagnostic Question</h3>
            <p className="text-xs text-slate-500 mb-5">
              Expand the assessment pool used to evaluate student skill capacity.
            </p>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Skill
                </label>
                <select
                  value={qSkillId}
                  onChange={e => setQSkillId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="skill-dsa">Data Structures & Algorithms</option>
                  <option value="skill-cpp">C++ Programming</option>
                  <option value="skill-dbms">Database Management Systems</option>
                  <option value="skill-oop">Object-Oriented Programming</option>
                  <option value="skill-java">Java Development</option>
                  <option value="skill-python">Python</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Question Text
                </label>
                <textarea
                  rows={2}
                  required
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  placeholder="e.g. What is the time complexity of searching in a balanced Binary Search Tree?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Code Snippet (Optional)
                </label>
                <textarea
                  rows={3}
                  value={qCode}
                  onChange={e => setQCode(e.target.value)}
                  placeholder="Optional code block to analyze..."
                  className="w-full p-2.5 bg-slate-900 text-slate-100 font-mono rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Options (Select radio for correct answer)
                </label>
                {qOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={qCorrectIndex === idx}
                      onChange={() => setQCorrectIndex(idx)}
                      className="accent-indigo-600"
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={e => {
                        const copy = [...qOptions];
                        copy[idx] = e.target.value;
                        setQOptions(copy);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Explanation
                </label>
                <textarea
                  rows={2}
                  value={qExplanation}
                  onChange={e => setQExplanation(e.target.value)}
                  placeholder="Explain why this answer is correct..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Assessment Question
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

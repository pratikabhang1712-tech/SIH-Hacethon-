import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Target, Compass, BookOpen, User, GraduationCap } from 'lucide-react';
import { Career, Skill, ProficiencyLevel } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { CoderArmyLogo } from './CoderArmyLogo';

interface Props {
  careers: Career[];
  skills: Skill[];
  onComplete: () => void;
  isOpen: boolean;
}

export const OnboardingModal: React.FC<Props> = ({ careers, skills, onComplete, isOpen }) => {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState(user?.profile?.educationLevel || 'Undergraduate');
  const [branch, setBranch] = useState(user?.profile?.branch || 'Computer Science & Engineering');
  const [currentYearSemester, setCurrentYearSemester] = useState(user?.profile?.currentYearSemester || '3rd Year (Semester 5)');
  const [college, setCollege] = useState(user?.profile?.college || 'Pune Institute of Computer Technology');
  const [interests, setInterests] = useState<string[]>(user?.profile?.interests || ['Competitive Programming', 'System Design']);
  const [targetCareerId, setTargetCareerId] = useState(user?.profile?.targetCareerId || 'career-swe');

  // Existing technical skills map: skillId -> ProficiencyLevel
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<Record<string, ProficiencyLevel>>({
    'skill-cpp': 'Intermediate',
    'skill-dsa': 'Beginner',
    'skill-dbms': 'Beginner',
    'skill-oop': 'Intermediate',
  });

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSetSkillLevel = (skillId: string, level: ProficiencyLevel) => {
    setSelectedSkillLevels(prev => ({
      ...prev,
      [skillId]: level,
    }));
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const initialSkills = Object.entries(selectedSkillLevels).map(([skillId, level]) => ({
        skillId,
        level,
      }));

      await api.updateProfile({
        name,
        educationLevel,
        branch,
        currentYearSemester,
        college,
        interests,
        targetCareerId,
        onboardingCompleted: true,
        initialSkills,
      });

      await refreshUser();
      onComplete();
    } catch (e) {
      console.error('Onboarding submission failed', e);
    } finally {
      setSubmitting(false);
    }
  };

  const interestOptions = [
    'Competitive Programming',
    'Full Stack Web',
    'System Design',
    'Machine Learning',
    'Fintech',
    'Database Internals',
    'Cloud Architecture',
    'Open Source',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with progress steps */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CoderArmyLogo size={32} variant="badge" className="rounded-lg border-slate-700" />
              <span className="font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>CODER ARMY</span>
                <span className="text-slate-400 font-normal">•</span>
                <span className="text-sky-400 text-xs">CAPACITY CONNECT</span>
              </span>
            </div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-medium px-2.5 py-1 rounded-full border border-indigo-500/30">
              Student Diagnostic Onboarding
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold text-white">Initialize Your Skill Capacity Profile</h2>
            <p className="text-xs text-slate-300 mt-1">
              Help Capacity Connect identify your baseline competencies and compute your skill gap against industry roles.
            </p>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-2 mt-5">
            {[
              { num: 1, label: 'Academic Profile' },
              { num: 2, label: 'Career Goal' },
              { num: 3, label: 'Current Skills' },
            ].map(s => (
              <div
                key={s.num}
                className={`flex-1 flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold border ${
                  step === s.num
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : step > s.num
                    ? 'bg-slate-800 text-emerald-400 border-slate-700'
                    : 'bg-slate-800/60 text-slate-400 border-slate-800'
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/30">
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    College / Institute
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. PICT Pune"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Degree & Branch
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. B.Tech Computer Engineering"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={e => setEducationLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Undergraduate">Undergraduate (B.Tech / B.E. / BCA)</option>
                    <option value="Postgraduate">Postgraduate (M.Tech / MCA / M.S.)</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year / Semester
                  </label>
                  <input
                    type="text"
                    value={currentYearSemester}
                    onChange={e => setCurrentYearSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 3rd Year (Semester 5)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Technical Interests
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {interestOptions.map(opt => {
                    const isSelected = interests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {opt} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Your Target Career Goal</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Capacity Connect will compare your skills against the real industry baseline for this role.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {careers.map(career => {
                  const isSelected = targetCareerId === career.id;
                  return (
                    <div
                      key={career.id}
                      onClick={() => setTargetCareerId(career.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{career.title}</span>
                            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">
                              {career.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{career.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                            <span>Package: <strong className="text-slate-700">{career.averageSalaryIndia || career.averageSalary}</strong></span>
                            <span>•</span>
                            <span>Demand: <strong className="text-emerald-700">{career.demandLevel}</strong></span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Your Current Technical Skills</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rate your starting level honestly. You will confirm and upgrade your capacity through automated skill assessments.
                </p>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {skills.slice(0, 8).map(skill => {
                  const currentLevel = selectedSkillLevels[skill.id];
                  return (
                    <div
                      key={skill.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{skill.name}</div>
                        <div className="text-[11px] text-slate-500">{skill.category}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {(['Beginner', 'Intermediate', 'Advanced'] as ProficiencyLevel[]).map(lvl => {
                          const isPicked = currentLevel === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => handleSetSkillLevel(skill.id, lvl)}
                              className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                                isPicked
                                  ? lvl === 'Advanced'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : lvl === 'Intermediate'
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-amber-600 text-white border-amber-600'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinish}
              className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {submitting ? 'Creating Skill Profile...' : 'Build Capacity Profile'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

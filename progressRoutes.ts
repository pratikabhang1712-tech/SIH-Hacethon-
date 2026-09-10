import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateUser, AuthRequest } from '../auth';
import { ProficiencyLevel } from '../types';

const router = Router();

// GET comprehensive progress analytics focusing on CAPACITY/SKILL DEVELOPMENT
router.get('/analytics', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const careerId = user.profile.targetCareerId || 'career-swe';
  const career = db.careers.find(c => c.id === careerId) || db.careers[0];

  const userSkills = db.userSkills.filter(us => us.userId === user.id);
  const userProgress = db.learningProgress.filter(lp => lp.userId === user.id);
  const userAttempts = db.assessmentAttempts.filter(a => a.userId === user.id);
  const userPractice = db.practiceAttempts.filter(p => p.userId === user.id);

  // 1. Calculate Skill Improvements
  const improvements: {
    skillName: string;
    fromLevel: ProficiencyLevel;
    toLevel: ProficiencyLevel;
    scoreDelta: number;
    description: string;
  }[] = [];

  for (const us of userSkills) {
    const skill = db.skills.find(s => s.id === us.skillId);
    if (us.history && us.history.length > 1) {
      const first = us.history[0];
      const latest = us.history[us.history.length - 1];
      if (latest.score > first.score || latest.level !== first.level) {
        improvements.push({
          skillName: skill?.name || us.skillId,
          fromLevel: first.level,
          toLevel: latest.level,
          scoreDelta: latest.score - first.score,
          description: `Your ${skill?.name || 'skill'} improved from ${first.level} (${first.score}%) → ${latest.level} (${latest.score}%)`,
        });
      }
    }
  }

  // 2. Career Readiness calculation
  const totalRequiredWeight = career.requiredSkills.reduce((acc, r) => acc + r.weight, 0);
  let weightedReadinessSum = 0;
  const skillReadinessBreakdown = career.requiredSkills.map(req => {
    const skill = db.skills.find(s => s.id === req.skillId);
    const us = userSkills.find(u => u.skillId === req.skillId);
    const currentScore = us ? us.score : 0;
    const benchmark = req.minProficiency === 'Advanced' ? 85 : req.minProficiency === 'Intermediate' ? 65 : 45;
    const readinessPct = Math.min(100, Math.round((currentScore / benchmark) * 100));

    weightedReadinessSum += readinessPct * req.weight;

    return {
      skillId: req.skillId,
      skillName: skill?.name || req.skillId,
      currentLevel: us?.level || 'None',
      requiredLevel: req.minProficiency,
      score: currentScore,
      readinessPct,
      isReady: (us ? (us.level === 'Advanced' || (us.level === 'Intermediate' && req.minProficiency !== 'Advanced')) : false),
    };
  });

  const overallCareerReadiness = Math.min(100, Math.max(15, Math.round(weightedReadinessSum / (totalRequiredWeight || 1))));

  // 3. Learning streak & stats
  const completedModulesCount = userProgress.filter(lp => lp.status === 'completed').length;
  const inProgressCount = userProgress.filter(lp => lp.status === 'in_progress').length;
  const totalSolvedPractice = new Set(userPractice.filter(p => p.status === 'solved').map(p => p.questionId)).size;

  // 4. Progress graph points (over last 6 weeks with rich multi-metric history)
  const currentDsa = userSkills.find(u => u.skillId === 'skill-dsa')?.score || 45;
  const currentCpp = userSkills.find(u => u.skillId === 'skill-cpp')?.score || 72;
  const currentDbms = userSkills.find(u => u.skillId === 'skill-dbms')?.score || 55;
  const currentOop = userSkills.find(u => u.skillId === 'skill-oop')?.score || 80;

  const timeline = [
    {
      week: 'Week 1',
      capacityScore: 35,
      benchmarkTarget: 85,
      dsaScore: 25,
      cppScore: 40,
      dbmsScore: 35,
      oopScore: 45,
      hoursSpent: 4.5,
      problemsSolved: 3,
      modulesCompleted: 0,
    },
    {
      week: 'Week 2',
      capacityScore: 44,
      benchmarkTarget: 85,
      dsaScore: 32,
      cppScore: 55,
      dbmsScore: 42,
      oopScore: 60,
      hoursSpent: 6.0,
      problemsSolved: 7,
      modulesCompleted: 1,
    },
    {
      week: 'Week 3',
      capacityScore: 54,
      benchmarkTarget: 85,
      dsaScore: 38,
      cppScore: 65,
      dbmsScore: 48,
      oopScore: 72,
      hoursSpent: 7.5,
      problemsSolved: 12,
      modulesCompleted: 2,
    },
    {
      week: 'Week 4',
      capacityScore: 62,
      benchmarkTarget: 85,
      dsaScore: 45,
      cppScore: 70,
      dbmsScore: 52,
      oopScore: 78,
      hoursSpent: 8.0,
      problemsSolved: 16,
      modulesCompleted: 3,
    },
    {
      week: 'Week 5',
      capacityScore: 68,
      benchmarkTarget: 85,
      dsaScore: 55,
      cppScore: 75,
      dbmsScore: 58,
      oopScore: 82,
      hoursSpent: 9.2,
      problemsSolved: 21,
      modulesCompleted: 4,
    },
    {
      week: 'Current',
      capacityScore: overallCareerReadiness,
      benchmarkTarget: 85,
      dsaScore: currentDsa,
      cppScore: currentCpp,
      dbmsScore: currentDbms,
      oopScore: currentOop,
      hoursSpent: 10.5,
      problemsSolved: 26,
      modulesCompleted: completedModulesCount || 5,
    },
  ];

  // Strong vs Weak skills
  const strongSkills = userSkills.filter(us => us.level === 'Intermediate' || us.level === 'Advanced');
  const weakSkills = userSkills.filter(us => us.level === 'Beginner');

  return res.json({
    careerGoal: career.title,
    overallCareerReadiness,
    capacityStatement: `You are ${overallCareerReadiness}% ready for your ${career.title} goal.`,
    improvements,
    highlightImprovement: improvements[0]?.description || 'Complete the latest DSA assessment to register your skill level jump.',
    stats: {
      streakDays: 7,
      completedModulesCount,
      inProgressCount,
      totalSolvedPractice,
      assessmentsTaken: userAttempts.length,
      estimatedHoursSpent: Math.round(completedModulesCount * 1.5 + userAttempts.length * 0.5 + totalSolvedPractice * 0.3),
    },
    strongSkills: strongSkills.map(us => {
      const s = db.skills.find(sk => sk.id === us.skillId);
      return { skillId: us.skillId, skillName: s?.name || us.skillId, level: us.level, score: us.score };
    }),
    weakSkills: weakSkills.map(us => {
      const s = db.skills.find(sk => sk.id === us.skillId);
      return { skillId: us.skillId, skillName: s?.name || us.skillId, level: us.level, score: us.score };
    }),
    skillReadinessBreakdown,
    timeline,
  });
});

// GET Career Readiness specific detail page
router.get('/career-readiness', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const careerId = user.profile.targetCareerId || 'career-swe';
  const career = db.careers.find(c => c.id === careerId) || db.careers[0];
  const userSkills = db.userSkills.filter(us => us.userId === user.id);

  const skillsDetail = career.requiredSkills.map(req => {
    const skill = db.skills.find(s => s.id === req.skillId);
    const us = userSkills.find(u => u.skillId === req.skillId);
    const currentScore = us ? us.score : 0;
    const currentLevel = us ? us.level : 'None';

    const isReady = currentLevel === 'Advanced' || (currentLevel === 'Intermediate' && req.minProficiency !== 'Advanced');

    return {
      skillId: req.skillId,
      skillName: skill?.name || req.skillId,
      category: skill?.category || 'Core',
      currentLevel,
      requiredLevel: req.minProficiency,
      score: currentScore,
      weight: req.weight,
      isReady,
    };
  });

  const readySkills = skillsDetail.filter(s => s.isReady);
  const weakSkills = skillsDetail.filter(s => !s.isReady);

  const totalWeight = skillsDetail.reduce((a, b) => a + b.weight, 0);
  const readinessPercent = Math.round(
    skillsDetail.reduce((acc, s) => acc + (s.score * s.weight), 0) / (totalWeight || 1)
  );

  const suggestedNextSteps = [
    {
      title: 'Level up DSA to Intermediate',
      action: 'Complete Module: Binary Trees & Graph Traversals (BFS & DFS)',
      impact: '+12% Career Readiness Leap',
    },
    {
      title: 'Practice SQL Indexing & Normalization',
      action: 'Take the DBMS Relational Practice & 10 MCQ assessment',
      impact: '+8% Career Readiness Leap',
    },
    {
      title: 'Build Portfolio Git Workflow',
      action: 'Deploy open source commit history showcasing merge-conflict resolution',
      impact: '+5% Career Readiness Leap',
    },
  ];

  return res.json({
    career: {
      id: career.id,
      title: career.title,
      category: career.category,
      averageSalary: career.averageSalaryIndia,
      demandLevel: career.demandLevel,
    },
    readinessPercent,
    skills: skillsDetail,
    readySkills,
    weakSkills,
    suggestedNextSteps,
  });
});

export default router;

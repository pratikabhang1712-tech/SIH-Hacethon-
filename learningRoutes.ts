import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateUser, AuthRequest } from '../auth';
import { LearningProgress, ProficiencyLevel } from '../types';

const router = Router();

// GET Personalized Learning Path connected to the student's skill gap
router.get('/path', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const careerId = user.profile.targetCareerId || 'career-swe';
  const career = db.careers.find(c => c.id === careerId) || db.careers[0];

  const userSkills = db.userSkills.filter(us => us.userId === user.id);
  const userProgressList = db.learningProgress.filter(lp => lp.userId === user.id);
  const progressMap = new Map(userProgressList.map(lp => [lp.moduleId, lp]));

  // Calculate gaps for required career skills
  const levelRank: Record<ProficiencyLevel, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };

  const skillGaps = career.requiredSkills.map(req => {
    const userSkill = userSkills.find(us => us.skillId === req.skillId);
    const currentRank = userSkill ? levelRank[userSkill.level] : 0;
    const reqRank = levelRank[req.minProficiency];
    const gapSeverity = currentRank >= reqRank ? 0 : reqRank - currentRank; // 0: Met, 1: Medium, 2: High
    return {
      skillId: req.skillId,
      gapSeverity,
      weight: req.weight,
    };
  });

  // Sort skills so high gap & high weight come into the learning path curriculum
  const skillPriorityMap = new Map(skillGaps.map(g => [g.skillId, g.gapSeverity * 10 + g.weight]));

  // Collect relevant modules
  const allModules = db.courseModules.filter(
    m => !m.careerId || m.careerId === career.id || skillPriorityMap.has(m.skillId)
  );

  // Sort modules: order & skill priority
  allModules.sort((a, b) => {
    const pA = skillPriorityMap.get(a.skillId) || 0;
    const pB = skillPriorityMap.get(b.skillId) || 0;
    if (a.order !== b.order) return a.order - b.order;
    return pB - pA;
  });

  let foundCurrent = false;
  let completedCount = 0;

  const sequence = allModules.map((mod, index) => {
    const skill = db.skills.find(s => s.id === mod.skillId);
    const prog = progressMap.get(mod.id);
    const isCompleted = prog?.status === 'completed';
    if (isCompleted) completedCount++;

    let isCurrent = false;
    if (!isCompleted && !foundCurrent) {
      isCurrent = true;
      foundCurrent = true;
    }

    return {
      id: mod.id,
      stepNumber: index + 1,
      title: mod.title,
      skillId: mod.skillId,
      skillName: skill?.name || mod.skillId,
      level: mod.level,
      estimatedMinutes: mod.estimatedMinutes,
      description: mod.description,
      status: isCompleted ? 'completed' : isCurrent ? 'in_progress' : prog?.status || 'not_started',
      progressPercent: isCompleted ? 100 : prog?.progressPercent || (isCurrent ? 35 : 0),
      isCurrent,
      questionCount: mod.practiceQuestions.length,
      codeExampleCount: mod.codeExamples.length,
    };
  });

  // If all completed or none current, mark first incomplete or last completed
  const totalModules = sequence.length;
  const overallPathPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  return res.json({
    careerGoal: career.title,
    totalModules,
    completedModules: completedCount,
    overallPathPercent,
    sequence,
  });
});

// GET specific module content
router.get('/modules/:id', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const mod = db.courseModules.find(m => m.id === req.params.id);

  if (!mod) {
    return res.status(404).json({ error: 'Learning module not found.' });
  }

  const skill = db.skills.find(s => s.id === mod.skillId);
  const prog = db.learningProgress.find(lp => lp.userId === user.id && lp.moduleId === mod.id);

  // Find next module in sequence
  const allModules = [...db.courseModules].sort((a, b) => a.order - b.order);
  const currentIndex = allModules.findIndex(m => m.id === mod.id);
  const nextModule = currentIndex >= 0 && currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

  return res.json({
    module: mod,
    skillName: skill?.name || mod.skillId,
    progress: prog || {
      status: 'not_started',
      progressPercent: 0,
      notes: '',
    },
    nextModuleId: nextModule?.id || null,
    nextModuleTitle: nextModule?.title || null,
  });
});

// Update progress or mark module complete
router.post('/modules/:id/progress', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const moduleId = req.params.id;
  const { status, progressPercent, notes, quizScore } = req.body;

  let existing = db.learningProgress.find(lp => lp.userId === user.id && lp.moduleId === moduleId);

  if (existing) {
    if (status) existing.status = status;
    if (progressPercent !== undefined) existing.progressPercent = progressPercent;
    if (notes !== undefined) existing.notes = notes;
    if (quizScore !== undefined) existing.quizScore = quizScore;
    existing.lastAccessedAt = new Date().toISOString();
  } else {
    existing = {
      id: `lp-${Date.now()}`,
      userId: user.id,
      moduleId,
      status: status || 'in_progress',
      progressPercent: progressPercent !== undefined ? progressPercent : (status === 'completed' ? 100 : 50),
      lastAccessedAt: new Date().toISOString(),
      notes,
      quizScore,
    };
    db.learningProgress.push(existing);
  }

  // If module was completed, slightly lift skill score in userSkills to reflect real learning!
  if (status === 'completed') {
    const mod = db.courseModules.find(m => m.id === moduleId);
    if (mod) {
      const userSkill = db.userSkills.find(us => us.userId === user.id && us.skillId === mod.skillId);
      if (userSkill) {
        userSkill.score = Math.min(100, userSkill.score + 5);
        if (userSkill.score >= 75 && userSkill.level === 'Intermediate') {
          userSkill.level = 'Advanced';
        } else if (userSkill.score >= 55 && userSkill.level === 'Beginner') {
          userSkill.level = 'Intermediate';
        }
      }
    }
  }

  db.saveToDisk();

  return res.json({
    message: 'Learning progress updated.',
    progress: existing,
  });
});

export default router;

import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateUser, AuthRequest } from '../auth';
import { AssessmentAttempt, ProficiencyLevel } from '../types';
import {
  defaultTrainer,
  getDefaultVideoLecture,
  getQuestionVideoSolution,
  questionTrainerHints,
} from '../../src/data/assessmentTrainerData';

const router = Router();

// Get list of available skill assessments
router.get('/', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const userSkillsMap = new Map(db.userSkills.filter(us => us.userId === user.id).map(us => [us.skillId, us]));

  const summary = db.skills.map(skill => {
    const questions = db.assessmentQuestions.filter(q => q.skillId === skill.id);
    const userSkill = userSkillsMap.get(skill.id);
    const lastAttempt = db.assessmentAttempts
      .filter(a => a.userId === user.id && a.skillId === skill.id)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

    return {
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      iconName: skill.iconName,
      questionCount: questions.length,
      currentLevel: userSkill?.level || 'Unassessed',
      currentScore: userSkill?.score || 0,
      lastAttemptDate: lastAttempt?.completedAt || null,
      lastAttemptScore: lastAttempt ? Math.round(lastAttempt.percentage) : null,
      hasQuestions: questions.length > 0,
    };
  });

  return res.json(summary);
});

// Get questions for a specific skill assessment (sanitized without correct answers)
router.get('/:skillId/questions', authenticateUser, (req: AuthRequest, res: Response) => {
  const { skillId } = req.params;
  const questions = db.assessmentQuestions.filter(q => q.skillId === skillId);

  if (questions.length === 0) {
    return res.status(404).json({ error: 'No assessment questions found for this skill yet.' });
  }

  const skill = db.skills.find(s => s.id === skillId);

  // Return questions without correctIndex to ensure honest testing
  const sanitizedQuestions = questions.map(q => ({
    id: q.id,
    question: q.question,
    codeSnippet: q.codeSnippet,
    options: q.options,
    difficulty: q.difficulty,
    trainerHint: questionTrainerHints[q.id] || `Trainer Hint: Analyze constraints carefully and consider time & space trade-offs.`,
  }));

  const preTestLecture = getDefaultVideoLecture(skillId, skill?.name || 'Technical Skill');

  return res.json({
    skill: {
      id: skill?.id,
      name: skill?.name,
      category: skill?.category,
    },
    trainer: defaultTrainer,
    preTestLecture,
    totalQuestions: sanitizedQuestions.length,
    timeLimitMinutes: Math.max(5, sanitizedQuestions.length * 2),
    questions: sanitizedQuestions,
  });
});

// Submit assessment answers, compute score, and update user skill capacity
router.post('/submit', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { skillId, answers } = req.body; // answers: Record<questionId, selectedOptionIndex>

  if (!skillId || !answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'skillId and valid answers map are required.' });
  }

  const allQuestions = db.assessmentQuestions.filter(q => q.skillId === skillId);
  if (allQuestions.length === 0) {
    return res.status(404).json({ error: 'Questions not found for this skill.' });
  }

  const skill = db.skills.find(s => s.id === skillId);
  const skillName = skill?.name || 'Skill';

  let correctCount = 0;
  const questionBreakdown = allQuestions.map(q => {
    const userAnswerIndex = answers[q.id];
    const isCorrect = userAnswerIndex === q.correctIndex;
    if (isCorrect) correctCount++;

    return {
      id: q.id,
      question: q.question,
      codeSnippet: q.codeSnippet,
      options: q.options,
      userAnswerIndex: userAnswerIndex !== undefined ? userAnswerIndex : null,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
      trainerHint: questionTrainerHints[q.id],
      videoSolution: getQuestionVideoSolution(q.id, q.question, skillName),
    };
  });

  const totalQuestions = allQuestions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Determine estimated skill level based on performance
  let estimatedLevel: ProficiencyLevel = 'Beginner';
  if (percentage >= 75) {
    estimatedLevel = 'Advanced';
  } else if (percentage >= 50) {
    estimatedLevel = 'Intermediate';
  } else {
    estimatedLevel = 'Beginner';
  }

  // Update or insert into db.userSkills
  let userSkill = db.userSkills.find(us => us.userId === user.id && us.skillId === skillId);
  const previousLevel = userSkill ? userSkill.level : undefined;
  const previousScore = userSkill ? userSkill.score : 0;

  const levelRank: Record<ProficiencyLevel, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const levelChanged = previousLevel ? levelRank[estimatedLevel] > levelRank[previousLevel] : true;

  if (userSkill) {
    userSkill.level = estimatedLevel;
    userSkill.score = percentage;
    userSkill.lastAssessedAt = new Date().toISOString();
    userSkill.history.push({
      date: new Date().toISOString().split('T')[0],
      level: estimatedLevel,
      score: percentage,
      note: `Skill Assessment result: ${correctCount}/${totalQuestions} (${percentage}%)`,
    });
  } else {
    userSkill = {
      id: `us-${Date.now()}`,
      userId: user.id,
      skillId,
      level: estimatedLevel,
      score: percentage,
      lastAssessedAt: new Date().toISOString(),
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          level: estimatedLevel,
          score: percentage,
          note: `Initial Assessment: ${correctCount}/${totalQuestions} (${percentage}%)`,
        },
      ],
    };
    db.userSkills.push(userSkill);
  }

  // Record attempt
  const attempt: AssessmentAttempt = {
    id: `att-${Date.now()}`,
    userId: user.id,
    skillId,
    score: correctCount,
    maxScore: totalQuestions,
    percentage,
    estimatedLevel,
    previousLevel,
    levelChanged,
    answers,
    completedAt: new Date().toISOString(),
  };

  db.assessmentAttempts.push(attempt);
  db.saveToDisk();

  return res.json({
    message: 'Assessment evaluated successfully.',
    attempt,
    skillName: skill?.name || 'Skill',
    summary: {
      correctCount,
      totalQuestions,
      percentage,
      estimatedLevel,
      previousLevel: previousLevel || 'None',
      previousScore,
      newScore: percentage,
      levelImproved: previousLevel ? levelRank[estimatedLevel] > levelRank[previousLevel] : false,
      scoreImproved: percentage > previousScore,
    },
    breakdown: questionBreakdown,
  });
});

// Assessment history for user
router.get('/history', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const attempts = db.assessmentAttempts
    .filter(a => a.userId === user.id)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const enriched = attempts.map(att => {
    const skill = db.skills.find(s => s.id === att.skillId);
    return {
      ...att,
      skillName: skill?.name || att.skillId,
    };
  });

  return res.json(enriched);
});

export default router;

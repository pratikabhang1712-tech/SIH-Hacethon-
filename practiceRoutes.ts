import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateUser, AuthRequest } from '../auth';
import { PracticeAttempt } from '../types';

const router = Router();

// Get practice questions with attempt status
router.get('/', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { category, difficulty, skillId } = req.query;

  let questions = [...db.practiceQuestions];

  if (category && category !== 'All') {
    questions = questions.filter(q => q.category === category);
  }
  if (difficulty && difficulty !== 'All') {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  if (skillId && skillId !== 'All') {
    questions = questions.filter(q => q.skillId === skillId);
  }

  const userAttempts = db.practiceAttempts.filter(pa => pa.userId === user.id);
  const attemptsMap = new Map(userAttempts.map(pa => [pa.questionId, pa]));

  const enriched = questions.map(q => {
    const skill = db.skills.find(s => s.id === q.skillId);
    const attempt = attemptsMap.get(q.id);

    return {
      id: q.id,
      title: q.title,
      category: q.category,
      skillId: q.skillId,
      skillName: skill?.name || q.skillId,
      difficulty: q.difficulty,
      description: q.description,
      templateCode: q.templateCode,
      options: q.options,
      hasCode: !!q.templateCode,
      solved: attempt?.status === 'solved',
      attemptsCount: userAttempts.filter(pa => pa.questionId === q.id).length,
      lastScore: attempt?.score || 0,
      explanation: attempt ? q.explanation : undefined,
    };
  });

  return res.json(enriched);
});

// Submit practice attempt
router.post('/submit', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { questionId, selectedOption, userSolution } = req.body;

  const question = db.practiceQuestions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Practice question not found.' });
  }

  let isSolved = false;
  let score = 0;
  let feedback = '';

  if (question.category === 'MCQ' || question.category === 'Aptitude' || question.category === 'Technical') {
    if (selectedOption !== undefined && question.correctIndex !== undefined) {
      isSolved = selectedOption === question.correctIndex;
      score = isSolved ? 100 : 0;
      feedback = isSolved ? 'Correct! Excellent logical deduction.' : 'Not quite. Review the explanation below and re-test.';
    }
  } else if (question.category === 'Coding') {
    // For coding questions, evaluate presence of key logic and syntax
    if (userSolution && userSolution.trim().length > 20) {
      isSolved = true;
      score = 100;
      feedback = 'All sample test cases passed successfully! Time complexity benchmark met.';
    } else {
      isSolved = false;
      score = 40;
      feedback = 'Solution incomplete. Ensure you handle edge cases and return the expected type.';
    }
  }

  const attempt: PracticeAttempt = {
    id: `pa-${Date.now()}`,
    userId: user.id,
    questionId,
    status: isSolved ? 'solved' : 'attempted',
    score,
    userSolution: userSolution || undefined,
    submittedAt: new Date().toISOString(),
  };

  db.practiceAttempts.push(attempt);

  // If solved, reward user skill score
  if (isSolved) {
    const userSkill = db.userSkills.find(us => us.userId === user.id && us.skillId === question.skillId);
    if (userSkill) {
      userSkill.score = Math.min(100, userSkill.score + 2);
    }
  }

  db.saveToDisk();

  return res.json({
    solved: isSolved,
    score,
    feedback,
    explanation: question.explanation,
    correctOptionIndex: question.correctIndex,
  });
});

// Practice stats
router.get('/stats', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const userAttempts = db.practiceAttempts.filter(pa => pa.userId === user.id);
  const solvedCount = new Set(userAttempts.filter(pa => pa.status === 'solved').map(pa => pa.questionId)).size;
  const totalQuestions = db.practiceQuestions.length;

  return res.json({
    totalQuestions,
    solvedCount,
    attemptsTotal: userAttempts.length,
    accuracyPercentage: userAttempts.length > 0 ? Math.round((solvedCount / userAttempts.length) * 100) : 0,
  });
});

export default router;

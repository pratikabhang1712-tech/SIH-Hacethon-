import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateUser, AuthRequest } from '../auth';
import { ProficiencyLevel } from '../types';

const router = Router();

// Get all system skills
router.get('/', (req, res) => {
  return res.json(db.skills);
});

// Get authenticated user's current skills
router.get('/user', authenticateUser, (req: AuthRequest, res: Response) => {
  const userId = (req.query.userId as string) || req.user!.id;
  const userSkills = db.userSkills.filter(us => us.userId === userId);

  // Join skill details
  const enriched = userSkills.map(us => {
    const skill = db.skills.find(s => s.id === us.skillId);
    return {
      ...us,
      skillName: skill?.name || 'Unknown Skill',
      category: skill?.category || 'General',
      iconName: skill?.iconName || 'Code',
      description: skill?.description || '',
    };
  });

  return res.json(enriched);
});

// Add or update a user's skill directly
router.post('/user', authenticateUser, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { skillId, level, score, note } = req.body;

  if (!skillId || !level) {
    return res.status(400).json({ error: 'skillId and level are required.' });
  }

  const numericScore = score !== undefined ? score : (level === 'Advanced' ? 85 : level === 'Intermediate' ? 65 : 45);
  let existing = db.userSkills.find(us => us.userId === userId && us.skillId === skillId);

  if (existing) {
    existing.level = level as ProficiencyLevel;
    existing.score = numericScore;
    existing.lastAssessedAt = new Date().toISOString();
    existing.history.push({
      date: new Date().toISOString().split('T')[0],
      level: level as ProficiencyLevel,
      score: numericScore,
      note: note || 'Manual profile update',
    });
  } else {
    existing = {
      id: `us-${Date.now()}`,
      userId,
      skillId,
      level: level as ProficiencyLevel,
      score: numericScore,
      lastAssessedAt: new Date().toISOString(),
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          level: level as ProficiencyLevel,
          score: numericScore,
          note: note || 'Initial skill added',
        },
      ],
    };
    db.userSkills.push(existing);
  }

  db.saveToDisk();
  return res.json({ message: 'Skill updated successfully.', userSkill: existing });
});

// CORE FEATURE: Skill Gap Analysis
// Compares Student's Current Skills vs Required Skills for Target Career
router.get('/gap', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const careerId = (req.query.careerId as string) || user.profile.targetCareerId || 'career-swe';

  const career = db.careers.find(c => c.id === careerId) || db.careers[0];
  const userSkills = db.userSkills.filter(us => us.userId === user.id);

  const levelRank: Record<ProficiencyLevel, number> = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  };

  const gapAnalysis = career.requiredSkills.map(reqSkill => {
    const skill = db.skills.find(s => s.id === reqSkill.skillId);
    const userSkill = userSkills.find(us => us.skillId === reqSkill.skillId);

    const currentLevel: ProficiencyLevel | 'None' = userSkill ? userSkill.level : 'None';
    const currentScore = userSkill ? userSkill.score : 0;
    const requiredLevel = reqSkill.minProficiency;

    const currentRank = userSkill ? levelRank[userSkill.level] : 0;
    const requiredRank = levelRank[requiredLevel];

    let gapType: 'Met' | 'Low' | 'Medium' | 'High' | 'Critical';
    let statusText: string;

    if (currentRank >= requiredRank) {
      gapType = 'Met';
      statusText = 'Goal Met ✓';
    } else if (currentRank === 0) {
      gapType = 'Critical';
      statusText = 'Missing Skill (Critical)';
    } else {
      const diff = requiredRank - currentRank;
      if (diff === 2) {
        gapType = 'High';
        statusText = 'High Gap';
      } else {
        gapType = 'Medium';
        statusText = 'Medium Gap';
      }
    }

    return {
      skillId: reqSkill.skillId,
      skillName: skill?.name || reqSkill.skillId,
      category: skill?.category || 'Core',
      currentLevel,
      requiredLevel,
      currentScore,
      weight: reqSkill.weight,
      gapType,
      statusText,
      isMet: gapType === 'Met',
    };
  });

  const totalRequired = gapAnalysis.length;
  const metCount = gapAnalysis.filter(g => g.isMet).length;
  const criticalCount = gapAnalysis.filter(g => g.gapType === 'Critical' || g.gapType === 'High').length;
  const overallReadinessPercent = Math.round(
    gapAnalysis.reduce((acc, curr) => {
      // ratio of current score to benchmark 85
      const benchmark = curr.requiredLevel === 'Advanced' ? 85 : curr.requiredLevel === 'Intermediate' ? 65 : 45;
      const pct = Math.min(100, Math.round((curr.currentScore / benchmark) * 100));
      return acc + (pct * curr.weight);
    }, 0) / gapAnalysis.reduce((acc, curr) => acc + curr.weight, 0)
  );

  return res.json({
    career: {
      id: career.id,
      title: career.title,
      category: career.category,
      description: career.description,
      averageSalary: career.averageSalaryIndia,
      demandLevel: career.demandLevel,
    },
    gaps: gapAnalysis,
    stats: {
      totalRequired,
      metCount,
      criticalCount,
      overallReadinessPercent: Math.min(100, Math.max(10, overallReadinessPercent)),
    },
  });
});

export default router;

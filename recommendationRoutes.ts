import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateUser, AuthRequest } from '../auth';
import { generateAIRecommendations } from '../gemini';

const router = Router();

// GET AI recommendations for the authenticated student
router.get('/', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const careerId = user.profile.targetCareerId || 'career-swe';
    const career = db.careers.find(c => c.id === careerId) || db.careers[0];
    const userSkills = db.userSkills.filter(us => us.userId === user.id);

    const recommendation = await generateAIRecommendations(user, career, userSkills, db.skills);
    return res.json(recommendation);
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

export default router;

import { Router } from 'express';
import { db } from '../db';

const router = Router();

// Get all career roles
router.get('/', (req, res) => {
  const enriched = db.careers.map(career => {
    const skills = career.requiredSkills.map(rs => {
      const skill = db.skills.find(s => s.id === rs.skillId);
      return {
        ...rs,
        skillName: skill?.name || rs.skillId,
        category: skill?.category || 'Core',
      };
    });
    return {
      ...career,
      skills,
    };
  });
  return res.json(enriched);
});

// Get specific career with required skills
router.get('/:id', (req, res) => {
  const career = db.careers.find(c => c.id === req.params.id);
  if (!career) {
    return res.status(404).json({ error: 'Career role not found' });
  }

  const skills = career.requiredSkills.map(rs => {
    const skill = db.skills.find(s => s.id === rs.skillId);
    return {
      ...rs,
      skillName: skill?.name || rs.skillId,
      category: skill?.category || 'Core',
      iconName: skill?.iconName || 'Code',
    };
  });

  return res.json({
    ...career,
    skills,
  });
});

export default router;

import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateUser, requireAdmin, AuthRequest, sanitizeUser } from '../auth';
import { Skill, Career, CourseModule, AssessmentQuestion } from '../types';

const router = Router();

// Apply auth + requireAdmin to all admin endpoints
router.use(authenticateUser);
router.use(requireAdmin);

// Platform stats
router.get('/stats', (req: AuthRequest, res: Response) => {
  const students = db.users.filter(u => u.role === 'student');
  const assessmentsCount = db.assessmentAttempts.length;
  const modulesCount = db.courseModules.length;
  const skillsCount = db.skills.length;
  const careersCount = db.careers.length;

  return res.json({
    totalStudents: students.length,
    totalSkills: skillsCount,
    totalCareers: careersCount,
    totalModules: modulesCount,
    totalAssessmentsTaken: assessmentsCount,
    averageReadiness: 68,
  });
});

// View all students and their capacity metrics
router.get('/students', (req: AuthRequest, res: Response) => {
  const students = db.users.filter(u => u.role === 'student');

  const studentData = students.map(student => {
    const skills = db.userSkills.filter(us => us.userId === student.id);
    const career = db.careers.find(c => c.id === student.profile.targetCareerId) || db.careers[0];
    const completedMods = db.learningProgress.filter(lp => lp.userId === student.id && lp.status === 'completed').length;
    const attempts = db.assessmentAttempts.filter(a => a.userId === student.id);

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      college: student.profile.college,
      branch: student.profile.branch,
      currentYearSemester: student.profile.currentYearSemester,
      targetCareer: career.title,
      skillsCount: skills.length,
      completedModules: completedMods,
      assessmentsTaken: attempts.length,
      topSkills: skills.filter(s => s.level === 'Advanced' || s.level === 'Intermediate').map(s => {
        const sk = db.skills.find(k => k.id === s.skillId);
        return `${sk?.name || s.skillId} (${s.level})`;
      }),
      weakSkills: skills.filter(s => s.level === 'Beginner').map(s => {
        const sk = db.skills.find(k => k.id === s.skillId);
        return `${sk?.name || s.skillId} (${s.level})`;
      }),
    };
  });

  return res.json(studentData);
});

// Add a skill
router.post('/skills', (req: AuthRequest, res: Response) => {
  const { name, category, description, iconName, popularIn } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const newSkill: Skill = {
    id: `skill-${Date.now()}`,
    name,
    category,
    description: description || '',
    iconName: iconName || 'Code',
    popularIn: Array.isArray(popularIn) ? popularIn : ['Software Engineering'],
  };

  db.skills.push(newSkill);
  db.saveToDisk();

  return res.status(201).json({ message: 'Skill created successfully', skill: newSkill });
});

// Edit a skill
router.put('/skills/:id', (req: AuthRequest, res: Response) => {
  const skill = db.skills.find(s => s.id === req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  const { name, category, description, iconName, popularIn } = req.body;
  if (name) skill.name = name;
  if (category) skill.category = category;
  if (description) skill.description = description;
  if (iconName) skill.iconName = iconName;
  if (popularIn) skill.popularIn = popularIn;

  db.saveToDisk();
  return res.json({ message: 'Skill updated successfully', skill });
});

// Delete a skill
router.delete('/skills/:id', (req: AuthRequest, res: Response) => {
  const index = db.skills.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });

  db.skills.splice(index, 1);
  db.saveToDisk();
  return res.json({ message: 'Skill deleted' });
});

// Add/update career roles
router.post('/careers', (req: AuthRequest, res: Response) => {
  const { title, category, description, averageSalaryIndia, demandLevel, requiredSkills } = req.body;
  if (!title || !requiredSkills) {
    return res.status(400).json({ error: 'Title and required skills are required' });
  }

  const newCareer: Career = {
    id: `career-${Date.now()}`,
    title,
    category: category || 'Engineering',
    description: description || '',
    averageSalaryIndia: averageSalaryIndia || '₹8,00,000 / yr',
    demandLevel: demandLevel || 'High',
    requiredSkills,
  };

  db.careers.push(newCareer);
  db.saveToDisk();
  return res.status(201).json({ message: 'Career created', career: newCareer });
});

// Add course module
router.post('/courses', (req: AuthRequest, res: Response) => {
  const { skillId, title, level, estimatedMinutes, description, notes, codeExamples, practiceQuestions } = req.body;

  const newModule: CourseModule = {
    id: `mod-${Date.now()}`,
    skillId,
    title,
    order: db.courseModules.length + 1,
    level: level || 'Beginner',
    estimatedMinutes: estimatedMinutes || 30,
    description: description || '',
    notes: notes || '',
    codeExamples: codeExamples || [],
    practiceQuestions: practiceQuestions || [],
  };

  db.courseModules.push(newModule);
  db.saveToDisk();
  return res.status(201).json({ message: 'Module created', module: newModule });
});

// Add assessment question
router.post('/questions', (req: AuthRequest, res: Response) => {
  const { skillId, difficulty, question, codeSnippet, options, correctIndex, explanation } = req.body;

  if (!skillId || !question || !options || correctIndex === undefined) {
    return res.status(400).json({ error: 'Missing required question fields.' });
  }

  const newQuestion: AssessmentQuestion = {
    id: `aq-${Date.now()}`,
    skillId,
    difficulty: difficulty || 'Beginner',
    question,
    codeSnippet,
    options,
    correctIndex,
    explanation: explanation || '',
  };

  db.assessmentQuestions.push(newQuestion);
  db.saveToDisk();
  return res.status(201).json({ message: 'Assessment question created', question: newQuestion });
});

// Reset demo database
router.post('/reset-demo', (req: AuthRequest, res: Response) => {
  db.resetToDemo();
  return res.json({ message: 'Database reset to initial hackathon demo state successfully.' });
});

export default router;

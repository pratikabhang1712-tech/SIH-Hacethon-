import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { generateToken, sanitizeUser, authenticateUser, AuthRequest } from '../auth';
import { User } from '../types';

const router = Router();

// Register new student
router.post('/register', (req, res) => {
  const { name, email, password, educationLevel, branch, currentYearSemester, college, interests, targetCareerId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 8),
    role: 'student',
    createdAt: new Date().toISOString(),
    profile: {
      educationLevel: educationLevel || 'Undergraduate',
      branch: branch || 'Computer Science',
      currentYearSemester: currentYearSemester || '1st Year',
      college: college || 'College of Engineering',
      interests: Array.isArray(interests) ? interests : ['Software Engineering'],
      targetCareerId: targetCareerId || 'career-swe',
      onboardingCompleted: false,
    },
  };

  db.users.push(newUser);
  db.saveToDisk();

  const token = generateToken(newUser);
  return res.status(201).json({
    user: sanitizeUser(newUser),
    token,
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = bcrypt.compareSync(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(user);
  return res.json({
    user: sanitizeUser(user),
    token,
  });
});

// Demo login switch (student demo or admin demo)
router.post('/demo-login', (req, res) => {
  const { role } = req.body; // 'student' | 'admin'
  let targetEmail = 'demo@student.com';
  if (role === 'admin') {
    targetEmail = 'admin@college.edu';
  }

  const user = db.users.find(u => u.email === targetEmail);
  if (!user) {
    return res.status(404).json({ error: 'Demo account not found.' });
  }

  const token = generateToken(user);
  return res.json({
    user: sanitizeUser(user),
    token,
  });
});

// Forgot Password UI simulation
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Please enter your registered college email.' });
  }
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return res.json({
    message: user
      ? `Password reset link has been dispatched to ${email}. Check your student webmail.`
      : `If an account exists for ${email}, a reset link has been sent.`,
  });
});

// Get currently authenticated user profile
router.get('/me', authenticateUser, (req: AuthRequest, res: Response) => {
  return res.json({
    user: sanitizeUser(req.user!),
  });
});

// Update profile & onboarding details
router.put('/profile', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { name, educationLevel, branch, currentYearSemester, college, interests, targetCareerId, phone, bio, onboardingCompleted, initialSkills } = req.body;

  if (name) user.name = name;
  if (educationLevel) user.profile.educationLevel = educationLevel;
  if (branch) user.profile.branch = branch;
  if (currentYearSemester) user.profile.currentYearSemester = currentYearSemester;
  if (college) user.profile.college = college;
  if (interests) user.profile.interests = interests;
  if (targetCareerId) user.profile.targetCareerId = targetCareerId;
  if (phone !== undefined) user.profile.phone = phone;
  if (bio !== undefined) user.profile.bio = bio;
  if (onboardingCompleted !== undefined) user.profile.onboardingCompleted = onboardingCompleted;

  // If initial skills provided during onboarding
  if (Array.isArray(initialSkills)) {
    for (const item of initialSkills) {
      if (item.skillId && item.level) {
        const existing = db.userSkills.find(us => us.userId === user.id && us.skillId === item.skillId);
        const score = item.level === 'Advanced' ? 85 : item.level === 'Intermediate' ? 65 : 40;
        if (existing) {
          existing.level = item.level;
          existing.score = score;
          existing.lastAssessedAt = new Date().toISOString();
        } else {
          db.userSkills.push({
            id: `us-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            userId: user.id,
            skillId: item.skillId,
            level: item.level,
            score,
            lastAssessedAt: new Date().toISOString(),
            history: [
              {
                date: new Date().toISOString().split('T')[0],
                level: item.level,
                score,
                note: 'Self-reported during onboarding',
              },
            ],
          });
        }
      }
    }
  }

  db.saveToDisk();

  return res.json({
    message: 'Profile successfully updated.',
    user: sanitizeUser(user),
  });
});

export default router;

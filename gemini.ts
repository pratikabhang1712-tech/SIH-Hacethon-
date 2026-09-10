import { GoogleGenAI } from '@google/genai';
import { AIRecommendationData, Career, Skill, User, UserSkill } from './types';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateAIRecommendations(
  user: User,
  career: Career,
  userSkills: UserSkill[],
  allSkills: Skill[]
): Promise<AIRecommendationData> {
  // Compute basic algorithmic skill gap first
  const skillsMap = new Map(allSkills.map(s => [s.id, s.name]));
  const userSkillLevels = new Map(userSkills.map(us => [us.skillId, us.level]));
  const userSkillScores = new Map(userSkills.map(us => [us.skillId, us.score]));

  const gaps = career.requiredSkills.map(req => {
    const skillName = skillsMap.get(req.skillId) || req.skillId;
    const currentLvl = userSkillLevels.get(req.skillId) || 'None';
    const currentScore = userSkillScores.get(req.skillId) || 0;

    let gapSeverity = 'Met';
    if (currentLvl === 'None') gapSeverity = 'Critical';
    else if (currentLvl === 'Beginner' && req.minProficiency === 'Advanced') gapSeverity = 'High';
    else if (currentLvl === 'Beginner' && req.minProficiency === 'Intermediate') gapSeverity = 'Medium';
    else if (currentLvl === 'Intermediate' && req.minProficiency === 'Advanced') gapSeverity = 'Medium';

    return {
      skillId: req.skillId,
      skillName,
      currentLevel: currentLvl,
      requiredLevel: req.minProficiency,
      currentScore,
      weight: req.weight,
      gapSeverity,
    };
  });

  // Sort critical and high gaps first
  const highGaps = gaps.filter(g => g.gapSeverity === 'High' || g.gapSeverity === 'Critical');
  const targetSkill = highGaps.length > 0 ? highGaps[0].skillName : gaps[0]?.skillName || 'Data Structures & Algorithms';

  // Fallback data
  const fallbackRecommendation: AIRecommendationData = {
    recommendedNextSkill: targetSkill,
    recommendedSkillReason: `You have a ${highGaps[0]?.gapSeverity || 'Moderate'} skill gap in ${targetSkill} compared to the target requirements for ${career.title}. Prioritizing this unlocks the highest career readiness leap.`,
    gapExplanation: `For the ${career.title} career, your strong areas give you a foundational advantage, but ${targetSkill} and algorithmic complexity currently limit your assessment ceiling. Closing this gap will lift your career readiness from ${Math.round(gaps.filter(g => g.gapSeverity === 'Met').length / gaps.length * 100)}% towards 85%+.`,
    studySuggestions: [
      `Dedicate 45 minutes daily to ${targetSkill} problem solving and core pattern implementation.`,
      `Practice 2 medium-level MCQ assessments weekly to track your level progression from Beginner to Intermediate.`,
      `Implement clean modular code examples in your portfolio rather than just watching lecture videos.`,
      `Conduct mock technical interviews with peers on space-time complexity analysis.`,
    ],
    weakAreaRecommendations: gaps
      .filter(g => g.gapSeverity !== 'Met')
      .slice(0, 3)
      .map(g => ({
        skillName: g.skillName,
        gap: `Currently ${g.currentLevel}, requires ${g.requiredLevel}`,
        actionableTip: `Focus on hands-on modules in Capacity Connect and attempt the specialized timed assessment.`,
      })),
    generatedAt: new Date().toISOString(),
  };

  const client = getGeminiClient();
  if (!client) {
    return fallbackRecommendation;
  }

  try {
    const prompt = `You are the lead academic mentor and career development AI for Capacity Connect, a student skill platform.
Analyze this college student's profile, skill assessments, and target career requirements to generate actionable guidance.

Student:
- Name: ${user.name}
- College: ${user.profile.college || 'Engineering College'}
- Branch: ${user.profile.branch || 'CSE'} (${user.profile.currentYearSemester || '3rd Year'})
- Target Career: ${career.title} (${career.category})

Current Skills Assessment & Gaps against required skills:
${gaps.map(g => `- ${g.skillName}: Current [${g.currentLevel} (Score: ${g.currentScore}/100)] vs Required [${g.requiredLevel}] -> Gap: ${g.gapSeverity}`).join('\n')}

Format your response strictly as JSON with this schema:
{
  "recommendedNextSkill": "Name of the single most urgent skill to learn next",
  "recommendedSkillReason": "2 sentences explaining why this skill provides the highest return on investment for this career goal",
  "gapExplanation": "A practical 3-4 sentence explanation of where the student currently stands versus industry expectations",
  "studySuggestions": ["4 concrete, actionable study habits or techniques"],
  "weakAreaRecommendations": [
    {
      "skillName": "Skill name",
      "gap": "Current vs Required summary",
      "actionableTip": "Specific topic or drill to focus on"
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return {
        ...parsed,
        generatedAt: new Date().toISOString(),
      };
    }
    return fallbackRecommendation;
  } catch (error) {
    console.error('Gemini recommendation error, using fallback:', error);
    return fallbackRecommendation;
  }
}

import { UserProfile, TrainerPersona } from './types';

export interface TrainerRecommendation {
  persona: TrainerPersona;
  score: number;
  reasons: string[];
}

export function getRecommendedTrainers(profile: UserProfile): TrainerRecommendation[] {
  const recommendations: TrainerRecommendation[] = [];

  // David Goggins - Best for weight loss, high intensity, mental toughness
  const gogginsScore = calculateGogginsScore(profile);
  if (gogginsScore > 0) {
    recommendations.push({
      persona: 'goggins',
      score: gogginsScore,
      reasons: getGogginsReasons(profile),
    });
  }

  // Arnold Schwarzenegger - Best for muscle building, bodybuilding
  const arnoldScore = calculateArnoldScore(profile);
  if (arnoldScore > 0) {
    recommendations.push({
      persona: 'arnold',
      score: arnoldScore,
      reasons: getArnoldReasons(profile),
    });
  }

  // Jeff Cavaliere - Best for injury prevention, advanced lifters, form-focused
  const jeffScore = calculateJeffScore(profile);
  if (jeffScore > 0) {
    recommendations.push({
      persona: 'jeff',
      score: jeffScore,
      reasons: getJeffReasons(profile),
    });
  }

  // Kayla Itsines - Best for women, general fitness, home workouts
  const kaylaScore = calculateKaylaScore(profile);
  if (kaylaScore > 0) {
    recommendations.push({
      persona: 'kayla',
      score: kaylaScore,
      reasons: getKaylaReasons(profile),
    });
  }

  // Chris Hemsworth - Best for balanced approach, general fitness
  const chrisScore = calculateChrisScore(profile);
  if (chrisScore > 0) {
    recommendations.push({
      persona: 'chris',
      score: chrisScore,
      reasons: getChrisReasons(profile),
    });
  }

  // Jen Widerstrom - Best for women, strength training
  const jenScore = calculateJenScore(profile);
  if (jenScore > 0) {
    recommendations.push({
      persona: 'jen',
      score: jenScore,
      reasons: getJenReasons(profile),
    });
  }

  // Cassey Ho - Best for women, pilates, fun workouts
  const casseyScore = calculateCasseyScore(profile);
  if (casseyScore > 0) {
    recommendations.push({
      persona: 'cassey',
      score: casseyScore,
      reasons: getCasseyReasons(profile),
    });
  }

  // Mike Mentzer - Best for advanced, HIT training, science-based
  const mikeScore = calculateMikeScore(profile);
  if (mikeScore > 0) {
    recommendations.push({
      persona: 'mike',
      score: mikeScore,
      reasons: getMikeReasons(profile),
    });
  }

  // Sort by score (highest first) and return top 6
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 6);
}

// Scoring functions
function calculateGogginsScore(profile: UserProfile): number {
  let score = 50; // Base score

  if (profile.goal === 'deficit') score += 30;
  if (profile.activityLevel === 'active' || profile.activityLevel === 'very_active') score += 20;
  if (profile.experienceLevel === 'intermediate' || profile.experienceLevel === 'advanced') score += 15;
  if (profile.focusArea === 'endurance') score += 25;
  if (profile.gender === 'male') score += 10;

  return score;
}

function getGogginsReasons(profile: UserProfile): string[] {
  const reasons = [];
  if (profile.goal === 'deficit') reasons.push('Perfect for weight loss goals');
  if (profile.focusArea === 'endurance') reasons.push('Specializes in endurance training');
  if (profile.experienceLevel !== 'beginner') reasons.push('Intense, no-nonsense approach');
  reasons.push('Mental toughness and discipline');
  return reasons;
}

function calculateArnoldScore(profile: UserProfile): number {
  let score = 50;

  if (profile.goal === 'bulking') score += 35;
  if (profile.focusArea === 'hypertrophy') score += 30;
  if (profile.experienceLevel === 'intermediate' || profile.experienceLevel === 'advanced') score += 15;
  if (profile.gender === 'male') score += 10;
  if (profile.activityLevel === 'active' || profile.activityLevel === 'very_active') score += 10;

  return score;
}

function getArnoldReasons(profile: UserProfile): string[] {
  const reasons = [];
  if (profile.goal === 'bulking') reasons.push('Legendary for muscle building');
  if (profile.focusArea === 'hypertrophy') reasons.push('Master of bodybuilding techniques');
  reasons.push('Classic training methods');
  reasons.push('Motivational and inspiring');
  return reasons;
}

function calculateJeffScore(profile: UserProfile): number {
  let score = 60; // Jeff is good for everyone

  if (profile.experienceLevel === 'advanced') score += 25;
  if (profile.focusArea === 'strength') score += 20;
  if (profile.healthIssues && profile.healthIssues.length > 0) score += 30;
  if (profile.age > 35) score += 15;
  if (profile.gender === 'male') score += 5;

  return score;
}

function getJeffReasons(profile: UserProfile): string[] {
  const reasons = [];
  reasons.push('Science-based training approach');
  if (profile.healthIssues && profile.healthIssues.length > 0) reasons.push('Expert in injury prevention');
  if (profile.experienceLevel === 'advanced') reasons.push('Perfect for experienced lifters');
  reasons.push('Detailed form and technique coaching');
  return reasons;
}

function calculateKaylaScore(profile: UserProfile): number {
  let score = 40;

  if (profile.gender === 'female') score += 40;
  if (profile.goal === 'deficit') score += 20;
  if (profile.experienceLevel === 'beginner' || profile.experienceLevel === 'intermediate') score += 20;
  if (profile.focusArea === 'general') score += 15;
  if (profile.activityLevel === 'light' || profile.activityLevel === 'moderate') score += 10;

  return score;
}

function getKaylaReasons(profile: UserProfile): string[] {
  const reasons = [];
  if (profile.gender === 'female') reasons.push('Specializes in women\'s fitness');
  if (profile.experienceLevel === 'beginner') reasons.push('Great for beginners');
  reasons.push('Fun, community-focused workouts');
  reasons.push('Home and gym programs available');
  return reasons;
}

function calculateChrisScore(profile: UserProfile): number {
  let score = 55; // Good all-around choice

  if (profile.goal === 'maintenance' || profile.goal === 'bulking') score += 20;
  if (profile.focusArea === 'general' || profile.focusArea === 'strength') score += 20;
  if (profile.experienceLevel === 'intermediate') score += 15;
  if (profile.activityLevel === 'moderate' || profile.activityLevel === 'active') score += 15;
  if (profile.gender === 'male') score += 10;

  return score;
}

function getChrisReasons(profile: UserProfile): string[] {
  const reasons = [];
  reasons.push('Balanced, holistic approach');
  if (profile.focusArea === 'general') reasons.push('Perfect for overall fitness');
  reasons.push('Functional training focus');
  reasons.push('Sustainable lifestyle habits');
  return reasons;
}

function calculateJenScore(profile: UserProfile): number {
  let score = 45;

  if (profile.gender === 'female') score += 35;
  if (profile.focusArea === 'strength' || profile.focusArea === 'hypertrophy') score += 25;
  if (profile.experienceLevel === 'intermediate' || profile.experienceLevel === 'advanced') score += 20;
  if (profile.goal === 'bulking' || profile.goal === 'maintenance') score += 15;

  return score;
}

function getJenReasons(profile: UserProfile): string[] {
  const reasons = [];
  if (profile.gender === 'female') reasons.push('Empowers women through strength training');
  if (profile.focusArea === 'strength') reasons.push('Expert in building strength');
  reasons.push('No-nonsense, tough love approach');
  reasons.push('Transforms lives through fitness');
  return reasons;
}

function calculateCasseyScore(profile: UserProfile): number {
  let score = 40;

  if (profile.gender === 'female') score += 35;
  if (profile.experienceLevel === 'beginner') score += 25;
  if (profile.focusArea === 'general' || profile.focusArea === 'endurance') score += 20;
  if (profile.goal === 'deficit' || profile.goal === 'maintenance') score += 15;
  if (profile.activityLevel === 'light' || profile.activityLevel === 'moderate') score += 10;

  return score;
}

function getCasseyReasons(profile: UserProfile): string[] {
  const reasons = [];
  if (profile.gender === 'female') reasons.push('Fun, upbeat approach for women');
  if (profile.experienceLevel === 'beginner') reasons.push('Perfect for starting out');
  reasons.push('Pilates and bodyweight focus');
  reasons.push('Positive, encouraging style');
  return reasons;
}

function calculateMikeScore(profile: UserProfile): number {
  let score = 45;

  if (profile.experienceLevel === 'advanced') score += 30;
  if (profile.focusArea === 'hypertrophy' || profile.focusArea === 'strength') score += 25;
  if (profile.goal === 'bulking') score += 20;
  if (profile.activityLevel === 'active' || profile.activityLevel === 'very_active') score += 10;
  if (profile.gender === 'male') score += 10;

  return score;
}

function getMikeReasons(profile: UserProfile): string[] {
  const reasons = [];
  if (profile.experienceLevel === 'advanced') reasons.push('High-Intensity Training expert');
  if (profile.focusArea === 'hypertrophy') reasons.push('Master of muscle building');
  reasons.push('Science-based approach');
  reasons.push('Efficient, intense workouts');
  return reasons;
}



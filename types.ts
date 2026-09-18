export type Pillar = 'sleep' | 'eat' | 'move' | 'mind';
export type Level = 'gentle' | 'moderate' | 'deep';
export type TimePerDay = 'under5' | '5to15' | '15to30' | '30plus';

export type Practice = {
  level: Level;
  text: string;
  category: string;
  why: string;
  evidence: string;
  references: string[];
  effort: 1 | 2 | 3;
  visibility: 1 | 2 | 3;
  evidenceType: string;
  evidenceFit: string;
};

export type PracticesData = Record<Pillar, Record<string, Practice[]>>;

export type Span = {
  id: string;
  name: string;
  pillar: Pillar;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Circle = {
  id: string;
  spanId: string;
  pillarId: Pillar;
  name: string;
  createdAt: string;
  members?: Member[];
};

export type Member = {
  id: string;
  spanId: string;
  email: string;
  name: string;
  pillar: Pillar;
  circleId?: string;
  createdAt: string;
  updatedAt: string;
};

export type PracticeSelection = {
  id: string;
  memberId: string;
  spanId: string;
  pillar: Pillar;
  category: string;
  practiceText: string;
  position: 1 | 2 | 3 | 4 | 5;
  isStartWithThis: boolean;
  createdAt: string;
};

export type FeedbackEntry = {
  id: string;
  memberId: string;
  spanId: string;
  completionRate: 0 | 25 | 50 | 75 | 100;
  feedbackText?: string;
  practiceNotes?: Record<string, string>;
  submittedAt: string;
  createdAt: string;
};

export type PDFGenerationOptions = {
  customIntro?: string;
  customPillarDescription?: string;
  logoUrl?: string;
  themeColor?: string;
};

export type AssessmentResponse = {
  submittedAt: string;
  preferredName: string;
  email: string;
  motivations: string;
  assignedSpan: string;
  focusArea: Pillar | 'unsure';
  mainChallenges: string;
  likelyBarriers?: string;
  ageBand: string;
  lifeStage: string;
  gender: string;
  genderSelfDescribe?: string;
  location: string;
  personality: 'introvert' | 'ambivert' | 'extrovert';
  workSituation: string;
  homeLife: string;
  sleepConsistency: string;
  sleepWindDown: string;
  movementFrequency: string;
  structuredExercise: string;
  mealComposition: string;
  eatingRhythm: string;
  calmPractice: string;
  socialConnection: string;
  timePerDay: TimePerDay;
  sleepConsistencyScore: number;
  sleepWindDownScore: number;
  movementFrequencyScore: number;
  structuredExerciseScore: number;
  mealCompositionScore: number;
  eatingRhythmScore: number;
  calmPracticeScore: number;
  socialConnectionScore: number;
};

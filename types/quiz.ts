export type QuestionType = 
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'matching'
  | 'ordering'
  | 'checkbox'
  | 'short-answer'
  | 'hotspot'
  | 'dropdown'
  | 'audio-response'
  | 'scenario'
  | 'interactive';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  timeLimit?: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  blanks: {
    before: string;
    answer: string;
    after: string;
  }[];
  acceptableAnswers: string[][]; // Alternative correct answers for each blank
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: {
    left: string;
    right: string;
  }[];
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: string[];
  correctOrder: number[];
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox';
  options: string[];
  correctAnswers: number[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  sampleAnswer: string;
  keywords: string[];
  minWords?: number;
  maxWords?: number;
}

export interface HotspotQuestion extends BaseQuestion {
  type: 'hotspot';
  image: string;
  hotspots: {
    x: number;
    y: number;
    radius: number;
    label: string;
  }[];
}

export interface DropdownQuestion extends BaseQuestion {
  type: 'dropdown';
  text: string;
  dropdowns: {
    options: string[];
    correctAnswer: number;
  }[];
}

export interface AudioResponseQuestion extends BaseQuestion {
  type: 'audio-response';
  audioUrl: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface ScenarioQuestion extends BaseQuestion {
  type: 'scenario';
  scenario: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface InteractiveQuestion extends BaseQuestion {
  type: 'interactive';
  simulation: string; // URL to the simulation
  successConditions: string[];
  hints: string[];
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | OrderingQuestion
  | CheckboxQuestion
  | ShortAnswerQuestion
  | HotspotQuestion
  | DropdownQuestion
  | AudioResponseQuestion
  | ScenarioQuestion
  | InteractiveQuestion;

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  quizCount: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questionCount: number;
  timeLimit: number;
  createdBy: string;
  playCount: number;
  questionTypes: QuestionType[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  quizzesTaken: number;
  winRate: number;
  achievements: string[];
}

export interface ActivePlayer {
  id: string;
  username: string;
  status: 'in-game' | 'in-lobby';
  currentQuiz: string | null;
  score: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}
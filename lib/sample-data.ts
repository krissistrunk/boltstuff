// Quiz Categories
export const categories = [
  {
    id: "science",
    name: "Science",
    description: "Test your knowledge of scientific concepts and discoveries",
    icon: "Flask",
    quizCount: 15,
  },
  {
    id: "history",
    name: "History",
    description: "Explore historical events and figures",
    icon: "Landmark",
    quizCount: 12,
  },
  {
    id: "technology",
    name: "Technology",
    description: "Questions about computers, software, and digital innovation",
    icon: "Cpu",
    quizCount: 18,
  },
  {
    id: "arts",
    name: "Arts & Culture",
    description: "From classical paintings to modern art movements",
    icon: "Palette",
    quizCount: 10,
  },
  {
    id: "literature",
    name: "Literature",
    description: "Classic novels, poetry, and literary movements",
    icon: "BookOpen",
    quizCount: 14,
  },
  {
    id: "music",
    name: "Music",
    description: "From classical composers to modern genres",
    icon: "Music",
    quizCount: 16,
  },
  {
    id: "geography",
    name: "Geography",
    description: "Countries, capitals, and world cultures",
    icon: "Globe",
    quizCount: 20,
  },
  {
    id: "sports",
    name: "Sports",
    description: "Athletes, championships, and sporting history",
    icon: "Trophy",
    quizCount: 22,
  },
  {
    id: "cinema",
    name: "Cinema & TV",
    description: "Movies, TV shows, and entertainment history",
    icon: "Film",
    quizCount: 25,
  },
  {
    id: "food",
    name: "Food & Cuisine",
    description: "World cuisines, cooking techniques, and food culture",
    icon: "Utensils",
    quizCount: 12,
  },
  {
    id: "nature",
    name: "Nature & Wildlife",
    description: "Animals, plants, and natural phenomena",
    icon: "Leaf",
    quizCount: 15,
  },
  {
    id: "mythology",
    name: "Mythology & Legends",
    description: "Ancient myths, legends, and folklore from around the world",
    icon: "Sparkles",
    quizCount: 13,
  },
];

// Rest of the file remains exactly the same
export const sampleQuizzes = [
  {
    id: "SCIENCE1",
    title: "Basic Physics",
    description: "Test your knowledge of fundamental physics concepts",
    category: "science",
    questionCount: 10,
    timeLimit: 20,
    createdBy: "PhysicsTeacher",
    playCount: 1250,
  },
  {
    id: "HIST101",
    title: "World War II",
    description: "Major events and figures of WWII",
    category: "history",
    questionCount: 15,
    timeLimit: 25,
    createdBy: "HistoryBuff",
    playCount: 980,
  },
  {
    id: "TECH202",
    title: "Web Development",
    description: "Modern web development concepts and tools",
    category: "technology",
    questionCount: 12,
    timeLimit: 15,
    createdBy: "WebDev",
    playCount: 2100,
  },
];

// Global Leaderboard
export const globalLeaderboard = [
  {
    rank: 1,
    username: "QuizMaster2024",
    score: 15250,
    quizzesTaken: 45,
    winRate: 92,
    achievements: ["Perfect Score", "Speed Demon", "Quiz Champion"],
  },
  {
    rank: 2,
    username: "BrainiacSupreme",
    score: 14800,
    quizzesTaken: 42,
    winRate: 88,
    achievements: ["Knowledge Seeker", "Quick Thinker"],
  },
  {
    rank: 3,
    username: "TriviaKing",
    score: 14200,
    quizzesTaken: 38,
    winRate: 85,
    achievements: ["Consistent Player", "Topic Master"],
  },
  {
    rank: 4,
    username: "QuizWhiz",
    score: 13900,
    quizzesTaken: 36,
    winRate: 83,
    achievements: ["Rising Star"],
  },
  {
    rank: 5,
    username: "SmartCookie",
    score: 13600,
    quizzesTaken: 35,
    winRate: 80,
    achievements: ["Quick Learner"],
  },
];

// Active Players (for multiplayer)
export const activePlayers = [
  {
    id: "player1",
    username: "QuizMaster2024",
    status: "in-game",
    currentQuiz: "SCIENCE1",
    score: 300,
  },
  {
    id: "player2",
    username: "BrainiacSupreme",
    status: "in-lobby",
    currentQuiz: null,
    score: 0,
  },
  {
    id: "player3",
    username: "TriviaKing",
    status: "in-game",
    currentQuiz: "HIST101",
    score: 250,
  },
];

// Sample Questions by Category
export const sampleQuestions = {
  science: [
    {
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Fe", "Cu"],
      correctAnswer: 0,
    },
    {
      question: "What is the speed of light in vacuum?",
      options: [
        "299,792 kilometers per second",
        "199,792 kilometers per second",
        "399,792 kilometers per second",
        "499,792 kilometers per second",
      ],
      correctAnswer: 0,
    },
  ],
  history: [
    {
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2,
    },
    {
      question: "Who was the first President of the United States?",
      options: [
        "Thomas Jefferson",
        "John Adams",
        "George Washington",
        "Benjamin Franklin",
      ],
      correctAnswer: 2,
    },
  ],
  technology: [
    {
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
        "Computer Processing Unit",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which company created JavaScript?",
      options: ["Microsoft", "Netscape", "Apple", "IBM"],
      correctAnswer: 1,
    },
  ],
};

// Achievements
export const achievements = [
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Score 100% on any quiz",
    icon: "Star",
    rarity: "Legendary",
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete a quiz in under 2 minutes",
    icon: "Zap",
    rarity: "Epic",
  },
  {
    id: "quiz-champion",
    name: "Quiz Champion",
    description: "Win 10 multiplayer quizzes",
    icon: "Trophy",
    rarity: "Rare",
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Complete quizzes in all categories",
    icon: "Book",
    rarity: "Rare",
  },
  {
    id: "quick-thinker",
    name: "Quick Thinker",
    description: "Answer 20 questions correctly in under 5 seconds each",
    icon: "Brain",
    rarity: "Epic",
  },
];
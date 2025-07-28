import mockQuestions from '@/services/mockData/interviewQuestions.json';

let questions = [...mockQuestions];
let nextId = Math.max(...questions.map(q => q.Id)) + 1;

export const interviewService = {
  // Get all questions
  getAll: () => {
    return Promise.resolve([...questions]);
  },

  // Get question by ID
  getById: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid ID format'));
    }
    
    const question = questions.find(q => q.Id === numericId);
    if (!question) {
      return Promise.reject(new Error('Question not found'));
    }
    
    return Promise.resolve({ ...question });
  },

  // Get questions by category
  getByCategory: (category) => {
    return Promise.resolve(
      questions.filter(q => q.category === category).map(q => ({ ...q }))
    );
  },

  // Get questions by industry
  getByIndustry: (industry) => {
    return Promise.resolve(
      questions.filter(q => q.industry === industry).map(q => ({ ...q }))
    );
  },

  // Get questions by difficulty
  getByDifficulty: (difficulty) => {
    return Promise.resolve(
      questions.filter(q => q.difficulty === difficulty).map(q => ({ ...q }))
    );
  },

  // Search questions
  search: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return Promise.resolve(
      questions
        .filter(q => 
          q.question.toLowerCase().includes(lowercaseQuery) ||
          q.answer.toLowerCase().includes(lowercaseQuery) ||
          q.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
          q.category.toLowerCase().includes(lowercaseQuery) ||
          q.industry.toLowerCase().includes(lowercaseQuery)
        )
        .map(q => ({ ...q }))
    );
  },

  // Create new question
  create: (questionData) => {
    const newQuestion = {
      ...questionData,
      Id: nextId++,
      tags: questionData.tags || [],
      tips: questionData.tips || ''
    };
    
    questions.push(newQuestion);
    return Promise.resolve({ ...newQuestion });
  },

  // Update question
  update: (id, questionData) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid ID format'));
    }

    const index = questions.findIndex(q => q.Id === numericId);
    if (index === -1) {
      return Promise.reject(new Error('Question not found'));
    }

    questions[index] = {
      ...questions[index],
      ...questionData,
      Id: numericId
    };

    return Promise.resolve({ ...questions[index] });
  },

  // Delete question
  delete: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid ID format'));
    }

    const index = questions.findIndex(q => q.Id === numericId);
    if (index === -1) {
      return Promise.reject(new Error('Question not found'));
    }

    const deletedQuestion = questions.splice(index, 1)[0];
    return Promise.resolve({ ...deletedQuestion });
  },

  // Get unique categories
  getCategories: () => {
    const categories = [...new Set(questions.map(q => q.category))];
    return Promise.resolve(categories.sort());
  },

  // Get unique industries
  getIndustries: () => {
    const industries = [...new Set(questions.map(q => q.industry))];
    return Promise.resolve(industries.sort());
  },

  // Get unique difficulties
  getDifficulties: () => {
    return Promise.resolve(['Easy', 'Medium', 'Hard']);
  },

  // Get practice questions (random subset)
  getPracticeQuestions: (count = 10, filters = {}) => {
    let filteredQuestions = [...questions];

    if (filters.category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === filters.category);
    }
    if (filters.industry) {
      filteredQuestions = filteredQuestions.filter(q => q.industry === filters.industry);
    }
    if (filters.difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === filters.difficulty);
    }

    // Shuffle and take requested count
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    return Promise.resolve(shuffled.slice(0, count).map(q => ({ ...q })));
  }
};

export default interviewService;
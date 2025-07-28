import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { interviewService } from '@/services/api/interviewService';
import { cn } from '@/utils/cn';

const InterviewPrep = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentView, setCurrentView] = useState('browse'); // browse, practice, question-detail
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceFilters, setPracticeFilters] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [sortBy, setSortBy] = useState('category');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Filter and search questions
  useEffect(() => {
    if (currentView === 'browse') {
      filterQuestions();
    }
  }, [searchQuery, selectedCategory, selectedIndustry, selectedDifficulty, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsData, categoriesData, industriesData] = await Promise.all([
        interviewService.getAll(),
        interviewService.getCategories(),
        interviewService.getIndustries()
      ]);
      
      setQuestions(questionsData);
      setCategories(categoriesData);
      setIndustries(industriesData);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load interview questions');
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = async () => {
    try {
      setLoading(true);
      let filteredQuestions = [];

      if (searchQuery.trim()) {
        filteredQuestions = await interviewService.search(searchQuery);
      } else {
        filteredQuestions = await interviewService.getAll();
      }

      // Apply additional filters
      if (selectedCategory) {
        filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory);
      }
      if (selectedIndustry) {
        filteredQuestions = filteredQuestions.filter(q => q.industry === selectedIndustry);
      }
      if (selectedDifficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
      }

      // Apply sorting
      filteredQuestions.sort((a, b) => {
        switch (sortBy) {
          case 'difficulty':
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          case 'category':
            return a.category.localeCompare(b.category);
          case 'industry':
            return a.industry.localeCompare(b.industry);
          default:
            return 0;
        }
      });

      setQuestions(filteredQuestions);
    } catch (err) {
      toast.error('Failed to filter questions');
    } finally {
      setLoading(false);
    }
  };

  const startPractice = async () => {
    try {
      setLoading(true);
      const practiceData = await interviewService.getPracticeQuestions(10, practiceFilters);
      setPracticeQuestions(practiceData);
      setCurrentQuestionIndex(0);
      setShowAnswer(false);
      setCurrentView('practice');
      toast.success(`Started practice session with ${practiceData.length} questions`);
    } catch (err) {
      toast.error('Failed to start practice session');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    } else {
      // Practice session complete
      toast.success('Practice session completed! Great job!');
      setCurrentView('browse');
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
    }
  };

  const viewQuestionDetail = (question) => {
    setSelectedQuestion(question);
    setCurrentView('question-detail');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedIndustry('');
    setSelectedDifficulty('');
    setSortBy('category');
    toast.info('Filters cleared');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && currentView === 'browse') return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Preparation</h1>
        <p className="text-gray-600">
          Practice with common interview questions categorized by job type and industry
        </p>
      </div>

      {/* View Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          variant={currentView === 'browse' ? 'primary' : 'secondary'}
          onClick={() => setCurrentView('browse')}
          className="flex items-center gap-2"
        >
          <ApperIcon name="BookOpen" size={16} />
          Browse Questions
        </Button>
        <Button
          variant={currentView === 'practice' ? 'primary' : 'secondary'}
          onClick={() => setCurrentView('practice')}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Play" size={16} />
          Practice Mode
        </Button>
      </div>

      {/* Browse Questions View */}
      {currentView === 'browse' && (
        <>
          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              <Select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </Select>
              <Select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Select>
              <div className="flex gap-2">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1"
                >
                  <option value="category">Sort by Category</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="industry">Sort by Industry</option>
                </Select>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="px-3"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </div>
          </Card>

          {/* Practice Setup */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Practice Session</h3>
                <p className="text-gray-600">Get a randomized set of questions for focused practice</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={practiceFilters.category || ''}
                  onChange={(e) => setPracticeFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full sm:w-auto"
                >
                  <option value="">Any Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
                <Select
                  value={practiceFilters.difficulty || ''}
                  onChange={(e) => setPracticeFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full sm:w-auto"
                >
                  <option value="">Any Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Select>
                <Button onClick={startPractice} className="flex items-center gap-2">
                  <ApperIcon name="Play" size={16} />
                  Start Practice
                </Button>
              </div>
            </div>
          </Card>

          {/* Questions List */}
          {questions.length === 0 ? (
            <Empty 
              message="No questions found" 
              description="Try adjusting your filters or search terms"
            />
          ) : (
            <div className="grid gap-4">
              {questions.map((question) => (
                <Card 
                  key={question.Id} 
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => viewQuestionDetail(question)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {question.industry}
                        </Badge>
                        <Badge className={cn('text-xs', getDifficultyColor(question.difficulty))}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                        {question.question}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {question.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {question.tags.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{question.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <ApperIcon name="Eye" size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Practice Mode View */}
      {currentView === 'practice' && (
        <>
          {practiceQuestions.length === 0 ? (
            <Card className="p-8 text-center">
              <ApperIcon name="Play" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Practice Session Active</h3>
              <p className="text-gray-600 mb-4">Start a practice session to begin answering questions</p>
              <Button onClick={() => setCurrentView('browse')}>
                Browse Questions
              </Button>
            </Card>
          ) : (
            <Card className="p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestionIndex + 1} of {practiceQuestions.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((currentQuestionIndex + 1) / practiceQuestions.length) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / practiceQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Question */}
              {practiceQuestions[currentQuestionIndex] && (
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline">
                      {practiceQuestions[currentQuestionIndex].category}
                    </Badge>
                    <Badge className={cn(getDifficultyColor(practiceQuestions[currentQuestionIndex].difficulty))}>
                      {practiceQuestions[currentQuestionIndex].difficulty}
                    </Badge>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {practiceQuestions[currentQuestionIndex].question}
                  </h2>

                  {/* Answer Section */}
                  {showAnswer ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <ApperIcon name="CheckCircle" size={16} />
                        Sample Answer
                      </h4>
                      <p className="text-green-800 mb-3">
                        {practiceQuestions[currentQuestionIndex].answer}
                      </p>
                      {practiceQuestions[currentQuestionIndex].tips && (
                        <>
                          <h5 className="font-medium text-green-900 mb-1">💡 Tips:</h5>
                          <p className="text-green-700 text-sm">
                            {practiceQuestions[currentQuestionIndex].tips}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-blue-800">
                        Take your time to think about this question. When ready, reveal the sample answer below.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2"
                      >
                        <ApperIcon name="ChevronLeft" size={16} />
                        Previous
                      </Button>
                      <Button
                        variant={showAnswer ? "outline" : "primary"}
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="flex items-center gap-2"
                      >
                        <ApperIcon name={showAnswer ? "EyeOff" : "Eye"} size={16} />
                        {showAnswer ? "Hide Answer" : "Show Answer"}
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentView('browse')}
                        className="flex items-center gap-2"
                      >
                        <ApperIcon name="X" size={16} />
                        Exit Practice
                      </Button>
                      <Button
                        onClick={nextQuestion}
                        className="flex items-center gap-2"
                      >
                        {currentQuestionIndex === practiceQuestions.length - 1 ? (
                          <>
                            <ApperIcon name="CheckCircle" size={16} />
                            Finish
                          </>
                        ) : (
                          <>
                            Next
                            <ApperIcon name="ChevronRight" size={16} />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}
        </>
      )}

      {/* Question Detail View */}
      {currentView === 'question-detail' && selectedQuestion && (
        <div>
          <Button
            variant="outline"
            onClick={() => setCurrentView('browse')}
            className="mb-6 flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Questions
          </Button>
          
          <Card className="p-8">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="outline" className="text-sm">
                {selectedQuestion.category}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {selectedQuestion.industry}
              </Badge>
              <Badge className={cn('text-sm', getDifficultyColor(selectedQuestion.difficulty))}>
                {selectedQuestion.difficulty}
              </Badge>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedQuestion.question}
            </h1>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ApperIcon name="MessageSquare" size={18} />
                Sample Answer
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-gray-800 leading-relaxed">
                  {selectedQuestion.answer}
                </p>
              </div>
              
              {selectedQuestion.tips && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ApperIcon name="Lightbulb" size={18} />
                    Interview Tips
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 leading-relaxed">
                      {selectedQuestion.tips}
                    </p>
                  </div>
                </>
              )}
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ApperIcon name="Tags" size={18} />
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedQuestion.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
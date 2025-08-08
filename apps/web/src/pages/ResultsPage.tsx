import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  RefreshCw,
  Home,
  Download,
  Share2,
  Filter,
  TrendingUp,
  TrendingDown,
  Award,
  Star,
  Brain,
  Zap,
  Users,
  Calendar,
  ChevronRight,
  Info,
  PieChart
} from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { useProgressStore } from '../store/progressStore'
import { calculateScore, formatTime } from '../lib/utils'
import toast from 'react-hot-toast'

type FilterType = 'all' | 'correct' | 'incorrect'

export function ResultsPage() {
  const navigate = useNavigate()
  const { 
    processedQuestions,
    examConfig,
    examState,
    resetExam,
    saveExamResult
  } = useExamStore()
  
  const { addAttempt, userStats, achievements } = useProgressStore()
  
  const [showDetailedResults, setShowDetailedResults] = useState(false)
  const [questionFilter, setQuestionFilter] = useState<FilterType>('all')
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => {
    if (!examConfig || !examState.isCompleted) {
      navigate('/setup')
    }
  }, [examConfig, examState.isCompleted, navigate])

  // Save exam result to history and progress store (only once when component mounts)
  useEffect(() => {
    if (examConfig && examState.isCompleted && examState.startTime) {
      const examQuestions = processedQuestions.slice(0, examConfig.numQuestions)
      const results = calculateScore(examState.answers, examQuestions)
      const timeTaken = examState.startTime && examState.endTime 
        ? Math.floor((examState.endTime.getTime() - examState.startTime.getTime()) / 1000)
        : examConfig.duration * 60

      const examResult = {
        id: Date.now().toString(),
        courseName: examConfig.courseName,
        score: results.correct,
        totalQuestions: results.total,
        percentage: results.percentage,
        timeTaken: timeTaken,
        completedAt: new Date(),
        questions: examQuestions,
        answers: examState.answers,
        difficulty: examConfig.difficulty,
        mode: 'practice'
      }
      saveExamResult(examResult)

      // Add to progress store for detailed tracking
      addAttempt({
        examTitle: examConfig.courseName,
        category: examQuestions[0]?.category || 'General',
        difficulty: examConfig.difficulty || 'medium',
        totalQuestions: results.total,
        correctAnswers: results.correct,
        score: results.percentage,
        timeSpent: timeTaken,
        answers: examQuestions.map(q => ({
          questionId: q.id,
          selectedAnswer: examState.answers[q.id] || '',
          correctAnswer: q.correctAnswer,
          isCorrect: examState.answers[q.id] === q.correctAnswer,
          timeSpent: Math.floor(timeTaken / examQuestions.length)
        })),
        metadata: {
          source: 'upload'
        }
      })
    }
  }, [examConfig, examState.isCompleted, examState.startTime, examState.endTime, examState.answers, processedQuestions, saveExamResult, addAttempt])

  if (!examConfig || !examState.isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  const examQuestions = processedQuestions.slice(0, examConfig.numQuestions)
  const results = calculateScore(examState.answers, examQuestions)
  const timeTaken = examState.startTime && examState.endTime 
    ? Math.floor((examState.endTime.getTime() - examState.startTime.getTime()) / 1000)
    : examConfig.duration * 60

  // Filter questions based on user selection
  const getFilteredQuestions = () => {
    switch (questionFilter) {
      case 'correct':
        return examQuestions.filter(q => examState.answers[q.id] === q.correctAnswer)
      case 'incorrect':
        return examQuestions.filter(q => examState.answers[q.id] !== q.correctAnswer)
      default:
        return examQuestions
    }
  }

  const filteredQuestions = getFilteredQuestions()

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
    if (percentage >= 75) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
    if (percentage >= 60) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' }
  }

  const performance = getPerformanceLevel(results.percentage)

  const handleNewExam = () => {
    resetExam()
    navigate('/setup')
  }

  const handleShareResults = () => {
    const shareText = `I scored ${results.percentage}% (${results.correct}/${results.total}) on my ManaQuiz practice test! 🎉`
    
    if (navigator.share) {
      navigator.share({
        title: 'ManaQuiz Results',
        text: shareText,
        url: window.location.origin
      }).catch(() => {
        navigator.clipboard.writeText(shareText)
        toast.success('Results copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Results copied to clipboard!')
    }
  }

  const downloadResults = () => {
    // Create Excel workbook
    const wb = XLSX.utils.book_new()
    
    // Summary sheet
    const summary = [
      ['Course Name', examConfig.courseName],
      ['Score', `${results.correct}/${results.total}`],
      ['Percentage', `${results.percentage}%`],
      ['Time Taken', formatTime(timeTaken)],
      ['Date', new Date().toLocaleDateString()],
      ['Performance Level', performance.level]
    ]
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summary)
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary')
    
    // Questions sheet
    const questionsData = [
      ['Question', 'Your Answer', 'Correct Answer', 'Result', 'Difficulty', 'Category']
    ]
    
    examQuestions.forEach((q) => {
      const userAnswer = examState.answers[q.id] || 'Not answered'
      const isCorrect = userAnswer === q.correctAnswer
      questionsData.push([
        q.question,
        userAnswer,
        q.correctAnswer,
        isCorrect ? 'Correct' : 'Incorrect',
        q.difficulty,
        q.category
      ])
    })
    
    const questionsWs = XLSX.utils.aoa_to_sheet(questionsData)
    XLSX.utils.book_append_sheet(wb, questionsWs, 'Questions')
    
    // Save file
    const courseName = examConfig.courseName.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${courseName}_Results_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    toast.success('Excel report downloaded!')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="container-responsive space-responsive">
        {/* Header */}
        <div className="text-center space-responsive">
          <div className="flex justify-center">
            <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Exam Completed!</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Here are your detailed results for {examConfig.courseName}</p>
        </div>

        {/* Score Overview */}
        <div className="card text-center space-responsive">
          <div className="space-y-3 sm:space-y-2">
            <div className="text-4xl sm:text-6xl font-bold text-primary-600">
              {results.percentage}%
            </div>
            <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-base sm:text-lg font-semibold ${performance.color} ${performance.bgColor}`}>
              {performance.level}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{results.correct}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{results.total - results.correct}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Incorrect Answers</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{results.total}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Total Questions</div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="card text-center">
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-3" />
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{formatTime(timeTaken)}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Time Taken</div>
            {examConfig.mode === 'timed' && (
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                of {examConfig.duration} minutes
              </div>
            )}
          </div>
          
          <div className="card text-center">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-3" />
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {Math.round((results.correct / timeTaken) * 60 * 100) / 100}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Questions/Min</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">Average Speed</div>
          </div>
          
          <div className="card text-center sm:col-span-2 lg:col-span-1">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-3" />
            <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{examState.marked.size}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Marked for Review</div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">Questions Flagged</div>
          </div>
        </div>

        {/* Category-wise Performance */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance by Category</h3>
          <div className="space-responsive">
            {Object.entries(
              examQuestions.reduce((acc, question) => {
                const category = question.category
                if (!acc[category]) {
                  acc[category] = { total: 0, correct: 0 }
                }
                acc[category].total++
                if (examState.answers[question.id] === question.correctAnswer) {
                  acc[category].correct++
                }
                return acc
              }, {} as Record<string, { total: number; correct: number }>)
            ).map(([category, stats]) => {
              const percentage = Math.round((stats.correct / stats.total) * 100)
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-1 gap-1 sm:gap-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {stats.correct}/{stats.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage >= 75 ? 'bg-green-500' :
                          percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Analytics</h3>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
            >
              {showAnalytics ? 'Hide' : 'Show'} Analytics
              <ChevronRight className={`h-4 w-4 transition-transform ${showAnalytics ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showAnalytics && (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-600"/>
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - results.percentage / 100)}`}
                          className="text-blue-500" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {results.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Accuracy</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-600"/>
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - Math.min(100, (60 / (timeTaken / examQuestions.length))) / 100)}`}
                          className="text-green-500" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(Math.min(100, (60 / (timeTaken / examQuestions.length))))}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Speed</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Focus</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Good</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      {userStats.totalAttempts > 1 ? (
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      ) : (
                        <Target className="h-8 w-8 text-yellow-600" />
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Progress</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {userStats.totalAttempts > 1 ? 'Improving' : 'Baseline'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Difficulty Analysis */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Difficulty Breakdown</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['easy', 'medium', 'hard'].map((difficulty) => {
                    const difficultyQuestions = examQuestions.filter(q => (q.difficulty || 'medium') === difficulty)
                    const correctCount = difficultyQuestions.filter(q => examState.answers[q.id] === q.correctAnswer).length
                    const percentage = difficultyQuestions.length > 0 ? Math.round((correctCount / difficultyQuestions.length) * 100) : 0
                    
                    return (
                      <div key={difficulty} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {percentage}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {difficulty}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {correctCount}/{difficultyQuestions.length}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {results.percentage < 60 && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-purple-500 flex-shrink-0" />
                      Focus on fundamental concepts and consider reviewing the study material
                    </div>
                  )}
                  {timeTaken / examQuestions.length > 90 && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-purple-500 flex-shrink-0" />
                      Work on time management - try to answer questions more quickly
                    </div>
                  )}
                  {results.percentage >= 80 && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 mt-0.5 text-purple-500 flex-shrink-0" />
                      Great performance! Try challenging yourself with harder questions
                    </div>
                  )}
                  <div className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <ChevronRight className="h-3 w-3 mt-0.5 text-purple-500 flex-shrink-0" />
                    Review incorrect answers to understand your mistakes
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              {achievements.some(a => a.isUnlocked) && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Recent Achievements</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {achievements.filter(a => a.isUnlocked).slice(-2).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <span className="text-xl">{achievement.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">{achievement.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detailed Results Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="btn-secondary flex items-center space-x-2 mx-auto text-sm sm:text-base min-h-[44px]"
          >
            <BarChart3 className="h-4 w-4" />
            <span>{showDetailedResults ? 'Hide' : 'Show'} Detailed Results</span>
          </button>
        </div>

        {/* Detailed Question-by-Question Results */}
        {showDetailedResults && (
          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4 lg:gap-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Question-by-Question Analysis</h3>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Show:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setQuestionFilter('all')}
                    className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-colors ${
                      questionFilter === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    All ({examQuestions.length})
                  </button>
                  <button
                    onClick={() => setQuestionFilter('correct')}
                    className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-colors ${
                      questionFilter === 'correct'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Correct ({results.correct})
                  </button>
                  <button
                    onClick={() => setQuestionFilter('incorrect')}
                    className={`px-2 sm:px-3 py-1 text-xs rounded-full transition-colors ${
                      questionFilter === 'incorrect'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Incorrect ({results.total - results.correct})
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-responsive">
              {filteredQuestions.map((question) => {
                const originalIndex = examQuestions.findIndex(q => q.id === question.id)
                const userAnswer = examState.answers[question.id]
                const isCorrect = userAnswer === question.correctAnswer
                const wasMarked = examState.marked.has(question.id)
                
                return (
                  <div key={question.id} className={`border-l-4 pl-3 sm:pl-4 ${
                    isCorrect ? 'border-green-500' : 'border-red-500'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2 sm:gap-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Q{originalIndex + 1}.</span>
                        {isCorrect ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                        )}
                        {wasMarked && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs">
                            Marked
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                          {question.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-gray-900 dark:text-white text-sm sm:text-base leading-relaxed">{question.question}</p>
                      
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1 sm:gap-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Your Answer:</span>
                          <span className={`text-xs sm:text-sm ${
                            userAnswer ? (isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {userAnswer || 'Not answered'}
                          </span>
                        </div>
                        
                        {!isCorrect && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-1 sm:gap-0">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Correct Answer:</span>
                            <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">{question.correctAnswer}</span>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <button
            onClick={handleNewExam}
            className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Take Another Exam</span>
          </button>
          
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px] px-4 py-2 rounded-lg transition-colors"
          >
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>View Dashboard</span>
          </Link>
          
          <button
            onClick={handleShareResults}
            className="btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Share Results</span>
          </button>
          
          <button
            onClick={downloadResults}
            className="btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Download Report</span>
          </button>
          
          <Link
            to="/"
            className="btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[44px]"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Motivational Message */}
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-700 text-center">
          <div className="space-y-2">
            <h4 className="font-semibold text-primary-900 dark:text-primary-200 text-sm sm:text-base">
              {results.percentage >= 75 
                ? "Excellent work! You're well prepared for your upcoming exam." 
                : results.percentage >= 60
                ? "Good effort! Keep practicing to improve your score."
                : "Don't give up! More practice will help you improve."}
            </h4>
            <p className="text-primary-700 dark:text-primary-300 text-xs sm:text-sm leading-relaxed">
              Regular practice with our question system will help you master the concepts and improve your performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

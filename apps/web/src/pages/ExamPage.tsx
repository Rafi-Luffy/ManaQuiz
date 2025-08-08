import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  FlagOff,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { formatTime } from '../lib/utils'
import toast from 'react-hot-toast'

export function ExamPage() {
  const navigate = useNavigate()
  const {
    processedQuestions,
    examConfig,
    examState,
    startExam,
    selectAnswer,
    markQuestion,
    unmarkQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitExam,
    decrementTime
  } = useExamStore()

  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')

  const currentQuestion = processedQuestions[examState.currentQuestionIndex]
  const currentAnswer = examState.answers[currentQuestion?.id] || ''
  const isCurrentMarked = currentQuestion ? examState.marked.has(currentQuestion.id) : false

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSaveAnswer = () => {
    if (currentQuestion && selectedAnswer) {
      selectAnswer(currentQuestion.id, selectedAnswer)
      toast.success('Answer saved!')
    }
  }

  const handleSaveAndNext = () => {
    if (currentQuestion && selectedAnswer) {
      selectAnswer(currentQuestion.id, selectedAnswer)
    }
    if (examState.currentQuestionIndex === totalQuestions - 1) {
      // Last question - show submit modal
      setShowSubmitModal(true)
    } else {
      nextQuestion()
    }
  }

  const handleMarkQuestion = () => {
    if (currentQuestion) {
      if (isCurrentMarked) {
        unmarkQuestion(currentQuestion.id)
        toast.success('Question unmarked')
      } else {
        markQuestion(currentQuestion.id)
        toast.success('Question marked for review')
      }
    }
  }

  const handleSubmitExam = useCallback(() => {
    // Auto-save current answer before submitting
    if (currentQuestion && selectedAnswer) {
      selectAnswer(currentQuestion.id, selectedAnswer)
    }
    submitExam()
    navigate('/results')
  }, [submitExam, navigate, currentQuestion, selectedAnswer, selectAnswer])

  // Initialize exam
  useEffect(() => {
    if (!examConfig || processedQuestions.length === 0) {
      navigate('/setup')
      return
    }

    if (!examState.isStarted) {
      startExam()
    }
  }, [examConfig, processedQuestions, examState.isStarted, startExam, navigate])

  // Timer effect
  useEffect(() => {
    if (examConfig?.mode === 'timed' && examState.isStarted && !examState.isCompleted) {
      const timer = setInterval(() => {
        decrementTime()
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [examConfig?.mode, examState.isStarted, examState.isCompleted, decrementTime])

  // Auto-submit when time runs out
  useEffect(() => {
    if (examState.timeRemaining <= 0 && examState.isStarted && !examState.isCompleted) {
      handleSubmitExam()
      toast.error('Time is up! Exam submitted automatically.')
    }
  }, [examState.timeRemaining, examState.isStarted, examState.isCompleted, handleSubmitExam])

  // Set current answer when question changes
  useEffect(() => {
    setSelectedAnswer(currentAnswer)
  }, [currentAnswer, examState.currentQuestionIndex])

  const getQuestionStatus = (questionId: string, index: number) => {
    if (index > examState.currentQuestionIndex) return 'not-visited'
    if (examState.marked.has(questionId)) {
      return examState.answers[questionId] ? 'marked-answered' : 'marked'
    }
    return examState.answers[questionId] ? 'answered' : 'not-answered'
  }

  if (!examConfig || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  const answeredCount = Object.keys(examState.answers).length
  const totalQuestions = Math.min(examConfig.numQuestions, processedQuestions.length)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 dark:bg-gray-800 text-white p-3 sm:p-4 shadow-lg">
        <div className="container-responsive flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-lg sm:text-xl font-bold truncate">{examConfig.courseName}</h1>
            <span className="text-gray-300 dark:text-gray-400 hidden sm:inline">|</span>
            <span className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">
              Q {examState.currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-xs sm:text-sm text-gray-300 dark:text-gray-400">
              Answered: {answeredCount}/{totalQuestions}
            </div>
            
            {examConfig.mode === 'timed' && (
              <div className="flex items-center space-x-2 bg-gray-800 dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-lg">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className={`font-mono text-xs sm:text-sm ${
                  examState.timeRemaining < 300 ? 'text-red-400' : 'text-white'
                }`}>
                  {formatTime(examState.timeRemaining)}
                </span>
              </div>
            )}
            
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Question Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto order-2 lg:order-1">
          <div className="max-w-4xl mx-auto space-responsive">
            {/* Question Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b dark:border-gray-700 pb-4 gap-3 sm:gap-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Question {examState.currentQuestionIndex + 1}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                  {currentQuestion.category}
                </span>
              </div>
              
              <button
                onClick={handleMarkQuestion}
                className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[44px] ${
                  isCurrentMarked 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {isCurrentMarked ? <FlagOff className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
                <span className="hidden sm:inline">{isCurrentMarked ? 'Unmark' : 'Mark for Review'}</span>
                <span className="sm:hidden">{isCurrentMarked ? 'Unmark' : 'Mark'}</span>
              </button>
            </div>

            {/* Question */}
            <div className="space-responsive">
              <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-900 dark:text-white">
                {currentQuestion.question}
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-start space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedAnswer === option
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:bg-gray-800 mt-0.5"
                    />
                    <span className="text-gray-900 dark:text-white flex-1 text-sm sm:text-base leading-relaxed">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-6 border-t dark:border-gray-700 gap-4 sm:gap-0">
              <button
                onClick={previousQuestion}
                disabled={examState.currentQuestionIndex === 0}
                className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base order-2 sm:order-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
                <button
                  onClick={handleSaveAnswer}
                  disabled={!selectedAnswer}
                  className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm sm:text-base"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Answer</span>
                </button>
                
                <button
                  onClick={handleSaveAndNext}
                  className="btn-primary flex items-center justify-center space-x-2 min-h-[44px] text-sm sm:text-base"
                >
                  <span>
                    {examState.currentQuestionIndex === totalQuestions - 1 ? 'Save & Finish' : 'Save & Next'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Question Palette */}
        <aside className="w-full lg:w-80 bg-gray-50 dark:bg-gray-800 border-t lg:border-t-0 lg:border-l dark:border-gray-700 p-4 sm:p-6 overflow-y-auto order-1 lg:order-2">
          <div className="space-responsive">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Question Palette</h3>
              
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {processedQuestions.slice(0, totalQuestions).map((question, index) => {
                  const status = getQuestionStatus(question.id, index)
                  const isCurrent = index === examState.currentQuestionIndex
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center cursor-pointer transition-all duration-200 min-h-[32px] sm:min-h-[40px] ${
                        isCurrent 
                          ? 'ring-2 ring-primary-500 ring-offset-2 transform scale-110' 
                          : ''
                      } ${
                        status === 'not-visited' 
                          ? 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        : status === 'not-answered'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                        : status === 'answered'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                        : status === 'marked'
                          ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : status === 'marked-answered'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                      title={`Question ${index + 1} - ${status.replace('-', ' ')}`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Legend:</h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Not Visited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Not Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded"></div>
                  <span className="text-gray-700 dark:text-gray-300">Marked for Review</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-700 rounded-lg p-3 sm:p-4 border dark:border-gray-600">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm sm:text-base">Progress</h4>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Answered:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{answeredCount}/{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Marked:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{examState.marked.size}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-4 sm:p-6 mx-4">
            <div className="text-center space-responsive">
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Submit Exam?</h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <p>You have answered {answeredCount} out of {totalQuestions} questions.</p>
                {answeredCount < totalQuestions && (
                  <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                    {totalQuestions - answeredCount} questions are still unanswered.
                  </p>
                )}
                <p>Once submitted, you cannot make any changes.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn-secondary flex-1 min-h-[44px] text-sm sm:text-base"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="btn-success flex-1 flex items-center justify-center space-x-2 min-h-[44px] text-sm sm:text-base"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

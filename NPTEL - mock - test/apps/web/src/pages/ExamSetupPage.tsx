import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  Settings, 
  Clock, 
  BookOpen, 
  Target, 
  Play,
  AlertCircle,
  FileText,
  Upload
} from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { getSampleQuestions } from '../lib/fileProcessor'
import toast from 'react-hot-toast'

interface ExamSetupForm {
  courseName: string
  numQuestions: number
  duration: number
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  mode: 'timed' | 'practice'
}

export function ExamSetupPage() {
  const navigate = useNavigate()
  const { 
    processedQuestions, 
    setProcessedQuestions, 
    setExamConfig, 
    uploadedFiles 
  } = useExamStore()
  
  const [showInstructions, setShowInstructions] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExamSetupForm>({
    defaultValues: {
      courseName: 'ManaQuiz Practice Test',
      numQuestions: 25,
      duration: 60,
      difficulty: 'mixed',
      mode: 'timed'
    }
  })

  const watchedMode = watch('mode')
  const watchedNumQuestions = watch('numQuestions')

  useEffect(() => {
    // load sample questions if none
    if (processedQuestions.length === 0) {
      const sampleQuestions = getSampleQuestions()
      setProcessedQuestions(sampleQuestions)
    }
  }, [processedQuestions.length, setProcessedQuestions])

  const onSubmit = (data: ExamSetupForm) => {
    if (processedQuestions.length === 0) {
      toast.error('No questions available. Please upload files or use sample questions.')
      return
    }

    if (data.numQuestions > processedQuestions.length) {
      toast.error(`Only ${processedQuestions.length} questions available. Please reduce the number of questions.`)
      return
    }

    // set config
    setExamConfig({
      courseName: data.courseName,
      numQuestions: data.numQuestions,
      duration: data.duration,
      difficulty: data.difficulty,
      mode: data.mode,
      categories: [...new Set(processedQuestions.map(q => q.category))]
    })

    if (data.mode === 'timed') {
      setShowInstructions(true)
    } else {
      startExam()
    }
  }

  const startExam = () => {
    navigate('/exam')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const availableQuestions = processedQuestions.length
  const questionsByDifficulty = {
    easy: processedQuestions.filter(q => q.difficulty === 'easy').length,
    medium: processedQuestions.filter(q => q.difficulty === 'medium').length,
    hard: processedQuestions.filter(q => q.difficulty === 'hard').length,
  }

  return (
    <>
      <div className="container-responsive max-w-7xl space-responsive">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Configure Your Quiz</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Set up your practice quiz parameters. Customize the difficulty, duration, and question 
            count to match your study goals.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid-responsive-2 gap-6 lg:gap-8">
          {/* Configuration Form */}
          <div className="space-responsive">
            <form onSubmit={handleSubmit(onSubmit)} className="space-responsive">
              {/* Course Name */}
              <div className="card">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Course Information</h3>
                  </div>
                  
                  <div>
                    <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject/Topic Name
                    </label>
                    <input
                      {...register('courseName', { required: 'Subject name is required' })}
                      type="text"
                      className="form-input"
                      placeholder="e.g., Data Structures and Algorithms"
                    />
                    {errors.courseName && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.courseName.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Exam Configuration */}
              <div className="card">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Exam Settings</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Questions
                      </label>
                      <div className="relative">
                        <select 
                          {...register('numQuestions', { valueAsNumber: true })} 
                          className="form-select hover:border-primary-400 dark:hover:border-primary-500 focus:shadow-lg"
                        >
                          <option value={10}>📝 10 Questions (15 min)</option>
                          <option value={25}>📋 25 Questions (40 min)</option>
                          <option value={50}>📊 50 Questions (80 min)</option>
                          <option value={75}>📚 75 Questions (120 min)</option>
                          {availableQuestions > 75 && (
                            <option value={100}>📖 100 Questions (160 min)</option>
                          )}
                          {availableQuestions > 100 && (
                            <option value={120}>📑 120 Questions (200 min)</option>
                          )}
                          {availableQuestions > 120 && (
                            <option value={150}>📓 150 Questions (240 min)</option>
                          )}
                        </select>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-1">
                        <span>📊</span>
                        <span>Available: <strong className="text-primary-600 dark:text-primary-400">{availableQuestions}</strong> questions</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <div className="relative">
                        <select 
                          {...register('difficulty')} 
                          className="form-select hover:border-primary-400 dark:hover:border-primary-500 focus:shadow-lg"
                        >
                          <option value="easy">🟢 Easy - Basic concepts</option>
                          <option value="medium">🟡 Medium - Applied knowledge</option>
                          <option value="hard">🔴 Hard - Advanced analysis</option>
                          <option value="mixed">⚡ Mixed (Recommended)</option>
                        </select>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        💡 Mixed difficulty provides balanced practice
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Mode */}
              <div className="card">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Test Mode</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <label className="group flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 dark:hover:from-primary-900/20 dark:hover:to-blue-900/20 cursor-pointer transition-all duration-200 hover:shadow-md">
                      <input
                        {...register('mode')}
                        type="radio"
                        value="timed"
                        className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">⏱️</span>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base group-hover:text-primary-700 dark:group-hover:text-primary-300">
                            Exam Simulation (Timed)
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">
                          Experience realistic exam conditions with time constraints and instructions
                        </div>
                      </div>
                    </label>
                    
                    <label className="group flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 cursor-pointer transition-all duration-200 hover:shadow-md">
                      <input
                        {...register('mode')}
                        type="radio"
                        value="practice"
                        className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🎯</span>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base group-hover:text-green-700 dark:group-hover:text-green-300">
                            Practice Mode (No Timer)
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">
                          Take your time to practice without any time pressure
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {watchedMode === 'timed' && (
                    <div className="mt-4">
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        {...register('duration', { 
                          valueAsNumber: true,
                          min: { value: 10, message: 'Minimum duration is 10 minutes' },
                          max: { value: 300, message: 'Maximum duration is 5 hours' }
                        })}
                        type="number"
                        min="10"
                        max="300"
                        className="form-input max-w-xs"
                      />
                      {errors.duration && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.duration.message}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Recommended: {Math.ceil(watchedNumQuestions * 1.6)} minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center space-x-2 flex-1 min-h-[48px] text-base font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Play className="h-5 w-5 flex-shrink-0" />
                  <span>
                    {watchedMode === 'timed' ? '🚀 Review Instructions & Start' : '🎯 Start Practice Test'}
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/upload')}
                  className="btn-secondary flex items-center justify-center space-x-2 sm:flex-1 min-h-[48px] hover:scale-105 transform transition-all duration-200"
                >
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">📁 Upload More Files</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Question Bank Summary */}
          <div className="space-responsive">
            <div className="card">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Question Bank</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Questions</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">{availableQuestions}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Easy</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor('easy')}`}>
                        {questionsByDifficulty.easy}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor('medium')}`}>
                        {questionsByDifficulty.medium}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hard</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor('hard')}`}>
                        {questionsByDifficulty.hard}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {uploadedFiles.length > 0 
                      ? `Generated from ${uploadedFiles.length} uploaded file(s)`
                      : 'Using sample questions for demonstration'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Quick Tips</h4>
                </div>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Start with mixed difficulty for balanced practice</li>
                  <li>• Allow ~1.5-2 minutes per question for timed tests</li>
                  <li>• Use practice mode to learn without pressure</li>
                  <li>• Review explanations after completing the test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <Clock className="h-12 w-12 text-primary-600 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Instructions</h2>
                <p className="text-gray-600 dark:text-gray-400">Please read carefully before starting</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">General Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li>This is a timed examination. Keep track of the countdown timer.</li>
                    <li>All questions are multiple choice with only one correct answer.</li>
                    <li>You can navigate between questions using the question palette.</li>
                    <li>Click "Save & Next" to save your answer and move to the next question.</li>
                    <li>You can mark questions for review and come back to them later.</li>
                    <li>Submit your exam before time runs out to ensure all answers are saved.</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Question Palette Legend:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
                      <span>Not Visited</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-red-500 rounded"></div>
                      <span>Not Answered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-500 rounded"></div>
                      <span>Marked</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Important:</strong> Once you start the exam, the timer cannot be paused. 
                      Make sure you have a stable environment and won't be interrupted.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="btn-secondary flex-1"
                >
                  Go Back
                </button>
                <button
                  onClick={startExam}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>I Understand, Start Exam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

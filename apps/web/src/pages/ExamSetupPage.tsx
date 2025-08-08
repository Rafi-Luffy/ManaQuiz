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
  Upload,
  Layers
} from 'lucide-react'
import { useExamStore, Question } from '../store/examStore'
import { getSampleQuestions } from '../lib/fileProcessor'
import { getAllCategories, getQuestionsByCategory } from '../data/sampleQuestions'
import toast from 'react-hot-toast'

interface ExamSetupForm {
  courseName: string
  numQuestions: number
  duration: number
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  mode: 'timed' | 'practice'
  category?: string
  subcategory?: string
  useSampleQuestions: boolean
}

export function ExamSetupPage() {
  console.log('🔄 ExamSetupPage: Component starting to render')
  
  const navigate = useNavigate()
  const { 
    processedQuestions = [], 
    setProcessedQuestions, 
    setExamConfig, 
    uploadedFiles = []
  } = useExamStore()
  
  const [showInstructions, setShowInstructions] = useState(false)
  const [availableCategories] = useState(getAllCategories())
  
  console.log('🔍 ExamSetupPage rendered with:', {
    processedQuestionsCount: processedQuestions.length,
    uploadedFilesCount: uploadedFiles.length,
    availableCategoriesCount: availableCategories.length
  })

  // Add safety check for empty questions
  if (processedQuestions.length === 0 && uploadedFiles.length > 0) {
    console.log('⚠️ No processed questions found, but files uploaded')
  }
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ExamSetupForm>({
    defaultValues: {
      courseName: 'ManaQuiz Practice Test',
      numQuestions: 25,
      duration: 60,
      difficulty: 'mixed',
      mode: 'timed',
      category: '',
      subcategory: '',
      useSampleQuestions: uploadedFiles.length === 0
    }
  })

  const watchedMode = watch('mode')
  const watchedNumQuestions = watch('numQuestions')
  const watchedCategory = watch('category')
  const watchedSubcategory = watch('subcategory')
  const watchedUseSampleQuestions = watch('useSampleQuestions')
  const watchedDifficulty = watch('difficulty')

  // Update questions when category or other options change
  useEffect(() => {
    if (watchedUseSampleQuestions && watchedCategory) {
      const questions = getQuestionsByCategory(
        watchedCategory,
        watchedSubcategory || undefined,
        watchedDifficulty,
        200 // Get up to 200 questions per category
      )
      setProcessedQuestions(questions)
    } else if (!watchedUseSampleQuestions && processedQuestions.length === 0) {
      // Fallback to sample questions if no uploaded files
      const sampleQuestions = getSampleQuestions()
      setProcessedQuestions(sampleQuestions)
    }
  }, [watchedUseSampleQuestions, watchedCategory, watchedSubcategory, watchedDifficulty, processedQuestions.length, setProcessedQuestions])

  useEffect(() => {
    // load sample questions if none and no uploaded files
    if (processedQuestions.length === 0 && uploadedFiles.length === 0) {
      const sampleQuestions = getSampleQuestions()
      setProcessedQuestions(sampleQuestions)
      setValue('useSampleQuestions', true)
    }
  }, [processedQuestions.length, uploadedFiles.length, setProcessedQuestions, setValue])

  const onSubmit = (data: ExamSetupForm) => {
    let questionsToUse = processedQuestions;

    // If using sample questions and specific category is selected
    if (data.useSampleQuestions && data.category) {
      questionsToUse = getQuestionsByCategory(
        data.category,
        data.subcategory || undefined,
        data.difficulty === 'mixed' ? undefined : data.difficulty,
        200 // Get up to 200 questions
      );
      
      if (questionsToUse.length === 0) {
        toast.error('No questions found for the selected category and filters.')
        return
      }
    }

    if (questionsToUse.length === 0) {
      toast.error('No questions available. Please upload files or select a category from the sample questions.')
      return
    }

    if (data.numQuestions > questionsToUse.length) {
      toast.error(`Only ${questionsToUse.length} questions available. Please reduce the number of questions.`)
      return
    }

    // Update the store with the selected questions
    setProcessedQuestions(questionsToUse);

    // set config
    setExamConfig({
      courseName: data.courseName,
      numQuestions: data.numQuestions,
      duration: data.duration,
      difficulty: data.difficulty,
      mode: data.mode,
      categories: [...new Set(questionsToUse.map((q: Question) => q.category))] as string[]
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
    easy: processedQuestions.filter((q: Question) => q.difficulty === 'easy').length,
    medium: processedQuestions.filter((q: Question) => q.difficulty === 'medium').length,
    hard: processedQuestions.filter((q: Question) => q.difficulty === 'hard').length,
  }

  console.log('📊 Questions by difficulty:', questionsByDifficulty)

  try {
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

              {/* Question Source Selection */}
              <div className="card">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Question Source</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        {...register('useSampleQuestions')}
                        type="checkbox"
                        id="useSampleQuestions"
                        className="form-checkbox"
                      />
                      <label htmlFor="useSampleQuestions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Use predefined question bank (800+ questions across multiple categories)
                      </label>
                    </div>
                    
                    {watchedUseSampleQuestions && (
                      <div className="space-y-4 pl-6 border-l-2 border-primary-200 dark:border-primary-800">
                        {/* Category Selection */}
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                          </label>
                          <select
                            {...register('category')}
                            className="form-select"
                          >
                            <option value="">Select a category</option>
                            {availableCategories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name} (200 questions)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Subcategory Selection */}
                        {watchedCategory && (
                          <div>
                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Subcategory (Optional)
                            </label>
                            <select
                              {...register('subcategory')}
                              className="form-select"
                            >
                              <option value="">All subcategories</option>
                              {availableCategories
                                .find(cat => cat.id === watchedCategory)
                                ?.subcategories.map(subcategory => (
                                  <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name} ({subcategory.questionCount} questions)
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}

                        {/* Category Info */}
                        {watchedCategory && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                  {availableCategories.find(cat => cat.id === watchedCategory)?.name}
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                  {availableCategories.find(cat => cat.id === watchedCategory)?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {uploadedFiles.length > 0 && !watchedUseSampleQuestions && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <Upload className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                              Using uploaded files ({uploadedFiles.length} files)
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                              Questions extracted from your uploaded study materials
                            </p>
                          </div>
                        </div>
                      </div>
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
                    <div>
                      <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Questions
                      </label>
                      <select {...register('numQuestions', { valueAsNumber: true })} className="form-select">
                        <option value={10}>10 Questions (15 min)</option>
                        <option value={25}>25 Questions (40 min)</option>
                        <option value={50}>50 Questions (80 min)</option>
                        <option value={75}>75 Questions (120 min)</option>
                        {availableQuestions > 75 && (
                          <option value={100}>100 Questions (160 min)</option>
                        )}
                        {availableQuestions > 100 && (
                          <option value={120}>120 Questions (200 min)</option>
                        )}
                        {availableQuestions > 120 && (
                          <option value={150}>150 Questions (240 min)</option>
                        )}
                      </select>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Available: {availableQuestions} questions
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <select {...register('difficulty')} className="form-select">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="mixed">Mixed (Recommended)</option>
                      </select>
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
                    <label className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <input
                        {...register('mode')}
                        type="radio"
                        value="timed"
                        className="w-4 h-4 mt-1 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:bg-gray-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Exam Simulation (Timed)</div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Experience realistic exam conditions with time constraints and instructions
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                      <input
                        {...register('mode')}
                        type="radio"
                        value="practice"
                        className="w-4 h-4 mt-1 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:bg-gray-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Practice Mode (No Timer)</div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
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
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center space-x-2 flex-1 min-h-[44px]"
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">
                    {watchedMode === 'timed' ? 'Review Instructions & Start' : 'Start Practice Test'}
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/upload')}
                  className="btn-secondary flex items-center justify-center space-x-2 sm:flex-1 min-h-[44px]"
                >
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Upload More Files</span>
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
  } catch (error) {
    console.error('🚨 ExamSetupPage Error:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Setup Page Error</h1>
          <p className="text-gray-600 mb-4">
            There was an error loading the exam setup page. Please try again.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Back to Upload
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}

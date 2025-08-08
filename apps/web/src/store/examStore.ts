import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  explanation?: string
}

export interface ExamConfig {
  courseName: string
  numQuestions: number
  duration: number // mins
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  mode: 'timed' | 'practice'
  categories: string[]
}

export interface ExamState {
  currentQuestionIndex: number
  answers: Record<string, string>
  marked: Set<string>
  timeRemaining: number
  isStarted: boolean
  isCompleted: boolean
  startTime?: Date
  endTime?: Date
}

export interface ExamResult {
  id: string
  courseName: string
  score: number
  totalQuestions: number
  percentage: number
  timeTaken: number // secs
  completedAt: Date
  questions: Question[]
  answers: Record<string, string>
  difficulty: string
  mode: string
}

interface ExamStore {
  // File Processing
  uploadedFiles: File[]
  processedQuestions: Question[]
  isProcessing: boolean

  // Exam Configuration
  examConfig: ExamConfig | null
  examState: ExamState
  
  // Results History
  examResults: ExamResult[]

  // Actions
  setUploadedFiles: (files: File[]) => void
  setProcessedQuestions: (questions: Question[]) => void
  setIsProcessing: (processing: boolean) => void
  setExamConfig: (config: ExamConfig) => void
  
  // Exam actions
  startExam: () => void
  answerQuestion: (questionId: string, answer: string) => void
  selectAnswer: (questionId: string, answer: string) => void
  markQuestion: (questionId: string) => void
  unmarkQuestion: (questionId: string) => void
  nextQuestion: () => void
  previousQuestion: () => void
  goToQuestion: (index: number) => void
  submitExam: () => void
  resetExam: () => void
  decrementTime: () => void
  setTimeRemaining: (time: number) => void
  
  // Results Actions
  saveExamResult: (result: ExamResult) => void
  clearExamResults: () => void
}

const initialExamState: ExamState = {
  currentQuestionIndex: 0,
  answers: {},
  marked: new Set(),
  timeRemaining: 0,
  isStarted: false,
  isCompleted: false,
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set, _get) => ({
      // Initial State
      uploadedFiles: [],
      processedQuestions: [],
      isProcessing: false,
      examConfig: null,
      examState: initialExamState,
      examResults: [],
      
      // File Processing Actions
      setUploadedFiles: (files) => set({ uploadedFiles: files }),
      setProcessedQuestions: (questions) => set({ processedQuestions: questions }),
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      setExamConfig: (config) => set({ examConfig: config }),
      
      // Exam Actions
      startExam: () => set((state) => {
        let filteredQuestions = state.processedQuestions;
        
        // Filter questions by difficulty if specific difficulty is selected
        if (state.examConfig && state.examConfig.difficulty && state.examConfig.difficulty !== 'mixed') {
          filteredQuestions = state.processedQuestions.filter(
            (q: Question) => q.difficulty === state.examConfig!.difficulty
          );
        }
        
        // Shuffle questions for randomness
        const shuffledQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
        
        // Take only the required number of questions
        const examQuestions = shuffledQuestions.slice(0, state.examConfig?.numQuestions || filteredQuestions.length);
        
        return {
          examState: {
            ...state.examState,
            isStarted: true,
            startTime: new Date(),
            timeRemaining: state.examConfig ? state.examConfig.duration * 60 : 3600,
          },
          // Update processedQuestions to contain only the selected exam questions
          processedQuestions: examQuestions
        };
      }),
      
      answerQuestion: (questionId: string, answer: string) => set((state) => ({
        examState: {
          ...state.examState,
          answers: { ...state.examState.answers, [questionId]: answer }
        }
      })),

      selectAnswer: (questionId: string, answer: string) => set((state) => ({
        examState: {
          ...state.examState,
          answers: { ...state.examState.answers, [questionId]: answer }
        }
      })),
      
      markQuestion: (questionId) => set((state) => ({
        examState: {
          ...state.examState,
          marked: new Set([...state.examState.marked, questionId])
        }
      })),
      
      unmarkQuestion: (questionId) => set((state) => {
        const newMarked = new Set(state.examState.marked)
        newMarked.delete(questionId)
        return {
          examState: {
            ...state.examState,
            marked: newMarked
          }
        }
      }),
      
      nextQuestion: () => set((state) => ({
        examState: {
          ...state.examState,
          currentQuestionIndex: Math.min(
            state.examState.currentQuestionIndex + 1,
            state.processedQuestions.length - 1
          )
        }
      })),
      
      previousQuestion: () => set((state) => ({
        examState: {
          ...state.examState,
          currentQuestionIndex: Math.max(state.examState.currentQuestionIndex - 1, 0)
        }
      })),
      
      goToQuestion: (index) => set((state) => ({
        examState: {
          ...state.examState,
          currentQuestionIndex: Math.max(0, Math.min(index, state.processedQuestions.length - 1))
        }
      })),
      
      completeExam: () => set((state) => {
        const examState = {
          ...state.examState,
          isCompleted: true,
          endTime: new Date()
        }
        
        // Calculate result and save to progress store
        const correctAnswers = Object.entries(examState.answers).filter(([questionId, answer]) => {
          const question = state.processedQuestions.find(q => q.id === questionId)
          return question && question.correctAnswer === answer
        }).length
        
        const score = Math.round((correctAnswers / state.processedQuestions.length) * 100)
        const timeTaken = examState.endTime && examState.startTime 
          ? Math.floor((examState.endTime.getTime() - examState.startTime.getTime()) / 1000)
          : 0
        
        // Create exam result
        const result: ExamResult = {
          id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          courseName: state.examConfig?.courseName || 'Quiz',
          score,
          totalQuestions: state.processedQuestions.length,
          percentage: score,
          timeTaken,
          completedAt: new Date(),
          questions: state.processedQuestions,
          answers: examState.answers,
          difficulty: state.examConfig?.difficulty || 'mixed',
          mode: state.examConfig?.mode || 'practice'
        }
        
        // Save to exam results
        const newExamResults = [...state.examResults, result]
        
        return {
          examState,
          examResults: newExamResults
        }
      }),
      
      resetExam: () => set({ examState: initialExamState }),

      submitExam: () => set((state) => {
        const examState = {
          ...state.examState,
          isCompleted: true,
          endTime: new Date()
        }
        
        // Calculate result and save
        const correctAnswers = Object.entries(examState.answers).filter(([questionId, answer]) => {
          const question = state.processedQuestions.find(q => q.id === questionId)
          return question && question.correctAnswer === answer
        }).length
        
        const score = Math.round((correctAnswers / state.processedQuestions.length) * 100)
        const timeTaken = examState.endTime && examState.startTime 
          ? Math.floor((examState.endTime.getTime() - examState.startTime.getTime()) / 1000)
          : 0
        
        // Create exam result
        const result: ExamResult = {
          id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          courseName: state.examConfig?.courseName || 'Quiz',
          score,
          totalQuestions: state.processedQuestions.length,
          percentage: score,
          timeTaken,
          completedAt: new Date(),
          questions: state.processedQuestions,
          answers: examState.answers,
          difficulty: state.examConfig?.difficulty || 'mixed',
          mode: state.examConfig?.mode || 'practice'
        }
        
        // Save to exam results
        const newExamResults = [...state.examResults, result]
        
        return {
          examState,
          examResults: newExamResults
        }
      }),

      // Results Actions
      saveExamResult: (result: ExamResult) => set((state) => ({
        examResults: [...state.examResults, result]
      })),

      clearExamResults: () => set({ examResults: [] }),
      
      // Timer Actions
      setTimeRemaining: (time) => set((state) => ({
        examState: { ...state.examState, timeRemaining: time }
      })),
      
      decrementTime: () => set((state) => {
        const newTime = state.examState.timeRemaining - 1
        if (newTime <= 0) {
          return {
            examState: {
              ...state.examState,
              timeRemaining: 0,
              isCompleted: true,
              endTime: new Date()
            }
          }
        }
        return {
          examState: { ...state.examState, timeRemaining: newTime }
        }
      }),
    }),
    {
      name: 'nptel-exam-store',
      partialize: (state) => ({
        examConfig: state.examConfig,
        processedQuestions: state.processedQuestions,
        examResults: state.examResults,
      }),
    }
  )
)

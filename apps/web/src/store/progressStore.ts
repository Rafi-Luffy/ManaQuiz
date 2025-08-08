import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuizAttempt {
  id: string
  examTitle: string
  category: string
  subcategory?: string
  difficulty: string
  totalQuestions: number
  correctAnswers: number
  score: number
  timeSpent: number
  completedAt: Date
  answers: Array<{
    questionId: string
    selectedAnswer: string
    correctAnswer: string
    isCorrect: boolean
    timeSpent: number
  }>
  metadata: {
    source: 'upload' | 'sample'
    fileName?: string
    fileSize?: number
  }
}

export interface StudyStreak {
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date | null
  totalStudyDays: number
}

export interface CategoryProgress {
  categoryId: string
  categoryName: string
  totalAttempts: number
  averageScore: number
  bestScore: number
  timeSpent: number
  strongTopics: string[]
  weakTopics: string[]
  lastAttempt: Date | null
  difficultyProgress: {
    easy: { attempts: number; averageScore: number }
    medium: { attempts: number; averageScore: number }
    hard: { attempts: number; averageScore: number }
  }
}

export interface LearningGoal {
  id: string
  title: string
  description: string
  targetCategory: string
  targetScore: number
  targetAttempts: number
  deadline: Date
  isCompleted: boolean
  createdAt: Date
  progress: {
    currentScore: number
    currentAttempts: number
    progressPercentage: number
  }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: 'score' | 'streak' | 'category' | 'time' | 'attempts'
  requirement: number
  unlockedAt: Date | null
  isUnlocked: boolean
}

export interface UserStats {
  totalAttempts: number
  totalQuestionsAnswered: number
  totalTimeSpent: number
  averageScore: number
  bestScore: number
  favoriteCategory: string
  studyStreak: StudyStreak
  weeklyActivity: Array<{
    date: string
    attempts: number
    score: number
    timeSpent: number
  }>
  monthlyProgress: Array<{
    month: string
    attempts: number
    averageScore: number
    improvement: number
  }>
}

interface ProgressState {
  // Data
  attempts: QuizAttempt[]
  categoryProgress: CategoryProgress[]
  learningGoals: LearningGoal[]
  achievements: Achievement[]
  userStats: UserStats
  
  // UI State
  selectedTimeRange: 'week' | 'month' | 'year' | 'all'
  selectedCategory: string | null
  showAchievements: boolean
  
  // Actions
  addAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void
  updateCategoryProgress: (categoryId: string) => void
  addLearningGoal: (goal: Omit<LearningGoal, 'id' | 'createdAt' | 'progress'>) => void
  updateLearningGoalProgress: (goalId: string) => void
  unlockAchievement: (achievementId: string) => void
  updateStudyStreak: () => void
  getProgressData: (timeRange: string, category?: string) => {
    attempts: QuizAttempt[]
    averageScore: number
    totalTime: number
    categories: Array<{ name: string; attempts: number; avgScore: number }>
  }
  getWeakAreas: () => string[]
  getRecommendations: () => string[]
  exportProgress: () => string
  importProgress: (data: string) => void
  resetProgress: () => void
  
  // Setters
  setSelectedTimeRange: (range: 'week' | 'month' | 'year' | 'all') => void
  setSelectedCategory: (category: string | null) => void
  setShowAchievements: (show: boolean) => void
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-quiz',
    title: 'Getting Started',
    description: 'Complete your first quiz',
    icon: '🎯',
    type: 'attempts',
    requirement: 1,
    unlockedAt: null,
    isUnlocked: false
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Score 100% on any quiz',
    icon: '💯',
    type: 'score',
    requirement: 100,
    unlockedAt: null,
    isUnlocked: false
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    type: 'streak',
    requirement: 7,
    unlockedAt: null,
    isUnlocked: false
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 5 minutes',
    icon: '⚡',
    type: 'time',
    requirement: 300, // 5 minutes in seconds
    unlockedAt: null,
    isUnlocked: false
  },
  {
    id: 'category-master',
    title: 'Category Master',
    description: 'Complete 10 quizzes in the same category',
    icon: '👑',
    type: 'category',
    requirement: 10,
    unlockedAt: null,
    isUnlocked: false
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Complete 100 quizzes',
    icon: '🏆',
    type: 'attempts',
    requirement: 100,
    unlockedAt: null,
    isUnlocked: false
  }
]

const defaultUserStats: UserStats = {
  totalAttempts: 0,
  totalQuestionsAnswered: 0,
  totalTimeSpent: 0,
  averageScore: 0,
  bestScore: 0,
  favoriteCategory: '',
  studyStreak: {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalStudyDays: 0
  },
  weeklyActivity: [],
  monthlyProgress: []
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      attempts: [],
      categoryProgress: [],
      learningGoals: [],
      achievements: defaultAchievements,
      userStats: defaultUserStats,
      selectedTimeRange: 'week',
      selectedCategory: null,
      showAchievements: false,

      // Add new attempt and update all related stats
      addAttempt: (attemptData) => {
        const newAttempt: QuizAttempt = {
          ...attemptData,
          id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          completedAt: new Date()
        }

        set((state) => {
          const updatedAttempts = [...state.attempts, newAttempt]
          
          // Update user stats
          const updatedStats = {
            ...state.userStats,
            totalAttempts: updatedAttempts.length,
            totalQuestionsAnswered: state.userStats.totalQuestionsAnswered + newAttempt.totalQuestions,
            totalTimeSpent: state.userStats.totalTimeSpent + newAttempt.timeSpent,
            averageScore: updatedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / updatedAttempts.length,
            bestScore: Math.max(state.userStats.bestScore, newAttempt.score)
          }

          return {
            ...state,
            attempts: updatedAttempts,
            userStats: updatedStats
          }
        })

        // Update category progress
        get().updateCategoryProgress(attemptData.category)
        
        // Update study streak
        get().updateStudyStreak()
        
        // Check achievements
        setTimeout(() => {
          get().unlockAchievement('first_quiz')
        }, 100)
      },

      updateCategoryProgress: (categoryId) => {
        set((state) => {
          const categoryAttempts = state.attempts.filter(a => a.category === categoryId)
          if (categoryAttempts.length === 0) return state

          const existingIndex = state.categoryProgress.findIndex(cp => cp.categoryId === categoryId)
          const categoryName = categoryAttempts[0].category

          const newProgress: CategoryProgress = {
            categoryId,
            categoryName,
            totalAttempts: categoryAttempts.length,
            averageScore: categoryAttempts.reduce((sum, a) => sum + a.score, 0) / categoryAttempts.length,
            bestScore: Math.max(...categoryAttempts.map(a => a.score)),
            timeSpent: categoryAttempts.reduce((sum, a) => sum + a.timeSpent, 0),
            strongTopics: [], // Will be calculated based on high-scoring topics
            weakTopics: [], // Will be calculated based on low-scoring topics
            lastAttempt: new Date(Math.max(...categoryAttempts.map(a => a.completedAt.getTime()))),
            difficultyProgress: {
              easy: {
                attempts: categoryAttempts.filter(a => a.difficulty === 'easy').length,
                averageScore: categoryAttempts.filter(a => a.difficulty === 'easy').reduce((sum, a) => sum + a.score, 0) / categoryAttempts.filter(a => a.difficulty === 'easy').length || 0
              },
              medium: {
                attempts: categoryAttempts.filter(a => a.difficulty === 'medium').length,
                averageScore: categoryAttempts.filter(a => a.difficulty === 'medium').reduce((sum, a) => sum + a.score, 0) / categoryAttempts.filter(a => a.difficulty === 'medium').length || 0
              },
              hard: {
                attempts: categoryAttempts.filter(a => a.difficulty === 'hard').length,
                averageScore: categoryAttempts.filter(a => a.difficulty === 'hard').reduce((sum, a) => sum + a.score, 0) / categoryAttempts.filter(a => a.difficulty === 'hard').length || 0
              }
            }
          }

          const updatedProgress = [...state.categoryProgress]
          if (existingIndex >= 0) {
            updatedProgress[existingIndex] = newProgress
          } else {
            updatedProgress.push(newProgress)
          }

          return {
            ...state,
            categoryProgress: updatedProgress
          }
        })
      },

      updateStudyStreak: () => {
        set((state) => {
          const today = new Date()
          const todayString = today.toDateString()
          const lastStudyDate = state.userStats.studyStreak.lastStudyDate
          
          let newStreak = state.userStats.studyStreak.currentStreak
          let totalStudyDays = state.userStats.studyStreak.totalStudyDays

          if (!lastStudyDate || lastStudyDate.toDateString() !== todayString) {
            // First study of the day
            totalStudyDays++
            
            if (lastStudyDate) {
              const daysDiff = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24))
              if (daysDiff === 1) {
                // Consecutive day
                newStreak++
              } else if (daysDiff > 1) {
                // Streak broken
                newStreak = 1
              }
            } else {
              newStreak = 1
            }
          }

          return {
            ...state,
            userStats: {
              ...state.userStats,
              studyStreak: {
                currentStreak: newStreak,
                longestStreak: Math.max(state.userStats.studyStreak.longestStreak, newStreak),
                lastStudyDate: today,
                totalStudyDays
              }
            }
          }
        })
      },

      addLearningGoal: (goalData) => {
        const newGoal: LearningGoal = {
          ...goalData,
          id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          isCompleted: false,
          progress: {
            currentScore: 0,
            currentAttempts: 0,
            progressPercentage: 0
          }
        }

        set((state) => ({
          ...state,
          learningGoals: [...state.learningGoals, newGoal]
        }))
      },

      updateLearningGoalProgress: (goalId) => {
        set((state) => {
          const updatedGoals = state.learningGoals.map(goal => {
            if (goal.id === goalId) {
              const categoryAttempts = state.attempts.filter(a => a.category === goal.targetCategory)
              const currentScore = categoryAttempts.length > 0 
                ? categoryAttempts.reduce((sum, a) => sum + a.score, 0) / categoryAttempts.length 
                : 0
              const currentAttempts = categoryAttempts.length
              
              const scoreProgress = (currentScore / goal.targetScore) * 100
              const attemptsProgress = (currentAttempts / goal.targetAttempts) * 100
              const progressPercentage = Math.min((scoreProgress + attemptsProgress) / 2, 100)
              
              return {
                ...goal,
                progress: {
                  currentScore,
                  currentAttempts,
                  progressPercentage
                },
                isCompleted: currentScore >= goal.targetScore && currentAttempts >= goal.targetAttempts
              }
            }
            return goal
          })

          return {
            ...state,
            learningGoals: updatedGoals
          }
        })
      },

      checkAndUnlockAchievements: (newAttempt: QuizAttempt) => {
        set((state) => {
          const updatedAchievements = state.achievements.map(achievement => {
            if (achievement.isUnlocked) return achievement

            let shouldUnlock = false

            switch (achievement.type) {
              case 'attempts':
                shouldUnlock = state.userStats.totalAttempts >= achievement.requirement
                break
              case 'score':
                shouldUnlock = newAttempt.score >= achievement.requirement
                break
              case 'streak':
                shouldUnlock = state.userStats.studyStreak.currentStreak >= achievement.requirement
                break
              case 'time':
                shouldUnlock = newAttempt.timeSpent <= achievement.requirement
                break
              case 'category': {
                const categoryAttempts = state.attempts.filter(a => a.category === newAttempt.category).length
                shouldUnlock = categoryAttempts >= achievement.requirement
                break
              }
            }

            if (shouldUnlock) {
              return {
                ...achievement,
                isUnlocked: true,
                unlockedAt: new Date()
              }
            }

            return achievement
          })

          return {
            ...state,
            achievements: updatedAchievements
          }
        })
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          ...state,
          achievements: state.achievements.map(a => 
            a.id === achievementId 
              ? { ...a, isUnlocked: true, unlockedAt: new Date() }
              : a
          )
        }))
      },

      getProgressData: (timeRange, category) => {
        const state = get()
        let filteredAttempts = state.attempts

        // Filter by time range
        const now = new Date()
        switch (timeRange) {
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            filteredAttempts = filteredAttempts.filter(a => a.completedAt >= weekAgo)
            break
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            filteredAttempts = filteredAttempts.filter(a => a.completedAt >= monthAgo)
            break
          }
          case 'year': {
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            filteredAttempts = filteredAttempts.filter(a => a.completedAt >= yearAgo)
            break
          }
        }

        // Filter by category
        if (category) {
          filteredAttempts = filteredAttempts.filter(a => a.category === category)
        }

        return {
          attempts: filteredAttempts,
          averageScore: filteredAttempts.reduce((sum, a) => sum + a.score, 0) / filteredAttempts.length || 0,
          totalTime: filteredAttempts.reduce((sum, a) => sum + a.timeSpent, 0),
          categories: Array.from(new Set(filteredAttempts.map(a => a.category))).map(cat => {
            const catAttempts = filteredAttempts.filter(a => a.category === cat)
            return {
              name: cat,
              attempts: catAttempts.length,
              avgScore: catAttempts.reduce((sum, a) => sum + a.score, 0) / catAttempts.length || 0
            }
          })
        }
      },

      getWeakAreas: () => {
        const state = get()
        const categoryAverages = state.categoryProgress.map(cp => ({
          category: cp.categoryName,
          averageScore: cp.averageScore
        }))
        
        return categoryAverages
          .filter(ca => ca.averageScore < 70)
          .sort((a, b) => a.averageScore - b.averageScore)
          .map(ca => ca.category)
      },

      getRecommendations: () => {
        const state = get()
        const recommendations: string[] = []
        
        const weakAreas = get().getWeakAreas()
        if (weakAreas.length > 0) {
          recommendations.push(`Focus on ${weakAreas[0]} - your average score is below 70%`)
        }
        
        if (state.userStats.studyStreak.currentStreak === 0) {
          recommendations.push("Start a study streak! Daily practice improves retention.")
        }
        
        const recentAttempts = state.attempts.slice(-5)
        if (recentAttempts.length >= 3) {
          const avgRecentScore = recentAttempts.reduce((sum, a) => sum + a.score, 0) / recentAttempts.length
          if (avgRecentScore > 80) {
            recommendations.push("Great progress! Try increasing difficulty level for more challenge.")
          }
        }
        
        return recommendations
      },

      exportProgress: () => {
        const state = get()
        return JSON.stringify({
          attempts: state.attempts,
          categoryProgress: state.categoryProgress,
          learningGoals: state.learningGoals,
          achievements: state.achievements,
          userStats: state.userStats,
          exportedAt: new Date()
        }, null, 2)
      },

      importProgress: (data) => {
        try {
          const parsed = JSON.parse(data)
          set((state) => ({
            ...state,
            attempts: parsed.attempts || [],
            categoryProgress: parsed.categoryProgress || [],
            learningGoals: parsed.learningGoals || [],
            achievements: parsed.achievements || state.achievements,
            userStats: parsed.userStats || defaultUserStats
          }))
        } catch (error) {
          console.error('Failed to import progress data:', error)
        }
      },

      resetProgress: () => {
        set({
          attempts: [],
          categoryProgress: [],
          learningGoals: [],
          achievements: defaultAchievements,
          userStats: defaultUserStats,
          selectedTimeRange: 'week',
          selectedCategory: null,
          showAchievements: false
        })
      },

      // Setters
      setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setShowAchievements: (show) => set({ showAchievements: show })
    }),
    {
      name: 'progress-storage',
      version: 1
    }
  )
)

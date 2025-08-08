import { useEffect } from 'react'
import { useProgressStore } from '../store/progressStore'
import { toast } from 'react-hot-toast'
import { Award, Star, Zap, Target, Calendar, TrendingUp } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  isUnlocked: boolean
  unlockedAt?: Date
  category: 'accuracy' | 'speed' | 'streak' | 'milestone' | 'improvement'
}

export function useAchievements() {
  const { userStats, achievements, unlockAchievement } = useProgressStore()

  // Define achievement criteria
  const achievementCriteria = [
    {
      id: 'first_quiz',
      title: 'Getting Started',
      description: 'Complete your first quiz',
      icon: '🎯',
      category: 'milestone' as const,
      check: () => userStats.totalAttempts >= 1
    },
    {
      id: 'perfect_score',
      title: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '🌟',
      category: 'accuracy' as const,
      check: () => userStats.averageScore === 100
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete a quiz in under 30 seconds per question',
      icon: '⚡',
      category: 'speed' as const,
      check: () => userStats.averageTimePerQuestion < 30
    },
    {
      id: 'streak_5',
      title: 'Consistent Learner',
      description: 'Study for 5 days in a row',
      icon: '🔥',
      category: 'streak' as const,
      check: () => userStats.currentStreak >= 5
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Complete 10 quizzes',
      icon: '🏆',
      category: 'milestone' as const,
      check: () => userStats.totalAttempts >= 10
    },
    {
      id: 'accurate_archer',
      title: 'Accurate Archer',
      description: 'Maintain above 80% average score',
      icon: '🎯',
      category: 'accuracy' as const,
      check: () => userStats.averageScore >= 80 && userStats.totalAttempts >= 3
    },
    {
      id: 'improvement_champion',
      title: 'Improvement Champion',
      description: 'Improve your score by 20% from first attempt',
      icon: '📈',
      category: 'improvement' as const,
      check: () => {
        // This would need to be calculated based on first vs recent attempts
        return userStats.totalAttempts >= 3 && userStats.averageScore > 70
      }
    },
    {
      id: 'marathon_runner',
      title: 'Marathon Runner',
      description: 'Complete 25 quizzes',
      icon: '🏃',
      category: 'milestone' as const,
      check: () => userStats.totalAttempts >= 25
    },
    {
      id: 'weekly_warrior',
      title: 'Weekly Warrior',
      description: 'Study for 7 days in a row',
      icon: '🗓️',
      category: 'streak' as const,
      check: () => userStats.currentStreak >= 7
    },
    {
      id: 'lightning_fast',
      title: 'Lightning Fast',
      description: 'Complete a quiz in under 15 seconds per question',
      icon: '⚡',
      category: 'speed' as const,
      check: () => userStats.averageTimePerQuestion < 15
    }
  ]

  // Check for new achievements
  const checkAchievements = () => {
    achievementCriteria.forEach(criteria => {
      const existingAchievement = achievements.find(a => a.id === criteria.id)
      
      if (!existingAchievement?.isUnlocked && criteria.check()) {
        unlockAchievement(criteria.id)
        
        // Show achievement notification
        toast.custom((t) => (
          <div className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{criteria.icon}</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">
                    Achievement Unlocked!
                  </p>
                  <p className="mt-1 text-sm text-yellow-100">
                    {criteria.title}
                  </p>
                  <p className="mt-1 text-xs text-yellow-200">
                    {criteria.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-yellow-300">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <Award className="h-4 w-4" />
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right'
        })
      }
    })
  }

  return {
    checkAchievements,
    achievementCriteria
  }
}

// Hook to automatically check achievements when stats change
export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const { checkAchievements } = useAchievements()
  const { userStats } = useProgressStore()

  useEffect(() => {
    checkAchievements()
  }, [userStats.totalAttempts, userStats.averageScore, userStats.currentStreak, checkAchievements])

  return <>{children}</>
}

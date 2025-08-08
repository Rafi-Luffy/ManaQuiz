import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Brain,
  Zap,
  Download,
  Upload,
  RotateCcw,
  Star,
  Flame,
  Plus
} from 'lucide-react'
import { useProgressStore } from '../store/progressStore'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color: string
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
)

interface ProgressBarProps {
  label: string
  value: number
  max: number
  color: string
}

const ProgressBar = ({ label, value, max, color }: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white font-medium">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const {
    userStats,
    attempts,
    categoryProgress,
    learningGoals,
    achievements,
    selectedTimeRange,
    setSelectedTimeRange,
    getProgressData,
    getWeakAreas,
    getRecommendations,
    exportProgress,
    importProgress,
    resetProgress
  } = useProgressStore()

  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState('')

  const progressData = getProgressData(selectedTimeRange)
  const weakAreas = getWeakAreas()
  const recommendations = getRecommendations()
  const unlockedAchievements = achievements.filter(a => a.isUnlocked)
  const recentAttempts = attempts.slice(-5).reverse()

  const handleExport = () => {
    const data = exportProgress()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-progress-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    try {
      importProgress(importData)
      setShowImportDialog(false)
      setImportData('')
    } catch (error) {
      alert('Invalid progress data format')
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your learning progress and achievements
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'year' | 'all')}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={() => navigate('/setup')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Quizzes"
            value={userStats.totalAttempts}
            change={progressData.attempts.length > 0 ? `+${progressData.attempts.length} this ${selectedTimeRange}` : undefined}
            icon={<BookOpen className="h-6 w-6 text-white" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Average Score"
            value={`${Math.round(userStats.averageScore)}%`}
            change={progressData.averageScore > userStats.averageScore ? `+${Math.round(progressData.averageScore - userStats.averageScore)}%` : undefined}
            icon={<Target className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Study Streak"
            value={`${userStats.studyStreak.currentStreak} days`}
            icon={<Flame className="h-6 w-6 text-white" />}
            color="bg-orange-500"
          />
          <StatCard
            title="Time Spent"
            value={formatTime(userStats.totalTimeSpent)}
            change={progressData.totalTime > 0 ? `+${formatTime(progressData.totalTime)} this ${selectedTimeRange}` : undefined}
            icon={<Clock className="h-6 w-6 text-white" />}
            color="bg-purple-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              
              {progressData.attempts.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Score progression chart would go here</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Last quiz: {Math.round(progressData.attempts[progressData.attempts.length - 1]?.score || 0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No quiz data yet</p>
                    <button
                      onClick={() => navigate('/setup')}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Take Your First Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Category Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Category Progress</h2>
              
              {categoryProgress.length > 0 ? (
                <div className="space-y-6">
                  {categoryProgress.map((category) => (
                    <div key={category.categoryId} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">{category.categoryName}</h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {category.totalAttempts} attempts
                        </span>
                      </div>
                      
                      <ProgressBar
                        label="Average Score"
                        value={Math.round(category.averageScore)}
                        max={100}
                        color="bg-blue-500"
                      />
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400">Easy</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {Math.round(category.difficultyProgress.easy.averageScore) || 0}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400">Medium</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {Math.round(category.difficultyProgress.medium.averageScore) || 0}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 dark:text-gray-400">Hard</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {Math.round(category.difficultyProgress.hard.averageScore) || 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No category data yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Complete quizzes to see your progress in different categories
                  </p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              
              {recentAttempts.length > 0 ? (
                <div className="space-y-4">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          attempt.score >= 80 ? 'bg-green-100 text-green-600' :
                          attempt.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attempt.examTitle}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {attempt.category} • {attempt.difficulty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {Math.round(attempt.score)}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime(attempt.timeSpent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Achievements</h2>
              
              {unlockedAchievements.length > 0 ? (
                <div className="space-y-4">
                  {unlockedAchievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{achievement.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  {unlockedAchievements.length > 3 && (
                    <button className="w-full text-center text-blue-600 dark:text-blue-400 text-sm hover:underline">
                      View all {unlockedAchievements.length} achievements
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No achievements yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Complete quizzes to unlock achievements
                  </p>
                </div>
              )}
            </div>

            {/* Learning Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Goals</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Add Goal
                </button>
              </div>
              
              {learningGoals.length > 0 ? (
                <div className="space-y-4">
                  {learningGoals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">{goal.title}</p>
                        {goal.isCompleted && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <ProgressBar
                        label="Progress"
                        value={Math.round(goal.progress.progressPercentage)}
                        max={100}
                        color="bg-green-500"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No learning goals set</p>
                  <button className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    Set your first goal
                  </button>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recommendations</h2>
              
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No recommendations yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Complete more quizzes to get personalized suggestions
                  </p>
                </div>
              )}
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Data Management</h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Progress</span>
                </button>
                
                <button
                  onClick={() => setShowImportDialog(true)}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Import Progress</span>
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                      resetProgress()
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Progress</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Import Progress Data</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your exported progress data here..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowImportDialog(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

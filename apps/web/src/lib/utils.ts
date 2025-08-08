import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Question } from '../store/examStore'

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function calculateScore(answers: Record<string, string>, questions: Question[]): {
  score: number
  percentage: number
  correct: number
  total: number
} {
  let correct = 0
  const total = questions.length
  
  questions.forEach((question) => {
    if (answers[question.id] === question.correctAnswer) {
      correct++
    }
  })
  
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
  
  return {
    score: correct,
    percentage,
    correct,
    total
  }
}

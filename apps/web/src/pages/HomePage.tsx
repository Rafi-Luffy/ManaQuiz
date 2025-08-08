import { Link } from 'react-router-dom'
import { 
  Upload, 
  Target, 
  Clock, 
  BookOpen, 
  Zap,
  FileText,
  BarChart3
} from 'lucide-react'

export function HomePage() {
  const features = [
    {
      icon: Upload,
      title: 'Smart PDF Processing',
      description: 'Upload assignment PDFs and our intelligent parser extracts questions, options, and correct answers automatically.'
    },
    {
      icon: Zap,
      title: 'Smart Quiz Generation',
      description: 'Advanced algorithms create practice quizzes that match your study material patterns and difficulty levels.'
    },
    {
      icon: Clock,
      title: 'Timed Practice Sessions',
      description: 'Practice with realistic time constraints to improve speed and accuracy for your actual exams.'
    },
    {
      icon: Target,
      title: 'Adaptive Learning',
      description: 'Track your progress across topics and get personalized recommendations for areas that need improvement.'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Analytics',
      description: 'Get detailed performance insights with topic-wise analysis, time tracking, and improvement suggestions.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'All processing happens locally in your browser - complete privacy, security, and lightning-fast performance.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Upload Assignment PDFs',
      description: 'Upload your assignment PDFs containing questions, multiple choice options, and answer keys.',
      icon: FileText
    },
    {
      number: '02',
      title: 'Automatic Question Extraction',
      description: 'Our smart parser identifies questions, options, and correct answers from your PDF automatically.',
      icon: BookOpen
    },
    {
      number: '03',
      title: 'Take Practice Quiz',
      description: 'Practice with extracted questions in a clean, distraction-free interface with timer and progress tracking.',
      icon: Clock
    },
    {
      number: '04',
      title: 'Review & Improve',
      description: 'Get detailed performance analysis, review mistakes, and track your improvement over time.',
      icon: BarChart3
    }
  ]

  return (
    <div className="space-y-16">
      {/* hero */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Transform Your{' '}
            <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              Study Materials
            </span>{' '}
            into Smart Quizzes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Upload your assignment PDFs and get instant practice quizzes with detailed explanations. 
            Perfect for exam preparation and knowledge assessment.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/upload"
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Start Creating Exams</span>
          </Link>
          <Link
            to="/setup"
            className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>Use Sample Questions</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-600">100%</div>
            <div className="text-gray-600 dark:text-gray-400">Client-Side Processing</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-600">0</div>
            <div className="text-gray-600 dark:text-gray-400">Data Sent to Servers</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-600">∞</div>
            <div className="text-gray-600 dark:text-gray-400">Practice Tests Available</div>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Powerful Features</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create and take comprehensive practice quizzes for your studies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-md transition-shadow duration-200">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get started in just four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-y-0.5" />
                )}
              </div>
              <div className="space-y-2">
                <step.icon className="h-8 w-8 text-primary-600 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-center space-y-6 text-white">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Supercharge Your Study Sessions?</h2>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Join thousands of students who have improved their grades using ManaQuiz's intelligent practice system.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/upload"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Files & Start</span>
          </Link>
          <Link
            to="/setup"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
          >
            Try Sample Questions
          </Link>
        </div>
      </section>
    </div>
  )
}

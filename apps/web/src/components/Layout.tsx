import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Upload, Settings, BarChart3, Home, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { ThemeToggle } from './ThemeToggle'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Upload Files', href: '/upload', icon: Upload },
    { name: 'Exam Setup', href: '/setup', icon: Settings },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Results', href: '/results', icon: BarChart3 },
  ]

  const isExamPage = location.pathname === '/exam'

  const NavLink = ({ item, mobile = false }: { item: typeof navigation[0], mobile?: boolean }) => {
    const isActive = location.pathname === item.href
    return (
      <Link
        to={item.href}
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors',
          mobile ? 'text-base w-full' : 'text-sm',
          isActive
            ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
        )}
      >
        <item.icon className={cn('flex-shrink-0', mobile ? 'h-5 w-5' : 'h-4 w-4')} />
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isExamPage && (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
          <div className="container-responsive">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-base sm:text-lg">M</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hidden xs:block">ManaQuiz</span>
                </Link>
              </div>
              
              {/* nav */}
              <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} />
                ))}
                <div className="ml-2">
                  <ThemeToggle />
                </div>
              </div>

              {/* mobile */}
              <div className="flex items-center space-x-2 md:hidden">
                <ThemeToggle />
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <X className="block h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-3">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <NavLink key={item.name} item={item} mobile />
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      )}
      
      {/* content */}
      <main className={cn(
        "flex-1 min-h-0",
        isExamPage 
          ? "h-screen" 
          : "container-responsive py-4 sm:py-6 lg:py-8"
      )}>
        {children}
      </main>
    </div>
  )
}

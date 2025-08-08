import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AchievementProvider } from './hooks/useAchievements'
import { HomePage } from './pages/HomePage'
import { ExamSetupPage } from './pages/ExamSetupPage'
import { ExamPage } from './pages/ExamPage'
import { ResultsPage } from './pages/ResultsPage'
import { FileUploadPage } from './pages/FileUploadPage'
import { DashboardPage } from './pages/DashboardPage'
import { useThemeStore } from './store/themeStore'

function App() {
  const { theme, setTheme } = useThemeStore()

  // set theme on start
  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])

  return (
    <ErrorBoundary>
      <AchievementProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<FileUploadPage />} />
            <Route path="/setup" element={<ExamSetupPage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Layout>
      </AchievementProvider>
    </ErrorBoundary>
  )
}

export default App

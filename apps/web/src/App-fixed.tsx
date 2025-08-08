import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { ExamSetupPage } from './pages/ExamSetupPage'
import { ExamPage } from './pages/ExamPage'
import { ResultsPage } from './pages/ResultsPage'
import { FileUploadPage } from './pages/FileUploadPage'
import { useThemeStore } from './store/themeStore'

function App() {
  const { theme, setTheme } = useThemeStore()

  // set theme on start
  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])

  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<FileUploadPage />} />
          <Route path="/setup" element={<ExamSetupPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App

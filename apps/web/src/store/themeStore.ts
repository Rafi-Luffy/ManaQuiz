import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getSystemPreference = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const calculateIsDark = (theme: Theme): boolean => {
  if (theme === 'system') {
    return getSystemPreference()
  }
  return theme === 'dark'
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: calculateIsDark('system'),
      
      setTheme: (theme: Theme) => {
        const isDark = calculateIsDark(theme)
        set({ theme, isDark })
        
        // Apply theme to document
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      }
    }),
    {
      name: 'theme-storage'
    }
  )
)

// Initialize theme on app start
if (typeof window !== 'undefined') {
  // Apply initial theme
  const store = useThemeStore.getState()
  const isDark = calculateIsDark(store.theme)
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentStore = useThemeStore.getState()
    if (currentStore.theme === 'system') {
      currentStore.setTheme('system')
    }
  })
}

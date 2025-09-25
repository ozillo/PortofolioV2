import { useEffect, useMemo, useState } from 'react'
const KEY = 'theme'

export default function useTheme() {
  const initial = useMemo(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved === 'light' || saved === 'dark') return saved
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }, [])

  const [theme, setTheme] = useState(initial)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(KEY, theme) } catch {}
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  return { theme, toggleTheme }
}

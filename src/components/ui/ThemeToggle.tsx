import { useEffect, useState } from 'react'
import { Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme')
      return saved ? saved === 'dark' : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      onClick={() => setIsDark(d => !d)}
      className="btn-outline shrink-0 px-2 py-2 sm:px-3 sm:py-2 rounded-full"
    >
      <Moon size={16} />
      <span className="ml-2 text-sm hidden sm:inline">Dark mode</span>
    </button>
  )
}
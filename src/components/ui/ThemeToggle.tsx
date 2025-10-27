import { useEffect } from 'react'
import { Moon } from 'lucide-react'

export default function ThemeToggle() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('dark')) root.classList.add('dark')
    try { localStorage.setItem('theme', 'dark') } catch {}
  }, [])

  return (
    <button
      aria-label="Dark mode"
      aria-disabled="true"
      disabled
      className="btn-outline px-3 py-2 cursor-not-allowed opacity-80"
    >
      <Moon size={16} />
      <span className="ml-2 text-sm">Dark mode</span>
    </button>
  )
}
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Lock } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth, redirectToDashboard } from '../contexts/AuthContext'

export default function Landing() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, isLoading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const search = new URLSearchParams(location.search)
  const loggedOut = search.get('logout') === '1'

  const handleHomeLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      // After login, route to appropriate dashboard
      if (user) {
        redirectToDashboard(user.role)
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(800px 300px at 20% 20%, rgba(16,185,129,0.18), transparent), radial-gradient(600px 240px at 80% 40%, rgba(255,255,255,0.10), transparent)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16 text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Smart Real Estate Automation
          <span className="block text-muted">Powered by ColAI</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 text-muted text-lg"
        >
          Simplify. Automate. Sell Smarter.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-outline">
            Book Demo
          </Link>
        </motion.div>

        {/* Logout status message */}
        {loggedOut && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-6 mx-auto max-w-md p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200"
            role="status"
            aria-live="polite"
          >
            You have been logged out. You can sign in again below.
          </motion.div>
        )}

        {/* Prominent Login Form on Home */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 mx-auto max-w-md w-full glass-card p-6"
        >
          <form onSubmit={handleHomeLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-[#fee2e2] border border-[#fecaca] text-[#b91c1c] text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/90 text-[#0b0f14] placeholder-muted focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white/90 text-[#0b0f14] placeholder-muted focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </motion.div>

        {/* 3D-esque cityscape mock */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 mx-auto max-w-4xl glass-card p-6"
        >
          <div className="h-52 bg-gradient-to-tr from-black/5 to-black/2 dark:from-white/10 dark:to-white/5 rounded-xl grid place-items-center">
            <span className="text-muted">Futuristic cityscape animation placeholder</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
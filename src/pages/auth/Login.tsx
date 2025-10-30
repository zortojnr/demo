import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ChevronLeft } from 'lucide-react'
import { PRODUCT_NAME, COMPANY_NAME } from '../../shared/config'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the intended destination from location state
  const from = location.state?.from?.pathname || null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(formData.email, formData.password)
      
      // If there was an intended destination, go there; otherwise go home
      if (from) {
        navigate(from, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative">
      {/* Top-left Back Button */}
      {(() => {
        const hasHistory = window.history.length > 1
        const fromState = !!from
        const canGoBack = hasHistory || fromState
        return canGoBack ? (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="fixed left-3 top-3 sm:left-5 sm:top-5 z-50 inline-flex items-center justify-center h-12 w-12 sm:h-11 sm:w-11 rounded-full bg-black/40 text-white shadow-md backdrop-blur-md border border-white/20 hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null
      })()}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Main Card */}
        <div className="relative bg-white border border-[#e5e7eb] rounded-3xl p-8 shadow-lg">
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mb-2"
              >
                <h1 className="text-3xl font-bold text-[#0b0f14]">
                  Welcome Back
                </h1>
                <p className="text-[#64748b] mt-2">Sign in to {PRODUCT_NAME}</p>
              </motion.div>
            </div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6 p-4 bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl"
            >
              <p className="text-xs text-[#0b0f14] font-medium mb-2">Demo Credentials:</p>
              <div className="text-xs text-[#334155] space-y-1">
                <p>Admin: admin@demo.com</p>
                <p>Agent: agent@demo.com</p>
                <p>Client: client@demo.com</p>
                <p className="text-[#64748b]">Password: any</p>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-[#fee2e2] border border-[#fecaca] rounded-xl"
              >
                <p className="text-[#b91c1c] text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b]" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#e5e7eb] rounded-xl text-[#0b0f14] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                    autoComplete="off"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="block text-sm font-medium text-[#334155] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64748b]" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white border border-[#e5e7eb] rounded-xl text-[#0b0f14] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748b] hover:text-[#475569] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#0ea5a3] bg-white border-[#e5e7eb] rounded focus:ring-[var(--ring-color)] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-[#475569]">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#0ea5a3] hover:text-[#0a8e85] transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0ea5a3] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#0a8e85] focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-[#64748b]">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#0ea5a3] hover:text-[#0a8e85] font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>

            {/* Brand Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center mt-8 pt-6 border-t border-[#e5e7eb]"
            >
              <p className="text-xs text-[#64748b]">
                {PRODUCT_NAME} – A Product of {COMPANY_NAME}
              </p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Powered by ColAI
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
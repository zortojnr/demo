import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Landing() {
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
          <span className="block text-muted">Powered by AI</span>
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
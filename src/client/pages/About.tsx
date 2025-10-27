import { motion } from 'framer-motion'
import { Brain, Building2, Users, LineChart, FileText, Sparkles, ShieldCheck, Award, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function About() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(900px 300px at 10% 20%, rgba(16,185,129,0.18), transparent), radial-gradient(700px 280px at 80% 30%, rgba(255,215,0,0.12), transparent)'
          }}
        />
        {/* Subtle AI particles */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.35, 0.1], y: [0, -8, 0] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${(i * 57) % 100}%`,
                top: `${(i * 31) % 100}%`,
                background: i % 2 === 0 ? 'rgba(16,185,129,0.6)' : 'rgba(255,215,0,0.5)',
                filter: 'blur(1.5px)'
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="text-4xl md:text-6xl font-bold tracking-tight">
            About Real Estate Pro
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" className="mt-4 text-muted text-lg">
            Smart, simple, and automated property solutions by Homekey Global Investment Ltd.
          </motion.p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-4">
          <div className="text-xl font-medium">Elevating real estate with intelligence</div>
          <p className="text-white/80">
            Real Estate Pro is an intelligent automation platform by Homekey Global Investment Ltd, built to transform the real estate experience.
            Whether you are buying, selling, or managing properties, Real Estate Pro simplifies every process through AI, from automated marketing and client management to document generation and predictive analytics.
          </p>
          <p className="text-white/80">
            Powered by ColAI, our system helps agents, investors, and property buyers make faster, smarter, and more informed decisions, all from one powerful, easy to use platform.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card h-64 grid place-items-center overflow-hidden">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="w-full h-full bg-gradient-to-tr from-white/10 to-white/5 rounded-xl" />
          <div className="absolute flex items-center gap-2 text-white/80">
            <Sparkles size={18} className="text-emerald-400" />
            Futuristic smart city illustration placeholder
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: 'Mission',
            text:
              'To revolutionize the real estate industry by merging advanced AI technology with modern property management, creating seamless automation that enhances productivity, accuracy, and customer satisfaction.',
            Icon: Target,
          },
          {
            title: 'Vision',
            text:
              'To become the leading AI powered real estate automation platform in Africa, building a future where every property transaction is effortless, transparent, and data driven.',
            Icon: Award,
          },
        ].map(({ title, text, Icon }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2">
              <Icon className="text-emerald-400" size={18} />
              <div className="font-medium">{title}</div>
            </div>
            <p className="text-white/80 text-sm mt-3">{text}</p>
          </motion.div>
        ))}
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl font-semibold mb-6">
          Why Choose Us
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'AI-Powered Marketing', text: 'Instantly generate and publish compelling property ads.', Icon: Brain },
            { title: 'Smart Client Management', text: 'Organize leads, track engagement, and close deals efficiently.', Icon: Users },
            { title: '24/7 AI Chat Assistant', text: 'Engage clients anytime through intelligent chat experiences.', Icon: Sparkles },
            { title: 'Data-Driven Insights', text: 'Access real-time analytics and predictive reports.', Icon: LineChart },
            { title: 'Document Automation', text: 'Generate contracts, proposals, and property reports in seconds.', Icon: FileText },
            { title: 'Modern Portfolio', text: 'Showcase premium buildings and land with elegance.', Icon: Building2 },
          ].map(({ title, text, Icon }) => (
            <motion.div key={title} whileHover={{ y: -4 }} className="glass-card p-6">
              <div className="flex items-center gap-2">
                <Icon className="text-emerald-400" size={18} />
                <div className="font-medium">{title}</div>
              </div>
              <p className="text-white/80 text-sm mt-3">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Powered By */}
      <section className="max-w-6xl mx-auto px-6 py-10 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="inline-flex items-center gap-2 glass-card px-4 py-3">
          <ShieldCheck className="text-emerald-400" size={18} />
          <div>
            <div className="font-medium">Powered by ColAI</div>
            <div className="text-white/70 text-sm">ColAI helps industries adopt AI to enhance performance, efficiency, and growth.</div>
          </div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl font-semibold mb-6">
          Our Core Values
        </motion.h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Innovation', Icon: Sparkles },
            { title: 'Integrity', Icon: ShieldCheck },
            { title: 'Excellence', Icon: Award },
            { title: 'Impact', Icon: Target },
          ].map(({ title, Icon }, i) => (
            <motion.div key={title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card p-4 text-center">
              <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                <Icon className="text-emerald-400" size={18} />
              </motion.div>
              <div className="mt-2 text-sm font-medium">{title}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-8">
          <div className="text-lg font-medium">Experience the smarter way to buy, sell, and manage properties.</div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link to="/properties" className="btn-primary">Explore Properties</Link>
            <Link to="/chat" className="btn-outline">Chat with AI</Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
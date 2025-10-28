import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Bot, Search, FileText, Home, Headset, Settings, Briefcase, Mail, Phone, ChevronDown } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

type FAQ = { q: string; a: string }

const faqs: FAQ[] = [
  { q: 'How does AI automate property marketing?', a: 'Our platform automatically generates and publishes optimized ads using AI to improve listing performance and save time.' },
  { q: 'Can I chat directly with agents?', a: 'Yes. You can chat with assigned agents or our AI chatbot 24/7 for instant updates.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use encryption, secure authentication, and strict access controls to protect your information.' },
  { q: 'Can I book property viewings online?', a: 'Yes. Schedule viewings directly from your client dashboard in a few clicks.' },
  { q: 'What if I forget my password?', a: 'Go to the Login page and click “Forgot Password” to reset it instantly.' },
  { q: 'Do you support virtual tours?', a: 'Yes. We can enable 3D/virtual tours for eligible listings upon request.' },
  { q: 'How do I filter properties by location?', a: 'Use the search bar and filters on the Properties page to narrow results by area and budget.' },
  { q: 'Can I manage documents digitally?', a: 'Yes. Generate, store, and share documents securely within the platform.' },
  { q: 'Do you offer business partnerships?', a: 'We welcome partnerships. Reach out via email or the Contact page to begin.' },
  { q: 'Is there live support?', a: 'Live chat is available Monday–Saturday, 8:00 AM – 6:00 PM.' },
  { q: 'How do I update my account details?', a: 'Open Account & Settings to update profile, password, and notifications.' },
  { q: 'Which locations are covered?', a: 'We actively list properties across Adamawa State including Yola, Jimeta, and Bachure.' },
]

function AccordionItem({ item }: { item: FAQ }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="glass-card p-4"
    >
      <button 
        onClick={() => setOpen((v) => !v)} 
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
        aria-controls={`faq-panel-${item.q.replace(/\W+/g, '-')}`}
      >
        <div className="font-medium">{item.q}</div>
        <ChevronDown className={`transition ${open ? 'rotate-180' : ''}`} size={18} aria-hidden="true" />
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden"
        id={`faq-panel-${item.q.replace(/\W+/g, '-')}`}
      >
        <div className="text-white/80 text-sm mt-2">{item.a}</div>
      </motion.div>
    </motion.div>
  )
}

export default function Support() {
  const [query, setQuery] = useState('')

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="support-hero">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(15,15,20,0.9), rgba(10,10,14,0.9)), radial-gradient(800px 280px at 10% 25%, rgba(16,185,129,0.18), transparent), radial-gradient(640px 240px at 85% 25%, rgba(255,215,0,0.12), transparent)'
          }}
        />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 id="support-hero" variants={fadeUp} initial="hidden" animate="show" className="text-4xl md:text-6xl font-bold tracking-tight">
              How can we help you today?
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="show" className="mt-4 text-muted text-lg">
              Find answers, explore tips, or chat with our AI Assistant.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} aria-hidden="true" />
                <label htmlFor="support-search" className="sr-only">Search FAQs or type your question</label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search FAQs or type your question…"
                  id="support-search"
                  className="pl-9 pr-3 py-3 w-full rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div className="mt-3 text-xs text-white/50">Try: “booking”, “AI assistant”, “password”, “viewing”</div>
            </motion.div>
          </div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="hidden md:block">
            <div className="relative p-6 rounded-2xl glass-card">
              <Bot className="mx-auto text-emerald-400" size={80} />
              <div className="mt-4 text-center text-white/80 text-sm">
                Smart, friendly AI — guiding you through searches and bookings.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section id="quick" className="max-w-6xl mx-auto px-6 py-10" aria-labelledby="quick-help">
        <h2 id="quick-help" className="sr-only">Quick Help</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: 'Property Listings', Icon: Home, href: '/properties' },
            { title: 'AI Assistant Help', Icon: Bot, href: '/chat' },
            { title: 'Client & Booking Issues', Icon: Headset, href: '#faq' },
            { title: 'Documentation Support', Icon: FileText, href: '#faq' },
            { title: 'Account & Login', Icon: Settings, href: '#faq' },
            { title: 'Business/Partnership', Icon: Briefcase, href: '/contact' },
          ].map(({ title, Icon, href }) => (
            <motion.a
              key={title}
              href={href}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="glass-card p-4 flex items-center gap-3"
              aria-label={title}
            >
              <div className="p-2 rounded-lg bg-white/5">
                <Icon className="text-emerald-400" size={18} aria-hidden="true" />
              </div>
              <div className="font-medium">{title}</div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-6 py-10" aria-labelledby="faq-heading">
        <motion.h3 id="faq-heading" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl font-semibold mb-6">
          Frequently Asked Questions
        </motion.h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {faqs.map((f, idx) => <AccordionItem key={idx} item={f} />)}
        </div>
      </section>

      {/* AI Assistant */}
      <section className="max-w-6xl mx-auto px-6 py-10" aria-labelledby="ai-assistant">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 id="ai-assistant" className="text-lg font-medium">Need Instant Help?</h2>
            <div className="text-white/70 text-sm">Our AI Assistant is always available to guide you through property searches, bookings, and inquiries.</div>
          </div>
          <Link to="/chat" className="btn-primary inline-flex items-center gap-2" aria-label="Chat with AI Assistant">
            <Bot size={16} aria-hidden="true" /> Chat with AI Assistant
          </Link>
        </motion.div>
      </section>

      {/* Support Channels */}
      <section className="max-w-6xl mx-auto px-6 py-10" aria-labelledby="other-channels">
        <motion.h3 id="other-channels" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl font-semibold mb-6">Other Ways to Reach Us</motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Email', Icon: Mail, text: 'support@realestatepro.ai' },
            { title: 'Live Chat', Icon: Headset, text: 'Mon–Sat, 8 AM – 6 PM' },
            { title: 'Call', Icon: Phone, text: '+234 906 640 9957' },
          ].map(({ title, Icon, text }) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-5">
              <div className="flex items-center gap-2">
                <Icon className="text-emerald-400" size={18} aria-hidden="true" />
                <div className="font-medium">{title}</div>
              </div>
              <div className="mt-2 text-white/80 text-sm">{text}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feedback Form (Optional) */}
      <section className="max-w-6xl mx-auto px-6 py-10" aria-labelledby="feedback-form">
        <motion.form variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-6 space-y-4" aria-labelledby="feedback-form">
          <h2 id="feedback-form" className="text-xl font-semibold">Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fb-name" className="block text-sm text-white/80 mb-1">Name</label>
              <input id="fb-name" className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="fb-email" className="block text-sm text-white/80 mb-1">Email</label>
              <input id="fb-email" type="email" className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="fb-message" className="block text-sm text-white/80 mb-1">Message</label>
            <textarea id="fb-message" rows={4} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Tell us what you couldn’t find or what we can improve." />
          </div>
          <div className="flex justify-end">
            <button type="button" className="btn-primary px-4 py-2">Submit Feedback</button>
          </div>
          <div className="text-emerald-400 text-xs">✅ Thanks for your feedback! We’ll use it to make HomeKey Global Investment Ltd. better.</div>
        </motion.form>
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16 text-center" aria-labelledby="support-cta">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-8">
          <h2 id="support-cta" className="text-lg font-medium">Still need help? We’re here for you.</h2>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary">Contact Us</Link>
            <Link to="/properties" className="btn-outline">Explore Properties</Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
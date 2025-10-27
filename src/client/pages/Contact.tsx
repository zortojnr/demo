import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Bot, Headset, Linkedin, Instagram, Twitter, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function ClientContact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{ [k: string]: string }>({})

  const validate = () => {
    const errs: { [k: string]: string } = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email is required'
    if (!phone.trim()) errs.phone = 'Phone is required'
    if (!subject.trim()) errs.subject = 'Subject is required'
    if (!message.trim()) errs.message = 'Message is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSuccess(true)
    setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('')
    setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="relative">
      {/* Hero */}
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
        {/* AI network glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.35, 0.15], y: [0, -8, 0] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${(i * 59) % 100}%`,
                top: `${(i * 37) % 100}%`,
                background: i % 2 === 0 ? 'rgba(16,185,129,0.6)' : 'rgba(255,215,0,0.5)',
                filter: 'blur(1.5px)'
              }}
            />
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-12 text-center">
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" className="text-4xl md:text-6xl font-bold tracking-tight">
            Get in Touch
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="show" className="mt-4 text-muted text-lg">
            We are here to help you make smarter property decisions, connect with Homekey Global Investment Ltd today.
          </motion.p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Info cards */}
        <div className="space-y-4">
          {[{
            title: 'Address', icon: MapPin, lines: ['Homekey Global Investment Ltd', '45 Smart Estate Avenue, Yola, Adamawa State, Nigeria']
          }, {
            title: 'Phone', icon: Phone, lines: ['+234 906 640 9957', '+234 703 854 1337', '+234 810 033 3629']
          }, {
            title: 'Email', icon: Mail, lines: ['info@realestatepro.ai', 'thecolai92@gmail.com']
          }, {
            title: 'Hours', icon: Clock, lines: ['Monday to Saturday: 8:00 AM to 6:00 PM']
          }].map(({ title, icon: Icon, lines }) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ scale: 1.02 }} className="glass-card p-5">
              <div className="flex items-center gap-2">
                <Icon className="text-emerald-400" size={18} />
                <div className="font-medium">{title}</div>
              </div>
              <div className="mt-2 text-white/80 text-sm space-y-1">
                {lines.map((l) => <div key={l}>{l}</div>)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.form onSubmit={onSubmit} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-6 space-y-4">
          <div className="text-xl font-semibold">Send us a message</div>
          {success && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-400 text-sm">
              ✅ Thank you for reaching out! Our team will contact you shortly.
            </motion.div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Name" />
              {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
            </div>
            <div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Email" />
              {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
            </div>
            <div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Phone" />
              {errors.phone && <div className="text-red-400 text-xs mt-1">{errors.phone}</div>}
            </div>
            <div>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Subject" />
              {errors.subject && <div className="text-red-400 text-xs mt-1">{errors.subject}</div>}
            </div>
          </div>
          <div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Message" />
            {errors.message && <div className="text-red-400 text-xs mt-1">{errors.message}</div>}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary px-4 py-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition">Send Message</button>
          </div>
        </motion.form>
      </section>

      {/* Map */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card overflow-hidden">
          <iframe
            title="HomeKey Global Investment Location"
            src="https://www.google.com/maps?q=46+Gimba+Road+Opposite+State+Low+Cost+Jimeta%2FYola%2C+Adamawa+State&output=embed"
            className="w-full h-72 rounded-xl"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </section>

      {/* Support & Chat */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-lg font-medium">Need quick help?</div>
            <div className="text-white/70 text-sm">Chat instantly with our AI Assistant or connect with a live agent.</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/chat" className="btn-primary inline-flex items-center gap-2">
              <Bot size={16} /> Chat with AI
            </Link>
            <a href="mailto:info@realestatepro.ai?subject=Customer%20Support" className="btn-outline inline-flex items-center gap-2">
              <Headset size={16} /> Customer Support
            </a>
          </div>
        </motion.div>
      </section>

      {/* Social */}
      <section className="max-w-6xl mx-auto px-6 pb-10 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center justify-center gap-6">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="text-white/70 hover:text-emerald-400 transition"><Linkedin /></a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-white/70 hover:text-emerald-400 transition"><Instagram /></a>
          <a href="https://wa.me/2349066409957" target="_blank" rel="noreferrer" className="text-white/70 hover:text-emerald-400 transition"><MessageCircle /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/70 hover:text-emerald-400 transition"><Twitter /></a>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card p-8">
          <div className="text-lg font-medium">Let’s build your smart real estate future together.</div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link to="/properties" className="btn-primary">Explore Properties</Link>
            <Link to="/about" className="btn-outline">About Us</Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
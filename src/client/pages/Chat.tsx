import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Bot, Home, ArrowLeft, Send, Smile, Paperclip, MapPin, Phone, Info } from 'lucide-react'

type ChatMessage = {
  id: string
  role: 'ai' | 'user'
  text: string
}

const bubbleVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
}

const typingDots = {
  animate: {
    opacity: [0.3, 1, 0.3],
    y: [0, -2, 0],
    transition: { duration: 0.9, repeat: Infinity },
  },
}

const quickReplies = [
  'Show available properties',
  'Schedule a meeting',
  'Talk to support',
  'Explain AI features',
]

export default function ClientChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'hello',
      role: 'ai',
      text:
        "👋 Hello! I’m Homekey AI — your smart property assistant. How can I help you today?\n\n🏠 Find a property\n📅 Book a viewing\n📄 Generate a report\n💬 Get support",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages, typing])

  const sendMessage = (value?: string) => {
    const text = (value ?? input).trim()
    if (!text) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'ai',
        text:
          text.toLowerCase().includes('available')
            ? 'Here are some featured properties near Jimeta, Yola. Would you like to refine by price or location?'
            : text.toLowerCase().includes('meeting')
            ? 'I can help schedule a viewing. Please share a preferred date and location.'
            : text.toLowerCase().includes('support')
            ? 'You can reach support via phone or chat. I can connect you now or guide you to /support.'
            : 'Got it! I’ll assist with that. Could you provide a little more detail?'
      }
      setMessages((prev) => [...prev, aiMsg])
      setTyping(false)
    }, 900)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  const gradientBg = useMemo(
    () => ({ backgroundImage: 'linear-gradient(135deg, #0b1215 0%, #0b4d3a 60%, #065f46 100%)' }),
    []
  )

  return (
    <div className="min-h-screen" style={gradientBg}>
      {/* Header */}
      <motion.header initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between bg-black/30 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Bot className="text-emerald-400" size={20} />
            <span className="font-semibold">Homekey AI 🤖</span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/support" className="btn-outline px-3 py-1.5 inline-flex items-center gap-1">
              <ArrowLeft size={16} /> Back
            </NavLink>
            <NavLink to="/" className="btn-primary px-3 py-1.5 inline-flex items-center gap-1">
              <Home size={16} /> Home
            </NavLink>
          </div>
        </div>
      </motion.header>

      {/* Body */}
      <div className="pt-20 pb-24 mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        {/* Chat container */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl bg-white/5 backdrop-blur-xl shadow-lg overflow-hidden">
          <div ref={containerRef} className="h-[60vh] md:h-[64vh] overflow-y-auto p-4 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: 6 }}
                  className={
                    m.role === 'ai'
                      ? 'max-w-[82%] rounded-xl px-3 py-2 bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-md'
                      : 'ml-auto max-w-[82%] rounded-xl px-3 py-2 bg-yellow-100 text-black shadow-md'
                  }
                >
                  <div className="flex items-start gap-2">
                    {m.role === 'ai' && <Bot size={16} className="mt-0.5" />}
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>{typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600/80 text-white">
                <Bot size={16} />
                <motion.span variants={typingDots} animate="animate">●</motion.span>
                <motion.span variants={typingDots} animate="animate">●</motion.span>
                <motion.span variants={typingDots} animate="animate">●</motion.span>
              </motion.div>
            )}</AnimatePresence>

            {/* Quick replies */}
            <div className="mt-4 flex flex-wrap gap-2">
              {quickReplies.map((q) => (
                <motion.button
                  key={q}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 rounded-full text-xs bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/30 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your message…"
                  className="w-full rounded-xl bg-black/30 border border-emerald-500/30 focus:border-emerald-400 outline-none text-sm px-3 py-2 text-white placeholder-white/50"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/60">
                  <Smile size={16} className="hidden sm:block" />
                  <Paperclip size={16} className="hidden sm:block" />
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} onClick={() => sendMessage()} className="btn-primary px-3 py-2 inline-flex items-center gap-1">
                <Send size={16} /> Send
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Side info (desktop only) */}
        <motion.aside initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="hidden md:block">
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl shadow-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="text-emerald-400" size={18} />
              <div className="text-sm">
                <div className="font-semibold">Homekey AI</div>
                <div className="text-white/60">your 24/7 smart property guide.</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <NavLink to="/support" className="btn-outline w-full inline-flex items-center gap-2"><Info size={16} /> Support</NavLink>
              <NavLink to="/contact" className="btn-outline w-full inline-flex items-center gap-2"><Phone size={16} /> Contact</NavLink>
              <NavLink to="/properties" className="btn-outline w-full inline-flex items-center gap-2"><MapPin size={16} /> Explore</NavLink>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
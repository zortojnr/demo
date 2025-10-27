import { useState } from 'react'
import { Bot, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = { role: 'user' | 'ai'; content: string }

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hi! I can help craft property ads, answer client queries, and automate docs.' },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const content = input.trim()
    setMessages((m) => [...m, { role: 'user', content }])
    setInput('')
    // Mock AI reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          content: `AI: Drafted a quick ad, "${content}". Want to auto post to marketing?`,
        },
      ])
    }, 600)
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 btn-primary rounded-full shadow-glow"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Bot size={18} />
        <span className="font-medium">Ask AI</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-[360px] glass-card"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="font-medium">AI Assistant</div>
              <button className="btn-outline px-2 py-1" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[320px] overflow-y-auto space-y-3 p-4">
              {messages.map((m, i) => (
                <div key={i} className={`text-sm ${m.role === 'ai' ? 'text-white/90' : 'text-white/70'} `}>
                  <div className={`inline-block px-3 py-2 rounded-xl ${m.role === 'ai' ? 'bg-white/10' : 'bg-white/5'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-4 border-t border-white/10">
              <input
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 focus:outline-none"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="btn-primary px-3 py-2" onClick={send}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
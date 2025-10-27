import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function ClientChatAssistant() {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button className="rounded-full w-12 h-12 grid place-items-center bg-emerald-500 hover:bg-emerald-400 shadow-lg" onClick={() => setOpen(true)} aria-label="Open AI chat">
          <MessageCircle className="text-black" />
        </button>
      )}
      {open && (
        <div className="w-80 glass-card dropdown-card p-3 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div className="font-medium">AI Assistant</div>
            <button className="btn-outline px-2 py-1" onClick={() => setOpen(false)} aria-label="Close chat"><X size={16} /></button>
          </div>
          <div className="text-white/70 text-sm mt-2">Need help? Ask the AI Agent.</div>
          <div className="mt-3">
            <input className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Type your question..." />
            <div className="flex justify-end mt-2">
              <button className="btn-primary px-3 py-2">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
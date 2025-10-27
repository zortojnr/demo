import { useState } from 'react'

export default function ClientBook() {
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <div className="py-10">
      <div className="glass-card p-6 max-w-xl">
        <div className="text-xl font-semibold">Schedule a Viewing</div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="date" className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" value={date} onChange={(e) => setDate(e.target.value)} />
          <textarea className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex justify-end mt-6">
          <button className="btn-primary px-4 py-2">Book Viewing</button>
        </div>
      </div>
    </div>
  )
}
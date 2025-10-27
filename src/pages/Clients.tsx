type Client = {
  name: string
  interest: 'High' | 'Medium' | 'Low'
  engagement: number
}

const clients: Client[] = [
  { name: 'Alex Johnson', interest: 'High', engagement: 92 },
  { name: 'Priya Das', interest: 'Medium', engagement: 64 },
  { name: 'Chen Wei', interest: 'Low', engagement: 38 },
]

export default function Clients() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">Client Profiles</div>
        <div className="flex gap-2">
          {['All', 'High', 'Medium', 'Low'].map((f) => (
            <button key={f} className="btn-outline px-3 py-2">{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((c) => (
          <div key={c.name} className="glass-card p-6">
            <div className="font-semibold">{c.name}</div>
            <div className="mt-1 text-sm text-white/60">Interest: {c.interest}</div>
            <div className="mt-3 text-sm">Engagement</div>
            <div className="w-full bg-white/10 h-2 rounded-full mt-2">
              <div
                className={`h-2 rounded-full ${c.engagement > 80 ? 'bg-accent' : c.engagement > 50 ? 'bg-yellow-400' : 'bg-red-500'}`}
                style={{ width: `${c.engagement}%` }}
              />
            </div>
            <div className="mt-2 text-white/70 text-sm">{c.engagement}% active</div>
          </div>
        ))}
      </div>
    </div>
  )
}
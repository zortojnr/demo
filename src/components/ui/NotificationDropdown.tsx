import { Bell, CheckCircle2, FileText, UserPlus } from 'lucide-react'

type Props = {
  open: boolean
  onToggle: () => void
  containerRef?: React.RefObject<HTMLDivElement | null>
}

const items = [
  { id: 1, icon: UserPlus, text: 'New lead: Alex Johnson viewed Skyline Penthouse', time: '2m' },
  { id: 2, icon: FileText, text: 'Document generated: Emerald Villa contract (PDF)', time: '15m' },
  { id: 3, icon: CheckCircle2, text: 'AI Ad ready: Waterfront campaign draft', time: '1h' },
]

export default function NotificationDropdown({ open, onToggle, containerRef }: Props) {
  return (
    <div className="relative" ref={containerRef}>
      <button
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/20 text-white hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Notifications"
      >
        <Bell size={16} />
        <span className="sr-only">Notifications</span>
        <span className="ml-1 inline-flex items-center justify-center text-[10px] h-4 min-w-[16px] px-1 rounded-full bg-[var(--accent)] text-white">{items.length}</span>
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0b0f14]/95 p-2 z-50 shadow-lg"
          role="menu"
          aria-label="Notifications menu"
        >
          <div className="px-3 py-2 text-sm font-medium">Recent</div>
          <ul className="space-y-1">
            {items.map((n) => (
              <li key={n.id} className="px-3 py-2 rounded-xl hover:bg-white/5 text-sm flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-black/20">
                  <n.icon size={14} className="text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/90">{n.text}</div>
                  <div className="text-white/50">{n.time} ago</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
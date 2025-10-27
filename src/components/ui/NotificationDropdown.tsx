type Props = {
  open: boolean
  onToggle: () => void
  containerRef?: React.RefObject<HTMLDivElement | null>
}

const items = [
  { id: 1, text: 'New lead: Alex Johnson viewed Skyline Penthouse', time: '2m' },
  { id: 2, text: 'Document generated: Emerald Villa contract (PDF)', time: '15m' },
  { id: 3, text: 'AI Ad ready: Waterfront campaign draft', time: '1h' },
]

export default function NotificationDropdown({ open, onToggle, containerRef }: Props) {
  return (
    <div className="relative" ref={containerRef}>
      <button className="btn-outline px-3 py-2" onClick={onToggle}>
        <span className="text-sm">Notifications</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 glass-card dropdown-card p-2 z-50">
          <div className="px-2 py-2 text-sm font-medium">Recent</div>
          <ul className="space-y-1">
            {items.map((n) => (
              <li key={n.id} className="px-2 py-2 rounded-lg hover:bg-white/5 text-sm">
                <div className="text-white/80">{n.text}</div>
                <div className="text-white/50">{n.time} ago</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
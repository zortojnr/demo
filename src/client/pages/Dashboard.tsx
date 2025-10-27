export default function ClientDashboard() {
  return (
    <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card p-4">
        <div className="font-medium">Saved Properties</div>
        <div className="text-white/60 text-sm mt-2">No saved properties yet.</div>
      </div>
      <div className="glass-card p-4">
        <div className="font-medium">Appointments</div>
        <div className="text-white/60 text-sm mt-2">No upcoming appointments.</div>
      </div>
      <div className="glass-card p-4">
        <div className="font-medium">Notifications</div>
        <div className="text-white/60 text-sm mt-2">All caught up.</div>
      </div>
    </div>
  )
}
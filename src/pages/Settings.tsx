export default function Settings() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <div className="font-medium">Preferences</div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm">Enable dark mode</span>
            <input type="checkbox" defaultChecked className="accent-accent" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Email notifications</span>
            <input type="checkbox" defaultChecked className="accent-accent" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Auto-generate ads</span>
            <input type="checkbox" className="accent-accent" />
          </label>
        </div>
      </div>
      <div className="glass-card p-6">
        <div className="font-medium">Profile</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="First name" />
          <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Last name" />
          <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 col-span-2" placeholder="Email" />
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn-primary">Save</button>
          <button className="btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  )
}
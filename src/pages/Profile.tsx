import { Mail, User } from 'lucide-react'

export default function Profile() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/10 grid place-items-center">
            <User size={24} />
          </div>
          <div>
            <div className="text-xl font-semibold">Dunama Dahiru</div>
            <div className="text-muted flex items-center gap-2"><Mail size={14} /> dunama.dahiru@example.com</div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-4 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-white/60 text-sm">Currency</div>
            <div className="font-medium">Nigerian Naira (₦)</div>
          </div>
          <div>
            <div className="text-white/60 text-sm">Region</div>
            <div className="font-medium">Nigeria</div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="font-medium mb-2">About</div>
        <p className="text-white/70 text-sm leading-relaxed">
          This demo profile is configured for Nigeria. Prices and monetary values across the system display in Nigerian Naira (₦).
        </p>
      </div>
    </div>
  )
}
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '../shared/config'

type Property = {
  name: string
  type: string
  location: string
  price: number
  status: 'Listed' | 'Draft' | 'Sold'
}

const initial: Property[] = [
  { name: 'Skyline Penthouse', type: 'Condo', location: 'Downtown', price: 1250000, status: 'Listed' },
  { name: 'Emerald Villa', type: 'House', location: 'Seaside', price: 890000, status: 'Draft' },
]

export default function Properties() {
  const [items, setItems] = useState<Property[]>(initial)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<Property>({ name: '', type: '', location: '', price: 0, status: 'Draft' })
  const [selected, setSelected] = useState<Property | null>(null)

  const adPreview = useMemo(() => {
    const p = selected ?? form
    if (!p.name) return 'Select a property or start creating one to see the AI ad preview.'
    return `Experience luxury living at ${p.name}, a stunning ${p.type.toLowerCase()} in ${p.location}. Priced at ${formatCurrency(p.price)}, available now. Book a viewing today.`
  }, [selected, form])

  const addProperty = () => {
    if (!form.name || !form.type || !form.location || !form.price) return
    setItems((list) => [...list, form])
    setShowModal(false)
    setForm({ name: '', type: '', location: '', price: 0, status: 'Draft' })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium">Property Listings</div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Add listing</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/60">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Location</th>
                <th className="text-right p-2">Price</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <tr key={i} className="hover:bg-white/5 cursor-pointer" onClick={() => setSelected(p)}>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.type}</td>
                  <td className="p-2">{p.location}</td>
                  <td className="p-2 text-right">{formatCurrency(p.price)}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${p.status === 'Listed' ? 'bg-accent/20 text-accent' : p.status === 'Draft' ? 'bg-white/10 text-white/60' : 'bg-white/20 text-white'}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="font-medium mb-2">AI Ad Preview</div>
        <p className="text-white/70 text-sm">Auto-generated marketing copy based on the selected property.</p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-white/5 p-4 rounded-xl">
          <div className="text-white/80 text-sm leading-relaxed">{adPreview}</div>
        </motion.div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-lg glass-card p-6">
            <div className="font-medium text-lg">Add Listing</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <input type="number" className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <select className="px-3 py-2 rounded-xl bg-white/10 border border-white/10" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Property['status'] })}>
                <option>Draft</option>
                <option>Listed</option>
                <option>Sold</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={addProperty}>Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
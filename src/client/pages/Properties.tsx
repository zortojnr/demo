import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

type Property = { id: number; name: string; type: string; location: string; price: number; image?: string }

const all: Property[] = [
  { id: 1, name: 'Skyline Penthouse', type: 'Condo', location: 'Jimeta, Yola, Adamawa', price: 125000000, image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1600&auto=format&fit=crop' },
  { id: 2, name: 'Emerald Villa', type: 'House', location: 'Bachure, Yola, Adamawa', price: 89000000, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop' },
  { id: 3, name: 'Waterfront Residence', type: 'Apartment', location: 'Yola Town, Adamawa', price: 156000000, image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop' },
]

export default function ClientProperties() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')

  const filtered = useMemo(() => {
    return all.filter(p => (
      (!query || p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase())) &&
      (!type || p.type === type) &&
      (!maxPrice || p.price <= Number(maxPrice))
    ))
  }, [query, type, maxPrice])

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-center gap-3 glass-card p-4">
        <input className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 flex-1" placeholder="Search by name or location" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select
          className="px-3 py-2 rounded-xl bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" className="bg-black text-white">All Types</option>
          <option value="Condo" className="bg-black text-white">Condo</option>
          <option value="House" className="bg-black text-white">House</option>
          <option value="Apartment" className="bg-black text-white">Apartment</option>
        </select>
        <input type="number" className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 w-40" placeholder="Max Price (₦)" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {filtered.map(p => (
          <motion.div key={p.id} whileHover={{ scale: 1.02 }} className="glass-card overflow-hidden">
            {p.image ? (
              <img
                src={p.image}
                alt={`${p.name} in ${p.location}`}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="h-40 bg-white/10" />
            )}
            <div className="p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-white/60 text-sm">{p.location}</div>
              <div className="mt-2 font-semibold">₦{p.price.toLocaleString('en-NG')}</div>
              <NavLink to={`/property/${p.id}`} className="btn-outline mt-3 inline-block">View Details</NavLink>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
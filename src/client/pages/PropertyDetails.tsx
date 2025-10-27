import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const data = {
  1: { name: 'Skyline Penthouse', location: 'Jimeta, Yola, Adamawa', price: 125000000, overview: 'A premium condo with panoramic city views.', image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1600&auto=format&fit=crop' },
  2: { name: 'Emerald Villa', location: 'Bachure, Yola, Adamawa', price: 89000000, overview: 'Luxurious villa with private garden.', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop' },
  3: { name: 'Waterfront Residence', location: 'Yola Town, Adamawa', price: 156000000, overview: 'Exclusive apartment by the water.', image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop' },
} as const

export default function PropertyDetails() {
  const { id } = useParams()
  const item = useMemo(() => (id ? (data as any)[id] : null), [id])

  if (!item) return <div className="py-10">Property not found.</div>

  return (
    <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={`${item.name} in ${item.location}`} loading="lazy" className="h-64 w-full object-cover" />
          ) : (
            <div className="h-64 bg-white/10" />
          )}
        </div>
        <div className="glass-card p-4">
          <div className="text-2xl font-semibold">{item.name}</div>
          <div className="text-white/60">{item.location}</div>
          <div className="mt-2 font-semibold">₦{item.price.toLocaleString('en-NG')}</div>
          <div className="mt-4 text-white/80 text-sm">{item.overview}</div>
        </div>
      </div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-4 mt-6">
        <div className="font-medium mb-2">Map</div>
        <div className="h-56 bg-white/10 rounded-xl" />
      </motion.div>
      <div className="fixed bottom-24 right-6">
        <a href="/client/book" className="btn-primary px-4 py-2">Schedule Viewing</a>
      </div>
    </div>
  )
}
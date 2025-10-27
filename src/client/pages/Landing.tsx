import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Home, Building2, MapPin, Star } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const featured = [
  { id: 1, name: 'Skyline Penthouse', location: 'Jimeta, Yola, Adamawa', price: 125000000, image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1600&auto=format&fit=crop' },
  { id: 2, name: 'Emerald Villa', location: 'Bachure, Yola, Adamawa', price: 89000000, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop' },
  { id: 3, name: 'Waterfront Residence', location: 'Yola Town, Adamawa', price: 156000000, image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop' },
]

export default function ClientLanding() {
  return (
    <div className="relative py-16">
      {/* Hero gradient / animated glow */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.18 }} transition={{ duration: 1.2 }} className="h-64 bg-gradient-to-r from-emerald-500/30 via-emerald-400/20 to-yellow-400/20 blur-2xl rounded-full mx-10 mt-10" />
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.35, 0.15], y: [0, -6, 0] }}
            transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.12 }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${(i * 61) % 100}%`,
              top: `${(i * 37) % 100}%`,
              background: i % 2 === 0 ? 'rgba(16,185,129,0.6)' : 'rgba(255,215,0,0.5)',
              filter: 'blur(1.4px)'
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <div className="text-center">
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-5xl font-semibold">
          Discover the Future of Real Estate.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/70 mt-3">
          AI-powered property discovery with a premium, futuristic experience.
        </motion.p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <NavLink to="/properties" className="btn-primary px-5 py-3">Explore Properties</NavLink>
          <NavLink to="/chat" className="btn-outline px-5 py-3">Chat with AI</NavLink>
        </div>
      </div>

      {/* Premium Listings */}
      <section className="mt-16">
        <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl font-semibold mb-6">Premium Listings</motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <motion.div key={p.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card overflow-hidden">
              <div className="relative">
                <img src={p.image} alt={p.name} loading="lazy" className="h-40 w-full object-cover" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-xs">
                  <Star size={14} className="text-emerald-400" /> Featured
                </div>
              </div>
              <div className="p-4">
                <div className="font-medium">{p.name}</div>
                <div className="text-white/60 text-sm inline-flex items-center gap-1"><MapPin size={14} /> {p.location}</div>
                <div className="mt-2 font-semibold">₦{p.price.toLocaleString('en-NG')}</div>
                <NavLink to={`/property/${p.id}`} className="btn-outline mt-3 inline-block">View Details</NavLink>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ad Showcase */}
      <section className="mt-12">
        <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl font-semibold mb-6">Ad Showcase</motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1600&auto=format&fit=crop',
          ].map((src, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="glass-card overflow-hidden">
              <img src={src} alt={`Ad ${i+1}`} loading="lazy" className="h-36 w-full object-cover" />
              <div className="p-4 text-white/70 text-sm">AI-optimized marketing visuals for premium reach.</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Available Products */}
      <section className="mt-12">
        <motion.h3 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-2xl font-semibold mb-6">Available Products</motion.h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: 'Buy', Icon: Home },
            { title: 'Rent', Icon: Building2 },
            { title: 'Land', Icon: MapPin },
            { title: 'Shortlet', Icon: Building2 },
            { title: 'Commercial', Icon: Building2 },
          ].map(({ title, Icon }) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} whileHover={{ scale: 1.03 }} className="glass-card p-4 text-center">
              <div className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5">
                <Icon size={18} className="text-emerald-400" />
              </div>
              <div className="mt-2 text-sm font-medium">{title}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
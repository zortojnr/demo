import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  X,
  Heart,
  MessageCircle,
  TrendingUp
} from 'lucide-react'

// Mock client data
const mockClients = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    status: 'Hot',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    joinDate: '2024-01-15',
    savedProperties: 5,
    lastActivity: '2 hours ago',
    interests: ['Villa', 'Apartment'],
    budget: '₦300K - ₦500K',
    notes: 'Looking for a family home in a quiet neighborhood'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+234 802 345 6789',
    location: 'Abuja, FCT',
    status: 'Warm',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    joinDate: '2024-01-20',
    savedProperties: 3,
    lastActivity: '1 day ago',
    interests: ['House', 'Condo'],
    budget: '₦200K - ₦400K',
    notes: 'First-time buyer, needs guidance'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'mike.brown@email.com',
    phone: '+234 803 456 7890',
    location: 'Port Harcourt, Rivers',
    status: 'Cold',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    joinDate: '2024-01-10',
    savedProperties: 1,
    lastActivity: '1 week ago',
    interests: ['Commercial'],
    budget: '₦1M+',
    notes: 'Investor looking for commercial properties'
  }
]

export default function AgentClients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [clients] = useState(mockClients)

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'Warm': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'Cold': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hot': return '🔥'
      case 'Warm': return '⚡'
      case 'Cold': return '❄️'
      default: return '📊'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
          <p className="text-slate-400">Manage your client relationships</p>
        </div>
        <div className="text-sm text-slate-400">
          Total: {clients.length} clients
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
          >
            <option value="All">All Status</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-black/40 border border-emerald-500/20 rounded-xl text-emerald-300 hover:bg-emerald-500/10 transition-colors duration-300"
          >
            <Filter size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 p-6"
          >
            {/* Status Indicator */}
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)} flex items-center gap-1`}
              >
                <span>{getStatusIcon(client.status)}</span>
                {client.status}
              </motion.div>
            </div>

            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
                  {client.name}
                </h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <MapPin size={12} />
                  {client.location}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail size={14} />
                {client.email}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone size={14} />
                {client.phone}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                <div className="text-lg font-bold text-emerald-400">{client.savedProperties}</div>
                <div className="text-xs text-slate-400">Saved Properties</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-500/10">
                <div className="text-lg font-bold text-blue-400">{client.interests.length}</div>
                <div className="text-xs text-slate-400">Interests</div>
              </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
              <span>Last activity:</span>
              <span>{client.lastActivity}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedClient(client)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors duration-300"
              >
                <Eye size={16} />
                View Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors duration-300"
              >
                <MessageCircle size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Client Profile Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-emerald-500/20 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedClient.status)} mt-2`}>
                        <span>{getStatusIcon(selectedClient.status)}</span>
                        {selectedClient.status} Lead
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedClient(null)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40">
                      <Mail size={18} className="text-emerald-400" />
                      <div>
                        <div className="text-sm text-slate-400">Email</div>
                        <div className="text-white">{selectedClient.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40">
                      <Phone size={18} className="text-blue-400" />
                      <div>
                        <div className="text-sm text-slate-400">Phone</div>
                        <div className="text-white">{selectedClient.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40">
                      <MapPin size={18} className="text-purple-400" />
                      <div>
                        <div className="text-sm text-slate-400">Location</div>
                        <div className="text-white">{selectedClient.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40">
                      <Calendar size={18} className="text-gold-400" />
                      <div>
                        <div className="text-sm text-slate-400">Join Date</div>
                        <div className="text-white">{selectedClient.joinDate}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Client Activity</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Heart size={24} className="mx-auto text-emerald-400 mb-2" />
                      <div className="text-2xl font-bold text-emerald-400">{selectedClient.savedProperties}</div>
                      <div className="text-sm text-slate-400">Saved Properties</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <TrendingUp size={24} className="mx-auto text-blue-400 mb-2" />
                      <div className="text-2xl font-bold text-blue-400">{selectedClient.interests.length}</div>
                      <div className="text-sm text-slate-400">Interests</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <MessageCircle size={24} className="mx-auto text-purple-400 mb-2" />
                      <div className="text-2xl font-bold text-purple-400">12</div>
                      <div className="text-sm text-slate-400">Messages</div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-black/40">
                      <div className="text-sm text-slate-400 mb-1">Budget Range</div>
                      <div className="text-white font-medium">{selectedClient.budget}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40">
                      <div className="text-sm text-slate-400 mb-2">Property Interests</div>
                      <div className="flex gap-2">
                        {selectedClient.interests.map((interest: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40">
                      <div className="text-sm text-slate-400 mb-1">Notes</div>
                      <div className="text-white">{selectedClient.notes}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    Schedule Meeting
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl font-medium transition-colors duration-300"
                  >
                    Send Message
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
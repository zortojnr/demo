import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit, Trash2, Users, Mail, Phone, MapPin, 
  ChevronLeft, ChevronRight, TrendingUp, AlertCircle, User
} from 'lucide-react'
import { toast } from 'react-hot-toast'

type ClientStatus = 'Active' | 'Inactive' | 'Lead' | 'Prospect'
type InterestLevel = 'High' | 'Medium' | 'Low'

type Client = {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: ClientStatus
  interest: InterestLevel
  engagement: number
  dateAdded: string
  lastContact: string
  propertyInterests: string[]
  notes?: string
  budget?: number
  agent?: string
}

const mockClients: Client[] = [
  { 
    id: '1',
    name: 'Alex Johnson', 
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Downtown',
    status: 'Active',
    interest: 'High', 
    engagement: 92,
    dateAdded: '2024-01-15',
    lastContact: '2024-01-20',
    propertyInterests: ['Luxury Condos', 'Penthouses'],
    notes: 'Looking for luxury properties in downtown area',
    budget: 1500000,
    agent: 'Sarah Johnson'
  },
  { 
    id: '2',
    name: 'Priya Das', 
    email: 'priya.das@email.com',
    phone: '+1 (555) 234-5678',
    location: 'Suburbs',
    status: 'Lead',
    interest: 'Medium', 
    engagement: 64,
    dateAdded: '2024-01-12',
    lastContact: '2024-01-18',
    propertyInterests: ['Family Homes', 'Townhouses'],
    notes: 'Family of four looking for suburban home',
    budget: 750000,
    agent: 'Mike Davis'
  },
  { 
    id: '3',
    name: 'Chen Wei', 
    email: 'chen.wei@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Waterfront',
    status: 'Prospect',
    interest: 'Low', 
    engagement: 38,
    dateAdded: '2024-01-08',
    lastContact: '2024-01-10',
    propertyInterests: ['Waterfront Properties'],
    notes: 'Interested in waterfront investment properties',
    budget: 2000000,
    agent: 'John Smith'
  }
]

const ITEMS_PER_PAGE = 12

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'All'>('All')
  const [interestFilter, setInterestFilter] = useState<InterestLevel | 'All'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const [form, setForm] = useState<Omit<Client, 'id' | 'dateAdded'>>({
    name: '',
    email: '',
    phone: '',
    location: '',
    status: 'Lead',
    interest: 'Medium',
    engagement: 0,
    lastContact: '',
    propertyInterests: [],
    notes: '',
    budget: 0,
    agent: ''
  })

  // Filter and search clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           client.agent?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'All' || client.status === statusFilter
      const matchesInterest = interestFilter === 'All' || client.interest === interestFilter
      return matchesSearch && matchesStatus && matchesInterest
    })
  }, [clients, searchQuery, statusFilter, interestFilter])

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE)
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Statistics
  const stats = useMemo(() => {
    const total = clients.length
    const active = clients.filter(c => c.status === 'Active').length
    const leads = clients.filter(c => c.status === 'Lead').length
    const avgEngagement = clients.reduce((sum, c) => sum + c.engagement, 0) / clients.length
    return { total, active, leads, avgEngagement: Math.round(avgEngagement) }
  }, [clients])

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      location: '',
      status: 'Lead',
      interest: 'Medium',
      engagement: 0,
      lastContact: '',
      propertyInterests: [],
      notes: '',
      budget: 0,
      agent: ''
    })
    setEditingClient(null)
  }

  const openCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const openEdit = (client: Client) => {
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      location: client.location,
      status: client.status,
      interest: client.interest,
      engagement: client.engagement,
      lastContact: client.lastContact,
      propertyInterests: client.propertyInterests,
      notes: client.notes || '',
      budget: client.budget || 0,
      agent: client.agent || ''
    })
    setEditingClient(client)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingClient) {
      // Update existing client
      setClients(prev => prev.map(c => 
        c.id === editingClient.id 
          ? { ...form, id: editingClient.id, dateAdded: editingClient.dateAdded }
          : c
      ))
      toast.success('Client updated successfully')
    } else {
      // Create new client
      const newClient: Client = {
        ...form,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString().split('T')[0]
      }
      setClients(prev => [...prev, newClient])
      toast.success('Client created successfully')
    }

    setShowModal(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id))
    setConfirmDelete(null)
    toast.success('Client deleted successfully')
  }

  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-300'
      case 'Lead': return 'bg-blue-500/20 text-blue-300'
      case 'Prospect': return 'bg-yellow-500/20 text-yellow-300'
      case 'Inactive': return 'bg-slate-500/20 text-slate-300'
      default: return 'bg-slate-500/20 text-slate-300'
    }
  }

  const getInterestColor = (interest: InterestLevel) => {
    switch (interest) {
      case 'High': return 'bg-red-500/20 text-red-300'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300'
      case 'Low': return 'bg-slate-500/20 text-slate-300'
      default: return 'bg-slate-500/20 text-slate-300'
    }
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'bg-emerald-500'
    if (engagement >= 60) return 'bg-yellow-500'
    if (engagement >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-emerald-200">Client Management</h1>
          <p className="text-slate-300">Manage client relationships, track engagement, and monitor leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-black/30 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-emerald-500/20 text-emerald-200' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                viewMode === 'table' 
                  ? 'bg-emerald-500/20 text-emerald-200' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Table
            </button>
          </div>
          <button 
            onClick={openCreate} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">Total Clients</div>
              <div className="text-xl font-semibold text-emerald-200">{stats.total}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">Active Clients</div>
              <div className="text-xl font-semibold text-emerald-200">{stats.active}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">New Leads</div>
              <div className="text-xl font-semibold text-blue-200">{stats.leads}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">Avg Engagement</div>
              <div className="text-xl font-semibold text-emerald-200">{stats.avgEngagement}%</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200">
            <Search size={16} className="text-emerald-300" />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              placeholder="Search clients..."
              className="w-full bg-transparent outline-none placeholder-slate-400"
              aria-label="Search clients"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e => { setStatusFilter(e.target.value as ClientStatus | 'All'); setCurrentPage(1) }}
            className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Filter by status"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Lead">Lead</option>
            <option value="Prospect">Prospect</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select 
            value={interestFilter} 
            onChange={e => { setInterestFilter(e.target.value as InterestLevel | 'All'); setCurrentPage(1) }}
            className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Filter by interest level"
          >
            <option value="All">All Interest</option>
            <option value="High">High Interest</option>
            <option value="Medium">Medium Interest</option>
            <option value="Low">Low Interest</option>
          </select>
        </div>
      </div>

      {/* Clients Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedClients.map((client) => (
            <motion.div 
              key={client.id}
              variants={cardVariant}
              initial="hidden"
              animate="show"
              className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg hover:shadow-emerald-500/10 transition-shadow cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-200 mb-1">{client.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Mail size={12} />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={12} />
                    <span>{client.location}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEdit(client) }}
                    className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                    aria-label={`Edit ${client.name}`}
                  >
                    <Edit size={12} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(client.id) }}
                    className="px-2 py-1 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                    aria-label={`Delete ${client.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getInterestColor(client.interest)}`}>
                  {client.interest}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Engagement</span>
                  <span className="text-slate-200 font-medium">{client.engagement}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${getEngagementColor(client.engagement)}`}
                    style={{ width: `${client.engagement}%` }}
                  />
                </div>
              </div>

              {client.budget && (
                <div className="text-sm text-slate-400">
                  Budget: <span className="text-emerald-300 font-medium">${client.budget.toLocaleString()}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-300 border-b border-white/10">
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Contact</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Interest</th>
                  <th className="text-center p-3 font-medium">Engagement</th>
                  <th className="text-left p-3 font-medium">Agent</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5"
                    onClick={() => setSelectedClient(client)}
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-slate-200">{client.name}</div>
                        <div className="text-xs text-slate-400">Added {client.dateAdded}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-300">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail size={12} />
                          <span className="text-xs">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={12} />
                          <span className="text-xs">{client.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{client.location}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getInterestColor(client.interest)}`}>
                        {client.interest}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/10 h-2 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getEngagementColor(client.engagement)}`}
                            style={{ width: `${client.engagement}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-300 w-8">{client.engagement}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{client.agent || 'Unassigned'}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEdit(client) }}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                          aria-label={`Edit ${client.name}`}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(client.id) }}
                          className="px-2 py-1 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                          aria-label={`Delete ${client.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} of {filteredClients.length} clients
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 text-sm text-slate-300">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-emerald-200">Client Details</h2>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 text-slate-400 hover:bg-white/20 hover:text-slate-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-slate-200 mb-2">{selectedClient.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail size={14} />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone size={14} />
                        <span>{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin size={14} />
                        <span>{selectedClient.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Status & Interest</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getInterestColor(selectedClient.interest)}`}>
                        {selectedClient.interest} Interest
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Engagement</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/10 h-3 rounded-full">
                        <div
                          className={`h-3 rounded-full ${getEngagementColor(selectedClient.engagement)}`}
                          style={{ width: `${selectedClient.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-200">{selectedClient.engagement}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Property Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedClient.propertyInterests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedClient.budget && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Budget</h4>
                      <div className="text-emerald-300 font-medium">${selectedClient.budget.toLocaleString()}</div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Timeline</h4>
                    <div className="space-y-1 text-sm text-slate-400">
                      <div>Added: {selectedClient.dateAdded}</div>
                      <div>Last Contact: {selectedClient.lastContact}</div>
                      {selectedClient.agent && <div>Agent: {selectedClient.agent}</div>}
                    </div>
                  </div>

                  {selectedClient.notes && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Notes</h4>
                      <div className="text-sm text-slate-400 bg-white/5 p-3 rounded-lg">
                        {selectedClient.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setSelectedClient(null); openEdit(selectedClient) }}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                >
                  Edit Client
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-emerald-200">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 text-slate-400 hover:bg-white/20 hover:text-slate-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                  <input 
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input 
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone *</label>
                  <input 
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                  <input 
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select 
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ClientStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Interest Level</label>
                  <select 
                    value={form.interest}
                    onChange={(e) => setForm({ ...form, interest: e.target.value as InterestLevel })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Engagement (%)</label>
                  <input 
                    type="number"
                    value={form.engagement}
                    onChange={(e) => setForm({ ...form, engagement: Math.min(100, Math.max(0, Number(e.target.value))) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="0-100"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Budget</label>
                  <input 
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter budget"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Contact</label>
                  <input 
                    type="date"
                    value={form.lastContact}
                    onChange={(e) => setForm({ ...form, lastContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Assigned Agent</label>
                  <input 
                    type="text"
                    value={form.agent}
                    onChange={(e) => setForm({ ...form, agent: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Agent name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Property Interests</label>
                  <input 
                    type="text"
                    value={form.propertyInterests.join(', ')}
                    onChange={(e) => setForm({ ...form, propertyInterests: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="e.g., Luxury Condos, Penthouses (comma-separated)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                  <textarea 
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 resize-none"
                    placeholder="Additional notes about the client"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                >
                  {editingClient ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-300 flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-200">Delete Client</h3>
                  <p className="text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this client? All associated data will be permanently removed.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                >
                  Delete Client
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
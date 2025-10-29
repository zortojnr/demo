import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit, Trash2, Home, DollarSign, Eye, 
  ChevronLeft, ChevronRight, Building, AlertCircle
} from 'lucide-react'
import { formatCurrency } from '../shared/config'
import { toast } from 'react-hot-toast'

type PropertyStatus = 'Listed' | 'Draft' | 'Sold' | 'Under Contract' | 'Off Market'
type PropertyType = 'House' | 'Condo' | 'Apartment' | 'Townhouse' | 'Commercial' | 'Land'

type Property = {
  id: string
  name: string
  type: PropertyType
  location: string
  price: number
  status: PropertyStatus
  bedrooms?: number
  bathrooms?: number
  sqft?: number
  description?: string
  agent?: string
  dateAdded: string
  images?: string[]
}

const mockProperties: Property[] = [
  { 
    id: '1', 
    name: 'Skyline Penthouse', 
    type: 'Condo', 
    location: 'Downtown', 
    price: 1250000, 
    status: 'Listed',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2500,
    description: 'Luxury penthouse with stunning city views',
    agent: 'John Smith',
    dateAdded: '2024-01-15'
  },
  { 
    id: '2', 
    name: 'Emerald Villa', 
    type: 'House', 
    location: 'Seaside', 
    price: 890000, 
    status: 'Draft',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    description: 'Beautiful villa with ocean views',
    agent: 'Sarah Johnson',
    dateAdded: '2024-01-10'
  },
  { 
    id: '3', 
    name: 'Modern Loft', 
    type: 'Apartment', 
    location: 'Arts District', 
    price: 650000, 
    status: 'Under Contract',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    description: 'Contemporary loft in trendy neighborhood',
    agent: 'Mike Davis',
    dateAdded: '2024-01-08'
  }
]

const ITEMS_PER_PAGE = 10

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [showModal, setShowModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'All'>('All')
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'All'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const [form, setForm] = useState<Omit<Property, 'id' | 'dateAdded'>>({
    name: '',
    type: 'House',
    location: '',
    price: 0,
    status: 'Draft',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    description: '',
    agent: ''
  })

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.agent?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'All' || property.status === statusFilter
      const matchesType = typeFilter === 'All' || property.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [properties, searchQuery, statusFilter, typeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Statistics
  const stats = useMemo(() => {
    const total = properties.length
    const listed = properties.filter(p => p.status === 'Listed').length
    const sold = properties.filter(p => p.status === 'Sold').length
    const totalValue = properties.reduce((sum, p) => sum + p.price, 0)
    return { total, listed, sold, totalValue }
  }, [properties])

  const resetForm = () => {
    setForm({
      name: '',
      type: 'House',
      location: '',
      price: 0,
      status: 'Draft',
      bedrooms: 0,
      bathrooms: 0,
      sqft: 0,
      description: '',
      agent: ''
    })
    setEditingProperty(null)
  }

  const openCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const openEdit = (property: Property) => {
    setForm({
      name: property.name,
      type: property.type,
      location: property.location,
      price: property.price,
      status: property.status,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      sqft: property.sqft || 0,
      description: property.description || '',
      agent: property.agent || ''
    })
    setEditingProperty(property)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || !form.location || !form.price) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingProperty) {
      // Update existing property
      setProperties(prev => prev.map(p => 
        p.id === editingProperty.id 
          ? { ...form, id: editingProperty.id, dateAdded: editingProperty.dateAdded }
          : p
      ))
      toast.success('Property updated successfully')
    } else {
      // Create new property
      const newProperty: Property = {
        ...form,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString().split('T')[0]
      }
      setProperties(prev => [...prev, newProperty])
      toast.success('Property created successfully')
    }

    setShowModal(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id))
    setConfirmDelete(null)
    toast.success('Property deleted successfully')
  }

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'Listed': return 'bg-emerald-500/20 text-emerald-300'
      case 'Draft': return 'bg-slate-500/20 text-slate-300'
      case 'Sold': return 'bg-blue-500/20 text-blue-300'
      case 'Under Contract': return 'bg-yellow-500/20 text-yellow-300'
      case 'Off Market': return 'bg-red-500/20 text-red-300'
      default: return 'bg-slate-500/20 text-slate-300'
    }
  }

  const adPreview = useMemo(() => {
    const p = selectedProperty
    if (!p) return 'Select a property to see the AI-generated marketing copy.'
    return `Experience ${p.type.toLowerCase()} living at ${p.name}, located in ${p.location}. ${p.bedrooms ? `${p.bedrooms} bedrooms, ${p.bathrooms} bathrooms, ` : ''}${p.sqft ? `${p.sqft.toLocaleString()} sq ft. ` : ''}Priced at ${formatCurrency(p.price)}. ${p.description || 'Contact us for more details.'}`
  }, [selectedProperty])

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-emerald-200">Property Management</h1>
          <p className="text-slate-300">Manage property listings, track sales, and generate marketing content.</p>
        </div>
        <button 
          onClick={openCreate} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
        >
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
              <Building size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">Total Properties</div>
              <div className="text-xl font-semibold text-emerald-200">{stats.total}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
              <Eye size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">Listed</div>
              <div className="text-xl font-semibold text-emerald-200">{stats.listed}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center">
              <Home size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">Sold</div>
              <div className="text-xl font-semibold text-blue-200">{stats.sold}</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
            <div>
              <div className="text-sm text-slate-300">Total Value</div>
              <div className="text-xl font-semibold text-emerald-200">{formatCurrency(stats.totalValue)}</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Properties Table */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
            <div className="flex-1 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200">
              <Search size={16} className="text-emerald-300" />
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                placeholder="Search properties..."
                className="w-full bg-transparent outline-none placeholder-slate-400"
                aria-label="Search properties"
              />
            </div>
            <select 
              value={statusFilter} 
              onChange={e => { setStatusFilter(e.target.value as PropertyStatus | 'All'); setCurrentPage(1) }}
              className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Filter by status"
            >
              <option value="All">All Status</option>
              <option value="Listed">Listed</option>
              <option value="Draft">Draft</option>
              <option value="Sold">Sold</option>
              <option value="Under Contract">Under Contract</option>
              <option value="Off Market">Off Market</option>
            </select>
            <select 
              value={typeFilter} 
              onChange={e => { setTypeFilter(e.target.value as PropertyType | 'All'); setCurrentPage(1) }}
              className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Filter by type"
            >
              <option value="All">All Types</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Apartment">Apartment</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
            </select>
          </div>

          {/* Properties Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-300 border-b border-white/10">
                  <th className="text-left p-3 font-medium">Property</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Agent</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProperties.map((property) => (
                  <tr 
                    key={property.id} 
                    className="hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-slate-200">{property.name}</div>
                        {property.bedrooms && property.bathrooms && (
                          <div className="text-xs text-slate-400">{property.bedrooms}bd • {property.bathrooms}ba</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{property.type}</td>
                    <td className="p-3 text-slate-300">{property.location}</td>
                    <td className="p-3 text-right font-medium text-emerald-200">{formatCurrency(property.price)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{property.agent || 'Unassigned'}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEdit(property) }}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                          aria-label={`Edit ${property.name}`}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(property.id) }}
                          className="px-2 py-1 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                          aria-label={`Delete ${property.name}`}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <div className="text-sm text-slate-400">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} of {filteredProperties.length} properties
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
        </div>

        {/* AI Ad Preview */}
        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
              <Eye size={16} />
            </div>
            <div>
              <div className="font-medium text-emerald-200">AI Marketing Copy</div>
              <div className="text-xs text-slate-400">Auto-generated content</div>
            </div>
          </div>
          <motion.div 
            key={selectedProperty?.id || 'none'}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-white/5 p-4 rounded-xl border border-white/10"
          >
            <div className="text-slate-200 text-sm leading-relaxed">{adPreview}</div>
          </motion.div>
          {selectedProperty && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-slate-400 mb-2">Property Details</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Added:</span>
                  <span className="text-slate-300">{selectedProperty.dateAdded}</span>
                </div>
                {selectedProperty.sqft && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-300">{selectedProperty.sqft.toLocaleString()} sq ft</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-emerald-200">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Property Name *</label>
                  <input 
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter property name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Property Type</label>
                  <select 
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                  <input 
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price *</label>
                  <input 
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Enter price"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bedrooms</label>
                  <input 
                    type="number"
                    value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Number of bedrooms"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bathrooms</label>
                  <input 
                    type="number"
                    value={form.bathrooms}
                    onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Number of bathrooms"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Square Feet</label>
                  <input 
                    type="number"
                    value={form.sqft}
                    onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    placeholder="Square footage"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select 
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Listed">Listed</option>
                    <option value="Under Contract">Under Contract</option>
                    <option value="Sold">Sold</option>
                    <option value="Off Market">Off Market</option>
                  </select>
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
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea 
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-slate-200 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 resize-none"
                    placeholder="Property description"
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
                  {editingProperty ? 'Update Property' : 'Create Property'}
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
                  <h3 className="text-lg font-semibold text-slate-200">Delete Property</h3>
                  <p className="text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this property? All associated data will be permanently removed.
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
                  Delete Property
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
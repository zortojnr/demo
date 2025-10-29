import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Eye, 
  Edit, 
  Trash2, 
  Upload,
  MapPin,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react'

// Enhanced Property type
interface Property {
  id: number
  name: string
  type: string
  price: string
  location: string
  status: 'Available' | 'Pending' | 'Sold'
  image: string
  bedrooms: number
  bathrooms: number
  area: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Mock property data with enhanced fields
const mockProperties: Property[] = [
  {
    id: 1,
    name: 'Modern Villa in Yola',
    type: 'Villa',
    price: '₦450,000',
    location: 'Yola, Adamawa',
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    area: '2,500 sq ft',
    description: 'Beautiful modern villa with stunning views and premium finishes.',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    name: 'Luxury Apartment',
    type: 'Apartment',
    price: '₦280,000',
    location: 'Abuja, FCT',
    status: 'Pending',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    area: '1,800 sq ft',
    description: 'Luxury apartment in the heart of Abuja with modern amenities.',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    name: 'Family House',
    type: 'House',
    price: '₦320,000',
    location: 'Lagos, Nigeria',
    status: 'Sold',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    bedrooms: 5,
    bathrooms: 4,
    area: '3,200 sq ft',
    description: 'Spacious family house perfect for large families.',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-22'
  }
]

export default function AgentProperties() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [newProperty, setNewProperty] = useState<{
    name: string
    type: string
    price: string
    location: string
    description: string
    bedrooms: string
    bathrooms: string
    area: string
    status: Property['status']
  }>({
    name: '',
    type: 'House',
    price: '',
    location: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    status: 'Available'
  })
  const [aiDescription, setAiDescription] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter
    const matchesType = typeFilter === 'All' || property.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-emerald-400 bg-emerald-500/20'
      case 'Pending': return 'text-yellow-400 bg-yellow-500/20'
      case 'Sold': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const generateAIDescription = async () => {
    setIsGeneratingAI(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    const aiText = `Discover this stunning ${newProperty.type.toLowerCase()} in ${newProperty.location}, featuring ${newProperty.bedrooms} spacious bedrooms and ${newProperty.bathrooms} modern bathrooms across ${newProperty.area}. This exceptional property offers contemporary living with premium finishes, perfect for families seeking comfort and style. Located in a prime area with excellent amenities and transport links.`
    setAiDescription(aiText)
    setIsGeneratingAI(false)
  }

  const handleAddProperty = () => {
    const property: Property = {
      id: Date.now(),
      name: newProperty.name,
      type: newProperty.type,
      price: newProperty.price,
      location: newProperty.location,
      status: newProperty.status,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      bedrooms: parseInt(newProperty.bedrooms) || 0,
      bathrooms: parseInt(newProperty.bathrooms) || 0,
      area: newProperty.area,
      description: aiDescription || newProperty.description,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    setProperties([...properties, property])
    resetForm()
    setShowAddModal(false)
  }

  const handleEditProperty = () => {
    if (!selectedProperty) return
    
    const updatedProperty: Property = {
      ...selectedProperty,
      name: newProperty.name,
      type: newProperty.type,
      price: newProperty.price,
      location: newProperty.location,
      status: newProperty.status,
      bedrooms: parseInt(newProperty.bedrooms) || 0,
      bathrooms: parseInt(newProperty.bathrooms) || 0,
      area: newProperty.area,
      description: aiDescription || newProperty.description,
      updatedAt: new Date().toISOString().split('T')[0]
    }
    
    setProperties(properties.map(p => p.id === selectedProperty.id ? updatedProperty : p))
    resetForm()
    setShowEditModal(false)
    setSelectedProperty(null)
  }

  const handleDeleteProperty = () => {
    if (!selectedProperty) return
    
    setProperties(properties.filter(p => p.id !== selectedProperty.id))
    setShowDeleteModal(false)
    setSelectedProperty(null)
  }

  const resetForm = () => {
    setNewProperty({
      name: '',
      type: 'House',
      price: '',
      location: '',
      description: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      status: 'Available'
    })
    setAiDescription('')
  }

  const openEditModal = (property: Property) => {
    setSelectedProperty(property)
    setNewProperty({
      name: property.name,
      type: property.type,
      price: property.price,
      location: property.location,
      description: property.description || '',
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area,
      status: property.status
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (property: Property) => {
    setSelectedProperty(property)
    setShowDeleteModal(true)
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
          <h1 className="text-3xl font-bold text-white mb-2">My Properties</h1>
          <p className="text-slate-400">Manage your property listings ({properties.length} total)</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
        >
          <Plus size={20} />
          Add Property
        </motion.button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-center justify-between"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
          >
            <option value="All">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Condo">Condo</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 border border-emerald-500/20 rounded-xl p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <Grid3X3 size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <List size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Properties Grid/List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }
      >
        {paginatedProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 ${
              viewMode === 'list' ? 'flex items-center gap-6 p-4' : 'p-0'
            }`}
          >
            <div className={viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'aspect-video'}>
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            <div className={viewMode === 'list' ? 'flex-1' : 'p-6'}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <MapPin size={14} />
                    {property.location}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <span>{property.bedrooms} bed</span>
                <span>{property.bathrooms} bath</span>
                <span>{property.area}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-emerald-400">{property.price}</div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors duration-300"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEditModal(property)}
                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors duration-300"
                    title="Edit Property"
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openDeleteModal(property)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-300"
                    title="Delete Property"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-black/40 border border-emerald-500/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500/10 transition-colors duration-300"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                currentPage === page
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-black/40 border border-emerald-500/20 text-white hover:bg-emerald-500/10'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-black/40 border border-emerald-500/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500/10 transition-colors duration-300"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Add Property Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-emerald-500/20 shadow-2xl"
            >
              <div className="p-6 border-b border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Add New Property</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Property Name</label>
                    <input
                      type="text"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="Enter property name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Property Type</label>
                    <select
                      value={newProperty.type}
                      onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Condo">Condo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
                    <input
                      type="text"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
            placeholder="₦450,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={newProperty.bedrooms}
                      onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      value={newProperty.bathrooms}
                      onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="3"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Area</label>
                  <input
                    type="text"
                    value={newProperty.area}
                    onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                    className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                    placeholder="2,500 sq ft"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">Description</label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateAIDescription}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors duration-300 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {isGeneratingAI ? 'Generating...' : 'Generate AI Description'}
                    </motion.button>
                  </div>
                  <textarea
                    value={aiDescription || newProperty.description}
                    onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300 resize-none"
                    placeholder="Enter property description..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Images</label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-dashed border-emerald-500/30 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors duration-300 cursor-pointer"
                  >
                    <Upload size={32} className="mx-auto text-emerald-400 mb-2" />
                    <div className="text-white font-medium mb-1">Upload Property Images</div>
                    <div className="text-slate-400 text-sm">Drag & drop or click to browse</div>
                  </motion.div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddProperty}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    Add Property
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Property Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-emerald-500/20 shadow-2xl"
            >
              <div className="p-6 border-b border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Edit Property</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditModal(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Property Name</label>
                    <input
                      type="text"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="Enter property name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Property Type</label>
                    <select
                      value={newProperty.type}
                      onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                    >
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Condo">Condo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
                    <input
                      type="text"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({...newProperty, price: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="₦450,000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={newProperty.status}
                      onChange={(e) => setNewProperty({...newProperty, status: e.target.value as 'Available' | 'Pending' | 'Sold'})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                    >
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={newProperty.bedrooms}
                      onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      value={newProperty.bathrooms}
                      onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Area</label>
                    <input
                      type="text"
                      value={newProperty.area}
                      onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      placeholder="2,500 sq ft"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">Description</label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateAIDescription}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors duration-300 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {isGeneratingAI ? 'Generating...' : 'Generate AI Description'}
                    </motion.button>
                  </div>
                  <textarea
                    value={aiDescription || newProperty.description}
                    onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300 resize-none"
                    placeholder="Enter property description..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditProperty}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    Update Property
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 rounded-2xl border border-red-500/20 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete Property</h3>
                    <p className="text-slate-400">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-6">
                  Are you sure you want to delete "{selectedProperty?.name}"? This will permanently remove the property from your listings.
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteProperty}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300"
                  >
                    Delete Property
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors duration-300"
                  >
                    Cancel
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
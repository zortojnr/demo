import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Library,
  Upload,
  Eye,
  Edit,
  Share,
  Download,
  Calendar,
  User,
  Tag,
  MoreVertical,
  Clock,
  CheckCircle,
  Send,
  Archive
} from 'lucide-react'
import { mockDocuments, documentTypeLabels, documentStatusLabels, documentStatusColors } from './mockData'
import type { Document, DocumentFilter, DocumentType, DocumentStatus } from './types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1] as [number, number, number, number]
    }
  }
}

export default function DocumentsHome() {
  const [documents] = useState<Document[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<DocumentFilter>({})
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = !searchTerm || 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = !filters.type || doc.type === filters.type
      const matchesStatus = !filters.status || doc.status === filters.status
      
      const matchesDateRange = !filters.dateRange || (
        new Date(doc.createdAt) >= new Date(filters.dateRange.start) &&
        new Date(doc.createdAt) <= new Date(filters.dateRange.end)
      )

      const matchesTags = !filters.tags?.length || 
        filters.tags.some(tag => doc.tags.includes(tag))

      return matchesSearch && matchesType && matchesStatus && matchesDateRange && matchesTags
    })

    // Sort documents
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'date':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [documents, searchTerm, filters, sortBy, sortOrder])

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'draft': return <Edit size={16} />
      case 'generated': return <FileText size={16} />
      case 'sent': return <Send size={16} />
      case 'signed': return <CheckCircle size={16} />
      case 'archived': return <Archive size={16} />
      default: return <FileText size={16} />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Documents</h1>
            <p className="text-slate-400">Manage contracts, proposals, and reports</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link to="/agent/documents/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                <Plus size={20} />
                New Document
              </motion.button>
            </Link>
            
            <Link to="/agent/documents/library">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-white rounded-xl font-medium transition-all duration-300 border border-slate-600/50"
              >
                <Library size={20} />
                Template Library
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-white rounded-xl font-medium transition-all duration-300 border border-slate-600/50"
            >
              <Upload size={20} />
              Upload Template
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-500/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search documents by name, client, property, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                showFilters 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' 
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/70'
              }`}
            >
              <Filter size={20} />
              Filters
            </motion.button>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-600/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-slate-600/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Document Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Document Type</label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as DocumentType || undefined }))}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="">All Types</option>
                      {Object.entries(documentTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as DocumentStatus || undefined }))}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="">All Statuses</option>
                      {Object.entries(documentStatusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="date">Date Modified</option>
                      <option value="name">Name</option>
                      <option value="status">Status</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results Summary */}
      <motion.div variants={itemVariants} className="mb-6">
        <p className="text-slate-400">
          Showing {filteredDocuments.length} of {documents.length} documents
        </p>
      </motion.div>

      {/* Documents Grid/List */}
      <motion.div variants={itemVariants}>
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={64} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No documents found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
            <Link to="/agent/documents/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300"
              >
                Create Your First Document
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            <AnimatePresence>
              {filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.05 }}
                  className={`bg-black/20 backdrop-blur-sm rounded-2xl border border-slate-500/20 hover:border-slate-400/30 transition-all duration-300 group ${
                    viewMode === 'list' ? 'p-4' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <FileText size={20} className="text-emerald-400" />
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${documentStatusColors[document.status]}`}>
                              {getStatusIcon(document.status)}
                              {documentStatusLabels[document.status]}
                            </span>
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 hover:bg-slate-700/50 rounded-lg">
                          <MoreVertical size={16} className="text-slate-400" />
                        </button>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
                        {document.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar size={14} />
                          {formatDate(document.updatedAt)}
                        </div>
                        {document.clientName && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <User size={14} />
                            {document.clientName}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <FileText size={14} />
                          {documentTypeLabels[document.type]}
                        </div>
                      </div>

                      {document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {document.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                          {document.tags.length > 3 && (
                            <span className="text-xs text-slate-400">+{document.tags.length - 3} more</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock size={14} />
                          {document.metadata.readingTime} min read
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/agent/documents/${document.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-slate-700/50 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-all duration-300"
                            >
                              <Eye size={16} />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-slate-700/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all duration-300"
                          >
                            <Share size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-slate-700/50 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 rounded-lg transition-all duration-300"
                          >
                            <Download size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <FileText size={20} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate group-hover:text-emerald-400 transition-colors duration-300">
                            {document.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{documentTypeLabels[document.type]}</span>
                            {document.clientName && (
                              <>
                                <span>•</span>
                                <span>{document.clientName}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatDate(document.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${documentStatusColors[document.status]}`}>
                          {getStatusIcon(document.status)}
                          {documentStatusLabels[document.status]}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link to={`/agent/documents/${document.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-slate-700/50 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-all duration-300"
                            >
                              <Eye size={16} />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-slate-700/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all duration-300"
                          >
                            <Share size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-slate-700/50 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 rounded-lg transition-all duration-300"
                          >
                            <Download size={16} />
                          </motion.button>
                          <button className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors duration-300">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
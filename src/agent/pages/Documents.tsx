import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Eye,
  Trash2,
  Edit,
  Calendar,
  User,
  Sparkles,
  X,
  CheckCircle,
  Star
} from 'lucide-react'

// Mock documents data
const mockDocuments = [
  {
    id: 1,
    name: 'Property Purchase Agreement - Villa Paradise',
    type: 'Contract',
    size: '2.4 MB',
    date: '2024-01-15',
    status: 'Completed',
    client: 'John Smith',
    category: 'contracts',
    starred: true
  },
  {
    id: 2,
    name: 'Market Analysis Report Q1 2024',
    type: 'Report',
    size: '1.8 MB',
    date: '2024-01-10',
    status: 'Draft',
    client: 'Internal',
    category: 'reports',
    starred: false
  },
  {
    id: 3,
    name: 'Client Invoice - Sarah Johnson',
    type: 'Invoice',
    size: '0.5 MB',
    date: '2024-01-08',
    status: 'Sent',
    client: 'Sarah Johnson',
    category: 'invoices',
    starred: false
  },
  {
    id: 4,
    name: 'Property Inspection Checklist',
    type: 'Checklist',
    size: '0.3 MB',
    date: '2024-01-05',
    status: 'Template',
    client: 'Template',
    category: 'templates',
    starred: true
  }
]

const documentTypes = [
  { id: 'contract', name: 'Purchase Agreement', icon: '📄', description: 'Legal property purchase contracts' },
  { id: 'invoice', name: 'Invoice', icon: '💰', description: 'Client billing and payment documents' },
  { id: 'report', name: 'Market Report', icon: '📊', description: 'Property market analysis reports' },
  { id: 'checklist', name: 'Inspection Checklist', icon: '✅', description: 'Property inspection forms' },
  { id: 'letter', name: 'Offer Letter', icon: '💌', description: 'Property offer and negotiation letters' },
  { id: 'disclosure', name: 'Property Disclosure', icon: '📋', description: 'Property condition disclosures' }
]

export default function AgentDocuments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [documents] = useState(mockDocuments)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || doc.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
      case 'draft': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'sent': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'template': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'contract': return '📄'
      case 'report': return '📊'
      case 'invoice': return '💰'
      case 'checklist': return '✅'
      default: return '📄'
    }
  }

  const generateDocument = async () => {
    if (!selectedDocType) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate document generation with progress
    const steps = [
      { progress: 20, message: 'Analyzing property data...' },
      { progress: 40, message: 'Generating content...' },
      { progress: 60, message: 'Formatting document...' },
      { progress: 80, message: 'Adding legal clauses...' },
      { progress: 100, message: 'Document ready!' }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setGenerationProgress(step.progress)
    }

    setIsGenerating(false)
    setShowGenerateModal(false)
    setShowSuccess(true)
    setSelectedDocType('')
    setGenerationProgress(0)

    setTimeout(() => setShowSuccess(false), 3000)
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
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="text-emerald-400" />
            Documents
          </h1>
          <p className="text-slate-400">Manage contracts, reports, and AI-generated documents</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
          >
            <Upload size={16} />
            Upload
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300"
          >
            <Sparkles size={16} />
            Generate Document (AI)
          </motion.button>
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
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
          >
            <option value="all">All Categories</option>
            <option value="contracts">Contracts</option>
            <option value="reports">Reports</option>
            <option value="invoices">Invoices</option>
            <option value="templates">Templates</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="template">Template</option>
          </select>
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-500/10 border-b border-emerald-500/20">
              <tr>
                <th className="text-left p-4 text-emerald-300 font-medium">Document</th>
                <th className="text-left p-4 text-emerald-300 font-medium">Type</th>
                <th className="text-left p-4 text-emerald-300 font-medium">Client</th>
                <th className="text-left p-4 text-emerald-300 font-medium">Status</th>
                <th className="text-left p-4 text-emerald-300 font-medium">Date</th>
                <th className="text-left p-4 text-emerald-300 font-medium">Size</th>
                <th className="text-left p-4 text-emerald-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc, index) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-slate-700/50 hover:bg-emerald-500/5 transition-colors duration-300"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getFileIcon(doc.type)}</div>
                      <div>
                        <div className="text-white font-medium flex items-center gap-2">
                          {doc.name}
                          {doc.starred && <Star size={14} className="text-yellow-400 fill-current" />}
                        </div>
                        <div className="text-slate-400 text-sm">{doc.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-slate-500/20 text-slate-300 rounded-full text-sm">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User size={14} />
                      {doc.client}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar size={14} />
                      {doc.date}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{doc.size}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors duration-300"
                      >
                        <Eye size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors duration-300"
                      >
                        <Download size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors duration-300"
                      >
                        <Edit size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-300"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Generate Document Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isGenerating && setShowGenerateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-emerald-500/20 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Generate Document with AI</h2>
                  </div>
                  {!isGenerating && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowGenerateModal(false)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-300"
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {isGenerating ? (
                  <div className="text-center space-y-6">
                    <div className="text-lg font-medium text-white">Generating your document...</div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${generationProgress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      />
                    </div>
                    
                    <div className="text-slate-400">{generationProgress}% Complete</div>
                    
                    {/* Animated Sparkles */}
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={48} className="text-emerald-400" />
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-slate-400">
                      Select the type of document you'd like to generate using AI. Our system will create a professional document tailored to your needs.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documentTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDocType(type.id)}
                          className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                            selectedDocType === type.id
                              ? 'border-emerald-500/50 bg-emerald-500/10'
                              : 'border-slate-500/20 bg-black/20 hover:border-slate-500/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{type.icon}</span>
                            <span className="font-medium text-white">{type.name}</span>
                          </div>
                          <p className="text-sm text-slate-400">{type.description}</p>
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowGenerateModal(false)}
                        className="px-6 py-3 bg-slate-500/20 text-slate-300 rounded-xl hover:bg-slate-500/30 transition-colors duration-300"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateDocument}
                        disabled={!selectedDocType}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-medium transition-all duration-300"
                      >
                        Generate Document
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-emerald-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle size={24} />
            <div>
              <div className="font-medium">Document Generated!</div>
              <div className="text-sm opacity-90">Your document is ready for download</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
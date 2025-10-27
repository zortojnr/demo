import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Copy, 
  Share, 
  Wand2, 
  Target, 
  Image as ImageIcon,
  Video,
  FileText,
  CheckCircle,
  RefreshCw,
  Eye
} from 'lucide-react'

// Mock AI-generated ad copy templates
const adTemplates = {
  facebook: [
    "🏠 STUNNING {propertyType} ALERT! 🏠\n\nDiscover your dream home in {location}! This beautiful {propertyType} offers everything you've been searching for.\n\n✨ Perfect for {audience}\n💰 Competitive pricing\n📍 Prime location\n\n#RealEstate #DreamHome #HomeForSale",
    "🔥 HOT PROPERTY ALERT! 🔥\n\nDon't miss out on this incredible {propertyType} in {location}! \n\n🏡 {description}\n💎 Exclusive listing\n⏰ Limited time offer\n\nContact us today before it's gone!\n\n#PropertyAlert #RealEstate #Investment"
  ],
  instagram: [
    "✨ New Listing Alert ✨\n\nFall in love with this gorgeous {propertyType} in {location} 💕\n\nSwipe to see more stunning photos! 📸\n\n#NewListing #RealEstate #DreamHome #Property #Investment #Home #Luxury",
    "🏠 Your next home is waiting! 🏠\n\nThis beautiful {propertyType} in {location} is perfect for {audience}.\n\n📱 DM us for more details\n🔗 Link in bio\n\n#RealEstate #HomeForSale #Property #Investment"
  ],
  website: [
    "Discover Your Perfect Home\n\nThis exceptional {propertyType} in {location} represents the perfect blend of comfort and style. Designed with {audience} in mind, this property offers unparalleled value in today's market.\n\nKey Features:\n• {description}\n• Prime location\n• Competitive pricing\n• Move-in ready\n\nSchedule your viewing today!",
    "Exclusive Property Opportunity\n\nWe're excited to present this remarkable {propertyType} in the heart of {location}. This property is ideal for {audience} seeking quality and value.\n\n{description}\n\nDon't let this opportunity pass you by. Contact our team for a private showing."
  ]
}

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'blue' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'pink' },
  { id: 'website', name: 'Website', icon: '🌐', color: 'emerald' }
]

const audiences = [
  'First-time buyers',
  'Young professionals',
  'Growing families',
  'Empty nesters',
  'Investors',
  'Luxury buyers'
]

export default function AgentMarketing() {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'House',
    location: '',
    description: '',
    audience: 'First-time buyers',
    platform: 'facebook'
  })
  const [generatedAd, setGeneratedAd] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedAd, setCopiedAd] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const generateAd = async () => {
    if (!formData.propertyName || !formData.location) return

    setIsGenerating(true)
    setGeneratedAd('')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const templates = adTemplates[formData.platform as keyof typeof adTemplates]
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    const personalizedAd = template
      .replace(/{propertyType}/g, formData.propertyType)
      .replace(/{location}/g, formData.location)
      .replace(/{audience}/g, formData.audience.toLowerCase())
      .replace(/{description}/g, formData.description || 'Modern amenities and beautiful design')
    
    setIsGenerating(false)
    setIsTyping(true)
    
    // Typing effect
    let currentText = ''
    const words = personalizedAd.split(' ')
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i]
      setGeneratedAd(currentText)
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    setIsTyping(false)
  }

  const copyToClipboard = async () => {
    if (generatedAd) {
      await navigator.clipboard.writeText(generatedAd)
      setCopiedAd(true)
      setTimeout(() => setCopiedAd(false), 2000)
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'border-blue-500/30 bg-blue-500/10 text-blue-300'
      case 'instagram': return 'border-pink-500/30 bg-pink-500/10 text-pink-300'
      case 'website': return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      default: return 'border-slate-500/30 bg-slate-500/10 text-slate-300'
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
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="text-emerald-400" />
            AI Marketing
          </h1>
          <p className="text-slate-400">Generate compelling property ads with AI</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Wand2 size={16} />
          Powered by Homekey AI
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Target className="text-emerald-400" />
              Property Details
            </h2>
            
            <div className="space-y-4">
              {/* Property Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                  placeholder="e.g., Luxury Villa Paradise"
                  className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                >
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Victoria Island, Lagos"
                  className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Key Features (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., 4 bedrooms, swimming pool, modern kitchen..."
                  rows={3}
                  className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300 resize-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Audience
                </label>
                <select
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                >
                  {audiences.map(audience => (
                    <option key={audience} value={audience}>{audience}</option>
                  ))}
                </select>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Platform
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map(platform => (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, platform: platform.id })}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        formData.platform === platform.id
                          ? getPlatformColor(platform.id)
                          : 'border-slate-500/20 bg-black/20 text-slate-400 hover:border-slate-500/40'
                      }`}
                    >
                      <div className="text-2xl mb-1">{platform.icon}</div>
                      <div className="text-sm font-medium">{platform.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateAd}
                disabled={isGenerating || !formData.propertyName || !formData.location}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Ad Copy
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Generated Ad Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="text-emerald-400" />
                Generated Ad Copy
              </h2>
              {generatedAd && (
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors duration-300"
                  >
                    <Eye size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors duration-300"
                  >
                    {copiedAd ? <CheckCircle size={16} /> : <Copy size={16} />}
                  </motion.button>
                </div>
              )}
            </div>

            <div className="min-h-[300px] p-4 bg-black/60 rounded-xl border border-slate-500/20">
              {generatedAd ? (
                <div className="space-y-4">
                  <div className="text-white whitespace-pre-wrap leading-relaxed">
                    {generatedAd}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-emerald-400"
                      >
                        |
                      </motion.span>
                    )}
                  </div>
                  
                  {!isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 pt-4 border-t border-slate-500/20"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors duration-300"
                      >
                        {copiedAd ? <CheckCircle size={16} /> : <Copy size={16} />}
                        {copiedAd ? 'Copied!' : 'Copy Ad'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                      >
                        <Share size={16} />
                        Publish
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateAd}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors duration-300"
                      >
                        <RefreshCw size={16} />
                        Regenerate
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Sparkles size={48} className="mb-4 opacity-50" />
                  <p className="text-center">
                    Fill in the property details and click "Generate Ad Copy" to create compelling marketing content with AI.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-xl text-center"
            >
              <ImageIcon size={24} className="mx-auto text-emerald-400 mb-2" />
              <div className="text-sm font-medium text-white">Generate Images</div>
              <div className="text-xs text-slate-400 mt-1">AI property visuals</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-black/40 backdrop-blur-xl border border-blue-500/20 rounded-xl text-center"
            >
              <Video size={24} className="mx-auto text-blue-400 mb-2" />
              <div className="text-sm font-medium text-white">Create Video</div>
              <div className="text-xs text-slate-400 mt-1">Property showcase</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Platform Preview Modal */}
      <AnimatePresence>
        {showPreview && generatedAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-slate-900 rounded-2xl border border-emerald-500/20 shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-emerald-500/20">
                <h3 className="text-lg font-semibold text-white">
                  {platforms.find(p => p.id === formData.platform)?.name} Preview
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-black/60 rounded-lg p-4 text-white text-sm whitespace-pre-wrap">
                  {generatedAd}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
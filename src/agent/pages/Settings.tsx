import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Camera, 
  Save, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Key, 
  Globe,
  Palette,
  Monitor,
  CheckCircle,
  Settings as SettingsIcon,
  Eye,
  EyeOff
} from 'lucide-react'

export default function AgentSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const [profileData, setProfileData] = useState({
    fullName: 'John Smith',
    email: 'john.smith@homekey.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    agencyName: 'Homekey Global Investment Ltd',
    bio: 'Experienced real estate agent specializing in luxury properties and commercial investments.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    weeklyReports: true,
    clientUpdates: true
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginAlerts: true
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSaving(false)
    setSaveSuccess(true)
    
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'profile') {
      setProfileData(prev => ({ ...prev, [field]: value }))
    } else if (section === 'notifications') {
      setNotifications(prev => ({ ...prev, [field]: value }))
    } else if (section === 'security') {
      setSecurity(prev => ({ ...prev, [field]: value }))
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
            <SettingsIcon className="text-emerald-400" />
            Settings
          </h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-medium transition-all duration-300"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save size={16} />
              </motion.div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.name}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/30"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-300"
                      >
                        <Camera size={16} />
                      </motion.button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{profileData.fullName}</h3>
                      <p className="text-slate-400">{profileData.agencyName}</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                      >
                        Change Photo
                      </motion.button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) => handleInputChange('profile', 'fullName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Agency Name
                    </label>
                    <div className="relative">
                      <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={profileData.agencyName}
                        onChange={(e) => handleInputChange('profile', 'agencyName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-black/40">
                        <div>
                          <div className="text-white font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-slate-400 text-sm">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'pushNotifications' && 'Browser and mobile push notifications'}
                            {key === 'smsNotifications' && 'Text message notifications'}
                            {key === 'marketingEmails' && 'Marketing and promotional emails'}
                            {key === 'weeklyReports' && 'Weekly performance reports'}
                            {key === 'clientUpdates' && 'Client activity updates'}
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInputChange('notifications', key, !value)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            value ? 'bg-emerald-500' : 'bg-slate-600'
                          }`}
                        >
                          <motion.div
                            animate={{ x: value ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                          />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  
                  {/* Password Change */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Change Password</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Key size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={security.currentPassword}
                          onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-300"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={security.newPassword}
                          onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={security.confirmPassword}
                          onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Security Options</h3>
                    
                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/40">
                      <div>
                        <div className="text-white font-medium">Two-Factor Authentication</div>
                        <div className="text-slate-400 text-sm">Add an extra layer of security</div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange('security', 'twoFactorAuth', !security.twoFactorAuth)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          security.twoFactorAuth ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: security.twoFactorAuth ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                        />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/40">
                      <div>
                        <div className="text-white font-medium">Login Alerts</div>
                        <div className="text-slate-400 text-sm">Get notified of new login attempts</div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInputChange('security', 'loginAlerts', !security.loginAlerts)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          security.loginAlerts ? 'bg-emerald-500' : 'bg-slate-600'
                        }`}
                      >
                        <motion.div
                          animate={{ x: security.loginAlerts ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg"
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Appearance Settings</h2>
                  
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Theme</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'dark', name: 'Dark Mode', icon: Moon, active: isDarkMode },
                        { id: 'light', name: 'Light Mode', icon: Sun, active: false },
                        { id: 'system', name: 'System', icon: Monitor, active: false }
                      ].map((theme) => (
                        <motion.button
                          key={theme.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => theme.id === 'dark' && setIsDarkMode(true)}
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            theme.active
                              ? 'border-emerald-500/50 bg-emerald-500/10'
                              : 'border-slate-500/20 bg-black/20 hover:border-slate-500/40'
                          }`}
                        >
                          <theme.icon size={24} className="mx-auto mb-2 text-slate-400" />
                          <div className="text-white font-medium">{theme.name}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Language & Region</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Language
                      </label>
                      <div className="relative">
                        <Globe size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <select className="w-full pl-10 pr-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300">
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="es">Spanish</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-emerald-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle size={24} />
            <div>
              <div className="font-medium">Settings Saved!</div>
              <div className="text-sm opacity-90">Your changes have been updated</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
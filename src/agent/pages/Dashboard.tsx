import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Plus,
  UserPlus,
  Sparkles,
  BarChart3,
  ChevronRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for charts
const propertyViewsData = [
  { name: 'Mon', views: 45 },
  { name: 'Tue', views: 52 },
  { name: 'Wed', views: 38 },
  { name: 'Thu', views: 67 },
  { name: 'Fri', views: 84 },
  { name: 'Sat', views: 91 },
  { name: 'Sun', views: 73 },
]

// removed unused revenueData

const stats = [
  {
    title: 'Total Properties',
    value: '24',
    change: '+12%',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    title: 'Active Clients',
    value: '156',
    change: '+8%',
    icon: Users,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Monthly Leads',
    value: '89',
    change: '+23%',
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Revenue / Deals',
    value: '₦125K',
    change: '-3%',
    icon: DollarSign,
    color: 'from-gold-500 to-gold-600'
  }
]

const recentActivity = [
  { 
    action: 'New property listing added', 
    time: '2 hours ago', 
    status: 'Active',
    icon: Home,
    color: 'bg-emerald-500/20'
  },
  { 
    action: 'Client meeting scheduled', 
    time: '4 hours ago', 
    status: 'Pending',
    icon: Users,
    color: 'bg-blue-500/20'
  },
  { 
    action: 'Marketing campaign launched', 
    time: '6 hours ago', 
    status: 'Live',
    icon: Sparkles,
    color: 'bg-purple-500/20'
  },
  { 
    action: 'Document generated', 
    time: '1 day ago', 
    status: 'Complete',
    icon: Calendar,
    color: 'bg-gold-500/20'
  },
]

const quickActions = [
  {
    title: 'Add New Property',
    description: 'List a new property for sale or rent',
    icon: Plus,
    color: 'bg-emerald-500/20'
  },
  {
    title: 'Schedule Meeting',
    description: 'Book a client consultation',
    icon: UserPlus,
    color: 'bg-blue-500/20'
  },
  {
    title: 'Generate AI Ad',
    description: 'Create marketing content',
    icon: Sparkles,
    color: 'bg-purple-500/20'
  },
  {
    title: 'View Analytics',
    description: 'Check performance metrics',
    icon: BarChart3,
    color: 'bg-gold-500/20'
  }
]

const marketInsights = [
  {
    title: 'Property Market Trend',
    change: '+5.2%',
    trend: 'up',
    description: 'Average property prices have increased by 5.2% this month compared to last month.'
  },
  {
    title: 'Rental Demand',
    change: '+12%',
    trend: 'up',
    description: 'Rental inquiries are up 12% with high demand in residential areas.'
  },
  {
    title: 'Market Competition',
    change: 'Stable',
    trend: 'stable',
    description: 'Competition remains steady with consistent listing activity across the region.'
  }
]

export default function AgentDashboard() {
  return (
    <div className="max-w-8xl mx-auto space-y-8 lg:space-y-12">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-6 lg:py-10"
      >
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-gold-400 bg-clip-text text-transparent mb-4 lg:mb-6">
          Welcome back, Sarah 👋
        </h1>
        <p className="text-slate-400 text-lg lg:text-xl xl:text-2xl font-medium">Here's what's happening with your properties today</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4 lg:mb-6">
                <div className={`p-3 lg:p-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className={`text-xs lg:text-sm px-3 py-1.5 rounded-full font-medium ${
                  stat.change.startsWith('+') 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                  {stat.value}
                </h3>
                <p className="text-sm lg:text-base text-slate-400 group-hover:text-slate-300 transition-colors duration-300 font-medium">
                  {stat.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="p-6 lg:p-8 border-b border-emerald-500/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-emerald-300">Recent Activity</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm lg:text-base text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
              >
                View All
              </motion.button>
            </div>
          </div>
          <div className="p-6 lg:p-8 space-y-4 lg:space-y-6">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="group flex items-start gap-4 lg:gap-6 p-4 lg:p-5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className={`p-2.5 lg:p-3 rounded-lg ${activity.color} flex-shrink-0`}>
                  <activity.icon size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base text-slate-200 group-hover:text-white transition-colors duration-300 font-medium">
                    {activity.action}
                  </p>
                  <p className="text-xs lg:text-sm text-slate-400 mt-1 lg:mt-2">
                    {activity.time}
                  </p>
                </div>
                <div className="text-xs lg:text-sm text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  {activity.status}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="p-6 lg:p-8 border-b border-emerald-500/20">
            <h2 className="text-xl lg:text-2xl font-bold text-emerald-300">Quick Actions</h2>
          </div>
          <div className="p-6 lg:p-8 space-y-4 lg:space-y-5">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group flex items-center gap-4 lg:gap-5 p-4 lg:p-5 rounded-xl bg-slate-800/50 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-gold-500/10 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 text-left"
              >
                <div className={`p-3 lg:p-3.5 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm lg:text-base font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 mt-1">
                    {action.description}
                  </p>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="p-6 lg:p-8 border-b border-emerald-500/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl lg:text-2xl font-bold text-emerald-300">Performance Overview</h2>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs lg:text-sm text-slate-400">Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold-400"></div>
                  <span className="text-xs lg:text-sm text-slate-400">Listings</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 lg:p-8">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={propertyViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #10B981',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="p-6 lg:p-8 border-b border-emerald-500/20">
            <h2 className="text-xl lg:text-2xl font-bold text-emerald-300">Market Insights</h2>
          </div>
          <div className="p-6 lg:p-8 space-y-4 lg:space-y-6">
            {marketInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="group p-4 lg:p-5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3 lg:mb-4">
                  <h3 className="text-sm lg:text-base font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
                    {insight.title}
                  </h3>
                  <div className={`text-xs lg:text-sm px-2.5 py-1 rounded-full font-medium ${
                    insight.trend === 'up' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : insight.trend === 'down'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {insight.change}
                  </div>
                </div>
                <p className="text-xs lg:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
                  {insight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  DollarSign, 
  Download,
  Sparkles,
  Target,
  Award,
  Clock
} from 'lucide-react'

// Mock analytics data
const mockData = {
  overview: {
    totalViews: 12847,
    viewsChange: 15.3,
    conversionRate: 3.2,
    conversionChange: -2.1,
    avgEngagement: 4.7,
    engagementChange: 8.9,
    revenue: 245000,
    revenueChange: 22.5
  },
  propertyViews: [
    { month: 'Jan', views: 2400, leads: 78 },
    { month: 'Feb', views: 3200, leads: 95 },
    { month: 'Mar', views: 2800, leads: 82 },
    { month: 'Apr', views: 4100, leads: 125 },
    { month: 'May', views: 3800, leads: 118 },
    { month: 'Jun', views: 4500, leads: 142 }
  ],
  topProperties: [
    { name: 'Luxury Villa Paradise', views: 1250, leads: 45, conversion: 3.6 },
    { name: 'Modern Downtown Apartment', views: 980, leads: 38, conversion: 3.9 },
    { name: 'Family House Suburbia', views: 850, leads: 29, conversion: 3.4 },
    { name: 'Beachfront Condo', views: 720, leads: 25, conversion: 3.5 },
    { name: 'City Center Penthouse', views: 650, leads: 22, conversion: 3.4 }
  ],
  insights: [
    {
      type: 'trend',
      title: 'Peak Viewing Hours',
      description: '3-bedroom apartments in Victoria Island have 20% higher engagement between 6-8 PM',
      impact: 'high',
      action: 'Schedule social media posts during peak hours'
    },
    {
      type: 'opportunity',
      title: 'Underperforming Listings',
      description: 'Properties priced above ₦50M show 35% lower engagement rates',
      impact: 'medium',
      action: 'Consider price adjustments or enhanced marketing'
    },
    {
      type: 'success',
      title: 'Top Converting Feature',
      description: 'Properties with virtual tours convert 45% better than photo-only listings',
      impact: 'high',
      action: 'Add virtual tours to more properties'
    }
  ]
}

export default function AgentAnalytics() {
  const [timeFilter, setTimeFilter] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('views')

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-emerald-400' : 'text-red-400'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return 'border-blue-500/30 bg-blue-500/10'
      case 'opportunity': return 'border-yellow-500/30 bg-yellow-500/10'
      case 'success': return 'border-emerald-500/30 bg-emerald-500/10'
      default: return 'border-slate-500/30 bg-slate-500/10'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="text-blue-400" />
      case 'opportunity': return <Target className="text-yellow-400" />
      case 'success': return <Award className="text-emerald-400" />
      default: return <BarChart3 className="text-slate-400" />
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
            <BarChart3 className="text-emerald-400" />
            Analytics
          </h1>
          <p className="text-slate-400">Track performance and discover insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-emerald-500/20 rounded-lg text-white focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="custom">Custom Range</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors duration-300"
          >
            <Download size={16} />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Total Views',
            value: mockData.overview.totalViews,
            change: mockData.overview.viewsChange,
            icon: Eye,
            color: 'emerald'
          },
          {
            title: 'Conversion Rate',
            value: `${mockData.overview.conversionRate}%`,
            change: mockData.overview.conversionChange,
            icon: Target,
            color: 'blue'
          },
          {
            title: 'Avg. Engagement',
            value: `${mockData.overview.avgEngagement}/5`,
            change: mockData.overview.engagementChange,
            icon: Users,
            color: 'purple'
          },
          {
            title: 'Revenue',
            value: `₦${formatNumber(mockData.overview.revenue)}`,
            change: mockData.overview.revenueChange,
            icon: DollarSign,
            color: 'gold'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${metric.color}-500/20`}>
                <metric.icon size={24} className={`text-${metric.color}-400`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${getChangeColor(metric.change)}`}>
                {getChangeIcon(metric.change)}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-slate-400 text-sm">{metric.title}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Views Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Property Views Trend</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMetric('views')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 ${
                  selectedMetric === 'views'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setSelectedMetric('leads')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 ${
                  selectedMetric === 'leads'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Leads
              </button>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {mockData.propertyViews.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-8 text-slate-400 text-sm">{data.month}</div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-slate-700/50 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(selectedMetric === 'views' ? data.views : data.leads) / 
                                (selectedMetric === 'views' ? 4500 : 150) * 100}%` 
                      }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className={`h-full ${
                        selectedMetric === 'views' 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-400'
                      }`}
                    />
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                    {selectedMetric === 'views' ? formatNumber(data.views) : data.leads}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Top Performing Properties</h3>
          <div className="space-y-4">
            {mockData.topProperties.map((property, index) => (
              <motion.div
                key={property.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-black/40 hover:bg-emerald-500/5 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{property.name}</div>
                    <div className="text-slate-400 text-xs">
                      {formatNumber(property.views)} views • {property.leads} leads
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-sm">{property.conversion}%</div>
                  <div className="text-slate-400 text-xs">conversion</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-emerald-400" />
          <h3 className="text-xl font-semibold text-white">AI Predictive Insights</h3>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
            Powered by Homekey AI
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockData.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl border ${getInsightColor(insight.type)} transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-4">
                {getInsightIcon(insight.type)}
                <span className="text-white font-medium">{insight.title}</span>
              </div>
              
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {insight.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Impact Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'high' 
                      ? 'bg-red-500/20 text-red-300' 
                      : insight.impact === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {insight.impact}
                  </span>
                </div>
                
                <div className="p-3 bg-black/40 rounded-lg">
                  <div className="text-slate-400 text-xs mb-1">Recommended Action:</div>
                  <div className="text-white text-sm">{insight.action}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">Performance Summary</h3>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock size={16} />
            Updated 5 minutes ago
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">A+</div>
            <div className="text-white font-medium mb-1">Overall Grade</div>
            <div className="text-slate-400 text-sm">Top 10% of agents</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">85%</div>
            <div className="text-white font-medium mb-1">Goal Achievement</div>
            <div className="text-slate-400 text-sm">Monthly targets</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">12</div>
            <div className="text-white font-medium mb-1">Properties Sold</div>
            <div className="text-slate-400 text-sm">This month</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Link } from 'react-router-dom'
import { CalendarDays, Download, RefreshCcw, Bot, Sparkles } from 'lucide-react'
import { 
  getSummary,
  getCharts,
  getAiInsights,
  getTopAgents,
  getRecentProperties,
  exportAnalyticsAsPdf,
} from '../services/analyticsApi'
import type {
  DateRange,
  Summary,
  ChartsData,
  AiInsight,
  AgentPerformance,
  RecentProperty,
} from '../services/analyticsApi'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 600
    const startTime = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - startTime) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(start + (value - start) * eased))
      if (p < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <span>{display.toLocaleString('en-NG')}</span>
}

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Dashboard() {
  const now = useClock()
  const [range, setRange] = useState<DateRange>('30d')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [charts, setCharts] = useState<ChartsData | null>(null)
  const [insights, setInsights] = useState<AiInsight[]>([])
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [agents, setAgents] = useState<AgentPerformance[]>([])
  const [recentProps, setRecentProps] = useState<RecentProperty[]>([])

  const fetchAll = async (r: DateRange) => {
    const [s, c, a, rp] = await Promise.all([
      getSummary(r),
      getCharts(r),
      getTopAgents(),
      getRecentProperties(),
    ])
    setSummary(s)
    setCharts(c)
    setAgents(a)
    setRecentProps(rp)
  }

  useEffect(() => {
    fetchAll(range)
  }, [range])

  const refresh = async () => {
    await fetchAll(range)
  }

  const regenInsights = async () => {
    setLoadingInsights(true)
    const res = await getAiInsights()
    setInsights(res)
    setLoadingInsights(false)
  }

  useEffect(() => {
    regenInsights()
  }, [])

  const dateStr = useMemo(() => {
    const d = now
    return d.toLocaleString()
  }, [now])

  const pieColors = ['#10B981', '#F59E0B', '#22D3EE']

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-emerald-200">Admin Dashboard</h1>
          <p className="text-slate-300">Overview of Real Estate Pro platform activity and performance.</p>
          <div className="mt-2 inline-flex items-center gap-2 text-sm text-white/70">
            <CalendarDays size={16} className="text-emerald-400" />
            <span>{dateStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30">
            <RefreshCcw size={16} /> Refresh Data
          </button>
          <button onClick={() => exportAnalyticsAsPdf()} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-yellow-400/30 bg-yellow-500/10 text-yellow-200 hover:bg-yellow-500/20">
            <Download size={16} /> Export Report (PDF)
          </button>
        </div>
      </div>

      {/* Powered by badge and quick link */}
      <div className="flex items-center justify-between">
        <div className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-black/30 text-white/70">Powered by ColAI</div>
        <Link to="/" className="btn-outline">Go to Client Site</Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-emerald-500/30 bg-black/25 backdrop-blur-md p-5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20">
          <div className="text-sm text-white/80">🏠 Total Properties Listed</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-200">{summary ? <CountUp value={summary.totalProperties} /> : '—'}</div>
        </motion.div>
        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-emerald-500/30 bg-black/25 backdrop-blur-md p-5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20">
          <div className="text-sm text-white/80">👥 Active Users (Agents + Clients)</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-200">{summary ? <CountUp value={summary.activeUsers} /> : '—'}</div>
        </motion.div>
        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-yellow-500/40 bg-black/25 backdrop-blur-md p-5 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20">
          <div className="text-sm text-white/80">💰 Revenue (₦)</div>
          <div className="mt-2 text-3xl font-semibold text-yellow-200">{summary ? `₦${summary.revenueNaira.toLocaleString('en-NG')}` : '—'}</div>
        </motion.div>
        <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-emerald-500/30 bg-black/25 backdrop-blur-md p-5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20">
          <div className="text-sm text-white/80">📊 New Deals This Month</div>
          <div className="mt-2 text-3xl font-semibold text-emerald-200">{summary ? <CountUp value={summary.newDealsThisMonth} /> : '—'}</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['7d','30d','year'] as DateRange[]).map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`px-3 py-2 rounded-xl text-sm ${range === r ? 'bg-emerald-500/30 text-emerald-200' : 'bg-black/30 text-slate-300 border border-white/10'}`}>{r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'This Year'}</button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Revenue Trend</div>
            <div className="text-sm text-white/60">by month</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.revenueMonthly || []}>
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={false} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Listings Growth */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Property Listings Growth</div>
            <div className="text-sm text-white/60">monthly additions</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.listingsMonthly || []}>
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">User Growth</div>
            <div className="text-sm text-white/60">agents + clients</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.userGrowth || []}>
                <defs>
                  <linearGradient id="gAgents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gClients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                <Area type="monotone" dataKey="agents" stroke="#10B981" fillOpacity={1} fill="url(#gAgents)" />
                <Area type="monotone" dataKey="clients" stroke="#F59E0B" fillOpacity={1} fill="url(#gClients)" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Funnel */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Engagement Funnel</div>
            <div className="text-sm text-white/60">Leads → Clients → Closed</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts?.engagement || []} dataKey="value" nameKey="stage" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                  {(charts?.engagement || []).map((entry, i) => (
                    <Cell key={`slice-${entry.stage}`} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-emerald-400" />
            <div className="font-medium">AI Insights (Powered by ColAI)</div>
          </div>
          <button onClick={regenInsights} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-slate-200 hover:bg-black/40">
            <Sparkles size={16} /> Regenerate Insights
          </button>
        </div>
        <div className="mt-3 space-y-2">
          <AnimatePresence>
            {loadingInsights && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-white/70">
                Generating insights...
              </motion.div>
            )}
          </AnimatePresence>
          {insights.map((i) => (
            <div key={i.id} className="text-white/80 text-sm">• {i.text}</div>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Agents */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Top Performing Agents</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="p-3">Agent Name</th>
                  <th className="p-3">Properties Sold</th>
                  <th className="p-3">Revenue (₦)</th>
                  <th className="p-3">Conversion Rate</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a, idx) => (
                  <motion.tr key={a.name + idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ backgroundColor: 'rgba(16,185,129,0.08)' }} className="border-t border-white/10">
                    <td className="p-3 text-slate-200">{a.name}</td>
                    <td className="p-3 text-slate-300">{a.propertiesSold}</td>
                    <td className="p-3 text-slate-300">₦{a.revenue.toLocaleString('en-NG')}</td>
                    <td className="p-3 text-slate-300">{a.conversionRate}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-lg text-xs ${a.status === 'Active' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' : 'bg-slate-700/30 text-slate-300 border border-slate-500/30'}`}>{a.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Recently Added Properties</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="p-3">Property</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price (₦)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProps.map((p) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ backgroundColor: 'rgba(16,185,129,0.08)' }} className="border-t border-white/10">
                    <td className="p-3 text-slate-200">{p.property}</td>
                    <td className="p-3 text-slate-300">{p.location}</td>
                    <td className="p-3 text-slate-300">{p.type}</td>
                    <td className="p-3 text-slate-300">₦{p.price.toLocaleString('en-NG')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-lg text-xs ${p.status === 'Available' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' : p.status === 'Sold' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30' : 'bg-slate-700/30 text-slate-300 border border-slate-500/30'}`}>{p.status}</span>
                    </td>
                    <td className="p-3">
                      <Link to="/properties" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-slate-200 hover:bg-black/40">View Property</Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
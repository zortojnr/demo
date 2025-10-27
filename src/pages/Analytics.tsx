import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'

const engagement = [
  { day: 'Mon', value: 120 },
  { day: 'Tue', value: 180 },
  { day: 'Wed', value: 140 },
  { day: 'Thu', value: 210 },
  { day: 'Fri', value: 260 },
]

const conversions = [
  { name: 'Condos', value: 42 },
  { name: 'Houses', value: 55 },
  { name: 'Townhomes', value: 28 },
]

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 glass-card p-6">
        <div className="font-medium">Engagement trend</div>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagement}>
              <defs>
                <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorE)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="font-medium">Conversion rate</div>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversions}>
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6 xl:col-span-3">
        <div className="font-medium">Predictive Insights (Gemini AI - mock)</div>
        <p className="text-white/70 text-sm mt-2">High conversion expected for waterfront properties in the next 30 days. Optimize campaigns around Seaside and Riverfront neighborhoods.</p>
      </div>
    </div>
  )
}
// Mocked Analytics API service for Admin Dashboard (ready for future backend integration)
// Provides typed endpoints returning data structures used by the UI

export type DateRange = '7d' | '30d' | 'year'

// Summary cards
export type Summary = {
  totalProperties: number
  activeUsers: number
  revenueNaira: number
  newDealsThisMonth: number
}

// Charts
export type RevenuePoint = { month: string; value: number }
export type ListingsPoint = { month: string; count: number }
export type UserGrowthPoint = { month: string; agents: number; clients: number }
export type EngagementSlice = { stage: 'Leads' | 'Clients' | 'Closed Deals'; value: number }

export type ChartsData = {
  revenueMonthly: RevenuePoint[]
  listingsMonthly: ListingsPoint[]
  userGrowth: UserGrowthPoint[]
  engagement: EngagementSlice[]
}

// AI Insights
export type AiInsight = { id: string; text: string }

// Tables
export type AgentPerformance = {
  name: string
  propertiesSold: number
  revenue: number
  conversionRate: number // percentage
  status: 'Active' | 'Inactive'
}

export type RecentProperty = {
  id: string
  property: string
  location: string
  type: string
  price: number
  status: 'Available' | 'Sold' | 'Pending'
}

// Utilities
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function getSummary(range: DateRange = '30d'): Promise<Summary> {
  // Mock varies slightly by range
  const multiplier = range === '7d' ? 0.25 : range === '30d' ? 1 : 12
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalProperties: Math.round(128 * multiplier),
        activeUsers: Math.round(432 * multiplier),
        revenueNaira: Math.round(58750000 * multiplier),
        newDealsThisMonth: range === 'year' ? 250 : range === '30d' ? 25 : 6,
      })
    }, 250)
  })
}

export async function getCharts(range: DateRange = '30d'): Promise<ChartsData> {
  const len = range === '7d' ? 7 : range === '30d' ? 12 : 12
  const monthsPick = months.slice(0, len)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        revenueMonthly: monthsPick.map((m, i) => ({ month: m, value: 3200000 + i * 480000 + rand(-200000, 300000) })),
        listingsMonthly: monthsPick.map((m, i) => ({ month: m, count: 12 + i + rand(0, 6) })),
        userGrowth: monthsPick.map((m, i) => ({ month: m, agents: 120 + i * 6 + rand(0, 8), clients: 240 + i * 10 + rand(4, 12) })),
        engagement: [
          { stage: 'Leads', value: 420 },
          { stage: 'Clients', value: 190 },
          { stage: 'Closed Deals', value: 62 },
        ],
      })
    }, 300)
  })
}

export async function getAiInsights(): Promise<AiInsight[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'i1', text: 'Property listings increased by 18% this quarter.' },
        { id: 'i2', text: 'Revenue performance exceeded last month’s figures by ₦4.2M.' },
        { id: 'i3', text: 'Top performing agent: Aisha Bello — ₦12M in closed deals.' },
      ])
    }, 500)
  })
}

export async function getTopAgents(): Promise<AgentPerformance[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: 'John Okon', propertiesSold: 12, revenue: 18500000, conversionRate: 63, status: 'Active' },
        { name: 'Aisha Bello', propertiesSold: 10, revenue: 12000000, conversionRate: 57, status: 'Active' },
        { name: 'Chinedu Kalu', propertiesSold: 7, revenue: 8400000, conversionRate: 49, status: 'Active' },
        { name: 'Maryam Yusuf', propertiesSold: 5, revenue: 5100000, conversionRate: 42, status: 'Inactive' },
      ])
    }, 320)
  })
}

export async function getRecentProperties(): Promise<RecentProperty[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'p-001', property: 'Smart Estate Villa', location: 'Yola', type: 'Duplex', price: 45000000, status: 'Available' },
        { id: 'p-002', property: 'Urban Heights', location: 'Abuja', type: 'Apartment', price: 25500000, status: 'Sold' },
        { id: 'p-003', property: 'Emerald Bay Residence', location: 'Lagos', type: 'Condo', price: 38000000, status: 'Pending' },
        { id: 'p-004', property: 'Riverside Court', location: 'Port Harcourt', type: 'Townhouse', price: 29500000, status: 'Available' },
      ])
    }, 280)
  })
}

export async function exportAnalyticsAsPdf(): Promise<void> {
  // Placeholder that triggers browser print; replace with actual PDF generator integration later
  return new Promise((resolve) => {
    setTimeout(() => {
      try { window.print() } catch {}
      resolve()
    }, 100)
  })
}
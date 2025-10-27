import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import AppLayout from './layouts/AppLayout'
import ClientLayout from './client/ClientLayout'
import AgentLayout from './agent/AgentLayout'
import PageSkeleton from './components/ui/PageSkeleton'
import ProtectedRoute, { AdminRoute, ClientRoute, PublicRoute } from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

const Landing = lazy(() => import('./client/pages/Landing'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Properties = lazy(() => import('./pages/Properties'))
const Clients = lazy(() => import('./pages/Clients'))
const Marketing = lazy(() => import('./pages/Marketing'))
const ChatbotPage = lazy(() => import('./pages/Chatbot'))
const ClientChat = lazy(() => import('./client/pages/Chat'))
const Documents = lazy(() => import('./pages/Documents'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))
const ClientProperties = lazy(() => import('./client/pages/Properties'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))
const PropertyDetails = lazy(() => import('./client/pages/PropertyDetails'))
const ClientDashboard = lazy(() => import('./client/pages/Dashboard'))
const ClientBook = lazy(() => import('./client/pages/Book'))
const ClientContact = lazy(() => import('./client/pages/Contact'))
const ClientAbout = lazy(() => import('./client/pages/About'))
const ClientSupport = lazy(() => import('./client/pages/Support'))

// Agent Dashboard Pages
const AgentDashboard = lazy(() => import('./agent/pages/Dashboard'))
const AgentProperties = lazy(() => import('./agent/pages/Properties'))
const AgentClients = lazy(() => import('./agent/pages/Clients'))
const AgentMarketing = lazy(() => import('./agent/pages/Marketing'))
const AgentDocuments = lazy(() => import('./agent/pages/Documents'))
const AgentAnalytics = lazy(() => import('./agent/pages/Analytics'))
const AgentSettings = lazy(() => import('./agent/pages/Settings'))

function App() {
  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('dark')) root.classList.add('dark')
    try { localStorage.setItem('theme', 'dark') } catch {}
  }, [])
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}> 
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

          {/* Client routes */}
          <Route path="/client/*" element={<ClientRoute><ClientLayout /></ClientRoute>}>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="book" element={<ClientBook />} />
            <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
          </Route>

          {/* Public client routes (accessible to all) */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/properties" element={<ClientProperties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/about" element={<ClientAbout />} />
            <Route path="/contact" element={<ClientContact />} />
            <Route path="/support" element={<ClientSupport />} />
            <Route path="/chat" element={<ClientChat />} />
          </Route>

          {/* Agent Dashboard Routes */}
          <Route path="/agent/*" element={<ProtectedRoute requiredRoles={['agent', 'admin']}><AgentLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/agent/dashboard" replace />} />
            <Route path="dashboard" element={<AgentDashboard />} />
            <Route path="properties" element={<AgentProperties />} />
            <Route path="clients" element={<AgentClients />} />
            <Route path="marketing" element={<AgentMarketing />} />
            <Route path="documents" element={<AgentDocuments />} />
            <Route path="analytics" element={<AgentAnalytics />} />
            <Route path="settings" element={<AgentSettings />} />
            <Route path="*" element={<Navigate to="/agent/dashboard" replace />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={<AdminRoute><AppLayout /></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="clients" element={<Clients />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="documents" element={<Documents />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Legacy /app routes redirect to /admin */}
          <Route path="/app/*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

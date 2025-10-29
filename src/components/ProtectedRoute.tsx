import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../contexts/AuthContext'
// import PageSkeleton from './PageSkeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  redirectTo = '/login'
}) => {
  const { user, isAuthenticated, isLoading, refreshSession, checkSessionValidity, sessionExpiry } = useAuth()
  const location = useLocation()

  // Auto-refresh session on route access
  useEffect(() => {
    if (isAuthenticated && sessionExpiry) {
      // Refresh session if it's close to expiry (within 5 minutes)
      const fiveMinutes = 5 * 60 * 1000
      const timeUntilExpiry = new Date(sessionExpiry).getTime() - Date.now()
      
      if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
        refreshSession()
      }
    }
  }, [isAuthenticated, sessionExpiry, refreshSession])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-slate-300">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated or session invalid
  if (!isAuthenticated || !user || !checkSessionValidity()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to user's appropriate dashboard
    const userDashboard = `/${user.role}/dashboard`
    return <Navigate to={userDashboard} replace />
  }

  // Check if user has any of the required roles
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    // Redirect to user's appropriate dashboard
    const userDashboard = `/${user.role}/dashboard`
    return <Navigate to={userDashboard} replace />
  }

  // User is authenticated and has required role(s)
  return <>{children}</>
}

export default ProtectedRoute

// Convenience components for specific roles
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
)

export const AgentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="agent">{children}</ProtectedRoute>
)

export const ClientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="client">{children}</ProtectedRoute>
)

// Component for routes accessible by multiple roles
export const MultiRoleRoute: React.FC<{ 
  children: React.ReactNode
  roles: UserRole[]
}> = ({ children, roles }) => (
  <ProtectedRoute requiredRoles={roles}>{children}</ProtectedRoute>
)

// Public route component (redirects authenticated users to their dashboard)
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, checkSessionValidity } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect authenticated users with valid session to their dashboard
  if (isAuthenticated && user && checkSessionValidity()) {
    const userDashboard = `/${user.role}/dashboard`
    return <Navigate to={userDashboard} replace />
  }

  // Show public content for unauthenticated users
  return <>{children}</>
}
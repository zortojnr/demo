import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'admin' | 'agent' | 'client'

export type Permission = 
  | 'users.create' | 'users.read' | 'users.update' | 'users.delete'
  | 'properties.create' | 'properties.read' | 'properties.update' | 'properties.delete'
  | 'clients.create' | 'clients.read' | 'clients.update' | 'clients.delete'
  | 'analytics.read' | 'settings.update' | 'marketing.manage'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: Permission[]
  lastActivity: Date
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  sessionExpiry: Date | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  hasPermission: (permission: Permission) => boolean
  refreshSession: () => Promise<void>
  checkSessionValidity: () => boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'properties.create', 'properties.read', 'properties.update', 'properties.delete',
    'clients.create', 'clients.read', 'clients.update', 'clients.delete',
    'analytics.read', 'settings.update', 'marketing.manage'
  ],
  agent: [
    'properties.create', 'properties.read', 'properties.update', 'properties.delete',
    'clients.create', 'clients.read', 'clients.update', 'clients.delete',
    'analytics.read', 'marketing.manage'
  ],
  client: [
    'properties.read', 'clients.read'
  ]
}

// Session timeout duration (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)

  // Check session validity
  const checkSessionValidity = useCallback((): boolean => {
    if (!sessionExpiry) return false
    return new Date() < sessionExpiry
  }, [sessionExpiry])

  // Refresh session
  const refreshSession = useCallback(async (): Promise<void> => {
    if (!user || !token) return
    
    try {
      // TODO: Call backend to refresh token
      const newExpiry = new Date(Date.now() + SESSION_TIMEOUT)
      setSessionExpiry(newExpiry)
      localStorage.setItem('sessionExpiry', newExpiry.toISOString())
      
      // Update user's last activity
      const updatedUser = { ...user, lastActivity: new Date() }
      setUser(updatedUser)
    } catch (error) {
      console.error('Failed to refresh session:', error)
      logout()
    }
  }, [user, token])

  // Check permissions
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }, [user])

  // Auto-logout on session expiry
  useEffect(() => {
    if (!checkSessionValidity() && user) {
      console.log('Session expired, logging out...')
      logout()
    }
  }, [checkSessionValidity, user])

  // Session timeout checker
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !checkSessionValidity()) {
        logout()
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [user, checkSessionValidity])

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedRole = localStorage.getItem('role')
        const storedExpiry = localStorage.getItem('sessionExpiry')
        
        if (storedToken && storedRole && storedExpiry) {
          const expiry = new Date(storedExpiry)
          
          // Check if session is still valid
          if (new Date() < expiry) {
            // TODO: Validate token with backend
            // For now, create a mock user based on stored data
            const mockUser: User = {
              id: '1',
              email: storedRole === 'admin' ? 'admin@demo.com' : 
                     storedRole === 'agent' ? 'agent@demo.com' : 'client@demo.com',
              firstName: storedRole === 'admin' ? 'Admin' : 
                        storedRole === 'agent' ? 'Agent' : 'Client',
              lastName: 'User',
              role: storedRole as UserRole,
              permissions: ROLE_PERMISSIONS[storedRole as UserRole],
              lastActivity: new Date()
            }
            
            setUser(mockUser)
            setToken(storedToken)
            setSessionExpiry(expiry)
          } else {
            // Session expired, clear storage
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            localStorage.removeItem('sessionExpiry')
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('sessionExpiry')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      console.log('Login attempt:', { email, password })
      
      // Mock authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Determine role based on email for demo
      let role: UserRole = 'client'
      if (email.includes('admin')) role = 'admin'
      else if (email.includes('agent')) role = 'agent'
      
      // Create session expiry
      const expiry = new Date(Date.now() + SESSION_TIMEOUT)
      
      const mockUser: User = {
        id: '1',
        email,
        firstName: role === 'admin' ? 'Admin' : 
                  role === 'agent' ? 'Agent' : 'Client',
        lastName: 'User',
        role,
        permissions: ROLE_PERMISSIONS[role],
        lastActivity: new Date()
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Store in localStorage
      localStorage.setItem('token', mockToken)
      localStorage.setItem('role', role)
      localStorage.setItem('sessionExpiry', expiry.toISOString())
      
      // Update state
      setUser(mockUser)
      setToken(mockToken)
      setSessionExpiry(expiry)
      
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      console.log('Registration attempt:', userData)
      
      // Mock registration logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create session expiry
      const expiry = new Date(Date.now() + SESSION_TIMEOUT)
      
      const mockUser: User = {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        permissions: ROLE_PERMISSIONS[userData.role],
        lastActivity: new Date()
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Store in localStorage
      localStorage.setItem('token', mockToken)
      localStorage.setItem('role', userData.role)
      localStorage.setItem('sessionExpiry', expiry.toISOString())
      
      // Update state
      setUser(mockUser)
      setToken(mockToken)
      setSessionExpiry(expiry)
      
    } catch (error) {
      console.error('Registration failed:', error)
      throw new Error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('sessionExpiry')
    
    // Clear state
    setUser(null)
    setToken(null)
    setSessionExpiry(null)
    
    // Redirect to home with logout status
    const url = new URL(window.location.href)
    url.pathname = '/'
    url.search = 'logout=1'
    window.location.href = url.toString()
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token && checkSessionValidity(),
    isLoading,
    sessionExpiry,
    login,
    register,
    logout,
    updateUser,
    hasPermission,
    refreshSession,
    checkSessionValidity
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper function to redirect based on role
export const redirectToDashboard = (role: UserRole) => {
  switch (role) {
    case 'admin':
      window.location.href = '/admin/dashboard'
      break
    case 'agent':
      window.location.href = '/agent/dashboard'
      break
    case 'client':
      window.location.href = '/client/dashboard'
      break
    default:
      window.location.href = '/login'
  }
}

// Helper function to check if user has required role
export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  return userRole === requiredRole
}

// Helper function to check if user has any of the required roles
export const hasAnyRole = (userRole: UserRole | undefined, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole as UserRole)
}
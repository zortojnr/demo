import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'admin' | 'agent' | 'client'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedRole = localStorage.getItem('role')
        
        if (storedToken && storedRole) {
          // TODO: Validate token with backend
          // For now, create a mock user based on stored data
          const mockUser: User = {
            id: '1',
            email: storedRole === 'admin' ? 'admin@demo.com' : 
                   storedRole === 'agent' ? 'agent@demo.com' : 'client@demo.com',
            firstName: storedRole === 'admin' ? 'Admin' : 
                      storedRole === 'agent' ? 'Agent' : 'Client',
            lastName: 'User',
            role: storedRole as UserRole
          }
          
          setUser(mockUser)
          setToken(storedToken)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Clear invalid data
        localStorage.removeItem('token')
        localStorage.removeItem('role')
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
      
      const mockUser: User = {
        id: '1',
        email,
        firstName: role === 'admin' ? 'Admin' : 
                  role === 'agent' ? 'Agent' : 'Client',
        lastName: 'User',
        role
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Store in localStorage
      localStorage.setItem('token', mockToken)
      localStorage.setItem('role', role)
      
      // Update state
      setUser(mockUser)
      setToken(mockToken)
      
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
      
      const mockUser: User = {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      // Store in localStorage
      localStorage.setItem('token', mockToken)
      localStorage.setItem('role', userData.role)
      
      // Update state
      setUser(mockUser)
      setToken(mockToken)
      
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
    
    // Clear state
    setUser(null)
    setToken(null)
    
    // Redirect to login
    window.location.href = '/login'
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser
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
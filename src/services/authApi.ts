import type { User, RegisterData } from '../contexts/AuthContext'

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@demo.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'agent@demo.com',
    firstName: 'Agent',
    lastName: 'Smith',
    role: 'agent'
  },
  {
    id: '3',
    email: 'client@demo.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'client'
  }
]

// Mock passwords (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  'admin@demo.com': 'admin123',
  'agent@demo.com': 'agent123',
  'client@demo.com': 'client123'
}

export interface LoginResponse {
  user: User
  token: string
  message: string
}

export interface RegisterResponse {
  user: User
  token: string
  message: string
}

export interface ApiError {
  message: string
  code?: string
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock JWT token
const generateMockToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  return btoa(JSON.stringify(payload))
}

// Mock login API
export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  await delay(800) // Simulate network delay

  // Find user by email
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    throw new Error('User not found')
  }

  // Check password
  if (mockPasswords[user.email] !== password) {
    throw new Error('Invalid password')
  }

  // Generate token
  const token = generateMockToken(user)

  return {
    user,
    token,
    message: 'Login successful'
  }
}

// Mock register API
export const registerApi = async (userData: RegisterData): Promise<RegisterResponse> => {
  await delay(1000) // Simulate network delay

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase())
  
  if (existingUser) {
    throw new Error('User already exists with this email')
  }

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role
  }

  // Add to mock database
  mockUsers.push(newUser)
  mockPasswords[newUser.email] = userData.password

  // Generate token
  const token = generateMockToken(newUser)

  return {
    user: newUser,
    token,
    message: 'Registration successful'
  }
}

// Mock forgot password API
export const forgotPasswordApi = async (email: string): Promise<{ message: string }> => {
  await delay(600) // Simulate network delay

  // Check if user exists
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
  
  if (!user) {
    throw new Error('No account found with this email address')
  }

  // In a real app, this would send an email
  console.log(`Password reset email sent to ${email}`)

  return {
    message: 'Password reset instructions have been sent to your email'
  }
}

// Mock token verification API
export const verifyTokenApi = async (token: string): Promise<User> => {
  await delay(300) // Simulate network delay

  try {
    // Decode mock token
    const payload = JSON.parse(atob(token))
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      throw new Error('Token expired')
    }

    // Find user
    const user = mockUsers.find(u => u.id === payload.userId)
    
    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Mock get all users API (admin only)
export const getAllUsersApi = async (token: string): Promise<User[]> => {
  await delay(500) // Simulate network delay

  // Verify admin token
  const user = await verifyTokenApi(token)
  
  if (user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return mockUsers
}

// Mock create user API (admin only)
export const createUserApi = async (
  token: string, 
  userData: Omit<RegisterData, 'password'> & { password?: string }
): Promise<User> => {
  await delay(700) // Simulate network delay

  // Verify admin token
  const adminUser = await verifyTokenApi(token)
  
  if (adminUser.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase())
  
  if (existingUser) {
    throw new Error('User already exists with this email')
  }

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role
  }

  // Add to mock database
  mockUsers.push(newUser)
  mockPasswords[newUser.email] = userData.password || 'defaultPassword123'

  return newUser
}

// Mock update user API (admin only)
export const updateUserApi = async (
  token: string,
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  await delay(500) // Simulate network delay

  // Verify admin token
  const adminUser = await verifyTokenApi(token)
  
  if (adminUser.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Find and update user
  const userIndex = mockUsers.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
  
  return mockUsers[userIndex]
}

// Mock delete user API (admin only)
export const deleteUserApi = async (token: string, userId: string): Promise<{ message: string }> => {
  await delay(400) // Simulate network delay

  // Verify admin token
  const adminUser = await verifyTokenApi(token)
  
  if (adminUser.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Find user
  const userIndex = mockUsers.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }

  // Remove user
  const deletedUser = mockUsers.splice(userIndex, 1)[0]
  delete mockPasswords[deletedUser.email]

  return {
    message: 'User deleted successfully'
  }
}
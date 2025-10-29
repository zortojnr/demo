import React from 'react'
import { useAuth, type Permission } from '../contexts/AuthContext'

interface PermissionGuardProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAll?: boolean
}

interface MultiPermissionGuardProps {
  permissions: Permission[]
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAll?: boolean
}

/**
 * PermissionGuard - Renders children only if user has the required permission
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null
}) => {
  const { hasPermission } = useAuth()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * MultiPermissionGuard - Renders children based on multiple permission requirements
 */
export const MultiPermissionGuard: React.FC<MultiPermissionGuardProps> = ({
  permissions,
  children,
  fallback = null,
  requireAll = false
}) => {
  const { hasPermission } = useAuth()

  const hasAccess = requireAll
    ? permissions.every(permission => hasPermission(permission))
    : permissions.some(permission => hasPermission(permission))

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook for checking permissions in components
 */
export const usePermissions = () => {
  const { hasPermission, user } = useAuth()

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(permission)
  }

  const checkMultiplePermissions = (
    permissions: Permission[],
    requireAll: boolean = false
  ): boolean => {
    return requireAll
      ? permissions.every(permission => hasPermission(permission))
      : permissions.some(permission => hasPermission(permission))
  }

  const getUserPermissions = (): Permission[] => {
    return user?.permissions || []
  }

  return {
    checkPermission,
    checkMultiplePermissions,
    getUserPermissions,
    hasPermission
  }
}

export default PermissionGuard
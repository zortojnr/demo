import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  UserPlus, Search, Filter, Edit, Trash2, Shield, Users as UsersIcon, CheckCircle, XCircle, Mail, Phone, Lock, ChevronLeft, ChevronRight
} from 'lucide-react'

type UserRole = 'admin' | 'agent' | 'client'
type UserStatus = 'active' | 'inactive'

export const Roles = {
  ADMIN: 'admin' as UserRole,
  AGENT: 'agent' as UserRole,
  CLIENT: 'client' as UserRole,
}

type AdminUser = {
  id: string
  fullName: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  lastLogin?: string
}

const initialUsers: AdminUser[] = [
  { id: '1', fullName: 'Alice Johnson', email: 'alice@homekey.com', phone: '+44 7700 900001', role: 'admin', status: 'active', lastLogin: '2025-10-25 09:14' },
  { id: '2', fullName: 'Mark Evans', email: 'mark@agencypro.com', phone: '+44 7700 900002', role: 'agent', status: 'active', lastLogin: '2025-10-26 12:40' },
  { id: '3', fullName: 'Sandra Lee', email: 'sandra@gmail.com', phone: '+44 7700 900003', role: 'client', status: 'inactive', lastLogin: '2025-10-20 17:21' },
  { id: '4', fullName: 'Admin Root', email: 'admin@demo.com', role: 'admin', status: 'active', lastLogin: '2025-10-27 08:02' },
  { id: '5', fullName: 'Agent Smith', email: 'agent@demo.com', role: 'agent', status: 'active', lastLogin: '2025-10-27 07:30' },
  { id: '6', fullName: 'John Doe', email: 'client@demo.com', role: 'client', status: 'active', lastLogin: '2025-10-26 15:44' },
]

const roleBadgeClasses: Record<UserRole, string> = {
  admin: 'bg-gradient-to-r from-red-500/30 to-yellow-500/30 text-yellow-200 border border-yellow-400/30',
  agent: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30',
  client: 'bg-slate-600/30 text-slate-200 border border-slate-400/20',
}

const statusBadgeClasses: Record<UserStatus, string> = {
  active: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30',
  inactive: 'bg-slate-700/30 text-slate-300 border border-slate-500/30',
}

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

const modalVariant = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
}

type EditState = {
  mode: 'create' | 'edit' | null
  user?: AdminUser
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | UserRole | 'active' | 'inactive'>('all')
  const [editState, setEditState] = useState<EditState>({ mode: null })
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    let list = [...users]
    // Filter
    if (filter !== 'all') {
      if (filter === 'active' || filter === 'inactive') list = list.filter(u => u.status === filter)
      else list = list.filter(u => u.role === filter)
    }
    // Search
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(u => 
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      )
    }
    return list
  }, [users, query, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const counts = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    agents: users.filter(u => u.role === 'agent').length,
    clients: users.filter(u => u.role === 'client').length,
    active: users.filter(u => u.status === 'active').length,
  }), [users])

  // Remove unused helpers to satisfy linter
  const closeModal = () => setEditState({ mode: null });

  const saveUser = (data: Omit<AdminUser, 'id' | 'lastLogin'> & { id?: string }) => {
    if (editState.mode === 'create') {
      const id = (users.length + 1).toString()
      const newUser: AdminUser = { id, lastLogin: '—', ...data }
      setUsers(prev => [newUser, ...prev])
      setToast({ type: 'success', message: '✅ User created successfully.' })
    } else if (editState.mode === 'edit' && editState.user) {
      setUsers(prev => prev.map(u => u.id === editState.user!.id ? { ...u, ...data } : u))
      setToast({ type: 'success', message: '✅ User profile updated successfully.' })
    }
    closeModal()
  }

  const toggleStatus = (user: AdminUser) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    setToast({ type: 'success', message: `Status changed for ${user.fullName}.` })
  }

  const changeRole = (user: AdminUser, role: UserRole) => {
    // Prevent removing primary admin (mock rule)
    if (user.email === 'admin@demo.com' && role !== 'admin') {
      setToast({ type: 'warning', message: 'Cannot change role of primary Admin.' })
      return
    }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role } : u))
    setToast({ type: 'success', message: `Role updated to ${role} for ${user.fullName}.` })
  }

  const requestDelete = (user: AdminUser) => {
    if (user.email === 'admin@demo.com') {
      setToast({ type: 'warning', message: 'Cannot delete primary Admin account.' })
      return
    }
    setConfirmDelete(user)
  }

  const confirmDeleteUser = () => {
    if (!confirmDelete) return
    setUsers(prev => prev.filter(u => u.id !== confirmDelete.id))
    setToast({ type: 'success', message: `Deleted ${confirmDelete.fullName}.` })
    setConfirmDelete(null)
  }

  const headerCard = (title: string, value: string | number, icon: React.ReactNode) => (
    <motion.div variants={cardVariant} initial="hidden" animate="show" className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="text-sm text-slate-300">{title}</div>
          <div className="text-xl font-semibold text-emerald-200">{value}</div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-emerald-200">User Management</h1>
          <p className="text-slate-300">Manage all platform users — Admins, Agents, and Clients.</p>
        </div>
        <Link to="/admin/users/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors">
          <UserPlus size={18} />
          + New User
        </Link>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {headerCard('Total Users', counts.total, <UsersIcon size={18} />)}
        {headerCard('Active Users', counts.active, <CheckCircle size={18} />)}
        {headerCard('Admins', counts.admins, <Shield size={18} />)}
        {headerCard('Agents', counts.agents, <UsersIcon size={18} />)}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200">
          <Search size={16} className="text-emerald-300" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search by name, email, or role"
            className="w-full bg-transparent outline-none placeholder-slate-400"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200">
          <Filter size={16} className="text-emerald-300" />
          <select
            value={filter}
            onChange={e => { setFilter(e.target.value as any); setPage(1) }}
            className="bg-transparent outline-none text-slate-200"
          >
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="client">Client</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-slate-300">
              <th className="p-4">Avatar</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Login</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((u) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ backgroundColor: 'rgba(16,185,129,0.08)' }} className="border-t border-white/10">
                <td className="p-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-400 to-yellow-400 flex items-center justify-center text-slate-900 font-semibold">
                    {u.fullName?.charAt(0) || 'U'}
                  </div>
                </td>
                <td className="p-4 text-slate-200">{u.fullName}</td>
                <td className="p-4 text-slate-300">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-xs ${roleBadgeClasses[u.role]}`}>{u.role}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-lg text-xs inline-flex items-center gap-1 ${statusBadgeClasses[u.status]}`}>
                    {u.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{u.lastLogin || '—'}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/users/edit/${u.id}`} className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors">
                      <Edit size={14} />
                    </Link>
                    <button onClick={() => toggleStatus(u)} className="px-2 py-1 rounded-lg bg-slate-700/30 text-slate-200 hover:bg-slate-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => requestDelete(u)} className="px-2 py-1 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td className="p-6 text-center text-slate-400" colSpan={7}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-slate-200 disabled:opacity-40">
          <ChevronLeft size={14} /> Prev
        </button>
        <span className="text-slate-300">Page {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 bg-black/30 text-slate-200 disabled:opacity-40">
          Next <ChevronRight size={14} />
        </button>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {editState.mode && (
          <motion.div className="fixed inset-0 z-50" variants={modalBackdrop} initial="hidden" animate="show" exit="hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
            <motion.div variants={modalVariant} initial="hidden" animate="show" exit="hidden" className="relative mx-auto mt-24 w-[95%] max-w-xl rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-emerald-200 mb-4">{editState.mode === 'create' ? 'Create User' : 'Edit User'}</h2>
              <UserForm
                defaultValues={editState.user}
                onCancel={closeModal}
                onSave={saveUser}
                onImmediateRoleChange={(r) => editState.user && changeRole(editState.user, r)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div className="fixed inset-0 z-50" variants={modalBackdrop} initial="hidden" animate="show" exit="hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
            <motion.div variants={modalVariant} initial="hidden" animate="show" exit="hidden" className="relative mx-auto mt-28 w-[95%] max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-red-200 mb-2">Confirm Deletion</h3>
              <p className="text-slate-300 mb-4">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg bg-slate-700/30 text-slate-200">Cancel</button>
                <button onClick={confirmDeleteUser} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="fixed bottom-6 right-6 z-50">
            <div className={`rounded-xl px-4 py-3 shadow-lg ${toast.type === 'success' ? 'bg-emerald-600/20 text-emerald-200' : toast.type === 'warning' ? 'bg-yellow-600/20 text-yellow-200' : 'bg-red-600/20 text-red-200'}`}>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UserForm({ defaultValues, onCancel, onSave, onImmediateRoleChange }: {
  defaultValues?: AdminUser
  onCancel: () => void
  onSave: (data: Omit<AdminUser, 'id' | 'lastLogin'> & { id?: string }) => void
  onImmediateRoleChange: (role: UserRole) => void
}) {
  const [fullName, setFullName] = useState(defaultValues?.fullName || '')
  const [email, setEmail] = useState(defaultValues?.email || '')
  const [phone, setPhone] = useState(defaultValues?.phone || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(defaultValues?.role || 'client')
  const [status, setStatus] = useState<UserStatus>(defaultValues?.status || 'active')

  const isEdit = !!defaultValues
  const canSubmit = fullName && email && role && status && (!isEdit ? password.length >= 6 : true)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSave({ id: defaultValues?.id, fullName, email, phone, role, status })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Full Name</span>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30">
            <UsersIcon size={16} className="text-emerald-300" />
            <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-transparent outline-none text-slate-200" />
          </div>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Email</span>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30">
            <Mail size={16} className="text-emerald-300" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-transparent outline-none text-slate-200" />
          </div>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Phone (optional)</span>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30">
            <Phone size={16} className="text-emerald-300" />
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent outline-none text-slate-200" />
          </div>
        </label>
        {!isEdit && (
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Password</span>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/30">
              <Lock size={16} className="text-emerald-300" />
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full bg-transparent outline-none text-slate-200" />
            </div>
            <span className="text-xs text-slate-400">Minimum 6 characters.</span>
          </label>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Role</span>
          <select value={role} onChange={e => { setRole(e.target.value as UserRole); if (isEdit) onImmediateRoleChange(e.target.value as UserRole) }} className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200">
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="client">Client</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-slate-300">Status</span>
          <select value={status} onChange={e => setStatus(e.target.value as UserStatus)} className="px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-slate-200">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-700/30 text-slate-200">Cancel</button>
        <button type="submit" disabled={!canSubmit} className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-40">
          {isEdit ? 'Save Changes' : 'Create User'}
        </button>
      </div>
    </form>
  )
}
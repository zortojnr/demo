import { NavLink, useLocation } from 'react-router-dom'

function titleCase(segment: string) {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Breadcrumbs({ baseLabel = 'Home' }: { baseLabel?: string }) {
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)

  const isAdmin = parts[0] === 'admin'
  const isAgent = parts[0] === 'agent'
  const isClient = parts[0] === 'client'

  const basePath = isAdmin ? '/admin' : isAgent ? '/agent' : isClient ? '/client' : '/'

  const crumbs = [] as { label: string; to: string }[]
  crumbs.push({ label: baseLabel, to: basePath === '/' ? '/' : `${basePath}/dashboard` })

  let pathAcc = ''
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i]
    pathAcc += `/${seg}`
    // Skip base segment (admin/agent/client) as base is handled above
    if (i === 0 && (isAdmin || isAgent || isClient)) continue
    // Skip dynamic ids in label but keep link
    const isId = /^\d+$/.test(seg) || /:/.test(seg)
    const label = isId ? 'Details' : titleCase(seg)
    crumbs.push({ label, to: pathAcc })
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-white/70">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1
          return (
            <li key={`${c.to}-${idx}`} className="inline-flex items-center gap-1">
              {isLast ? (
                <span className="text-white/90 font-medium">{c.label}</span>
              ) : (
                <NavLink to={c.to} className="hover:text-[var(--accent)]">{c.label}</NavLink>
              )}
              {!isLast && <span className="opacity-50">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
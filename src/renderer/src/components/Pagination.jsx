import React from 'react'

const buildPages = (current, total) => {
  if (total <= 1) return []

  const pages = new Set([1, total])
  for (let i = current - 2; i <= current + 2; i += 1) {
    if (i > 1 && i < total) pages.add(i)
  }

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const output = []
  sorted.forEach((page, index) => {
    output.push(page)
    const next = sorted[index + 1]
    if (next && next - page > 1) output.push('ellipsis')
  })

  return output
}

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      {pages.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
              ...
            </span>
          )
        }
        const isActive = item === page
        return (
          <button
            type="button"
            key={item}
            className={`h-8 w-8 rounded text-sm ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        )
      })}
      <button
        type="button"
        className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination

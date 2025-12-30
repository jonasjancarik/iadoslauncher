import React from 'react'
import { useTheme } from '../state/ThemeContext'

const Pagination = ({ page, totalPages, onChange }) => {
  const { theme } = useTheme()
  const isDos = theme === 'dos'

  return (
    <div className={`flex items-center justify-between text-sm ${isDos ? 'font-dos text-dos-white' : 'font-modern text-modern-text-primary'}`}>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`disabled:opacity-30 ${isDos
              ? 'dos-button'
              : 'px-4 py-2 bg-modern-bg-elevated hover:bg-modern-bg-hover rounded-lg transition-colors disabled:hover:bg-modern-bg-elevated'
            }`}
        >
          {isDos ? '< PREV' : '← Previous'}
        </button>
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`disabled:opacity-30 ${isDos
              ? 'dos-button'
              : 'px-4 py-2 bg-modern-bg-elevated hover:bg-modern-bg-hover rounded-lg transition-colors disabled:hover:bg-modern-bg-elevated'
            }`}
        >
          {isDos ? 'NEXT >' : 'Next →'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className={isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}>
          {isDos ? 'SECTOR: ' : 'Page '}
          <span className={`font-bold ${isDos ? 'text-dos-white' : 'text-modern-text-primary'}`}>{page}</span>
          {isDos ? ' OF ' : ' of '}
          <span className={`font-bold ${isDos ? 'text-dos-white' : 'text-modern-text-primary'}`}>{totalPages}</span>
        </div>
        <div className="hidden sm:flex gap-1">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
            if (p < 1 || p > totalPages) return null;
            return (
              <button
                key={p}
                onClick={() => onChange(p)}
                className={`px-2 py-0.5 ${isDos
                    ? `border ${p === page ? 'bg-dos-yellow text-dos-black border-dos-white' : 'border-dos-gray text-dos-gray hover:text-dos-white'}`
                    : `rounded ${p === page ? 'bg-modern-accent text-white' : 'bg-modern-bg-elevated text-modern-text-muted hover:bg-modern-bg-hover'}`
                  }`}
              >
                {p}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Pagination


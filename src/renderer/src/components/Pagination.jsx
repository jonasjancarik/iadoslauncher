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
            : 'px-6 py-2 bg-modern-bg-elevated hover:bg-modern-accent hover:text-white rounded-xl transition-all font-semibold shadow-sm hover:shadow-md disabled:hover:bg-modern-bg-elevated disabled:hover:text-modern-text-secondary active:scale-95'
            }`}
        >
          {isDos ? '< PREV' : 'Previous'}
        </button>
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`disabled:opacity-30 ${isDos
            ? 'dos-button'
            : 'px-6 py-2 bg-modern-bg-elevated hover:bg-modern-accent hover:text-white rounded-xl transition-all font-semibold shadow-sm hover:shadow-md disabled:hover:bg-modern-bg-elevated disabled:hover:text-modern-text-secondary active:scale-95'
            }`}
        >
          {isDos ? 'NEXT >' : 'Next'}
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
                className={`w-8 h-8 flex items-center justify-center transition-all ${isDos
                  ? `border ${p === page ? 'bg-dos-yellow text-dos-black border-dos-white' : 'border-dos-gray text-dos-gray hover:text-dos-white'}`
                  : `rounded-lg font-medium ${p === page ? 'bg-modern-accent text-white shadow-lg shadow-modern-accent/30 scale-110' : 'bg-modern-bg-elevated text-modern-text-secondary hover:bg-modern-bg-hover hover:text-modern-text-primary'}`
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


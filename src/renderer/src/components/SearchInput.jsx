import React from 'react'
import { useTheme } from '../state/ThemeContext'

const SearchInput = ({ value, onChange, placeholder, onSubmit }) => {
    const { theme } = useTheme()
    const isDos = theme === 'dos'

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSubmit) {
            onSubmit(value)
        }
    }

    return (
        <div className="relative flex items-center w-full max-w-sm">
            <div className={`absolute left-3 flex items-center pointer-events-none ${isDos ? 'text-dos-white' : 'text-modern-text-muted'}`}>
                {isDos ? (
                    <span className="font-bold mr-1">{'>'}</span>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || (isDos ? 'SEARCH_GAMES...' : 'Search games...')}
                className={`w-full py-2 pl-9 pr-4 text-sm outline-none transition-all ${isDos
                        ? 'bg-dos-black border border-dos-white text-dos-white focus:bg-dos-gray focus:text-dos-black placeholder:text-dos-gray'
                        : 'bg-modern-bg-elevated/50 border border-modern-border text-modern-text-primary rounded-full focus:border-modern-accent focus:bg-modern-bg-elevated focus:ring-1 focus:ring-modern-accent/30 placeholder:text-modern-text-muted/50'
                    }`}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className={`absolute right-3 flex items-center justify-center ${isDos ? 'text-dos-red-bright hover:text-dos-white' : 'text-modern-text-muted hover:text-modern-text-primary'
                        }`}
                >
                    {isDos ? (
                        <span className="font-bold text-xs">[X]</span>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    )
}

export default SearchInput

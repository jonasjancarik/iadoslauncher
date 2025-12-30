import React, { createContext, useContext, useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'iadoslauncher-theme'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
            return stored === 'modern' ? 'modern' : 'dos'
        } catch {
            return 'dos'
        }
    })

    useEffect(() => {
        // Apply theme class to document root
        document.documentElement.classList.remove('theme-dos', 'theme-modern')
        document.documentElement.classList.add(`theme-${theme}`)

        // Persist to localStorage
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme)
        } catch (error) {
            console.warn('Failed to persist theme', error)
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dos' ? 'modern' : 'dos'))
    }

    const value = { theme, setTheme, toggleTheme }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

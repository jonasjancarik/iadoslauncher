import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { useTheme } from '../state/ThemeContext'

const Welcome = () => {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isDos = theme === 'dos'

  const handleContinue = () => {
    dispatch({ type: 'UI_HIDE_WELCOME' })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-8 py-8 animate-in fade-in zoom-in duration-500">
      <div className={`p-8 max-w-2xl w-full text-center space-y-6 ${isDos
          ? 'dos-panel-double'
          : 'bg-modern-bg-surface rounded-2xl border border-modern-border shadow-2xl'
        }`}>
        <h1 className={`font-bold uppercase tracking-[0.2em] ${isDos
            ? 'text-4xl text-dos-yellow dos-text-shadow'
            : 'text-4xl bg-gradient-to-r from-modern-accent via-modern-accent-light to-purple-400 bg-clip-text text-transparent'
          }`}>
          IADOS LAUNCHER
        </h1>
        <div className={`text-xs ${isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}`}>
          Version 1.0.0 {isDos ? '(C) 2025 Janca Software' : '• Made with ❤️'}
          <br />
          {isDos ? 'All Rights Reserved' : 'Your gateway to classic DOS gaming'}
        </div>

        <div className={`my-4 ${isDos ? 'border-t-2 border-dos-white' : 'border-t border-modern-border'}`}></div>

        <div className={`space-y-4 text-sm leading-relaxed ${isDos ? '' : 'text-modern-text-secondary'}`}>
          <p>
            Welcome to the <span className={isDos ? 'text-dos-yellow' : 'text-modern-accent font-semibold'}>Interactive Archive of DOS</span> (IADOS).
          </p>
          <p>
            {isDos
              ? 'This software allows you to browse, download, and play thousands of classic DOS games directly from the Internet Archive.'
              : 'Browse, download, and play thousands of classic DOS games from the Internet Archive.'}
          </p>
        </div>

        <div className={`p-4 inline-block text-left text-xs font-mono ${isDos
            ? 'bg-dos-black border border-dos-white'
            : 'bg-modern-bg-dark rounded-lg border border-modern-border w-full'
          }`}>
          <span className={isDos ? 'text-dos-green-bright' : 'text-modern-success'}>
            {isDos ? 'C:\\>' : '$'}
          </span> {isDos ? 'CHECK_SYSTEM.EXE' : 'system-check'}
          <br />
          <span className={isDos ? 'text-dos-white' : 'text-modern-text-primary'}>DOSBox status: </span>
          {state.settings.dosBoxExePath?.value ? (
            <span className={isDos ? 'text-dos-green-bright' : 'text-modern-success'}>
              {isDos ? 'READY' : '✓ Ready'}
            </span>
          ) : (
            <span className={isDos ? 'text-dos-red-bright' : 'text-modern-error'}>
              {isDos ? 'NOT FOUND' : '✗ Not configured'}
            </span>
          )}
          <br />
          <span className={isDos ? 'text-dos-white' : 'text-modern-text-primary'}>Memory: </span>
          <span className={isDos ? 'text-dos-cyan' : 'text-modern-secondary'}>
            {isDos ? '640K Base / 32M Extended' : 'Unlimited virtual'}
          </span>
        </div>

        <div className="pt-4 space-y-4">
          {state.settings.dosBoxExePath?.value ? (
            <Link
              to="/library?page=1"
              className={`inline-block font-bold ${isDos
                  ? 'dos-button text-lg'
                  : 'px-8 py-3 bg-gradient-to-r from-modern-accent to-purple-500 hover:from-modern-accent-light hover:to-purple-400 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-lg'
                }`}
              onClick={handleContinue}
            >
              {isDos ? '[ RUN SYSTEM ]' : 'Get Started →'}
            </Link>
          ) : (
            <div className="space-y-4">
              <div className={`text-xs px-4 ${isDos ? 'text-dos-red-bright' : 'text-modern-warning'}`}>
                {isDos
                  ? 'WARNING: DOSBox path not configured. Some features may be restricted.'
                  : '⚠️ DOSBox not configured. Some features may be limited.'}
              </div>
              <Link
                to="/library?page=1"
                className={`inline-block ${isDos
                    ? 'dos-button'
                    : 'px-6 py-2 bg-modern-bg-elevated hover:bg-modern-bg-hover text-modern-text-primary rounded-lg transition-colors'
                  }`}
                onClick={handleContinue}
              >
                {isDos ? 'Launch Limited Mode' : 'Continue Anyway'}
              </Link>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Link
              to="/settings"
              className={`text-xs underline ${isDos ? 'text-dos-cyan hover:text-dos-white' : 'text-modern-text-muted hover:text-modern-accent transition-colors'}`}
            >
              {isDos ? '[ SETTINGS ]' : 'Settings'}
            </Link>
            <div className={`text-xs underline cursor-pointer ${isDos ? 'text-dos-cyan hover:text-dos-white' : 'text-modern-text-muted hover:text-modern-accent transition-colors'}`}>
              {isDos ? '[ README.TXT ]' : 'About'}
            </div>
          </div>
        </div>
      </div>

      {isDos && (
        <div className="text-[10px] text-dos-gray uppercase tracking-widest">
          Wait for system initialization...
        </div>
      )}
    </div>
  )
}

export default Welcome


import React from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from './state/store'
import { useTheme } from './state/ThemeContext'
import Welcome from './pages/Welcome'
import Library from './pages/Library'
import Installed from './pages/Installed'
import Settings from './pages/Settings'
import GameDetail from './pages/GameDetail'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()

  const isDos = theme === 'dos'

  const navLinkClasses = ({ isActive }) => {
    if (isDos) {
      return `flex items-center gap-2 px-4 py-1 text-sm ${isActive ? 'bg-dos-yellow text-dos-black' : 'text-dos-white hover:bg-dos-gray hover:text-dos-black'}`
    }
    return `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${isActive
      ? 'bg-modern-accent text-white shadow-lg shadow-modern-accent/20 translate-x-1'
      : 'text-modern-text-secondary hover:bg-modern-bg-hover hover:text-modern-text-primary hover:translate-x-1'}`
  }

  return (
    <div className={`flex h-screen flex-col overflow-hidden ${isDos
      ? 'font-dos bg-dos-blue text-dos-white border-4 border-dos-blue'
      : 'font-modern bg-modern-bg-dark text-modern-text-primary'
      }`}>
      {/* Top Menu Bar */}
      <header className={`flex items-center justify-between px-4 py-2 text-sm ${isDos
        ? 'bg-dos-gray text-dos-black border-b-2 border-dos-white'
        : 'bg-modern-bg-surface border-b border-modern-border'
        }`}>
        <div className="flex gap-6 items-center">
          <div className={`font-bold tracking-tight ${isDos ? 'px-2' : 'text-xl bg-gradient-to-r from-modern-accent-light via-modern-accent to-modern-accent-dark bg-clip-text text-transparent'}`}>
            {isDos ? 'IADOS' : 'IADOS Launcher'}
          </div>
          {isDos && (
            <>
              <NavLink to="/library" className="px-2 hover:bg-dos-blue hover:text-dos-white">File</NavLink>
              <NavLink to="/installed" className="px-2 hover:bg-dos-blue hover:text-dos-white">View</NavLink>
              <NavLink to="/settings" className="px-2 hover:bg-dos-blue hover:text-dos-white">Options</NavLink>
              <div className="px-2 hover:bg-dos-blue hover:text-dos-white cursor-pointer">Help</div>
            </>
          )}
        </div>
        <div className={`text-xs uppercase ${isDos ? '' : 'text-modern-text-muted'}`}>
          {new Date().toLocaleTimeString()}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Left Panel */}
        <aside className={`flex w-60 flex-col p-3 gap-1 ${isDos
          ? 'border-r-2 border-dos-white bg-dos-blue'
          : 'bg-modern-bg-surface border-r border-modern-border/50'
          }`}>
          <div className={`p-3 text-xs font-bold uppercase tracking-wider ${isDos
            ? 'text-dos-cyan border-b-2 border-dos-white mb-2'
            : 'text-modern-text-muted border-b border-modern-border mb-2'
            }`}>
            Navigation
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-left mb-2 ${isDos
              ? 'text-dos-white hover:bg-dos-gray hover:text-dos-black'
              : 'text-modern-text-secondary hover:bg-modern-bg-hover hover:text-modern-text-primary rounded-xl transition-all'
              }`}
          >
            <span>{isDos ? '[..] Up' : '← Back'}</span>
          </button>
          <NavLink to="/library" className={navLinkClasses}>
            <span>{isDos ? 'Library' : '📚 Library'}</span>
          </NavLink>
          <NavLink to="/installed" className={navLinkClasses}>
            <span>{isDos ? 'Installed' : '💾 Installed'}</span>
          </NavLink>
          <div className={`mt-auto ${isDos ? 'border-t-2 border-dos-white' : 'border-t border-modern-border pt-2'}`}>
            <NavLink to="/settings" className={navLinkClasses}>
              <span>{isDos ? 'Settings' : '⚙️ Settings'}</span>
            </NavLink>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={`flex flex-1 flex-col overflow-hidden p-2 ${isDos ? 'bg-dos-blue' : 'bg-modern-bg-dark'
          }`}>
          <main className={`flex-1 overflow-auto p-6 relative ${isDos
            ? 'border-2 border-dos-white bg-dos-blue'
            : 'bg-modern-bg-surface rounded-2xl border border-modern-border/50 shadow-premium'
            }`}>
            {isDos && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dos-blue px-2 text-dos-white text-xs font-bold uppercase border-x-2 border-dos-white">
                {location.pathname.split('/').pop() || 'HOME'}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer className={`flex items-center gap-4 px-4 py-1 text-[10px] ${isDos
        ? 'bg-dos-black text-dos-gray-bright border-t-2 border-dos-white'
        : 'bg-modern-bg-surface text-modern-text-muted border-t border-modern-border'
        }`}>
        {isDos ? (
          <>
            <div className="flex gap-2">
              <span className="text-dos-yellow">F1</span> Help
            </div>
            <div className="flex gap-2">
              <span className="text-dos-yellow">F3</span> Search
            </div>
            <div className="flex gap-2">
              <span className="text-dos-yellow">F5</span> Copy
            </div>
            <div className="flex gap-2">
              <span className="text-dos-yellow">F8</span> Delete
            </div>
            <div className="flex gap-2">
              <span className="text-dos-yellow">F10</span> Quit
            </div>
            <div className="ml-auto">C:\IADOS\SYSTEM{">"}</div>
          </>
        ) : (
          <>
            <div className="flex gap-4">
              <span>Ready</span>
            </div>
            <div className="ml-auto text-modern-text-muted">
              IADOS Launcher v1.0.0
            </div>
          </>
        )}
      </footer>
    </div>
  )
}

const HomeRedirect = () => {
  const { state } = useStore()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (state.ui.showWelcome) {
      navigate('/welcome', { replace: true })
    } else {
      navigate('/library?page=1', { replace: true })
    }
  }, [state.ui.showWelcome, navigate])

  return null
}

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomeRedirect />
          </Layout>
        }
      />
      <Route
        path="/welcome"
        element={
          <Layout>
            <Welcome />
          </Layout>
        }
      />
      <Route
        path="/library"
        element={
          <Layout>
            <Library />
          </Layout>
        }
      />
      <Route
        path="/installed"
        element={
          <Layout>
            <Installed />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
      <Route
        path="/games/:identifier"
        element={
          <Layout>
            <GameDetail />
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout>
            <div className="text-sm font-bold" style={{ color: 'var(--color-error)' }}>
              ERROR: Page not found.
            </div>
          </Layout>
        }
      />
    </Routes>
  )
}

export default App


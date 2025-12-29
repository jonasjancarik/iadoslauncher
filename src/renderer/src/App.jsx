import React from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useStore } from './state/store'
import GameDetail from './pages/GameDetail'
import Installed from './pages/Installed'
import Library from './pages/Library'
import Settings from './pages/Settings'
import Welcome from './pages/Welcome'

const navLinkClasses = ({ isActive }) =>
  `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition ${
    isActive
      ? 'bg-slate-200 text-slate-700'
      : 'text-slate-400 hover:bg-slate-200 hover:text-slate-600'
  }`

const Layout = ({ children }) => {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="flex w-16 flex-col items-center gap-4 border-r border-slate-200 bg-slate-100 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <NavLink to="/library" className={navLinkClasses}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <span>Library</span>
        </NavLink>
        <NavLink to="/installed" className={navLinkClasses}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 16.5v-9a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 3 7.5v9m18 0v2.25A2.25 2.25 0 0 1 18.75 21h-13.5A2.25 2.25 0 0 1 3 18.75V16.5m18 0h-18"
            />
          </svg>
          <span>Installed</span>
        </NavLink>
        <div className="mt-auto">
          <NavLink to="/settings" className={navLinkClasses}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="h-5 w-5"
            >
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z" />
            </svg>
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-center border-b border-slate-200 bg-white px-4 py-2">
          <input
            disabled
            placeholder="Search"
            className="w-64 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
          />
        </header>
        <main className="flex-1 overflow-auto bg-white p-6 shadow-inner">{children}</main>
      </div>
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
            <div className="text-sm text-slate-500">Page not found.</div>
          </Layout>
        }
      />
    </Routes>
  )
}

export default App

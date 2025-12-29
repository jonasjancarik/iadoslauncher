import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { buildDefaultSettings } from '../utils/settings'

const STORAGE_KEY = 'iadoslauncher-state'

const StoreContext = createContext(null)

const initialState = {
  catalog: {
    games: {}
  },
  metadata: {},
  user: {
    installed: {}
  },
  settings: buildDefaultSettings(),
  ui: {
    showWelcome: true
  }
}

const mergeState = (base, saved) => {
  if (!saved) return base
  return {
    ...base,
    ...saved,
    catalog: {
      ...base.catalog,
      ...saved.catalog,
      games: {
        ...base.catalog.games,
        ...(saved.catalog ? saved.catalog.games : {})
      }
    },
    metadata: {
      ...base.metadata,
      ...(saved.metadata || {})
    },
    user: {
      ...base.user,
      ...saved.user,
      installed: {
        ...base.user.installed,
        ...(saved.user ? saved.user.installed : {})
      }
    },
    settings: {
      ...base.settings,
      ...(saved.settings || {})
    },
    ui: {
      ...base.ui,
      ...(saved.ui || {})
    }
  }
}

const loadState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    return mergeState(initialState, parsed)
  } catch (error) {
    console.warn('Failed to load stored state', error)
    return initialState
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CATALOG_ADD_MANY': {
      const next = { ...state.catalog.games }
      action.payload.forEach((game) => {
        next[game.identifier] = game
      })
      return {
        ...state,
        catalog: {
          ...state.catalog,
          games: next
        }
      }
    }
    case 'METADATA_SET': {
      return {
        ...state,
        metadata: {
          ...state.metadata,
          [action.payload.identifier]: action.payload.metadata
        }
      }
    }
    case 'USER_MARK_INSTALLED': {
      return {
        ...state,
        user: {
          ...state.user,
          installed: {
            ...state.user.installed,
            [action.payload.identifier]: {
              installedAt: action.payload.installedAt || new Date().toISOString(),
              source: action.payload.source || 'user'
            }
          }
        }
      }
    }
    case 'USER_MARK_UNINSTALLED': {
      const next = { ...state.user.installed }
      delete next[action.payload.identifier]
      return {
        ...state,
        user: {
          ...state.user,
          installed: next
        }
      }
    }
    case 'SETTINGS_UPDATE': {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      }
    }
    case 'UI_SET_SHOW_WELCOME': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showWelcome: action.payload
        }
      }
    }
    case 'RESET_STATE': {
      return initialState
    }
    default:
      return state
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, loadState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.warn('Failed to persist state', error)
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}

export const selectGame = (state, identifier) => {
  const base = state.catalog.games[identifier]
  if (!base) return null
  return {
    ...base,
    metadata: state.metadata[identifier],
    user: state.user.installed[identifier]
  }
}

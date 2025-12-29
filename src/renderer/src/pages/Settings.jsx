import React from 'react'
import { useStore } from '../state/store'
import SystemInformation from '../components/SystemInformation'

const Settings = () => {
  const { state, dispatch } = useStore()
  const [settings, setSettings] = React.useState(state.settings)

  React.useEffect(() => {
    setSettings(JSON.parse(JSON.stringify(state.settings)))
  }, [state.settings])

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    const updated = { ...settings }
    Object.keys(updated).forEach((key) => {
      if (Array.isArray(updated[key].default) && typeof updated[key].value === 'string') {
        updated[key].value = updated[key].value.split(',').map((item) => item.trim()).filter(Boolean)
      }
    })
    dispatch({ type: 'SETTINGS_UPDATE', payload: updated })
  }

  const handleDiscard = (event) => {
    event.preventDefault()
    setSettings(JSON.parse(JSON.stringify(state.settings)))
  }

  const clearLocalStorage = () => {
    try {
      window.localStorage.removeItem('iadoslauncher-state')
      window.location.reload()
    } catch (error) {
      console.error('Clearing local storage failed', error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
        <form className="mt-6 space-y-6" onSubmit={handleSave}>
          {Object.entries(settings).map(([key, option]) => (
            <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{option.label}</label>
                <p className="text-xs text-slate-500">{option.description}</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={Array.isArray(option.value) ? option.value.join(', ') : option.value}
                    onChange={(event) => handleChange(key, event.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                    onClick={() => handleChange(key, option.default)}
                  >
                    Use default
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
              onClick={handleDiscard}
            >
              Discard changes
            </button>
          </div>
        </form>
      </div>
      <div className="space-y-2">
        <button
          type="button"
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
          onClick={clearLocalStorage}
        >
          Clear App Data
        </button>
        <p className="text-xs text-slate-500">
          Resets saved data (localStorage), including settings, within the app. Does not remove installed games.
        </p>
      </div>
      <SystemInformation />
    </div>
  )
}

export default Settings

import React from 'react'
import SystemInformation from '../components/SystemInformation'
import { useStore } from '../state/store'
import { useTheme } from '../state/ThemeContext'

const Settings = () => {
  const { state, dispatch } = useStore()
  const { theme, toggleTheme } = useTheme()
  const [formValues, setFormValues] = React.useState(state.settings)

  const isDos = theme === 'dos'

  const handleChange = (key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    dispatch({ type: 'SETTINGS_UPDATE_ALL', payload: formValues })
    alert(isDos ? 'CONFIGURATION SAVED TO CMOS' : 'Settings saved successfully!')
  }

  const handleDiscard = () => {
    setFormValues(state.settings)
  }

  const clearLocalStorage = () => {
    const message = isDos
      ? 'CAUTION: This will purge all system data. Continue?'
      : 'This will delete all application data. Are you sure?'
    if (confirm(message)) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className={`flex flex-col h-full space-y-6 max-w-4xl mx-auto ${isDos ? 'text-dos-white' : 'text-modern-text-primary'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-2 ${isDos ? 'border-b-2 border-dos-white' : 'border-b border-modern-border'}`}>
        <h2 className={`font-bold uppercase tracking-widest ${isDos ? 'text-dos-yellow' : 'text-modern-accent text-xl'}`}>
          {isDos ? 'System Configuration' : 'Settings'}
        </h2>
        <div className={`text-xs ${isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}`}>
          {isDos ? 'ROM BIOS v2.0' : ''}
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-6">
        {/* Appearance Section - Theme Toggle */}
        <div className={`p-6 ${isDos ? 'dos-panel-double bg-dos-blue' : 'bg-modern-bg-surface rounded-xl border border-modern-border'}`}>
          <h3 className={`text-sm font-bold uppercase mb-4 ${isDos ? 'text-dos-cyan' : 'text-modern-text-secondary'}`}>
            {isDos ? 'VIDEO MODE' : 'Appearance'}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${isDos ? '' : 'text-modern-text-primary'}`}>
                {isDos ? 'DISPLAY MODE' : 'Theme'}
              </div>
              <div className={`text-xs mt-1 ${isDos ? 'text-dos-gray' : 'text-modern-text-muted'}`}>
                {isDos ? 'Toggle between CGA and VGA modes' : 'Switch between DOS retro and modern interface'}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${isDos
                  ? 'bg-dos-gray border-2 border-dos-white'
                  : (theme === 'modern' ? 'bg-modern-accent' : 'bg-modern-bg-elevated')
                }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full transition-transform ${isDos
                    ? 'bg-dos-yellow translate-x-1'
                    : (theme === 'modern' ? 'bg-white translate-x-9' : 'bg-modern-text-muted translate-x-1')
                  }`}
              />
            </button>
          </div>
          <div className={`mt-2 text-xs ${isDos ? 'text-dos-yellow' : 'text-modern-accent'}`}>
            {isDos ? 'Current: DOS MODE (CGA)' : `Current: ${theme === 'dos' ? 'DOS Retro' : 'Modern'}`}
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className={`p-6 space-y-6 ${isDos ? 'dos-panel-double bg-dos-blue' : 'bg-modern-bg-surface rounded-xl border border-modern-border'}`}>
          <h3 className={`text-sm font-bold uppercase mb-4 ${isDos ? 'text-dos-cyan' : 'text-modern-text-secondary'}`}>
            {isDos ? 'SYSTEM PATHS' : 'Configuration'}
          </h3>
          <div className="space-y-4">
            {Object.entries(formValues).map(([key, value]) => (
              <div key={key} className="flex flex-col space-y-1">
                <label className={`text-xs font-bold uppercase tracking-tighter ${isDos ? 'text-dos-cyan' : 'text-modern-text-secondary'}`}>
                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={e => handleChange(key, e.target.value)}
                  className={`px-3 py-2 text-sm outline-none transition-colors ${isDos
                      ? 'bg-dos-black border border-dos-white text-dos-white focus:bg-dos-gray focus:text-dos-black'
                      : 'bg-modern-bg-elevated border border-modern-border text-modern-text-primary rounded-lg focus:border-modern-accent'
                    }`}
                />
              </div>
            ))}
          </div>

          <div className={`flex gap-4 pt-4 ${isDos ? 'border-t border-dos-white' : 'border-t border-modern-border'}`}>
            <button type="submit" className={`font-bold ${isDos ? 'dos-button' : 'px-6 py-2 bg-modern-accent hover:bg-modern-accent-light text-white rounded-lg transition-colors'}`}>
              {isDos ? '[ F10: SAVE ]' : 'Save Changes'}
            </button>
            <button
              type="button"
              className={`font-bold ${isDos ? 'dos-button text-dos-red' : 'px-6 py-2 bg-modern-bg-elevated hover:bg-modern-bg-hover text-modern-text-secondary rounded-lg transition-colors'}`}
              onClick={handleDiscard}
            >
              {isDos ? '[ ESC: DISCARD ]' : 'Discard'}
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className={`p-4 space-y-3 ${isDos ? 'dos-panel border-dos-red-bright border-2' : 'bg-modern-bg-surface rounded-xl border border-modern-error/30'}`}>
          <h3 className={`font-bold uppercase text-xs ${isDos ? 'text-dos-red-bright' : 'text-modern-error'}`}>
            {isDos ? 'Danger Zone / Advanced' : 'Danger Zone'}
          </h3>
          <div className="flex items-center justify-between gap-4">
            <p className={`text-[10px] ${isDos ? 'text-dos-gray-bright' : 'text-modern-text-muted'}`}>
              {isDos
                ? 'Perform a hard reset of all application data. This cannot be undone.'
                : 'Reset all application data to defaults. This action cannot be undone.'}
            </p>
            <button
              type="button"
              className={`whitespace-nowrap ${isDos
                  ? 'dos-button bg-dos-red-bright text-dos-white'
                  : 'px-4 py-2 bg-modern-error hover:bg-red-600 text-white rounded-lg transition-colors'
                }`}
              onClick={clearLocalStorage}
            >
              {isDos ? '[ FORMAT C: ]' : 'Reset All Data'}
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className={`p-4 ${isDos ? 'dos-panel' : 'bg-modern-bg-surface rounded-xl border border-modern-border'}`}>
          <SystemInformation />
        </div>
      </div>

      {isDos && (
        <div className="text-[10px] text-dos-gray italic text-center">
          Use Arrow keys to navigate, ENTER to select, F10 to Save.
        </div>
      )}
    </div>
  )
}

export default Settings


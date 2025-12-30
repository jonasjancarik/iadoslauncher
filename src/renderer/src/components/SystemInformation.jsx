import React from 'react'
import { useTheme } from '../state/ThemeContext'

const SystemInformation = () => {
  const { theme } = useTheme()
  const isDos = theme === 'dos'

  const versions = {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
    platform: window.require('os').platform(),
    react: window.require('react/package.json').version
  }

  return (
    <div>
      <h2 className={`font-semibold ${isDos ? 'text-dos-cyan text-xs uppercase' : 'text-lg text-modern-text-primary'}`}>
        {isDos ? 'SYSTEM DIAGNOSTICS' : 'System Information'}
      </h2>
      <dl className={`mt-4 space-y-2 text-sm ${isDos ? '' : ''}`}>
        {Object.entries(versions).map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className={`capitalize ${isDos ? 'text-dos-gray' : 'text-modern-text-muted'}`}>
              {isDos ? label.toUpperCase() : label}
            </dt>
            <dd className={`font-semibold ${isDos ? 'text-dos-white' : 'text-modern-text-primary'}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default SystemInformation


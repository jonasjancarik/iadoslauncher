import React from 'react'

const SystemInformation = () => {
  const versions = {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
    platform: window.require('os').platform(),
    react: window.require('react/package.json').version
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700">System Information</h2>
      <dl className="mt-4 space-y-2 text-sm">
        {Object.entries(versions).map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="capitalize text-slate-500">{label}</dt>
            <dd className="font-semibold text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default SystemInformation

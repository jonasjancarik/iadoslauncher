import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../state/store'
import { checkPackageManagerAvailability, getDosboxInstallPath, installDosbox, openURL } from '../utils/system'

const Welcome = () => {
  const { state, dispatch } = useStore()
  const [dosboxExePath, setDosboxExePath] = React.useState(null)
  const [installRunning, setInstallRunning] = React.useState(false)
  const [installFailed, setInstallFailed] = React.useState(false)
  const [packageManagerAvailable, setPackageManagerAvailable] = React.useState(null)

  React.useEffect(() => {
    let interval = null

    const checkDosbox = () => {
      const path = getDosboxInstallPath(state.settings)
      setDosboxExePath(path)
    }

    checkDosbox()
    interval = setInterval(() => {
      if (!dosboxExePath) {
        checkDosbox()
      }
    }, 2000)

    checkPackageManagerAvailability()
      .then(() => setPackageManagerAvailable(true))
      .catch(() => setPackageManagerAvailable(false))

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [dosboxExePath, state.settings])

  const handleContinue = () => {
    dispatch({ type: 'UI_SET_SHOW_WELCOME', payload: false })
  }

  const handleInstall = async () => {
    setInstallRunning(true)
    setInstallFailed(false)
    try {
      await installDosbox()
      setDosboxExePath(getDosboxInstallPath(state.settings))
    } catch (error) {
      console.error(error)
      setInstallFailed(true)
    } finally {
      setInstallRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-800">Welcome!</h1>
        <p className="text-sm text-slate-600">Let's check a couple of things:</p>
        {dosboxExePath ?
          (
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                ✓
              </span>
              DOSBox is installed in <code className="rounded bg-slate-100 px-2 py-1 text-xs">{dosboxExePath}</code>
            </p>
          ) : (
            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  ✕
                </span>
                DOSBox doesn't seem to be installed.
              </p>
              {packageManagerAvailable !== null && (
                <div className="space-y-2">
                  {packageManagerAvailable ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                        disabled={installRunning}
                        onClick={handleInstall}
                      >
                        {installRunning ? 'Installing...' : 'Install DOSBox'}
                      </button>
                      {installFailed && (
                        <span>
                          Installation failed. Try again or install DOSBox{' '}
                          <button
                            type="button"
                            className="text-blue-600 underline"
                            onClick={() => openURL('https://www.dosbox.com/download.php?main=1')}
                          >
                            manually
                          </button>
                          .
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>
                        Install{' '}
                        <button
                          type="button"
                          className="text-blue-600 underline"
                          onClick={() => openURL('https://www.dosbox.com/download.php?main=1')}
                        >
                          DOSBox
                        </button>{' '}
                        first.
                      </span>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        onClick={() => setDosboxExePath(getDosboxInstallPath(state.settings))}
                      >
                        Check again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        <p className="text-sm text-slate-600">
          Games will be installed to{' '}
          <code className="rounded bg-slate-100 px-2 py-1 text-xs">{state.settings.installDirPathBase.value}</code>
        </p>
      </div>
      <div className="space-y-2">
        {dosboxExePath ? (
          <Link
            to="/library?page=1"
            className="inline-flex rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
            onClick={handleContinue}
          >
            Good to go!
          </Link>
        ) : (
          <div className="space-y-2">
            <Link
              to="/library?page=1"
              className="inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
              onClick={handleContinue}
            >
              Continue without DOSBox
            </Link>
            <p className="text-xs text-slate-500">
              You will be able to browse the library and open games in the browser, but you won't be able to save your
              progress or play offline. You can still install DOSBox later, though.
            </p>
          </div>
        )}
      </div>
      <div>
        <Link to="/settings" className="inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">
          Change settings
        </Link>
      </div>
    </div>
  )
}

export default Welcome

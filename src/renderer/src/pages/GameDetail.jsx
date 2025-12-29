import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Stars from '../components/Stars'
import { selectGame, useStore } from '../state/store'
import { getDosboxInstallPath, openURL } from '../utils/system'

const fs = window.require('fs')
const { ipcRenderer } = window.require('electron')
const { exec } = window.require('child_process')

const GameDetail = () => {
  const { identifier } = useParams()
  const { state, dispatch } = useStore()
  const game = selectGame(state, identifier)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [isInstalled, setIsInstalled] = React.useState(false)
  const [downloadedSize, setDownloadedSize] = React.useState(0)
  const [totalSize, setTotalSize] = React.useState(1)
  const [showDescription, setShowDescription] = React.useState(true)
  const [dosboxExePath, setDosboxExePath] = React.useState(null)

  const metadataLoaded = Boolean(game && game.metadata && Object.keys(game.metadata).length)

  React.useEffect(() => {
    if (!game) return

    const fetchDetails = async () => {
      if (metadataLoaded) return
      try {
        const response = await fetch(`https://archive.org/metadata/${identifier}`)
        const data = await response.json()
        dispatch({ type: 'METADATA_SET', payload: { identifier, metadata: data } })
      } catch (error) {
        console.error(error)
      }
    }

    fetchDetails()
  }, [dispatch, game, identifier, metadataLoaded])

  React.useEffect(() => {
    if (!game) return
    setIsInstalled(fs.existsSync(`${state.settings.installDirPathBase.value}${identifier}`))
  }, [game, identifier, state.settings.installDirPathBase.value])

  React.useEffect(() => {
    const checkDosbox = () => setDosboxExePath(getDosboxInstallPath(state.settings))
    checkDosbox()
    const interval = setInterval(() => {
      if (!dosboxExePath) checkDosbox()
    }, 2000)
    return () => clearInterval(interval)
  }, [dosboxExePath, state.settings])

  if (!game) {
    return <div className="text-sm text-slate-500">Loading game…</div>
  }

  const handleDownload = () => {
    if (!game.metadata?.files) return

    const zipFile = game.metadata.files.find((file) => file.format === 'ZIP')
    if (!zipFile) return

    const fileName = zipFile.name
    const filePath = `${state.settings.downloadDirPath.value}${fileName}`

    if (!fs.existsSync(state.settings.downloadDirPath.value)) {
      fs.mkdirSync(state.settings.downloadDirPath.value)
    } else if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    setIsDownloading(true)
    const downloadURL = `https://archive.org/download/${game.identifier}/${fileName}`

    ipcRenderer.send('downloadFile', {
      item: { downloadURL },
      filePath
    })

    const handleProgress = (_event, progressEvent) => {
      setTotalSize(parseInt(progressEvent.total, 10))
      setDownloadedSize(progressEvent.loaded)
    }

    ipcRenderer.on('downloadProgress', handleProgress)

    ipcRenderer.once('downloadEnd', () => {
      ipcRenderer.removeListener('downloadProgress', handleProgress)
      setIsDownloading(false)
      setTotalSize(1)
      setDownloadedSize(0)
      handleInstall(filePath)
    })

    ipcRenderer.once('downloadError', (_event, error) => {
      ipcRenderer.removeListener('downloadProgress', handleProgress)
      console.error(error)
      setIsDownloading(false)
    })
  }

  const handleInstall = (filePath) => {
    ipcRenderer.send('installGame', {
      filePath,
      installDirPathBase: state.settings.installDirPathBase.value,
      identifier: game.identifier
    })

    ipcRenderer.once('installEnd', () => {
      setIsInstalled(true)
      dispatch({ type: 'USER_MARK_INSTALLED', payload: { identifier: game.identifier } })
    })

    ipcRenderer.once('installError', (_event, error) => {
      console.error(error)
      setIsInstalled(false)
    })
  }

  const handlePlay = () => {
    const emulatorStart = game.metadata?.metadata?.emulator_start
    if (!emulatorStart) return

    let cmd = ''
    if (window.require('os').platform() === 'win32') {
      cmd = `"${state.settings.dosBoxExePath.value}" "${state.settings.installDirPathBase.value}${game.identifier}\\${emulatorStart.replaceAll('/', '\\')}" ${state.settings.dosBoxFlags.value.join(' ')}`
    } else {
      cmd = `"${state.settings.dosBoxExePath.value}" "${state.settings.installDirPathBase.value}${game.identifier}/${emulatorStart}" ${state.settings.dosBoxFlags.value.join(' ')}`
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
    })
  }

  const handlePlayOnline = () => {
    openURL(`https://archive.org/details/${game.identifier}`)
  }

  const parseReviewBody = (reviewBody) => {
    if (!reviewBody) return ''
    return `<p>${reviewBody.replace('\n', '</p><p>')}</p>`
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <img
            src={`https://archive.org/services/img/${game.identifier}`}
            alt={game.title}
            className="h-48 w-full rounded-t-xl object-cover"
          />
          <div className="space-y-3 p-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{game.title}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>{game.year}</span>
                <Stars rating={game.avg_rating} ratingsCount={game.num_reviews} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12c0-1.059.916-2.014 2.08-2.205a9 9 0 0 1 15.34 0c1.164.191 2.08 1.146 2.08 2.205 0 1.059-.916 2.014-2.08 2.205a9 9 0 0 1-15.34 0C3.166 14.014 2.25 13.059 2.25 12z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
              <span>{game.downloads?.toLocaleString('en')}×</span>
            </div>
            {isInstalled && dosboxExePath && (
              <button
                type="button"
                className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                onClick={handlePlay}
              >
                Play
              </button>
            )}
            {!isInstalled && dosboxExePath && (
              <button
                type="button"
                className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                disabled={isDownloading}
                onClick={handleDownload}
              >
                {isDownloading ? `Downloading ${Math.ceil((downloadedSize / totalSize) * 100)}%` : 'Install'}
              </button>
            )}
            {(!isInstalled || !dosboxExePath) && (
              <button
                type="button"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
                onClick={handlePlayOnline}
              >
                Play online
              </button>
            )}
            {!dosboxExePath && (
              <p className="text-xs text-slate-500">
                <Link className="text-blue-600" to="/welcome">
                  Install DOSBox
                </Link>{' '}
                first to play offline.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {metadataLoaded ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex gap-4 border-b border-slate-200 pb-2 text-sm">
              <button
                type="button"
                onClick={() => setShowDescription(true)}
                className={`pb-2 ${
                  showDescription ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500'
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setShowDescription(false)}
                className={`pb-2 ${
                  !showDescription ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500'
                } ${game.metadata.reviews?.length ? '' : 'cursor-not-allowed opacity-40'}`}
                disabled={!game.metadata.reviews?.length}
              >
                Reviews ({game.metadata.reviews?.length || 0})
              </button>
            </div>
            {showDescription ? (
              <div
                className="pt-4 text-sm leading-relaxed text-slate-600"
                dangerouslySetInnerHTML={{ __html: game.metadata.metadata?.description || '' }}
              />
            ) : (
              <div className="space-y-4 pt-4">
                {game.metadata.reviews?.map((review) => (
                  <div key={review.createdate} className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="text-sm font-semibold text-slate-700">{review.reviewtitle}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <Stars rating={Number(review.stars)} hideRating />
                      <span>{review.reviewer}</span>
                      <span>{review.reviewdate}</span>
                    </div>
                    <div
                      className="pt-2 text-sm leading-relaxed text-slate-600"
                      dangerouslySetInnerHTML={{ __html: parseReviewBody(review.reviewbody) }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-2 text-sm text-slate-400">Loading game metadata…</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameDetail

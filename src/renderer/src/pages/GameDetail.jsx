import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Stars from '../components/Stars'
import { useStore } from '../state/store'
import { useTheme } from '../state/ThemeContext'

const { ipcRenderer, shell } = window.require('electron')
const { exec } = window.require('child_process')
const fs = window.require('fs')

const GameDetail = () => {
  const { identifier } = useParams()
  const { state, dispatch } = useStore()
  const { theme } = useTheme()
  const [game, setGame] = React.useState(null)
  const [metadataLoaded, setMetadataLoaded] = React.useState(false)
  const [showDescription, setShowDescription] = React.useState(true)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [totalSize, setTotalSize] = React.useState(1)
  const [downloadedSize, setDownloadedSize] = React.useState(0)
  const [isInstalled, setIsInstalled] = React.useState(false)

  const isDos = theme === 'dos'
  const dosboxExePath = state.settings.dosBoxExePath?.value

  React.useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(`https://archive.org/metadata/${identifier}`)
      const data = await response.json()
      setGame({ ...data, identifier })
      setMetadataLoaded(true)

      const isGameInstalled = Boolean(state.user.installed?.[identifier])
      setIsInstalled(isGameInstalled)
    }

    fetchGame()
  }, [identifier, state.user.installed])

  if (!game) return (
    <div className={`animate-pulse ${isDos ? 'text-dos-yellow' : 'text-modern-accent'}`}>
      {isDos ? 'ACCESSING DATABASE...' : 'Loading game details...'}
    </div>
  )

  const handleDownload = () => {
    const fileName = game.files.find(f => f.name.endsWith('.zip'))?.name
    if (!fileName) return

    const installDir = state.settings.installDirPathBase?.value || ''
    const filePath = `${installDir}${fileName}`
    if (!fs.existsSync(installDir)) {
      fs.mkdirSync(installDir, { recursive: true })
    } else if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    setIsDownloading(true)
    const downloadURL = `https://archive.org/download/${game.identifier}/${fileName}`

    ipcRenderer.send('downloadFile', { item: { downloadURL }, filePath })

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

  const handleInstall = filePath => {
    ipcRenderer.send('installGame', {
      filePath,
      installDirPathBase: state.settings.installDirPathBase?.value,
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
    const emulatorStart = game.metadata?.emulator_start
    if (!emulatorStart) return

    const flags = Array.isArray(state.settings.dosBoxFlags?.value)
      ? state.settings.dosBoxFlags.value.join(' ')
      : (state.settings.dosBoxFlags?.value || '')

    let cmd = ''
    if (window.require('os').platform() === 'win32') {
      cmd = `"${state.settings.dosBoxExePath?.value}" "${state.settings.installDirPathBase?.value}${game.identifier}\\${emulatorStart.replaceAll('/', '\\')}" ${flags}`
    } else {
      cmd = `"${state.settings.dosBoxExePath?.value}" "${state.settings.installDirPathBase?.value}${game.identifier}/${emulatorStart}" ${flags}`
    }

    exec(cmd, (error) => { if (error) console.error(error) })
  }

  const handlePlayOnline = () => {
    shell.openExternal(`https://archive.org/details/${game.identifier}`)
  }

  const parseReviewBody = reviewBody => reviewBody ? reviewBody.replace(/\n/g, '<br/>') : ''

  const downloadProgress = Math.ceil((downloadedSize / totalSize) * 100)

  return (
    <div className={`flex flex-col h-full space-y-4 ${isDos ? 'text-dos-white' : 'text-modern-text-primary'}`}>
      <div className={`flex items-center gap-4 pb-2 font-bold uppercase ${isDos ? 'border-b-2 border-dos-white text-dos-cyan' : 'border-b border-modern-border'}`}>
        <span>{isDos ? 'FILE: ' : ''}{game.identifier}</span>
        <span className={`ml-auto ${isDos ? 'text-dos-yellow' : ''}`}>
          {isDos ? 'STATUS: ' : ''}
          <span className={isInstalled ? (isDos ? 'text-dos-green-bright' : 'text-modern-success') : (isDos ? '' : 'text-modern-text-muted')}>
            {isInstalled ? (isDos ? 'INSTALLED' : '✓ Installed') : (isDos ? 'REMOTE' : 'Not installed')}
          </span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr] flex-1 overflow-hidden">
        <div className="space-y-4 overflow-auto">
          <div className={`p-2 ${isDos ? 'dos-panel' : 'bg-modern-bg-surface rounded-xl border border-modern-border overflow-hidden'}`}>
            <img
              src={`https://archive.org/services/img/${game.identifier}`}
              alt={game.metadata?.title}
              className={`w-full object-cover ${isDos ? 'border-2 border-dos-white grayscale hover:grayscale-0 transition-all' : 'rounded-lg'}`}
            />
          </div>

          <div className={`p-4 space-y-3 ${isDos ? 'dos-panel' : 'bg-modern-bg-surface rounded-xl border border-modern-border'}`}>
            <h2 className={`font-bold uppercase ${isDos ? 'text-sm text-dos-yellow' : 'text-lg text-modern-text-primary'}`}>{game.metadata?.title}</h2>
            <div className={`space-y-1 ${isDos ? 'text-[10px]' : 'text-sm text-modern-text-secondary'}`}>
              <div className="flex justify-between"><span>{isDos ? 'YEAR:' : 'Year'}</span><span>{game.metadata?.year || 'Unknown'}</span></div>
              <div className="flex justify-between"><span>{isDos ? 'PUBLISHER:' : 'Publisher'}</span><span className="truncate ml-2">{game.metadata?.creator || 'Unknown'}</span></div>
              <div className="flex justify-between items-center"><span>{isDos ? 'RATING:' : 'Rating'}</span><Stars rating={game.metadata?.avg_rating} hideRating /></div>
            </div>

            <div className={`pt-2 space-y-2 ${isDos ? 'border-t border-dos-white' : 'border-t border-modern-border'}`}>
              {isInstalled && dosboxExePath && (
                <button type="button" className={`w-full font-bold ${isDos ? 'dos-button' : 'py-3 bg-gradient-to-r from-modern-success to-emerald-600 text-white rounded-lg'}`} onClick={handlePlay}>
                  {isDos ? '[ RUN GAME ]' : '▶ Play Game'}
                </button>
              )}
              {!isInstalled && dosboxExePath && (
                <button type="button" className={`w-full font-bold disabled:opacity-50 ${isDos ? 'dos-button' : 'py-3 bg-gradient-to-r from-modern-accent to-purple-500 text-white rounded-lg'}`} disabled={isDownloading} onClick={handleDownload}>
                  {isDownloading ? (isDos ? `READING: ${downloadProgress}%` : `Downloading ${downloadProgress}%`) : (isDos ? '[ INSTALL ]' : '↓ Install Game')}
                </button>
              )}
              <button type="button" className={`w-full text-xs ${isDos ? 'dos-button' : 'py-2 bg-modern-bg-elevated hover:bg-modern-bg-hover text-modern-text-secondary rounded-lg'}`} onClick={handlePlayOnline}>
                {isDos ? '[ VIEW ON WEB ]' : '🌐 Play in Browser'}
              </button>
            </div>
          </div>
        </div>

        <div className={`flex flex-col overflow-hidden ${isDos ? 'dos-panel bg-dos-blue' : 'bg-modern-bg-surface rounded-xl border border-modern-border'}`}>
          <div className={`flex text-xs font-bold uppercase ${isDos ? 'bg-dos-gray text-dos-black' : 'bg-modern-bg-elevated border-b border-modern-border'}`}>
            <button
              onClick={() => setShowDescription(true)}
              className={`px-4 py-2 transition-colors ${isDos
                ? (showDescription ? 'bg-dos-blue text-dos-white' : 'hover:bg-dos-white')
                : (showDescription ? 'text-modern-accent border-b-2 border-modern-accent bg-modern-bg-surface' : 'text-modern-text-muted hover:text-modern-text-primary')
                }`}
            >
              {isDos ? 'Description.txt' : 'Description'}
            </button>
            <button
              onClick={() => setShowDescription(false)}
              className={`px-4 py-2 transition-colors ${isDos
                ? (!showDescription ? 'bg-dos-blue text-dos-white' : 'hover:bg-dos-white')
                : (!showDescription ? 'text-modern-accent border-b-2 border-modern-accent bg-modern-bg-surface' : 'text-modern-text-muted hover:text-modern-text-primary')
                }`}
            >
              {isDos ? `Feedback.log (${game.reviews?.length || 0})` : `Reviews (${game.reviews?.length || 0})`}
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-auto p-4 text-sm leading-relaxed ${isDos ? 'bg-dos-blue font-dos' : ''}`}>
            {showDescription ? (
              <div
                className={`prose max-w-none ${isDos ? 'prose-invert text-dos-white' : 'prose-slate dark:prose-invert text-modern-text-secondary'}`}
                dangerouslySetInnerHTML={{ __html: game.metadata?.description || (isDos ? 'NO DESCRIPTION AVAILABLE' : 'No description available.') }}
              />
            ) : (
              <div className="space-y-6">
                {game.reviews?.map((review, idx) => (
                  <div key={idx} className={`pb-4 last:border-0 ${isDos ? 'border-b border-dos-gray' : 'border-b border-modern-border'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold uppercase ${isDos ? 'text-dos-yellow' : 'text-modern-text-primary'}`}>
                        {review.reviewtitle}
                      </h3>
                      <Stars rating={Number(review.stars)} hideRating />
                    </div>
                    <div className={`text-[10px] mb-2 ${isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}`}>
                      {isDos ? 'BY:' : 'by'} {review.reviewer} | {isDos ? 'DATE:' : ''} {review.reviewdate}
                    </div>
                    <div
                      className={`text-xs italic ${isDos ? 'text-dos-white' : 'text-modern-text-secondary'}`}
                      dangerouslySetInnerHTML={{ __html: parseReviewBody(review.reviewbody) }}
                    />
                  </div>
                ))}
                {!game.reviews?.length && (
                  <div className={isDos ? 'text-dos-gray' : 'text-modern-text-muted'}>
                    {isDos ? 'NO REVIEWS FOUND' : 'No reviews yet.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetail


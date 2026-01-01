import React from 'react'
import GameCard from '../components/GameCard'
import SearchInput from '../components/SearchInput'
import { useStore } from '../state/store'
import { useTheme } from '../state/ThemeContext'

const Installed = () => {
  const { state } = useStore()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = React.useState('')

  const isDos = theme === 'dos'

  // Convert installed object to array with identifiers and filter by search query
  const installedGames = Object.entries(state.user.installed || {})
    .map(([identifier, data]) => ({
      identifier,
      ...data,
      // Try to find the title from catalog if available, though it might not be for all items
      // if they were installed manually or catalog not synced. 
      // But usually they come from catalog.
      title: state.catalog.games[identifier]?.title || identifier
    }))
    .filter(game => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        game.identifier.toLowerCase().includes(query) ||
        (game.title && game.title.toLowerCase().includes(query))
      )
    })

  return (
    <div className={`flex flex-col h-full space-y-4 ${isDos ? 'text-dos-white' : 'text-modern-text-primary'}`}>
      <div className={`flex items-center justify-between pb-2 ${isDos ? 'border-b-2 border-dos-white' : 'border-b border-modern-border'}`}>
        <h2 className={`font-bold uppercase tracking-widest ${isDos ? 'text-dos-yellow' : 'text-xl text-modern-accent'}`}>
          {isDos ? 'Local Drive [C:]' : 'Installed Games'}
        </h2>
        <div className="flex items-center space-x-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <div className={`text-xs ${isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}`}>
            {isDos
              ? `Path: ${state.settings.installDirPathBase?.value || 'C:\\IADOS\\GAMES\\'}`
              : `${installedGames.length} games found`}
          </div>
        </div>
      </div>

      {installedGames.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className={`p-8 text-center space-y-4 max-w-md ${isDos
            ? 'dos-panel'
            : 'bg-modern-bg-surface rounded-xl border border-modern-border'
            }`}>
            <div className={`font-bold uppercase ${isDos ? 'text-dos-red-bright' : 'text-modern-text-muted text-lg'}`}>
              {isDos ? 'Drive Empty' : 'No games installed'}
            </div>
            <p className={`text-xs ${isDos ? '' : 'text-modern-text-muted'}`}>
              {isDos
                ? 'No software installed in this sector. Proceed to Library to download games.'
                : 'Browse the library to find and install games.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 overflow-auto pb-4">
          {installedGames.map(game => (
            <GameCard key={game.identifier} game={game} />
          ))}
        </div>
      )}

      <div className={`mt-auto pt-4 flex justify-between text-[10px] uppercase ${isDos
        ? 'border-t-2 border-dos-white text-dos-cyan'
        : 'border-t border-modern-border text-modern-text-muted'
        }`}>
        <span>{installedGames.length} {isDos ? 'file(s) found' : 'games'}</span>
        <span>{isDos ? 'Free Space: 1.44 MB' : ''}</span>
      </div>
    </div>
  )
}

export default Installed


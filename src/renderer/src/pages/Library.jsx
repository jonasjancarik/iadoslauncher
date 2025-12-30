import React from 'react'
import { useSearchParams } from 'react-router-dom'
import GameCard from '../components/GameCard'
import Pagination from '../components/Pagination'
import { useStore } from '../state/store'
import { useTheme } from '../state/ThemeContext'

const ROWS = 18

const Library = () => {
  const { dispatch } = useStore()
  const { theme } = useTheme()
  const [games, setGames] = React.useState([])
  const [totalPages, setTotalPages] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)

  const isDos = theme === 'dos'

  const updatePage = nextPage => {
    setSearchParams({ page: String(nextPage) })
  }

  React.useEffect(() => {
    let isActive = true

    const fetchGames = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://archive.org/advancedsearch.php?q=collection:softwarelibrary_msdos_games&sort[]=downloads desc&fl[]=avg_rating&fl[]=creator&fl[]=downloads&fl[]=genre&fl[]=identifier&fl[]=item_size&fl[]=language&fl[]=name&fl[]=num_reviews&fl[]=oai_updatedate&fl[]=publicdate&fl[]=title&fl[]=type&fl[]=year&rows=${ROWS}&page=${page}&output=json`
        )
        const data = await response.json()
        if (!isActive) return
        setGames(data.response.docs)
        setTotalPages(Math.ceil(data.response.numFound / ROWS))
        dispatch({ type: 'CATALOG_ADD_MANY', payload: data.response.docs })
      } catch (error) {
        console.error(error)
      } finally {
        if (isActive) setLoading(false)
      }
    }

    fetchGames()

    return () => {
      isActive = false
    }
  }, [page, dispatch])

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className={`flex items-center justify-between pb-2 ${isDos ? 'border-b-2 border-dos-white' : 'border-b border-modern-border'}`}>
        <h2 className={`font-bold uppercase tracking-widest ${isDos ? 'text-dos-yellow' : 'text-xl text-modern-accent'}`}>
          {isDos ? 'Library Catalog' : 'Game Library'}
        </h2>
        <div className={`text-xs ${isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}`}>
          {isDos ? 'Sort: Downloads [DESC]' : 'Sorted by popularity'}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className={`p-6 text-center ${isDos ? 'dos-panel animate-pulse' : 'bg-modern-bg-surface rounded-xl border border-modern-border'}`}>
            <span className={`font-bold ${isDos ? 'text-dos-yellow' : 'text-modern-accent'}`}>
              {isDos ? 'WORKING...' : 'Loading...'}
            </span>
            <div className={`mt-2 text-xs ${isDos ? '' : 'text-modern-text-muted'}`}>
              {isDos ? 'Retrieving database records' : 'Fetching games from Internet Archive'}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 overflow-auto pb-4">
          {games.map(game => (
            <GameCard key={game.identifier} game={game} />
          ))}
        </div>
      )}

      <div className={`mt-auto pt-4 ${isDos ? 'border-t-2 border-dos-white' : 'border-t border-modern-border'}`}>
        <Pagination page={page} totalPages={totalPages} onChange={updatePage} />
      </div>
    </div>
  )
}

export default Library


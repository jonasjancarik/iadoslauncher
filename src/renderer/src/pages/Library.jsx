import React from 'react'
import { useSearchParams } from 'react-router-dom'
import GameCard from '../components/GameCard'
import Pagination from '../components/Pagination'
import { useStore } from '../state/store'

const ROWS = 18

const Library = () => {
  const { dispatch } = useStore()
  const [games, setGames] = React.useState([])
  const [totalPages, setTotalPages] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)

  const updatePage = (nextPage) => {
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
    <div className="space-y-6">
      {loading ? (
        <div className="text-sm text-slate-500">Loading library…</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {games.map((game) => (
            <GameCard key={game.identifier} game={game} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={updatePage} />
    </div>
  )
}

export default Library

import React from 'react'
import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'
import { useStore } from '../state/store'

const fs = window.require('fs')

const Installed = () => {
  const { state, dispatch } = useStore()
  const [games, setGames] = React.useState([])

  React.useEffect(() => {
    const loadInstalled = async () => {
      const installDir = state.settings.installDirPathBase.value
      if (!fs.existsSync(installDir)) {
        setGames([])
        return
      }

      const identifiers = fs.readdirSync(installDir)
      identifiers.forEach(identifier => {
        dispatch({
          type: 'USER_MARK_INSTALLED',
          payload: { identifier, source: 'filesystem' }
        })
      })

      const resolved = []
      for (const identifier of identifiers) {
        if (state.catalog.games[identifier]) {
          resolved.push(state.catalog.games[identifier])
        } else {
          try {
            const q = `collection:(softwarelibrary_msdos_games) AND identifier:(${identifier})`
            const response = await fetch(
              `https://archive.org/advancedsearch.php?q=${q}&sort[]=downloads desc&fl[]=avg_rating&fl[]=creator&fl[]=downloads&fl[]=genre&fl[]=identifier&fl[]=item_size&fl[]=language&fl[]=name&fl[]=num_reviews&fl[]=oai_updatedate&fl[]=publicdate&fl[]=title&fl[]=type&fl[]=year&rows=1&page=1&output=json`
            )
            const data = await response.json()
            if (data.response.docs.length) {
              const game = data.response.docs[0]
              dispatch({ type: 'CATALOG_ADD_MANY', payload: [game] })
              resolved.push(game)
            }
          } catch (error) {
            console.error(error)
          }
        }
      }

      setGames(resolved)
    }

    loadInstalled()
  }, [state.settings.installDirPathBase.value, dispatch])

  if (!games.length) {
    return (
      <div className="space-y-2 text-sm text-slate-600">
        <p>No games found in the install directory ({state.settings.installDirPathBase.value}).</p>
        <p>
          You can change the install directory location in the{' '}
          <Link className="text-blue-600" to="/settings">
            settings
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {games.map(game => (
        <GameCard key={game.identifier} game={game} />
      ))}
    </div>
  )
}

export default Installed

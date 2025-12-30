import React from 'react'
import { Link } from 'react-router-dom'
import Stars from './Stars'
import { useTheme } from '../state/ThemeContext'

const GameCard = ({ game }) => {
  const { theme } = useTheme()
  const isDos = theme === 'dos'

  if (!game) return null

  return (
    <Link
      to={`/games/${game.identifier}`}
      className={`block group transition-all ${isDos
          ? 'border-2 border-dos-white bg-dos-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-dos-gray hover:text-dos-black'
          : 'bg-modern-bg-surface border border-modern-border rounded-xl overflow-hidden hover:border-modern-accent hover:shadow-lg hover:shadow-modern-accent/10 hover:-translate-y-1'
        }`}
    >
      <div className="relative">
        <img
          src={`https://archive.org/services/img/${game.identifier}`}
          alt={game.title}
          className={`h-32 w-full object-cover ${isDos
              ? 'border-b-2 border-dos-white grayscale group-hover:grayscale-0 transition-all'
              : 'group-hover:scale-105 transition-transform duration-300'
            }`}
          loading="lazy"
        />
        <div className={`absolute top-1 right-1 text-[10px] px-1 ${isDos
            ? 'bg-dos-black text-dos-yellow border border-dos-white'
            : 'bg-modern-bg-dark/80 text-modern-text-primary rounded px-2 py-0.5 backdrop-blur-sm'
          }`}>
          {game.year || '????'}
        </div>
      </div>
      <div className="p-2 space-y-1">
        <h3 className={`text-xs font-bold truncate ${isDos ? 'uppercase' : ''}`}>{game.title}</h3>
        <div className={`flex items-center justify-between text-[10px] ${isDos ? '' : 'text-modern-text-muted'}`}>
          <div className="flex items-center gap-1">
            <span className={isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}>
              {isDos ? 'SZ:' : ''}
            </span>
            <span>{game.item_size ? (game.item_size / 1024 / 1024).toFixed(1) + 'M' : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={isDos ? 'text-dos-cyan' : 'text-modern-text-muted'}>
              {isDos ? 'DL:' : '↓'}
            </span>
            <span>{game.downloads?.toLocaleString('en') || 0}</span>
          </div>
        </div>
        <div className={`pt-1 flex justify-center ${isDos ? 'border-t border-dos-white' : 'border-t border-modern-border'}`}>
          <Stars rating={game.avg_rating} ratingsCount={game.num_reviews} hideRating />
        </div>
      </div>
    </Link>
  )
}

export default GameCard


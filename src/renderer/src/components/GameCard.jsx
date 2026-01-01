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
      className={`block group transition-all duration-300 ${isDos
        ? 'border-2 border-dos-white bg-dos-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-dos-gray hover:text-dos-black'
        : 'bg-modern-bg-surface border border-modern-border rounded-2xl overflow-hidden hover:border-modern-accent hover:shadow-premium-hover hover:-translate-y-1.5'
        }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={`https://archive.org/services/img/${game.identifier}`}
          alt={game.title}
          className={`h-full w-full object-cover ${isDos
            ? 'border-b-2 border-dos-white grayscale group-hover:grayscale-0 transition-all'
            : 'group-hover:scale-110 transition-transform duration-500 ease-out'
            }`}
          loading="lazy"
        />
        <div className={`absolute top-2 right-2 text-[10px] font-bold tracking-tight ${isDos
          ? 'bg-dos-black text-dos-yellow border border-dos-white px-1'
          : 'glass text-modern-text-primary rounded-lg px-2 py-1 shadow-sm'
          }`}>
          {game.year || '????'}
        </div>
        {!isDos && (
          <div className="absolute inset-0 bg-gradient-to-t from-modern-bg-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>
      <div className="p-3 space-y-2">
        <h3 className={`text-sm font-semibold leading-tight line-clamp-2 h-10 ${isDos ? 'uppercase' : 'text-modern-text-primary group-hover:text-modern-accent transition-colors'}`}>
          {game.title}
        </h3>
        <div className={`flex items-center justify-between text-[11px] ${isDos ? '' : 'text-modern-text-secondary'}`}>
          <div className="flex items-center gap-1.5">
            <span className={isDos ? 'text-dos-cyan' : 'text-modern-accent/70'}>
              {isDos ? 'SZ:' : 'Size'}
            </span>
            <span className="font-medium text-modern-text-primary">{game.item_size ? (game.item_size / 1024 / 1024).toFixed(1) + ' MB' : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={isDos ? 'text-dos-cyan' : 'text-modern-accent/70'}>
              {isDos ? 'DL:' : '↓'}
            </span>
            <span className="font-medium text-modern-text-primary">{game.downloads?.toLocaleString('en') || 0}</span>
          </div>
        </div>
        <div className={`pt-2 flex justify-center ${isDos ? 'border-t border-dos-white' : 'border-t border-modern-border'}`}>
          <Stars rating={game.avg_rating} ratingsCount={game.num_reviews} hideRating />
        </div>
      </div>
    </Link>
  )
}

export default GameCard


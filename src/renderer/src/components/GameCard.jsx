import React from 'react'
import { Link } from 'react-router-dom'
import Stars from './Stars'

const GameCard = ({ game }) => {
  if (!game) return null

  return (
    <Link
      to={`/games/${game.identifier}`}
      className="block rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <img
        src={`https://archive.org/services/img/${game.identifier}`}
        alt={game.title}
        className="h-40 w-full rounded-t-xl object-cover"
        loading="lazy"
      />
      <div className="space-y-2 p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{game.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>{game.year}</span>
            <Stars rating={game.avg_rating} ratingsCount={game.num_reviews} hideRating />
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
          <span>{game.downloads?.toLocaleString('en') || 0}×</span>
        </div>
      </div>
    </Link>
  )
}

export default GameCard

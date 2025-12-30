import React from 'react'
import { useTheme } from '../state/ThemeContext'

const StarIcon = ({ type, isDos }) => {
  if (type === 'full') return <span className={isDos ? 'text-dos-yellow' : 'text-yellow-400'}>★</span>
  if (type === 'half') return <span className={isDos ? 'text-dos-yellow' : 'text-yellow-400'}>½</span>
  return <span className={isDos ? 'text-dos-gray' : 'text-modern-text-muted'}>☆</span>
}

const buildStars = rating => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return { full, half, empty }
}

const Stars = ({ rating = 0, ratingsCount = null, hideRating = false }) => {
  const { theme } = useTheme()
  const isDos = theme === 'dos'
  const ratingStars = buildStars(rating)

  return (
    <span className={`inline-flex items-center gap-1 ${isDos ? 'font-dos' : 'font-modern'}`}>
      {Array.from({ length: ratingStars.full }).map((_, index) => (
        <StarIcon key={`full-${index}`} type="full" isDos={isDos} />
      ))}
      {Array.from({ length: ratingStars.half }).map((_, index) => (
        <StarIcon key={`half-${index}`} type="half" isDos={isDos} />
      ))}
      {Array.from({ length: ratingStars.empty }).map((_, index) => (
        <StarIcon key={`empty-${index}`} type="empty" isDos={isDos} />
      ))}
      {(!hideRating || ratingsCount) && (
        <span className={`ml-1 text-[10px] ${isDos ? 'text-dos-cyan font-dos' : 'text-modern-text-muted'}`}>
          {!hideRating && `(${rating.toFixed(1)})`}
          {ratingsCount ? ` [${ratingsCount}]` : ''}
        </span>
      )}
    </span>
  )
}

export default Stars


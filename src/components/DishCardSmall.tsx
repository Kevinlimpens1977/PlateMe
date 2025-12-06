import Image from 'next/image'
import { Dish } from '@/lib/supabase'

interface DishCardSmallProps {
  dish: Dish
  rank?: number
  onSelect?: () => void
  showRank?: boolean
  isSelected?: boolean
}

export default function DishCardSmall({ 
  dish, 
  rank, 
  onSelect, 
  showRank = false, 
  isSelected = false 
}: DishCardSmallProps) {
  return (
    <div 
      onClick={onSelect}
      className={`
        bg-white rounded-xl shadow-md overflow-hidden transition-all cursor-pointer
        ${onSelect ? 'hover:shadow-lg hover:scale-105' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      <div className="relative">
        {/* Rank Badge */}
        {showRank && rank !== undefined && (
          <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
            {rank}
          </div>
        )}

        {/* Image */}
        <div className="relative h-32 w-full">
          {dish.image_url ? (
            <Image
              src={dish.image_url}
              alt={dish.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
            {dish.name}
          </h3>
          {dish.subtitle && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {dish.subtitle}
            </p>
          )}
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
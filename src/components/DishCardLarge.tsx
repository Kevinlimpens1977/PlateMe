import Image from 'next/image'
import { Dish } from '@/lib/supabase'

interface DishCardLargeProps {
  dish: Dish
  onSwipe?: (direction: 'left' | 'right' | 'up') => void
  showSwipeHints?: boolean
}

export default function DishCardLarge({ dish, onSwipe, showSwipeHints = false }: DishCardLargeProps) {
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (onSwipe) {
      onSwipe(direction)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image */}
        <div className="relative h-64 w-full">
          {dish.image_url ? (
            <Image
              src={dish.image_url}
              alt={dish.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{dish.name}</h2>
          {dish.subtitle && (
            <p className="text-gray-600 mb-4">{dish.subtitle}</p>
          )}
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Ingrediënten</h3>
              <p className="text-sm text-gray-600">{dish.ingredients}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Bereiding</h3>
              <p className="text-sm text-gray-600">{dish.preparation}</p>
            </div>
          </div>
        </div>

        {/* Swipe Hints */}
        {showSwipeHints && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-full">
              <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-80">
                ← Links (Niet leuk)
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-80">
                Rechts (Leuk) →
              </div>
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-full">
              <div className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-80">
                ↑ Top (Favoriet)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Swipe Buttons */}
      {onSwipe && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => handleSwipe('left')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Niet leuk
          </button>
          <button
            onClick={() => handleSwipe('up')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ↑ Favoriet
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Leuk →
          </button>
        </div>
      )}
    </div>
  )
}
import Image from 'next/image'
import { DishWithScore } from '@/lib/tournament'

interface DuelCardProps {
  dish1: DishWithScore
  dish2: DishWithScore
  onChoice: (winner: DishWithScore) => void
}

export default function DuelCard({ dish1, dish2, onChoice }: DuelCardProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welk gerecht vind je beter?</h2>
        <p className="text-gray-600 mt-2">Kies het gerecht dat je zou willen eten</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Dish 1 */}
        <div 
          onClick={() => onChoice(dish1)}
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
        >
          <div className="relative h-48 w-full">
            {dish1.image_url ? (
              <Image
                src={dish1.image_url}
                alt={dish1.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-3xl">🍽️</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{dish1.name}</h3>
            {dish1.subtitle && (
              <p className="text-gray-600 mb-3">{dish1.subtitle}</p>
            )}
            
            <div className="text-sm text-gray-500">
              <p><strong>Ingrediënten:</strong> {dish1.ingredients}</p>
              <p className="mt-1"><strong>Bereiding:</strong> {dish1.preparation}</p>
            </div>

            {dish1.score > 0 && (
              <div className="mt-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block">
                Score: {dish1.score}
              </div>
            )}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center md:hidden">
          <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold">VS</div>
        </div>

        {/* Dish 2 */}
        <div 
          onClick={() => onChoice(dish2)}
          className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
        >
          <div className="relative h-48 w-full">
            {dish2.image_url ? (
              <Image
                src={dish2.image_url}
                alt={dish2.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-3xl">🍽️</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{dish2.name}</h3>
            {dish2.subtitle && (
              <p className="text-gray-600 mb-3">{dish2.subtitle}</p>
            )}
            
            <div className="text-sm text-gray-500">
              <p><strong>Ingrediënten:</strong> {dish2.ingredients}</p>
              <p className="mt-1"><strong>Bereiding:</strong> {dish2.preparation}</p>
            </div>

            {dish2.score > 0 && (
              <div className="mt-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block">
                Score: {dish2.score}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop VS Divider */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg">VS</div>
      </div>
    </div>
  )
}
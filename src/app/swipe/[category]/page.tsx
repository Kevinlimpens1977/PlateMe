'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Header, DishCardLarge, ProgressDots } from '@/components'
import { supabase } from '@/lib/supabase'
import { Category, CATEGORIES, DishWithScore, SwipeState, SWIPE_DIRECTIONS } from '@/types'

export default function SwipePage() {
  const params = useParams()
  const category = params.category as Category
  const router = useRouter()
  
  // Validate category
  if (!CATEGORIES.find(cat => cat.value === category)) {
    notFound()
  }

  const [swipeState, setSwipeState] = useState<SwipeState>({
    currentDishIndex: 0,
    dishes: [],
    category
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDishes()
  }, [category])

  const loadDishes = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading dishes:', error)
        return
      }

      if (data && data.length > 0) {
        // Take max 10 dishes and add score property
        const dishesWithScore: DishWithScore[] = data
          .slice(0, 10)
          .map(dish => ({ ...dish, score: 0 }))

        setSwipeState({
          currentDishIndex: 0,
          dishes: dishesWithScore,
          category
        })
      } else {
        // No dishes found, redirect to duel
        router.push(`/duel/${category}`)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const swipeDirection = SWIPE_DIRECTIONS.find(d => d.direction === direction)
    if (!swipeDirection) return

    const newDishes = [...swipeState.dishes]
    const currentDish = newDishes[swipeState.currentDishIndex]
    
    if (currentDish) {
      // Update score based on swipe direction
      currentDish.score = swipeDirection.score
    }

    // Move to next dish or finish
    const nextIndex = swipeState.currentDishIndex + 1
    
    if (nextIndex >= newDishes.length) {
      // All dishes swiped, store results and go to duel
      const dishesWithScore = newDishes.filter(dish => dish.score > 0)
      
      // Store in localStorage for duel page
      localStorage.setItem(`dishes_${category}`, JSON.stringify(dishesWithScore))
      
      router.push(`/duel/${category}`)
    } else {
      setSwipeState({
        ...swipeState,
        currentDishIndex: nextIndex,
        dishes: newDishes
      })
    }
  }

  const currentDish = swipeState.dishes[swipeState.currentDishIndex]
  const progress = swipeState.currentDishIndex
  const total = swipeState.dishes.length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header currentCategory={category} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-xl text-gray-600">Gerechten laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentDish) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header currentCategory={category} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-gray-600">Geen gerechten gevonden</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentCategory={category} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Gerecht {progress + 1} van {total}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((progress / total) * 100)}% voltooid
            </span>
          </div>
          <ProgressDots current={progress} total={total} />
        </div>

        {/* Current Dish */}
        <div className="mb-8">
          <DishCardLarge 
            dish={currentDish} 
            onSwipe={handleSwipe}
            showSwipeHints={true}
          />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">
                {swipeState.dishes.filter(d => d.score === 0).length}
              </div>
              <div className="text-sm text-gray-600">Niet leuk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {swipeState.dishes.filter(d => d.score === 1).length}
              </div>
              <div className="text-sm text-gray-600">Leuk</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {swipeState.dishes.filter(d => d.score === 2).length}
              </div>
              <div className="text-sm text-gray-600">Favorieten</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
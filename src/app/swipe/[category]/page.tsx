'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Category, CATEGORIES, DishWithScore, SwipeState, SWIPE_DIRECTIONS } from '@/types'
import { SwipeCard } from '@/components/SwipeCard'
import { PageContainer } from '@/components/ui/PageContainer'
import { AnimatePresence } from 'framer-motion'

export default function SwipePage() {
  const params = useParams()
  const category = params.category as Category
  const router = useRouter()

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
        const dishesWithScore: DishWithScore[] = data
          .slice(0, 10)
          .map(dish => ({ ...dish, score: 0 }))

        setSwipeState({
          currentDishIndex: 0,
          dishes: dishesWithScore,
          category
        })
      } else {
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
      currentDish.score = swipeDirection.score
    }

    const nextIndex = swipeState.currentDishIndex + 1

    if (nextIndex >= newDishes.length) {
      const dishesWithScore = newDishes.filter(dish => dish.score > 0)
      localStorage.setItem(`dishes_${category}`, JSON.stringify(dishesWithScore))

      // Delay slightly for animation to finish
      setTimeout(() => {
        router.push(`/duel/${category}`)
      }, 500)
    } else {
      setSwipeState({
        ...swipeState,
        currentDishIndex: nextIndex,
        dishes: newDishes
      })
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex-1 flex items-center justify-center animate-pulse">
          <div className="text-6xl">🍽️</div>
        </div>
      </PageContainer>
    )
  }

  const currentDish = swipeState.dishes[swipeState.currentDishIndex]
  const nextDish = swipeState.dishes[swipeState.currentDishIndex + 1]

  if (!currentDish) return null

  return (
    <PageContainer>
      {/* Header / Progress - Minimal */}
      <div className="absolute top-4 left-0 w-full px-6 z-20 flex justify-between items-center bg-transparent">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 shadow-sm">
          ←
        </button>
        <div className="text-sm font-semibold text-gray-600 bg-white/40 backdrop-blur-md px-3 py-1 rounded-full">
          {category.charAt(0).toUpperCase() + category.slice(1)} • {swipeState.currentDishIndex + 1}/{swipeState.dishes.length}
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative w-full h-[65vh] max-h-[700px] mt-16 min-h-[400px]">
        {nextDish && (
          <SwipeCard
            key={nextDish.id}
            dish={nextDish}
            onSwipe={() => { }}
            isFront={false}
          />
        )}

        <AnimatePresence>
          <SwipeCard
            key={currentDish.id}
            dish={currentDish}
            onSwipe={handleSwipe}
            isFront={true}
          />
        </AnimatePresence>
      </div>

      {/* Minimal Controls (Visual only, interactions handled by swipe) */}
    </PageContainer>
  )
}

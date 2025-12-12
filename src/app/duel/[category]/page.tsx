'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Header, DuelCard, ProgressDots } from '@/components'
import { runTournament, DishWithScore, TournamentResult } from '@/lib/tournament'
import { Category, CATEGORIES } from '@/types'

export default function DuelPage() {
  const params = useParams()
  const category = params.category as Category
  const router = useRouter()
  
  // Validate category
  if (!CATEGORIES.find(cat => cat.value === category)) {
    notFound()
  }

  const [dishes, setDishes] = useState<DishWithScore[]>([])
  const [tournamentResult, setTournamentResult] = useState<TournamentResult | null>(null)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDishes()
  }, [category])

  const loadDishes = () => {
    try {
      const stored = localStorage.getItem(`dishes_${category}`)
      
      if (stored) {
        const parsedDishes: DishWithScore[] = JSON.parse(stored)
        const filteredDishes = parsedDishes.filter(dish => dish.score > 0)
        
        if (filteredDishes.length === 0) {
          // No liked dishes, go back to swipe
          router.push(`/swipe/${category}`)
          return
        }

        if (filteredDishes.length === 1) {
          // Only one dish, auto-win
          const result: TournamentResult = {
            rankedDishes: filteredDishes,
            matches: []
          }
          setTournamentResult(result)
        } else {
          // Run tournament
          const result = runTournament(filteredDishes)
          setTournamentResult(result)
        }
        
        setDishes(filteredDishes)
      } else {
        // No stored data, go back to swipe
        router.push(`/swipe/${category}`)
      }
    } catch (error) {
      console.error('Error loading dishes:', error)
      router.push(`/swipe/${category}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChoice = (winner: DishWithScore) => {
    if (!tournamentResult) return

    const nextIndex = currentMatchIndex + 1
    
    if (nextIndex >= tournamentResult.matches.length) {
      // Tournament complete, go to top 3
      localStorage.setItem(`tournament_${category}`, JSON.stringify(tournamentResult))
      router.push(`/top3/${category}`)
    } else {
      setCurrentMatchIndex(nextIndex)
    }
  }

  const getCurrentMatch = () => {
    if (!tournamentResult || currentMatchIndex >= tournamentResult.matches.length) {
      return null
    }
    return tournamentResult.matches[currentMatchIndex]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <Header currentCategory={category} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">⚔️</div>
            <p className="text-xl text-gray-600">Toernooi voorbereiden...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentMatch = getCurrentMatch()

  // Auto-win case (only one dish)
  if (tournamentResult && tournamentResult.rankedDishes.length === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <Header currentCategory={category} />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Automatische Winnaar!
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Er is maar één gerecht gekozen in deze categorie
            </p>
            <div className="text-6xl mb-8">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {tournamentResult.rankedDishes[0].name}
            </h3>
            <button
              onClick={() => {
                localStorage.setItem(`tournament_${category}`, JSON.stringify(tournamentResult))
                router.push(`/top3/${category}`)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Volgende
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <Header currentCategory={category} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-gray-600">Geen duel beschikbaar</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Header currentCategory={category} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Duel {currentMatchIndex + 1} van {tournamentResult?.matches.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentMatchIndex + 1) / (tournamentResult?.matches.length || 1)) * 100)}% voltooid
            </span>
          </div>
          <ProgressDots current={currentMatchIndex} total={tournamentResult?.matches.length || 0} />
        </div>

        {/* Current Match */}
        <div className="relative">
          <DuelCard 
            dish1={currentMatch.dish1}
            dish2={currentMatch.dish2}
            onChoice={handleChoice}
          />
        </div>

        {/* Tournament Stats */}
        <div className="mt-8 bg-white rounded-xl p-4 shadow-md">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Toernooi met {dishes.length} gerechten
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
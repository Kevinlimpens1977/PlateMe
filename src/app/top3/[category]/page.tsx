'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Header, DishCardSmall, PrimaryButton } from '@/components'
import { getTop3, DishWithScore, TournamentResult } from '@/lib/tournament'
import { Category, CATEGORIES, CategoryResult } from '@/types'

export default function Top3Page() {
  const params = useParams()
  const category = params.category as Category
  const router = useRouter()
  
  // Validate category
  if (!CATEGORIES.find(cat => cat.value === category)) {
    notFound()
  }

  const [top3, setTop3] = useState<DishWithScore[]>([])
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTournamentResults()
  }, [category])

  const loadTournamentResults = () => {
    try {
      const stored = localStorage.getItem(`tournament_${category}`)
      
      if (stored) {
        const tournamentResult: TournamentResult = JSON.parse(stored)
        const top3Dishes = getTop3(tournamentResult)
        setTop3(top3Dishes)
      } else {
        // No tournament data, go back to duel
        router.push(`/duel/${category}`)
      }
    } catch (error) {
      console.error('Error loading tournament results:', error)
      router.push(`/duel/${category}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectWinner = (index: number) => {
    setSelectedWinner(index)
  }

  const handleConfirmWinner = () => {
    if (selectedWinner === null || selectedWinner >= top3.length) return

    const winner = top3[selectedWinner]
    
    // Store the winner for this category
    const existingResults = localStorage.getItem('categoryResults')
    const results: CategoryResult[] = existingResults ? JSON.parse(existingResults) : []
    
    // Remove existing result for this category and add new one
    const filteredResults = results.filter(r => r.category !== category)
    filteredResults.push({
      category,
      winner: {
        id: winner.id,
        category: winner.category,
        name: winner.name,
        subtitle: winner.subtitle,
        ingredients: winner.ingredients,
        preparation: winner.preparation,
        image_url: winner.image_url,
        created_at: winner.created_at
      },
      top3: top3.map(dish => ({
        id: dish.id,
        category: dish.category,
        name: dish.name,
        subtitle: dish.subtitle,
        ingredients: dish.ingredients,
        preparation: dish.preparation,
        image_url: dish.image_url,
        created_at: dish.created_at
      }))
    })
    
    localStorage.setItem('categoryResults', JSON.stringify(filteredResults))

    // Check if all categories are complete
    const allCategoriesComplete = ['voor', 'hoofd', 'na'].every(cat =>
      filteredResults.some(r => r.category === cat)
    )

    if (allCategoriesComplete) {
      router.push('/final')
    } else {
      // Go to next category
      const nextCategory = getNextCategory(category)
      if (nextCategory) {
        router.push(`/intro/${nextCategory}`)
      } else {
        router.push('/')
      }
    }
  }

  const getCategoryLabel = (cat: Category) => {
    switch (cat) {
      case 'voor': return 'Voorgerecht'
      case 'hoofd': return 'Hoofdgerecht'
      case 'na': return 'Nagerecht'
      default: return ''
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
        <Header currentCategory={category} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-xl text-gray-600">Top 3 laden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (top3.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
        <Header currentCategory={category} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-gray-600">Geen resultaten gevonden</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <Header currentCategory={category} />
      
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Top 3 {getCategoryLabel(category)}
          </h1>
          <p className="text-xl text-gray-700">
            Kies je favoriet uit de best beoordeelde gerechten
          </p>
        </div>

        {/* Top 3 Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {top3.map((dish, index) => (
            <div key={dish.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg
                  ${index === 0 ? 'bg-yellow-500 text-white' : 
                    index === 1 ? 'bg-gray-400 text-white' : 
                    'bg-orange-600 text-white'}
                `}>
                  {index + 1}
                </div>
              </div>

              <DishCardSmall
                dish={dish}
                rank={index + 1}
                showRank={false}
                isSelected={selectedWinner === index}
                onSelect={() => handleSelectWinner(index)}
              />

              {/* Crown for winner */}
              {index === 0 && (
                <div className="absolute -top-2 right-2 text-3xl">👑</div>
              )}
            </div>
          ))}
        </div>

        {/* Selection Confirmation */}
        {selectedWinner !== null && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Je keuze: {top3[selectedWinner].name}
              </h3>
              <p className="text-gray-600 mb-6">
                Dit is je favoriete {getCategoryLabel(category).toLowerCase()}
              </p>
              <PrimaryButton onClick={handleConfirmWinner}>
                Bevestig keuze
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* Instructions */}
        {selectedWinner === null && (
          <div className="text-center">
            <p className="text-gray-600">
              Klik op een gerecht om het als je favoriet te selecteren
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function getNextCategory(current: Category): Category | null {
  const categories: Category[] = ['voor', 'hoofd', 'na']
  const currentIndex = categories.indexOf(current)
  return currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null
}
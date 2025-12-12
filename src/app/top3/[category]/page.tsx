'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, notFound } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { getTop3, DishWithScore, TournamentResult } from '@/lib/tournament'
import { Category, CATEGORIES, CategoryResult } from '@/types'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Top3Page() {
  const params = useParams()
  const category = params.category as Category
  const router = useRouter()

  if (!CATEGORIES.find(cat => cat.value === category)) {
    notFound()
  }

  const [top3, setTop3] = useState<DishWithScore[]>([])
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`tournament_${category}`)
      if (stored) {
        const tournamentResult: TournamentResult = JSON.parse(stored)
        setTop3(getTop3(tournamentResult))
      } else {
        router.push(`/duel/${category}`)
      }
    } catch {
      router.push(`/duel/${category}`)
    } finally {
      setIsLoading(false)
    }
  }, [category, router])

  const handleConfirmWinner = () => {
    if (selectedWinner === null || selectedWinner >= top3.length) return
    const winner = top3[selectedWinner]

    // Store result logic (simplified for brevity, keeping original logic structure)
    const existingResults = localStorage.getItem('categoryResults')
    const results: CategoryResult[] = existingResults ? JSON.parse(existingResults) : []
    const filteredResults = results.filter(r => r.category !== category)

    // Create minimal Dish object to avoid circular JSON issues or large payloads
    const minimalDish = { ...winner }
    // @ts-ignore
    delete minimalDish.score // clean up extra props if needed

    filteredResults.push({
      category,
      winner: minimalDish,
      top3: top3
    })

    localStorage.setItem('categoryResults', JSON.stringify(filteredResults))

    const allCategoriesComplete = ['voor', 'hoofd', 'na'].every(cat =>
      filteredResults.some(r => r.category === cat)
    )

    if (category === 'na') {
      router.push('/final')
    } else {
      const nextCategory = getNextCategory(category)
      if (nextCategory) {
        router.push(`/intro/${nextCategory}`)
      } else {
        router.push('/final')
      }
    }
  }

  if (isLoading) return null

  return (
    <PageContainer>
      <div className="absolute top-8 w-full text-center z-20">
        <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">Jouw Top 3</h1>
        <p className="text-gray-600 text-sm">Tik op je favoriet</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4 w-full mt-16 px-4">
        {top3.map((dish, index) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedWinner(index)}
            className={cn(
              "relative rounded-[24px] overflow-hidden cursor-pointer border-4 transition-all duration-300 h-32 md:h-40",
              selectedWinner === index ? "border-green-400 scale-105 shadow-2xl z-10" : "border-white/50 bg-white/40 opacity-90 grayscale-[0.3]"
            )}
          >
            <div className="absolute inset-0">
              <Image src={dish.image_url} alt={dish.name} fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
              <div className="text-white">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    index === 0 ? "bg-yellow-400 text-yellow-900" :
                      index === 1 ? "bg-gray-300 text-gray-800" : "bg-orange-400 text-white"
                  )}>{index + 1}</span>
                  <h3 className="text-xl font-bold leading-tight line-clamp-2">{dish.name}</h3>
                </div>
              </div>
            </div>
            {selectedWinner === index && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
                ✓
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="w-full px-6 pb-8 pt-4 z-20">
        <button
          onClick={handleConfirmWinner}
          disabled={selectedWinner === null}
          className="w-full bg-gray-900 text-white font-bold text-lg py-5 rounded-[20px] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {selectedWinner !== null ? 'Bevestig Winnaar' : 'Selecteer een winnaar'}
        </button>
      </div>
    </PageContainer>
  )
}


function getNextCategory(current: Category): Category | null {
  const categories: Category[] = ['voor', 'hoofd', 'na']
  const currentIndex = categories.indexOf(current)
  return currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header, DishCardSmall, PrimaryButton, SecondaryButton } from '@/components'
import { CategoryResult, FinalMenu } from '@/types'

export default function FinalPage() {
  const [finalMenu, setFinalMenu] = useState<FinalMenu | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFinalMenu()
  }, [])

  const loadFinalMenu = () => {
    try {
      const stored = localStorage.getItem('categoryResults')
      
      if (stored) {
        const results: CategoryResult[] = JSON.parse(stored)
        
        // Check if we have all three categories
        const hasVoor = results.some(r => r.category === 'voor')
        const hasHoofd = results.some(r => r.category === 'hoofd')
        const hasNa = results.some(r => r.category === 'na')
        
        if (hasVoor && hasHoofd && hasNa) {
          const voorResult = results.find(r => r.category === 'voor')
          const hoofdResult = results.find(r => r.category === 'hoofd')
          const naResult = results.find(r => r.category === 'na')
          
          if (voorResult && hoofdResult && naResult) {
            setFinalMenu({
              voor: voorResult.winner,
              hoofd: hoofdResult.winner,
              na: naResult.winner
            })
          }
        }
      }
    } catch (error) {
      console.error('Error loading final menu:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    // Clear all stored data
    localStorage.removeItem('categoryResults')
    localStorage.removeItem('dishes_voor')
    localStorage.removeItem('dishes_hoofd')
    localStorage.removeItem('dishes_na')
    localStorage.removeItem('tournament_voor')
    localStorage.removeItem('tournament_hoofd')
    localStorage.removeItem('tournament_na')
    
    // Go back to home
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <p className="text-xl text-gray-600">Menu samenstellen...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!finalMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Geen compleet menu gevonden</p>
            <Link href="/">
              <SecondaryButton>Start opnieuw</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Celebration Header */}
        <div className="text-center mb-16">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Jouw Perfecte Menu!
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Gefeliciteerd! Je hebt je perfecte diner samengesteld door zorgvuldig te kiezen uit de beste gerechten.
          </p>
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Voorgerecht */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 text-center">
              <h2 className="text-2xl font-bold">Voorgerecht</h2>
            </div>
            <div className="p-6">
              <DishCardSmall dish={finalMenu.voor} />
              <h3 className="text-xl font-bold text-gray-900 mt-4 text-center">
                {finalMenu.voor.name}
              </h3>
              {finalMenu.voor.subtitle && (
                <p className="text-gray-600 text-center mt-2">
                  {finalMenu.voor.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Hoofdgerecht */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-4 text-center">
              <h2 className="text-2xl font-bold">Hoofdgerecht</h2>
            </div>
            <div className="p-6">
              <DishCardSmall dish={finalMenu.hoofd} />
              <h3 className="text-xl font-bold text-gray-900 mt-4 text-center">
                {finalMenu.hoofd.name}
              </h3>
              {finalMenu.hoofd.subtitle && (
                <p className="text-gray-600 text-center mt-2">
                  {finalMenu.hoofd.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Nagerecht */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white p-4 text-center">
              <h2 className="text-2xl font-bold">Nagerecht</h2>
            </div>
            <div className="p-6">
              <DishCardSmall dish={finalMenu.na} />
              <h3 className="text-xl font-bold text-gray-900 mt-4 text-center">
                {finalMenu.na.name}
              </h3>
              {finalMenu.na.subtitle && (
                <p className="text-gray-600 text-center mt-2">
                  {finalMenu.na.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Complete Menu Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Jouw Volledige Menu
          </h3>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{finalMenu.voor.name}</h4>
                <p className="text-sm text-gray-600">{finalMenu.voor.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{finalMenu.hoofd.name}</h4>
                <p className="text-sm text-gray-600">{finalMenu.hoofd.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-pink-100 text-pink-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{finalMenu.na.name}</h4>
                <p className="text-sm text-gray-600">{finalMenu.na.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <PrimaryButton onClick={handleRestart} className="text-lg px-8 py-4">
            🔄 Start opnieuw
          </PrimaryButton>
          
          <Link href="/">
            <SecondaryButton className="text-lg px-8 py-4">
              Terug naar home
            </SecondaryButton>
          </Link>
        </div>

        {/* Romantic Touch */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 italic">
            "Eten is de ingrediënt die bindt ons samen en herinneringen creëert die een leven lang meegaan."
          </p>
          <div className="text-4xl mt-4">💕</div>
        </div>
      </main>
    </div>
  )
}
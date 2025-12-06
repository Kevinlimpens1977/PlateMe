import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header, PrimaryButton, SecondaryButton } from '@/components'
import { Category, CATEGORIES } from '@/types'

interface IntroPageProps {
  params: {
    category: Category
  }
}

export default function IntroPage({ params }: IntroPageProps) {
  const { category } = params
  
  // Validate category
  if (!CATEGORIES.find(cat => cat.value === category)) {
    notFound()
  }

  const getCategoryInfo = (cat: Category) => {
    switch (cat) {
      case 'voor':
        return {
          title: 'Voorgerechten',
          description: 'Kies je perfecte voorgerecht om je diner te beginnen',
          emoji: '🥗',
          instructions: [
            'Swipe links als je het gerecht niet lekker lijkt',
            'Swipe rechts als je het gerecht wel lekker lijkt',
            'Swipe omhoog als het je absolute favoriet is',
            'Probeer ongeveer 10 gerechten te beoordelen'
          ]
        }
      case 'hoofd':
        return {
          title: 'Hoofdgerechten',
          description: 'Vind het hoofdgerecht dat je diner compleet maakt',
          emoji: '🍽️',
          instructions: [
            'Wees kritisch maar eerlijk in je keuzes',
            'Let op ingrediënten die je lekker vindt',
            'Favorieten krijgen extra punten in het toernooi',
            'Kies met je hart, niet met je hoofd'
          ]
        }
      case 'na':
        return {
          title: 'Nagerechten',
          description: 'Selecteer het perfecte zoete einde van je diner',
          emoji: '🍰',
          instructions: [
            'Denk aan je favoriete smaken',
            'Kies gerechten die je echt wilt proberen',
            'Favorieten hebben een voorsprong in duels',
            'Maak je diner compleet met de perfecte afsluiter'
          ]
        }
      default:
        return {
          title: '',
          description: '',
          emoji: '',
          instructions: []
        }
    }
  }

  const categoryInfo = getCategoryInfo(category)
  const nextCategory = getNextCategory(category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentCategory={category} />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">{categoryInfo.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {categoryInfo.title}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Hoe te swipen
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {categoryInfo.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Swipe Legend */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Swipe Richtingen
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl">
                ←
              </div>
              <h4 className="font-semibold">Links</h4>
              <p className="text-sm text-gray-600">Niet lekker</p>
              <p className="text-xs text-gray-500">0 punten</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl">
                →
              </div>
              <h4 className="font-semibold">Rechts</h4>
              <p className="text-sm text-gray-600">Wel lekker</p>
              <p className="text-xs text-gray-500">1 punt</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl">
                ↑
              </div>
              <h4 className="font-semibold">Omhoog</h4>
              <p className="text-sm text-gray-600">Favoriet</p>
              <p className="text-xs text-gray-500">2 punten</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/swipe/${category}`}>
            <PrimaryButton className="text-lg px-8 py-4">
              Start Swipen
            </PrimaryButton>
          </Link>
          
          {nextCategory && (
            <Link href={`/intro/${nextCategory}`}>
              <SecondaryButton className="text-lg px-8 py-4">
                Sla over →
              </SecondaryButton>
            </Link>
          )}
          
          <Link href="/">
            <SecondaryButton className="text-lg px-8 py-4">
              Terug naar home
            </SecondaryButton>
          </Link>
        </div>
      </main>
    </div>
  )
}

function getNextCategory(current: Category): Category | null {
  const categories: Category[] = ['voor', 'hoofd', 'na']
  const currentIndex = categories.indexOf(current)
  return currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null
}
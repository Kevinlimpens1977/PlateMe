import Link from 'next/link'
import { Header, PrimaryButton, SecondaryButton } from '@/components'
import { CATEGORIES } from '@/types'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      <Header showAdminLink={true} />
      
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            DinnerSwipe
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Ontdek je perfecte diner door te swipen door heerlijke gerechten
          </p>
          
          <div className="text-6xl mb-8">🍽️✨</div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Hoe werkt het?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-4">👆</div>
              <h3 className="font-semibold text-lg mb-2">Swipe</h3>
              <p className="text-gray-600">
                Swipe links voor niet leuk, rechts voor leuk, en omhoog voor je favoriet
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-4">⚔️</div>
              <h3 className="font-semibold text-lg mb-2">Duel</h3>
              <p className="text-gray-600">
                Kies je favoriet in spannende duels tussen de beste gerechten
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="font-semibold text-lg mb-2">Winnaar</h3>
              <p className="text-gray-600">
                Ontdek je perfecte menu van voorgerecht, hoofdgerecht en nagerecht
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="mb-12">
          <Link href="/intro/voor">
            <PrimaryButton className="text-lg px-8 py-4">
              Start met Voorgerechten
            </PrimaryButton>
          </Link>
        </div>

        {/* Quick Category Access */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Snel naar categorie</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/intro/${category.value}`}
                className="block"
              >
                <SecondaryButton fullWidth className="hover:bg-gray-100">
                  {category.label}
                </SecondaryButton>
              </Link>
            ))}
          </div>
        </div>

        {/* Romantic Touch */}
        <div className="mt-16 text-gray-600">
          <p className="text-sm italic">
            "Een perfect diner begint met de perfecte keuze"
          </p>
        </div>
      </main>
    </div>
  )
}

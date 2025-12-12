import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { Category, CATEGORIES } from '@/types'

interface IntroPageProps {
  params: Promise<{
    category: Category
  }>
}

export default async function IntroPage({ params }: IntroPageProps) {
  const { category } = await params

  if (!CATEGORIES.find(cat => cat.value === category)) {
    notFound()
  }

  const getCategoryInfo = (cat: Category) => {
    switch (cat) {
      case 'voor':
        return {
          title: 'Voorgerechten',
          description: 'Swipe om je favoriete start te vinden',
          emoji: '🥗',
        }
      case 'hoofd':
        return {
          title: 'Hoofdgerechten',
          description: 'Het middelpunt van de avond',
          emoji: '🍽️',
        }
      case 'na':
        return {
          title: 'Nagerechten',
          description: 'Een zoete afsluiting',
          emoji: '🍰',
        }
      default:
        return { title: '', description: '', emoji: '' }
    }
  }

  const info = getCategoryInfo(category)

  return (
    <PageContainer>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <GlassCard className="w-full max-w-sm space-y-8 py-12">
          <div className="text-8xl animate-bounce">{info.emoji}</div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">{info.title}</h1>
            <p className="text-xl text-gray-600">{info.description}</p>
          </div>

          <div className="pt-8">
            <Link href={`/swipe/${category}`}>
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg shadow-rose-300 transform transition active:scale-95 hover:shadow-xl">
                START
              </div>
            </Link>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  )
}

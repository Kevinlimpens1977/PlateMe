'use client'

import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { Category, CATEGORIES } from '@/types'
import { motion } from 'framer-motion'
import { Salad, UtensilsCrossed, CakeSlice } from 'lucide-react'

export default function IntroPage() {
  const params = useParams()
  const category = params.category as Category

  if (!category || !CATEGORIES.find(cat => cat.value === category)) {
    notFound()
  }

  const getCategoryInfo = (cat: Category) => {
    switch (cat) {
      case 'voor':
        return {
          title: 'Voorgerechten',
          description: 'Swipe om je favoriete start te vinden',
          icon: <Salad className="w-24 h-24 text-green-500" />,
          color: 'text-green-500'
        }
      case 'hoofd':
        return {
          title: 'Hoofdgerechten',
          description: 'Het middelpunt van de avond',
          icon: <UtensilsCrossed className="w-24 h-24 text-rose-500" />,
          color: 'text-rose-500'
        }
      case 'na':
        return {
          title: 'Nagerechten',
          description: 'Een zoete afsluiting',
          icon: <CakeSlice className="w-24 h-24 text-pink-500" />,
          color: 'text-pink-500'
        }
      default:
        return { title: '', description: '', icon: null, color: '' }
    }
  }

  const info = getCategoryInfo(category)

  return (
    <PageContainer>
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <GlassCard className="w-full max-w-sm space-y-12 py-16 text-center border-[3px] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]">

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              rotate: { repeat: Infinity, duration: 5, repeatDelay: 1 }
            }}
            className="flex justify-center"
          >
            <div className="bg-white p-6 rounded-full shadow-lg border border-gray-100">
              {info.icon}
            </div>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">{info.title}</h1>
            <p className="text-lg text-gray-500 font-medium px-4">{info.description}</p>
          </div>

          <div className="pt-4">
            <Link href={`/swipe/${category}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D4AF37] text-white text-xl font-bold py-4 px-16 rounded-full shadow-lg shadow-yellow-500/30 transform transition-all border-2 border-white/20"
              >
                START
              </motion.button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  )
}

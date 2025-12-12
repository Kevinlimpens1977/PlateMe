'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { Dish, supabase } from '@/lib/supabase'
import { useWindowSize } from 'react-use'

export default function FinalPage() {
  const [menu, setMenu] = useState<{ voor: Dish | null, hoofd: Dish | null, na: Dish | null }>({ voor: null, hoofd: null, na: null })
  const [userName, setUserName] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load Menu
    const loadMenu = () => {
      const categories = ['voor', 'hoofd', 'na'] as const
      const loadedMenu: any = {}

      categories.forEach(cat => {
        const tournamentData = localStorage.getItem(`tournament_${cat}`)
        if (tournamentData) {
          const parsed = JSON.parse(tournamentData)
          if (parsed.rankedDishes && parsed.rankedDishes.length > 0) {
            loadedMenu[cat] = parsed.rankedDishes[0]
          }
        } else {
          // Fallback for single item (skip tournament) case
          const dishData = localStorage.getItem(`dishes_${cat}`)
          if (dishData) {
            const parsed = JSON.parse(dishData)
            if (parsed && parsed.length > 0) loadedMenu[cat] = parsed[0]
          }
        }
      })
      setMenu(loadedMenu)
    }

    // Load User
    const savedName = localStorage.getItem('dinner_user_name')
    if (savedName) setUserName(savedName)

    loadMenu()
  }, [])

  useEffect(() => {
    // Save to DB once menu is loaded
    const saveSelection = async () => {
      if (isSaved || !userName || !menu.voor || !menu.hoofd) return // Basic check

      try {
        await supabase.from('user_menus').insert({
          user_name: userName,
          starter_id: menu.voor?.id,
          main_id: menu.hoofd?.id,
          dessert_id: menu.na?.id
        })
        setIsSaved(true)
      } catch (e) {
        console.error("Save error", e)
      }
    }

    if (menu.voor && menu.hoofd && userName && !isSaved) {
      saveSelection()
    }
  }, [menu, userName, isSaved])

  return (
    <PageContainer>
      <ChristmasAnimation />

      <div className="w-full h-full flex flex-col items-center overflow-y-auto pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 mb-2 drop-shadow-sm">
            🎄 Kerst Menu! 🎄
          </h1>
          <p className="text-gray-600 font-medium">
            Geweldige keuze, {userName}! 🎅
          </p>
        </motion.div>

        {/* Menu Cards */}
        <div className="w-full space-y-6">
          {menu.voor && <MenuCard dish={menu.voor} type="Voorgerecht" icon="🥗" wine={menu.voor.wine_suggestion || "Een frisse Sauvignon Blanc of lichte Chardonnay past hier heerlijk bij."} delay={0.2} />}
          {menu.hoofd && <MenuCard dish={menu.hoofd} type="Hoofdgerecht" icon="🥩" wine={menu.hoofd.wine_suggestion || "Een volle rode wijn zoals Cabernet Sauvignon of Merlot."} delay={0.4} />}
          {menu.na && <MenuCard dish={menu.na} type="Nagerecht" icon="🍰" wine={menu.na.wine_suggestion || "Een zoete dessertwijn of een goede Port."} delay={0.6} />}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 mb-8 p-6 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 text-center shadow-lg"
        >
          <p className="text-lg font-medium text-gray-800 mb-2">
            🧑‍🍳 Bericht van de Chef
          </p>
          <p className="text-gray-600 italic">
            "Bedankt voor je prachtige kerstselectie! Ik ga de keuken in om dit feestmaal voor te bereiden. Fijne feestdagen!"
          </p>
        </motion.div>

        <Link href="/" className="pb-8">
          <button className="px-8 py-4 bg-red-600 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform border-2 border-white/20">
            Terug naar Start
          </button>
        </Link>
      </div>
    </PageContainer>
  )
}

function ChristmasAnimation() {
  // Generate random snowflakes
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100, // %
    delay: Math.random() * 5, // s
    duration: 5 + Math.random() * 10, // s
    size: 10 + Math.random() * 20, // px
    char: ['❄️', '✨', '🎄', '🎁'][Math.floor(Math.random() * 4)]
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ y: -50, x: 0, opacity: 0 }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: `${flake.left}%`,
            fontSize: flake.size,
          }}
        >
          {flake.char}
        </motion.div>
      ))}
    </div>
  )
}

function MenuCard({ dish, type, icon, wine, delay }: { dish: Dish, type: string, icon: string, wine: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <GlassCard className="flex flex-col gap-4 !p-0 overflow-hidden border-teal-100/50">
        <div className="flex flex-row p-4 gap-4 items-center border-b border-gray-100/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 relative overflow-hidden flex-shrink-0">
            {dish.image_url ? (
              <img src={dish.image_url} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-2xl">{icon}</div>
            )}
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">{type}</span>
            <h3 className="text-xl font-bold text-gray-800 leading-tight">{dish.name}</h3>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="flex items-start gap-3 bg-red-50/50 p-3 rounded-xl border border-red-100/30">
            <span className="text-xl">🍷</span>
            <div>
              <span className="text-xs font-bold text-red-800 uppercase block mb-1">Wijnadvies</span>
              <p className="text-sm text-red-900 leading-relaxed font-medium">
                {wine}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

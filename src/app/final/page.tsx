'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { Dish, supabase } from '@/lib/supabase'
import { Snowfall } from '@/components/Snowfall'
import { Wine } from 'lucide-react'
import Image from 'next/image'

export default function FinalPage() {
  const [menu, setMenu] = useState<{ voor: Dish | null, hoofd: Dish | null, na: Dish | null }>({ voor: null, hoofd: null, na: null })
  const [userName, setUserName] = useState('')
  const [isSaved, setIsSaved] = useState(false)

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
          const dishData = localStorage.getItem(`dishes_${cat}`)
          if (dishData) {
            const parsed = JSON.parse(dishData)
            if (parsed && parsed.length > 0) loadedMenu[cat] = parsed[0]
          }
        }
      })
      setMenu(loadedMenu)
    }

    const savedName = localStorage.getItem('dinner_user_name')
    if (savedName) setUserName(savedName)

    loadMenu()
  }, [])

  useEffect(() => {
    const saveSelection = async () => {
      if (isSaved || !userName || !menu.voor || !menu.hoofd) return

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
      <Snowfall />

      <div className="w-full h-full flex flex-col items-center overflow-y-auto pb-20 relative z-10 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1
            className="text-5xl font-black text-white mb-2 tracking-tight transition-all duration-300 hover:scale-[1.02] cursor-default"
            style={{
              textShadow: '0 0 10px rgba(0,0,0,0.1), 0 0 20px rgba(212,175,55,0.4)',
              WebkitTextStroke: '1px #D4AF37'
            }}
          >
            Kerst Menu
          </h1>
          <p className="text-white/90 font-medium text-lg">
            Geweldige keuze, {userName}!
          </p>
        </motion.div>

        {/* Menu Cards */}
        <div className="w-full max-w-md space-y-8 px-4">
          {menu.voor && <MenuCard dish={menu.voor} type="Voorgerecht" wine={menu.voor.wine_suggestion || "Een frisse Sauvignon Blanc."} delay={0.2} />}
          {menu.hoofd && <MenuCard dish={menu.hoofd} type="Hoofdgerecht" wine={menu.hoofd.wine_suggestion || "Een volle rode wijn."} delay={0.4} />}
          {menu.na && <MenuCard dish={menu.na} type="Nagerecht" wine={menu.na.wine_suggestion || "Een zoete dessertwijn."} delay={0.6} />}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-md mt-12 mb-8 mx-4 p-6 bg-white/90 backdrop-blur-xl rounded-[2rem] border-4 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] text-center"
        >
          <p className="text-lg font-bold text-gray-800 mb-2">
            Bericht van de Chef
          </p>
          <p className="text-gray-600 italic leading-relaxed">
            "Bedankt voor je prachtige kerstselectie! Ik ga de keuken in om dit feestmaal voor te bereiden. Fijne feestdagen!"
          </p>
        </motion.div>

        <Link href="/start" className="pb-8 w-full max-w-xs">
          <button className="w-full py-4 bg-[#D4AF37] hover:bg-[#C5A028] text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all text-lg border-2 border-white/20">
            Terug naar Start
          </button>
        </Link>
      </div>
    </PageContainer>
  )
}

function MenuCard({ dish, type, wine, delay }: { dish: Dish, type: string, wine: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative rounded-[32px] overflow-hidden bg-white shadow-xl group border-4 border-[#D4AF37] hover:scale-[1.02] transition-all"
    >
      <div className="h-48 w-full bg-gray-100 relative">
        {dish.image_url && (
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute top-4 left-4 bg-[#D4AF37] px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-lg uppercase tracking-wider">
          {type}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 bg-white">
        <h3 className="text-xl font-black text-gray-900 leading-tight">{dish.name}</h3>

        <div className="flex items-start gap-3 bg-rose-50 p-3 rounded-xl border border-rose-100">
          <Wine className="w-6 h-6 text-rose-500 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-rose-800 uppercase block mb-0.5">Wijnadvies</span>
            <p className="text-sm text-rose-900 font-medium leading-relaxed">
              {wine}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

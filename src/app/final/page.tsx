'use client'

import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { CategoryResult, FinalMenu } from '@/types'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function FinalPage() {
  const [finalMenu, setFinalMenu] = useState<FinalMenu | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('categoryResults')
      if (stored) {
        const results: CategoryResult[] = JSON.parse(stored)
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
    } catch { }
  }, [])

  const handleRestart = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  if (!finalMenu) return null

  return (
    <PageContainer>
      <div className="absolute top-8 w-full text-center z-20">
        <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">Jouw Menu</h1>
        <p className="text-gray-600 text-sm">Eet smakelijk!</p>
      </div>

      <div className="flex-1 w-full space-y-6 overflow-y-auto no-scrollbar py-20 px-4">
        <MenuItem dish={finalMenu.voor} label="Voorgerecht" delay={0.1} />
        <MenuItem dish={finalMenu.hoofd} label="Hoofdgerecht" delay={0.2} />
        <MenuItem dish={finalMenu.na} label="Nagerecht" delay={0.3} />
      </div>

      <div className="w-full px-6 pb-8 z-20">
        <button
          onClick={handleRestart}
          className="w-full bg-rose-500 text-white font-bold text-lg py-5 rounded-[20px] shadow-lg shadow-rose-300 transition-all active:scale-95"
        >
          Nog een keer proberen
        </button>
      </div>
    </PageContainer>
  )
}

function MenuItem({ dish, label, delay }: { dish: any, label: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative bg-white/60 backdrop-blur-xl p-4 rounded-[32px] shadow-sm flex items-center space-x-4"
    >
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
        <Image src={dish.image_url} alt={dish.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">{label}</span>
        <h3 className="text-lg font-bold text-gray-800 truncate">{dish.name}</h3>
        <p className="text-sm text-gray-500 truncate">{dish.subtitle}</p>
      </div>
    </motion.div>
  )
}

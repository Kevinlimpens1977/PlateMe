"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { useHaptic } from '@/hooks/useHaptic'

export default function HomePage() {
  const { impactLight } = useHaptic()

  return (
    <PageContainer>
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <div className="text-8xl mb-8">🍽️</div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600 tracking-tight">
            DinnerSwipe
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-[280px] mx-auto leading-relaxed">
            Vind je perfecte match voor vanavond
          </p>
        </motion.div>

        {/* Categories / Start */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full px-8"
        >
          <Link href="/intro/voor" onClick={() => impactLight()}>
            <div className="group relative w-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-rose-200/50 hover:scale-[1.02] transition-transform duration-300 active:scale-95 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Begin hier</span>
                  <span className="text-2xl font-bold text-gray-800">Start Etentje</span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Footer/Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="text-sm font-medium text-gray-500 italic"
        >
          "Kies met je hart, niet met je hoofd"
        </motion.p>
      </div>
    </PageContainer>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { useHaptic } from '@/hooks/useHaptic'
import { MapPin, Calendar, Clock, Utensils, ArrowRight } from 'lucide-react'

export default function InvitationPage() {
  const { impactLight } = useHaptic()

  return (
    <PageContainer>
      <Snowfall />

      <div className="flex-1 flex flex-col items-center w-full max-w-lg mx-auto py-8 relative z-10 overflow-y-auto h-full pb-32">

        {/* Video Header with Gold Border */}
        <div className="relative mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-48 h-48 rounded-[2rem] overflow-hidden border-4 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.5)] z-10 bg-black"
          >
            <video
              src="https://igpfvcihykgouwiulxwn.supabase.co/storage/v1/object/public/dish-images/logo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Main Invitation Card with Gold Border */}
        <div className="w-full relative px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 text-center space-y-6 border-4 border-[#D4AF37] shadow-xl relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-black text-rose-500 uppercase tracking-[0.2em]">Exclusief</span>
                <h1 className="text-3xl font-black text-gray-900 leading-tight font-serif">
                  Officiële Uitnodiging
                </h1>
              </div>

              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 mx-auto rounded-full" />

              <div className="space-y-4 text-left bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <InfoRow icon={<MapPin className="w-5 h-5 text-rose-500" />} label="Waar" value="Feurthstraat 84, 6114CX in Susteren" />
                <InfoRow icon={<Calendar className="w-5 h-5 text-rose-500" />} label="Wanneer" value="Zaterdag 20 december vanaf 19.00 uur" />
                <InfoRow icon={<Clock className="w-5 h-5 text-rose-500" />} label="Tot" value="Geen eindtijd" />
              </div>

              <div className="text-gray-700 font-medium leading-relaxed text-sm space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <Utensils className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <p>
                    <span className="text-gray-900 font-bold block mb-1">Diner Instructies</span>
                    Neem veel honger en een lege buik mee. Alvorens deel te kunnen nemen moet je eerst je menu voorkeur doorgeven via deze App.
                  </p>
                </div>
                <p className="text-xs text-gray-500 italic border-l-2 border-rose-200 pl-3">
                  Na invullen door iedereen kan de chef-kok en zijn gastvrouw aan de slag met de voorbereidingen.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue Button - Prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full px-8 mt-10 pb-10"
        >
          <Link href="/start" onClick={() => impactLight()} className="block w-full">
            <button className="w-full bg-[#D4AF37] hover:bg-[#C5A028] text-white rounded-full p-5 shadow-lg shadow-yellow-500/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3">
              <span className="text-lg font-bold text-shadow-sm">Start Dinner Tinder</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </motion.div>

      </div>
    </PageContainer>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 border border-gray-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</span>
        <span className="block text-sm font-bold text-gray-900 leading-tight">{value}</span>
      </div>
    </div>
  )
}

// Snow Component
function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: number; duration: number; delay: number; size: number; opacity: number }[]>([])

  useEffect(() => {
    setSnowflakes(Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 5 + Math.random() * 8, // Slower, more varying speed
      delay: Math.random() * 5,
      size: Math.random() < 0.3 ? 8 : Math.random() < 0.6 ? 4 : 2, // 30% large, 30% medium, 40% small
      opacity: Math.random() * 0.5 + 0.3
    })))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute -top-4 bg-white rounded-full"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            filter: `blur(${flake.size > 5 ? 1 : 0.5}px)`
          }}
          animate={{
            y: ['-10vh', '110vh'],
            x: [0, Math.random() * 40 - 20] // More sway
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

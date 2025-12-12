'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { useHaptic } from '@/hooks/useHaptic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NameEntryPage() {
    const { impactLight } = useHaptic()
    const [userName, setUserName] = useState('')
    const router = useRouter()

    useEffect(() => {
        // Load saved name
        const saved = localStorage.getItem('dinner_user_name')
        if (saved) setUserName(saved)
    }, [])

    const handleStart = () => {
        if (!userName.trim()) return
        localStorage.setItem('dinner_user_name', userName.trim())
        impactLight()
        router.push('/intro/voor')
    }

    return (
        <PageContainer>
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full max-w-sm mx-auto">
                {/* Animated Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-4"
                >
                    <div className="text-8xl mb-8 animate-bounce">🍽️</div>
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600 tracking-tight">
                        DinnerSwipe
                    </h1>
                    <p className="text-xl text-gray-600 font-medium leading-relaxed">
                        Wie ben jij vandaag?
                    </p>
                </motion.div>

                {/* Name Input & Start */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-full space-y-6"
                >
                    <GlassCard className="!p-2 !rounded-[24px] flex items-center border-[3px] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                        <input
                            type="text"
                            placeholder="Je voornaam..."
                            className="w-full bg-transparent border-none outline-none text-center text-xl font-bold text-gray-800 placeholder:text-gray-300 py-3"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </GlassCard>

                    <button
                        onClick={handleStart}
                        disabled={!userName.trim()}
                        className="w-full group relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl shadow-rose-200/50 hover:scale-[1.02] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none border-[3px] border-[#D4AF37]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex flex-col text-left">
                                <span className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Klaar voor de start?</span>
                                <span className="text-2xl font-bold text-gray-800">Start Etentje</span>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </motion.div>

                {/* Results Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link href="/results">
                        <button className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-full text-sm font-bold text-gray-600 shadow-sm hover:bg-white/60 transition-colors border-2 border-[#D4AF37]">
                            📋 Bekijk Inzendingen
                        </button>
                    </Link>
                </motion.div>

                {/* Footer/Quote */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1 }}
                    className="text-sm font-medium text-gray-500 italic mt-8"
                >
                    "Kies met je hart, eet met plezier"
                </motion.p>

                {/* Admin Link */}
                <div className="absolute top-4 right-4">
                    <Link href="/admin" className="flex items-center gap-2 px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-full text-xs font-bold text-rose-700 hover:bg-white/60 transition-all shadow-sm">
                        🔑 Admin
                    </Link>
                </div>
            </div>
        </PageContainer>
    )
}

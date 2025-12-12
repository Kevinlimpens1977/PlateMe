"use client"

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion"
import { Dish } from "@/lib/supabase"
import { useHaptic } from "@/hooks/useHaptic"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useEffect } from "react"

interface SwipeCardProps {
    dish: Dish
    onSwipe: (direction: 'left' | 'right' | 'up') => void
    isFront: boolean
}

export function SwipeCard({ dish, onSwipe, isFront }: SwipeCardProps) {
    const { impactLight, success, error } = useHaptic()
    const controls = useAnimation()
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Tinder-style transforms
    const rotate = useTransform(x, [-200, 200], [-8, 8])
    const scale = useTransform(x, [-150, 0, 150], [1.05, 1, 1.05])

    // Continuous opacity for full-card overlays
    // Max opacity 0.4 at drag distance of 150
    const likeOpacity = useTransform(x, [0, 150], [0, 0.4])
    const nopeOpacity = useTransform(x, [0, -150], [0, 0.4])

    useEffect(() => {
        const unsubX = x.on("change", (currentX) => {
            if (Math.abs(currentX) > 50) impactLight()
        })
        return () => unsubX()
    }, [x, impactLight])

    const handleDragEnd = async (event: any, info: PanInfo) => {
        const offset = info.offset
        const velocity = info.velocity

        if (offset.y < -100) {
            // Super like (Swipe Up)
            success()
            await controls.start({ y: -1000, transition: { duration: 0.4 } })
            onSwipe('up')
        } else if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
            const direction = offset.x > 0 ? 'right' : 'left'
            if (direction === 'right') success()
            else error()

            await controls.start({
                x: direction === 'right' ? 1000 : -1000,
                rotate: direction === 'right' ? 20 : -20,
                transition: { duration: 0.4 }
            })
            onSwipe(direction)
        } else {
            controls.start({ x: 0, y: 0, rotate: 0 })
        }
    }

    const handleButtonClick = async (direction: 'left' | 'right') => {
        if (!isFront) return;

        if (direction === 'right') success()
        else error()

        await controls.start({
            x: direction === 'right' ? 1000 : -1000,
            rotate: direction === 'right' ? 20 : -20,
            transition: { duration: 0.4 }
        })
        onSwipe(direction)
    }

    return (
        <motion.div
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x, y, rotate, scale, zIndex: isFront ? 10 : 0 }}
            className={cn(
                "absolute top-4 left-0 w-full h-[calc(100%-32px)] rounded-[36px] overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.5)] cursor-grab active:cursor-grabbing bg-rose-900 border-4 border-[#D4AF37]",
                !isFront && "scale-95 top-8 opacity-50 pointer-events-none"
            )}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col relative">

                {/* LIKE OVERLAY (Green) */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute inset-0 z-50 bg-green-500 pointer-events-none flex items-center justify-center"
                >
                    <div className="rounded-full border-4 border-white p-6 transform scale-125">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                </motion.div>

                {/* NOPE OVERLAY (Red) */}
                <motion.div
                    style={{ opacity: nopeOpacity }}
                    className="absolute inset-0 z-50 bg-red-500 pointer-events-none flex items-center justify-center"
                >
                    <div className="rounded-full border-4 border-white p-6 transform scale-125">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </motion.div>

                {/* Top Section: Image (Contain) */}
                <div className="relative w-full h-[55%] bg-gray-50 flex items-center justify-center p-4">
                    {dish.image_url ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={dish.image_url}
                                alt={dish.name}
                                fill
                                className="object-contain pointer-events-none drop-shadow-md"
                                priority={isFront}
                                sizes="(max-width: 768px) 100vw, 500px"
                            />
                        </div>
                    ) : (
                        <div className="text-6xl">🍽️</div>
                    )}
                </div>

                {/* Middle Section: Text Content */}
                <div className="flex-1 px-6 py-4 flex flex-col">
                    <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2 text-center">{dish.name}</h2>
                    <p className="text-gray-500 font-medium text-sm mb-4 line-clamp-2 text-center">{dish.subtitle || 'Heerlijk gerecht'}</p>

                    <div className="flex flex-wrap justify-center gap-2 mt-auto mb-4">
                        {dish.ingredients && dish.ingredients.split(',').slice(0, 3).map((ing, i) => (
                            <span key={i} className="bg-rose-50 text-rose-800 px-3 py-1 rounded-full text-xs font-semibold">
                                {ing.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom Section: Integrated Actions */}
                <div className="h-20 bg-gray-50 border-t border-gray-100 flex items-center justify-around px-10 pb-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleButtonClick('left') }}
                        className="w-14 h-14 rounded-full bg-white border-2 border-red-200 text-red-500 shadow-sm flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleButtonClick('right') }}
                        className="w-14 h-14 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-200 flex items-center justify-center hover:bg-rose-600 hover:scale-110 transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

            </div>
        </motion.div>
    )
}

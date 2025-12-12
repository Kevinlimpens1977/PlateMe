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

    const rotate = useTransform(x, [-200, 200], [-25, 25])
    const opacityNope = useTransform(x, [-150, -20], [1, 0])
    const opacityLike = useTransform(x, [20, 150], [0, 1])
    const opacitySuper = useTransform(y, [-150, -50], [1, 0])

    const colorNope = useTransform(x, [-150, -20], ["#ef4444", "rgba(239, 68, 68, 0)"])
    const colorLike = useTransform(x, [20, 150], ["rgba(34, 197, 94, 0)", "#22c55e"])

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

    return (
        <motion.div
            drag={isFront ? true : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x, y, rotate, zIndex: isFront ? 10 : 0 }}
            className={cn(
                "absolute top-0 left-0 w-full h-full rounded-[32px] overflow-hidden bg-white shadow-2xl cursor-grab active:cursor-grabbing",
                !isFront && "scale-95 top-4 opacity-50 pointer-events-none"
            )}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            {/* Absolute Image with Overlay */}
            <div className="relative w-full h-full">
                {dish.image_url ? (
                    <Image
                        src={dish.image_url}
                        alt={dish.name}
                        fill
                        className="object-cover pointer-events-none"
                        priority={isFront}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 pointer-events-none" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 text-white pointer-events-none">
                    <h2 className="text-4xl font-bold mb-2 drop-shadow-md">{dish.name}</h2>
                    <p className="text-lg opacity-90 font-medium mb-4 drop-shadow-sm">{dish.subtitle}</p>

                    <div className="flex flex-wrap gap-2 text-sm opacity-80">
                        {dish.ingredients && dish.ingredients.split(',').slice(0, 3).map((ing, i) => (
                            <span key={i} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                {ing.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Swipe Feedback Overlays */}
                {isFront && (
                    <>
                        <motion.div
                            style={{ opacity: opacityLike }}
                            className="absolute top-10 left-10 border-4 border-green-400 rounded-lg px-4 py-2 transform -rotate-12"
                        >
                            <span className="text-4xl font-bold text-green-400 uppercase tracking-widest">LIKE</span>
                        </motion.div>

                        <motion.div
                            style={{ opacity: opacityNope }}
                            className="absolute top-10 right-10 border-4 border-red-500 rounded-lg px-4 py-2 transform rotate-12"
                        >
                            <span className="text-4xl font-bold text-red-500 uppercase tracking-widest">NOPE</span>
                        </motion.div>

                        <motion.div
                            style={{ opacity: opacitySuper }}
                            className="absolute bottom-32 w-full text-center"
                        >
                            <span className="text-4xl font-bold text-blue-400 uppercase tracking-widest drop-shadow-lg">SUPER LIKE</span>
                        </motion.div>
                    </>
                )}
            </div>
        </motion.div>
    )
}

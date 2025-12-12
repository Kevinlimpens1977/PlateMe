"use client"

import { useCallback } from 'react'

export function useHaptic() {
    const vibrate = useCallback((pattern: number | number[] = 10) => {
        if (typeof window !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(pattern)
        }
    }, [])

    const impactLight = useCallback(() => vibrate(10), [vibrate])
    const impactMedium = useCallback(() => vibrate(20), [vibrate])
    const impactHeavy = useCallback(() => vibrate(40), [vibrate])
    const success = useCallback(() => vibrate([10, 30, 10]), [vibrate])
    const error = useCallback(() => vibrate([50, 30, 50]), [vibrate])

    return {
        vibrate,
        impactLight,
        impactMedium,
        impactHeavy,
        success,
        error
    }
}

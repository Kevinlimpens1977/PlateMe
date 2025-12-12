'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header, PrimaryButton } from '@/components'
import { PageContainer } from '@/components/ui/PageContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatePresence, motion } from 'framer-motion'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      setError('Vul het wachtwoord in')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (password === '1') {
        localStorage.setItem('admin_authenticated', 'true')
        router.push('/admin')
      } else {
        setError('Ongeldig wachtwoord')
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      {/* Animated Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex-1 flex flex-col justify-center"
      >
        <div className="mb-8 text-center space-y-4">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Admin Toegang
          </h1>
          <p className="text-gray-500 font-medium">
            Alleen voor hongerige beheerders
          </p>
        </div>

        <GlassCard className="w-full">
          <form onSubmit={handleLogin} className="space-y-6">

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium border border-red-100 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-center text-lg placeholder:text-gray-400"
                placeholder="Wachtwoord"
                autoFocus
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Laden...' : 'Inloggen'}
              </button>
            </div>
          </form>
        </GlassCard>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors">
            ← Terug naar start
          </Link>
        </div>

      </motion.div>
    </PageContainer>
  )
}

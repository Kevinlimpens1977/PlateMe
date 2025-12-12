'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Notification } from '@/components/ui/Notification'
import { supabase, Dish } from '@/lib/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadDishes()
  }, [])

  const checkAuth = () => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')

    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    setUser({ email: 'Chef' }) // Simplified for visual flow
  }

  const loadDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading dishes:', error)
      } else {
        setDishes(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    router.push('/')
  }

  const getCategoryStats = () => {
    const stats = {
      voor: dishes.filter(d => d.category === 'voor').length,
      hoofd: dishes.filter(d => d.category === 'hoofd').length,
      na: dishes.filter(d => d.category === 'na').length,
    }
    return stats
  }

  const stats = getCategoryStats()

  const handleDelete = async (dish: Dish, confirmed = false) => {
    if (!confirmed) {
      setDeleteConfirmId(dish.id)
      return
    }

    try {
      const { data, error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', dish.id)
        .select()

      if (error) {
        console.error('Error deleting dish:', error)
        setNotification({ type: 'error', message: 'Fout bij verwijderen: ' + error.message })
      } else if (data && data.length === 0) {
        console.warn('Delete operation returned 0 rows. RLS might be blocking it.')
        setNotification({ type: 'error', message: 'Kon gerecht niet verwijderen (Mogelijk RLS policy)' })
      } else {
        setDeleteConfirmId(null)
        setDishes(current => current.filter(d => d.id !== dish.id))
        setNotification({ type: 'success', message: 'Gerecht succesvol verwijderd' })
      }
    } catch (error) {
      console.error('Error:', error)
      setNotification({ type: 'error', message: 'Fout bij verwijderen' })
    }
  }

  // Background blobs component for reusability if needed, but inlined here suitable
  const BackgroundBlobs = () => (
    <>
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[80px] pointer-events-none" />
    </>
  )

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
        <BackgroundBlobs />
        <div className="text-center relative z-10 animate-pulse">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl font-medium text-gray-500">Keuken opwarmen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-x-hidden font-sans">
      <BackgroundBlobs />

      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-gray-500 font-medium">
              Welkom terug, <span className="text-rose-500">{user?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors bg-white/50 rounded-full">
                ← App Bekijken
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
            >
              Uitloggen
            </button>
            <Link href="/admin/dishes/new">
              <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-bold shadow-lg shadow-rose-200 hover:scale-105 transition-transform active:scale-95 flex items-center gap-2">
                <span>+</span> Nieuw Gerecht
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <GlassCard className="flex items-center gap-4 p-4 !rounded-[24px]">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">🍽️</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Totaal</p>
              <p className="text-2xl font-black text-gray-800">{dishes.length}</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 p-4 !rounded-[24px]">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-2xl">🥗</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Voor</p>
              <p className="text-2xl font-black text-gray-800">{stats.voor}</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 p-4 !rounded-[24px]">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-2xl">🥩</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hoofd</p>
              <p className="text-2xl font-black text-gray-800">{stats.hoofd}</p>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 p-4 !rounded-[24px]">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-2xl">🍰</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Na</p>
              <p className="text-2xl font-black text-gray-800">{stats.na}</p>
            </div>
          </GlassCard>
        </div>

        {/* Recent Dishes List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 pl-2">Recente Gerechten</h2>

          {dishes.length === 0 ? (
            <div className="text-center py-20 bg-white/40 rounded-[32px] border border-dashed border-gray-300">
              <div className="text-4xl mb-4 opacity-50">📝</div>
              <p className="text-gray-500">Nog geen gerechten. Tijd om te koken!</p>
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-xl shadow-gray-200/50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Gerecht</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Categorie</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Datum</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dishes.slice(0, 50).map((dish) => (
                    <motion.tr
                      key={dish.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {dish.image_url ? (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                              <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg shadow-sm flex-shrink-0">🍽️</div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800">{dish.name}</p>
                            <p className="text-xs text-gray-400 font-medium md:hidden bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                              {dish.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                                   ${dish.category === 'voor' ? 'bg-orange-100 text-orange-700' :
                            dish.category === 'hoofd' ? 'bg-green-100 text-green-700' :
                              'bg-pink-100 text-pink-700'}
                                `}>
                          {dish.category.charAt(0).toUpperCase() + dish.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium hidden sm:table-cell">
                        {new Date(dish.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/dishes/${dish.id}`}>
                            <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
                              ✎
                            </button>
                          </Link>

                          {deleteConfirmId === dish.id ? (
                            <div className="flex items-center gap-2 bg-red-50 p-1 rounded-full animate-in fade-in zoom-in duration-200">
                              <span className="text-[10px] text-red-500 font-bold pl-2">Zeker?</span>
                              <button onClick={() => handleDelete(dish, true)} className="px-2 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600">Ja</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-300">Nee</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDelete(dish)}
                              className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

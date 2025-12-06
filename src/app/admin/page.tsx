'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header, PrimaryButton, SecondaryButton } from '@/components'
import { supabase, Dish } from '@/lib/supabase'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadDishes()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/admin/login')
      return
    }
    
    setUser(session.user)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Admin Dashboard" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-xl text-gray-600">Dashboard laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            {user && (
              <p className="text-gray-600">
                Welkom, {user.email}
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <Link href="/admin/dishes/new">
              <PrimaryButton>
                + Nieuw Gerecht
              </PrimaryButton>
            </Link>
            <SecondaryButton onClick={handleLogout}>
              Uitloggen
            </SecondaryButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <div className="text-blue-600 text-2xl">🍽️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal</p>
                <p className="text-2xl font-bold text-gray-900">{dishes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <div className="text-orange-600 text-2xl">🥗</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Voorgerechten</p>
                <p className="text-2xl font-bold text-gray-900">{stats.voor}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="text-green-600 text-2xl">🍽️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoofdgerechten</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hoofd}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-pink-100 p-3 rounded-lg">
                <div className="text-pink-600 text-2xl">🍰</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nagerechten</p>
                <p className="text-2xl font-bold text-gray-900">{stats.na}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Dishes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Recente Gerechten
            </h2>
          </div>
          
          {dishes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <p className="text-gray-600 mb-4">
                Nog geen gerechten toegevoegd
              </p>
              <Link href="/admin/dishes/new">
                <PrimaryButton>
                  + Voeg eerste gerecht toe
                </PrimaryButton>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gerecht
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toegevoegd
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acties
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dishes.slice(0, 10).map((dish) => (
                    <tr key={dish.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {dish.image_url && (
                            <img
                              src={dish.image_url}
                              alt={dish.name}
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {dish.name}
                            </div>
                            {dish.subtitle && (
                              <div className="text-sm text-gray-500">
                                {dish.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`
                          px-2 py-1 text-xs rounded-full
                          ${dish.category === 'voor' ? 'bg-orange-100 text-orange-800' :
                            dish.category === 'hoofd' ? 'bg-green-100 text-green-800' :
                            'bg-pink-100 text-pink-800'}
                        `}>
                          {dish.category === 'voor' ? 'Voorgerecht' :
                           dish.category === 'hoofd' ? 'Hoofdgerecht' : 'Nagerecht'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(dish.created_at).toLocaleDateString('nl-NL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/dishes/${dish.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Bewerken
                        </Link>
                        <button
                          onClick={() => handleDelete(dish)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Verwijderen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {dishes.length > 10 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <Link href="/admin/dishes" className="text-blue-600 hover:text-blue-900">
                Bekijk alle {dishes.length} gerechten →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )

  async function handleDelete(dish: Dish) {
    if (!confirm(`Weet je zeker dat je "${dish.name}" wilt verwijderen?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', dish.id)

      if (error) {
        console.error('Error deleting dish:', error)
        alert('Fout bij verwijderen')
      } else {
        await loadDishes()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fout bij verwijderen')
    }
  }
}
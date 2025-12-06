'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header, PrimaryButton, SecondaryButton } from '@/components'
import { supabase, Dish } from '@/lib/supabase'

export default function DishesPage() {
  const [user, setUser] = useState<any>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    loadDishes()
  }, [])

  useEffect(() => {
    filterDishes()
  }, [filter, categoryFilter])

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

  const filterDishes = () => {
    // This would be implemented with actual filtering logic
    // For now, just return all dishes
  }

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(filter.toLowerCase()) ||
                         dish.subtitle?.toLowerCase().includes(filter.toLowerCase()) ||
                         dish.ingredients.toLowerCase().includes(filter.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || dish.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (dish: Dish) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Gerechten Beheren" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-xl text-gray-600">Gerechten laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Gerechten Beheren" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Alle Gerechten ({filteredDishes.length})
            </h1>
            {user && (
              <p className="text-gray-600">
                Beheer door {user.email}
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <Link href="/admin">
              <SecondaryButton>
                ← Dashboard
              </SecondaryButton>
            </Link>
            <Link href="/admin/dishes/new">
              <PrimaryButton>
                + Nieuw Gerecht
              </PrimaryButton>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Zoeken
              </label>
              <input
                id="search"
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Zoek op naam, ingrediënten..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categorie
              </label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Alle categorieën</option>
                <option value="voor">Voorgerechten</option>
                <option value="hoofd">Hoofdgerechten</option>
                <option value="na">Nagerechten</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dishes Table */}
        <div className="bg-white rounded-lg shadow">
          {filteredDishes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-600 mb-4">
                {filter || categoryFilter !== 'all' 
                  ? 'Geen gerechten gevonden met deze filters' 
                  : 'Nog geen gerechten toegevoegd'}
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
                      Ingrediënten
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
                  {filteredDishes.map((dish) => (
                    <tr key={dish.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {dish.image_url && (
                            <img
                              src={dish.image_url}
                              alt={dish.name}
                              className="h-12 w-12 rounded-lg object-cover mr-3"
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
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {dish.ingredients}
                        </div>
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
        </div>
      </main>
    </div>
  )
}
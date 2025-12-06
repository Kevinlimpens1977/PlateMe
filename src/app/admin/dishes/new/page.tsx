'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header, PrimaryButton, SecondaryButton, DishCardLarge } from '@/components'
import { supabase, Dish, DishInsert } from '@/lib/supabase'

export default function NewDishPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<DishInsert>({
    name: '',
    subtitle: '',
    category: 'voor',
    ingredients: '',
    preparation: '',
    image_url: ''
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/admin/login')
      return
    }
    
    setUser(session.user)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      setUploading(true)
      
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('dish-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.ingredients || !formData.preparation) {
      alert('Vul alle verplichte velden in')
      return
    }

    setLoading(true)

    try {
      let imageUrl = formData.image_url
      
      // Upload image if provided
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) {
          alert('Fout bij uploaden van afbeelding')
          return
        }
        imageUrl = uploadedUrl
      }

      // Insert dish
      const { error } = await supabase
        .from('dishes')
        .insert({
          ...formData,
          image_url: imageUrl
        })

      if (error) {
        console.error('Error creating dish:', error)
        alert('Fout bij opslaan van gerecht')
      } else {
        router.push('/admin/dishes')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fout bij opslaan van gerecht')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Nieuw Gerecht" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-xl text-gray-600">Controleren...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Nieuw Gerecht" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Gerecht Informatie
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Naam *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Naam van het gerecht"
                  required
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitel
                </label>
                <input
                  id="subtitle"
                  name="subtitle"
                  type="text"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Korte beschrijving"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categorie *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="voor">Voorgerecht</option>
                  <option value="hoofd">Hoofdgerecht</option>
                  <option value="na">Nagerecht</option>
                </select>
              </div>

              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                  Ingrediënten *
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Lijst van ingrediënten"
                  required
                />
              </div>

              <div>
                <label htmlFor="preparation" className="block text-sm font-medium text-gray-700 mb-2">
                  Bereiding *
                </label>
                <textarea
                  id="preparation"
                  name="preparation"
                  value={formData.preparation}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hoe bereid je het gerecht?"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Afbeelding
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-2">
                    Afbeelding uploaden...
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <PrimaryButton
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1"
                >
                  {loading ? 'Opslaan...' : 'Gerecht Opslaan'}
                </PrimaryButton>
                
                <Link href="/admin/dishes">
                  <SecondaryButton className="flex-1">
                    Annuleren
                  </SecondaryButton>
                </Link>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Live Preview
            </h2>
            
            <DishCardLarge 
              dish={{
                id: 'preview',
                name: formData.name || 'Naam van gerecht',
                subtitle: formData.subtitle || 'Subtitel',
                category: formData.category,
                ingredients: formData.ingredients || 'Ingrediënten...',
                preparation: formData.preparation || 'Bereiding...',
                image_url: imagePreview || formData.image_url,
                created_at: new Date().toISOString()
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
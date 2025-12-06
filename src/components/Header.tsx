import Link from 'next/link'
import { Category } from '@/types'

interface HeaderProps {
  title?: string
  showAdminLink?: boolean
  currentCategory?: Category
}

export default function Header({ title = 'DinnerSwipe', showAdminLink = false, currentCategory }: HeaderProps) {
  const getCategoryLabel = (category: Category) => {
    switch (category) {
      case 'voor': return 'Voorgerecht'
      case 'hoofd': return 'Hoofdgerecht'
      case 'na': return 'Nagerecht'
      default: return ''
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {title}
            </Link>
            {currentCategory && (
              <span className="ml-4 text-sm text-gray-600">
                {getCategoryLabel(currentCategory)}
              </span>
            )}
          </div>
          
          {showAdminLink && (
            <nav className="flex space-x-4">
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
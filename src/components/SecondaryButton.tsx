import { ButtonHTMLAttributes, ReactNode } from 'react'

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  href?: string
  fullWidth?: boolean
}

export default function SecondaryButton({ 
  children, 
  href, 
  fullWidth = false, 
  className = '', 
  ...props 
}: SecondaryButtonProps) {
  const baseClasses = `
    bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg
    border border-gray-300 transition-colors duration-200 focus:outline-none 
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  if (href) {
    return (
      <a 
        href={href}
        className={baseClasses}
      >
        {children}
      </a>
    )
  }

  return (
    <button 
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  )
}
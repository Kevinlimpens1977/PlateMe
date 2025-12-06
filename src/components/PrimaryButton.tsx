import { ButtonHTMLAttributes, ReactNode } from 'react'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  href?: string
  fullWidth?: boolean
}

export default function PrimaryButton({ 
  children, 
  href, 
  fullWidth = false, 
  className = '', 
  ...props 
}: PrimaryButtonProps) {
  const baseClasses = `
    bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg
    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
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
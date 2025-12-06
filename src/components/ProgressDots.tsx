interface ProgressDotsProps {
  current: number
  total: number
  className?: string
}

export default function ProgressDots({ current, total, className = '' }: ProgressDotsProps) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${index === current 
              ? 'bg-blue-600 w-8' 
              : index < current 
                ? 'bg-blue-400' 
                : 'bg-gray-300'
            }
          `}
        />
      ))}
    </div>
  )
}
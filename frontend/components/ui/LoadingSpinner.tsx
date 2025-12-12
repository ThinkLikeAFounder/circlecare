import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ className, size = 'md', ...props }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        {
          'h-4 w-4': size === 'sm',
          'h-8 w-8': size === 'md',
          'h-12 w-12': size === 'lg',
        },
        className
      )}
      {...props}
    />
  )
}
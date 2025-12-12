import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6',
          hover && 'transition-all duration-300 hover:border-primary-400/30 hover:bg-white/10 hover:-translate-y-1',
          glow && 'hover:shadow-xl hover:shadow-primary-500/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

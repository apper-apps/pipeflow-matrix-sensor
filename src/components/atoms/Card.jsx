import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Card = forwardRef(({ 
  className, 
  children,
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-200',
        hover && 'hover:shadow-md hover:border-gray-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
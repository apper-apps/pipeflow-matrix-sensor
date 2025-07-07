import { NavLink as RouterNavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const NavLink = ({ 
  to, 
  icon, 
  children, 
  className,
  ...props 
}) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => cn(
        'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
        isActive 
          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        className
      )}
      {...props}
    >
      {({ isActive }) => (
        <>
          {icon && (
            <ApperIcon 
              name={icon} 
              size={18} 
              className={cn(
                'transition-colors duration-200',
                isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
              )}
            />
          )}
          <span>{children}</span>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute right-0 w-1 h-6 bg-white rounded-full"
            />
          )}
        </>
      )}
    </RouterNavLink>
  );
};

export default NavLink;
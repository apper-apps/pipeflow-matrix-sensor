import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch,
  className,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
  };
  
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={16} className="text-gray-400" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="pl-10 pr-10"
        {...props}
      />
      
      {searchTerm && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      )}
    </div>
  );
};

export default SearchBar;
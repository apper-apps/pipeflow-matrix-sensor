import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

const Header = ({ title, subtitle, onMenuToggle, actions, showSearch = false, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch?.(value);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
          </button>
          
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        
        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block">
              <SearchBar
                placeholder="Search..."
                onSearch={handleSearch}
                className="w-80"
              />
            </div>
          )}
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
          
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          >
            <ApperIcon name="Bell" size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile search */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            placeholder="Search..."
            onSearch={handleSearch}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
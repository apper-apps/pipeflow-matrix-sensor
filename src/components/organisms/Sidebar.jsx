import { motion } from "framer-motion";
import React, { useContext } from "react";
import { AuthContext } from "@/App";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import NavLink from "@/components/molecules/NavLink";
import companies from "@/services/mockData/companies.json";
import deals from "@/services/mockData/deals.json";
import users from "@/services/mockData/users.json";
import contacts from "@/services/mockData/contacts.json";
import activities from "@/services/mockData/activities.json";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <button
      onClick={logout}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
      title="Logout"
    >
      <ApperIcon name="LogOut" size={16} className="text-gray-500 group-hover:text-red-500" />
    </button>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'BarChart3' },
    { name: 'Deals', path: '/deals', icon: 'Target' },
    { name: 'Contacts', path: '/contacts', icon: 'Users' },
    { name: 'Companies', path: '/companies', icon: 'Building' },
    { name: 'Activities', path: '/activities', icon: 'Activity' },
  ];
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PipeFlow</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                icon={item.icon}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
{/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Smith</p>
                  <p className="text-xs text-gray-500">Sales Manager</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Overlay */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 z-50 lg:hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PipeFlow</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  icon={item.icon}
                  onClick={onClose}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Smith</p>
<p className="text-xs text-gray-500">Sales Manager</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      </>
  );
};

export default Sidebar;
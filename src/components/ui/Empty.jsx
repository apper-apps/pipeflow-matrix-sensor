import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  message = 'No data found', 
  description = 'Get started by creating your first item',
  onAction,
  actionLabel = 'Create New',
  icon = 'Inbox',
  type = 'default'
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'deals':
        return {
          message: 'No deals in your pipeline',
          description: 'Start building your sales pipeline by creating your first deal',
          actionLabel: 'Create Deal',
          icon: 'Target'
        };
      case 'contacts':
        return {
          message: 'No contacts found',
          description: 'Add contacts to start building your customer relationships',
          actionLabel: 'Add Contact',
          icon: 'Users'
        };
      case 'companies':
        return {
          message: 'No companies added',
          description: 'Add companies to organize your business relationships',
          actionLabel: 'Add Company',
          icon: 'Building'
        };
      case 'activities':
        return {
          message: 'No activities logged',
          description: 'Keep track of your interactions with customers and prospects',
          actionLabel: 'Log Activity',
          icon: 'Activity'
        };
      default:
        return { message, description, actionLabel, icon };
    }
  };
  
  const content = getEmptyContent();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute -inset-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-2xl opacity-50"></div>
        <div className="relative bg-white rounded-full p-6 shadow-lg border border-blue-100">
          <ApperIcon 
            name={content.icon} 
            size={64} 
            className="text-blue-500"
          />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {content.message}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm">
        {content.description}
      </p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-xl transition-all duration-200 flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" size={20} />
          <span>{content.actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;
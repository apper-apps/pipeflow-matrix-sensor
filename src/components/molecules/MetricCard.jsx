import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import { cn } from '@/utils/cn';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'up',
  className,
  gradient = false 
}) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      default: return 'text-gray-500';
    }
  };
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'p-6 hover:shadow-lg transition-all duration-200',
        gradient && 'bg-gradient-to-br from-white to-gray-50',
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {icon && (
            <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
              <ApperIcon name={icon} size={20} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {formatValue(value)}
            </p>
            {change && (
              <div className={cn('flex items-center text-sm', getTrendColor())}>
                <ApperIcon name={getTrendIcon()} size={14} className="mr-1" />
                <span>{change}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
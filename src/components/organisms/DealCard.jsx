import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const DealCard = ({ 
  deal, 
  contacts, 
  companies, 
  onClick,
  isDragging = false,
  ...props 
}) => {
  const contact = contacts?.find(c => c.Id === deal.contactId);
  const company = companies?.find(c => c.Id === deal.companyId);
  
const formatCurrency = (amount) => {
    // Handle null, undefined, or invalid numeric values
    if (amount == null || isNaN(Number(amount))) {
      return '$0';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };
  
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Lead In': return 'default';
      case 'Contact Made': return 'info';
      case 'Proposal Sent': return 'warning';
      case 'Negotiation': return 'primary';
      case 'Won': return 'success';
      case 'Lost': return 'error';
      default: return 'default';
    }
  };
  
  const isOverdue = new Date(deal.expectedCloseDate) < new Date() && deal.stage !== 'Won' && deal.stage !== 'Lost';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <Card
        className={cn(
          'p-4 cursor-pointer hover:shadow-md transition-all duration-200 border-l-4',
          isDragging && 'rotate-2 shadow-lg',
          deal.stage === 'Won' && 'border-l-success bg-green-50',
          deal.stage === 'Lost' && 'border-l-error bg-red-50',
          !['Won', 'Lost'].includes(deal.stage) && 'border-l-primary bg-gradient-to-r from-white to-blue-50'
        )}
        onClick={onClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {deal.title}
            </h3>
            <Badge variant={getStageColor(deal.stage)} className="text-xs">
              {deal.stage}
            </Badge>
          </div>
          
          {/* Value */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(deal.value)}
            </span>
            {isOverdue && (
              <div className="flex items-center text-error text-xs">
                <ApperIcon name="AlertCircle" size={14} className="mr-1" />
                <span>Overdue</span>
              </div>
            )}
          </div>
          
          {/* Contact & Company */}
          <div className="space-y-2">
            {contact && (
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="User" size={14} className="mr-2" />
                <span>{contact.name}</span>
              </div>
            )}
            {company && (
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Building" size={14} className="mr-2" />
                <span>{company.name}</span>
              </div>
            )}
          </div>
          
          {/* Close Date */}
          <div className="flex items-center text-sm text-gray-500">
            <ApperIcon name="Calendar" size={14} className="mr-2" />
            <span>Close: {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}</span>
          </div>
          
          {/* Notes Preview */}
          {deal.notes && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border-l-2 border-gray-200">
              {deal.notes.length > 80 ? `${deal.notes.substring(0, 80)}...` : deal.notes}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;
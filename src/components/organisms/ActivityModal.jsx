import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { activityService } from '@/services/api/activityService';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';

const ActivityModal = ({ 
  isOpen, 
  onClose, 
  activity = null, 
  onSave,
  dealId = null,
  contactId = null,
  companyId = null
}) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    date: '',
    dealId: dealId || '',
    contactId: contactId || '',
    companyId: companyId || ''
  });
  
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const activityTypes = [
    'Call',
    'Meeting',
    'Email',
    'Task',
    'Note'
  ];
  
  useEffect(() => {
    if (isOpen) {
      loadData();
      if (activity) {
        setFormData({
          type: activity.type || '',
          description: activity.description || '',
          date: activity.date ? new Date(activity.date).toISOString().slice(0, 16) : '',
          dealId: activity.dealId || '',
          contactId: activity.contactId || '',
          companyId: activity.companyId || ''
        });
      } else {
        setFormData({
          type: '',
          description: '',
          date: new Date().toISOString().slice(0, 16),
          dealId: dealId || '',
          contactId: contactId || '',
          companyId: companyId || ''
        });
      }
    }
  }, [isOpen, activity, dealId, contactId, companyId]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [dealsData, contactsData, companiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type) {
      toast.error('Activity type is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.date) {
      toast.error('Date is required');
      return;
    }
    
    setSaving(true);
    try {
const activityData = {
        Name: formData.description, // Use description as the activity name
        type: formData.type,
        description: formData.description,
        date: formData.date,
        deal_id: formData.dealId ? parseInt(formData.dealId) : null,
        contact_id: formData.contactId ? parseInt(formData.contactId) : null,
        company_id: formData.companyId ? parseInt(formData.companyId) : null,
        user_id: 1 // Default user ID
      };
      
      let savedActivity;
      if (activity) {
        savedActivity = await activityService.update(activity.Id, activityData);
        toast.success('Activity updated successfully');
      } else {
        savedActivity = await activityService.create(activityData);
        toast.success('Activity created successfully');
      }
      
      onSave(savedActivity);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save activity');
    } finally {
      setSaving(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {activity ? 'Edit Activity' : 'Log New Activity'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Activity Type"
                name="type"
                type="select"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Date & Time"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
              />
              
              <FormField
                label="Related Deal"
                name="dealId"
                type="select"
                value={formData.dealId}
                onChange={handleChange}
              >
<option value="">Select Deal</option>
                {deals.map(deal => (
                  <option key={deal.Id} value={deal.Id}>
                    {deal.title || deal.Name}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Related Contact"
                name="contactId"
                type="select"
                value={formData.contactId}
                onChange={handleChange}
              >
<option value="">Select Contact</option>
                {contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.Name}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Related Company"
                name="companyId"
                type="select"
                value={formData.companyId}
                onChange={handleChange}
                className="md:col-span-2"
              >
<option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.Id} value={company.Id}>
                    {company.Name}
                  </option>
                ))}
              </FormField>
            </div>
            
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what happened during this activity..."
              required
              className="min-h-[120px]"
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2"
              >
                {saving && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                <span>{saving ? 'Saving...' : (activity ? 'Update Activity' : 'Log Activity')}</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivityModal;
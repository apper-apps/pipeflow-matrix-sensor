import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';

const DealModal = ({ 
  isOpen, 
  onClose, 
  deal = null, 
  onSave,
  stage = 'Lead In'
}) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: stage,
    expectedCloseDate: '',
    contactId: '',
    companyId: '',
    notes: ''
  });
  
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const stages = [
    'Lead In',
    'Contact Made',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost'
  ];
  
  useEffect(() => {
    if (isOpen) {
      loadData();
      if (deal) {
        setFormData({
          title: deal.title || '',
          value: deal.value || '',
          stage: deal.stage || stage,
          expectedCloseDate: deal.expectedCloseDate || '',
          contactId: deal.contactId || '',
          companyId: deal.companyId || '',
          notes: deal.notes || ''
        });
      } else {
        setFormData({
          title: '',
          value: '',
          stage: stage,
          expectedCloseDate: '',
          contactId: '',
          companyId: '',
          notes: ''
        });
      }
    }
  }, [isOpen, deal, stage]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [contactsData, companiesData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll()
      ]);
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
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.value || formData.value <= 0) {
      toast.error('Value must be greater than 0');
      return;
    }
    
    setSaving(true);
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        userId: 1 // Default user ID
      };
      
      let savedDeal;
      if (deal) {
        savedDeal = await dealService.update(deal.Id, dealData);
        toast.success('Deal updated successfully');
      } else {
        savedDeal = await dealService.create(dealData);
        toast.success('Deal created successfully');
      }
      
      onSave(savedDeal);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save deal');
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
              {deal ? 'Edit Deal' : 'Create New Deal'}
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
                label="Deal Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter deal title"
                required
              />
              
              <FormField
                label="Value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                placeholder="0"
                required
              />
              
              <FormField
                label="Stage"
                name="stage"
                type="select"
                value={formData.stage}
                onChange={handleChange}
                required
              >
                <option value="">Select Stage</option>
                {stages.map(stageOption => (
                  <option key={stageOption} value={stageOption}>
                    {stageOption}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Expected Close Date"
                name="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                required
              />
              
              <FormField
                label="Contact"
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
                label="Company"
                name="companyId"
                type="select"
                value={formData.companyId}
                onChange={handleChange}
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
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about this deal..."
              className="min-h-[100px]"
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
                <span>{saving ? 'Saving...' : (deal ? 'Update Deal' : 'Create Deal')}</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DealModal;
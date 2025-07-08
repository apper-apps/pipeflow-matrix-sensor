import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';

const ContactModal = ({ 
  isOpen, 
  onClose, 
  contact = null, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyId: '',
    notes: ''
  });
  
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      if (contact) {
        setFormData({
          name: contact.name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          jobTitle: contact.jobTitle || '',
          companyId: contact.companyId || '',
          notes: contact.notes || ''
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          jobTitle: '',
          companyId: '',
          notes: ''
        });
      }
    }
  }, [isOpen, contact]);
  
  const loadCompanies = async () => {
    setLoading(true);
    try {
      const companiesData = await companyService.getAll();
      setCompanies(companiesData);
    } catch (error) {
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    setSaving(true);
    try {
      const contactData = {
        ...formData,
        companyId: formData.companyId ? parseInt(formData.companyId) : null,
        userId: 1 // Default user ID
      };
      
      let savedContact;
      if (contact) {
        savedContact = await contactService.update(contact.Id, contactData);
        toast.success('Contact updated successfully');
      } else {
        savedContact = await contactService.create(contactData);
        toast.success('Contact created successfully');
      }
      
      onSave(savedContact);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save contact');
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
              {contact ? 'Edit Contact' : 'Add New Contact'}
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
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
              
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@company.com"
                required
              />
              
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
              
              <FormField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g., Sales Manager"
              />
              
              <FormField
                label="Company"
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
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about this contact..."
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
                <span>{saving ? 'Saving...' : (contact ? 'Update Contact' : 'Add Contact')}</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;
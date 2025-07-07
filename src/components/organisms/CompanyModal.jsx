import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { companyService } from '@/services/api/companyService';

const CompanyModal = ({ 
  isOpen, 
  onClose, 
  company = null, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const [saving, setSaving] = useState(false);
  
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Marketing',
    'Consulting',
    'Other'
  ];
  
  useEffect(() => {
    if (isOpen) {
      if (company) {
        setFormData({
          name: company.name || '',
          industry: company.industry || '',
          website: company.website || '',
          phone: company.phone || '',
          address: company.address || '',
          notes: company.notes || ''
        });
      } else {
        setFormData({
          name: '',
          industry: '',
          website: '',
          phone: '',
          address: '',
          notes: ''
        });
      }
    }
  }, [isOpen, company]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }
    
    setSaving(true);
    try {
      const companyData = {
        ...formData,
        userId: 1 // Default user ID
      };
      
      let savedCompany;
      if (company) {
        savedCompany = await companyService.update(company.Id, companyData);
        toast.success('Company updated successfully');
      } else {
        savedCompany = await companyService.create(companyData);
        toast.success('Company created successfully');
      }
      
      onSave(savedCompany);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save company');
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
              {company ? 'Edit Company' : 'Add New Company'}
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
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
              
              <FormField
                label="Industry"
                name="industry"
                type="select"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://company.com"
              />
              
              <FormField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <FormField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Business Street, City, State 12345"
            />
            
            <FormField
              label="Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about this company..."
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
                <span>{saving ? 'Saving...' : (company ? 'Update Company' : 'Add Company')}</span>
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompanyModal;
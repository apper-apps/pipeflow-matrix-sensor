import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import CompanyModal from '@/components/organisms/CompanyModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { companyService } from '@/services/api/companyService';
import { contactService } from '@/services/api/contactService';
import { dealService } from '@/services/api/dealService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    loadCompanies();
  }, []);
  
  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);
  
  const loadCompanies = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [companiesData, contactsData, dealsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setCompanies(companiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  const filterCompanies = () => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
      return;
    }
    
    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCompanies(filtered);
  };
  
  const handleCreateCompany = () => {
    setSelectedCompany(null);
    setShowModal(true);
  };
  
  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };
  
  const handleSaveCompany = (savedCompany) => {
    if (selectedCompany) {
      // Update existing company
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company.Id === savedCompany.Id ? savedCompany : company
        )
      );
    } else {
      // Add new company
      setCompanies(prevCompanies => [...prevCompanies, savedCompany]);
    }
  };
  
  const handleDeleteCompany = async (companyId) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    
    try {
      await companyService.delete(companyId);
      setCompanies(prevCompanies => 
        prevCompanies.filter(company => company.Id !== companyId)
      );
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };
  
  const getCompanyContactsCount = (companyId) => {
    return contacts.filter(contact => contact.companyId === companyId).length;
  };
  
  const getCompanyDealsCount = (companyId) => {
    return deals.filter(deal => deal.companyId === companyId).length;
  };
  
  const getCompanyDealsValue = (companyId) => {
    const companyDeals = deals.filter(deal => deal.companyId === companyId);
    return companyDeals.reduce((sum, deal) => sum + deal.value, 0);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;
  
  return (
    <div className="space-y-6">
      <Header
        title="Companies"
        subtitle={`${companies.length} total companies`}
        showSearch
        onSearch={setSearchTerm}
        actions={
          <Button
            onClick={handleCreateCompany}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Company</span>
          </Button>
        }
      />
      
      <div className="px-6 pb-6">
        {filteredCompanies.length === 0 ? (
          <Empty
            type="companies"
            onAction={handleCreateCompany}
            actionLabel="Add Company"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <motion.div
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <ApperIcon name="Building" size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        {company.industry && (
                          <Badge variant="secondary" className="mt-1">
                            {company.industry}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit" size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.Id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {company.website && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="Globe" size={14} />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                    
                    {company.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="Phone" size={14} />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    
                    {company.address && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="MapPin" size={14} />
                        <span>{company.address}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {getCompanyContactsCount(company.Id)}
                      </p>
                      <p className="text-xs text-gray-500">Contacts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {getCompanyDealsCount(company.Id)}
                      </p>
                      <p className="text-xs text-gray-500">Deals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(getCompanyDealsValue(company.Id))}
                      </p>
                      <p className="text-xs text-gray-500">Value</p>
                    </div>
                  </div>
                  
                  {company.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {company.notes}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Company Modal */}
      <CompanyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        company={selectedCompany}
        onSave={handleSaveCompany}
      />
    </div>
  );
};

export default Companies;
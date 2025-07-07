import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import CompanyModal from '@/components/organisms/CompanyModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
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
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  useEffect(() => {
    loadCompanies();
  }, []);
  
  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);
  
  useEffect(() => {
    sortCompanies();
  }, [filteredCompanies, sortField, sortDirection]);
  
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
  
  const sortCompanies = () => {
    const sorted = [...filteredCompanies].sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (sortField === 'contactsCount') {
        aValue = getCompanyContactsCount(a.Id);
        bValue = getCompanyContactsCount(b.Id);
      } else if (sortField === 'dealsCount') {
        aValue = getCompanyDealsCount(a.Id);
        bValue = getCompanyDealsCount(b.Id);
      } else if (sortField === 'dealsValue') {
        aValue = getCompanyDealsValue(a.Id);
        bValue = getCompanyDealsValue(b.Id);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredCompanies(sorted);
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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
          <div className="excel-table-container">
            <div className="excel-table-wrapper">
              <table className="excel-table">
                <thead>
                  <tr>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        <ApperIcon 
                          name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('industry')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Industry</span>
                        <ApperIcon 
                          name={sortField === 'industry' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('website')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Website</span>
                        <ApperIcon 
                          name={sortField === 'website' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('phone')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Phone</span>
                        <ApperIcon 
                          name={sortField === 'phone' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('contactsCount')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Contacts</span>
                        <ApperIcon 
                          name={sortField === 'contactsCount' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('dealsCount')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Deals</span>
                        <ApperIcon 
                          name={sortField === 'dealsCount' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('dealsValue')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Value</span>
                        <ApperIcon 
                          name={sortField === 'dealsValue' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th className="excel-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company.Id} className="excel-row">
                      <td className="excel-td">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="Building" size={14} className="text-white" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{company.name}</span>
                            {company.industry && (
                              <div className="mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {company.industry}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="excel-td">
                        <span className="text-gray-700">{company.industry || '-'}</span>
                      </td>
                      <td className="excel-td">
                        {company.website ? (
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Globe" size={14} className="text-gray-400" />
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors truncate max-w-xs"
                              title={company.website}
                            >
                              {company.website}
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="excel-td">
                        {company.phone ? (
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Phone" size={14} className="text-gray-400" />
                            <span className="text-gray-700">{company.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="excel-td">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Users" size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {getCompanyContactsCount(company.Id)}
                          </span>
                        </div>
                      </td>
                      <td className="excel-td">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Briefcase" size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {getCompanyDealsCount(company.Id)}
                          </span>
                        </div>
                      </td>
                      <td className="excel-td">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="DollarSign" size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {formatCurrency(getCompanyDealsValue(company.Id))}
                          </span>
                        </div>
                      </td>
                      <td className="excel-td">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditCompany(company)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Edit company"
                          >
                            <ApperIcon name="Edit" size={14} className="text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteCompany(company.Id)}
                            className="p-1.5 hover:bg-red-100 rounded transition-colors"
                            title="Delete company"
                          >
                            <ApperIcon name="Trash2" size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import ContactModal from '@/components/organisms/ContactModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';
const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm]);
  
useEffect(() => {
    sortContacts();
  }, [contacts, searchTerm, sortField, sortDirection]);
  
  const loadContacts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [contactsData, companiesData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll()
      ]);
      
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };
  
const filterAndSortContacts = () => {
    // First filter based on search term
    let filtered = contacts;
    if (searchTerm) {
      filtered = contacts.filter(contact =>
contact.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Then sort the filtered results
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
if (sortField === 'company_id') {
        aValue = getCompanyName(a.company_id);
        bValue = getCompanyName(b.company_id);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredContacts(sorted);
  };

  const filterContacts = () => {
    filterAndSortContacts();
  };
  
  const sortContacts = () => {
    filterAndSortContacts();
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleCreateContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };
  
  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };
  
  const handleSaveContact = (savedContact) => {
    if (selectedContact) {
      // Update existing contact
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.Id === savedContact.Id ? savedContact : contact
        )
      );
    } else {
      // Add new contact
      setContacts(prevContacts => [...prevContacts, savedContact]);
    }
  };
  
  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await contactService.delete(contactId);
      setContacts(prevContacts => 
        prevContacts.filter(contact => contact.Id !== contactId)
      );
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };
  
const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.Name : 'No company';
  };
  
  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;
  
  return (
    <div className="space-y-6">
      <Header
        title="Contacts"
        subtitle={`${contacts.length} total contacts`}
        showSearch
        onSearch={setSearchTerm}
        actions={
          <Button
            onClick={handleCreateContact}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Contact</span>
          </Button>
        }
      />
      
<div className="px-6 pb-6">
        {filteredContacts.length === 0 ? (
          <Empty
            type="contacts"
            onAction={handleCreateContact}
            actionLabel="Add Contact"
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
                        <span>Name</span>
                        <ApperIcon 
                          name={sortField === 'name' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
                      className="excel-th sortable"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                        <ApperIcon 
                          name={sortField === 'email' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          size={14} 
                        />
                      </div>
                    </th>
                    <th 
className="excel-th sortable"
                      onClick={() => handleSort('job_title')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Job Title</span>
                        <ApperIcon 
name={sortField === 'job_title' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
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
                      onClick={() => handleSort('company_id')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        <ApperIcon 
name={sortField === 'company_id' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                          size={14} 
                        />
                      </div>
                    </th>
                    <th className="excel-th">Notes</th>
                    <th className="excel-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.Id} className="excel-row">
                      <td className="excel-td">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="User" size={14} className="text-white" />
                          </div>
<span className="font-medium text-gray-900">{contact.Name}</span>
                        </div>
                      </td>
                      <td className="excel-td">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Mail" size={14} className="text-gray-400" />
                          <span className="text-gray-700">{contact.email}</span>
                        </div>
                      </td>
                      <td className="excel-td">
<span className="text-gray-700">{contact.job_title || '-'}</span>
                      </td>
                      <td className="excel-td">
                        {contact.phone ? (
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Phone" size={14} className="text-gray-400" />
                            <span className="text-gray-700">{contact.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="excel-td">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Building" size={14} className="text-gray-400" />
<span className="text-gray-700">{getCompanyName(contact.company_id)}</span>
                        </div>
                      </td>
                      <td className="excel-td">
                        {contact.notes ? (
                          <span className="text-gray-700 truncate max-w-xs" title={contact.notes}>
                            {contact.notes}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="excel-td">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditContact(contact)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Edit contact"
                          >
                            <ApperIcon name="Edit" size={14} className="text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact.Id)}
                            className="p-1.5 hover:bg-red-100 rounded transition-colors"
                            title="Delete contact"
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
      
      {/* Contact Modal */}
      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default Contacts;
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import ContactModal from '@/components/organisms/ContactModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
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
  
  useEffect(() => {
    loadContacts();
  }, []);
  
  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm]);
  
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
  
  const filterContacts = () => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
      return;
    }
    
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredContacts(filtered);
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
    return company ? company.name : 'No company';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        {contact.jobTitle && (
                          <p className="text-sm text-gray-600">{contact.jobTitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit" size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.Id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Mail" size={14} />
                      <span>{contact.email}</span>
                    </div>
                    
                    {contact.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ApperIcon name="Phone" size={14} />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="Building" size={14} />
                      <span>{getCompanyName(contact.companyId)}</span>
                    </div>
                  </div>
                  
                  {contact.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {contact.notes}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
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
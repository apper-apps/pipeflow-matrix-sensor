import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ActivityModal from "@/components/organisms/ActivityModal";
import Header from "@/components/organisms/Header";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { activityService } from "@/services/api/activityService";
import { dealService } from "@/services/api/dealService";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const activityTypes = ['all', 'Call', 'Meeting', 'Email', 'Task', 'Note'];
  
  useEffect(() => {
    loadActivities();
  }, []);
  
  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, filterType]);
  
  const loadActivities = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [activitiesData, dealsData, contactsData, companiesData] = await Promise.all([
        activityService.getAll(),
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll()
      ]);
      
      setActivities(activitiesData);
      setDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };
  
  const filterActivities = () => {
    let filtered = activities;
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredActivities(filtered);
  };
  
  const handleCreateActivity = () => {
    setSelectedActivity(null);
    setShowModal(true);
  };
  
  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };
  
  const handleSaveActivity = (savedActivity) => {
    if (selectedActivity) {
      // Update existing activity
      setActivities(prevActivities =>
        prevActivities.map(activity =>
          activity.Id === savedActivity.Id ? savedActivity : activity
        )
      );
    } else {
      // Add new activity
      setActivities(prevActivities => [...prevActivities, savedActivity]);
    }
  };
  
const handleDeleteActivity = async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await activityService.delete(activityId);
      setActivities(prevActivities => 
        prevActivities.filter(activity => activity.Id !== activityId)
      );
      toast.success('Activity deleted successfully');
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return 'Phone';
      case 'Meeting': return 'Calendar';
      case 'Email': return 'Mail';
      case 'Task': return 'CheckSquare';
      case 'Note': return 'FileText';
      default: return 'Activity';
    }
  };
  
  const getActivityColor = (type) => {
    switch (type) {
      case 'Call': return 'primary';
      case 'Meeting': return 'success';
      case 'Email': return 'info';
      case 'Task': return 'warning';
      case 'Note': return 'default';
      default: return 'default';
    }
  };
  
const getRelatedEntityName = (activity) => {
    const parts = [];
    
    if (activity.deal_id) {
      const deal = deals.find(d => d.Id === activity.deal_id);
      if (deal) parts.push(`Deal: ${deal.title}`);
    }
    
    if (activity.contact_id) {
      const contact = contacts.find(c => c.Id === activity.contact_id);
      if (contact) parts.push(`Contact: ${contact.Name}`);
    }
    
    if (activity.company_id) {
      const company = companies.find(c => c.Id === activity.company_id);
      if (company) parts.push(`Company: ${company.Name}`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'General';
  };
  
  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadActivities} />;
  
  return (
    <div className="space-y-6">
      <Header
        title="Activities"
        subtitle={`${activities.length} total activities`}
        showSearch
        onSearch={setSearchTerm}
        actions={
          <Button
            onClick={handleCreateActivity}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Log Activity</span>
          </Button>
        }
      />
      
      <div className="px-6 pb-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {activityTypes.map(type => (
            <Button
              key={type}
              variant={filterType === type ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType(type)}
              className="flex items-center space-x-2"
            >
              {type !== 'all' && (
                <ApperIcon name={getActivityIcon(type)} size={14} />
              )}
              <span>{type === 'all' ? 'All Activities' : type}</span>
            </Button>
          ))}
        </div>
        
        {filteredActivities.length === 0 ? (
          <Empty
            type="activities"
            onAction={handleCreateActivity}
            actionLabel="Log Activity"
          />
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <ApperIcon 
                            name={getActivityIcon(activity.type)} 
                            size={18} 
                            className="text-white" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={getActivityColor(activity.type)}>
                            {activity.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(activity.date), 'MMM d, yyyy • h:mm a')}
                          </span>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-2">
                          {getRelatedEntityName(activity)}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {activity.description}
                        </p>
                        
<div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            Created: {format(new Date(activity.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditActivity(activity)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Edit" size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.Id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Activity Modal */}
      <ActivityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        activity={selectedActivity}
        onSave={handleSaveActivity}
      />
    </div>
  );
};

export default Activities;
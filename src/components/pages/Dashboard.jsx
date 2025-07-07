import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import MetricCard from '@/components/molecules/MetricCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';
import { activityService } from '@/services/api/activityService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({
    totalDeals: 0,
    pipelineValue: 0,
    wonDeals: 0,
    activitiesCount: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [dealsByStage, setDealsByStage] = useState({});
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [dealsData, contactsData, companiesData, activitiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setCompanies(companiesData);
      
      // Calculate metrics
      const totalDeals = dealsData.length;
      const pipelineValue = dealsData.reduce((sum, deal) => sum + deal.value, 0);
      const wonDeals = dealsData.filter(deal => deal.stage === 'Won').length;
      const activitiesCount = activitiesData.length;
      
      setMetrics({
        totalDeals,
        pipelineValue,
        wonDeals,
        activitiesCount
      });
      
      // Group deals by stage
      const stageGroups = dealsData.reduce((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1;
        return acc;
      }, {});
      setDealsByStage(stageGroups);
      
      // Get recent activities
      const sortedActivities = activitiesData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
      setRecentActivities(sortedActivities);
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getActivityIcon = (type) => {
    switch (type) {
      case 'Call': return 'Phone';
      case 'Meeting': return 'Users';
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
    if (activity.dealId) {
      // For this example, we'll show the deal ID since we don't have the full deal data
      return `Deal #${activity.dealId}`;
    }
    if (activity.contactId) {
      const contact = contacts.find(c => c.Id === activity.contactId);
      return contact ? contact.name : `Contact #${activity.contactId}`;
    }
    if (activity.companyId) {
      const company = companies.find(c => c.Id === activity.companyId);
      return company ? company.name : `Company #${activity.companyId}`;
    }
    return 'General';
  };
  
  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  
  return (
    <div className="space-y-6">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your pipeline."
        actions={
          <Button
            onClick={() => navigate('/deals')}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>New Deal</span>
          </Button>
        }
      />
      
      <div className="px-6 pb-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Deals"
            value={metrics.totalDeals}
            icon="Target"
            gradient
          />
          <MetricCard
            title="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            icon="DollarSign"
            gradient
          />
          <MetricCard
            title="Won Deals"
            value={metrics.wonDeals}
            icon="TrendingUp"
            gradient
          />
          <MetricCard
            title="Activities"
            value={metrics.activitiesCount}
            icon="Activity"
            gradient
          />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/activities')}
              >
                View All
              </Button>
            </div>
            
            {recentActivities.length === 0 ? (
              <Empty
                type="activities"
                onAction={() => navigate('/activities')}
                actionLabel="Log Activity"
              />
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ApperIcon 
                          name={getActivityIcon(activity.type)} 
                          size={14} 
                          className="text-gray-600" 
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getActivityColor(activity.type)} className="text-xs">
                          {activity.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {getRelatedEntityName(activity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(activity.date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
          
          {/* Pipeline Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pipeline Overview</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/deals')}
              >
                View Pipeline
              </Button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(dealsByStage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stage}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${(count / metrics.totalDeals) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 min-w-[24px]">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/deals')}
              className="flex items-center justify-center space-x-2 p-4 h-auto"
            >
              <ApperIcon name="Target" size={20} />
              <span>Create Deal</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/contacts')}
              className="flex items-center justify-center space-x-2 p-4 h-auto"
            >
              <ApperIcon name="Users" size={20} />
              <span>Add Contact</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/companies')}
              className="flex items-center justify-center space-x-2 p-4 h-auto"
            >
              <ApperIcon name="Building" size={20} />
              <span>Add Company</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/activities')}
              className="flex items-center justify-center space-x-2 p-4 h-auto"
            >
              <ApperIcon name="Activity" size={20} />
              <span>Log Activity</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
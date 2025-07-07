import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import DealModal from "@/components/organisms/DealModal";
import DealCard from "@/components/organisms/DealCard";
import Header from "@/components/organisms/Header";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { dealService } from "@/services/api/dealService";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState('');
  
const stages = [
    'Lead In',
    'Contact Made',
    'Proposal Sent',
    'Negotiation'
  ];
  
  const stageColors = {
    'Lead In': 'bg-gray-100 text-gray-800',
    'Contact Made': 'bg-blue-100 text-blue-800',
    'Proposal Sent': 'bg-yellow-100 text-yellow-800',
    'Negotiation': 'bg-purple-100 text-purple-800',
    'Won': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800'
  };
  
  useEffect(() => {
    loadDeals();
  }, []);
  
  const loadDeals = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [dealsData, contactsData, companiesData] = await Promise.all([
dealService.getAll(),
        contactService.getAll(),
        companyService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };
  
const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (destination.droppableId === source.droppableId) return;
    
    const newStage = destination.droppableId;
    const dealId = parseInt(draggableId);
    
    try {
      // Update deal stage
      await dealService.update(dealId, { stage: newStage });
      
      // Update local state - if Won/Lost, deal will be filtered out from pipeline view
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.Id === dealId 
            ? { ...deal, stage: newStage, updatedAt: new Date().toISOString() }
            : deal
        )
      );
      
      if (newStage === 'Won' || newStage === 'Lost') {
        toast.success(`Deal ${newStage.toLowerCase()}! Moved to ${newStage} status.`);
      } else {
        toast.success(`Deal moved to ${newStage}`);
      }
    } catch (error) {
      toast.error('Failed to update deal stage');
      console.error('Error updating deal stage:', error);
    }
  };
  
  const handleCreateDeal = (stage) => {
    setSelectedStage(stage);
    setSelectedDeal(null);
    setShowModal(true);
  };
  
  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };
  
const handleSaveDeal = (savedDeal) => {
    if (selectedDeal) {
      // Update existing deal
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.Id === savedDeal.Id ? savedDeal : deal
        )
      );
    } else {
      // Add new deal
      setDeals(prevDeals => [...prevDeals, savedDeal]);
    }
  };
const getDealsForStage = (stage) => {
    return deals.filter(deal => deal.stage === stage && deal.stage !== 'Won' && deal.stage !== 'Lost');
  };
  const getStageValue = (stage) => {
    const stageDeals = getDealsForStage(stage);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (loading) return <Loading type="pipeline" />;
  if (error) return <Error message={error} onRetry={loadDeals} />;
  
  return (
    <div className="h-full flex flex-col">
      <Header
        title="Deals Pipeline"
        subtitle="Manage your sales pipeline and track deal progress"
        actions={
          <Button
            onClick={() => handleCreateDeal('Lead In')}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>New Deal</span>
          </Button>
        }
      />
      
      <div className="flex-1 overflow-hidden">
<DragDropContext onDragEnd={handleDragEnd}>
          <div className="h-full p-6 flex flex-col">
            {/* Main Pipeline */}
            <div className="flex-1 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
                {stages.map((stage) => {
                  const stageDeals = getDealsForStage(stage);
                const stageValue = getStageValue(stage);
                
                return (
                  <div key={stage} className="flex flex-col h-full">
                    {/* Stage Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {stage}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className={cn('text-xs', stageColors[stage])}
                        >
                          {stageDeals.length}
                        </Badge>
                      </div>
                      <button
                        onClick={() => handleCreateDeal(stage)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ApperIcon name="Plus" size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Stage Value */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(stageValue)}
                      </p>
                    </div>
                    
                    {/* Droppable Area */}
                    <Droppable droppableId={stage}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            'flex-1 space-y-3 p-3 rounded-lg transition-colors min-h-[200px]',
                            snapshot.isDraggingOver 
                              ? 'bg-blue-50 border-2 border-blue-200' 
                              : 'bg-gray-50 border-2 border-transparent'
                          )}
                        >
                          {stageDeals.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-gray-500">
                              <div className="text-center">
                                <ApperIcon name="Target" size={24} className="mx-auto mb-2" />
                                <p className="text-sm">No deals in {stage}</p>
                              </div>
                            </div>
                          ) : (
                            stageDeals.map((deal, index) => (
                              <Draggable
                                key={deal.Id}
                                draggableId={deal.Id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <DealCard
                                      deal={deal}
                                      contacts={contacts}
                                      companies={companies}
                                      onClick={() => handleEditDeal(deal)}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
);
              })}
              </div>
            </div>
            
            {/* Won/Lost Drop Zone Bar */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Won Drop Zone */}
                <Droppable droppableId="Won">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'h-20 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center',
                        snapshot.isDraggingOver 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-green-200 bg-green-25 hover:border-green-300 hover:bg-green-50'
                      )}
                    >
                      <div className="flex items-center space-x-2 text-green-600">
                        <ApperIcon name="Trophy" size={24} />
                        <span className="font-semibold text-lg">Won</span>
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                
                {/* Lost Drop Zone */}
                <Droppable droppableId="Lost">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'h-20 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center',
                        snapshot.isDraggingOver 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-red-200 bg-red-25 hover:border-red-300 hover:bg-red-50'
                      )}
                    >
                      <div className="flex items-center space-x-2 text-red-600">
                        <ApperIcon name="X" size={24} />
                        <span className="font-semibold text-lg">Lost</span>
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
      
      {/* Deal Modal */}
      <DealModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        deal={selectedDeal}
        onSave={handleSaveDeal}
        stage={selectedStage}
      />
    </div>
  );
};

export default Deals;
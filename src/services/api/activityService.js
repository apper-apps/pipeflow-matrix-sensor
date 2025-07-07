import { toast } from 'react-toastify';

export const activityService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('app_Activity', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching activity:", error);
      toast.error("Failed to load activity");
      return null;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: activityData.Name,
          type: activityData.type,
          description: activityData.description,
          date: activityData.date,
          deal_id: activityData.deal_id ? parseInt(activityData.deal_id) : null,
          contact_id: activityData.contact_id ? parseInt(activityData.contact_id) : null,
          company_id: activityData.company_id ? parseInt(activityData.company_id) : null,
          user_id: parseInt(activityData.user_id),
          Tags: activityData.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create activity");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Activity created successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (activityData.Name !== undefined) updateData.Name = activityData.Name;
      if (activityData.type !== undefined) updateData.type = activityData.type;
      if (activityData.description !== undefined) updateData.description = activityData.description;
      if (activityData.date !== undefined) updateData.date = activityData.date;
      if (activityData.deal_id !== undefined) updateData.deal_id = activityData.deal_id ? parseInt(activityData.deal_id) : null;
      if (activityData.contact_id !== undefined) updateData.contact_id = activityData.contact_id ? parseInt(activityData.contact_id) : null;
      if (activityData.company_id !== undefined) updateData.company_id = activityData.company_id ? parseInt(activityData.company_id) : null;
      if (activityData.user_id !== undefined) updateData.user_id = parseInt(activityData.user_id);
      if (activityData.Tags !== undefined) updateData.Tags = activityData.Tags;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update activity");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Activity updated successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating activity:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      return false;
    }
  },

  async getByDeal(dealId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "deal_id",
            Operator: "EqualTo",
            Values: [parseInt(dealId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error);
      return [];
    }
  },

  async getByContact(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "contact_id",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error);
      return [];
    }
  },

  async getByCompany(companyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "date" } },
          { field: { Name: "deal_id" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "company_id",
            Operator: "EqualTo",
            Values: [parseInt(companyId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_Activity', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by company:", error);
      return [];
    }
  }
};
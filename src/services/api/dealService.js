import { toast } from 'react-toastify';

export const dealService = {
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
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "notes" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error("Failed to load deals");
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
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "notes" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('deal', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching deal:", error);
      toast.error("Failed to load deal");
      return null;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: dealData.Name,
          title: dealData.title,
          value: parseFloat(dealData.value),
          stage: dealData.stage,
          expected_close_date: dealData.expected_close_date,
          notes: dealData.notes,
          contact_id: parseInt(dealData.contact_id),
          company_id: parseInt(dealData.company_id),
          user_id: parseInt(dealData.user_id),
          Tags: dealData.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('deal', params);
      
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
          throw new Error("Failed to create deal");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Deal created successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (dealData.Name !== undefined) updateData.Name = dealData.Name;
      if (dealData.title !== undefined) updateData.title = dealData.title;
      if (dealData.value !== undefined) updateData.value = parseFloat(dealData.value);
      if (dealData.stage !== undefined) updateData.stage = dealData.stage;
      if (dealData.expected_close_date !== undefined) updateData.expected_close_date = dealData.expected_close_date;
      if (dealData.notes !== undefined) updateData.notes = dealData.notes;
      if (dealData.contact_id !== undefined) updateData.contact_id = parseInt(dealData.contact_id);
      if (dealData.company_id !== undefined) updateData.company_id = parseInt(dealData.company_id);
      if (dealData.user_id !== undefined) updateData.user_id = parseInt(dealData.user_id);
      if (dealData.Tags !== undefined) updateData.Tags = dealData.Tags;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('deal', params);
      
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
          throw new Error("Failed to update deal");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Deal updated successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating deal:", error);
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
      
      const response = await apperClient.deleteRecord('deal', params);
      
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
      console.error("Error deleting deal:", error);
      return false;
    }
  },

  async getByStage(stage) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "expected_close_date" } },
          { field: { Name: "notes" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "stage",
            Operator: "EqualTo",
            Values: [stage]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals by stage:", error);
      return [];
    }
  }
};
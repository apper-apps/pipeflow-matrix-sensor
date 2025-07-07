import { toast } from 'react-toastify';

export const companyService = {
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
          { field: { Name: "industry" } },
          { field: { Name: "website" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "notes" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('company', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
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
          { field: { Name: "industry" } },
          { field: { Name: "website" } },
          { field: { Name: "phone" } },
          { field: { Name: "address" } },
          { field: { Name: "notes" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('company', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Failed to load company");
      return null;
    }
  },

  async create(companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: companyData.Name,
          industry: companyData.industry,
          website: companyData.website,
          phone: companyData.phone,
          address: companyData.address,
          notes: companyData.notes,
          user_id: parseInt(companyData.user_id),
          Tags: companyData.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('company', params);
      
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
          throw new Error("Failed to create company");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Company created successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (companyData.Name !== undefined) updateData.Name = companyData.Name;
      if (companyData.industry !== undefined) updateData.industry = companyData.industry;
      if (companyData.website !== undefined) updateData.website = companyData.website;
      if (companyData.phone !== undefined) updateData.phone = companyData.phone;
      if (companyData.address !== undefined) updateData.address = companyData.address;
      if (companyData.notes !== undefined) updateData.notes = companyData.notes;
      if (companyData.user_id !== undefined) updateData.user_id = parseInt(companyData.user_id);
      if (companyData.Tags !== undefined) updateData.Tags = companyData.Tags;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('company', params);
      
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
          throw new Error("Failed to update company");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Company updated successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating company:", error);
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
      
      const response = await apperClient.deleteRecord('company', params);
      
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
      console.error("Error deleting company:", error);
      return false;
    }
  }
};
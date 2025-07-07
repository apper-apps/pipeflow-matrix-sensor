import { toast } from 'react-toastify';

export const contactService = {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "job_title" } },
          { field: { Name: "notes" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('app_contact', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "job_title" } },
          { field: { Name: "notes" } },
          { field: { Name: "company_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById('app_contact', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching contact:", error);
      toast.error("Failed to load contact");
      return null;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: contactData.Name,
          email: contactData.email,
          phone: contactData.phone,
          job_title: contactData.job_title,
          notes: contactData.notes,
          company_id: parseInt(contactData.company_id),
          user_id: parseInt(contactData.user_id),
          Tags: contactData.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('app_contact', params);
      
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
          throw new Error("Failed to create contact");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Contact created successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from create operation");
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (contactData.Name !== undefined) updateData.Name = contactData.Name;
      if (contactData.email !== undefined) updateData.email = contactData.email;
      if (contactData.phone !== undefined) updateData.phone = contactData.phone;
      if (contactData.job_title !== undefined) updateData.job_title = contactData.job_title;
      if (contactData.notes !== undefined) updateData.notes = contactData.notes;
      if (contactData.company_id !== undefined) updateData.company_id = parseInt(contactData.company_id);
      if (contactData.user_id !== undefined) updateData.user_id = parseInt(contactData.user_id);
      if (contactData.Tags !== undefined) updateData.Tags = contactData.Tags;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('app_contact', params);
      
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
          throw new Error("Failed to update contact");
        }
        
        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          toast.success("Contact updated successfully");
          return successfulRecord.data;
        }
      }
      
      throw new Error("No data returned from update operation");
    } catch (error) {
      console.error("Error updating contact:", error);
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
      
      const response = await apperClient.deleteRecord('app_contact', params);
      
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
      console.error("Error deleting contact:", error);
      return false;
    }
  }
};
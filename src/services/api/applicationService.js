import { toast } from 'react-toastify';

const applicationService = {
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "appliedDate" } },
          { field: { Name: "status" } },
          { field: { Name: "resumeUsed" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "jobId" },
            referenceField: { field: { Name: "title" } }
          }
        ],
        orderBy: [
          {
            fieldName: "appliedDate",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('application', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching applications:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "appliedDate" } },
          { field: { Name: "status" } },
          { field: { Name: "resumeUsed" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "jobId" },
            referenceField: { field: { Name: "title" } }
          }
        ]
      };

      const response = await apperClient.getRecordById('application', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching application with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields and handle lookup field
      const updateableData = {
        Name: applicationData.Name,
        Tags: applicationData.Tags,
        Owner: parseInt(applicationData.Owner) || applicationData.Owner,
        appliedDate: applicationData.appliedDate,
        status: applicationData.status,
        resumeUsed: applicationData.resumeUsed,
        notes: applicationData.notes,
        jobId: parseInt(applicationData.jobId?.Id || applicationData.jobId)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('application', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} application records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('Application created successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating application:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id and handle lookup field
      const updateableData = {
        Id: parseInt(id),
        ...(updateData.Name !== undefined && { Name: updateData.Name }),
        ...(updateData.Tags !== undefined && { Tags: updateData.Tags }),
        ...(updateData.Owner !== undefined && { Owner: parseInt(updateData.Owner) || updateData.Owner }),
        ...(updateData.appliedDate !== undefined && { appliedDate: updateData.appliedDate }),
        ...(updateData.status !== undefined && { status: updateData.status }),
        ...(updateData.resumeUsed !== undefined && { resumeUsed: updateData.resumeUsed }),
        ...(updateData.notes !== undefined && { notes: updateData.notes }),
        ...(updateData.jobId !== undefined && { jobId: parseInt(updateData.jobId?.Id || updateData.jobId) })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('application', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} application records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Application updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(recordIds) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await apperClient.deleteRecord('application', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} application records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Application(s) deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting application records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default applicationService;
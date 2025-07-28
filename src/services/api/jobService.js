import { toast } from 'react-toastify';

const jobService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "type" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "industry" } },
          { field: { Name: "salary" } },
          { field: { Name: "description" } },
          { field: { Name: "requirements" } },
          { field: { Name: "posted" } }
        ],
        orderBy: [
          {
            fieldName: "posted",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('job', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching jobs:", error?.response?.data?.message);
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
          { field: { Name: "type" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "industry" } },
          { field: { Name: "salary" } },
          { field: { Name: "description" } },
          { field: { Name: "requirements" } },
          { field: { Name: "posted" } }
        ]
      };

      const response = await apperClient.getRecordById('job', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching job with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(jobData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        type: jobData.type,
        Name: jobData.Name,
        Tags: jobData.Tags,
        Owner: parseInt(jobData.Owner) || jobData.Owner,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        industry: jobData.industry,
        salary: jobData.salary,
        description: jobData.description,
        requirements: jobData.requirements,
        posted: jobData.posted
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('job', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} job records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('Job created successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating job:", error?.response?.data?.message);
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

      // Only include Updateable fields plus Id
      const updateableData = {
        Id: parseInt(id),
        ...(updateData.type !== undefined && { type: updateData.type }),
        ...(updateData.Name !== undefined && { Name: updateData.Name }),
        ...(updateData.Tags !== undefined && { Tags: updateData.Tags }),
        ...(updateData.Owner !== undefined && { Owner: parseInt(updateData.Owner) || updateData.Owner }),
        ...(updateData.title !== undefined && { title: updateData.title }),
        ...(updateData.company !== undefined && { company: updateData.company }),
        ...(updateData.location !== undefined && { location: updateData.location }),
        ...(updateData.industry !== undefined && { industry: updateData.industry }),
        ...(updateData.salary !== undefined && { salary: updateData.salary }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.requirements !== undefined && { requirements: updateData.requirements }),
        ...(updateData.posted !== undefined && { posted: updateData.posted })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('job', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} job records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Job updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating job:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('job', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} job records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Job(s) deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting job records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default jobService;
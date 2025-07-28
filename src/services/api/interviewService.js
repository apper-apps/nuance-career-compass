import { toast } from 'react-toastify';

export const interviewService = {
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
          { field: { Name: "question" } },
          { field: { Name: "answer" } },
          { field: { Name: "category" } },
          { field: { Name: "industry" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "tips" } }
        ],
        orderBy: [
          {
            fieldName: "category",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching interview questions:", error?.response?.data?.message);
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
          { field: { Name: "question" } },
          { field: { Name: "answer" } },
          { field: { Name: "category" } },
          { field: { Name: "industry" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "tips" } }
        ]
      };

      const response = await apperClient.getRecordById('interview_question', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching interview question with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByCategory(category) {
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
          { field: { Name: "question" } },
          { field: { Name: "answer" } },
          { field: { Name: "category" } },
          { field: { Name: "industry" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "tips" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      };

      const response = await apperClient.fetchRecords('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching questions by category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByIndustry(industry) {
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
          { field: { Name: "question" } },
          { field: { Name: "answer" } },
          { field: { Name: "category" } },
          { field: { Name: "industry" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "tips" } }
        ],
        where: [
          {
            FieldName: "industry",
            Operator: "EqualTo",
            Values: [industry]
          }
        ]
      };

      const response = await apperClient.fetchRecords('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching questions by industry:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByDifficulty(difficulty) {
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
          { field: { Name: "question" } },
          { field: { Name: "answer" } },
          { field: { Name: "category" } },
          { field: { Name: "industry" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "tips" } }
        ],
        where: [
          {
            FieldName: "difficulty",
            Operator: "EqualTo",
            Values: [difficulty]
          }
        ]
      };

      const response = await apperClient.fetchRecords('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching questions by difficulty:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async search(query) {
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
          { field: { Name: "question" } },
          { field: { Name: "answer" } },
          { field: { Name: "category" } },
          { field: { Name: "industry" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "tips" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                operator: "OR",
                conditions: [
                  {
                    fieldName: "question",
                    operator: "Contains",
                    values: [query],
                    include: true
                  },
                  {
                    fieldName: "answer",
                    operator: "Contains",
                    values: [query],
                    include: true
                  },
                  {
                    fieldName: "Tags",
                    operator: "Contains",
                    values: [query],
                    include: true
                  },
                  {
                    fieldName: "category",
                    operator: "Contains",
                    values: [query],
                    include: true
                  },
                  {
                    fieldName: "industry",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching interview questions:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(questionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields and format Tags as comma-separated string
      const updateableData = {
        Name: questionData.Name,
        Tags: Array.isArray(questionData.Tags) ? questionData.Tags.join(',') : questionData.Tags,
        Owner: parseInt(questionData.Owner) || questionData.Owner,
        question: questionData.question,
        answer: questionData.answer,
        category: questionData.category,
        industry: questionData.industry,
        difficulty: questionData.difficulty,
        tips: questionData.tips || ''
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} interview question records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('Interview question created successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating interview question:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, questionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id and format Tags as comma-separated string
      const updateableData = {
        Id: parseInt(id),
        ...(questionData.Name !== undefined && { Name: questionData.Name }),
        ...(questionData.Tags !== undefined && { Tags: Array.isArray(questionData.Tags) ? questionData.Tags.join(',') : questionData.Tags }),
        ...(questionData.Owner !== undefined && { Owner: parseInt(questionData.Owner) || questionData.Owner }),
        ...(questionData.question !== undefined && { question: questionData.question }),
        ...(questionData.answer !== undefined && { answer: questionData.answer }),
        ...(questionData.category !== undefined && { category: questionData.category }),
        ...(questionData.industry !== undefined && { industry: questionData.industry }),
        ...(questionData.difficulty !== undefined && { difficulty: questionData.difficulty }),
        ...(questionData.tips !== undefined && { tips: questionData.tips })
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} interview question records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Interview question updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating interview question:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('interview_question', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} interview question records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Interview question(s) deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting interview question records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getCategories() {
    try {
      const questions = await this.getAll();
      const categories = [...new Set(questions.map(q => q.category))];
      return categories.sort();
    } catch (error) {
      console.error("Error getting categories:", error.message);
      return [];
    }
  },

  async getIndustries() {
    try {
      const questions = await this.getAll();
      const industries = [...new Set(questions.map(q => q.industry))];
      return industries.sort();
    } catch (error) {
      console.error("Error getting industries:", error.message);
      return [];
    }
  },

  getDifficulties() {
    return Promise.resolve(['Easy', 'Medium', 'Hard']);
  },

  async getPracticeQuestions(count = 10, filters = {}) {
    try {
      let questions = await this.getAll();

      if (filters.category) {
        questions = questions.filter(q => q.category === filters.category);
      }
      if (filters.industry) {
        questions = questions.filter(q => q.industry === filters.industry);
      }
      if (filters.difficulty) {
        questions = questions.filter(q => q.difficulty === filters.difficulty);
      }

      // Shuffle and take requested count
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error("Error getting practice questions:", error.message);
      return [];
    }
  }
};

export default interviewService;
import applicationsData from "@/services/mockData/applications.json";

const applicationService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...applicationsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const application = applicationsData.find(item => item.Id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    return { ...application };
  },

  async create(applicationData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...applicationsData.map(item => item.Id), 0);
    const newApplication = {
      ...applicationData,
      Id: maxId + 1
    };
    applicationsData.push(newApplication);
    return { ...newApplication };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = applicationsData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Application not found");
    }
    applicationsData[index] = { ...applicationsData[index], ...updateData };
    return { ...applicationsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = applicationsData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Application not found");
    }
    const deletedApplication = { ...applicationsData[index] };
    applicationsData.splice(index, 1);
    return deletedApplication;
  }
};

export default applicationService;
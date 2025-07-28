import jobsData from "@/services/mockData/jobs.json";

const jobService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...jobsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const job = jobsData.find(item => item.Id === id);
    if (!job) {
      throw new Error("Job not found");
    }
    return { ...job };
  },

  async create(jobData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...jobsData.map(item => item.Id));
    const newJob = {
      ...jobData,
      Id: maxId + 1
    };
    jobsData.push(newJob);
    return { ...newJob };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = jobsData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Job not found");
    }
    jobsData[index] = { ...jobsData[index], ...updateData };
    return { ...jobsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = jobsData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Job not found");
    }
    const deletedJob = { ...jobsData[index] };
    jobsData.splice(index, 1);
    return deletedJob;
  }
};

export default jobService;
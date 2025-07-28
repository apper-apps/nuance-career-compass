import resumesData from "@/services/mockData/resumes.json";

const resumeService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...resumesData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const resume = resumesData.find(item => item.Id === id);
    if (!resume) {
      throw new Error("Resume not found");
    }
    return { ...resume };
  },

  async create(resumeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...resumesData.map(item => item.Id), 0);
    const newResume = {
      ...resumeData,
      Id: maxId + 1
    };
    resumesData.push(newResume);
    return { ...newResume };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = resumesData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Resume not found");
    }
    resumesData[index] = { ...resumesData[index], ...updateData };
    return { ...resumesData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = resumesData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Resume not found");
    }
    const deletedResume = { ...resumesData[index] };
    resumesData.splice(index, 1);
    return deletedResume;
  }
};

export default resumeService;
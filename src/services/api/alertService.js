import alertsData from "@/services/mockData/alerts.json";

const alertService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...alertsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const alert = alertsData.find(item => item.Id === id);
    if (!alert) {
      throw new Error("Alert not found");
    }
    return { ...alert };
  },

  async create(alertData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...alertsData.map(item => item.Id), 0);
    const newAlert = {
      ...alertData,
      Id: maxId + 1
    };
    alertsData.push(newAlert);
    return { ...newAlert };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = alertsData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Alert not found");
    }
    alertsData[index] = { ...alertsData[index], ...updateData };
    return { ...alertsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = alertsData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Alert not found");
    }
    const deletedAlert = { ...alertsData[index] };
    alertsData.splice(index, 1);
    return deletedAlert;
  }
};

export default alertService;
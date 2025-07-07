import activityData from '@/services/mockData/activities.json';

let activities = [...activityData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) throw new Error('Activity not found');
    return { ...activity };
  },

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error('Activity not found');
    
    activities[index] = { ...activities[index], ...activityData };
    return { ...activities[index] };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error('Activity not found');
    
    activities.splice(index, 1);
    return true;
  },

  async getByDeal(dealId) {
    await delay(200);
    return activities.filter(a => a.dealId === parseInt(dealId));
  },

  async getByContact(contactId) {
    await delay(200);
    return activities.filter(a => a.contactId === parseInt(contactId));
  },

  async getByCompany(companyId) {
    await delay(200);
    return activities.filter(a => a.companyId === parseInt(companyId));
  }
};
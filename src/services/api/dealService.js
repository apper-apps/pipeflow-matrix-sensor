import dealData from '@/services/mockData/deals.json';

let deals = [...dealData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) throw new Error('Deal not found');
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error('Deal not found');
    
    deals[index] = { 
      ...deals[index], 
      ...dealData,
      updatedAt: new Date().toISOString()
    };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error('Deal not found');
    
    deals.splice(index, 1);
    return true;
  },

  async getByStage(stage) {
    await delay(200);
    return deals.filter(d => d.stage === stage);
  }
};
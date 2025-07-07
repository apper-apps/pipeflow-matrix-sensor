import companyData from '@/services/mockData/companies.json';

let companies = [...companyData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const companyService = {
  async getAll() {
    await delay(300);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id));
    if (!company) throw new Error('Company not found');
    return { ...company };
  },

  async create(companyData) {
    await delay(400);
    const newCompany = {
      ...companyData,
      Id: Math.max(...companies.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(350);
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error('Company not found');
    
    companies[index] = { ...companies[index], ...companyData };
    return { ...companies[index] };
  },

  async delete(id) {
    await delay(250);
    const index = companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error('Company not found');
    
    companies.splice(index, 1);
    return true;
  }
};
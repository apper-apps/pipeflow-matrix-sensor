import userData from '@/services/mockData/users.json';

let users = [...userData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(id));
    if (!user) throw new Error('User not found');
    return { ...user };
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      Id: Math.max(...users.map(u => u.Id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(350);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...userData };
    return { ...users[index] };
  },

  async delete(id) {
    await delay(250);
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error('User not found');
    
    users.splice(index, 1);
    return true;
  }
};
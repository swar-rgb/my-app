const DB_KEY = 'crud-users';

const seedData = [
  { id: 1, name: 'Alice', email: 'alice@mail.com', phone: '9876543210', address: 'Delhi' },
  { id: 2, name: 'Bob', email: 'bob@mail.com', phone: '9123456780', address: 'Mumbai' },
];

export function readDB() {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(seedData));
      return seedData;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('DB read error:', err);
    return [];
  }
}

export function writeDB(data) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('DB write error:', err);
  }
}

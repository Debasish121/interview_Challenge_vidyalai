const axios = require('axios').default;

async function fetchAllUsers() {
  const { data: users } = await axios.get(
    'https://jsonplaceholder.typicode.com/users',
  );

  return users;
}

// Route to fetch user are https://jsonplaceholder.typicode.com/users/:userId
async function fetchUserById(userId) {
  try {
    const { data: user } = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
}

module.exports = { fetchAllUsers, fetchUserById };

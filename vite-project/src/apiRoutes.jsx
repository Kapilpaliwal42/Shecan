// Updated API endpoints using fetch instead of axios

const API_BASE_URL = 'https://shecan-k2pc.onrender.com/';

// === AUTH APIs ===
export const registerUser = async ({ name, email, password, refer }) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password, refer })
  });
  return await response.json();
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// === USER APIs ===
export const getMyProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/myProfile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await response.json();
};

export const changeUserRole = async (email, newRole, token) => {
  const response = await fetch(`${API_BASE_URL}/changeRole`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email, newRole })
  });
  return await response.json();
};

// Consolidated function to get all users, which will now hit the /getUsers endpoint
// This endpoint is accessible to any protected user.
export const getUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/getUsers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await response.json();
};

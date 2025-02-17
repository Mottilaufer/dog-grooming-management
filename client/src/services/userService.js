import axios from './axios';

export const login = async (credentials) => {
  const response = await axios.post('/login', credentials);
  return response.data;
};

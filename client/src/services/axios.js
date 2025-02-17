import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:7174/api',
});

export default instance;

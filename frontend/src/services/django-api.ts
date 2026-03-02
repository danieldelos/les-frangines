import axios from 'axios';
import { getDjangoBaseUrl } from './django';

const djangoApi = axios.create({
  baseURL: getDjangoBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

djangoApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

djangoApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { djangoApi };
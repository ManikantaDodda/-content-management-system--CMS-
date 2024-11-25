import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

// Set up Axios interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
 console.log(config.headers); 
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

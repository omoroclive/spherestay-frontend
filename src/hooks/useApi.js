import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useApi = (endpoint, options = {}) => {
  return useQuery({
    queryKey: [endpoint, options.params],
    queryFn: async () => {
      try {
        console.log(`Requesting: ${api.defaults.baseURL}${endpoint}`, {
          params: options.params,
          headers: api.defaults.headers.common,
          method: 'GET'
        });
        const response = await api.get(endpoint, { 
          params: options.params,
          signal: options.signal // For request cancellation
        });
        return response.data;
      } catch (error) {
        console.error(`API Error for ${endpoint}:`, {
          status: error.response?.status,
          url: `${api.defaults.baseURL}${endpoint}`,
          params: options.params,
          data: error.response?.data,
          headers: error.config?.headers,
          message: error.message,
          suggestion: error.response?.status === 404 
            ? 'The /properties endpoint may not be registered on the backend. Verify the server is running at https://spherestay.onrender.com and the route is configured in Express.js.'
            : 'Check network connectivity or server status.'
        });
        throw error; // Propagate error to home.jsx
      }
    },
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
    cacheTime: options.cacheTime || 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error.response?.status === 404) return false;
      // Retry others up to 3 times
      return failureCount < 3;
    },
    ...options,
  });
};
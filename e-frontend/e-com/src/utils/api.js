const BASE_URL = 'http://localhost:5000/api';

const activeRequests = new Map();

export const apiRequest = async (endpoint, options = {}) => {
  const method = options.method || 'GET';
  const url = `${BASE_URL}${endpoint}`;
  
  // Deduplicate simultaneous GET requests
  const cacheKey = method === 'GET' ? `${method}:${url}` : null;
  
  if (cacheKey && activeRequests.has(cacheKey)) {
    return activeRequests.get(cacheKey);
  }
  
  const promise = (async () => {
    const headers = {
      ...options.headers,
    };
    
    if (options.body instanceof FormData) {
      // Do not set Content-Type, browser will set it with the correct boundary
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }
    
    const config = {
      ...options,
      headers,
      credentials: 'include', // critical to pass express JWT session cookies back and forth
    };
    
    if (options.body) {
      if (options.body instanceof FormData) {
        config.body = options.body;
      } else if (typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
      }
    }
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data.data; // wraps response.data as per standard backend ApiResponse
    } catch (error) {
      console.error(`API Client Error in ${endpoint}:`, error.message);
      throw error;
    } finally {
      if (cacheKey) {
        activeRequests.delete(cacheKey);
      }
    }
  })();
  
  if (cacheKey) {
    activeRequests.set(cacheKey, promise);
  }
  
  return promise;
};

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

import api from '../services/api';

/**
 * Formats query parameters to match backend expectations
 * @param {Object} params - The parameters to format
 * @returns {Object} Formatted parameters
 */
const formatQueryParams = (params = {}) => {
  const formatted = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        formatted[key] = value.toString();
      } else if (typeof value === 'number') {
        formatted[key] = value.toString();
      } else if (Array.isArray(value)) {
        formatted[key] = value.join(',');
      } else {
        formatted[key] = value;
      }
    }
  });

  return formatted;
};

/**
 * Handles API errors consistently with detailed logging
 */
const handleApiError = (error, context) => {
  let errorMessage = 'Failed to process request';
  let statusCode = 500;

  if (error.response) {
    console.error(`Backend Error in ${context}:`, {
      status: error.response.status,
      url: error.config.url,
      baseURL: error.config.baseURL, // Log base URL for debugging
      params: error.config.params,
      data: error.response.data,
      headers: error.config.headers
    });

    statusCode = error.response.status;
    if (statusCode === 404) {
      errorMessage = 'API endpoint not found. Please check if the server is running or the endpoint is correct.';
    } else {
      errorMessage = error.response.data?.message || 
        `Request failed with status ${error.response.status}`;
    }
  } else if (error.request) {
    console.error(`Network Error in ${context}: No response received`, {
      request: error.request,
      baseURL: error.config.baseURL
    });
    errorMessage = 'Network error - no response from server';
  } else {
    console.error(`Request Error in ${context}:`, error.message);
    errorMessage = error.message;
  }

  const apiError = new Error(errorMessage);
  apiError.status = statusCode;
  throw apiError;
};

/**
 * Fetches properties with backend-compatible parameters
 */
export const getProperties = async (params = {}, retryCount = 1) => {
  try {
    const formattedParams = formatQueryParams(params);

    const response = await api.get('/properties', {
      params: formattedParams,
      paramsSerializer: {
        indexes: null,
        encode: (param) => encodeURIComponent(param).replace(/%2C/g, ',')
      }
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 404 && retryCount > 0) {
      console.warn(`Retrying request to /properties with params:`, params);
      return await getProperties(params, retryCount - 1); // Retry once
    }
    handleApiError(error, 'getProperties');
  }
};

/**
 * Fetches featured properties with validated parameters
 */
export const getFeaturedProperties = async (limit = 6) => {
  try {
    const response = await getProperties({
      limit,
      sort: '-rating.overall'
    });
    return response; // Return full response to handle data/meta structure
  } catch (error) {
    console.warn('Failed to fetch featured properties, returning empty array as fallback');
    return { data: [], meta: {} }; // Fallback to empty array to prevent UI crashes
  }
};

/**
 * Fetches a single property by ID
 */
export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `getPropertyById(${id})`);
  }
};

/**
 * Fetches nearby properties using geolocation
 */
export const getNearbyProperties = async (lat, lng, maxDistance = 50, limit = 6) => {
  try {
    const response = await api.get('/properties/nearby', {
      params: formatQueryParams({ lat, lng, maxDistance, limit })
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'getNearbyProperties');
  }
};

/**
 * Creates a new property
 */
export const createProperty = async (propertyData) => {
  try {
    const response = await api.post('/properties', propertyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'createProperty');
  }
};

/**
 * Updates an existing property
 */
export const updateProperty = async (id, updates) => {
  try {
    const response = await api.patch(`/properties/${id}`, updates);
    return response.data;
  } catch (error) {
    handleApiError(error, `updateProperty(${id})`);
  }
};

/**
 * Uploads property images with progress tracking
 */
export const uploadPropertyImages = async (id, images, options = {}) => {
  try {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    formData.append('replace', options.replace ? 'true' : 'false');

    const response = await api.post(`/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `uploadPropertyImages(${id})`);
  }
};

/**
 * Updates property availability
 */
export const updatePropertyAvailability = async (id, availability) => {
  try {
    const response = await api.patch(`/properties/${id}/availability`, availability);
    return response.data;
  } catch (error) {
    handleApiError(error, `updatePropertyAvailability(${id})`);
  }
};

/**
 * Deletes a property
 */
export const deleteProperty = async (id) => {
  try {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `deleteProperty(${id})`);
  }
};

// Export all methods as named exports
export const propertyAPI = {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  getNearbyProperties,
  createProperty,
  updateProperty,
  uploadPropertyImages,
  updatePropertyAvailability,
  deleteProperty
};

export default propertyAPI;
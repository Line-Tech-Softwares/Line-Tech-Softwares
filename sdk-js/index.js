const axios = require('axios');

/**
 * Line Tech API SDK for JavaScript
 * @class LineTechAPI
 */
class LineTechAPI {
  /**
   * Create a new LineTechAPI instance
   * @param {string} apiKey - Your API key
   * @param {string} baseURL - Base URL for the API (default: https://api.linetechsoftwares.co.za/v1/)
   */
  constructor(apiKey, baseURL = 'https://api.linetechsoftwares.co.za/v1/') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          throw new Error(`API Error: ${error.response.status} - ${error.response.data.error || error.response.statusText}`);
        } else if (error.request) {
          throw new Error('Network Error: Unable to connect to the API');
        } else {
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Get all users
   * @returns {Promise<Object>} Response containing users array
   */
  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} [userData.role] - User's role (default: 'user')
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData) {
    const response = await this.client.post('/users', userData);
    return response.data;
  }

  /**
   * Get all projects
   * @returns {Promise<Object>} Response containing projects array
   */
  async getProjects() {
    const response = await this.client.get('/projects');
    return response.data;
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @param {string} projectData.name - Project name
   * @param {string} [projectData.description] - Project description
   * @param {Array<string>} [projectData.technologies] - Project technologies
   * @returns {Promise<Object>} Created project data
   */
  async createProject(projectData) {
    const response = await this.client.post('/projects', projectData);
    return response.data;
  }

  /**
   * Authenticate and get access token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication response with token
   */
  async authenticate(email, password) {
    const response = await this.client.post('/auth/login', { email, password });
    // Update the authorization header with the new token
    this.client.defaults.headers['Authorization'] = `Bearer ${response.data.token}`;
    return response.data;
  }

  /**
   * Set a new API key/token
   * @param {string} apiKey - New API key or token
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.client.defaults.headers['Authorization'] = `Bearer ${apiKey}`;
  }

  /**
   * Get API health status
   * @returns {Promise<Object>} Health check response
   */
  async getHealth() {
    const response = await axios.get(`${this.baseURL.replace('/v1/', '')}/health`);
    return response.data;
  }
}

module.exports = { LineTechAPI };

// ES6 export for modern environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports.LineTechAPI = LineTechAPI;
}

// For browser environments
if (typeof window !== 'undefined') {
  window.LineTechAPI = LineTechAPI;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('auth-token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Habits API methods
  async getHabits() {
    return this.request('/api/habits');
  }

  async getHabit(id) {
    return this.request(`/api/habits/${id}`);
  }

  async createHabit(habitData) {
    return this.request('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  }

  async updateHabit(id, habitData) {
    return this.request(`/api/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habitData),
    });
  }

  async deleteHabit(id) {
    return this.request(`/api/habits/${id}`, {
      method: 'DELETE',
    });
  }

  async logHabit(id, logData) {
    return this.request(`/api/habits/${id}/log`, {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async getHabitLogs(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/habits/${id}/logs${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async deleteHabitLog(habitId, logId) {
    return this.request(`/api/habits/${habitId}/logs/${logId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
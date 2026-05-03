// ============================================
// EARNQUBE API CLIENT
// ============================================

class EarnqubeAPI {
  constructor() {
    this.baseURL = "http://localhost:3000/api";
    this.token = localStorage.getItem("token") || null;
    this.userId = localStorage.getItem("userId") || null;
    this.phone = localStorage.getItem("phone") || null;
  }

  setToken(token, userId, phone) {
    this.token = token;
    this.userId = userId;
    this.phone = phone;
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("phone", phone);
  }

  clearAuth() {
    this.token = null;
    this.userId = null;
    this.phone = null;
    localStorage.clear();
  }

  getHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(method, endpoint, data = null) {
    try {
      const options = {
        method,
        headers: this.getHeaders()
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Request failed");
      }

      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ==================== AUTH ====================
  async register(phone, name) {
    return this.request("POST", "/auth/register", { phone, name });
  }

  async activate(phone, provider, transactionId) {
    return this.request("POST", "/auth/activate", { phone, provider, transactionId });
  }

  async getUserProfile(userId) {
    return this.request("GET", `/auth/profile/${userId}`);
  }

  // ==================== TASKS ====================
  async getAllTasks() {
    return this.request("GET", "/tasks");
  }

  async getTasksByType(type) {
    return this.request("GET", `/tasks/by-type/${type}`);
  }

  async getSingleTask(taskId) {
    return this.request("GET", `/tasks/${taskId}`);
  }

  async completeTask(taskId, userId) {
    return this.request("POST", `/tasks/${taskId}/complete`, { userId });
  }

  // ==================== EARNINGS ====================
  async getEarningsSummary(userId) {
    return this.request("GET", `/earnings/summary/${userId}`);
  }

  async getEarningsHistory(userId, limit = 20, skip = 0) {
    return this.request("GET", `/earnings/history/${userId}?limit=${limit}&skip=${skip}`);
  }

  async requestWithdrawal(userId, amount, phone, provider) {
    return this.request("POST", "/earnings/withdraw", { userId, amount, phone, provider });
  }

  async dailyBonus(userId) {
    return this.request("POST", `/earnings/daily-bonus/${userId}`);
  }

  // ==================== PAYMENTS ====================
  async initiatePayment(phone, name, provider, transactionId, amount) {
    return this.request("POST", "/payment/pay", { phone, name, provider, transactionId, amount });
  }

  async checkPaymentStatus(transactionId) {
    return this.request("GET", `/payment/status/${transactionId}`);
  }

  // ==================== ADMIN ====================
  async getAdminStats() {
    return this.request("GET", "/admin/stats");
  }

  async getAllUsers() {
    return this.request("GET", "/admin/users");
  }

  async getSingleUser(userId) {
    return this.request("GET", `/admin/users/${userId}`);
  }

  async getAllTasks() {
    return this.request("GET", "/admin/tasks");
  }

  async createTask(taskData) {
    return this.request("POST", "/admin/tasks", taskData);
  }

  async updateTask(taskId, taskData) {
    return this.request("PUT", `/admin/tasks/${taskId}`, taskData);
  }

  async deleteTask(taskId) {
    return this.request("DELETE", `/admin/tasks/${taskId}`);
  }

  async getAllWithdrawals(status = null) {
    const query = status ? `?status=${status}` : "";
    return this.request("GET", `/admin/withdrawals${query}`);
  }

  async approveWithdrawal(withdrawalId) {
    return this.request("POST", `/admin/withdrawals/${withdrawalId}/approve`);
  }

  async rejectWithdrawal(withdrawalId, reason) {
    return this.request("POST", `/admin/withdrawals/${withdrawalId}/reject`, { reason });
  }
}

// Initialize API client globally
const api = new EarnqubeAPI();

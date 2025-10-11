import axios, { type AxiosInstance } from "axios"

interface ApiResponse<T = any> {
  data: T
  message?: string
  total?: number
  page?: number
  limit?: number
}

interface ExpenseFilters {
  status?: string
  category?: string
  submitterId?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  page?: number
  limit?: number
}

interface BudgetFilters {
  department?: string
  status?: string
  period?: string
}

interface UserFilters {
  role?: string
  department?: string
  status?: string
}

interface DepartmentFilters {
  status?: string
}

interface RoleFilters {
  status?: string
  hierarchy?: number
}

interface ApiClientProps {
  baseURL?: string;
}
class ApiClient {
  private client: AxiosInstance;

  constructor({ baseURL = "/api" }: ApiClientProps = {}) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Generic request method
  private request = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<T> => {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data,
        params,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  // Expenses API
  async getExpenses(filters?: ExpenseFilters): Promise<ApiResponse> {
    return this.request("GET", "/expenses", undefined, filters);
  }

  async getExpense(id: string): Promise<ApiResponse> {
    return this.request("GET", `/expenses/${id}`);
  }

  async createExpense(data: any): Promise<ApiResponse> {
    return this.request("POST", "/expenses", data);
  }

  async updateExpense(id: string, data: any): Promise<ApiResponse> {
    return this.request("PUT", `/expenses/${id}`, data);
  }

  async deleteExpense(id: string): Promise<ApiResponse> {
    return this.request("DELETE", `/expenses/${id}`);
  }

  async approveExpense(id: string, comment?: string): Promise<ApiResponse> {
    return this.request("POST", `/expenses/${id}/approve`, { comment });
  }

  async rejectExpense(id: string, comment: string): Promise<ApiResponse> {
    return this.request("POST", `/expenses/${id}/reject`, { comment });
  }

  async bulkApproveExpenses(data: {
    expenseIds?: string[];
    criteria?: any;
    comment?: string;
  }): Promise<ApiResponse> {
    return this.request("POST", "/expenses/bulk-approve", data);
  }

  async exportExpenses(
    format: "csv" | "excel" | "pdf",
    filters?: ExpenseFilters
  ): Promise<Blob> {
    const response = await this.client.get("/expenses/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  }

  // Budgets API
  async getBudgets(filters?: BudgetFilters): Promise<ApiResponse> {
    return this.request("GET", "/budgets", undefined, filters);
  }

  async getBudget(id: string): Promise<ApiResponse> {
    return this.request("GET", `/budgets/${id}`);
  }

  async createBudget(data: any): Promise<ApiResponse> {
    return this.request("POST", "/budgets", data);
  }

  async updateBudget(id: string, data: any): Promise<ApiResponse> {
    return this.request("PUT", `/budgets/${id}`, data);
  }

  async deleteBudget(id: string): Promise<ApiResponse> {
    return this.request("DELETE", `/budgets/${id}`);
  }

  async getBudgetAnalytics(id: string): Promise<ApiResponse> {
    return this.request("GET", `/budgets/${id}/analytics`);
  }

  // Categories API
  async getCategories(): Promise<ApiResponse> {
    return this.request("GET", "/finance/expenses/categories");
  }

  async createCategory(data: any): Promise<ApiResponse> {
    return this.request("POST", "/categories", data);
  }

  async updateCategory(id: string, data: any): Promise<ApiResponse> {
    return this.request("PUT", `/categories/${id}`, data);
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    return this.request("DELETE", `/categories/${id}`);
  }

  // Users API
  async getUsers(filters?: UserFilters): Promise<ApiResponse> {
    return this.request("GET", "/users", undefined, filters);
  }

  async getUser(id: string): Promise<ApiResponse> {
    return this.request("GET", `/users/${id}`);
  }

  async updateUser(id: string, data: any): Promise<ApiResponse> {
    return this.request("PUT", `/users/${id}`, data);
  }

  // Departments API
  async getDepartments(filters?: DepartmentFilters): Promise<ApiResponse> {
    return this.request("GET", "/departments", undefined, filters);
  }

  async getDepartment(id: string): Promise<ApiResponse> {
    return this.request("GET", `/departments/${id}`);
  }

  async createDepartment(data: any): Promise<ApiResponse> {
    return this.request("POST", "/departments", data);
  }

  async updateDepartment(id: string, data: any): Promise<ApiResponse> {
    return this.request("PUT", `/departments/${id}`, data);
  }

  async deleteDepartment(id: string): Promise<ApiResponse> {
    return this.request("DELETE", `/departments/${id}`);
  }

  // Delegations API
  async getDelegations(): Promise<ApiResponse> {
    return this.request("GET", "/delegations");
  }

  async createDelegation(data: any): Promise<ApiResponse> {
    return this.request("POST", "/delegations", data);
  }

  async updateDelegation(id: string, data: any): Promise<ApiResponse> {
    return this.request("PUT", `/delegations/${id}`, data);
  }

  async deleteDelegation(id: string): Promise<ApiResponse> {
    return this.request("DELETE", `/delegations/${id}`);
  }

  // Dashboard API
  async getDashboardStats(): Promise<ApiResponse> {
    return this.request("GET", "/dashboard/stats");
  }

  async getRecentActivity(): Promise<ApiResponse> {
    return this.request("GET", "/dashboard/activity");
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request("POST", "/auth/login", { email, password });
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request("GET", "/auth/me");
  }

  // Roles API
  async getRoles(filters?: RoleFilters): Promise<ApiResponse> {
    return this.request("GET", "/roles", undefined, filters);
  }

  async getRole(id: string): Promise<ApiResponse> {
    return this.request("GET", `/roles/${id}`);
  }

  async createRole(data: any): Promise<ApiResponse> {
    return this.request("POST", "/roles", data);
  }

  async updateRole(id: string, data: any): Promise<ApiResponse> {
    return this.request("PUT", `/roles/${id}`, data);
  }

  async deleteRole(id: string): Promise<ApiResponse> {
    return this.request("DELETE", `/roles/${id}`);
  }

  // Member Operations API
  async addMemberToDepartment(data: {
    userId: string;
    department: string;
    role?: string;
    startDate?: string;
  }): Promise<ApiResponse> {
    return this.request("POST", "/member-operations/add", data);
  }

  async removeMemberFromDepartment(data: {
    userId: string;
    department: string;
  }): Promise<ApiResponse> {
    return this.request("POST", "/member-operations/remove", data);
  }

  async transferMember(data: {
    userId: string;
    fromDepartment: string;
    toDepartment: string;
    reason: string;
    effectiveDate?: string;
  }): Promise<ApiResponse> {
    return this.request("POST", "/member-operations/transfer", data);
  }

  async bulkMemberOperation(data: {
    operation: "add" | "remove" | "transfer";
    selectedUsers: string[];
    targetDepartment: string;
    sourceDepartment?: string;
    reason: string;
  }): Promise<ApiResponse> {
    return this.request("POST", "/member-operations/bulk", data);
  }

  async getMemberOperationHistory(filters?: {
    userId?: string;
    department?: string;
  }): Promise<ApiResponse> {
    return this.request(
      "GET",
      "/member-operations/history",
      undefined,
      filters
    );
  }
}


const createApiClient = (baseURL?: string) => {
  return new ApiClient({ baseURL });
};

export const apiClient = createApiClient(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api`
);

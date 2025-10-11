import axios, { type AxiosInstance } from "axios";

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

interface ExpenseFilters {
  status?: string;
  category?: string;
  submitterId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

interface BudgetFilters {
  department?: string;
  status?: string;
  period?: string;
}

interface UserFilters {
  role?: string;
  department?: string;
  status?: string;
}

interface DepartmentFilters {
  status?: string;
}

interface RoleFilters {
  status?: string;
  hierarchy?: number;
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

  // Helper method to build organization-specific endpoints
  private buildEndpoint(organizationId: string, endpoint: string): string {
    return `/organizations/${organizationId}${endpoint}`;
  }

  // Generic request method
  private request = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    organizationId: string,
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<T> => {
    try {
      const organizationEndpoint = this.buildEndpoint(organizationId, endpoint);
      const response = await this.client.request({
        method,
        url: organizationEndpoint,
        data,
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  // Expenses API
  async getExpenses(
    organizationId: string,
    filters?: ExpenseFilters
  ): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/expenses", undefined, filters);
  }

  async getExpense(organizationId: string, id: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, `/expenses/${id}`);
  }

  async createExpense(organizationId: string, data: any): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/expenses", data);
  }

  async updateExpense(
    organizationId: string,
    id: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("PUT", organizationId, `/expenses/${id}`, data);
  }

  async deleteExpense(
    organizationId: string,
    id: string
  ): Promise<ApiResponse> {
    return this.request("DELETE", organizationId, `/expenses/${id}`);
  }

  async approveExpense(
    organizationId: string,
    id: string,
    comment?: string
  ): Promise<ApiResponse> {
    return this.request("POST", organizationId, `/expenses/${id}/approve`, {
      comment,
    });
  }

  async rejectExpense(
    organizationId: string,
    id: string,
    comment: string
  ): Promise<ApiResponse> {
    return this.request("POST", organizationId, `/expenses/${id}/reject`, {
      comment,
    });
  }

  async bulkApproveExpenses(
    organizationId: string,
    data: {
      expenseIds?: string[];
      criteria?: any;
      comment?: string;
    }
  ): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/expenses/bulk-approve", data);
  }

  async exportExpenses(
    organizationId: string,
    format: "csv" | "excel" | "pdf",
    filters?: ExpenseFilters
  ): Promise<Blob> {
    const organizationEndpoint = this.buildEndpoint(
      organizationId,
      "/expenses/export"
    );
    const response = await this.client.get(organizationEndpoint, {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  }

  // Budgets API
  async getBudgets(
    organizationId: string,
    filters?: BudgetFilters
  ): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/budgets", undefined, filters);
  }

  async getBudget(organizationId: string, id: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, `/budgets/${id}`);
  }

  async createBudget(organizationId: string, data: any): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/budgets", data);
  }

  async updateBudget(
    organizationId: string,
    id: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("PUT", organizationId, `/budgets/${id}`, data);
  }

  async deleteBudget(organizationId: string, id: string): Promise<ApiResponse> {
    return this.request("DELETE", organizationId, `/budgets/${id}`);
  }

  async getBudgetAnalytics(
    organizationId: string,
    id: string
  ): Promise<ApiResponse> {
    return this.request("GET", organizationId, `/budgets/${id}/analytics`);
  }

  // Categories API
  async getCategories(organizationId: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/finance/expenses/categories");
  }

  async createCategory(
    organizationId: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/categories", data);
  }

  async updateCategory(
    organizationId: string,
    id: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("PUT", organizationId, `/categories/${id}`, data);
  }

  async deleteCategory(
    organizationId: string,
    id: string
  ): Promise<ApiResponse> {
    return this.request("DELETE", organizationId, `/categories/${id}`);
  }

  // Users API
  async getUsers(
    organizationId: string,
    filters?: UserFilters
  ): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/users", undefined, filters);
  }

  async getUser(organizationId: string, id: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, `/users/${id}`);
  }

  async updateUser(
    organizationId: string,
    id: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("PUT", organizationId, `/users/${id}`, data);
  }

  // Departments API
  async getDepartments(
    organizationId: string,
    filters?: DepartmentFilters
  ): Promise<ApiResponse> {
    return this.request(
      "GET",
      organizationId,
      "/departments",
      undefined,
      filters
    );
  }

  async getDepartment(
    organizationId: string,
    id: string
  ): Promise<ApiResponse> {
    return this.request("GET", organizationId, `/departments/${id}`);
  }

  async createDepartment(
    organizationId: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/departments", data);
  }

  async updateDepartment(
    organizationId: string,
    id: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("PUT", organizationId, `/departments/${id}`, data);
  }

  async deleteDepartment(
    organizationId: string,
    id: string
  ): Promise<ApiResponse> {
    return this.request("DELETE", organizationId, `/departments/${id}`);
  }

  // Delegations API
  async getDelegations(organizationId: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/delegations");
  }

  async createDelegation(
    organizationId: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/delegations", data);
  }

  async updateDelegation(
    organizationId: string,
    id: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("PUT", organizationId, `/delegations/${id}`, data);
  }

  async deleteDelegation(
    organizationId: string,
    id: string
  ): Promise<ApiResponse> {
    return this.request("DELETE", organizationId, `/delegations/${id}`);
  }

  // Dashboard API
  async getDashboardStats(organizationId: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/dashboard/stats");
  }

  async getRecentActivity(organizationId: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/dashboard/activity");
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request("POST", "", "/auth/login", { email, password });
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request("GET", "", "/auth/me");
  }

  // Roles API
  async getRoles(
    organizationId: string,
    filters?: RoleFilters
  ): Promise<ApiResponse> {
    return this.request("GET", organizationId, "/roles", undefined, filters);
  }

  async getRole(organizationId: string, id: string): Promise<ApiResponse> {
    return this.request("GET", organizationId, `/roles/${id}`);
  }

  async createRole(organizationId: string, data: any): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/roles", data);
  }

  async updateRole(
    organizationId: string,
    id: string,
    data: any
  ): Promise<ApiResponse> {
    return this.request("PUT", organizationId, `/roles/${id}`, data);
  }

  async deleteRole(organizationId: string, id: string): Promise<ApiResponse> {
    return this.request("DELETE", organizationId, `/roles/${id}`);
  }

  // Member Operations API
  async addMemberToDepartment(
    organizationId: string,
    data: {
      userId: string;
      department: string;
      role?: string;
      startDate?: string;
    }
  ): Promise<ApiResponse> {
    return this.request("POST", organizationId, "/member-operations/add", data);
  }

  async removeMemberFromDepartment(
    organizationId: string,
    data: {
      userId: string;
      department: string;
    }
  ): Promise<ApiResponse> {
    return this.request(
      "POST",
      organizationId,
      "/member-operations/remove",
      data
    );
  }

  async transferMember(
    organizationId: string,
    data: {
      userId: string;
      fromDepartment: string;
      toDepartment: string;
      reason: string;
      effectiveDate?: string;
    }
  ): Promise<ApiResponse> {
    return this.request(
      "POST",
      organizationId,
      "/member-operations/transfer",
      data
    );
  }

  async bulkMemberOperation(
    organizationId: string,
    data: {
      operation: "add" | "remove" | "transfer";
      selectedUsers: string[];
      targetDepartment: string;
      sourceDepartment?: string;
      reason: string;
    }
  ): Promise<ApiResponse> {
    return this.request(
      "POST",
      organizationId,
      "/member-operations/bulk",
      data
    );
  }

  async getMemberOperationHistory(
    organizationId: string,
    filters?: {
      userId?: string;
      department?: string;
    }
  ): Promise<ApiResponse> {
    return this.request(
      "GET",
      organizationId,
      "/member-operations/history",
      undefined,
      filters
    );
  }
}

// Export a function to create API client instances
export const createApiClient = (baseURL?: string) => {
  return new ApiClient({ baseURL });
};

// Remove the default apiClient export since we'll create instances per hook
export const apiClient = createApiClient(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api`
);

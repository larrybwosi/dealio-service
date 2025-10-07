import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiClient,
  ApiResponse,
  ReceiptResponse,
  SalesReportCriteria,
  SalesReportResponse,
  useOrgStore,
} from '@/lib/tanstack-axios';
import { PaymentStatus, Sale, PaymentMethod } from '@/prisma/client';
import { toast } from 'sonner';


// Sales CRUD Operations

export const useListSales = (
  filters?: {
    search?: string;
    paymentMethod?: PaymentMethod;
    paymentStatus?: PaymentStatus;
    dateRange?: string;
  },
  options?: {
    page?: number;
    pageSize?: number;
  }
) => {
  const organizationId = useOrgStore(state => state.organizationId);
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 10;

  return useQuery<
    {
      sales: Sale[];
      totalCount: number;
    },
    Error
  >({
    queryKey: ['sales', organizationId, filters, page, pageSize], // Include pagination in queryKey
    queryFn: () => {
      return apiClient.sales.list(organizationId!, page, pageSize, filters);
    },
    enabled: !!organizationId,
  });
};


export const useListVoidedSales = (
  filters?: {
    search?: string;
    paymentMethod?: PaymentMethod;
    dateRange?: string;
  },
  options?: {
    page?: number;
    pageSize?: number;
  }
) => {
  const organizationId = useOrgStore(state => state.organizationId);
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 10;

  return useQuery<
    {
      sales: any[]; // Adjust type as needed based on your Sale type
      totalCount: number;
    },
    Error
  >({
    queryKey: ['voided-sales', organizationId, filters, page, pageSize],
    queryFn: () => {
      return apiClient.sales.listVoided(organizationId!, page, pageSize, filters);
    },
    enabled: !!organizationId,
  });
};
export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<Sale>, Error, Partial<Sale>>({
    mutationFn: data => apiClient.sales.create(organizationId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', organizationId] });
    },
    //eslint-disable-next-line
    onError: (error: any) => {
      const message = error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred';
      toast.error("Failed to create sale",{ description: message, duration: 5000});
      queryClient.invalidateQueries({ queryKey: ['sales', organizationId] });
    },
  });
};

export const useGetSale = (saleId: string) => {
  const organizationId = useOrgStore(state => state.organizationId);
  return useQuery<ApiResponse<Sale>, Error>({
    queryKey: ['sale', organizationId, saleId],
    queryFn: () => apiClient.sales.get(organizationId!, saleId),
    enabled: !!organizationId && !!saleId,
  });
};

export interface SalesSummary {
  totalRevenue: number;
  salesCount: number;
  totalTax: number;
  totalDiscount: number;
  totalProfit: number;
  itemsSold: number;
  uniqueCustomers: number;
  averageSaleValue: number;
  salesGrowth: number;
}


export function useSalesSummary(dateRange?: string) {
  const organizationId = useOrgStore(state => state.organizationId);
  return useQuery<SalesSummary>({
    queryKey: ['salesSummary', dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange) params.append('dateRange', dateRange);

      const response = await apiClient.sales.summary(organizationId!, params.toString());

      return response.data;
    },
  });
}


export const useUpdateSale = (saleId: string) => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<Sale>, Error, Partial<Sale>>({
    mutationFn: data => apiClient.sales.update(organizationId!, saleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['sale', organizationId, saleId] });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  const organizationId = useOrgStore(state => state.organizationId);

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: saleId => apiClient.sales.delete(organizationId!, saleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales', organizationId] });
    },
  });
};

// Sales Receipts
export const useGenerateReceipt = (saleId: string) => {
  const organizationId = useOrgStore(state => state.organizationId);
  return useMutation<ApiResponse<ReceiptResponse>, Error>({
    mutationFn: () => apiClient.sales.generateReceipt(organizationId!, saleId),
  });
};

export const useGetReceipt = (saleId: string) => {
  const organizationId = useOrgStore(state => state.organizationId);
  return useQuery<ApiResponse<ReceiptResponse>, Error>({
    queryKey: ['receipt', organizationId, saleId],
    queryFn: () => apiClient.sales.getReceipt(organizationId!, saleId),
    enabled: !!organizationId && !!saleId,
  });
};

// Sales Reports
export const useGenerateSalesReport = () => {
  const organizationId = useOrgStore(state => state.organizationId);
  return useMutation<ApiResponse<SalesReportResponse>, Error, SalesReportCriteria>({
    mutationFn: criteria => apiClient.sales.generateReport(organizationId!, criteria),
  });
};

export const useExportSalesData = () => {
  const organizationId = useOrgStore(state => state.organizationId);
  return useMutation<ApiResponse<Blob>, Error, SalesReportCriteria>({
    mutationFn: criteria => apiClient.sales.export(organizationId!, criteria),
  });
};
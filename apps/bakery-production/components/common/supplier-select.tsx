import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle, Users } from 'lucide-react';
import { useListSuppliers } from '@/hooks/suppliers';

interface Supplier {
  id: string;
  name: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

interface SupplierSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const SupplierSelect: React.FC<SupplierSelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select a supplier',
  disabled = false,
  required = false,
}) => {
  const { data: suppliers, isLoading: loadingSuppliers, error } = useListSuppliers();

  if (loadingSuppliers) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <p className="text-sm text-muted-foreground">Loading suppliers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load suppliers. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Alert variant="default">
        <Users className="h-4 w-4" />
        <AlertDescription>No suppliers available.</AlertDescription>
      </Alert>
    );
  }

  // Helper function to format contact information
  const formatContactInfo = (supplier: Supplier): string => {
    if (supplier.contactInfo) {
      const { email, phone } = supplier.contactInfo;
      return [email, phone].filter(Boolean).join(' • ');
    }
    return '';
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || suppliers.length === 0}
      required={required}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {suppliers.map(supplier => (
          <SelectItem key={supplier.id} value={supplier.id}>
            <div className="flex flex-col">
              <span className="font-medium">{supplier.name}</span>
              {supplier.contactInfo && (
                <span className="text-sm text-muted-foreground">{formatContactInfo(supplier)}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle, Package } from 'lucide-react';
import { useProductVariants } from './products';


interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  productType: ProductType;
  location?: {
    id: string;
    name: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
  // Add other variant properties as needed
}

interface ProductVariantsSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  productType: ProductType;
  includeLocation?: boolean;
  showLocationInfo?: boolean;
  excludeVariant?: string;
}

export const ProductVariantsSelect: React.FC<ProductVariantsSelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select a product variant',
  disabled = false,
  required = false,
  productType,
  includeLocation = true,
  showLocationInfo = true,
  excludeVariant,
}) => {
  const {
    data: productVariants,
    isLoading: loadingProductVariants,
    error,
  } = useProductVariants({
    includeLocation,
    isActive: true,
    productType,
  });

  if (loadingProductVariants) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <p className="text-sm text-muted-foreground">Loading product variants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load product variants. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!productVariants || productVariants.length === 0) {
    return (
      <Alert variant="default">
        <Package className="h-4 w-4" />
        <AlertDescription>No {productType.toLowerCase().replace('_', ' ')} variants available.</AlertDescription>
      </Alert>
    );
  }

  // Filter out the excluded variant if provided
  const filteredVariants = excludeVariant
    ? productVariants.filter(variant => variant.id !== excludeVariant)
    : productVariants;

  // Helper function to format location info
  const formatLocationInfo = (variant: ProductVariant): string => {
    if (!variant.location) return 'No location assigned';

    const location = variant.location;
    if (location.address) {
      const { street, city, state, country, zipCode } = location.address;
      const parts = [street, city, state, zipCode, country].filter(Boolean);
      return parts.join(', ');
    }

    return location.name;
  };

  // Helper function to get display name for variant
  const getVariantDisplayName = (variant: ProductVariant): string => {
    return variant.name || variant.sku;
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || filteredVariants.length === 0}
      required={required}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredVariants.map(variant => (
          <SelectItem key={variant.id} value={variant.id}>
            <div className="flex flex-col">
              <span className="font-medium">{getVariantDisplayName(variant)}</span>
              <span className="text-sm text-muted-foreground">SKU: {variant.sku}</span>
              {showLocationInfo && variant.location && (
                <span className="text-xs text-muted-foreground mt-1">Location: {formatLocationInfo(variant)}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle, MapPin } from 'lucide-react';
import { useListLocations } from '../../hooks/locations';

interface Location {
  id: string;
  name: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  city?: string; // Fallback for backward compatibility
  country?: string; // Fallback for backward compatibility
}

interface LocationSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  excludeLocation?: string;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select a location',
  disabled = false,
  required = false,
  excludeLocation,
}) => {
  const { data: locations, isLoading: loadingLocations, error } = useListLocations();

  if (loadingLocations) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <p className="text-sm text-muted-foreground">Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load locations. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <Alert variant="default">
        <MapPin className="h-4 w-4" />
        <AlertDescription>No locations available.</AlertDescription>
      </Alert>
    );
  }

  // Filter out the excluded location if provided
  const filteredLocations = excludeLocation ? locations.filter(location => location.id !== excludeLocation) : locations;

  // Helper function to format address
  const formatAddress = (location: Location): string => {
    if (location.address) {
      const { street, city, state, country, zipCode } = location.address;
      const parts = [street, city, state, zipCode, country].filter(Boolean);
      return parts.join(', ');
    }

    // Fallback for old structure
    const parts = [location.city, location.country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || filteredLocations.length === 0}
      required={required}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredLocations.map(location => (
          <SelectItem key={location.id} value={location.id}>
            <div className="flex flex-col">
              <span className="font-medium">{location.name}</span>
              <span className="text-sm text-muted-foreground">{formatAddress(location)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

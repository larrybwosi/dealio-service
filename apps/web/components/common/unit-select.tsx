// components/common/UnitSelect.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Label } from '@workspace/ui/components/label';
import { UnitType } from '@/types';
import { useBusinessUnits, useUnits } from '@/hooks/units';

interface UnitSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  placeholder?: string;
  showLabel?: boolean;
  error?: string;
  className?: string;

  // New flexible props
  businessType?: 'bakery' | 'restaurant' | 'retail' | 'pharmacy';
  unitType?: UnitType; // Filter by specific type (COUNT, WEIGHT, VOLUME)
  includeStandard?: boolean; // Whether to include standard units
  allowedTypes?: UnitType[]; // Allow multiple specific types
}

export function UnitSelect({
  value,
  onValueChange,
  disabled = false,
  label = 'Unit',
  required = false,
  placeholder = 'Select unit',
  showLabel = true,
  error,
  className,
  businessType,
  unitType,
  includeStandard = false,
  allowedTypes,
}: UnitSelectProps) {
  // Call both hooks unconditionally
  const businessUnitsResult = useBusinessUnits(businessType || 'retail', unitType, includeStandard);
  const unitsResult = useUnits({ type: unitType, includeStandard });

  // Use the appropriate result based on businessType
  const {
    units,
    isLoading,
    error: unitsError,
  } = businessType ? businessUnitsResult : unitsResult;

  // Filter and group units with loading and error states
  const { groupedUnits, isLoading: unitsLoading } = (() => {
    if (isLoading) {
      return { groupedUnits: null, isLoading: true };
    }

    if (unitsError || !units) {
      return { groupedUnits: null, isLoading: false };
    }

    // Apply allowedTypes filter if specified
    let filteredUnits = units;
    if (allowedTypes && allowedTypes.length > 0) {
      filteredUnits = units.filter(unit => allowedTypes.includes(unit.type));
    }

    // Group by type
    const grouped = filteredUnits.reduce(
      (groups, unit) => {
        const groupKey = unit.type === 'COUNT' ? 'COUNT' : unit.type === 'WEIGHT' ? 'WEIGHT' : 'VOLUME';

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(unit);
        return groups;
      },
      {} as Record<string, typeof filteredUnits>
    );

    return { groupedUnits: grouped, isLoading: false };
  })();

  // Get default unit ID when units are loaded
  const getDefaultUnitId = () => {
    if (!groupedUnits) return '';

    // If allowedTypes specified, prefer first type in that list
    if (allowedTypes && allowedTypes.length > 0) {
      for (const type of allowedTypes) {
        const groupKey = type === 'COUNT' ? 'COUNT' : type === 'WEIGHT' ? 'WEIGHT' : 'VOLUME';
        if (groupedUnits[groupKey]?.length) {
          return groupedUnits[groupKey][0].id;
        }
      }
    }

    // Default preference: weight -> volume -> count
    if (groupedUnits.WEIGHT?.length) {
      return groupedUnits.WEIGHT[0].id;
    }
    if (groupedUnits.VOLUME?.length) {
      return groupedUnits.VOLUME[0].id;
    }
    if (groupedUnits.COUNT?.length) {
      return groupedUnits.COUNT[0].id;
    }
    return '';
  };

  const renderSelectContent = () => {
    if (unitsLoading) {
      return <span className="text-gray-500">Loading units...</span>;
    }

    if (unitsError) {
      return <span className="text-red-500">Failed to load units</span>;
    }

    if (!groupedUnits || Object.keys(groupedUnits).length === 0) {
      return <span className="text-gray-500">No units available</span>;
    }

    // Determine which groups to show based on allowedTypes
    const groupsToShow =
      allowedTypes && allowedTypes.length > 0
        ? allowedTypes.map(type => (type === 'COUNT' ? 'COUNT' : type === 'WEIGHT' ? 'WEIGHT' : 'VOLUME'))
        : ['WEIGHT', 'VOLUME', 'COUNT'];

    return (
      <SelectContent>
        {/* Weight Units */}
        {groupsToShow.includes('WEIGHT') && groupedUnits.WEIGHT && groupedUnits.WEIGHT.length > 0 && (
          <div className={groupsToShow.length > 1 ? 'border-b border-gray-200 pb-1 mb-1' : ''}>
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Weight</div>
            {groupedUnits.WEIGHT.map(unit => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </SelectItem>
            ))}
          </div>
        )}

        {/* Volume Units */}
        {groupsToShow.includes('VOLUME') && groupedUnits.VOLUME && groupedUnits.VOLUME.length > 0 && (
          <div
            className={
              groupsToShow.indexOf('VOLUME') < groupsToShow.length - 1 ? 'border-b border-gray-200 pb-1 mb-1' : ''
            }
          >
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Volume</div>
            {groupedUnits.VOLUME.map(unit => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </SelectItem>
            ))}
          </div>
        )}

        {/* Count Units */}
        {groupsToShow.includes('COUNT') && groupedUnits.COUNT && groupedUnits.COUNT.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Count</div>
            {groupedUnits.COUNT.map(unit => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </SelectItem>
            ))}
          </div>
        )}
      </SelectContent>
    );
  };

  return (
    <div className={className}>
      {showLabel && (
        <Label htmlFor="unit-select">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled || unitsLoading || !groupedUnits}>
        <SelectTrigger id="unit-select" className={showLabel ? 'mt-1' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {renderSelectContent()}
      </Select>

      {/* Loading and error states */}
      {unitsLoading && <p className="text-xs text-gray-500 mt-1">Loading available units...</p>}
      {unitsError && <p className="text-xs text-red-500 mt-1">Error loading units. Please try again.</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

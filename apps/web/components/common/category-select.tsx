import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle, Tag, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useListCategories } from '@/hooks/categories';

interface CategorySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  excludeCategory?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select a category',
  disabled = false,
  required = false,
  excludeCategory,
}) => {
  const router = useRouter();
  const { data: categories, isLoading: loadingCategories, error } = useListCategories();
  console.log(categories)

  const handleCreateCategory = () => {
    // router.push('/categories?create=true'); 
  };

  if (loadingCategories) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load categories. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Alert variant="default" className="cursor-pointer" onClick={handleCreateCategory}>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-1">
            No categories available.
            <span className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700">
              <Plus className="h-3 w-3" />
              Create one now
            </span>
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  // Filter out the excluded category if provided
  const filteredCategories = excludeCategory
    ? categories.filter(category => category.id !== excludeCategory)
    : categories;

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || filteredCategories.length === 0}
      required={required}
    >
      <SelectTrigger className="">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredCategories.map(category => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-sm border border-muted-foreground/20"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
            </div>
          </SelectItem>
        ))}
        {/* Add create new category option */}
        <div
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          onClick={handleCreateCategory}
        >
          <div className="flex items-center gap-3 px-2 py-1 w-full">
            <div className="h-3 w-3 rounded-sm border border-dashed border-muted-foreground/40 flex items-center justify-center">
              <Plus className="h-2 w-2 text-muted-foreground" />
            </div>
            <span className="font-medium text-muted-foreground">Create new category</span>
          </div>
        </div>
      </SelectContent>
    </Select>
  );
};

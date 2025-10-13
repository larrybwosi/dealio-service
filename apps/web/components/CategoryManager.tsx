import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Badge } from '@workspace/ui/components/badge';
import { BakeryCategory } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  ChefHat,
  BookOpen,
  File,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  FolderOpen,
} from 'lucide-react';
import {
  useCreateBakeryCategory,
  useUpdateBakeryCategory,
  useDeleteBakeryCategory,
  useBakeryCategories,
} from '@/hooks/use-bakery';
import { z } from 'zod';
import { useDeleteConfirmation } from '@/components/delete-modal-provider';

// Validation schema for bakery category
const bakeryCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

type BakeryCategoryFormData = z.infer<typeof bakeryCategorySchema>;

interface EditCategoryDialogProps {
  category: BakeryCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: BakeryCategoryFormData) => void;
  isSubmitting?: boolean;
}

function EditCategoryDialog({ category, open, onOpenChange, onSave, isSubmitting }: EditCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BakeryCategoryFormData>({
    resolver: zodResolver(bakeryCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
    },
  });

  const onSubmit = (data: BakeryCategoryFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Edit className="h-5 w-5" />
            Edit Category
          </DialogTitle>
          <DialogDescription>Update the category information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter category name"
              disabled={isSubmitting}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of what this category contains..."
              rows={3}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-24 bg-gray-900 hover:bg-gray-800">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Skeleton Loader Components
function CategoryCardSkeleton() {
  return (
    <Card className="bg-background border border-gray-200 animate-pulse">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-5 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="bg-background border border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load categories</h3>
        <p className="text-gray-500 mb-4 max-w-sm">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function CategoryManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BakeryCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories, isLoading, error, refetch } = useBakeryCategories();
  const createCategoryMutation = useCreateBakeryCategory();
  const updateCategoryMutation = useUpdateBakeryCategory();
  const deleteCategoryMutation = useDeleteBakeryCategory();
  const {confirmDelete} = useDeleteConfirmation()

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors },
    reset: resetCreateForm,
  } = useForm<BakeryCategoryFormData>({
    resolver: zodResolver(bakeryCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const filteredCategories = categories?.filter(
    category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateCategory = async (data: BakeryCategoryFormData) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      resetCreateForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async (data: BakeryCategoryFormData) => {
    if (!editingCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        data,
      });

      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = await confirmDelete({
      entityType: 'item',
      confirmText: 'Are you sure you want to delete this category?',
      title:'Delete Category'
    });
    if (!confirmed) {
      return;
    }
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const getCategoryStats = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);

    if (category?.recipes !== undefined && category?.templates !== undefined && category?.batches !== undefined) {
      return {
        recipes: category.recipes.length,
        templates: category.templates.length,
        batches: category.batches.length,
      };
    }
  };

  const isCreating = createCategoryMutation.isPending;
  const isUpdating = updateCategoryMutation.isPending;
  const isDeleting = deleteCategoryMutation.isPending;

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Search Skeleton */}
        <div className="h-10 bg-gray-200 rounded w-80 animate-pulse"></div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
            <p className="text-gray-600">Organize your bakery items by categories</p>
          </div>
          <Button disabled className="bg-gray-900 opacity-50">
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
        <ErrorState message="Failed to load categories. Please try again." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="h-6 w-6" />
            Category Management
          </h2>
          <p className="text-gray-600 mt-1">Organize your bakery items by categories</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-900 hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5" />
                Create New Category
              </DialogTitle>
              <DialogDescription>Add a new category to organize your bakery items</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit(handleCreateCategory)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="create-name" className="text-sm font-medium">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-name"
                  {...registerCreate('name')}
                  placeholder="e.g., Breads, Pastries, Cakes"
                  disabled={isCreating}
                  className={createErrors.name ? 'border-red-500' : ''}
                />
                {createErrors.name && <p className="text-sm text-red-500 mt-1">{createErrors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="create-description"
                  {...registerCreate('description')}
                  placeholder="Brief description of what this category contains..."
                  rows={3}
                  disabled={isCreating}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                  className="min-w-24"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating} className="min-w-24 bg-gray-900 hover:bg-gray-800">
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search categories by name or description..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories?.map(category => {
          const stats = getCategoryStats(category.id);
          return (
            <Card key={category.id} className="bg-background border border-gray-200 hover:border-gray-300 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 min-w-0 flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ChefHat className="h-5 w-5 text-gray-600 flex-shrink-0" />
                      <span className="truncate">{category.name}</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {category.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                      disabled={isUpdating || isDeleting}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-lg font-bold text-blue-600">{stats?.recipes || 0}</div>
                      <div className="text-xs text-gray-600">Recipes</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <File className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-lg font-bold text-green-600">{stats?.templates || 0}</div>
                      <div className="text-xs text-gray-600">Templates</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-lg font-bold text-purple-600">{stats?.batches || 0}</div>
                      <div className="text-xs text-gray-600">Batches</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCategories?.length === 0 && (
        <Card className="bg-background border border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              {searchTerm
                ? "Try adjusting your search terms to find what you're looking for."
                : 'Get started by creating your first category to organize your bakery items.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-gray-900 hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Category Dialog */}
      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={open => !open && setEditingCategory(null)}
          onSave={handleUpdateCategory}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  );
}

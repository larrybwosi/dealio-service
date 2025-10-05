import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Recipe } from '@/types/bakery';
import { Plus, Edit, Eye, Clock, ChefHat, Thermometer, AlertCircle, RefreshCw } from 'lucide-react';
import CreateEditRecipeDialog from './RecipeForm';
import ViewRecipeDialog from './ViewRecipe';
import { useRecipes } from '@/lib/hooks/use-bakery';
import { useFormattedCurrency } from '@/lib/utils';

export default function RecipeManager() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: recipes = [], isLoading, error, refetch } = useRecipes();
  const formattedCurrency = useFormattedCurrency()

  const filteredRecipes = recipes.filter(
    recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateRecipeCost = (ingredients: Recipe['ingredients']) => {
    return ingredients.reduce((total, ingredient) => {
      return total + ingredient.quantity * ingredient.ingredientVariant.buyingPrice;
    }, 0);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsEditDialogOpen(true);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsViewDialogOpen(true);
  };

  // Loading skeleton component
  const RecipeCardSkeleton = () => (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Error state component
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Recipe Management</h2>
            <p className="text-gray-600">Create and manage your bakery recipes with ingredient tracking</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Recipe
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load recipes. Please try again.</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>

        {/* Dialogs should still be available even in error state */}
        <CreateEditRecipeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} mode="create" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Recipe Management</h2>
          <p className="text-gray-600">Create and manage your bakery recipes with ingredient tracking</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Recipe
        </Button>
      </div>

      {/* Dialogs */}
      <CreateEditRecipeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} mode="create" />

      <CreateEditRecipeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        recipe={editingRecipe}
        mode="edit"
      />

      <ViewRecipeDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} recipe={selectedRecipe} />

      {/* Search */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        )}
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? // Loading state
            Array.from({ length: 6 }).map((_, index) => <RecipeCardSkeleton key={index} />)
          : // Success state
            filteredRecipes.map(recipe => (
              <Card key={recipe.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      <CardDescription>{recipe.category.name}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {recipe.prepTime}
                      </div>
                      <div className="flex items-center">
                        <ChefHat className="h-4 w-4 mr-1" />
                        {recipe.bakeTime}
                      </div>
                      {recipe.temperature && (
                        <div className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1" />
                          {recipe.temperature}
                        </div>
                      )}
                    </div>

                    {/* Ingredient Cost */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Ingredient Cost:</span>
                      <span className="font-medium text-green-600">
                        {formattedCurrency(calculateRecipeCost(recipe.ingredients))}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Yield: {recipe.yield}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewRecipe(recipe)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditRecipe(recipe)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && filteredRecipes.length === 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChefHat className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-500 text-center">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first recipe'}
            </p>
            {!searchTerm && (
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Recipe
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Recipe } from '@/types';
import { Plus, Edit, Eye, Clock, ChefHat, Thermometer, AlertCircle, RefreshCw } from 'lucide-react';
import CreateEditRecipeDialog from './RecipeForm';
import ViewRecipeDialog from './ViewRecipe';
import { useFormattedCurrency } from '@/lib/utils';
import { useRecipes } from '@/hooks/bakery';

export default function RecipeManager() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: recipes = [], isLoading, error, refetch } = useRecipes();
  const formattedCurrency = useFormattedCurrency();

  const filteredRecipes = recipes.filter(
    recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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
    <Card className="bg-background border-border shadow-sm dark:shadow-gray-900/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-muted" />
            <Skeleton className="h-4 w-24 bg-muted" />
          </div>
          <Skeleton className="h-6 w-16 bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-3/4 bg-muted" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-20 bg-muted" />
          <Skeleton className="h-4 w-20 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
        </div>
        <Separator className="bg-border" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20 bg-muted" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9 bg-muted" />
            <Skeleton className="h-9 w-9 bg-muted" />
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
            <h2 className="text-3xl font-bold text-foreground">Recipe Management</h2>
            <p className="text-muted-foreground">Create and manage your bakery recipes with ingredient tracking</p>
          </div>
          <Button
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
            onClick={() => setIsCreateDialogOpen(true)}
          >
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
        <CreateEditRecipeDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} mode="create" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Recipe Management</h2>
          <p className="text-muted-foreground">Create and manage your bakery recipes with ingredient tracking</p>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
          onClick={() => setIsCreateDialogOpen(true)}
        >
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
          className="max-w-sm bg-background border-input"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
              <Card
                key={recipe.id}
                className="bg-background border-border shadow-sm hover:shadow-md dark:hover:shadow-gray-900/30 transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-foreground">{recipe.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">{recipe.category.name}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                      <span className="text-muted-foreground">Ingredient Cost:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {typeof recipe.costPrice === 'number' && !isNaN(recipe.costPrice)
                          ? formattedCurrency(recipe.costPrice)
                          : 'N/A'}
                      </span>
                    </div>
                    <Separator className="bg-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Yield: {recipe.yield}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRecipe(recipe)}
                          className="border-border hover:bg-muted"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRecipe(recipe)}
                          className="border-border hover:bg-muted"
                        >
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
        <Card className="bg-background border-border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChefHat className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No recipes found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first recipe'}
            </p>
            {!searchTerm && (
              <Button
                className="mt-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
                onClick={() => setIsCreateDialogOpen(true)}
              >
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

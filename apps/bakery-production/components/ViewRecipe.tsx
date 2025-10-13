import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Label } from '@workspace/ui/components/label';
import { Badge } from '@workspace/ui/components/badge';
import { Recipe } from '@/types';
import { useFormattedCurrency } from '@/lib/utils';

interface ViewRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
}

export default function ViewRecipeDialog({ open, onOpenChange, recipe }: ViewRecipeDialogProps) {
  const formattedCurrency = useFormattedCurrency()
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

  const calculateRecipeCost = (ingredients: Recipe['ingredients']) => {
    return ingredients.reduce((total, ingredient) => {
      return total + ingredient.quantity * ingredient.ingredientVariant.buyingPrice;
    }, 0);
  };

  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
          <DialogDescription>{recipe.category.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Yield</Label>
              <p className="text-sm">{recipe.yield}</p>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Badge className={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Prep Time</Label>
              <p className="text-sm">{recipe.prepTime}</p>
            </div>
            <div>
              <Label>Bake Time</Label>
              <p className="text-sm">{recipe.bakeTime}</p>
            </div>
            <div>
              <Label>Temperature</Label>
              <p className="text-sm">{recipe.temperature}</p>
            </div>
          </div>

          {recipe.description && (
            <div>
              <Label>Description</Label>
              <p className="text-sm text-gray-600">{recipe.description}</p>
            </div>
          )}

          <div>
            <Label>Ingredients</Label>
            <div className="space-y-2 mt-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">{ingredient.ingredientVariant.name}</span>
                  <div className="text-right text-sm">
                    <span className="font-medium">
                      {ingredient.quantity} {ingredient.unit.symbol}
                    </span>
                    <div className="text-green-600">
                      {formattedCurrency(ingredient.quantity * ingredient.ingredientVariant.buyingPrice)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                <span className="font-medium">Total Cost:</span>
                <span className="font-bold text-green-600">
                  {formattedCurrency(calculateRecipeCost(recipe.ingredients))}
                </span>
              </div>
            </div>
          </div>

          {recipe.instructions && (
            <div>
              <Label>Instructions</Label>
              <div className="text-sm text-gray-600 whitespace-pre-line mt-2">{recipe.instructions}</div>
            </div>
          )}

          {recipe.notes && (
            <div>
              <Label>Notes</Label>
              <p className="text-sm text-gray-600">{recipe.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

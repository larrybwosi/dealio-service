import { useState, ChangeEvent } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { ShoppingCart, Loader2, Package, Truck, FileText, Upload, X, AlertCircle } from 'lucide-react';
import { useFormattedCurrency } from '@/lib/utils';
import { SupplierSelect } from '@/components/common/supplier-select';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { toast } from 'sonner';
import { useOrgStore } from '@org/store';
import { useRestockInventory } from '@/hooks/bakery';

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIngredient: any;
}

export function RestockDialog({ open, onOpenChange, selectedIngredient }: RestockDialogProps) {
  const [restockForm, setRestockForm] = useState({
    quantity: 0,
    unitPrice: 0,
    supplierId: '',
    notes: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const locationId = useOrgStore(state => state.locationId)!;
  const formatCurrency = useFormattedCurrency();
  const { mutateAsync: restockInventory, isPending: isSubmitting } = useRestockInventory();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(prev => [...prev, ...files]);
    setUploadError(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    // Show uploading toast
    const uploadToast = toast.loading(`Uploading ${files.length} file(s)...`);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/upload?file=true', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}: ${response.statusText}`);
          }

          const data = await response.json();
          if (!data.url) {
            throw new Error(`No URL returned for ${file.name}`);
          }

          uploadedUrls.push(data.url);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          throw new Error(`Failed to upload ${file.name}. Please try again.`);
        }
      }

      // Success toast
      toast.success(`Successfully uploaded ${files.length} file(s)`, {
        id: uploadToast,
      });

      return uploadedUrls;
    } catch (error) {
      // Error toast
      toast.error('File upload failed', {
        id: uploadToast,
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error;
    }
  };

  const handleRestock = async () => {
    try {
      let documentUrls: string[] = [];

      if (selectedFiles.length > 0) {
        setIsUploading(true);
        try {
          documentUrls = await uploadFiles(selectedFiles);
        } finally {
          setIsUploading(false);
        }
      }

      await restockInventory({
        productId: selectedIngredient.id,
        unitQuantity: restockForm.quantity,
        variantId: selectedIngredient.ingredientId,
        locationId,
        supplierId: restockForm.supplierId,
        purchasePrice: restockForm.unitPrice,
        notes: restockForm.notes,
        documentUrls,
      });

      // Show success toast
      toast.success('Inventory restocked successfully', {
        description: `${restockForm.quantity} units of ${selectedIngredient?.name} added to inventory.`,
      });

      setRestockForm({ quantity: 0, unitPrice: 0, supplierId: '', notes: '' });
      setSelectedFiles([]);
      setUploadError(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Restock error:', error);
      setUploadError(error instanceof Error ? error.message : 'An error occurred during restock.');

      // Show error toast for restock failure
      toast.error('Failed to restock inventory', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const handleSupplierChange = (supplierId: string) => {
    setRestockForm({ ...restockForm, supplierId });
  };

  const totalCost = restockForm.quantity * restockForm.unitPrice;
  const isFormValid = restockForm.quantity > 0 && restockForm.unitPrice > 0 && restockForm.supplierId.trim() !== '';
  const isProcessing = isSubmitting || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            Restock {selectedIngredient?.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            Add new inventory stock and record purchase details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Error Alert */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Purchase Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Package className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-sm text-gray-700">Purchase Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={restockForm.quantity || ''}
                  onChange={e => setRestockForm({ ...restockForm, quantity: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  disabled={isProcessing}
                  className="text-base"
                />
                <p className="text-xs text-gray-500">Units received</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice" className="text-sm font-medium">
                  Unit Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={restockForm.unitPrice || ''}
                    onChange={e => setRestockForm({ ...restockForm, unitPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    disabled={isProcessing}
                    className="pl-7 text-base"
                  />
                </div>
                <p className="text-xs text-gray-500">Cost per unit</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-sm font-medium flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Supplier <span className="text-red-500">*</span>
              </Label>
              <SupplierSelect
                value={restockForm.supplierId}
                onValueChange={handleSupplierChange}
                placeholder="Select a supplier..."
                disabled={isProcessing}
                required={true}
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <FileText className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-sm text-gray-700">Documents</h3>
              <span className="text-xs text-gray-500 ml-auto">(Optional)</span>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="hidden"
                />
                <Label
                  htmlFor="documents"
                  className={`flex items-center justify-center gap-2 h-24 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    isProcessing
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
                      : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {isUploading ? 'Uploading files...' : 'Upload documents'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, or PNG</p>
                  </div>
                </Label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isProcessing}
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Order Notes
            </Label>
            <Textarea
              id="notes"
              value={restockForm.notes}
              onChange={e => setRestockForm({ ...restockForm, notes: e.target.value })}
              placeholder="Add order reference number, quality notes, or other details..."
              rows={3}
              disabled={isProcessing}
              className="resize-none"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Order Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Quantity</span>
                <span className="font-semibold text-gray-900">{restockForm.quantity || 0} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Unit Price</span>
                <span className="font-semibold text-gray-900">{formatCurrency(restockForm.unitPrice)}</span>
              </div>
              <div className="border-t-2 border-orange-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-orange-900">Total Cost</span>
                  <span className="text-2xl font-bold text-orange-600">{formatCurrency(totalCost)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleRestock}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={isProcessing || !isFormValid}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isUploading ? 'Uploading...' : 'Processing...'}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Inventory
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

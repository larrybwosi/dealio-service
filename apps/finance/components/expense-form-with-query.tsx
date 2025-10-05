"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Progress } from "@workspace/ui/components/progress";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { format } from "date-fns";
import {
  CalendarIcon,
  Upload,
  X,
  DollarSign,
  Receipt,
  Tag,
  User,
  AlertCircle,
  Loader2,
  Save,
  Send,
  FileText,
  Clock,
} from "lucide-react";
import { useCreateExpense } from "@/hooks/use-expenses";
import { useCategories } from "@/hooks/use-categories";
import { useBudgets } from "@/hooks/use-budgets";
import { toast } from "sonner";
import { PaymentMethod } from "@/prisma/client";
import { useLocationsList } from "@/hooks/use-locations";

interface ExpenseFormData {
  description: string;
  amount: number;
  categoryId: string;
  date: Date | undefined;
  paymentMethod: PaymentMethod;
  locationId: string;
  notes: string;
  tags: string[];
  attachments: File[];
  isReimbursable: boolean;
  isBillable: boolean;
  isRecurring: boolean;
  clientId?: string;
  projectId?: string;
}

export function ExpenseFormWithQuery() {
  const createExpenseMutation = useCreateExpense();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: locationsData, isLoading: locationsLoading } = useLocationsList();
  const { data: budgetsData } = useBudgets();

  const [formData, setFormData] = useState<ExpenseFormData>({
    description: "",
    amount: 0,
    categoryId: "",
    date: new Date(),
    paymentMethod: PaymentMethod.CREDIT_CARD,
    locationId: "",
    notes: "",
    tags: [],
    attachments: [],
    isReimbursable: false,
    isBillable: false,
    isRecurring: false,
  });

  const [newTag, setNewTag] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const categories = categoriesData || [];
  const locations = locationsData || [];

  // Get relevant budget for selected category
  const relevantBudget = budgetsData?.data?.find((budget) =>
    budget.categories?.some((cat: any) => cat.id === formData.categoryId)
  );

  const categoryBudget = relevantBudget?.categories?.find(
    (cat: any) => cat.id === formData.categoryId
  );
  const budgetUsagePercentage = categoryBudget
    ? (categoryBudget.used / categoryBudget.allocated) * 100
    : 0;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData?.description?.trim()) {
      errors.description = "Description is required";
    }
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
    if (!formData.categoryId) {
      errors.category = "Category is required";
    }
    if (!formData.date) {
      errors.date = "Date is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      try {
        setUploadProgress(0);

        // Upload each file to the API
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("https://dealio-erp.vercel.appp/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("File upload failed");
          }

          // Update progress for each file
          setUploadProgress((prev) => {
            const newProgress = prev + 100 / files.length;
            return newProgress > 100 ? 100 : newProgress;
          });
        }

        // Add files to form data after successful upload
        setFormData((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...files],
        }));

        toast.success(`${files.length} file(s) uploaded successfully`);
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Failed to upload files");
      } finally {
        setUploadProgress(100);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      const expenseData = {
        ...formData,
        date: formData.date?.toISOString().split("T")[0],
        status: asDraft ? "draft" : "pending",
      };

      await createExpenseMutation.mutateAsync(expenseData);

      if (asDraft) {
        toast.success("Expense saved as draft");
      } else {
        toast.success("Expense submitted for approval");
        // Reset form
        setFormData({
          description: "",
          amount: 0,
          categoryId: "",
          date: new Date(),
          paymentMethod: PaymentMethod.CREDIT_CARD,
          locationId: "",
          notes: "",
          tags: [],
          attachments: [],
          isReimbursable: false,
          isBillable: false,
          isRecurring: false,
        });
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  const isLoading = createExpenseMutation.isPending;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Expense</h1>
        <p className="text-sm text-gray-600">
          Submit a new expense for approval
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Expense Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Input
                  id="description"
                  placeholder="Brief description of the expense"
                  className="h-9"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                {validationErrors.description && (
                  <p className="text-xs text-red-600">
                    {validationErrors.description}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="h-9 pl-9"
                    step="0.01"
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                {validationErrors.amount && (
                  <p className="text-xs text-red-600">
                    {validationErrors.amount}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-xs text-red-600">
                    {validationErrors.category}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {validationErrors.date && (
                  <p className="text-xs text-red-600">
                    {validationErrors.date}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      paymentMethod: value as PaymentMethod,
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethod).map((method) => (
                      <SelectItem key={method} value={method}>
                        {method
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0) + word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, locationId: value })
                  }
                  disabled={locationsLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Additional details about this expense..."
                className="resize-none"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm h-6">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="h-8 flex-1"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm" className="h-8 px-3">
                  Add
                </Button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="reimbursable"
                  checked={formData.isReimbursable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isReimbursable: !!checked })
                  }
                />
                <Label htmlFor="reimbursable" className="text-sm">
                  This expense is reimbursable
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="billable"
                  checked={formData.isBillable}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isBillable: !!checked })
                  }
                />
                <Label htmlFor="billable" className="text-sm">
                  This expense is billable to client
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="recurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isRecurring: !!checked })
                  }
                />
                <Label htmlFor="recurring" className="text-sm">
                  Set up as recurring expense
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Receipts & Documents</CardTitle>
              <CardDescription className="text-sm">
                Upload supporting documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload files</p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </label>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Impact */}
          {categoryBudget && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Budget Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {
                        categories.find((c) => c.id === formData.categoryId)
                          ?.name
                      }{" "}
                      Budget
                    </span>
                    <span>
                      ${categoryBudget.used.toLocaleString()} / $
                      {categoryBudget.allocated.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={budgetUsagePercentage} className="h-2" />
                  <div className="text-sm text-gray-600">
                    {(100 - budgetUsagePercentage).toFixed(1)}% remaining
                  </div>
                </div>
                {budgetUsagePercentage > 90 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      This expense will exceed 90% of the budget allocation.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Approval Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Approval Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span>Manager: Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Expected approval: 1-2 business days</span>
              </div>
              {formData.amount > 500 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span>
                    Requires additional approval for amounts &gt; $500
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-10"
              onClick={() => handleSubmit(false)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full h-10 bg-transparent"
              onClick={() => handleSubmit(true)}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

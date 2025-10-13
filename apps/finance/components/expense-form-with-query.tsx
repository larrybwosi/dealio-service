"use client";

import React, { useState } from "react";
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
  Info,
  Building,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { format } from "date-fns";

// Constants
const PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

// Types
interface FormData {
  description: string;
  amount: number;
  categoryId: string;
  date: Date;
  paymentMethod: string;
  locationId: string;
  notes: string;
  tags: string[];
  attachments: File[];
  isReimbursable: boolean;
  isBillable: boolean;
  isRecurring: boolean;
}

interface ValidationErrors {
  description?: string;
  amount?: string;
  categoryId?: string;
  date?: string;
  attachments?: string;
}

export default function ExpenseFormWithQuery() {
  const [formData, setFormData] = useState<FormData>({
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { data: categories = [] } = useCategories();

  // Mock data - replace with actual API calls
  const locations = [
    { id: "1", name: "New York Office" },
    { id: "2", name: "San Francisco Office" },
    { id: "3", name: "Remote" },
  ];

  const categoryBudget = {
    used: 3200,
    allocated: 5000,
  };

  // Derived state
  const budgetUsagePercentage = (categoryBudget.used / categoryBudget.allocated) * 100;
  const remainingBudget = categoryBudget.allocated - categoryBudget.used;
  const willExceedBudget = formData.amount > remainingBudget;
  const requiresFinanceApproval = formData.amount > 500;

  // Validation
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }

    if (!formData.date) {
      errors.date = "Date is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // File handling
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} exceeds 10MB limit`;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type not supported for ${file.name}`;
    }
    return null;
  };

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (newErrors.length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        attachments: newErrors.join(', ')
      }));
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...validFiles]
      }));
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      // Handle successful submission
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Save form data to local storage or draft API
    localStorage.setItem('expenseDraft', JSON.stringify(formData));
    // Show success message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with improved visual hierarchy */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-sm">
              <Receipt className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                New Expense
              </h1>
              <p className="text-base text-slate-600 mt-1 max-w-2xl">
                Submit expenses for approval and reimbursement. Complete all required fields and attach receipts for faster processing.
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-4 mt-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="font-medium text-slate-900">Expense Details</span>
            </div>
            <div className="w-8 h-px bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
              <span>Review & Submit</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Receipt className="w-5 h-5 text-blue-600" />
                  </div>
                  Expense Information
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 mt-1">
                  Provide detailed information about your expense. Fields marked with <span className="text-red-500">*</span> are required.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-8">
                {/* Description & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      Description
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-1">
                      <Input
                        id="description"
                        placeholder="e.g., Client dinner at The Restaurant"
                        className={`h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                          validationErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                      {validationErrors.description && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-500">
                        Be specific about the purpose and context of the expense
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="amount" className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      Amount
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-1">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className={`h-11 pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                            validationErrors.amount ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                          }`}
                          step="0.01"
                          min="0"
                          value={formData.amount || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            amount: parseFloat(e.target.value) || 0
                          }))}
                        />
                      </div>
                      {validationErrors.amount && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.amount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      Category
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-1">
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger className={`h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                          validationErrors.categoryId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                        }`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {validationErrors.categoryId && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.categoryId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      Date
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`h-11 w-full justify-start text-left font-normal border-slate-300 hover:bg-slate-50 ${
                              validationErrors.date ? 'border-red-500' : ''
                            }`}
                          >
                            <CalendarIcon className="mr-3 h-4 w-4 text-slate-500" />
                            {formData.date ? (
                              format(formData.date, 'PPP')
                            ) : (
                              <span className="text-slate-500">Select expense date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                            initialFocus
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      {validationErrors.date && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {validationErrors.date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-900">
                      Payment Method
                    </Label>
                    <div className="space-y-1">
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                      >
                        <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PaymentMethod).map((method) => (
                            <SelectItem key={method} value={method}>
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                {method.split("_").map(word =>
                                  word.charAt(0) + word.slice(1).toLowerCase()
                                ).join(" ")}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        How was this expense paid?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-900">
                      Location
                    </Label>
                    <div className="space-y-1">
                      <Select
                        value={formData.locationId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, locationId: value }))}
                      >
                        <SelectTrigger className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {location.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        Where was this expense incurred?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-sm font-semibold text-slate-900">
                    Additional Notes
                  </Label>
                  <div className="space-y-1">
                    <Textarea
                      id="notes"
                      placeholder="Add any relevant details, context, or business purpose for this expense..."
                      className="resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                    <p className="text-xs text-slate-500">
                      Provide context to help approvers understand the business purpose
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-900">
                    Tags
                  </Label>
                  <div className="space-y-2">
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-sm h-8 px-3 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-blue-900 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tags for better organization..."
                        className="h-9 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      />
                      <Button
                        onClick={addTag}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border-slate-300 hover:bg-slate-50"
                        disabled={!newTag.trim()}
                      >
                        Add Tag
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Use tags to categorize and find expenses easily later
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Expense Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900">Expense Settings</h4>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id="reimbursable"
                      checked={formData.isReimbursable}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, isReimbursable: !!checked }))
                      }
                      className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="reimbursable" className="text-sm font-medium text-slate-900 cursor-pointer">
                        Reimbursable Expense
                      </Label>
                      <p className="text-xs text-slate-600">
                        I paid for this personally and need reimbursement through company payroll
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id="billable"
                      checked={formData.isBillable}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, isBillable: !!checked }))
                      }
                      className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="billable" className="text-sm font-medium text-slate-900 cursor-pointer">
                        Billable to Client
                      </Label>
                      <p className="text-xs text-slate-600">
                        This expense should be billed directly to a client or project
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id="recurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, isRecurring: !!checked }))
                      }
                      className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="recurring" className="text-sm font-medium text-slate-900 cursor-pointer">
                        Recurring Expense
                      </Label>
                      <p className="text-xs text-slate-600">
                        This is a monthly or regular expense (e.g., software subscriptions, utilities)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* File Upload Card */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                  Receipts & Attachments
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Upload clear photos or scans of your receipts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${
                      isDragging ? 'text-blue-500' : 'text-slate-400'
                    }`} />
                    <p className="text-base font-semibold text-slate-700 mb-2">
                      {isDragging ? 'Drop files here' : 'Upload receipts'}
                    </p>
                    <p className="text-sm text-slate-500 mb-3">
                      Drag & drop files or click to browse
                    </p>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p>Supported: JPG, PNG, PDF</p>
                      <p>Max file size: 10MB each</p>
                    </div>
                  </label>
                </div>

                {validationErrors.attachments && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-red-800">
                      {validationErrors.attachments}
                    </AlertDescription>
                  </Alert>
                )}

                {formData.attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">
                      Attached Files ({formData.attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 bg-white rounded-lg border border-slate-200">
                              <FileText className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="ml-2 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Impact Card */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  Budget Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-slate-700">Travel Budget</span>
                    <span className="text-sm font-semibold text-slate-900">
                      ${categoryBudget.used.toLocaleString()} / ${categoryBudget.allocated.toLocaleString()}
                    </span>
                  </div>

                  <Progress
                    value={budgetUsagePercentage}
                    className={`h-3 ${
                      budgetUsagePercentage > 90 ? 'bg-red-100' :
                        budgetUsagePercentage > 75 ? 'bg-amber-100' : 'bg-slate-100'
                    }`}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      {(100 - budgetUsagePercentage).toFixed(1)}% remaining
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        budgetUsagePercentage > 90 ? 'bg-red-100 text-red-700 border-red-200' :
                          budgetUsagePercentage > 75 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                      }
                    >
                      ${remainingBudget.toLocaleString()} left
                    </Badge>
                  </div>
                </div>

                {willExceedBudget && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-red-800">
                      This expense exceeds your remaining budget by ${(formData.amount - remainingBudget).toLocaleString()}
                    </AlertDescription>
                  </Alert>
                )}

                {budgetUsagePercentage > 90 && !willExceedBudget && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-sm text-amber-800">
                      You've used over 90% of your allocated budget
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Approval Process Card */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  Approval Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Sarah Wilson</p>
                      <p className="text-xs text-slate-600">Direct Manager</p>
                      <p className="text-xs text-slate-500 mt-1">First approval step</p>
                    </div>
                  </div>

                  {requiresFinanceApproval && (
                    <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <Building className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">Finance Team</p>
                        <p className="text-xs text-slate-600">Additional Approval</p>
                        <p className="text-xs text-slate-500 mt-1">Required for expenses over $500</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="p-2 bg-white rounded-lg border border-blue-200">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900">1-2 business days</p>
                      <p className="text-xs text-blue-700">Expected approval time</p>
                      <p className="text-xs text-blue-600 mt-1">
                        You'll be notified via email once approved
                      </p>
                    </div>
                  </div>
                </div>

                {requiresFinanceApproval && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-800">
                      Expenses over $500 require additional approval from the Finance department
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3 sticky top-6">
              <Button
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Expense...
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
                className="w-full h-12 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 transition-colors"
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>

              <div className="text-center">
                <p className="text-xs text-slate-500">
                  By submitting, you confirm this expense complies with company policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
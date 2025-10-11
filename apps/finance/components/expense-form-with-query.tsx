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
} from "lucide-react";

const PaymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
};

export default function ExpenseFormWithQuery() {
  const [formData, setFormData] = useState({
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
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "1", name: "Travel" },
    { id: "2", name: "Meals & Entertainment" },
    { id: "3", name: "Office Supplies" },
    { id: "4", name: "Software" },
  ];

  const locations = [
    { id: "1", name: "New York Office" },
    { id: "2", name: "San Francisco Office" },
    { id: "3", name: "Remote" },
  ];

  const categoryBudget = {
    used: 3200,
    allocated: 5000,
  };

  const budgetUsagePercentage = (categoryBudget.used / categoryBudget.allocated) * 100;

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...files],
      }));
    }
  };

  const removeAttachment = (index) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 rounded-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                New Expense
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Submit an expense for approval and reimbursement
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Expense Information
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Provide details about your expense
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Description & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-slate-900">
                      Description
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="description"
                      placeholder="e.g., Client dinner at The Restaurant"
                      className="h-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium text-slate-900">
                      Amount
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="h-10 pl-9 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                        step="0.01"
                        value={formData.amount || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-900">
                      Category
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900">
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
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-900">
                      Date
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 w-full justify-start text-left font-normal border-slate-300 hover:bg-slate-50"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
                          {formData.date ? (
                            formData.date.toLocaleDateString()
                          ) : (
                            <span className="text-slate-500">Pick a date</span>
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
                  </div>
                </div>

                {/* Payment Method & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-900">
                      Payment Method
                    </Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          paymentMethod: value,
                        })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900">
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
                    <Label className="text-sm font-medium text-slate-900">Location</Label>
                    <Select
                      value={formData.locationId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, locationId: value })
                      }
                    >
                      <SelectTrigger className="h-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900">
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

                <div className="h-px bg-slate-200" />

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-slate-900">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any relevant details or context..."
                    className="resize-none border-slate-300 focus:border-slate-900 focus:ring-slate-900 min-h-[100px]"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-900">Tags</Label>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-sm h-7 px-3 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-slate-900"
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
                      placeholder="Type and press Enter..."
                      className="h-9 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 border-slate-300 hover:bg-slate-50"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="h-px bg-slate-200" />

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id="reimbursable"
                      checked={formData.isReimbursable}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isReimbursable: !!checked })
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="reimbursable" className="text-sm font-medium text-slate-900 cursor-pointer">
                        Reimbursable expense
                      </Label>
                      <p className="text-xs text-slate-600 mt-0.5">
                        I paid for this and need reimbursement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id="billable"
                      checked={formData.isBillable}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isBillable: !!checked })
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="billable" className="text-sm font-medium text-slate-900 cursor-pointer">
                        Billable to client
                      </Label>
                      <p className="text-xs text-slate-600 mt-0.5">
                        This expense should be billed to a client
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id="recurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isRecurring: !!checked })
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="recurring" className="text-sm font-medium text-slate-900 cursor-pointer">
                        Recurring expense
                      </Label>
                      <p className="text-xs text-slate-600 mt-0.5">
                        This is a monthly or regular expense
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Attachments
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Upload receipts and documents
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 hover:bg-slate-50/50 transition-all">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Drop files or click to upload
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                  </label>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-1.5 bg-white rounded border border-slate-200">
                            <FileText className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="text-sm text-slate-700 truncate">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="ml-2 text-slate-400 hover:text-red-600 transition-colors"
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
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Budget Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-600">Travel Budget</span>
                    <span className="text-sm font-semibold text-slate-900">
                      ${categoryBudget.used.toLocaleString()} / $
                      {categoryBudget.allocated.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={budgetUsagePercentage} className="h-2.5 bg-slate-100" />
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-sm text-slate-600">
                      {(100 - budgetUsagePercentage).toFixed(1)}% remaining
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                      ${(categoryBudget.allocated - categoryBudget.used).toLocaleString()} left
                    </Badge>
                  </div>
                </div>
                {budgetUsagePercentage > 90 && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-sm text-amber-800">
                      This expense will exceed 90% of your budget allocation
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Approval Info */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Approval Process
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg mt-0.5">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Sarah Wilson</p>
                      <p className="text-xs text-slate-600">Approving Manager</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-slate-100 rounded-lg mt-0.5">
                      <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">1-2 business days</p>
                      <p className="text-xs text-slate-600">Expected approval time</p>
                    </div>
                  </div>
                </div>
                {formData.amount > 500 && (
                  <Alert className="border-slate-200 bg-slate-50">
                    <Info className="h-4 w-4 text-slate-600" />
                    <AlertDescription className="text-sm text-slate-700">
                      Expenses over $500 require additional approval from Finance
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                onClick={() => {}}
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
                className="w-full h-11 border-slate-300 hover:bg-slate-50 text-slate-700"
                onClick={() => {}}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
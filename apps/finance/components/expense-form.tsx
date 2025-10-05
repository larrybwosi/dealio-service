"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Badge } from "@workspace/ui/components/badge"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Calendar } from "@workspace/ui/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { format } from "date-fns"
import { CalendarIcon, Upload, X, DollarSign, Receipt, Tag, User, AlertCircle } from "lucide-react"

export function ExpenseForm() {
  const [date, setDate] = useState<Date>()
  const [attachments, setAttachments] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const categories = [
    "Office Supplies",
    "Travel",
    "Meals & Entertainment",
    "Software & Subscriptions",
    "Marketing",
    "Training & Development",
    "Equipment",
    "Utilities",
    "Professional Services",
    "Other",
  ]

  const paymentMethods = ["Credit Card", "Cash", "Bank Transfer", "Company Card", "Personal (Reimbursable)"]

  const locations = ["New York Office", "Los Angeles Office", "Remote", "Client Site", "Other"]

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addAttachment = () => {
    setAttachments([...attachments, `receipt-${Date.now()}.pdf`])
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Create New Expense</h1>
        <p className="text-xs text-gray-600">Submit a new expense for approval</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main Form */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Expense Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs">
                  Description *
                </Label>
                <Input id="description" placeholder="Brief description of the expense" className="h-7 text-xs" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount" className="text-xs">
                  Amount *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1.5 h-3 w-3 text-gray-400" />
                  <Input id="amount" type="number" placeholder="0.00" className="h-7 text-xs pl-7" step="0.01" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Category *</Label>
                <Select>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((category) => category && category.trim())
                      .map((category) => (
                        <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-") || "other"}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-7 text-xs justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Payment Method</Label>
                <Select>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods
                      .filter((method) => method && method.trim())
                      .map((method) => (
                        <SelectItem key={method} value={method.toLowerCase().replace(/\s+/g, "-") || "other"}>
                          {method}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Location</Label>
                <Select>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations
                      .filter((location) => location && location.trim())
                      .map((location) => (
                        <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, "-") || "other"}>
                          {location}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <Label htmlFor="notes" className="text-xs">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Additional details about this expense..."
                className="text-xs resize-none"
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-xs">Tags</Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs h-5">
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="h-6 text-xs flex-1"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm" className="h-6 px-2 text-xs">
                  Add
                </Button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="reimbursable" className="h-3 w-3" />
                <Label htmlFor="reimbursable" className="text-xs">
                  This expense is reimbursable
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="billable" className="h-3 w-3" />
                <Label htmlFor="billable" className="text-xs">
                  This expense is billable to client
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="recurring" className="h-3 w-3" />
                <Label htmlFor="recurring" className="text-xs">
                  Set up as recurring expense
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Attachments */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Receipts & Documents</CardTitle>
              <CardDescription className="text-xs">Upload supporting documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={addAttachment} variant="outline" size="sm" className="w-full h-7 text-xs bg-transparent">
                <Upload className="w-3 h-3 mr-1" />
                Upload File
              </Button>
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <span className="truncate">{file}</span>
                      <button onClick={() => removeAttachment(index)} className="text-red-600 hover:text-red-800">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approval Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Approval Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3 h-3 text-gray-400" />
                <span>Manager: Sarah Wilson</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                <span>Requires approval for amounts {">"} $500</span>
              </div>
              <div className="text-xs text-gray-600">Expected approval time: 1-2 business days</div>
            </CardContent>
          </Card>

          {/* Budget Impact */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <div className="flex justify-between">
                  <span>Office Supplies Budget</span>
                  <span>$2,400 / $5,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div className="bg-blue-600 h-1 rounded-full" style={{ width: "48%" }}></div>
                </div>
                <div className="text-gray-600 mt-1">52% remaining</div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full h-8 text-xs">Submit for Approval</Button>
            <Button variant="outline" className="w-full h-8 text-xs bg-transparent">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

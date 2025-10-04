"use client"

import { useState } from "react"
import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@repo/ui/dialog"
import { Label } from "@repo/ui/label"
import { Checkbox } from "@repo/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Download, FileSpreadsheet, FileText, Settings, Loader2 } from "lucide-react"
import { ExportService } from "@/lib/export-utils"
import { PDFExportService } from "@/lib/pdf-export-utils"

interface ExportDropdownProps {
  data: any[]
  filename?: string
  filters?: {
    status?: string
    category?: string
    dateRange?: { start: string; end: string }
  }
  onExportStart?: () => void
  onExportComplete?: () => void
  onExportError?: (error: Error) => void
}

export function ExportDropdown({
  data,
  filename = "expenses-export",
  filters,
  onExportStart,
  onExportComplete,
  onExportError,
}: ExportDropdownProps) {
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    includeComments: true,
    includeTags: true,
    includeAttachments: false,
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  })

  const handleExport = async (format: "excel" | "pdf" | "csv") => {
    try {
      setIsExporting(true)
      onExportStart?.()

      const timestamp = new Date().toISOString().split("T")[0]
      const exportData = ExportService.formatDataForExport(data)

      switch (format) {
        case "excel":
          await ExportService.exportToExcel(exportData, `${filename}-${timestamp}.xlsx`)
          break
        case "pdf":
          await PDFExportService.exportToPDF(exportData, `${filename}-${timestamp}.pdf`)
          break
        case "csv":
          await handleCSVExport()
          break
      }

      onExportComplete?.()
    } catch (error) {
      onExportError?.(error as Error)
      console.error(`${format.toUpperCase()} export failed:`, error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCSVExport = async () => {
    const params = new URLSearchParams({
      format: "csv",
      ...(filters?.status && filters.status !== "all" && { status: filters.status }),
      ...(filters?.category && filters.category !== "all" && { category: filters.category }),
      ...(filters?.dateRange?.start && { startDate: filters.dateRange.start }),
      ...(filters?.dateRange?.end && { endDate: filters.dateRange.end }),
    })

    const response = await fetch(`/api/expenses/export?${params}`)
    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs" disabled={isExporting || data.length === 0}>
            {isExporting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Download className="w-3 h-3 mr-1" />}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium">Quick Export</p>
            <p className="text-xs text-gray-500">{data.length} records</p>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleExport("excel")} className="text-xs" disabled={isExporting}>
            <FileSpreadsheet className="mr-2 h-3 w-3 text-green-600" />
            <div className="flex-1">
              <div>Excel Workbook</div>
              <div className="text-xs text-gray-500">Full data with formatting</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleExport("pdf")} className="text-xs" disabled={isExporting}>
            <FileText className="mr-2 h-3 w-3 text-red-600" />
            <div className="flex-1">
              <div>PDF Report</div>
              <div className="text-xs text-gray-500">Formatted for printing</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleExport("csv")} className="text-xs" disabled={isExporting}>
            <Download className="mr-2 h-3 w-3 text-blue-600" />
            <div className="flex-1">
              <div>CSV File</div>
              <div className="text-xs text-gray-500">Raw data for analysis</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowAdvancedDialog(true)} className="text-xs">
            <Settings className="mr-2 h-3 w-3" />
            Advanced Options
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Advanced Export Dialog */}
      <Dialog open={showAdvancedDialog} onOpenChange={setShowAdvancedDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Advanced Export Options</DialogTitle>
            <DialogDescription className="text-xs">Customize your export settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-xs font-medium">Include Data</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comments"
                    checked={exportOptions.includeComments}
                    onCheckedChange={(checked) =>
                      setExportOptions((prev) => ({ ...prev, includeComments: checked as boolean }))
                    }
                    className="h-3 w-3"
                  />
                  <Label htmlFor="comments" className="text-xs">
                    Comments and notes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tags"
                    checked={exportOptions.includeTags}
                    onCheckedChange={(checked) =>
                      setExportOptions((prev) => ({ ...prev, includeTags: checked as boolean }))
                    }
                    className="h-3 w-3"
                  />
                  <Label htmlFor="tags" className="text-xs">
                    Tags and categories
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attachments"
                    checked={exportOptions.includeAttachments}
                    onCheckedChange={(checked) =>
                      setExportOptions((prev) => ({ ...prev, includeAttachments: checked as boolean }))
                    }
                    className="h-3 w-3"
                  />
                  <Label htmlFor="attachments" className="text-xs">
                    Attachment references
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Date Format</Label>
              <Select
                value={exportOptions.dateFormat}
                onValueChange={(value) => setExportOptions((prev) => ({ ...prev, dateFormat: value }))}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Currency</Label>
              <Select
                value={exportOptions.currency}
                onValueChange={(value) => setExportOptions((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  handleExport("excel")
                  setShowAdvancedDialog(false)
                }}
                className="flex-1 h-7 text-xs"
                disabled={isExporting}
              >
                <FileSpreadsheet className="w-3 h-3 mr-1" />
                Export Excel
              </Button>
              <Button
                onClick={() => {
                  handleExport("pdf")
                  setShowAdvancedDialog(false)
                }}
                variant="outline"
                className="flex-1 h-7 text-xs"
                disabled={isExporting}
              >
                <FileText className="w-3 h-3 mr-1" />
                Export PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

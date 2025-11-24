"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TableViewProps {
  data: any
  isValid: boolean
}

export function TableView({ data, isValid }: TableViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPath, setSelectedPath] = useState<string>("")

  const tableData = useMemo(() => {
    if (!isValid || !data) return null

    const findArrays = (obj: any, path = ""): Array<{ path: string; data: any[] }> => {
      const arrays: Array<{ path: string; data: any[] }> = []

      if (Array.isArray(obj)) {
        arrays.push({ path: path || "root", data: obj })
      } else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
          const newPath = path ? `${path}.${key}` : key
          arrays.push(...findArrays(obj[key], newPath))
        })
      }

      return arrays
    }

    return findArrays(data)
  }, [data, isValid])

  const selectedArray = useMemo(() => {
    if (!tableData || !selectedPath) return tableData?.[0]
    return tableData.find((item) => item.path === selectedPath) || tableData[0]
  }, [tableData, selectedPath])

  const filteredData = useMemo(() => {
    if (!selectedArray || !searchTerm) return selectedArray?.data || []

    return selectedArray.data.filter((item) => {
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
      }
      return String(item).toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [selectedArray, searchTerm])

  const columns = useMemo(() => {
    if (!selectedArray?.data.length) return []

    const firstItem = selectedArray.data[0]
    if (typeof firstItem === "object" && firstItem !== null) {
      return Object.keys(firstItem)
    }
    return ["Value"]
  }, [selectedArray])

  const exportToCSV = () => {
    if (!filteredData.length) {
      toast({
        title: "No Data",
        description: "No data available to export.",
        variant: "destructive",
      })
      return
    }

    const csvContent = [
      columns.join(","),
      ...filteredData.map((row) => {
        if (typeof row === "object" && row !== null) {
          return columns
            .map((col) => {
              const value = row[col]
              return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : String(value || "")
            })
            .join(",")
        }
        return `"${String(row).replace(/"/g, '""')}"`
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedPath || "data"}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "CSV Exported",
      description: `${filteredData.length} rows exported successfully.`,
    })
  }

  if (!isValid) {
    return (
      <Card className="h-full rounded-none border-0">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Invalid JSON - cannot display table view</p>
        </CardContent>
      </Card>
    )
  }

  if (!tableData?.length) {
    return (
      <Card className="h-full rounded-none border-0">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No arrays found in JSON data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Table Header */}
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Table View</h2>

            {tableData.length > 1 && (
              <select
                value={selectedPath}
                onChange={(e) => setSelectedPath(e.target.value)}
                className="px-3 py-1 border border-border rounded text-sm bg-background"
              >
                {tableData.map((item) => (
                  <option key={item.path} value={item.path}>
                    {item.path} ({item.data.length} items)
                  </option>
                ))}
              </select>
            )}

            <Badge variant="outline">{filteredData.length} rows</Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 w-64"
              />
            </div>

            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-3 w-3 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Table Content */}
      <CardContent className="flex-1 overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="font-medium">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const value = typeof row === "object" && row !== null ? row[column] : row
                  return (
                    <TableCell key={column} className="font-mono text-sm">
                      {typeof value === "object" ? JSON.stringify(value) : String(value || "")}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  )
}

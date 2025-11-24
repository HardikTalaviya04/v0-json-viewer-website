"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Search, Expand, ListCollapse as Collapse } from "lucide-react"

interface JSONTreeViewProps {
  data: any
}

interface TreeNodeProps {
  data: any
  path: string
  searchTerm: string
  expandedNodes: Set<string>
  onToggleNode: (path: string) => void
}

function TreeNode({ data, path, searchTerm, expandedNodes, onToggleNode }: TreeNodeProps) {
  const isExpanded = expandedNodes.has(path)
  const isObject = typeof data === "object" && data !== null && !Array.isArray(data)
  const isArray = Array.isArray(data)
  const isPrimitive = !isObject && !isArray

  const matchesSearch = (value: any, key?: string): boolean => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()

    if (key && key.toLowerCase().includes(searchLower)) return true
    if (typeof value === "string" && value.toLowerCase().includes(searchLower)) return true
    if (typeof value === "number" && value.toString().includes(searchLower)) return true

    return false
  }

  const getValueType = (value: any): string => {
    if (value === null) return "null"
    if (Array.isArray(value)) return "array"
    return typeof value
  }

  const getValueColor = (value: any): string => {
    const type = getValueType(value)
    switch (type) {
      case "string":
        return "text-green-600 dark:text-green-400"
      case "number":
        return "text-blue-600 dark:text-blue-400"
      case "boolean":
        return "text-purple-600 dark:text-purple-400"
      case "null":
        return "text-gray-500 dark:text-gray-400"
      default:
        return "text-foreground"
    }
  }

  if (isPrimitive) {
    const shouldShow = matchesSearch(data)
    if (!shouldShow) return null

    return (
      <div className="flex items-center gap-2 py-1 px-2 hover:bg-accent/50 rounded text-sm">
        <span className={`font-mono ${getValueColor(data)}`}>
          {typeof data === "string" ? `"${data}"` : String(data)}
        </span>
        <Badge variant="outline" className="text-xs">
          {getValueType(data)}
        </Badge>
      </div>
    )
  }

  const keys = isObject ? Object.keys(data) : Array.from({ length: data.length }, (_, i) => i.toString())
  const hasVisibleChildren = keys.some(
    (key) => matchesSearch(data[key], key) || (typeof data[key] === "object" && data[key] !== null),
  )

  if (!hasVisibleChildren && searchTerm) return null

  return (
    <div className="text-sm">
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-accent/50 rounded cursor-pointer"
        onClick={() => onToggleNode(path)}
      >
        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
        <span className="font-mono text-foreground">{isArray ? `Array[${data.length}]` : "Object"}</span>
        <Badge variant="outline" className="text-xs">
          {keys.length} {keys.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      {isExpanded && (
        <div className="ml-6 border-l border-border pl-2">
          {keys.map((key) => {
            const childPath = `${path}.${key}`
            const value = data[key]
            const shouldShowKey = matchesSearch(value, key)

            if (!shouldShowKey && searchTerm && typeof value !== "object") return null

            return (
              <div key={key} className="py-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground font-mono">{isArray ? `[${key}]` : `"${key}":`}</span>
                </div>
                <div className="ml-4">
                  <TreeNode
                    data={value}
                    path={childPath}
                    searchTerm={searchTerm}
                    expandedNodes={expandedNodes}
                    onToggleNode={onToggleNode}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function JSONTreeView({ data }: JSONTreeViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]))

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedNodes(newExpanded)
  }

  const expandAll = () => {
    const allPaths = new Set<string>()

    const collectPaths = (obj: any, currentPath: string) => {
      allPaths.add(currentPath)
      if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
          collectPaths(obj[key], `${currentPath}.${key}`)
        })
      }
    }

    if (data) {
      collectPaths(data, "root")
    }

    setExpandedNodes(allPaths)
  }

  const collapseAll = () => {
    setExpandedNodes(new Set(["root"]))
  }

  if (!data) {
    return (
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3 border-b border-border">
          <h3 className="text-sm font-medium">Tree View</h3>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No valid JSON to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tree View Header */}
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Tree View</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={expandAll} className="h-8 px-2">
              <Expand className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll} className="h-8 px-2">
              <Collapse className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search keys and values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </CardHeader>

      {/* Tree Content */}
      <CardContent className="flex-1 overflow-auto p-4">
        <TreeNode
          data={data}
          path="root"
          searchTerm={searchTerm}
          expandedNodes={expandedNodes}
          onToggleNode={toggleNode}
        />
      </CardContent>
    </div>
  )
}

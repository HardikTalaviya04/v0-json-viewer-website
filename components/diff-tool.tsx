"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GitCompare, ArrowLeftRight } from "lucide-react"
import { JSONEditor } from "./json-editor"

interface JSONTab {
  id: string
  name: string
  content: string
  isValid: boolean
}

interface DiffToolProps {
  tabs: JSONTab[]
  onUpdateTab: (tabId: string, content: string) => void
}

interface DiffResult {
  path: string
  type: "added" | "removed" | "modified"
  leftValue?: any
  rightValue?: any
}

export function DiffTool({ tabs, onUpdateTab }: DiffToolProps) {
  const [leftTabId, setLeftTabId] = useState(tabs[0]?.id || "")
  const [rightTabId, setRightTabId] = useState(tabs[1]?.id || tabs[0]?.id || "")
  const [showDifferences, setShowDifferences] = useState(true)

  const leftTab = tabs.find((tab) => tab.id === leftTabId)
  const rightTab = tabs.find((tab) => tab.id === rightTabId)

  const calculateDifferences = (): DiffResult[] => {
    if (!leftTab?.isValid || !rightTab?.isValid) return []

    try {
      const leftData = JSON.parse(leftTab.content)
      const rightData = JSON.parse(rightTab.content)

      const differences: DiffResult[] = []

      const compareObjects = (left: any, right: any, path = "") => {
        const leftKeys = left && typeof left === "object" ? Object.keys(left) : []
        const rightKeys = right && typeof right === "object" ? Object.keys(right) : []
        const allKeys = new Set([...leftKeys, ...rightKeys])

        for (const key of allKeys) {
          const currentPath = path ? `${path}.${key}` : key
          const leftValue = left?.[key]
          const rightValue = right?.[key]

          if (!(key in (left || {}))) {
            differences.push({
              path: currentPath,
              type: "added",
              rightValue,
            })
          } else if (!(key in (right || {}))) {
            differences.push({
              path: currentPath,
              type: "removed",
              leftValue,
            })
          } else if (JSON.stringify(leftValue) !== JSON.stringify(rightValue)) {
            if (
              typeof leftValue === "object" &&
              typeof rightValue === "object" &&
              leftValue !== null &&
              rightValue !== null
            ) {
              compareObjects(leftValue, rightValue, currentPath)
            } else {
              differences.push({
                path: currentPath,
                type: "modified",
                leftValue,
                rightValue,
              })
            }
          }
        }
      }

      compareObjects(leftData, rightData)
      return differences
    } catch (error) {
      return []
    }
  }

  const differences = calculateDifferences()

  const swapTabs = () => {
    const temp = leftTabId
    setLeftTabId(rightTabId)
    setRightTabId(temp)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Diff Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">JSON Diff Tool</h2>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
              <Select value={leftTabId} onValueChange={setLeftTabId}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select left file" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.name} {!tab.isValid && "(Invalid)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="ghost" size="sm" onClick={swapTabs} className="self-center">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              <Select value={rightTabId} onValueChange={setRightTabId}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select right file" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.name} {!tab.isValid && "(Invalid)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline">{differences.length} differences</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-border flex flex-col min-h-0">
          <Card className="h-full rounded-none border-0 flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <h3 className="text-sm font-medium text-muted-foreground">{leftTab?.name || "No file selected"}</h3>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              {leftTab && (
                <div className="h-full overflow-auto">
                  <JSONEditor
                    value={leftTab.content}
                    onChange={(content) => onUpdateTab(leftTab.id, content)}
                    isValid={leftTab.isValid}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <Card className="h-full rounded-none border-0 flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <h3 className="text-sm font-medium text-muted-foreground">{rightTab?.name || "No file selected"}</h3>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              {rightTab && (
                <div className="h-full overflow-auto">
                  <JSONEditor
                    value={rightTab.content}
                    onChange={(content) => onUpdateTab(rightTab.id, content)}
                    isValid={rightTab.isValid}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {differences.length > 0 && (
        <div className="h-32 md:h-48 border-t border-border bg-card flex flex-col flex-shrink-0">
          <CardHeader className="pb-2 flex-shrink-0 px-4 py-2">
            <h3 className="text-sm font-medium">Differences</h3>
          </CardHeader>
          <div className="flex-1 overflow-auto px-4 pb-4">
            <div className="space-y-2">
              {differences.map((diff, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        diff.type === "added" ? "default" : diff.type === "removed" ? "destructive" : "secondary"
                      }
                      className="text-xs flex-shrink-0"
                    >
                      {diff.type}
                    </Badge>
                    <span className="font-mono text-muted-foreground text-xs break-all">{diff.path}</span>
                  </div>
                  {diff.type === "modified" && (
                    <div className="text-xs ml-6 sm:ml-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-destructive break-all">{JSON.stringify(diff.leftValue)}</span>
                        <span className="hidden sm:inline">→</span>
                        <span className="text-green-600 break-all">{JSON.stringify(diff.rightValue)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Sparkles, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  jsonData: any
  isValid: boolean
}

export function AIAssistant({ jsonData, isValid }: AIAssistantProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [explanation, setExplanation] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateExplanation = async () => {
    if (!isValid || !jsonData) {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON data for analysis.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock explanation based on the JSON structure
      const analysis = analyzeJSON(jsonData)
      setExplanation(analysis)

      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your JSON structure.",
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze JSON. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const analyzeJSON = (data: any): string => {
    const getDataType = (value: any): string => {
      if (Array.isArray(value)) return "array"
      if (value === null) return "null"
      return typeof value
    }

    const analyzeStructure = (obj: any, depth = 0): string[] => {
      const insights: string[] = []

      if (Array.isArray(obj)) {
        insights.push(`This is an array containing ${obj.length} items.`)
        if (obj.length > 0) {
          const firstItem = obj[0]
          if (typeof firstItem === "object" && firstItem !== null) {
            const keys = Object.keys(firstItem)
            insights.push(`Each item appears to be an object with properties: ${keys.join(", ")}.`)
          }
        }
      } else if (typeof obj === "object" && obj !== null) {
        const keys = Object.keys(obj)
        insights.push(`This object has ${keys.length} properties: ${keys.join(", ")}.`)

        keys.forEach((key) => {
          const value = obj[key]
          const type = getDataType(value)

          if (type === "array") {
            insights.push(`The "${key}" property contains an array of ${value.length} items.`)
          } else if (type === "object") {
            insights.push(`The "${key}" property is a nested object.`)
          } else {
            insights.push(`The "${key}" property is a ${type} value.`)
          }
        })
      }

      return insights
    }

    const insights = analyzeStructure(data)

    return `## JSON Structure Analysis

${insights.join("\n\n")}

## Summary
This JSON data appears to be ${Array.isArray(data) ? "a collection of items" : "a structured object"} that could be used for ${getUseCaseSuggestion(data)}. The structure is well-organized and follows common JSON patterns.

## Recommendations
- Consider adding validation for required fields
- Ensure consistent data types across similar properties
- Add timestamps if this data changes over time`
  }

  const getUseCaseSuggestion = (data: any): string => {
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0]
      if (typeof firstItem === "object" && firstItem !== null) {
        const keys = Object.keys(firstItem)
        if (keys.includes("id") || keys.includes("name")) {
          return "managing a collection of entities (users, products, etc.)"
        }
      }
      return "storing a list of related items"
    }

    const keys = typeof data === "object" && data !== null ? Object.keys(data) : []
    if (keys.includes("config") || keys.includes("settings")) {
      return "configuration or settings management"
    }
    if (keys.includes("data") || keys.includes("results")) {
      return "API responses or data transfer"
    }

    return "general data storage and exchange"
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
        disabled={!isValid}
      >
        <Bot className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Assistant</span>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {!explanation ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Get an AI-powered explanation of your JSON structure and potential use cases.
            </p>
            <Button onClick={generateExplanation} disabled={isGenerating || !isValid} className="w-full">
              <Sparkles className="h-3 w-3 mr-2" />
              {isGenerating ? "Analyzing..." : "Explain JSON"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea value={explanation} readOnly className="min-h-48 text-sm resize-none" />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateExplanation}
                disabled={isGenerating}
                className="flex-1 bg-transparent"
              >
                Re-analyze
              </Button>
              <Button variant="outline" size="sm" onClick={() => setExplanation("")} className="flex-1">
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

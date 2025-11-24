"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Upload, Wand2, Minimize2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SyntaxHighlighter } from "./syntax-highlighter"
import type { SyntaxTheme } from "./theme-selector"
import { trackJSONAction } from "@/lib/firebase"

interface JSONEditorProps {
  value: string
  onChange: (value: string) => void
  isValid: boolean
  syntaxTheme?: SyntaxTheme
}

export function JSONEditor({ value, onChange, isValid, syntaxTheme = "default" }: JSONEditorProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])
  const [showSyntaxHighlight, setShowSyntaxHighlight] = useState(false)

  useEffect(() => {
    const lines = value.split("\n").length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [value])

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(value)
      const formatted = JSON.stringify(parsed, null, 2)
      onChange(formatted)
      trackJSONAction.format(new Blob([formatted]).size)
      toast({
        title: "JSON Formatted",
        description: "Your JSON has been beautifully formatted.",
      })
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Cannot format invalid JSON. Please fix syntax errors first.",
        variant: "destructive",
      })
    }
  }

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(value)
      const minified = JSON.stringify(parsed)
      onChange(minified)
      trackJSONAction.minify(new Blob([minified]).size)
      toast({
        title: "JSON Minified",
        description: "Your JSON has been minified.",
      })
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Cannot minify invalid JSON. Please fix syntax errors first.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast({
        title: "Copied to Clipboard",
        description: "JSON content has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadJSON = () => {
    const blob = new Blob([value], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    trackJSONAction.download(blob.size)

    toast({
      title: "Download Started",
      description: "Your JSON file is being downloaded.",
    })
  }

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        onChange(content)
        trackJSONAction.upload(new Blob([content]).size)
        toast({
          title: "File Uploaded",
          description: `${file.name} has been loaded.`,
        })
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">JSON Editor</h3>
            <Badge variant={isValid ? "default" : "destructive"} className="text-xs">
              {isValid ? "Valid" : "Invalid"}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="h-8 px-2">
              <Upload className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={formatJSON} className="h-8 px-2">
              <Wand2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={minifyJSON} className="h-8 px-2">
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2">
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadJSON} className="h-8 px-2">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Editor Content */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex">
          {/* Line Numbers */}
          <div className="w-12 bg-muted border-r border-border flex-shrink-0">
            <div className="p-2 text-xs text-muted-foreground font-mono leading-6">
              {lineNumbers.map((num) => (
                <div key={num} className="text-right">
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 relative">
            {showSyntaxHighlight && isValid ? (
              <div className="absolute inset-0 p-3 overflow-auto pointer-events-none">
                <SyntaxHighlighter code={value} theme={syntaxTheme} className="whitespace-pre" />
              </div>
            ) : null}

            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`h-full w-full resize-none border-0 rounded-none font-mono text-sm leading-6 focus-visible:ring-0 ${
                showSyntaxHighlight && isValid ? "text-transparent caret-foreground" : ""
              }`}
              placeholder="Enter your JSON here..."
              spellCheck={false}
            />
          </div>
        </div>
      </CardContent>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={uploadFile} className="hidden" />
    </div>
  )
}

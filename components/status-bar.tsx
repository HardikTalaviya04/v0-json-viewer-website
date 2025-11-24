"use client"
import { CheckCircle, XCircle, FileText } from "lucide-react"

interface StatusBarProps {
  isValid: boolean
  lineCount: number
}

export function StatusBar({ isValid, lineCount }: StatusBarProps) {
  return (
    <div className="h-6 bg-muted border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {isValid ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : (
            <XCircle className="h-3 w-3 text-destructive" />
          )}
          <span>{isValid ? "Valid JSON" : "Invalid JSON"}</span>
        </div>

        <div className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{lineCount} lines</span>
        </div>
      </div>

       {/* Right Section */}
      <div className="hidden md:flex items-center gap-4">
        <span>© 2025 All rights reserved by Hardik Talaviya</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <span>JSON Viewer v1.0.1</span>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, FileText, Settings, Share, GitCompare, Table, Edit3, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { trackJSONAction } from "@/lib/firebase"
import Link from "next/link"
import { useState } from "react"

interface TopBarProps {
  onNewFile: () => void
  viewMode: "editor" | "diff" | "table"
  onViewModeChange: (mode: "editor" | "diff" | "table") => void
  onShare: () => void
  hasValidJSON: boolean
  onMobileSidebarToggle: () => void
}

export function TopBar({
  onNewFile,
  viewMode,
  onViewModeChange,
  onShare,
  hasValidJSON,
  onMobileSidebarToggle,
}: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleFileUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          trackJSONAction.upload(new Blob([content]).size)
          console.log("File content:", content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleDownload = () => {
    // This would need JSON content from parent
    const blob = new Blob(["{}"], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.json"
    a.click()
    URL.revokeObjectURL(url)
    trackJSONAction.download(blob.size)
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    trackJSONAction.themeChange(newTheme)
  }

  const showKeyboardShortcuts = () => {
    alert("Keyboard Shortcuts:\nCtrl+N: New File\nCtrl+S: Save\nCtrl+F: Format JSON\nCtrl+M: Minify JSON")
  }

  const showAbout = () => {
    alert(
      "JSON Viewer v1.0.0\n\nA professional JSON editor with syntax highlighting, tree view, diff comparison, and more.\n\nBuilt with Next.js and Tailwind CSS.",
    )
  }

  return (
    <>
      <div className="h-12 bg-card border-b border-border flex items-center justify-between px-2 md:px-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
            <span className="font-semibold text-sm md:text-lg hidden sm:block">JSON Viewer</span>
            <span className="font-semibold text-sm md:text-lg sm:hidden">JSON</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onNewFile}>
              New File
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "editor" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("editor")}
            className="h-8 px-2 md:px-3"
          >
            <Edit3 className="h-3 w-3 md:mr-1" />
            <span className="hidden md:inline">Editor</span>
          </Button>
          <Button
            variant={viewMode === "diff" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("diff")}
            className="h-8 px-2 md:px-3"
          >
            <GitCompare className="h-3 w-3 md:mr-1" />
            <span className="hidden md:inline">Diff</span>
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className="h-8 px-2 md:px-3"
            disabled={!hasValidJSON}
          >
            <Table className="h-3 w-3 md:mr-1" />
            <span className="hidden md:inline">Table</span>
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="sm" onClick={onShare} disabled={!hasValidJSON} className="h-8 px-2 md:px-3">
            <Share className="h-3 w-3 md:mr-1" />
            <span className="hidden md:inline">Share</span>
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={handleThemeToggle} className="h-8 w-8 p-0 relative">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Menu"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:hidden" onClick={onMobileSidebarToggle}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="bg-card border-b border-border px-2 md:px-4 py-2 flex flex-col gap-1">
          <Link href="/contact-us" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Contact Us
            </Button>
          </Link>
          <Link href="/privacy-policy" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Privacy Policy
            </Button>
          </Link>
          <Link href="/terms-and-conditions" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Terms & Conditions
            </Button>
          </Link>
          <Link href="/disclaimer" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Disclaimer
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}

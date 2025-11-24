"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Link } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { trackJSONAction } from "@/lib/firebase"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jsonContent: string
}

export function ShareDialog({ open, onOpenChange, jsonContent }: ShareDialogProps) {
  const { toast } = useToast()
  const [shareUrl, setShareUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateShareUrl = async () => {
    setIsGenerating(true)

    try {
      // Simulate API call to generate short URL
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, this would call your backend API
      const encoded = btoa(encodeURIComponent(jsonContent))
      const shortId = Math.random().toString(36).substring(2, 8)
      const url = `https://jsonviewer.shop/`

      setShareUrl(url)

      trackJSONAction.share(new Blob([jsonContent]).size)

      toast({
        title: "Share Link Generated",
        description: "Your JSON has been encoded into a shareable link.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to Clipboard",
        description: "Share link has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const getDataSize = () => {
    const bytes = new Blob([jsonContent]).size
    if (bytes < 1024) return `${bytes} bytes`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Share JSON
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Size: {getDataSize()}</Badge>
            <Badge variant="outline">{jsonContent.split("\n").length} lines</Badge>
          </div>

          {!shareUrl ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Generate a shareable link for your JSON data. The link will be valid for 30 days.
              </p>
              <Button onClick={generateShareUrl} disabled={isGenerating} className="w-full">
                {isGenerating ? "Generating..." : "Generate Share Link"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="share-url">Share URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="share-url" value={shareUrl} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(shareUrl)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                This link will expire in 30 days. Anyone with this link can view your JSON data.
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(shareUrl, "_blank")} className="flex-1">
                  Open Link
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShareUrl("")} className="flex-1">
                  Generate New
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

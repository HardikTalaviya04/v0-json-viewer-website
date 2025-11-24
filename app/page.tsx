"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { JSONEditor } from "@/components/json-editor"
import { JSONTreeView } from "@/components/json-tree-view"
import { TopBar } from "@/components/top-bar"
import { StatusBar } from "@/components/status-bar"
import { ThemeProvider } from "@/components/theme-provider"
import { DiffTool } from "@/components/diff-tool"
import { TableView } from "@/components/table-view"
import { ShareDialog } from "@/components/share-dialog"
import { AIAssistant } from "@/components/ai-assistant"
import { AdBanner } from "@/components/ad-banner"
import { PerformanceMonitor } from "@/components/performance-monitor"
import type { SyntaxTheme } from "@/components/theme-selector"
import { trackJSONAction } from "@/lib/firebase"

interface JSONTab {
  id: string
  name: string
  content: string
  isValid: boolean
}

type ViewMode = "editor" | "diff" | "table"

const CRICKET_DATA = `{
  "tournament": "Asia Cup",
  "format": "ODI",
  "venue": "Dubai International Cricket Stadium",
  "match": {
    "title": "India vs Pakistan - Super 4",
    "date": "2025-09-15",
    "status": "completed",
    "result": "India won by 5 wickets"
  },
  "teams": {
    "india": {
      "name": "India",
      "captain": "Rohit Sharma",
      "coach": "Rahul Dravid",
      "squad": [
        {"name": "Rohit Sharma", "role": "captain", "batting_style": "right_hand", "bowling_style": null},
        {"name": "Virat Kohli", "role": "batsman", "batting_style": "right_hand", "bowling_style": null},
        {"name": "KL Rahul", "role": "wicket_keeper", "batting_style": "right_hand", "bowling_style": null},
        {"name": "Hardik Pandya", "role": "all_rounder", "batting_style": "right_hand", "bowling_style": "right_arm_fast_medium"},
        {"name": "Jasprit Bumrah", "role": "bowler", "batting_style": "right_hand", "bowling_style": "right_arm_fast"},
        {"name": "Mohammed Shami", "role": "bowler", "batting_style": "right_hand", "bowling_style": "right_arm_fast_medium"},
        {"name": "Ravindra Jadeja", "role": "all_rounder", "batting_style": "left_hand", "bowling_style": "slow_left_arm_orthodox"}
      ],
      "innings": {
        "runs": 274,
        "wickets": 5,
        "overs": 48.2,
        "run_rate": 5.67
      }
    },
    "pakistan": {
      "name": "Pakistan",
      "captain": "Babar Azam",
      "coach": "Mickey Arthur",
      "squad": [
        {"name": "Babar Azam", "role": "captain", "batting_style": "right_hand", "bowling_style": null},
        {"name": "Mohammad Rizwan", "role": "wicket_keeper", "batting_style": "right_hand", "bowling_style": null},
        {"name": "Fakhar Zaman", "role": "batsman", "batting_style": "left_hand", "bowling_style": null},
        {"name": "Shadab Khan", "role": "all_rounder", "batting_style": "right_hand", "bowling_style": "leg_break"},
        {"name": "Shaheen Afridi", "role": "bowler", "batting_style": "right_hand", "bowling_style": "fast_medium"}
      ],
      "innings": {
        "runs": 250,
        "wickets": 7,
        "overs": 46.3,
        "run_rate": 5.39
      }
    }
  }
}`

export default function JSONViewer() {
  const [tabs, setTabs] = useState<JSONTab[]>([
    {
      id: "1",
      name: "asia-cup.json",
      content: CRICKET_DATA,
      isValid: true,
    },
  ])
  const [activeTab, setActiveTab] = useState("1")
  const [parsedJSON, setParsedJSON] = useState<any>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("editor")
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [syntaxTheme, setSyntaxTheme] = useState<SyntaxTheme>("default")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const activeTabData = tabs.find((tab) => tab.id === activeTab)

  useEffect(() => {
    if (activeTabData?.content) {
      try {
        const parsed = JSON.parse(activeTabData.content)
        setParsedJSON(parsed)
        trackJSONAction.validate(true, new Blob([activeTabData.content]).size)
      } catch (error) {
        setParsedJSON(null)
        trackJSONAction.validate(false, new Blob([activeTabData.content]).size)
      }
    }
  }, [activeTabData?.content])

  const updateTabContent = (tabId: string, content: string) => {
    setTabs((prev) => prev.map((tab) => (tab.id === tabId ? { ...tab, content, isValid: isValidJSON(content) } : tab)))
  }

  const isValidJSON = (str: string): boolean => {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }

  const addNewTab = () => {
    const newId = Date.now().toString()
    const newTab: JSONTab = {
      id: newId,
      name: `JSON-${tabs.length + 1}.json`,
      content: "{\n  \n}",
      isValid: true,
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTab(newId)
    trackJSONAction.newTab()
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return

    setTabs((prev) => prev.filter((tab) => tab.id !== tabId))
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter((tab) => tab.id !== tabId)
      setActiveTab(remainingTabs[0]?.id || "")
    }
    trackJSONAction.closeTab()
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    trackJSONAction.viewModeChange(mode)
  }

  const handleShare = () => {
    setShowShareDialog(true)
    if (activeTabData?.content) {
      trackJSONAction.share(new Blob([activeTabData.content]).size)
    }
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-background text-foreground">
        <div className="hidden md:block">
          <AdBanner slot="top-banner" format="horizontal" className="border-b border-border" />
        </div>

        <TopBar
          onNewFile={addNewTab}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onShare={handleShare}
          hasValidJSON={activeTabData?.isValid || false}
          onMobileSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <div className="border-b border-border bg-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between px-2 md:px-4">
              <div className="flex items-center min-w-0 flex-1">
                <div className="overflow-x-auto flex-1">
                  <TabsList className="h-10 bg-transparent p-0 space-x-0 flex w-max min-w-full">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="relative h-10 px-2 md:px-4 rounded-none border-r border-border data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-b-primary whitespace-nowrap"
                      >
                        <span className={`text-xs md:text-sm ${!tab.isValid ? "text-destructive" : ""}`}>
                          {tab.name.length > 15 ? `${tab.name.substring(0, 12)}...` : tab.name}
                        </span>
                        {tabs.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 md:ml-2 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              closeTab(tab.id)
                            }}
                          >
                            ×
                          </Button>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <Button variant="ghost" size="sm" onClick={addNewTab} className="ml-2 h-8 w-8 p-0 flex-shrink-0">
                  +
                </Button>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <PerformanceMonitor jsonSize={new Blob([activeTabData?.content || ""]).size} />
              </div>
            </div>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden flex relative">
          <div className="flex-1 min-w-0">
            {viewMode === "editor" && (
              <>
                <div className="hidden md:block h-full">
                  <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <Card className="h-full rounded-none border-0 border-r">
                        <div className="h-full">
                          {activeTabData && (
                            <JSONEditor
                              value={activeTabData.content}
                              onChange={(content) => updateTabContent(activeTab, content)}
                              isValid={activeTabData.isValid}
                              syntaxTheme={syntaxTheme}
                            />
                          )}
                        </div>
                      </Card>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <Card className="h-full rounded-none border-0">
                        <div className="h-full">
                          <JSONTreeView data={parsedJSON} />
                        </div>
                      </Card>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>

                <div className="md:hidden h-full flex flex-col">
                  <div className="flex-1 min-h-0">
                    <Card className="h-full rounded-none border-0 border-b">
                      {activeTabData && (
                        <JSONEditor
                          value={activeTabData.content}
                          onChange={(content) => updateTabContent(activeTab, content)}
                          isValid={activeTabData.isValid}
                          syntaxTheme={syntaxTheme}
                        />
                      )}
                    </Card>
                  </div>
                  <div className="flex-1 min-h-0">
                    <Card className="h-full rounded-none border-0">
                      <JSONTreeView data={parsedJSON} />
                    </Card>
                  </div>
                </div>
              </>
            )}

            {viewMode === "diff" && <DiffTool tabs={tabs} onUpdateTab={updateTabContent} />}

            {viewMode === "table" && <TableView data={parsedJSON} isValid={activeTabData?.isValid || false} />}
          </div>

          <div className="hidden lg:block w-48 border-l border-border">
            <AdBanner slot="sidebar" format="vertical" className="h-full p-4" />
          </div>

          {isMobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)}>
              <div
                className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Tools & Settings</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsMobileSidebarOpen(false)}>
                    ×
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Performance</label>
                    <PerformanceMonitor jsonSize={new Blob([activeTabData?.content || ""]).size} />
                  </div>

                  <AdBanner slot="mobile-sidebar" format="horizontal" className="mt-4" />
                </div>
              </div>
            </div>
          )}
        </div>

        <StatusBar
          isValid={activeTabData?.isValid || false}
          lineCount={activeTabData?.content.split("\n").length || 0}
        />

        <ShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          jsonContent={activeTabData?.content || ""}
        />

        <AIAssistant jsonData={parsedJSON} isValid={activeTabData?.isValid || false} />
      </div>
    </ThemeProvider>
  )
}

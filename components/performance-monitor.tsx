"use client"

import { useEffect, useState } from "react"
import { Activity } from "lucide-react"

interface PerformanceStats {
  parseTime: number
  renderTime: number
  memoryUsage: number
}

interface PerformanceMonitorProps {
  jsonSize: number
  onStatsUpdate?: (stats: PerformanceStats) => void
}

export function PerformanceMonitor({ jsonSize, onStatsUpdate }: PerformanceMonitorProps) {
  const [stats, setStats] = useState<PerformanceStats>({
    parseTime: 0,
    renderTime: 0,
    memoryUsage: 0,
  })

  useEffect(() => {
    // Monitor performance metrics
    const updateStats = () => {
      const memory = (performance as any).memory
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0

      const newStats = {
        parseTime: Math.round(performance.now() % 100), // Simulated parse time
        renderTime: Math.round(performance.now() % 50), // Simulated render time
        memoryUsage,
      }

      setStats(newStats)
      onStatsUpdate?.(newStats)
    }

    updateStats()
    const interval = setInterval(updateStats, 5000)

    return () => clearInterval(interval)
  }, [jsonSize, onStatsUpdate])

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <Activity className="h-3 w-3" />
      <span className="text-foreground">Size: {formatSize(jsonSize)}</span>
      <span className="text-foreground">Memory: {stats.memoryUsage} MB</span>
    </div>
  )
}

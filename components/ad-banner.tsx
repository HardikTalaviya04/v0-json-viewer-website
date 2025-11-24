"use client"

import { useState, useEffect } from "react"

interface AdBannerProps {
  slot: string
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  className?: string
}

export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const [hasAds, setHasAds] = useState(false)

  useEffect(() => {
    const checkAdsAvailability = () => {
      // In a real implementation, you would check if AdSense script is loaded
      // and if ads are actually being served. For now, we'll simulate this.
      const adSenseLoaded = typeof window !== "undefined" && (window as any).adsbygoogle
      setHasAds(adSenseLoaded && Math.random() > 0.5) // Simulate 50% ad fill rate
    }

    checkAdsAvailability()
  }, [])

  if (!hasAds) {
    return null
  }

  return (
    <div className={`ad-container ${className}`}>
      {/* AdSense Ad Unit - Replace with your actual ad code */}
      <div id={`ad-${slot}`} className="adsense-placeholder">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3534303211318862"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

      </div>
    </div>
  )
}

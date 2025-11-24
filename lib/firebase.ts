// Firebase configuration and analytics setup
import { initializeApp, getApps } from "firebase/app"
import { getAnalytics, logEvent, type Analytics } from "firebase/analytics"

// Check if all required Firebase environment variables are present
const hasFirebaseConfig = true;

const firebaseConfig = hasFirebaseConfig
  ? {
      apiKey: "AIzaSyDQspYetOD_lmkqYvwfBNDUI2pU2HEXOgI",
  authDomain: "json-formatter-1.firebaseapp.com",
  projectId: "json-formatter-1",
  storageBucket: "json-formatter-1.firebasestorage.app",
  messagingSenderId: "510807153450",
  appId: "1:510807153450:web:182bb1db94b1028ce21c53",
  measurementId: "G-JZKT18SD9M"
    }
  : null

// Initialize Firebase only if config is available
let app = null
let analytics: Analytics | null = null

if (hasFirebaseConfig && firebaseConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

    // Initialize analytics only on client side and when Firebase is configured
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app)
    }
  } catch (error) {
    console.warn("Firebase initialization failed:", error)
  }
}

// Analytics tracking functions with fallback
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, parameters)
    } catch (error) {
      console.warn("Firebase analytics tracking failed:", error)
    }
  } else {
    // Fallback: log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Analytics Event:", eventName, parameters)
    }
  }
}

// Specific tracking functions for JSON Viewer actions
export const trackJSONAction = {
  format: (size: number) => trackEvent("json_format", { json_size: size }),
  minify: (size: number) => trackEvent("json_minify", { json_size: size }),
  validate: (isValid: boolean, size: number) => trackEvent("json_validate", { is_valid: isValid, json_size: size }),
  upload: (size: number) => trackEvent("json_upload", { json_size: size }),
  download: (size: number) => trackEvent("json_download", { json_size: size }),
  share: (size: number) => trackEvent("json_share", { json_size: size }),
  diff: (leftSize: number, rightSize: number) =>
    trackEvent("json_diff", { left_size: leftSize, right_size: rightSize }),
  tableView: (rowCount: number) => trackEvent("json_table_view", { row_count: rowCount }),
  csvExport: (rowCount: number) => trackEvent("json_csv_export", { row_count: rowCount }),
  aiAnalysis: (size: number) => trackEvent("json_ai_analysis", { json_size: size }),
  themeChange: (theme: string) => trackEvent("theme_change", { theme }),
  viewModeChange: (mode: string) => trackEvent("view_mode_change", { mode }),
  newTab: () => trackEvent("new_tab"),
  closeTab: () => trackEvent("close_tab"),
  search: (query: string) => trackEvent("json_search", { query_length: query.length }),
}

export { analytics, hasFirebaseConfig }
export default app

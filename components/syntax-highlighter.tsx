"use client"

import { useMemo } from "react"
import type { SyntaxTheme } from "./theme-selector"

interface SyntaxHighlighterProps {
  code: string
  theme: SyntaxTheme
  className?: string
}

const themeStyles: Record<SyntaxTheme, Record<string, string>> = {
  default: {
    string: "text-green-600 dark:text-green-400",
    number: "text-blue-600 dark:text-blue-400",
    boolean: "text-purple-600 dark:text-purple-400",
    null: "text-gray-500 dark:text-gray-400",
    key: "text-blue-800 dark:text-blue-300",
    punctuation: "text-gray-600 dark:text-gray-300",
  },
  monokai: {
    string: "text-yellow-300",
    number: "text-purple-400",
    boolean: "text-pink-400",
    null: "text-gray-400",
    key: "text-white",
    punctuation: "text-gray-300",
  },
  github: {
    string: "text-green-700",
    number: "text-blue-700",
    boolean: "text-purple-700",
    null: "text-gray-600",
    key: "text-red-700",
    punctuation: "text-gray-700",
  },
  dracula: {
    string: "text-yellow-300",
    number: "text-purple-300",
    boolean: "text-pink-300",
    null: "text-gray-400",
    key: "text-cyan-300",
    punctuation: "text-white",
  },
  solarized: {
    string: "text-cyan-600 dark:text-cyan-400",
    number: "text-violet-600 dark:text-violet-400",
    boolean: "text-orange-600 dark:text-orange-400",
    null: "text-gray-500",
    key: "text-blue-600 dark:text-blue-400",
    punctuation: "text-gray-600 dark:text-gray-400",
  },
  nord: {
    string: "text-green-400",
    number: "text-purple-400",
    boolean: "text-orange-400",
    null: "text-gray-400",
    key: "text-blue-300",
    punctuation: "text-gray-300",
  },
}

export function SyntaxHighlighter({ code, theme, className = "" }: SyntaxHighlighterProps) {
  const highlightedCode = useMemo(() => {
    const styles = themeStyles[theme]

    // Simple JSON syntax highlighting
    return code
      .replace(/"([^"]+)":/g, `<span class="${styles.key}">"$1"</span>:`)
      .replace(/"([^"]+)"/g, `<span class="${styles.string}">"$1"</span>`)
      .replace(/\b(\d+\.?\d*)\b/g, `<span class="${styles.number}">$1</span>`)
      .replace(/\b(true|false)\b/g, `<span class="${styles.boolean}">$1</span>`)
      .replace(/\bnull\b/g, `<span class="${styles.null}">null</span>`)
      .replace(/([{}[\],])/g, `<span class="${styles.punctuation}">$1</span>`)
  }, [code, theme])

  return (
    <div className={`font-mono text-sm leading-6 ${className}`} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
  )
}

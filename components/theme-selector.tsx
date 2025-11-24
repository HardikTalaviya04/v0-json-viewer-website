"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Palette, Check } from "lucide-react"

export type SyntaxTheme = "default" | "monokai" | "github" | "dracula" | "solarized" | "nord"

interface ThemeSelectorProps {
  currentTheme: SyntaxTheme
  onThemeChange: (theme: SyntaxTheme) => void
}

const themes: Array<{ id: SyntaxTheme; name: string; description: string }> = [
  { id: "default", name: "Default", description: "Clean and minimal" },
  { id: "monokai", name: "Monokai", description: "Dark with vibrant colors" },
  { id: "github", name: "GitHub", description: "Light GitHub style" },
  { id: "dracula", name: "Dracula", description: "Dark purple theme" },
  { id: "solarized", name: "Solarized", description: "Easy on the eyes" },
  { id: "nord", name: "Nord", description: "Arctic blue theme" },
]

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Palette className="h-3 w-3 mr-1" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Syntax Themes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className="flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{theme.name}</div>
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            </div>
            {currentTheme === theme.id && <Check className="h-3 w-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("light")
    } else {
      if (typeof window !== "undefined") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        const newTheme = systemTheme === "dark" ? "light" : "dark"
        setTheme(newTheme)
      }
    }
  }

  const getCurrentTheme = () => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      }
      return "light" // fallback for SSR
    }
    return theme
  }

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="bg-transparent hover:bg-accent hover:text-accent-foreground"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const currentTheme = getCurrentTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="bg-transparent hover:bg-accent hover:text-accent-foreground "
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${currentTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${currentTheme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window !== "undefined" ? (localStorage?.getItem(storageKey) as Theme) || defaultTheme : defaultTheme,
  )

  useEffect(() => {
    console.log("[v0] Theme changed to:", theme)
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      console.log("[v0] System theme detected:", systemTheme)
      root.classList.add(systemTheme)
      return
    }

    console.log("[v0] Adding class to root:", theme)
    root.classList.add(theme)
    console.log("[v0] Root classes after update:", root.className)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      console.log("[v0] setTheme called with:", newTheme)
      if (typeof window !== "undefined") {
        localStorage?.setItem(storageKey, newTheme)
      }
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

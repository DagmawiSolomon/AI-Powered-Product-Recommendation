"use client"

import { useState, useEffect } from "react"
import { Clock, Search, X, Trash2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SearchHistoryItem {
  id: string
  query: string
  timestamp: Date
}

interface SearchHistorySidebarProps {
  onSearchSelect?: (query: string) => void
}

const dummySearchHistory: SearchHistoryItem[] = [
  {
    id: "1",
    query: "best wireless headphones for work",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    query: "ergonomic office chair under $500",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    query: "mechanical keyboard for programming",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "4",
    query: "4K monitor for graphic design",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "5",
    query: "standing desk converter",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "6",
    query: "noise cancelling earbuds for travel",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
]

export function SearchHistorySidebar({ onSearchSelect }: SearchHistorySidebarProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(dummySearchHistory)

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setSearchHistory(parsed)
      } catch (error) {
        console.error("Failed to parse search history:", error)
        setSearchHistory(dummySearchHistory)
      }
    }
  }, [])

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  // Function to add a new search to history
  const addToHistory = (query: string) => {
    if (!query.trim()) return

    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date(),
    }

    setSearchHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((item) => item.query !== query.trim())
      // Add new item at the beginning and limit to 50 items
      return [newItem, ...filtered].slice(0, 50)
    })
  }

  // Function to remove a specific search from history
  const removeFromHistory = (id: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id))
  }

  // Function to clear all history
  const clearHistory = () => {
    setSearchHistory([])
  }

  // Function to format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  // Expose addToHistory function globally so SearchInput can use it
  useEffect(() => {
    ;(window as any).addToSearchHistory = addToHistory
  }, [])

  return (
    <Sidebar side="right" variant="floating" collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sidebar-foreground" />
            <span className="font-semibold text-sidebar-foreground">Search History</span>
          </div>
          {searchHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Searches</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {searchHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No search history yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Your searches will appear here</p>
                </div>
              ) : (
                <SidebarMenu>
                  {searchHistory.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onSearchSelect?.(item.query)}
                        className="flex flex-col items-start gap-1 h-auto py-2 text-left"
                      >
                        <span className="text-sm font-medium truncate w-full">{item.query}</span>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</span>
                      </SidebarMenuButton>
                      <SidebarMenuAction onClick={() => removeFromHistory(item.id)} showOnHover>
                        <X className="w-3 h-3" />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

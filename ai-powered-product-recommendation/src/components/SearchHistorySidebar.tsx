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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import Link from "next/link"



interface SearchHistoryItem {
  id: string
  query: string
  timestamp: number
}

interface SearchHistorySidebarProps {
  onSearchSelect?: (query: string) => void
}



export function SearchHistorySidebar({ onSearchSelect }: SearchHistorySidebarProps) {
  // ✅ Call useQuery at the top level
  const queryResult = useQuery(api.search_history.query.getSearchHistory, {});

  // Safely get fetched history (default to empty array if undefined)
  const fetchedSearchHistory: SearchHistoryItem[] = queryResult ?? [];

  // Local state
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(fetchedSearchHistory);

  // Update local state only when fetchedSearchHistory changes
  useEffect(() => {
    // Optional: shallow compare to avoid unnecessary setState
    const isEqual =
      searchHistory.length === fetchedSearchHistory.length &&
      searchHistory.every((item, i) => item.id === fetchedSearchHistory[i]?.id);

    if (!isEqual) {
      setSearchHistory(fetchedSearchHistory);
    }
  }, [fetchedSearchHistory, searchHistory]);

  // Function to format timestamp
  const formatTimestamp = (timestamp: number) => {
      const diff = Date.now() - timestamp
      const minutes = Math.floor(diff / 60000)
      if (minutes < 1) return "just now"
      if (minutes < 60) return `${minutes} min ago`
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours} hours ago`
      const days = Math.floor(hours / 24)
      return `${days} days ago`
  }


  return (
    <Sidebar side="right" variant="floating" collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sidebar-foreground" />
            <span className="font-semibold text-sidebar-foreground">Search History</span>
          </div>
         
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
  <Link href={`/search/${item.id}`} className="w-full">
    <SidebarMenuButton className="flex flex-col items-start gap-1 h-auto py-2 text-left">
      <span className="text-sm font-medium truncate w-full">{item.query}</span>
      <span className="text-xs text-muted-foreground">
        {formatTimestamp(item.timestamp)}
      </span>
    </SidebarMenuButton>
  </Link>
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

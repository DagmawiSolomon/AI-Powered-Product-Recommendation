"use client"

import { ChevronsRight, ChevronsLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarToggle() {
  const { open, setOpen } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setOpen(!open)}
      className="h-10 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors rounded-l-md rounded-r-none border-l border-y border-border bg-background/95 backdrop-blur shadow-sm"
      aria-label={open ? "Close sidebar" : "Open sidebar"}
    >
      {open ? (
        <ChevronsRight className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <ChevronsLeft className="h-4 w-4 transition-transform duration-200" />
      )}
    </Button>
  )
}

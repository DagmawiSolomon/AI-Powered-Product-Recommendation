"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SearchInputProps {
  placeholder?: string | null
  onSubmit?: (message: string) => void
  className?: string
}

export function SearchInput({ placeholder = "", onSubmit, className = "" }: SearchInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && onSubmit) {
      onSubmit(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 glow-effect hover:border-border/80 transition-colors">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Describe the product you're looking for..."}
            rows={3}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base resize-none leading-relaxed"
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <kbd className="p-1.5 bg-muted text-sm rounded-sm">Enter ⏎</kbd>
              <span>to search</span>
            </div>
            <Button
              type="submit"
              disabled={!message.trim()}
              className="disabled:opacity-50 disabled:cursor-not-allowed px-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-sparkle-icon lucide-sparkle"
              >
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              </svg>
              Find Products
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

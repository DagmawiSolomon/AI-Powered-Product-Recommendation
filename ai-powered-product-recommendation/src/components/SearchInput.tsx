"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface SearchInputProps {
  placeholder?: string | null
  onSubmit?: (message: string) => void
  className?: string
}

export function SearchInput({ placeholder = "", onSubmit, className = "" }: SearchInputProps) {
  const [message, setMessage] = useState("")
   const router = useRouter()

  const examplePrompts = [
    "Best noise-canceling headphones for work",
    "Ergonomic office chair under $500",
    "Gaming laptop with RTX 4070",
    "Wireless earbuds for running",
  ]


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

  const handleExampleClick = (prompt: string) => {
    setMessage(prompt)
    // Auto-submit the example prompt
    if (onSubmit) {
      onSubmit(prompt)
    } else {
      const encodedQuery = encodeURIComponent(prompt)
      router.push(`/search-results?q=${encodedQuery}`)
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
              variant={"outline"}
              size={"lg"}
              disabled={!message.trim()}
              className="disabled:opacity-50 disabled:cursor-not-allowed p-6 rounded-full"
            >
              <Sparkles/>
            </Button>
          </div>
        </div>
      </form>
  
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-3">Try searching for:</div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, index) => (
              <Button
              variant={"outline"}
                key={index}
                type="button"
                onClick={() => handleExampleClick(prompt)}
                className="dark:opacity-70"
              >
                <span className="group-hover:scale-105 transition-transform duration-200 inline-block">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>
      
    </div>
  )
}

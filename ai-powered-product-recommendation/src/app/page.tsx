"use client"

import { SearchInput } from "../components/SearchInput"
import { Button } from "@/components/ui/button"
import { CommunityCarousel } from "@/components/CommunityCarousel"
import { Info } from "lucide-react"
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from "convex/react";

import { api } from "../../convex/_generated/api"


export default function Home() {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <div className="relative flex justify-center">
            <div
              className="bg-primary/10 text-primary inline-flex items-center gap-2 px-4 py-2 rounded-full  border border-border/30 shadow-sm text-sm cursor-help transition-all hover:bg-primary/15 hover:shadow-md backdrop-blur-sm"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="w-4 h-4" />
              Demo uses sample products
            </div>

            {showTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg shadow-lg p-3 text-xs text-popover-foreground max-w-xs z-100 animate-in fade-in-0 zoom-in-95">
                This hackathon prototype uses a small, preloaded dataset. Some queries may be limited. For a better
                result try one of the example prompts
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-45"></div>
              </div>
            )}
          </div>
          <div className="pb-3">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Find the Right Product, <span className="text-muted-foreground">Together.</span>
            </h1>
            <p className="text-lg font-medium md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
              AI-powered search with real community insights to help you discover products that actually matter.
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <SearchInput
              placeholder="What product are you looking for? (e.g., best wireless headphones for work)"
              onSubmit={(message) => console.log("Search:", message)}
            />
          </div>
        </div>
      </main>

      {/* Powered By Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-12 text-sm uppercase tracking-wider">Powered By Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-70">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="font-semibold text-lg">Convex</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="font-semibold text-lg">BetterAuth</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-semibold text-lg">OpenAI</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Recent Activity</h2>
              <p className="text-muted-foreground text-lg">Latest searches and discussions from the community</p>
            </div>
          </div>

          <CommunityCarousel />
        </div>
      </section>
    </div>
  )
}

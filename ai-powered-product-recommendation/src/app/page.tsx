"use client"

import { SearchInput } from "../components/SearchInput"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-semibold">ProductFinder</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="custom-button px-7">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Find the Right Product, <span className="text-muted-foreground">Together.</span>
            </h1>
            <p className="text-lg font-medium md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balanced ">
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
      <section className="px-6 pb-16">
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
        <div className="flex justify-between">

          <div>
            <p>From the Community</p>
          <p>Explore what the community shoped for</p>
          </div>
          <div className="">
            <a href="">Expore More</a>
          </div>

          <div>
            {/* infinite courosal showing what the latest products users searched fow wehwe */}
            {/* CARDs */}
          </div>
        </div>
      </section>
    </div>
  )
}

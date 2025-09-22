"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Navbar } from "@/components/Navbar"

export default function CommunityPage() {
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    "all",
    "electronics",
    "home-garden",
    "fashion",
    "kitchen",
    "fitness",
    "books",
    "automotive",
    "beauty",
    "sports",
  ]

  const guides = [
    {
      id: 1,
      title: "Best Noise-Canceling Headphones for 2024",
      author: "Alex M.",
      category: "electronics",
      likes: 247,
      remixCount: 18,
      createdAt: "2024-01-15",
      description: "Complete guide to finding the perfect noise-canceling headphones for work and travel.",
      image: "/sony-wh-1000xm5.png",
    },
    {
      id: 2,
      title: "Ultimate Standing Desk Setup Guide",
      author: "Sarah K.",
      category: "home-garden",
      likes: 189,
      remixCount: 32,
      createdAt: "2024-01-14",
      description: "Everything you need to create an ergonomic and productive standing desk workspace.",
      image: "/standing-desk-setup.jpg",
    },
    {
      id: 3,
      title: "Premium Coffee Brewing Equipment",
      author: "Mike R.",
      category: "kitchen",
      likes: 156,
      remixCount: 24,
      createdAt: "2024-01-13",
      description: "From beans to brew: the essential equipment for perfect coffee at home.",
      image: "/coffee-brewing-equipment.jpg",
    },
    {
      id: 4,
      title: "Gaming Monitor Under $300",
      author: "Emma L.",
      category: "electronics",
      likes: 134,
      remixCount: 15,
      createdAt: "2024-01-12",
      description: "Best budget gaming monitors that don't compromise on performance.",
      image: "/gaming-monitor-setup.png",
    },
    {
      id: 5,
      title: "Sustainable Home Cleaning Products",
      author: "David P.",
      category: "home-garden",
      likes: 298,
      remixCount: 41,
      createdAt: "2024-01-11",
      description: "Eco-friendly cleaning solutions that actually work.",
      image: "/eco-cleaning-products.jpg",
    },
    {
      id: 6,
      title: "Small Space Workout Equipment",
      author: "Lisa T.",
      category: "fitness",
      likes: 223,
      remixCount: 28,
      createdAt: "2024-01-10",
      description: "Get fit at home with space-efficient workout gear.",
      image: "/home-workout-setup.png",
    },
  ]

  const filteredAndSortedGuides = guides
    .filter((guide) => {
      const matchesCategory = selectedCategory === "all" || guide.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "most-liked":
          return b.likes - a.likes
        case "most-remixed":
          return b.remixCount - a.remixCount
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <Navbar />
      

      {/* Hero Section */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-balance leading-tight">
              Community <span className="text-muted-foreground">Feed</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto text-balanced">
              Discover and explore product guides created by our community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-4">
            <div className="flex flex-col justify-between sm:flex-row gap-4 items-center">

              {/* Compact search */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                
              </div>
              <div className="flex items-center space-x-4">
              {/* Sort dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="most-liked">Most Liked</option>
                  <option value="most-remixed">Most Remixed</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex items-center space-x-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </Button>
              </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full"
                  }`}
                >
                  {category === "all" ? "All" : category.replace("-", " & ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Guide grid */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredAndSortedGuides.map((guide) => (
              <div
                key={guide.id}
                className={`bg-card border border-border rounded-xl glow-effect hover:border-border/80 transition-all cursor-pointer group ${
                  viewMode === "list" ? "flex items-center p-4 space-x-4" : "p-6"
                }`}
                onClick={() => (window.location.href = `/guide/${guide.id}`)}
              >
                {viewMode === "grid" ? (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={guide.image || "/placeholder.svg"}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {guide.category.replace("-", " & ")}
                        </span>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{guide.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span>{guide.remixCount}</span>
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">by {guide.author}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = "/remix"
                          }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Remix
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={guide.image || "/placeholder.svg"}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{guide.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span>{guide.remixCount}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-1 rounded-full">
                            {guide.category.replace("-", " & ")}
                          </span>
                          <span className="text-sm text-muted-foreground">by {guide.author}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = "/remix"
                          }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Remix
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="custom-button bg-transparent">
              Load More Guides
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

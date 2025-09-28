"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Navbar } from "@/components/Navbar"
import { ProductCard } from "@/components/ProductCard"

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
              Recent <span className="text-muted-foreground">Activity</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto text-balanced">
              Discover and explore searched created by our community
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
              <ProductCard key={guide.id} title={guide.title} description={guide.description} category={guide.category} searchedBy={guide.author} timeAgo="1 day ago" />
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

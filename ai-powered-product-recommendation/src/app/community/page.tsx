"use client"

import { SearchInput } from "../../components/SearchInput"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function CommunityPage() {
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
          <ThemeToggle />
          <Button variant="outline" className="custom-button px-7 bg-transparent">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
              Community <span className="text-muted-foreground">Insights.</span>
            </h1>
            <p className="text-lg font-medium md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balanced">
              Discover what products the community is searching for and share your own discoveries.
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <SearchInput
              placeholder="Search community discussions and product reviews..."
              onSubmit={(message) => console.log("Community Search:", message)}
            />
          </div>
        </div>
      </main>

      {/* Community Stats Section */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">12,847</h3>
              <p className="text-muted-foreground">Community Members</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">3,291</h3>
              <p className="text-muted-foreground">Product Reviews</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground">8,456</h3>
              <p className="text-muted-foreground">Searches This Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Community Activity */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Recent Activity</h2>
              <p className="text-muted-foreground text-lg">Latest searches and discussions from the community</p>
            </div>
            <Button variant="outline" className="custom-button bg-transparent">
              View All Activity
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                product: "Best Noise-Canceling Headphones",
                user: "Alex M.",
                category: "Electronics",
                time: "2h ago",
                type: "Search",
                engagement: "12 replies",
              },
              {
                product: "Ergonomic Standing Desk Setup",
                user: "Sarah K.",
                category: "Furniture",
                time: "4h ago",
                type: "Review",
                engagement: "8 likes",
              },
              {
                product: "Premium Coffee Brewing Equipment",
                user: "Mike R.",
                category: "Kitchen",
                time: "6h ago",
                type: "Discussion",
                engagement: "15 comments",
              },
              {
                product: "Gaming Monitor Under $300",
                user: "Emma L.",
                category: "Electronics",
                time: "8h ago",
                type: "Search",
                engagement: "6 replies",
              },
              {
                product: "Sustainable Home Cleaning Products",
                user: "David P.",
                category: "Home & Garden",
                time: "12h ago",
                type: "Review",
                engagement: "22 likes",
              },
              {
                product: "Workout Equipment for Small Spaces",
                user: "Lisa T.",
                category: "Fitness",
                time: "1d ago",
                type: "Discussion",
                engagement: "31 comments",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 glow-effect hover:border-border/80 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.category}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2">{item.product}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">by {item.user}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">{item.engagement}</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Join Discussion
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-2 mb-12">
            <h2 className="text-3xl font-bold text-foreground">Popular Categories</h2>
            <p className="text-muted-foreground text-lg">Explore trending product categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Electronics", count: "1,247", icon: "📱" },
              { name: "Home & Garden", count: "892", icon: "🏠" },
              { name: "Fashion", count: "756", icon: "👕" },
              { name: "Kitchen", count: "634", icon: "🍳" },
              { name: "Fitness", count: "523", icon: "💪" },
              { name: "Books", count: "445", icon: "📚" },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 text-center glow-effect hover:border-border/80 transition-colors cursor-pointer"
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{category.count} discussions</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

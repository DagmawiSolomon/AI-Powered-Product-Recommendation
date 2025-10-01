"use client"

import { SearchInput } from "../components/SearchInput"
import { CommunityCarousel } from "@/components/CommunityCarousel"
import { Info } from "lucide-react"
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { SearchHistorySidebar } from "@/components/SearchHistorySidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SidebarToggle } from "@/components/SideBarToggle"
import { Authenticated } from "convex/react"
import Link from "next/link"
import Image from "next/image"


export default function Home() {
  const [showTooltip, setShowTooltip] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchSelect = (query: string) => {
    setSearchQuery(query)
    console.log("Selected search:", query)
  }

  return (
    <SidebarProvider>
      <SidebarInset>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />

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
                Find the Right Product, <span className="text-muted-foreground">Stress Free.</span>
              </h1>
              <p className="text-lg font-medium md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
               Saving you time and stress in your search for the right product.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <SearchInput
                placeholder="What product are you looking for? (e.g., best wireless headphones for work)"
                onSubmit={(message) => console.log("Search:", message)}
              />
            </div>
          </div>
        </main>

        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground mb-12 text-sm uppercase tracking-wider">Powered By</p>
            <div className="flex  justify-center items-center gap-16 opacity-70">
              <Link href="https://convex.dev" target="_blank" className="flex items-center space-x-3 text-white">
                 <Image src="brands/logo-white.svg" alt="convex logo white" width={200} height={200} className="hidden dark:block"/>
                 <Image src="brands/logo-black.svg" alt="convex logo black" width={200} height={200} className="w-[200px] block dark:hidden"/>
              </Link>
              <Link href="https://www.better-auth.com" target="_blank" className="flex items-center space-x-3">
                  <Image src="brands/better-auth-logo-wordmark-light.svg" alt="better auth logo white" width={200} height={200} className="w-[200px] hidden dark:block"/>
                 <Image src="brands/better-auth-logo-wordmark-dark.svg" alt="better auth logo dark" width={200} height={200} className="w-[200px] block dark:hidden"/>
              </Link>
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
      </SidebarInset>
      <Authenticated>
      <SearchHistorySidebar onSearchSelect={handleSearchSelect} />

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <SidebarToggle />
      </div>
     </Authenticated>
    </SidebarProvider>
  )
}

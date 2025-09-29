"use client"

import { useEffect, useRef, useState } from "react"
import { ProductCard } from "./ProductCard"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

interface RecentActivity {
  id: string
  title: string
  searchedBy: string
  timeAgo: string
}



export function CommunityCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const communityProducts: RecentActivity[] = useQuery(api.search_history.query.getRecentActivity) ?? []
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scroll = () => {
      if (isScrolling) return

      scrollContainer.scrollLeft += 1

      // Reset scroll when reaching the end
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft = 0
      }
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [isScrolling])

  const handleMouseEnter = () => setIsScrolling(true)
  const handleMouseLeave = () => setIsScrolling(false)

  return (
    <div className="overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide p-6 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Duplicate the array to create seamless infinite scroll */}
        {[...communityProducts, ...communityProducts].map((product, index) => (
          <ProductCard
            key={index}
            id={product.id}
            title={product.title}
            searchedBy={product.searchedBy}
            timeAgo={product.timeAgo}
          />
        ))}
      </div>
    </div>
  )
}

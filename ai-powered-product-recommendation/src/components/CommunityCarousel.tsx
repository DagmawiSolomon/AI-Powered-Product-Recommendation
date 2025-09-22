"use client"

import { useEffect, useRef, useState } from "react"
import { ProductCard } from "./ProductCard"

const communityProducts = [
  {
    title: "Best Wireless Headphones for Remote Work",
    description:
      "Looking for noise-canceling headphones with great battery life for long work sessions. Comfort is key since I wear them 8+ hours daily.",
    category: "Electronics",
    searchedBy: "Sarah M.",
    timeAgo: "2 hours ago",
  },
  {
    title: "Ergonomic Standing Desk Under $500",
    description:
      "Need a height-adjustable desk that's sturdy and doesn't wobble. Preferably with memory settings for different heights.",
    category: "Furniture",
    searchedBy: "Mike R.",
    timeAgo: "4 hours ago",
  },
  {
    title: "Best Coffee Beans for Espresso Machine",
    description:
      "Searching for premium coffee beans that work well with my new espresso machine. Prefer medium to dark roast with rich flavor.",
    category: "Food & Drink",
    searchedBy: "Emma L.",
    timeAgo: "6 hours ago",
  },
  {
    title: "Durable Running Shoes for Marathon Training",
    description:
      "Training for my first marathon and need shoes with excellent cushioning and support for high mileage running.",
    category: "Sports",
    searchedBy: "David K.",
    timeAgo: "8 hours ago",
  },
  {
    title: "Smart Home Security Camera System",
    description:
      "Looking for a reliable security system with night vision, mobile alerts, and cloud storage. Easy installation preferred.",
    category: "Smart Home",
    searchedBy: "Lisa P.",
    timeAgo: "12 hours ago",
  },
  {
    title: "Professional Laptop for Video Editing",
    description:
      "Need a powerful laptop for 4K video editing with good color accuracy and fast rendering capabilities. Budget around $2000.",
    category: "Electronics",
    searchedBy: "Alex T.",
    timeAgo: "1 day ago",
  },
]

export function CommunityCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)

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
            title={product.title}
            description={product.description}
            category={product.category}
            searchedBy={product.searchedBy}
            timeAgo={product.timeAgo}
          />
        ))}
      </div>
    </div>
  )
}

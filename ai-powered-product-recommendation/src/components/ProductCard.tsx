"use client"

import Link from "next/link"
import { Heart, ArrowRight, Sparkles, Clock } from "lucide-react"

interface ProductCardProps {
  id: string
  title: string
  searchedBy: string
  timeAgo: string
  avatar?: string
  likes?: number
}

function formatLikes(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  }
  return count.toString()
}

export function ProductCard({ id, title, searchedBy, timeAgo, avatar, likes = 0 }: ProductCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3 glow-effect hover:border-border/80 transition-all duration-200 min-w-[350px] max-w-[350px] flex-shrink-0">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="w-[12px]  text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{timeAgo}</span>
          </div>
          <Sparkles className="ri-sparkling-line text-sm text-primary/60"/>
        
        </div>

        <Link
          href={`/search/${id}`}
          className="font-semibold text-foreground text-base leading-tight underline-offset-4 hover:underline block group"
        >
          <div className="flex items-center justify-between">
            <span className="truncate pr-2 flex-1">{title}</span>
            <ArrowRight className="w-[18px]  opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"/>
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{avatar || searchedBy.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-sm text-muted-foreground">by {searchedBy}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Heart className="w-[18px] text-muted-foreground hover:text-red-500 cursor-pointer transition-colors duration-200" />
          <span className="text-xs text-muted-foreground font-medium min-w-[20px] text-right">
            {formatLikes(likes)}
          </span>
        </div>
      </div>
    </div>
  )
}

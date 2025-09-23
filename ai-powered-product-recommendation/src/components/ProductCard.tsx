"use client"

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { RefreshCcw  } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  title: string
  description: string
  category: string
  searchedBy: string
  timeAgo: string
  avatar?: string
}

export function ProductCard({ title, description, category, searchedBy, timeAgo, avatar }: ProductCardProps) {
  const router = useRouter()
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 glow-effect hover:border-border/80 transition-all duration-200 min-w-[320px] max-w-[500px] flex-shrink-0">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">{category}</span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        
        <Link href={`/remix`} className="font-semibold text-foreground text-lg leading-tight line-clamp-2 underline-offset-4 hover:underline">{title}</Link>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary">{avatar || searchedBy.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-xs text-muted-foreground">by {searchedBy}</span>
        </div>

        <div className="flex items-center">
        <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10 hover:text-primary">
          <Heart/>
        </Button>
        <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10 hover:text-primary" onClick={() => router.push("/remix")}>
          <RefreshCcw />
        </Button>
        </div>
        
      </div>
    </div>
  )
}

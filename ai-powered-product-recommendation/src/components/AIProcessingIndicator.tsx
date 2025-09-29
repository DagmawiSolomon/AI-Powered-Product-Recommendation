"use client"

import { Loader2, CheckCircle2, Search, Target, BarChart3, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProcessingIndicatorProps {
  status?: "analyzing" | "finding" | "ranking" | "preparing" | "complete"
  message?: string
  className?: string
}

const ProcessingIndicator = ({ status = "analyzing", message, className }: ProcessingIndicatorProps) => {
  const getDefaultMessage: any = () => {
    switch (status) {
      case "analyzing":
        return "Analyzing your request..."
      case "finding":
        return "Finding relevant information..."
      case "ranking":
        return "Ranking results..."
      case "preparing":
        return "Preparing your results..."
      case "complete":
        return "Complete!"
      default:
        return "Processing..."
    }
  }

  const renderIcon = () => {
    const iconClass = "w-12 h-12 text-primary"

    switch (status) {
      case "analyzing":
        return (
          <div className="relative">
            <Search className={cn(iconClass, "animate-pulse")} />
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          </div>
        )
      case "finding":
        return (
          <div className="relative">
            <Target className={cn(iconClass, "animate-bounce")} />
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
          </div>
        )
      case "ranking":
        return (
          <div className="relative">
            <BarChart3 className={cn(iconClass, "animate-pulse")} />
            <div
              className="absolute -inset-1 rounded-full border border-primary/40 animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
        )
      case "preparing":
        return (
          <div className="relative">
            <FileText className={cn(iconClass, "animate-bounce")} />
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          </div>
        )
      case "complete":
        return (
          <div className="relative animate-in zoom-in-50 duration-500">
            <CheckCircle2 className={cn(iconClass, "text-green-500")} />
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" />
          </div>
        )
      default:
        return <Loader2 className={cn(iconClass, "animate-spin")} />
    }
  }

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm", className)}
    >
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Main indicator */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 rounded-full border-4 border-muted animate-pulse" />
          {/* Icon container */}
          <div className="absolute inset-2 flex items-center justify-center">{renderIcon()}</div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{message || getDefaultMessage()}</p>

          {status !== "complete" && (
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProcessingIndicator

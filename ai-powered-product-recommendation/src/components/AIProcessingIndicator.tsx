"use client"

import { Brain, Target, Sparkles, CheckCircle, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const AIProcessingIndicator = ({ status }: { status: string }) => {
  const steps = [
    {
      icon: Brain,
      text: "Analyzing your query",
      value: "Analyzing",
    },
    {
      icon: Target,
      text: "Finding relevant products",
      value: "Finding",
    },
    {
      icon: Sparkles,
      text: "Ranking by AI score",
      value: "Ranking",
    },
    {
      icon: CheckCircle,
      text: "Preparing results",
      value: "Preparing result",
    },
  ]

  const currentStepIndex = steps.findIndex((step) => step.value === status)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = step.value === status
          const isCompleted = index < currentStepIndex
          const isPending = index > currentStepIndex

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300",
                isActive && "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
                isCompleted && "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
                isPending && "opacity-30",
              )}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                    isActive && "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/50",
                    isCompleted && "border-green-500 bg-green-500",
                    isPending && "border-muted-foreground/30",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive && "text-yellow-600 dark:text-yellow-400",
                        isPending && "text-muted-foreground/50",
                      )}
                    />
                  )}
                </div>
                {isActive && (
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-yellow-900 dark:text-yellow-100",
                    isCompleted && "text-green-700 dark:text-green-300",
                    isPending && "text-muted-foreground/70",
                  )}
                >
                  {step.text}
                </p>
                {isActive && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce" />
                      <div
                        className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t">
        <Sparkles className="w-3 h-3" />
        <span>Powered by AI</span>
      </div>
    </div>
  )
}

export default AIProcessingIndicator

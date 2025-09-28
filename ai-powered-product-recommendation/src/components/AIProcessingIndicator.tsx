"use client"

import { useState, useEffect } from "react"
import { Brain, Target, Sparkles, CheckCircle } from "lucide-react"

const AIProcessingIndicator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    {
      icon: Brain,
      text: "Analyzing your query",
      color: "text-blue-500",
      bgColor: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
    },
    {
      icon: Target,
      text: "Finding relevant products",
      color: "text-purple-500",
      bgColor: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    },
    {
      icon: Sparkles,
      text: "Ranking by AI score",
      color: "text-yellow-500",
      bgColor: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
    },
    {
      icon: CheckCircle,
      text: "Preparing results",
      color: "text-green-500",
      bgColor: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground text-center mb-8">AI Search in Progress</h2>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep

          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${step.bgColor} border rounded-xl p-4 transition-all duration-1000 ${
                isActive ? "opacity-100 scale-100" : "opacity-30 scale-95"
              }`}
              style={{
                display: isActive ? "block" : "none",
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Icon className={`w-6 h-6 ${step.color}`} />
                  <div className="absolute -inset-2 rounded-full border-2 border-current/30 animate-ping opacity-75" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{step.text}</h3>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                    <div
                      className="w-1 h-1 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-1 h-1 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-8">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Powered by AI • Finding the perfect match for you</span>
      </div>
    </div>
  )
}

export default AIProcessingIndicator

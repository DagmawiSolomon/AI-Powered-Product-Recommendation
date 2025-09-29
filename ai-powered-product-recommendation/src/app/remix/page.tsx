"use client"

import AIProcessingIndicator from "@/components/AIProcessingIndicator"

export default function AI() {
  return (<div className="flex items-center justify-center h-screen">
    <AIProcessingIndicator status="Ranking" />

  </div>)
}

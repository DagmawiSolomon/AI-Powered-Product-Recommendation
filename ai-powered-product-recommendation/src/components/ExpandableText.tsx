"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ExpandableTextProps {
  text: string
  maxLength?: number
  className?: string
}

const ExpandableText = ({ text, maxLength = 150, className = "" }: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>
  }

  const truncatedText = text.slice(0, maxLength)
  const remainingText = text.slice(maxLength)

  return (
    <div className={className}>
      <p className="leading-relaxed">
        {truncatedText}
        {!isExpanded && (
          <>
            <span className="text-muted-foreground">...</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="p-0 h-auto ml-1 text-primary hover:text-primary/80 text-xs"
            >
              more
            </Button>
          </>
        )}
        {isExpanded && (
          <>
            {remainingText}
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="p-0 h-auto ml-1 text-primary hover:text-primary/80 text-xs"
            >
              less
            </Button>
          </>
        )}
      </p>
    </div>
  )
}

export default ExpandableText

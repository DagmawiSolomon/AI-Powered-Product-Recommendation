"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Check } from "lucide-react"

export type StepKey =
  | "understanding_search"
  | "finding_products"
  | "sorting_options"
  | "choosing_fit"
  | "preparing_results"

const steps: { key: StepKey; label: string }[] = [
  { key: "understanding_search", label: "Understanding your search" },
  { key: "finding_products", label: "Finding matching products" },
  { key: "sorting_options", label: "Sorting the best options" },
  { key: "choosing_fit", label: "Choosing what fits you best" },
  { key: "preparing_results", label: "Preparing your results" },
]

export interface WorkflowProgressProps {
  currentStep?: StepKey | null
  processingDuration?: number // Time to show processing phase (default: 2000ms)
}

export function WorkflowProgress({ currentStep, processingDuration = 2000 }: WorkflowProgressProps) {
  const [phase, setPhase] = useState<"processing" | "done">("processing")
  const prevStepRef = useRef<StepKey | null | undefined>(currentStep)

  useEffect(() => {
    if (!currentStep) {
      return
    }

    // When step changes, reset to processing phase
    // This works perfectly with Convex's reactive queries - when the query updates,
    // this effect will trigger and smoothly transition to the new step
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep
      setPhase("processing")

      const doneTimeout = setTimeout(() => {
        setPhase("done")
      }, processingDuration)

      return () => clearTimeout(doneTimeout)
    }
  }, [currentStep, processingDuration])

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-6 bg-card rounded-xl shadow-lg border"
        >
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-lg font-semibold text-muted-foreground">Loading...</span>
        </motion.div>
      </div>
    )
  }

  const stepToShow = steps.find((s) => s.key === currentStep) ?? steps[0]

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepToShow.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 p-6 bg-card rounded-xl shadow-lg border"
        >
          <AnimatePresence mode="wait">
            {phase === "processing" ? (
              <motion.div
                key="spinner"
                initial={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-5 h-5 text-green-600" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.span
            className="text-lg font-semibold"
            animate={{
              color: phase === "processing" ? "hsl(var(--muted-foreground))" : "hsl(142.1 76.2% 36.3%)",
            }}
            transition={{ duration: 0.3 }}
          >
            {stepToShow.label}
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

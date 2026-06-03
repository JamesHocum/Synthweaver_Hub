"use client"

import { useEffect, useState, useRef } from "react"
import { useDemoMode } from "@/contexts/demo-mode-context"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from "lucide-react"

export function DemoOverlay() {
  const {
    isDemoMode,
    currentStep,
    currentStepData,
    totalSteps,
    nextStep,
    prevStep,
    endDemo,
  } = useDemoMode()

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; placement: "top" | "bottom" | "left" | "right" }>({
    top: 0,
    left: 0,
    placement: "bottom",
  })
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDemoMode || !currentStepData) {
      setTargetRect(null)
      return
    }

    const findTarget = () => {
      const target = document.querySelector(currentStepData.target)
      if (target) {
        const rect = target.getBoundingClientRect()
        setTargetRect(rect)

        // Calculate tooltip position
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        const tooltipWidth = 380
        const tooltipHeight = 180
        const padding = 16

        let placement: "top" | "bottom" | "left" | "right" = "bottom"
        let top = rect.bottom + padding
        let left = rect.left + rect.width / 2 - tooltipWidth / 2

        // Adjust if tooltip goes off-screen
        if (top + tooltipHeight > viewportHeight - padding) {
          placement = "top"
          top = rect.top - tooltipHeight - padding
        }

        if (left < padding) {
          left = padding
        } else if (left + tooltipWidth > viewportWidth - padding) {
          left = viewportWidth - tooltipWidth - padding
        }

        // If target is too tall, position to the side
        if (rect.height > viewportHeight * 0.5) {
          placement = "right"
          top = Math.max(padding, rect.top + rect.height / 2 - tooltipHeight / 2)
          left = rect.right + padding
          if (left + tooltipWidth > viewportWidth - padding) {
            placement = "left"
            left = rect.left - tooltipWidth - padding
          }
        }

        setTooltipPosition({ top, left, placement })
      } else {
        // Fallback to center if target not found
        setTargetRect(null)
        setTooltipPosition({
          top: window.innerHeight / 2 - 90,
          left: window.innerWidth / 2 - 190,
          placement: "bottom",
        })
      }
    }

    // Initial find
    const timer = setTimeout(findTarget, 100)

    // Re-find on scroll/resize
    window.addEventListener("scroll", findTarget, true)
    window.addEventListener("resize", findTarget)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", findTarget, true)
      window.removeEventListener("resize", findTarget)
    }
  }, [isDemoMode, currentStepData])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isDemoMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        endDemo()
      } else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        nextStep()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevStep()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDemoMode, nextStep, prevStep, endDemo])

  if (!isDemoMode || !currentStepData) {
    return null
  }

  const progress = ((currentStep + 1) / totalSteps) * 100
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
          {/* Glow filter */}
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
        {/* Spotlight border glow */}
        {targetRect && (
          <rect
            x={targetRect.left - 8}
            y={targetRect.top - 8}
            width={targetRect.width + 16}
            height={targetRect.height + 16}
            rx="12"
            fill="none"
            stroke="var(--neon-primary)"
            strokeWidth="2"
            filter="url(#neon-glow)"
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Tooltip */}
      <div
        className="absolute pointer-events-auto w-[380px] rounded-xl border bg-[#0a0a0f]/95 backdrop-blur-md p-5"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          borderColor: "var(--neon-primary)",
          boxShadow: "0 0 30px rgba(var(--neon-primary-rgb), 0.3)",
        }}
      >
        {/* Close button */}
        <button
          onClick={endDemo}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Exit demo"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="px-2 py-0.5 text-xs font-semibold rounded-full"
            style={{
              backgroundColor: "rgba(var(--neon-primary-rgb), 0.2)",
              color: "var(--neon-primary)",
            }}
          >
            {currentStep + 1} / {totalSteps}
          </span>
          <span className="text-xs text-gray-500">Demo Mode</span>
        </div>

        {/* Content */}
        <h3
          className="text-lg font-bold mb-2"
          style={{
            color: "var(--neon-primary)",
            textShadow: "0 0 10px var(--neon-primary)",
          }}
        >
          {currentStepData.title}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          {currentStepData.description}
        </p>

        {/* Progress bar */}
        <div className="h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--neon-primary)",
              boxShadow: "0 0 10px var(--neon-primary)",
            }}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={endDemo}
              className="text-gray-400 hover:text-white"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>

            <Button
              size="sm"
              onClick={nextStep}
              style={{
                backgroundColor: "var(--neon-primary)",
                color: "#0a0a0f",
              }}
            >
              {isLastStep ? (
                <>
                  Finish
                  <Play className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">→</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">Esc</kbd>
            Exit
          </span>
        </div>
      </div>

      {/* Step dots indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-auto">
        {DEMO_STEPS_SIMPLIFIED.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              // Find actual step index for this simplified step
              // This is a visual indicator only
            }}
            className={`h-2 rounded-full transition-all ${
              index === getSimplifiedStepIndex(currentStep)
                ? "w-6"
                : "w-2 opacity-50 hover:opacity-75"
            }`}
            style={{
              backgroundColor: index === getSimplifiedStepIndex(currentStep) 
                ? "var(--neon-primary)" 
                : "rgba(var(--neon-primary-rgb), 0.5)",
            }}
            aria-label={`Step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Simplified step groups for the dot indicator
const DEMO_STEPS_SIMPLIFIED = [
  "Landing",
  "Features",
  "Dashboard",
  "Integrations",
  "Repos",
  "Models",
  "Extensions",
  "Complete",
]

function getSimplifiedStepIndex(currentStep: number): number {
  if (currentStep <= 1) return 0 // Landing
  if (currentStep <= 3) return 1 // Features
  if (currentStep === 4) return 2 // Dashboard intro
  if (currentStep <= 7) return 3 // Integrations
  if (currentStep <= 9) return 4 // Repos
  if (currentStep <= 11) return 5 // Models
  if (currentStep <= 13) return 6 // Extensions/Settings
  return 7 // Complete
}

"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function FAQError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("FAQ error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">FAQ Unavailable</h2>
        <p className="text-muted-foreground">We're having trouble loading the FAQ. Please try again.</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}

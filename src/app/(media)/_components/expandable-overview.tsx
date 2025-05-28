"use client"
import { useState, useRef, useLayoutEffect } from "react"

interface ExpandableOverviewProps {
  text: string
  lineHeight?: number
}

export function ExpandableText({
  text,
  lineHeight = 24,
}: ExpandableOverviewProps) {
  const [expanded, setExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)
  const [fullHeight, setFullHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const h = el.scrollHeight
    setFullHeight(h)
    // if more than 3 lines, allow expansion
    if (h > lineHeight * 3 + 1) setCanExpand(true)
  }, [lineHeight])

  const collapsedMaxH = lineHeight * 3

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{
          maxHeight: expanded ? fullHeight : collapsedMaxH,
        }}
      >
        <p className="whitespace-pre-wrap">
          {text}
        </p>
      </div>

      {canExpand && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-blue-600 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  )
}

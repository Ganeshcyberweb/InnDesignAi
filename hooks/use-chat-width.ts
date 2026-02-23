"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function useChatWidth() {
  const pathname = usePathname()
  const [chatWidth, setChatWidth] = useState(1000)

  useEffect(() => {
    const updateWidth = () => {
      const viewportWidth = window.innerWidth
      const isDashboard = pathname === "/dashboard"
      const maxWidth =
        viewportWidth >= 1440
          ? (isDashboard ? 1200 : 960)
          : viewportWidth >= 1200
            ? (isDashboard ? 1100 : 900)
            : (isDashboard ? 980 : 840)
      const sidePadding =
        viewportWidth < 640 ? 24 : viewportWidth < 1024 ? 48 : 64
      const nextWidth = Math.min(
        maxWidth,
        Math.max(280, viewportWidth - sidePadding)
      )
      setChatWidth(nextWidth)
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [pathname])

  return chatWidth
}

"use client"

import { usePathname } from "next/navigation"

export function useChatWidth() {
  const pathname = usePathname()

  // Return 1000 for dashboard, 800 for all other pages
  return pathname === "/dashboard" ? 1000 : 800
}
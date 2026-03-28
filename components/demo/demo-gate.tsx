"use client"

import type { ReactNode } from "react"
import { DemoStoreProvider } from "@/components/demo/demo-store"

export function DemoGate({
  enabled,
  userEmail,
  children,
}: {
  enabled: boolean
  /** Si coincide con `isRichDemoUser`, se cargan más datos mock para la demo. */
  userEmail?: string | null
  children: ReactNode
}) {
  if (!enabled) return <>{children}</>
  return <DemoStoreProvider userEmail={userEmail}>{children}</DemoStoreProvider>
}

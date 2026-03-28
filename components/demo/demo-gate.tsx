"use client"

import type { ReactNode } from "react"
import { DemoStoreProvider } from "@/components/demo/demo-store"

export function DemoGate({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  if (!enabled) return <>{children}</>
  return <DemoStoreProvider>{children}</DemoStoreProvider>
}

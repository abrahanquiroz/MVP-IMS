import type { ReactNode } from "react"

export function DashboardAuraShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f6f6f8] text-neutral-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[25%] top-[-15%] h-[50vh] w-[80vw] rounded-full bg-[#00b4a0]/[0.06] blur-[100px]" />
        <div className="absolute -right-[20%] top-[25%] h-[55vh] w-[70vw] rounded-full bg-[#6750a4]/[0.07] blur-[110px]" />
        <div className="absolute bottom-[-20%] left-[20%] h-[40vh] w-[60vw] rounded-full bg-[#00b4a0]/[0.04] blur-[90px]" />
      </div>
      <div className="relative z-0">{children}</div>
    </div>
  )
}

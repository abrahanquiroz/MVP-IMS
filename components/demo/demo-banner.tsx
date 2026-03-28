"use client"

export function DemoBanner() {
  return (
    <div className="border-b border-[#00b4a0]/20 bg-gradient-to-r from-[#00b4a0]/10 via-white/90 to-[#6750a4]/10 px-3 py-2 text-center text-[11px] font-medium text-neutral-700 sm:text-xs">
      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#006a60]">
        Demo
      </span>{" "}
      Datos de muestra en memoria. Al recargar la página todo vuelve al estado inicial.
    </div>
  )
}

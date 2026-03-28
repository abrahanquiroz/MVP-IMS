"use client"

import { Button } from "@/components/ui/button"
import { AlertsView } from "@/components/shared/alerts-view"
import { useDemoStore } from "@/components/demo/demo-store"

export function CaregiverAlertsDemo() {
  const d = useDemoStore()
  return (
    <div className="space-y-4 px-4 pb-6 pt-2 sm:px-6">
      <Button
        type="button"
        variant="outline"
        onClick={d.addCaregiverAlert}
        className="w-full rounded-full border-neutral-200 bg-white/90 shadow-sm sm:w-auto"
      >
        + Agregar alerta (demo)
      </Button>
      <AlertsView
        alerts={d.caregiverAlerts as unknown as Record<string, unknown>[]}
        title="Alertas del paciente"
        onResolveAlert={(id) => d.resolveCaregiverAlert(id)}
      />
    </div>
  )
}

"use client"

import { RecipientAlertsList } from "@/app/dashboard/recipient/alerts/alerts-list"
import { Button } from "@/components/ui/button"
import { useDemoStore } from "@/components/demo/demo-store"

export function RecipientAlertsDemo() {
  const d = useDemoStore()
  return (
    <RecipientAlertsList
      initialAlerts={d.recipientAlerts}
      demoDismiss={d.dismissRecipientAlert}
      topExtra={
        <Button
          type="button"
          variant="outline"
          onClick={d.addRecipientAlert}
          className="mb-4 w-full rounded-full border-neutral-200 bg-white/90 text-sm shadow-sm"
        >
          + Simular alerta (demo)
        </Button>
      }
    />
  )
}

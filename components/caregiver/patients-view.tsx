"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Users, UserPlus, X, UserRound } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface PatientsViewProps {
  assignments: Record<string, unknown>[]
  caregiverId: string
}

export function PatientsView({ assignments, caregiverId }: PatientsViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const router = useRouter()

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        const supabase = createClient()

        // Look up the care recipient by email through profiles
        // Since we can't search auth.users, we need to search by a known identifier
        // For now, we'll create the assignment by searching profiles
        const { data: profiles, error: searchError } = await supabase
          .from("profiles")
          .select("id, full_name, role")
          .eq("role", "care_recipient")

        if (searchError) throw new Error(searchError.message)

        // Note: In a production app, you'd have an invitation system
        // For this demo, we allow linking by creating a direct assignment
        if (!profiles || profiles.length === 0) {
          throw new Error(
            "No se encontraron personas cuidadas. Pídeles que creen una cuenta primero."
          )
        }

        // Find the first unassigned care recipient for demo purposes
        const existingIds = assignments.map(
          (a) => (a as { care_recipient_id: string }).care_recipient_id
        )
        const available = profiles.filter((p) => !existingIds.includes(p.id))

        if (available.length === 0) {
          throw new Error(
            "Todas las personas cuidadas ya están asignadas a ti."
          )
        }

        const targetRecipient = available[0]

        const { error } = await supabase
          .from("caregiver_assignments")
          .insert({
            caregiver_id: caregiverId,
            care_recipient_id: targetRecipient.id,
            status: "active",
          })

        if (error) throw new Error(error.message)

        toast.success(
          `Conectado con ${targetRecipient.full_name || "persona cuidada"}`
        )
        setEmail("")
        setShowForm(false)
        router.refresh()
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al agregar paciente"
        )
      }
    })
  }

  const active = assignments.filter(
    (a) => (a as { status: string }).status === "active"
  )
  const pending = assignments.filter(
    (a) => (a as { status: string }).status === "pending"
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis pacientes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus conexiones con personas cuidadas
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Agregar paciente
            </>
          )}
        </Button>
      </div>

      {/* Add Patient Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Conectar con persona cuidada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssign} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Correo de la persona cuidada</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="paciente@ejemplo.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  La persona cuidada debe tener una cuenta de CareLink.
                </p>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="sm:self-start"
              >
                {isPending ? <Spinner className="mr-2" /> : null}
                Enviar solicitud
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active Patients */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4.5 w-4.5 text-primary" />
            Pacientes activos ({active.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {active.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-3">
                <UserRound className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-card-foreground mb-1">
                Sin pacientes aún
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Agrega una persona cuidada para comenzar a monitorear sus datos
                de salud y coordinar su cuidado.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {active.map((assignment) => {
                const a = assignment as {
                  id: string
                  care_recipient_id: string
                  created_at: string
                  care_recipient?: {
                    full_name?: string
                    date_of_birth?: string
                  }
                }
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 rounded-xl border border-border/60 p-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
                      {a.care_recipient?.full_name?.charAt(0)?.toUpperCase() ??
                        "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-card-foreground truncate">
                        {a.care_recipient?.full_name ?? "Desconocido"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Conectado{" "}
                        {formatDistanceToNow(new Date(a.created_at), {
                          addSuffix: true, locale: es,
                        })}
                      </p>
                    </div>
                    <Badge className="bg-success/10 text-success border-0 shrink-0">
                      Activo
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending */}
      {pending.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground">
              Conexiones pendientes ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {pending.map((assignment) => {
                const a = assignment as {
                  id: string
                  care_recipient?: { full_name?: string }
                }
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-border/40 p-3 opacity-70"
                  >
                    <UserRound className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground flex-1">
                      {a.care_recipient?.full_name ?? "Pendiente"}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Pendiente
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

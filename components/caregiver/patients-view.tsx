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
import { createCareRecipientAccount } from "@/app/dashboard/caregiver/patients/actions"

interface PatientsViewProps {
  assignments: Record<string, unknown>[]
}

export function PatientsView({ assignments }: PatientsViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleCreateRecipient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createCareRecipientAccount(formData)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Persona cuidada creada. Ya puede iniciar sesión con ese correo y contraseña.")
      e.currentTarget.reset()
      setShowForm(false)
      router.refresh()
    })
  }

  const active = assignments.filter(
    (a) => (a as { status: string }).status === "active",
  )
  const pending = assignments.filter(
    (a) => (a as { status: string }).status === "pending",
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis pacientes</h1>
          <p className="text-muted-foreground mt-1">
            Crea la cuenta de la persona cuidada (correo y contraseña) para que pueda entrar
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Nueva persona cuidada
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Alta de persona cuidada
            </CardTitle>
            <p className="text-sm text-muted-foreground font-normal">
              Se creará un usuario con rol «persona cuidada» y quedará vinculado a ti. Podrá
              iniciar sesión en la misma app con estos datos.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRecipient} className="flex flex-col gap-4 max-w-md">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pc-full_name">Nombre completo</Label>
                <Input
                  id="pc-full_name"
                  name="full_name"
                  type="text"
                  placeholder="Nombre de la persona cuidada"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pc-email">Correo electrónico</Label>
                <Input
                  id="pc-email"
                  name="email"
                  type="email"
                  placeholder="paciente@ejemplo.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="pc-password">Contraseña inicial</Label>
                <Input
                  id="pc-password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">
                  Comparte esta contraseña con la persona cuidada o pídele que la cambie más adelante.
                </p>
              </div>
              <Button type="submit" disabled={isPending} className="sm:self-start">
                {isPending ? <Spinner className="mr-2" /> : null}
                Crear cuenta y vincular
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

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
                Usa «Nueva persona cuidada» para crear su usuario y contraseña.
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
                          addSuffix: true,
                          locale: es,
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

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"

import { toast } from "sonner"

import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react"

import { useAuth } from "../auth/AuthProvider"

import {
  createAdminUser,
  getAdminUsers,
  grantAnalystRole,
  type AdminUsersResponse,
  type AuthUser,
  type UserRole,
} from "../auth/api"

import { AdminAccessRequired, PageHeader } from "../components/ProductUI"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"

import { Button } from "../components/ui/button"

import { Card, CardContent } from "../components/ui/card"

import { Input } from "../components/ui/input"

import { Label } from "../components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"

const initialSummary: AdminUsersResponse["summary"] = {
  total: 0,
  common: 0,
  analysts: 0,
}

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",

  analyst: "Analista",

  citizen: "Usuário comum",
}

const roleStyles: Record<UserRole, string> = {
  admin:
    "border-[#0E2440] bg-[#0E2440] text-white dark:border-[#D9A679] dark:bg-[#D9A679]/15 dark:text-[#F1C99F]",

  analyst:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300",

  citizen:
    "border-gray-200 bg-gray-100 text-gray-700 dark:border-border dark:bg-muted dark:text-muted-foreground",
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a solicitação."
}

export function AdminUsuarios() {
  const { user, loading: authLoading } = useAuth()

  const [query, setQuery] = useState("")

  const [role, setRole] = useState<"all" | UserRole>("all")

  const [page, setPage] = useState(1)

  const [users, setUsers] = useState<AuthUser[]>([])

  const [summary, setSummary] = useState(initialSummary)

  const [filteredTotal, setFilteredTotal] = useState(0)

  const [pageSize, setPageSize] = useState(25)

  const [loading, setLoading] = useState(true)

  const [loadError, setLoadError] = useState("")

  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null)

  const [pendingUserId, setPendingUserId] = useState<number | null>(null)

  const [changeError, setChangeError] = useState("")

  const [adminName, setAdminName] = useState("")

  const [adminEmail, setAdminEmail] = useState("")

  const [adminPassword, setAdminPassword] = useState("")

  const [creatingAdmin, setCreatingAdmin] = useState(false)

  const requestLock = useRef(false)

  const adminRequestLock = useRef(false)

  const loadUsers = useCallback(
    async (signal?: AbortSignal, requestedPage = page) => {
      if (user?.role !== "admin") return

      setLoading(true)

      setLoadError("")

      try {
        const result = await getAdminUsers({
          query,
          role,
          page: requestedPage,
          signal,
        })

        if (signal?.aborted) return

        setUsers(result.users)

        setSummary(result.summary)

        setFilteredTotal(result.filteredTotal)

        setPageSize(result.pageSize)
      } catch (error) {
        if (signal?.aborted) return

        setLoadError(getErrorMessage(error))
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [page, query, role, user?.role],
  )

  useEffect(() => {
    if (authLoading || user?.role !== "admin") return

    const controller = new AbortController()

    void loadUsers(controller.signal)

    return () => controller.abort()
  }, [authLoading, loadUsers, user?.role])

  const confirmPromotion = async () => {
    if (!selectedUser || requestLock.current || selectedUser.role !== "citizen")
      return

    requestLock.current = true

    setPendingUserId(selectedUser.id)

    setChangeError("")

    try {
      const updatedUser = await grantAnalystRole(selectedUser.id)

      toast.success(`${updatedUser.name} agora é analista.`)

      setSelectedUser(null)

      const nextPage =
        role === "citizen" &&
        page > 1 &&
        filteredTotal - 1 <= (page - 1) * pageSize
          ? page - 1
          : page

      if (nextPage !== page) setPage(nextPage)
      else await loadUsers(undefined, nextPage)
    } catch (error) {
      const message = getErrorMessage(error)

      setChangeError(message)

      toast.error(message)
    } finally {
      requestLock.current = false

      setPendingUserId(null)
    }
  }

  const submitAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (adminRequestLock.current || creatingAdmin) return

    adminRequestLock.current = true

    setCreatingAdmin(true)

    try {
      const newAdmin = await createAdminUser({
        name: adminName,

        email: adminEmail,

        password: adminPassword,
      })

      toast.success(`A conta administradora de ${newAdmin.name} foi criada.`)

      setAdminName("")

      setAdminEmail("")

      setAdminPassword("")

      setPage(1)

      setRole("admin")

      setQuery("")
    } catch (error) {
      const message = getErrorMessage(error)

      toast.error(message)
    } finally {
      adminRequestLock.current = false

      setCreatingAdmin(false)
    }
  }

  if (authLoading) {
    return (
      <div
        className="min-h-[40vh] bg-[#F2F2F2] p-8 text-center text-[#091626] dark:bg-background dark:text-foreground"
        role="status"
      >
        Verificando acesso…
      </div>
    )
  }

  if (user?.role !== "admin") return <AdminAccessRequired />

  const pageCount = Math.max(1, Math.ceil(filteredTotal / pageSize))

  const metrics = [
    {
      label: "Total de usuários",
      value: summary.total,
      Icon: Users,
      accent: "#D9954A",
    },

    {
      label: "Usuários comuns",
      value: summary.common,
      Icon: UserRound,
      accent: "#31567D",
    },

    {
      label: "Analistas",
      value: summary.analysts,
      Icon: ShieldCheck,
      accent: "#7D9B76",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F2F2F2] px-4 py-8 text-[#091626] sm:px-6 md:py-12 dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          eyebrow="Administração"
          title="Gerenciamento de Usuários"
          description="Gerencie os usuários cadastrados na plataforma e controle quais contas possuem permissão para analisar ocorrências."
        />

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Indicadores de usuários"
        >
          {metrics.map(({ label, value, Icon, accent }) => (
            <Card
              key={label}
              className="relative overflow-hidden rounded-2xl border-gray-100 bg-white text-[#091626] shadow-[0_8px_24px_rgba(9,22,38,0.07)] dark:border-border dark:bg-card dark:text-card-foreground"
            >
              <CardContent className="relative flex items-center gap-4 py-5">
                <span
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F3F6F9] dark:bg-muted"
                  style={{ color: accent }}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-2xl font-semibold" aria-live="polite">
                    {loading || loadError ? "—" : value.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-muted-foreground">
                    {label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="rounded-2xl border-gray-100 bg-white text-[#091626] shadow-sm dark:border-border dark:bg-card dark:text-card-foreground">
          <CardContent className="space-y-5 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-[#0E2440] text-white">
                <UserPlus className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#091626] dark:text-foreground">
                  Criar conta administradora
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  A nova conta poderá gerenciar usuários e criar outros
                  administradores.
                </p>
              </div>
            </div>
            <form onSubmit={submitAdmin} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nome completo</Label>
                <Input
                  id="admin-name"
                  value={adminName}
                  onChange={(event) => setAdminName(event.target.value)}
                  minLength={2}
                  maxLength={120}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">E-mail</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  maxLength={254}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">
                  Senha (mínimo 12 caracteres)
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  minLength={12}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={creatingAdmin}>
                  {creatingAdmin ? "Criando conta…" : "Criar administrador"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-gray-100 bg-white text-[#091626] shadow-sm dark:border-border dark:bg-card dark:text-card-foreground">
          <CardContent className="space-y-5 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-[#0E2440] text-white">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold text-[#091626] dark:text-foreground">
                  Central de consulta
                </h2>
                <p className="text-xs text-gray-500 dark:text-muted-foreground">
                  Pesquise usuários e filtre por papel
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  aria-label="Pesquisar por nome ou e-mail"
                  placeholder="Buscar por nome ou e-mail"
                  value={query}
                  maxLength={120}
                  onChange={(event) => {
                    setPage(1)

                    setQuery(event.target.value)
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={role}
                onValueChange={(value) => {
                  if (
                    value !== "all" &&
                    value !== "admin" &&
                    value !== "analyst" &&
                    value !== "citizen"
                  )
                    return

                  setPage(1)

                  setRole(value)
                }}
              >
                <SelectTrigger aria-label="Filtrar por papel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="analyst">Analistas</SelectItem>
                  <SelectItem value="citizen">Usuários comuns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loadError ? (
              <div
                className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                <p>{loadError}</p>
                <Button
                  className="mt-3"
                  variant="outline"
                  onClick={() => void loadUsers()}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : loading ? (
              <div
                className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground"
                role="status"
              >
                <LoaderCircle
                  className="size-5 animate-spin"
                  aria-hidden="true"
                />
                Carregando usuários…
              </div>
            ) : users.length === 0 ? (
              <div
                className="py-14 text-center text-muted-foreground"
                role="status"
              >
                Nenhum usuário encontrado.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Papel atual</TableHead>
                        <TableHead className="text-right">
                          Ações disponíveis
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((listedUser) => (
                        <TableRow key={listedUser.id}>
                          <TableCell className="min-w-40 font-medium">
                            {listedUser.name}
                          </TableCell>
                          <TableCell className="min-w-56">
                            {listedUser.email}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${roleStyles[listedUser.role]}`}
                            >
                              {roleLabels[listedUser.role]}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {listedUser.role === "citizen" ? (
                              <Button
                                size="sm"
                                disabled={pendingUserId !== null}
                                onClick={() => {
                                  setChangeError("")

                                  setSelectedUser(listedUser)
                                }}
                              >
                                {pendingUserId === listedUser.id
                                  ? "Atualizando…"
                                  : "Tornar analista"}
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredTotal.toLocaleString("pt-BR")} usuário(s)
                    encontrado(s)
                  </p>
                  {pageCount > 1 && (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((value) => value - 1)}
                      >
                        <ChevronLeft aria-hidden="true" /> Anterior
                      </Button>
                      <span
                        className="text-sm text-muted-foreground"
                        aria-live="polite"
                      >
                        Página {page} de {pageCount}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= pageCount || loading}
                        onClick={() => setPage((value) => value + 1)}
                      >
                        Próxima <ChevronRight aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={selectedUser !== null}
          onOpenChange={(open) => {
            if (!open && pendingUserId === null) setSelectedUser(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tornar usuário analista?</AlertDialogTitle>
              <AlertDialogDescription>
                A conta existente receberá permissões para analisar ocorrências.
                Nenhuma outra informação ou histórico será alterado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {selectedUser && (
              <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                <div className="font-semibold text-foreground">
                  {selectedUser.name}
                </div>
                <div className="mt-1 break-all text-muted-foreground">
                  {selectedUser.email}
                </div>
              </div>
            )}
            {changeError && (
              <p className="text-sm text-destructive" role="alert">
                {changeError}
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pendingUserId !== null}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={pendingUserId !== null || !selectedUser}
                onClick={(event) => {
                  event.preventDefault()

                  void confirmPromotion()
                }}
              >
                {pendingUserId !== null ? "Atualizando…" : "Confirmar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

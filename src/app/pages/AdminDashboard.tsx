import { useState } from "react"
import { Link } from "react-router"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react"
import { occurrences } from "../data/mock"
import {
  AdminAccessRequired,
  PageHeader,
  PrototypeNotice,
  StatusBadge,
} from "../components/ProductUI"
import { useAuth } from "../auth/AuthProvider"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
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

const metrics = [
  {
    label: "Total registrado",
    value: "248",
    icon: AlertTriangle,
    tone: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    label: "Pendentes de análise",
    value: "37",
    icon: Clock3,
    tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    label: "Aprovadas",
    value: "164",
    icon: CheckCircle2,
    tone: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  },
  {
    label: "Rejeitadas",
    value: "47",
    icon: XCircle,
    tone: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
  },
]

export function AdminDashboard() {
  const { user, loading } = useAuth()
  const [status, setStatus] = useState("all")
  const [query, setQuery] = useState("")
  const filtered = occurrences.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      `${item.id} ${item.description} ${item.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )

  if (loading)
    return (
      <div
        className="min-h-[40vh] bg-[#F2F2F2] p-8 text-center text-[#091626] dark:bg-background dark:text-foreground"
        role="status"
      >
        Verificando acesso…
      </div>
    )
  if (user?.role !== "analyst" && user?.role !== "admin")
    return <AdminAccessRequired />

  return (
    <div className="min-h-screen bg-[#F2F2F2] px-4 py-8 text-[#091626] sm:px-6 md:py-12 dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          eyebrow={`Área restrita · ${
            user.role === "admin" ? "Administrador" : "Analista"
          }`}
          title="Painel de análise"
          description="Visão operacional demonstrativa, separada da experiência do cidadão. A autorização efetiva depende do back-end."
        />
        <PrototypeNotice />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border-gray-100 bg-white text-[#091626] shadow-[0_8px_24px_rgba(9,22,38,0.07)] dark:border-border dark:bg-card dark:text-card-foreground"
            >
              <CardContent className="relative flex items-center gap-4 py-5">
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-[#D9954A]"
                  aria-hidden="true"
                />
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${metric.tone}`}
                >
                  <metric.icon />
                </div>
                <div>
                  <div className="text-2xl font-semibold">{metric.value}</div>
                  <div className="text-sm text-gray-500 dark:text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl border-gray-100 bg-white text-[#091626] shadow-sm dark:border-border dark:bg-card dark:text-card-foreground">
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
                  Filtre e localize denúncias para análise
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-gray-400 dark:text-muted-foreground" />
                <Input
                  className="border-gray-200 bg-white text-[#091626] placeholder:text-gray-400 dark:border-border dark:bg-input-background dark:text-foreground dark:placeholder:text-muted-foreground pl-9"
                  placeholder="Buscar denúncia"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Recebida">Recebida</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filtered.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Identificador</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Registro</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell className="max-w-72 whitespace-normal">
                          {item.description}
                        </TableCell>
                        <TableCell>
                          {item.date}
                          <div className="text-xs text-muted-foreground">
                            {item.time}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-52 whitespace-normal">
                          {item.location}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm">
                            <Link to={`/admin/ocorrencias/${item.id}`}>
                              Analisar
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-14 text-center text-gray-500 dark:text-muted-foreground">
                Nenhum resultado para os filtros selecionados.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

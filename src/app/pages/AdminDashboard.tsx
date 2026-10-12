import { useState } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, CheckCircle2, Clock3, Search, XCircle } from 'lucide-react';
import { occurrences } from '../data/mock';
import { AdminAccessRequired, PageHeader, PrototypeNotice, StatusBadge } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const metrics = [
  { label: 'Total registrado', value: '248', icon: AlertTriangle, tone: 'bg-blue-50 text-blue-700' },
  { label: 'Pendentes de análise', value: '37', icon: Clock3, tone: 'bg-amber-50 text-amber-700' },
  { label: 'Aprovadas', value: '164', icon: CheckCircle2, tone: 'bg-green-50 text-green-700' },
  { label: 'Rejeitadas', value: '47', icon: XCircle, tone: 'bg-red-50 text-red-700' },
];

export function AdminDashboard() {
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = occurrences.filter(
    (item) =>
      (status === 'all' || item.status === status) &&
      `${item.id} ${item.description} ${item.location}`.toLowerCase().includes(query.toLowerCase()),
  );

  if (localStorage.getItem('mobcar-role') !== 'analyst') return <AdminAccessRequired />;

  return (
    <div className="min-h-screen bg-primary px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="[&_*]:border-white/20 [&_.text-foreground]:text-white [&_.text-muted-foreground]:text-slate-300">
          <PageHeader
            eyebrow="Área restrita · Analista"
            title="Painel de análise"
            description="Visão operacional demonstrativa, separada da experiência do cidadão. A autorização efetiva depende do back-end."
          />
        </div>
        <PrototypeNotice />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border-white/10 bg-white/5 text-white">
              <CardContent className="flex items-center gap-4 py-5">
                <div className={`flex size-11 items-center justify-center rounded-xl ${metric.tone}`}><metric.icon /></div>
                <div>
                  <div className="text-2xl font-semibold">{metric.value}</div>
                  <div className="text-sm text-slate-300">{metric.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-white/10 bg-white text-foreground">
          <CardContent className="space-y-5 py-6">
            <div className="grid gap-3 md:grid-cols-[1fr_200px_200px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar denúncia" value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Recebida">Recebida</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="30">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filtered.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identificador</TableHead><TableHead>Descrição</TableHead><TableHead>Registro</TableHead>
                    <TableHead>Localização</TableHead><TableHead>Status</TableHead><TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell className="max-w-72 whitespace-normal">{item.description}</TableCell>
                      <TableCell>{item.date}<div className="text-xs text-muted-foreground">{item.time}</div></TableCell>
                      <TableCell className="max-w-52 whitespace-normal">{item.location}</TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                      <TableCell><Button asChild size="sm"><Link to={`/admin/ocorrencias/${item.id}`}>Analisar</Link></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-14 text-center text-muted-foreground">Nenhum resultado para os filtros selecionados.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

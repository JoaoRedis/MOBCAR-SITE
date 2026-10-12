import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, FilePlus2, Search } from 'lucide-react';
import { occurrences } from '../data/mock';
import { PageHeader, StatusBadge } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export function Ocorrencias() {
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const visible = occurrences.filter(
    (item) =>
      (status === 'all' || item.status === status) &&
      `${item.id} ${item.description} ${item.location}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <PageHeader
            eyebrow="Área do cidadão"
            title="Minhas ocorrências"
            description="Acompanhe o status, os detalhes e o histórico permitido de cada registro."
          />
          <Button asChild>
            <Link to="/denunciar"><FilePlus2 /> Nova ocorrência</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-5">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar por protocolo, descrição ou local" value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue placeholder="Todos os status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Recebida">Recebida</SelectItem>
                  <SelectItem value="Em análise">Em análise</SelectItem>
                  <SelectItem value="Aprovada">Aprovada</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            {visible.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identificador</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Status provisório</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell className="max-w-64 whitespace-normal">{item.description}</TableCell>
                      <TableCell className="max-w-56 whitespace-normal">{item.location}</TableCell>
                      <TableCell>{item.date}<div className="text-xs text-muted-foreground">{item.time}</div></TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/ocorrencias/${item.id}`}><Eye /> Ver</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-14 text-center">
                <div className="font-medium">Nenhuma ocorrência encontrada</div>
                <div className="mt-2 text-sm text-muted-foreground">Ajuste os filtros ou registre uma nova ocorrência.</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

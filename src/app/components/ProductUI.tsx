import { Link } from 'react-router';
import { AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import type { OccurrenceStatus } from '../data/mock';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const statusStyles: Record<OccurrenceStatus, string> = {
  Recebida: 'bg-blue-50 text-blue-700 border-blue-200',
  'Em análise': 'bg-amber-50 text-amber-700 border-amber-200',
  Aprovada: 'bg-green-50 text-green-700 border-green-200',
  Rejeitada: 'bg-red-50 text-red-700 border-red-200',
};

export function StatusBadge({ status }: { status: OccurrenceStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  backTo,
}: {
  eyebrow: string;
  title: string;
  description: string;
  backTo?: string;
}) {
  return (
    <div className="space-y-4">
      {backTo && (
        <Button asChild variant="ghost" className="-ml-3 text-muted-foreground">
          <Link to={backTo}>
            <ArrowLeft />
            Voltar
          </Link>
        </Button>
      )}
      <Badge variant="secondary">{eyebrow}</Badge>
      <div className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</div>
      <div className="max-w-3xl text-base leading-relaxed text-muted-foreground">{description}</div>
    </div>
  );
}

export function PrototypeNotice() {
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <div>
        Ambiente demonstrativo: os dados, estados e ações desta tela não estão conectados a serviços
        reais.
      </div>
    </div>
  );
}

export function MapPlaceholder({
  compact = false,
  selected = true,
}: {
  compact?: boolean;
  selected?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-[linear-gradient(30deg,transparent_24%,rgba(166,114,70,.08)_25%,rgba(166,114,70,.08)_26%,transparent_27%,transparent_74%,rgba(166,114,70,.08)_75%,rgba(166,114,70,.08)_76%,transparent_77%),linear-gradient(90deg,rgba(14,36,64,.06)_1px,transparent_1px)] bg-[length:72px_72px,36px_36px] ${compact ? 'h-56' : 'h-72'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-secondary/10" />
      {selected && (
        <div className="absolute left-[56%] top-[42%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ring-8 ring-primary/10">
            <MapPin className="size-5" />
          </div>
        </div>
      )}
      <Badge className="absolute bottom-4 left-4 bg-white text-foreground shadow-sm" variant="outline">
        Prévia cartográfica · Distrito Federal
      </Badge>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-14 text-center">
        <div className="font-medium">{title}</div>
        <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}

export function AdminAccessRequired() {
  return (
    <div className="flex min-h-[600px] items-center justify-center bg-primary px-6 text-white">
      <Card className="max-w-lg text-center text-foreground">
        <CardContent className="py-12">
          <AlertCircle className="mx-auto size-12 text-secondary" />
          <div className="mt-5 text-2xl font-semibold">Acesso restrito</div>
          <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Esta área é exibida somente no contexto demonstrativo de analista. A autorização real
            deve ser garantida pelo back-end.
          </div>
          <Button asChild className="mt-7">
            <Link to="/login">Acessar demonstração de analista</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

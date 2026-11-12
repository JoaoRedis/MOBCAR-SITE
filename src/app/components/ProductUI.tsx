import { Link } from 'react-router';
import { AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import type { OccurrenceStatus } from '../data/mock';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/utils';

const statusStyles: Record<OccurrenceStatus, string> = {
  Recebida: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
  'Em análise': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  Aprovada: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900',
  Rejeitada: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
};

export function StatusBadge({ status }: { status: OccurrenceStatus }) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}

export function PageHeader({
  eyebrow,
  title,
  titleClassName,
  description,
  descriptionClassName,
  backTo,
}: {
  eyebrow: string;
  title: string;
  titleClassName?: string;
  description: string;
  descriptionClassName?: string;
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
      <h1 className={cn('text-3xl font-semibold tracking-tight text-foreground md:text-4xl', titleClassName)}>{title}</h1>
      <p className={cn('max-w-3xl text-base leading-relaxed text-muted-foreground', descriptionClassName)}>{description}</p>
    </div>
  );
}

export function PrototypeNotice() {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
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
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-[#F3F6F9] bg-[linear-gradient(30deg,transparent_24%,rgba(166,114,70,.08)_25%,rgba(166,114,70,.08)_26%,transparent_27%,transparent_74%,rgba(166,114,70,.08)_75%,rgba(166,114,70,.08)_76%,transparent_77%),linear-gradient(90deg,rgba(14,36,64,.06)_1px,transparent_1px)] bg-[length:72px_72px,36px_36px] dark:border-border dark:bg-muted ${compact ? 'h-56' : 'h-72'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-secondary/10 dark:from-background/20 dark:to-secondary/5" />
      {selected && (
        <div className="absolute left-[56%] top-[42%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ring-8 ring-primary/10">
            <MapPin className="size-5" />
          </div>
        </div>
      )}
      <Badge className="absolute bottom-4 left-4 bg-white text-foreground shadow-sm dark:bg-card" variant="outline">
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
    <div className="flex min-h-[600px] items-center justify-center bg-[#F2F2F2] px-6 text-[#091626] dark:bg-background dark:text-foreground">
      <Card className="max-w-lg text-center text-foreground">
        <CardContent className="py-12">
          <AlertCircle className="mx-auto size-12 text-secondary" />
          <div className="mt-5 text-2xl font-semibold">Acesso restrito</div>
          <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Esta área exige uma sessão válida com o papel necessário. A autorização é verificada pelo servidor.
          </div>
          <Button asChild className="mt-7">
            <Link to="/login">Entrar na plataforma</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

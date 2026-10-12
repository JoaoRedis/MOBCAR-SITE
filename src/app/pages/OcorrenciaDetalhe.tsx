import { Link, useParams } from 'react-router';
import { Clock3, FileImage, MapPin, UserRound } from 'lucide-react';
import { occurrences, timeline } from '../data/mock';
import { MapPlaceholder, PageHeader, PrototypeNotice, StatusBadge } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function OcorrenciaDetalhe() {
  const { id } = useParams();
  const item = occurrences.find((occurrence) => occurrence.id === id) ?? occurrences[0];

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <PageHeader
            eyebrow={item.id}
            title="Detalhes da ocorrência"
            description="Consulte as informações registradas, evidências e alterações visíveis para o cidadão."
            backTo="/ocorrencias"
          />
          <StatusBadge status={item.status} />
        </div>
        <PrototypeNotice />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Informações registradas</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="text-sm font-medium">Descrição</div>
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.fullDescription}</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium"><MapPin /> Localização</div>
                    <div className="mt-2 text-sm text-muted-foreground">{item.location}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium"><Clock3 /> Data e hora do sistema</div>
                    <div className="mt-2 text-sm text-muted-foreground">{item.date} · {item.time} · Horário de Brasília</div>
                  </div>
                </div>
                <MapPlaceholder compact />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileImage /> Evidências</CardTitle></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {item.evidence.map((file) => (
                  <div key={file} className="rounded-lg border bg-muted/30 p-4 text-sm">{file}</div>
                ))}
              </CardContent>
            </Card>
          </div>
          <Card className="h-fit">
            <CardHeader><CardTitle>Histórico e rastreabilidade</CardTitle></CardHeader>
            <CardContent>
              <div className="relative space-y-7 border-l pl-6">
                {timeline.map((event) => (
                  <div key={event.date} className="relative">
                    <div className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-secondary ring-4 ring-background" />
                    <div className="text-xs text-muted-foreground">{event.date}</div>
                    <div className="mt-1 font-medium">{event.title}</div>
                    <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{event.description}</div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><UserRound className="size-3" /> {event.actor}</div>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-7 w-full">
                <Link to="/notificacoes">Ver notificações relacionadas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

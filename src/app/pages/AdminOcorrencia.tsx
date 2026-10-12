import { useState } from 'react';
import { useParams } from 'react-router';
import { CheckCircle2, FileImage, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { occurrences, timeline, type OccurrenceStatus } from '../data/mock';
import { AdminAccessRequired, MapPlaceholder, PageHeader, PrototypeNotice, StatusBadge } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function AdminOcorrencia() {
  const { id } = useParams();
  const item = occurrences.find((occurrence) => occurrence.id === id) ?? occurrences[0];
  const [status, setStatus] = useState<OccurrenceStatus>(item.status);
  const [reason, setReason] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const canDecide = status === 'Recebida' || status === 'Em análise';

  if (localStorage.getItem('mobcar-role') !== 'analyst') return <AdminAccessRequired />;

  const decide = (next: OccurrenceStatus) => {
    setStatus(next);
    setRejectOpen(false);
    toast.success(`Status demonstrativo atualizado para ${next}`);
  };

  return (
    <div className="min-h-screen bg-primary px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between [&_.text-foreground]:text-white [&_.text-muted-foreground]:text-slate-300">
          <PageHeader
            eyebrow={`Análise · ${item.id}`}
            title="Avaliação da ocorrência"
            description="Compare descrição, localização, evidências e histórico antes de registrar uma decisão demonstrativa."
            backTo="/admin"
          />
          <StatusBadge status={status} />
        </div>
        <PrototypeNotice />
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Descrição e localização</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="font-medium">{item.description}</div>
                  <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.fullDescription}</div>
                </div>
                <div className="grid gap-3 rounded-lg bg-muted/50 p-4 text-sm sm:grid-cols-2">
                  <div><span className="font-medium">Local:</span> {item.location}</div>
                  <div><span className="font-medium">Registro:</span> {item.date} · {item.time}</div>
                </div>
                <MapPlaceholder />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileImage /> Evidências anexadas</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {item.evidence.map((file) => (
                  <div key={file} className="flex h-40 items-end rounded-xl border bg-gradient-to-br from-muted to-secondary/20 p-4 text-sm">{file}</div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Decisão do analista</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {canDecide ? (
                  <>
                    <div className="text-sm text-muted-foreground">A confirmação atualizará apenas este protótipo durante a sessão.</div>
                    <Dialog>
                      <DialogTrigger asChild><Button className="w-full"><CheckCircle2 /> Aprovar ocorrência</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Confirmar aprovação?</DialogTitle><DialogDescription>Esta ação demonstrativa mudará o status para Aprovada e será refletida visualmente.</DialogDescription></DialogHeader>
                        <DialogFooter><Button onClick={() => decide('Aprovada')}>Confirmar aprovação</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                      <DialogTrigger asChild><Button variant="destructive" className="w-full"><XCircle /> Rejeitar ocorrência</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Registrar rejeição</DialogTitle><DialogDescription>Informe uma justificativa objetiva antes de confirmar.</DialogDescription></DialogHeader>
                        <div className="space-y-2">
                          <Label htmlFor="reject-reason">Justificativa *</Label>
                          <Textarea id="reject-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explique o motivo da decisão" />
                          {!reason.trim() && <div className="text-sm text-destructive">A justificativa é obrigatória.</div>}
                        </div>
                        <DialogFooter><Button variant="destructive" disabled={!reason.trim()} onClick={() => decide('Rejeitada')}>Confirmar rejeição</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    Uma decisão já foi registrada. Novas ações não estão disponíveis para este status.
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Histórico</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                {timeline.map((event) => (
                  <div key={event.date} className="border-l-2 border-secondary pl-4">
                    <div className="text-xs text-muted-foreground">{event.date}</div>
                    <div className="mt-1 text-sm font-medium">{event.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{event.description}</div>
                  </div>
                ))}
                {status !== item.status && (
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-xs text-muted-foreground">Agora · interação demonstrativa</div>
                    <div className="mt-1 text-sm font-medium">{item.status} → {status}</div>
                    {reason && <div className="mt-1 text-xs text-muted-foreground">{reason}</div>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

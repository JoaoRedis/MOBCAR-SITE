import { useState } from 'react';
import { Link } from 'react-router';
import { Check, CheckCircle2, FileImage, FileText, Loader2, MapPin, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { MapPlaceholder, PageHeader, PrototypeNotice } from '../components/ProductUI';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

type Attachment = { name: string; size: number; type: string; error?: string };

const steps = ['Descrição', 'Localização', 'Evidências', 'Revisão'];

export function Denunciar() {
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [mapSelected, setMapSelected] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const locationReady = address.trim().length > 4 || mapSelected;
  const stepValid = step === 0 ? description.trim().length >= 20 : step === 1 ? locationReady : true;

  const chooseFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).map((file) => {
      const limit = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
      return {
        name: file.name,
        size: file.size,
        type: file.type.startsWith('video/') ? 'Vídeo' : 'Imagem',
        error: file.size > limit ? `Excede o limite de ${file.type.startsWith('video/') ? '100 MB' : '20 MB'}` : undefined,
      };
    });
    setFiles((current) => [...current, ...next]);
  };

  const submit = () => {
    if (files.some((file) => file.error)) {
      toast.error('Remova os anexos com erro antes de enviar.');
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 900);
  };

  if (submitted) {
    return (
      <div className="bg-background px-6 py-20">
        <Card className="mx-auto max-w-xl text-center shadow-xl">
          <CardContent className="py-12">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-50 text-green-700">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="mt-6 text-3xl font-semibold">Registro recebido</div>
            <div className="mx-auto mt-3 max-w-md text-muted-foreground">
              Esta confirmação é demonstrativa. O envio não equivale à confirmação oficial de uma infração.
            </div>
            <Badge className="mt-6 text-sm" variant="secondary">Protocolo MC-2026-0157</Badge>
            <div className="mt-3 text-xs text-muted-foreground">Data e hora geradas pelo sistema: 20 mar 2026 · 11:42 · Horário de Brasília</div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild><Link to="/ocorrencias/MC-2026-0142">Acompanhar ocorrência</Link></Button>
              <Button variant="outline" onClick={() => { setSubmitted(false); setStep(0); }}>Novo registro</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader
          eyebrow="Registro de ocorrência"
          title="Conte o que aconteceu"
          description="Organize descrição, localização e evidências em etapas. Você poderá revisar tudo antes do envio."
        />
        <PrototypeNotice />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((label, index) => (
            <div key={label} className={`rounded-lg border p-3 text-sm ${index === step ? 'border-secondary bg-secondary/10 font-medium' : index < step ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}>
              <div className="mb-1 flex items-center gap-2">
                <span className={`flex size-5 items-center justify-center rounded-full text-xs ${index <= step ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {index < step ? <Check className="size-3" /> : index + 1}
                </span>
                {label}
              </div>
            </div>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 0 && <FileText />}{step === 1 && <MapPin />}{step === 2 && <FileImage />}{step === 3 && <CheckCircle2 />}
              {steps[step]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <Label>Categoria da ocorrência</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Selecione, se aplicável" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estacionamento">Estacionamento irregular</SelectItem>
                      <SelectItem value="sinalizacao">Desrespeito à sinalização</SelectItem>
                      <SelectItem value="faixa">Bloqueio de faixa ou calçada</SelectItem>
                      <SelectItem value="outro">Outra situação</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground">Campo mantido conforme o protótipo existente; opcional.</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea id="description" className="min-h-40" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descreva a possível ocorrência e o contexto observado." aria-invalid={description.length > 0 && description.trim().length < 20} />
                  <div className={`text-xs ${description.length > 0 && description.trim().length < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    Mínimo de 20 caracteres · {description.length} digitados
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                  Informe um endereço ou selecione um ponto na prévia do mapa. Não é necessário usar os dois métodos.
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço ou ponto de referência</Label>
                  <Input id="address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Ex.: SQS 308, Asa Sul, Brasília — DF" />
                </div>
                <div className="space-y-3">
                  <MapPlaceholder selected={mapSelected} />
                  <Button variant="outline" onClick={() => setMapSelected((value) => !value)}>
                    <MapPin /> {mapSelected ? 'Remover ponto selecionado' : 'Selecionar ponto demonstrativo'}
                  </Button>
                  {mapSelected && <div className="text-sm text-muted-foreground">Ponto selecionado: -15.8112, -47.9017 · ajuste demonstrativo</div>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4"><div className="font-medium">Imagens</div><div className="mt-1 text-sm text-muted-foreground">Máximo de 20 MB por arquivo</div></div>
                  <div className="rounded-lg border p-4"><div className="font-medium">Vídeos</div><div className="mt-1 text-sm text-muted-foreground">Máximo de 100 MB por arquivo</div></div>
                </div>
                <Label htmlFor="evidence" className="flex cursor-pointer flex-col rounded-xl border-2 border-dashed p-10 text-center hover:border-secondary">
                  <Upload className="mx-auto size-8 text-muted-foreground" />
                  <span className="mt-3 font-medium">Selecionar imagens ou vídeos</span>
                  <span className="mt-1 text-xs font-normal text-muted-foreground">Limites individuais; formatos dependem da definição técnica do projeto.</span>
                  <Input id="evidence" type="file" multiple accept="image/*,video/*" className="sr-only" onChange={(event) => chooseFiles(event.target.files)} />
                </Label>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className={`flex items-center gap-4 rounded-lg border p-4 ${file.error ? 'border-destructive/40 bg-destructive/5' : ''}`}>
                      <FileImage className="size-5 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{file.name}</div>
                        <div className={`text-xs ${file.error ? 'text-destructive' : 'text-muted-foreground'}`}>{file.type} · {(file.size / 1024 / 1024).toFixed(1)} MB {file.error && `· ${file.error}`}</div>
                        {!file.error && <Progress value={100} className="mt-2" />}
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))} aria-label={`Remover ${file.name}`}><Trash2 /></Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-5"><div className="text-sm font-medium">Descrição</div><div className="mt-2 text-sm text-muted-foreground">{description}</div>{category && <Badge className="mt-3" variant="outline">{category}</Badge>}</div>
                <div className="rounded-xl border p-5"><div className="text-sm font-medium">Localização</div><div className="mt-2 text-sm text-muted-foreground">{address || 'Ponto selecionado no mapa'}{mapSelected && ' · -15.8112, -47.9017'}</div></div>
                <div className="rounded-xl border p-5 md:col-span-2"><div className="text-sm font-medium">Evidências</div><div className="mt-2 text-sm text-muted-foreground">{files.length ? `${files.length} arquivo(s) selecionado(s)` : 'Nenhuma evidência anexada'}</div></div>
                <div className="rounded-xl bg-muted/60 p-5 text-sm text-muted-foreground md:col-span-2">A data e a hora do registro serão geradas automaticamente pelo sistema no envio.</div>
              </div>
            )}

            {!stepValid && step === 1 && <div className="text-sm text-destructive">Informe um endereço ou selecione um ponto no mapa.</div>}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
              <Button variant="outline" disabled={step === 0 || sending} onClick={() => setStep((current) => current - 1)}>Voltar</Button>
              {step < 3 ? (
                <Button disabled={!stepValid} onClick={() => setStep((current) => current + 1)}>Continuar</Button>
              ) : (
                <Button disabled={sending} onClick={submit}>{sending ? <><Loader2 className="animate-spin" /> Enviando…</> : 'Enviar registro'}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

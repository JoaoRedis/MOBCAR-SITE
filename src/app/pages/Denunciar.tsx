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
import { regioesAdministrativas } from '../data/regioesAdministrativas';

type Attachment = { name: string; size: number; type: string; error?: string };

const steps = ['Descrição', 'Localização', 'Evidências', 'Revisão'];

export function Denunciar() {
  const [step, setStep] = useState(0);
  const [stepAttempted, setStepAttempted] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [administrativeRegion, setAdministrativeRegion] = useState('');
  const [address, setAddress] = useState('');
  const [mapSelected, setMapSelected] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const locationReady = administrativeRegion !== '' && (address.trim().length > 4 || mapSelected);
  const stepValid = step === 0 ? description.trim().length >= 20 : step === 1 ? locationReady : true;
  const descriptionValid = description.trim().length >= 20;
  const addressValid = address.trim().length > 4;

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
          descriptionClassName="text-slate-700 dark:text-slate-300"
        />
        <PrototypeNotice />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((label, index) => (
            <div key={label} aria-current={index === step ? 'step' : undefined} className={`rounded-lg border p-3 text-sm ${index === step ? 'border-secondary bg-secondary/10 font-medium' : index < step ? 'bg-muted text-foreground' : 'text-slate-700 dark:text-slate-300'}`}>
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
            <CardTitle id="report-step-title" aria-live="polite" className="flex items-center gap-2">
              {step === 0 && <FileText />}{step === 1 && <MapPin />}{step === 2 && <FileImage />}{step === 3 && <CheckCircle2 />}
              {steps[step]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    Categoria da ocorrência
                    <span className="text-xs font-normal text-slate-600 dark:text-slate-300">Opcional</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className={`h-11 border-slate-300 bg-white text-foreground placeholder:text-slate-500 transition-colors focus-visible:border-primary focus-visible:ring-primary/20 dark:border-border dark:bg-input-background ${category ? 'border-green-700 bg-green-50 dark:border-green-500 dark:bg-green-950/20' : ''}`}>
                      <SelectValue placeholder="Selecione uma categoria, se aplicável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estacionamento">Estacionamento irregular</SelectItem>
                      <SelectItem value="sinalizacao">Desrespeito à sinalização</SelectItem>
                      <SelectItem value="faixa">Bloqueio de faixa ou calçada</SelectItem>
                      <SelectItem value="outro">Outra situação</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-slate-700 dark:text-slate-300">Escolha a categoria que melhor descreve a situação. Você também pode deixar este campo em branco.</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição <span className="text-destructive" aria-hidden="true">*</span></Label>
                  <p id="description-instructions" className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    Informe o que aconteceu, quais veículos estão envolvidos e se existem condições que possam afetar o trânsito.
                  </p>
                  <Textarea
                    id="description"
                    className={`min-h-40 rounded-lg border-slate-300 bg-white text-foreground placeholder:text-slate-500 transition-colors focus-visible:border-primary focus-visible:ring-primary/20 dark:border-border dark:bg-input-background ${descriptionValid ? 'border-green-700 bg-green-50 dark:border-green-500 dark:bg-green-950/20' : ''} ${stepAttempted && !descriptionValid ? 'border-destructive bg-destructive/5 focus-visible:border-destructive focus-visible:ring-destructive/20' : ''}`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descreva o que aconteceu..."
                    aria-required="true"
                    aria-invalid={stepAttempted && !descriptionValid}
                    aria-describedby="description-instructions description-example description-help"
                  />
                  <div id="description-help" className={`text-sm ${stepAttempted && !descriptionValid ? 'text-destructive' : descriptionValid ? 'text-green-800 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {stepAttempted && !descriptionValid
                      ? 'A descrição precisa ter pelo menos 20 caracteres.'
                      : `Mínimo de 20 caracteres · ${description.length} digitados`}
                  </div>
                  <div id="description-example" className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 dark:border-border dark:bg-muted/50 dark:text-slate-300">
                    <span className="font-medium text-foreground">Exemplo:</span> “Um carro colidiu com uma motocicleta em um cruzamento. Os veículos estão ocupando uma das faixas e o trânsito está parcialmente bloqueado.”
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                  Selecione a Região Administrativa e informe um endereço ou selecione um ponto na prévia do mapa.
                </div>
                <div className="space-y-2">
                  <Label htmlFor="administrative-region">Região Administrativa <span className="text-destructive" aria-hidden="true">*</span></Label>
                  <Select value={administrativeRegion} onValueChange={setAdministrativeRegion}>
                    <SelectTrigger
                      id="administrative-region"
                      className={`h-11 border-slate-300 bg-white text-foreground transition-colors focus-visible:border-primary focus-visible:ring-primary/20 dark:border-border dark:bg-input-background ${administrativeRegion ? 'border-green-700 bg-green-50 dark:border-green-500 dark:bg-green-950/20' : ''} ${stepAttempted && !administrativeRegion ? 'border-destructive bg-destructive/5 focus-visible:border-destructive focus-visible:ring-destructive/20' : ''}`}
                      aria-required="true"
                      aria-invalid={stepAttempted && !administrativeRegion}
                      aria-describedby={stepAttempted && !administrativeRegion ? 'region-error' : 'region-help'}
                    >
                      <SelectValue placeholder="Selecione uma região do DF" />
                    </SelectTrigger>
                    <SelectContent>
                      {regioesAdministrativas.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {stepAttempted && !administrativeRegion
                    ? <div id="region-error" className="text-sm text-destructive">Selecione uma Região Administrativa.</div>
                    : <div id="region-help" className="text-sm text-slate-700 dark:text-slate-300">Escolha a região onde a ocorrência foi observada.</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço ou ponto de referência <span className="text-destructive" aria-hidden="true">*</span></Label>
                  <Input
                    id="address"
                    className={`h-11 rounded-lg border-slate-300 bg-white text-foreground placeholder:text-slate-500 transition-colors focus-visible:border-primary focus-visible:ring-primary/20 dark:border-border dark:bg-input-background ${addressValid ? 'border-green-700 bg-green-50 dark:border-green-500 dark:bg-green-950/20' : ''} ${stepAttempted && !mapSelected && !addressValid ? 'border-destructive bg-destructive/5 focus-visible:border-destructive focus-visible:ring-destructive/20' : ''}`}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Ex.: SQS 308, Asa Sul"
                    aria-describedby={stepAttempted && !mapSelected && !addressValid ? 'address-error' : 'address-help'}
                    aria-invalid={stepAttempted && !mapSelected && !addressValid}
                  />
                  {stepAttempted && !mapSelected && !addressValid
                    ? <div id="address-error" className="text-sm text-destructive">Informe um endereço com pelo menos 5 caracteres ou selecione um ponto no mapa.</div>
                    : <div id="address-help" className="text-sm text-slate-700 dark:text-slate-300">Informe uma rua, número ou referência próxima. Obrigatório se não selecionar um ponto no mapa.</div>}
                </div>
                <div className="space-y-3">
                  <MapPlaceholder selected={mapSelected} />
                  <Button variant="outline" onClick={() => setMapSelected((value) => !value)}>
                    <MapPin /> {mapSelected ? 'Remover ponto selecionado' : 'Selecionar ponto demonstrativo'}
                  </Button>
                  {mapSelected && <div role="status" className="text-sm text-muted-foreground">Ponto selecionado: -15.8112, -47.9017 · localização demonstrativa</div>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4"><div className="font-medium">Imagens</div><div className="mt-1 text-sm text-muted-foreground">Máximo de 20 MB por arquivo</div></div>
                  <div className="rounded-lg border p-4"><div className="font-medium">Vídeos</div><div className="mt-1 text-sm text-muted-foreground">Máximo de 100 MB por arquivo</div></div>
                </div>
                <Label htmlFor="evidence" className="flex cursor-pointer flex-col rounded-xl border-2 border-dashed p-10 text-center hover:border-secondary focus-within:ring-2 focus-within:ring-ring">
                  <Upload className="mx-auto size-8 text-muted-foreground" />
                  <span className="mt-3 font-medium">Selecionar imagens ou vídeos</span>
                  <span className="mt-1 text-xs font-normal text-muted-foreground">Limites individuais; formatos dependem da definição técnica do projeto.</span>
                  <Input id="evidence" type="file" multiple accept="image/*,video/*" className="sr-only" onChange={(event) => chooseFiles(event.target.files)} />
                </Label>
                <div className="space-y-3" aria-live="polite">
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
                <div className="rounded-xl border p-5"><div className="text-sm font-medium">Localização</div><div className="mt-2 text-sm text-muted-foreground">{administrativeRegion} · {address || 'Ponto selecionado no mapa'}{mapSelected && ' · -15.8112, -47.9017'}</div></div>
                <div className="rounded-xl border p-5 md:col-span-2"><div className="text-sm font-medium">Evidências</div><div className="mt-2 text-sm text-muted-foreground">{files.length ? `${files.length} arquivo(s) selecionado(s)` : 'Nenhuma evidência anexada'}</div></div>
                <div className="rounded-xl bg-muted/60 p-5 text-sm text-muted-foreground md:col-span-2">A data e a hora do registro serão geradas automaticamente pelo sistema no envio.</div>
              </div>
            )}

            {stepAttempted && !stepValid && (
              <div role="alert" className="text-sm text-destructive">
                {step === 0
                  ? 'Descreva a ocorrência com pelo menos 20 caracteres antes de continuar.'
                  : 'Para continuar, selecione uma Região Administrativa e informe um endereço ou ponto no mapa.'}
              </div>
            )}
            <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
              <Button variant="outline" disabled={step === 0 || sending} onClick={() => { setStepAttempted(false); setStep((current) => current - 1); }}>Voltar</Button>
              {step < 3 ? (
                <Button onClick={() => {
                  if (!stepValid) {
                    setStepAttempted(true);
                    return;
                  }
                  setStepAttempted(false);
                  setStep((current) => current + 1);
                }}>Continuar</Button>
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

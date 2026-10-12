import { useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader, PrototypeNotice } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Cadastro() {
  const [submitted, setSubmitted] = useState(false);
  const [invalid, setInvalid] = useState(false);

  if (submitted) {
    return (
      <div className="bg-background px-6 py-20">
        <Card className="mx-auto max-w-lg text-center shadow-xl">
          <CardContent className="py-12">
            <CheckCircle2 className="mx-auto size-14 text-green-700" />
            <div className="mt-5 text-2xl font-semibold">Cadastro demonstrativo concluído</div>
            <div className="mt-3 text-muted-foreground">
              Seus dados não foram armazenados. Continue para simular o acesso à plataforma.
            </div>
            <Button asChild className="mt-7">
              <Link to="/login">Ir para o login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHeader
          eyebrow="Nova conta"
          title="Crie seu acesso ao MobCar"
          description="Preencha os dados básicos. O CPF está representado para validação do fluxo, mas sua obrigatoriedade depende da definição do projeto."
          backTo="/login"
        />
        <PrototypeNotice />
        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input id="name" aria-invalid={invalid} placeholder="Como você gostaria de ser identificado" />
              {invalid && <div className="text-sm text-destructive">Informe seu nome completo.</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" />
              <div className="text-xs text-muted-foreground">Obrigatoriedade pendente de confirmação.</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(61) 99999-9999" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" aria-invalid={invalid} placeholder="voce@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input id="password" type="password" placeholder="Defina uma senha" />
              <div className="text-xs text-muted-foreground">Regras de senha ainda não definidas.</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirm">Confirmar senha *</Label>
              <Input id="password-confirm" type="password" placeholder="Repita a senha" />
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <Button
                onClick={() => {
                  if (!invalid) setInvalid(true);
                  else setSubmitted(true);
                }}
              >
                Criar conta
              </Button>
              <Button asChild variant="outline">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

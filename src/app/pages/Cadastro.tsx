import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader, PrototypeNotice } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Cadastro() {
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const errors = {
    name: values.name.trim() ? '' : 'Informe seu nome completo.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? '' : 'Informe um e-mail válido.',
    password: values.password ? '' : 'Informe uma senha.',
    passwordConfirm: values.passwordConfirm === values.password && values.passwordConfirm
      ? ''
      : 'As senhas devem ser iguais.',
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    if (!hasErrors) setSubmitted(true);
  };

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
          <form onSubmit={submit} noValidate>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input id="name" value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} aria-invalid={attempted && Boolean(errors.name)} aria-describedby={attempted && errors.name ? 'name-error' : undefined} required placeholder="Como você gostaria de ser identificado" />
              {attempted && errors.name && <div id="name-error" className="text-sm text-destructive">{errors.name}</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" />
              <div className="text-xs text-muted-foreground">Opcional nesta demonstração.</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(61) 99999-9999" />
              <div className="text-xs text-muted-foreground">Opcional.</div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} aria-invalid={attempted && Boolean(errors.email)} aria-describedby={attempted && errors.email ? 'email-error' : undefined} required placeholder="voce@exemplo.com" />
              {attempted && errors.email && <div id="email-error" className="text-sm text-destructive">{errors.email}</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input id="password" type="password" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} aria-invalid={attempted && Boolean(errors.password)} aria-describedby={attempted && errors.password ? 'password-error' : undefined} required placeholder="Defina uma senha" />
              {attempted && errors.password && <div id="password-error" className="text-sm text-destructive">{errors.password}</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirm">Confirmar senha *</Label>
              <Input id="password-confirm" type="password" value={values.passwordConfirm} onChange={(event) => setValues((current) => ({ ...current, passwordConfirm: event.target.value }))} aria-invalid={attempted && Boolean(errors.passwordConfirm)} aria-describedby={attempted && errors.passwordConfirm ? 'password-confirm-error' : undefined} required placeholder="Repita a senha" />
              {attempted && errors.passwordConfirm && <div id="password-confirm-error" className="text-sm text-destructive">{errors.passwordConfirm}</div>}
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <Button type="submit">
                Criar conta
              </Button>
              <Button asChild variant="outline">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
          </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { registerRequest } from '../auth/api';
import { PageHeader } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Cadastro() {
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    createAdmin: false,
    adminSetupToken: '',
  });
  const errors = {
    name: values.name.trim() ? '' : 'Informe seu nome completo.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? '' : 'Informe um e-mail válido.',
    password: values.password.length >= 12 ? '' : 'A senha deve ter pelo menos 12 caracteres.',
    passwordConfirm: values.passwordConfirm === values.password && values.passwordConfirm
      ? ''
      : 'As senhas devem ser iguais.',
    adminSetupToken: !values.createAdmin || values.adminSetupToken.length >= 32
      ? ''
      : 'Informe o código de configuração com pelo menos 32 caracteres.',
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    setSubmissionError('');
    if (hasErrors) return;

    setLoading(true);
    try {
      const registeredUser = await registerRequest(
        values.name.trim(),
        values.email,
        values.password,
        values.createAdmin ? values.adminSetupToken : undefined,
      );
      if (values.createAdmin && registeredUser.role !== 'admin') {
        const message = 'O servidor ainda não confirmou a criação como administradora. Reinicie o servidor da API e tente novamente. Se esta conta já foi cadastrada, use o mesmo e-mail e senha.';
        setSubmissionError(message);
        toast.error(message);
        return;
      }
      setSubmitted(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Não foi possível concluir o cadastro.';
      setSubmissionError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-background px-6 py-20">
        <Card className="mx-auto max-w-lg text-center shadow-xl">
          <CardContent className="py-12">
            <CheckCircle2 className="mx-auto size-14 text-green-700" />
            <div className="mt-5 text-2xl font-semibold">Cadastro concluído</div>
            <div className="mt-3 text-muted-foreground">
              {values.createAdmin
                ? 'A conta administradora foi criada. Entre com seu e-mail e senha para acessar o MobCar.'
                : 'Sua conta foi criada. Entre com seu e-mail e senha para acessar o MobCar.'}
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
          description="Preencha seus dados básicos para criar uma conta no MobCar."
          backTo="/login"
        />
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
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} className="pr-10" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} aria-invalid={attempted && Boolean(errors.password)} aria-describedby={attempted && errors.password ? 'password-error' : undefined} required placeholder="Defina uma senha" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {attempted && errors.password && <div id="password-error" className="text-sm text-destructive">{errors.password}</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-confirm">Confirmar senha *</Label>
              <div className="relative">
                <Input id="password-confirm" type={showPasswordConfirm ? 'text' : 'password'} className="pr-10" value={values.passwordConfirm} onChange={(event) => setValues((current) => ({ ...current, passwordConfirm: event.target.value }))} aria-invalid={attempted && Boolean(errors.passwordConfirm)} aria-describedby={attempted && errors.passwordConfirm ? 'password-confirm-error' : undefined} required placeholder="Repita a senha" />
                <button type="button" onClick={() => setShowPasswordConfirm((visible) => !visible)} aria-label={showPasswordConfirm ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'} aria-pressed={showPasswordConfirm} className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {showPasswordConfirm ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {attempted && errors.passwordConfirm && <div id="password-confirm-error" className="text-sm text-destructive">{errors.passwordConfirm}</div>}
            </div>
            <div className="space-y-3 rounded-lg border p-4 md:col-span-2">
              <Button
                type="button"
                variant={values.createAdmin ? 'default' : 'outline'}
                aria-pressed={values.createAdmin}
                onClick={() => setValues((current) => ({ ...current, createAdmin: !current.createAdmin }))}
              >
                <ShieldCheck aria-hidden="true" />
                {values.createAdmin ? 'Conta administradora inicial selecionada' : 'Criar esta conta como administradora'}
              </Button>
              {values.createAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="admin-setup-token">Código de configuração</Label>
                  <Input
                    id="admin-setup-token"
                    type="password"
                    autoComplete="off"
                    value={values.adminSetupToken}
                    onChange={(event) => setValues((current) => ({ ...current, adminSetupToken: event.target.value }))}
                    aria-invalid={attempted && Boolean(errors.adminSetupToken)}
                    aria-describedby={attempted && errors.adminSetupToken ? 'admin-setup-token-error' : undefined}
                    required
                    minLength={32}
                    placeholder="Código fornecido pelo responsável pela instalação"
                  />
                  {attempted && errors.adminSetupToken && <div id="admin-setup-token-error" className="text-sm text-destructive">{errors.adminSetupToken}</div>}
                  <p className="text-xs text-muted-foreground">
                    No modo de demonstração local, use o código padrão <code className="rounded bg-muted px-1 py-0.5">mobcar-demo-admin-setup-2026-local</code>.
                    Se este e-mail já foi cadastrado como usuário comum, informe a mesma senha para promover a conta. Em produção, é necessário configurar um código secreto no servidor.
                  </p>
                </div>
              )}
            </div>
            {submissionError && <p role="alert" className="text-sm text-destructive md:col-span-2">{submissionError}</p>}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando conta…' : 'Criar conta'}
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

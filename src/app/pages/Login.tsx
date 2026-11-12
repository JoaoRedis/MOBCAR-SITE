import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../auth/AuthProvider';
import { PageHeader } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const enter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await signIn(email, password);
      toast.success('Sessão iniciada');
      navigate(user.role === 'admin' ? '/admin/usuarios' : user.role === 'analyst' ? '/admin' : '/perfil');
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Não foi possível entrar.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Acesso à plataforma"
            title="Entre para acompanhar seus registros"
            description="Entre com seu e-mail e senha para acessar sua conta no MobCar."
          />
        </div>
        <Card className="shadow-xl">
          <CardHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-secondary/30">
              <LockKeyhole className="size-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Entrar</CardTitle>
          </CardHeader>
          <form onSubmit={enter}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="pr-10"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                  </button>
                </div>
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading} aria-live="polite">
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>
            </CardContent>
          </form>
          <CardContent className="pt-0">
            <div className="text-center text-sm text-muted-foreground">
              Ainda não possui conta?{' '}
              <Button asChild variant="link" className="h-auto p-0">
                <Link to="/cadastro">Criar cadastro</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

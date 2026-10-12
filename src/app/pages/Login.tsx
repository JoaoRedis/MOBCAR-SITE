import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, PrototypeNotice } from '../components/ProductUI';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const enter = (role: 'citizen' | 'analyst') => {
    setLoading(true);
    window.setTimeout(() => {
      localStorage.setItem('mobcar-role', role);
      window.dispatchEvent(new Event('mobcar-auth'));
      toast.success(role === 'analyst' ? 'Perfil de analista ativado' : 'Sessão demonstrativa iniciada');
      navigate(role === 'analyst' ? '/admin' : '/perfil');
    }, 650);
  };

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Acesso à plataforma"
            title="Entre para acompanhar seus registros"
            description="Use a demonstração para navegar pelos fluxos de cidadão ou analista. Nenhuma autenticação real é realizada."
          />
          <PrototypeNotice />
        </div>
        <Card className="shadow-xl">
          <CardHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-secondary/30">
              <LockKeyhole className="size-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Entrar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email">E-mail ou CPF</Label>
              <Input id="login-email" placeholder="voce@exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <div className="relative">
                <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <Button className="w-full" disabled={loading} onClick={() => enter('citizen')}>
              {loading ? 'Entrando…' : 'Entrar como cidadão'}
            </Button>
            <Button className="w-full" variant="outline" disabled={loading} onClick={() => enter('analyst')}>
              Acessar demonstração de analista
            </Button>
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

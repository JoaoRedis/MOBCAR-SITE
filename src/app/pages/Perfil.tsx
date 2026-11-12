import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LogOut, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { occurrences } from '../data/mock';
import { useAuth } from '../auth/AuthProvider';
import { PageHeader, StatusBadge } from '../components/ProductUI';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';

export function Perfil() {
  const navigate = useNavigate();
  const { promoteToAdmin, signOut, user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [adminSetupToken, setAdminSetupToken] = useState('mobcar-demo-admin-setup-2026-local');
  const [promotionError, setPromotionError] = useState('');
  const initials = user?.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase('pt-BR'))
    .join('') || 'US';
  const logout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : 'Não foi possível encerrar a sessão.');
    } finally {
      setLoggingOut(false);
    }
  };

  const promoteAccount = async () => {
    setPromoting(true);
    setPromotionError('');
    try {
      await promoteToAdmin(adminSetupToken);
      toast.success('Sua conta agora é administradora.');
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Não foi possível promover a conta.';
      setPromotionError(message);
      toast.error(message);
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          eyebrow="Área do cidadão"
          title="Seu perfil"
          description="Gerencie informações privadas, preferências e consulte um resumo das suas ocorrências."
        />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="h-fit">
            <CardContent className="py-7 text-center">
              <Avatar className="mx-auto size-20">
                <AvatarFallback className="bg-primary text-xl text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="mt-4 text-xl font-semibold">{user?.name ?? 'Usuário'}</div>
              <div className="mt-1 text-sm text-muted-foreground">{user?.email ?? 'Informação privada da conta'}</div>
              <Badge className="mt-4" variant="secondary">
                <ShieldCheck /> {user?.role === 'admin' ? 'Administrador' : user?.role === 'analyst' ? 'Analista' : 'Nível Colaborador'}
              </Badge>
              <div className="mt-6 text-left">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Progresso ilustrativo</span>
                  <span className="text-muted-foreground">65%</span>
                </div>
                <Progress value={65} />
                <div className="mt-2 text-xs text-muted-foreground">
                  Regras de níveis e benefícios ainda não foram definidas.
                </div>
              </div>
              <Button variant="outline" className="mt-6 w-full" onClick={logout} disabled={loggingOut}>
                <LogOut /> {loggingOut ? 'Saindo…' : 'Sair da conta'}
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserRound /> Dados pessoais</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nome</Label>
                  <Input id="profile-name" defaultValue={user?.name ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">E-mail</Label>
                  <Input id="profile-email" defaultValue={user?.email ?? ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Telefone</Label>
                  <Input id="profile-phone" defaultValue="(61) 99999-0000" />
                </div>
                <div className="flex items-end">
                  <Button><Settings /> Salvar alterações</Button>
                </div>
              </CardContent>
            </Card>
            {user?.role === 'citizen' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShieldCheck /> Acesso de administrador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Informe o código de administração configurado no servidor para dar acesso administrativo a esta conta. No modo de demonstração local, use <code className="rounded bg-muted px-1 py-0.5">mobcar-demo-admin-setup-2026-local</code>. Qualquer pessoa com esse código pode obter acesso administrativo; mantenha-o privado.
                  </p>
                  <div className="max-w-xl space-y-2">
                    <Label htmlFor="admin-setup-token">Código de configuração</Label>
                    <Input
                      id="admin-setup-token"
                      type="password"
                      autoComplete="off"
                      value={adminSetupToken}
                      onChange={(event) => setAdminSetupToken(event.target.value)}
                      minLength={32}
                      aria-describedby={promotionError ? 'admin-promotion-error' : undefined}
                    />
                  </div>
                  {promotionError && <p id="admin-promotion-error" className="text-sm text-destructive" role="alert">{promotionError}</p>}
                  <Button onClick={promoteAccount} disabled={promoting || adminSetupToken.length < 32}>
                    <ShieldCheck aria-hidden="true" />
                    {promoting ? 'Atualizando conta…' : 'Tornar minha conta administradora'}
                  </Button>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Ocorrências recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {occurrences.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-medium">{item.id}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={item.status} />
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/ocorrencias/${item.id}`}>Detalhes</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button asChild variant="link" className="px-0">
                  <Link to="/ocorrencias">Ver todo o histórico</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

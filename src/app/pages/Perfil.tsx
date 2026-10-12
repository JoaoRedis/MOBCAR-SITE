import { Link, useNavigate } from 'react-router';
import { LogOut, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { occurrences } from '../data/mock';
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
  const logout = () => {
    localStorage.removeItem('mobcar-role');
    window.dispatchEvent(new Event('mobcar-auth'));
    navigate('/');
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
                <AvatarFallback className="bg-primary text-xl text-primary-foreground">AS</AvatarFallback>
              </Avatar>
              <div className="mt-4 text-xl font-semibold">Ana Souza</div>
              <div className="mt-1 text-sm text-muted-foreground">Informação privada da conta</div>
              <Badge className="mt-4" variant="secondary">
                <ShieldCheck /> Nível Colaborador
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
              <Button variant="outline" className="mt-6 w-full" onClick={logout}>
                <LogOut /> Sair da conta
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
                  <Input id="profile-name" defaultValue="Ana Souza" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">E-mail</Label>
                  <Input id="profile-email" defaultValue="ana.souza@exemplo.com" />
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

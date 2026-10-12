import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ComoFunciona } from './pages/ComoFunciona';
import { Denunciar } from './pages/Denunciar';
import { Estatisticas } from './pages/Estatisticas';
import { SobreProjeto } from './pages/SobreProjeto';
import { APIParcerias } from './pages/APIParcerias';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Perfil } from './pages/Perfil';
import { Ocorrencias } from './pages/Ocorrencias';
import { OcorrenciaDetalhe } from './pages/OcorrenciaDetalhe';
import { Notificacoes } from './pages/Notificacoes';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminOcorrencia } from './pages/AdminOcorrencia';
import { Button } from './components/ui/button';
import { Link } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'como-funciona', Component: ComoFunciona },
      { path: 'denunciar', Component: Denunciar },
      { path: 'estatisticas', Component: Estatisticas },
      { path: 'sobre', Component: SobreProjeto },
      { path: 'api-parcerias', Component: APIParcerias },
      { path: 'login', Component: Login },
      { path: 'cadastro', Component: Cadastro },
      { path: 'perfil', Component: Perfil },
      { path: 'ocorrencias', Component: Ocorrencias },
      { path: 'ocorrencias/:id', Component: OcorrenciaDetalhe },
      { path: 'notificacoes', Component: Notificacoes },
      { path: 'admin', Component: AdminDashboard },
      { path: 'admin/ocorrencias/:id', Component: AdminOcorrencia },
      {
        path: '*',
        Component: () => (
          <div className="flex min-h-[600px] items-center justify-center bg-background">
            <div className="text-center">
              <div className="mb-4 text-3xl font-semibold">404 — Página não encontrada</div>
              <div className="mb-6 text-muted-foreground">A página que você está procurando não existe.</div>
              <Button asChild><Link to="/">Voltar para o início</Link></Button>
            </div>
          </div>
        )
      }
    ]
  }
], { basename: import.meta.env.BASE_URL });

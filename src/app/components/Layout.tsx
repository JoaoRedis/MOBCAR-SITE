import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { Bell, FilePlus2, LayoutDashboard, LogIn, Menu, UserRound, X } from 'lucide-react';
import logo from '../../imports/image.png';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const mainLinks = [
  { to: '/', label: 'Início' },
  { to: '/denunciar', label: 'Registrar ocorrência' },
  { to: '/ocorrencias', label: 'Minhas ocorrências' },
  { to: '/estatisticas', label: 'Estatísticas' },
];

const footerLinks = [
  { to: '/como-funciona', label: 'Como funciona' },
  { to: '/sobre', label: 'Sobre o MobCar' },
  { to: '/api-parcerias', label: 'API & Parcerias' },
];

export function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState(() => localStorage.getItem('mobcar-role'));
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const update = () => setRole(localStorage.getItem('mobcar-role'));
    window.addEventListener('mobcar-auth', update);
    return () => window.removeEventListener('mobcar-auth', update);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const active = (to: string) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className={`sticky top-0 z-50 border-b px-5 py-3 shadow-sm ${isAdmin ? 'border-white/10 bg-primary text-white' : 'bg-white/95 text-foreground backdrop-blur'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="shrink-0">
            <img src={logo} alt="MobCar" className={`h-11 w-auto object-contain ${isAdmin ? '' : 'rounded-lg bg-primary px-2'}`} />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {(isAdmin ? [{ to: '/admin', label: 'Visão geral' }] : mainLinks).map((link) => (
              <Button key={link.to} asChild variant="ghost" className={active(link.to) ? (isAdmin ? 'bg-white/10 text-white' : 'bg-secondary/20') : isAdmin ? 'text-slate-300 hover:bg-white/10 hover:text-white' : ''}>
                <Link to={link.to}>{link.label}</Link>
              </Button>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {role === 'analyst' && (
              <Button asChild variant={isAdmin ? 'secondary' : 'outline'} size="sm">
                <Link to="/admin"><LayoutDashboard /> Área do analista</Link>
              </Button>
            )}
            {role ? (
              <>
                {!isAdmin && (
                  <Button asChild variant="ghost" size="icon" aria-label="Notificações">
                    <Link to="/notificacoes" className="relative">
                      <Bell />
                      <Badge className="absolute -right-2 -top-2 size-4 p-0 text-[10px]">2</Badge>
                    </Link>
                  </Button>
                )}
                <Button asChild variant={isAdmin ? 'outline' : 'secondary'} size="sm" className={isAdmin ? 'border-white/30 bg-transparent text-white' : ''}>
                  <Link to="/perfil"><UserRound /> Perfil</Link>
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm" className={isAdmin ? 'border-white/30 bg-transparent text-white' : ''}>
                <Link to="/login"><LogIn /> Entrar</Link>
              </Button>
            )}
            {!isAdmin && (
              <Button asChild size="sm">
                <Link to="/denunciar"><FilePlus2 /> Registrar</Link>
              </Button>
            )}
          </div>
          <Button variant="ghost" size="icon" className={`lg:hidden ${isAdmin ? 'text-white' : ''}`} onClick={() => setMobileOpen((value) => !value)} aria-label="Abrir menu">
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileOpen && (
          <div className="mx-auto mt-3 max-w-7xl space-y-1 border-t pt-3 lg:hidden">
            {(isAdmin ? [{ to: '/admin', label: 'Visão geral' }] : mainLinks).map((link) => (
              <Button key={link.to} asChild variant="ghost" className={`w-full justify-start ${isAdmin ? 'text-white hover:bg-white/10' : ''}`}>
                <Link to={link.to}>{link.label}</Link>
              </Button>
            ))}
            <Button asChild variant="ghost" className={`w-full justify-start ${isAdmin ? 'text-white' : ''}`}>
              <Link to={role ? '/perfil' : '/login'}>{role ? 'Perfil e configurações' : 'Entrar ou cadastrar'}</Link>
            </Button>
            {role && (
              <Button asChild variant="ghost" className={`w-full justify-start ${isAdmin ? 'text-white' : ''}`}>
                <Link to="/notificacoes">Notificações</Link>
              </Button>
            )}
            {role === 'analyst' && (
              <Button asChild variant="ghost" className={`w-full justify-start ${isAdmin ? 'text-white' : ''}`}>
                <Link to="/admin">Área do analista</Link>
              </Button>
            )}
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      {!isAdmin && (
        <footer className="border-t border-white/10 bg-primary px-6 py-12 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <img src={logo} alt="MobCar" className="h-11 w-auto object-contain" />
              <div className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                Plataforma para registrar, organizar e apoiar a análise preliminar de possíveis ocorrências de trânsito.
              </div>
            </div>
            <div>
              <div className="font-medium text-secondary">Informações</div>
              <div className="mt-4 flex flex-col items-start gap-1">
                {footerLinks.map((link) => (
                  <Button key={link.to} asChild variant="link" className="h-auto p-0 text-slate-400 hover:text-secondary">
                    <Link to={link.to}>{link.label}</Link>
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium text-secondary">Contato e transparência</div>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                <div>contato@mobcar.com.br</div>
                <div>Política de privacidade</div>
                <div>Termos de uso</div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-slate-500">
            © 2026 MobCar · Protótipo demonstrativo
          </div>
        </footer>
      )}
    </div>
  );
}

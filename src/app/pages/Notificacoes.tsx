import { useState } from 'react';
import { Link } from 'react-router';
import { Bell, CheckCheck } from 'lucide-react';
import { notifications } from '../data/mock';
import { PageHeader } from '../components/ProductUI';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function Notificacoes() {
  const [read, setRead] = useState<number[]>([]);

  return (
    <div className="bg-background px-6 py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <PageHeader
            eyebrow="Atualizações"
            title="Notificações"
            description="Acompanhe confirmações de registro e mudanças de status sem atribuir caráter oficial à análise preliminar."
          />
          <Button variant="outline" onClick={() => setRead(notifications.map((item) => item.id))}>
            <CheckCheck /> Marcar todas como lidas
          </Button>
        </div>
        <div className="space-y-3">
          {notifications.map((item) => {
            const isUnread = item.unread && !read.includes(item.id);
            return (
              <Card key={item.id} className={isUnread ? 'border-secondary bg-secondary/5' : ''}>
                <CardContent className="flex gap-4 py-5">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${isUnread ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Bell className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium">{item.title}</div>
                      {isUnread && <Badge variant="secondary">Nova</Badge>}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.text}</div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                      <Button asChild variant="link" size="sm" className="h-auto p-0">
                        <Link to={`/ocorrencias/${item.occurrence}`}>Abrir ocorrência</Link>
                      </Button>
                      {isUnread && (
                        <Button variant="ghost" size="sm" className="h-auto" onClick={() => setRead((current) => [...current, item.id])}>
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

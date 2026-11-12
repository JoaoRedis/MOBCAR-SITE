# MobCar

## Executar localmente

Requer Node.js 22 e pnpm.

1. Instale as dependências: `pnpm install`.
2. Copie `.env.example` para `.env`.
3. Execute `pnpm dev`. Para a demonstração local, no cadastro clique em **Criar esta conta como administradora** e use o código `mobcar-demo-admin-setup-2026-local`. O código padrão só é habilitado em modo não produtivo quando o servidor está vinculado a `localhost`/`127.0.0.1`. Também é possível criar o administrador pelo comando `pnpm bootstrap:admin`, usando as variáveis `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_PASSWORD`.

O código de demonstração só é aceito localmente. Para produção, configure `INITIAL_ADMIN_SETUP_TOKEN` com um segredo aleatório de pelo menos 32 caracteres (pode ser gerado com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`) e use HTTPS. Uma pessoa com conta autenticada e esse segredo pode promover a própria conta mesmo quando já existem outros administradores; por isso, mantenha o segredo privado e remova ou troque-o quando não quiser mais permitir promoções por código. Cadastros sem o código continuam criando usuários comuns; um papel enviado pelo cliente não concede permissões. Administradores existentes também podem criar administradores adicionais pela área de gerenciamento.

## Produção

O mesmo servidor Node atende a API e os arquivos gerados por `pnpm build`; inicie-o com `pnpm start`. Configure `NODE_ENV=production`, `APP_ORIGIN` com a origem HTTPS pública exata e `DATABASE_PATH` em armazenamento persistente. O proxy de produção deve terminar TLS e encaminhar a aplicação para o servidor Node. Faça backup do banco SQLite com o servidor parado.

O workflow atual do GitHub Pages publica somente arquivos estáticos e não executa esta API. A autenticação, o gerenciamento e a persistência não funcionarão nessa hospedagem estática; para disponibilizar estas funções, publique o servidor Node em uma hospedagem que mantenha o processo e o arquivo SQLite persistente.

## API administrativa

- `GET /api/v1/denuncias`: endpoint público demonstrativo com registros fictícios; aceita `regiao_administrativa`, `tipo`, `page` e `limit` (1–100).
- `GET /api/admin/users`: lista filtrável e paginada, com indicadores calculados no banco.
- `POST /api/admin/users`: cria uma conta administradora; requer sessão de administrador.
- `PATCH /api/admin/users/:id/role`: permite somente a transição de usuário comum para analista.
- `POST /api/auth/register` aceita `adminSetupToken` apenas para a criação única do administrador inicial, quando o segredo do servidor estiver configurado e ainda não houver administrador.
- `POST /api/auth/admin-setup`: permite que a própria conta autenticada se torne administradora mediante o código de configuração; limitado a cinco tentativas por 15 minutos.

As rotas administrativas validam a sessão e o papel atual no banco em cada solicitação. O cadastro público continua criando apenas usuários comuns. Uma conta autenticada pode receber papel de administrador pela área de perfil usando o código privado configurado no servidor, mesmo que já existam outros administradores; a rota limita tentativas. O comando de bootstrap também pode ser usado para criar o primeiro administrador. Sessões usam cookies `HttpOnly`, `SameSite=Strict`, expiração limitada e IDs aleatórios armazenados como hashes.

O endpoint de ocorrências é apenas para integração de demonstração e não lê nem publica registros reais do banco.

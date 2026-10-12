import { Check, Shield, Zap, HeadphonesIcon, Lock, Code, Rocket, Crown } from 'lucide-react';

const planos = [
  {
    nome: 'FREE',
    preco: '0',
    periodo: 'mês',
    icone: Code,
    cor: '#F2F2F2',
    requisicoes: '1.000',
    recursos: [
      'Acesso a dados públicos agregados',
      'Estatísticas básicas por cidade',
      'Limite de 1.000 requisições/mês',
      'Suporte via documentação',
      'Rate limit: 10 req/min'
    ],
    destaque: false
  },
  {
    nome: 'DEVELOPER',
    preco: '99',
    periodo: 'mês',
    icone: Zap,
    cor: '#D9A679',
    requisicoes: '50.000',
    recursos: [
      'Tudo do plano Free',
      'Acesso a rankings detalhados',
      'Filtros por tipo de infração',
      'Limite de 50.000 requisições/mês',
      'Suporte por e-mail (48h)',
      'Rate limit: 100 req/min',
      'Webhooks para atualizações'
    ],
    destaque: true
  },
  {
    nome: 'BUSINESS',
    preco: '499',
    periodo: 'mês',
    icone: Rocket,
    cor: '#F2F2F2',
    requisicoes: '500.000',
    recursos: [
      'Tudo do plano Developer',
      'Dados históricos completos',
      'Análise preditiva (beta)',
      'Limite de 500.000 requisições/mês',
      'Suporte prioritário (24h)',
      'Rate limit: 500 req/min',
      'SLA de 99.5%',
      'Relatórios customizados'
    ],
    destaque: false
  },
  {
    nome: 'ENTERPRISE',
    preco: 'Custom',
    periodo: '',
    icone: Crown,
    cor: '#F2F2F2',
    requisicoes: 'Ilimitado',
    recursos: [
      'Tudo do plano Business',
      'Requisições ilimitadas',
      'Infraestrutura dedicada',
      'Suporte 24/7 com SLA 99.9%',
      'Rate limit customizado',
      'Integração personalizada',
      'Consultoria técnica incluída',
      'Acesso antecipado a recursos'
    ],
    destaque: false
  }
];

export function PlanosAPI() {
  return (
    <div className="relative bg-[#091626] min-h-screen">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Shield className="w-[600px] h-[600px] text-[#D9A679]" />
        </div>
      </div>

      <div className="relative z-10 py-16 px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-white mb-4">
              PLANOS <span className="text-[#D9A679]">API</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades e integre
              os dados do Mobcar em sua aplicação
            </p>
          </div>

          {/* Cards de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {planos.map((plano, index) => {
              const Icon = plano.icone;
              return (
                <div
                  key={index}
                  className={`rounded-2xl p-8 transition-all hover:scale-105 ${
                    plano.destaque
                      ? 'bg-gradient-to-b from-[#D9A679] to-[#A67246] shadow-2xl transform lg:-translate-y-4'
                      : 'bg-white'
                  }`}
                  style={{
                    backgroundColor: plano.destaque ? undefined : plano.cor
                  }}
                >
                  {plano.destaque && (
                    <div className="bg-white/20 text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
                      Mais Popular
                    </div>
                  )}

                  {/* Ícone e Nome do Plano */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center mb-3">
                      <Icon
                        className={`w-10 h-10 ${
                          plano.destaque ? 'text-white' : 'text-[#D9A679]'
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-xl mb-4 ${
                        plano.destaque ? 'text-white' : 'text-[#091626]'
                      }`}
                    >
                      {plano.nome}
                    </h3>

                    {/* Preço */}
                    <div className="mb-2">
                      {plano.preco !== 'Custom' && (
                        <span
                          className={`text-sm ${
                            plano.destaque ? 'text-white' : 'text-gray-600'
                          }`}
                        >
                          R$
                        </span>
                      )}
                      <span
                        className={`text-4xl mx-2 ${
                          plano.destaque ? 'text-white' : 'text-[#091626]'
                        }`}
                      >
                        {plano.preco}
                      </span>
                      {plano.periodo && (
                        <span
                          className={`text-sm ${
                            plano.destaque ? 'text-white' : 'text-gray-600'
                          }`}
                        >
                          /{plano.periodo}
                        </span>
                      )}
                    </div>

                    {/* Requisições */}
                    <div
                      className={`text-xs mt-2 ${
                        plano.destaque ? 'text-white/80' : 'text-gray-500'
                      }`}
                    >
                      {plano.requisicoes} {plano.requisicoes !== 'Ilimitado' && 'req/mês'}
                    </div>
                  </div>

                  {/* Linha Separadora */}
                  <div
                    className={`h-px mb-6 ${
                      plano.destaque ? 'bg-white/30' : 'bg-gray-300'
                    }`}
                  />

                  {/* Recursos */}
                  <ul className="space-y-3 mb-8 min-h-[280px]">
                    {plano.recursos.map((recurso, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            plano.destaque ? 'text-white' : 'text-[#D9A679]'
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            plano.destaque ? 'text-white' : 'text-gray-700'
                          }`}
                        >
                          {recurso}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Botão */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg transition-all ${
                      plano.destaque
                        ? 'bg-white text-[#A67246] hover:bg-gray-100'
                        : 'bg-[#091626] text-white hover:bg-[#0E2440]'
                    }`}
                  >
                    {plano.nome === 'ENTERPRISE' ? 'FALE CONOSCO' : 'ESCOLHER PLANO'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Benefícios Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="flex flex-col items-center text-center text-white">
              <div className="bg-[#0E2440] p-4 rounded-full mb-3">
                <Shield className="w-8 h-8 text-[#D9A679]" />
              </div>
              <h4 className="text-[#D9A679] mb-2">Dados Seguros</h4>
              <p className="text-sm text-gray-400">
                Criptografia de ponta e segurança garantida
              </p>
            </div>

            <div className="flex flex-col items-center text-center text-white">
              <div className="bg-[#0E2440] p-4 rounded-full mb-3">
                <Lock className="w-8 h-8 text-[#D9A679]" />
              </div>
              <h4 className="text-[#D9A679] mb-2">Confiabilidade</h4>
              <p className="text-sm text-gray-400">
                Uptime de 99.9% em todos os planos
              </p>
            </div>

            <div className="flex flex-col items-center text-center text-white">
              <div className="bg-[#0E2440] p-4 rounded-full mb-3">
                <Zap className="w-8 h-8 text-[#D9A679]" />
              </div>
              <h4 className="text-[#D9A679] mb-2">Escalabilidade</h4>
              <p className="text-sm text-gray-400">
                Cresça conforme sua necessidade
              </p>
            </div>

            <div className="flex flex-col items-center text-center text-white">
              <div className="bg-[#0E2440] p-4 rounded-full mb-3">
                <HeadphonesIcon className="w-8 h-8 text-[#D9A679]" />
              </div>
              <h4 className="text-[#D9A679] mb-2">Suporte Especializado</h4>
              <p className="text-sm text-gray-400">
                Time dedicado para te ajudar
              </p>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-[#0E2440] rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[#D9A679] mb-4">Documentação Completa</h3>
                <p className="text-gray-300 mb-4">
                  Acesse nossa documentação detalhada com exemplos de código,
                  guias de integração e referência completa da API REST.
                </p>
                <button className="bg-[#D9A679] text-[#091626] px-6 py-3 rounded-lg transition-transform hover:scale-105">
                  Acessar Documentação
                </button>
              </div>

              <div>
                <h3 className="text-[#D9A679] mb-4">Casos de Uso</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D9A679]">•</span>
                    <span>Integração com sistemas municipais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D9A679]">•</span>
                    <span>Pesquisas acadêmicas sobre mobilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D9A679]">•</span>
                    <span>Aplicativos de navegação e alertas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D9A679]">•</span>
                    <span>Dashboards de análise de dados</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Nota Rodapé */}
          <div className="text-center mt-12 text-gray-400 text-sm">
            <p>
              Todos os planos incluem acesso à API REST completa • Sem taxas de setup •
              Cancele quando quiser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

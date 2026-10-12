import { useState } from 'react';
import { Check, Code2, Zap, Building2, Globe, ArrowRight, Terminal, ChevronDown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: '/mês',
    desc: 'Para explorar a plataforma',
    limit: '100 req/dia',
    features: ['100 requisições por dia', 'Dados agregados por cidade', 'Suporte por email', 'Documentação completa', 'Acesso sandbox'],
    highlight: false,
    cta: 'Começar grátis',
  },
  {
    name: 'Developer',
    price: 'R$ 89',
    period: '/mês',
    desc: 'Para desenvolvedores independentes',
    limit: '5.000 req/dia',
    features: ['5.000 requisições por dia', 'Filtros por tipo de infração', 'Acesso a dados históricos', 'Webhooks em tempo real', 'Suporte prioritário'],
    highlight: false,
    cta: 'Assinar plano',
  },
  {
    name: 'Business',
    price: 'R$ 349',
    period: '/mês',
    desc: 'Para empresas e startups',
    limit: '50.000 req/dia',
    features: ['50.000 requisições por dia', 'Mapas de calor por região', 'Dados por período customizado', 'SLA 99,9% garantido', 'Suporte dedicado', 'Relatórios automatizados'],
    highlight: true,
    cta: 'Assinar plano',
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    desc: 'Para órgãos públicos e grandes empresas',
    limit: 'Ilimitado',
    features: ['Requisições ilimitadas', 'Dados brutos anonimizados', 'API exclusiva por região', 'Integração on-premise', 'SLA customizado', 'Gerente de conta dedicado'],
    highlight: false,
    cta: 'Falar com equipe',
  },
];

const useCases = [
  { icon: Building2, title: 'Órgãos Públicos', desc: 'Prefeituras e secretarias utilizam os dados para identificar pontos críticos e planejar melhorias na sinalização.' },
  { icon: Globe, title: 'Pesquisadores', desc: 'Universidades e institutos acessam dados anonimizados para estudos sobre mobilidade urbana e segurança viária.' },
  { icon: Code2, title: 'Desenvolvedores', desc: 'Startups e desenvolvedores criam aplicativos que exibem alertas de trânsito em tempo real para motoristas.' },
  { icon: Zap, title: 'Seguradoras', desc: 'Empresas de seguro utilizam dados estatísticos para precificação baseada em risco por região.' },
];

const codeExample = `// Exemplo: buscar denúncias por cidade
const response = await fetch(
  'https://api.mobcar.com.br/v1/denuncias?cidade=São+Paulo&tipo=estacionamento',
  {
    headers: {
      'Authorization': 'Bearer SEU_TOKEN_AQUI',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
// { total: 1243, items: [...], page: 1 }`;

export function APIParcerias() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'Os dados são anonimizados?', a: 'Sim. Todos os dados disponibilizados via API são completamente anonimizados. Nenhuma informação pessoal dos denunciantes é exposta.' },
    { q: 'Posso testar antes de assinar?', a: 'Sim. O plano Free permite até 100 requisições por dia sem custo. Basta criar uma conta e gerar sua chave de API.' },
    { q: 'Os dados são atualizados em tempo real?', a: 'No plano Business e Enterprise, os dados são atualizados em tempo real via webhooks. No plano Developer, a atualização ocorre a cada 15 minutos.' },
    { q: 'Há contrato de fidelidade?', a: 'Não. Todos os planos são mensais e podem ser cancelados a qualquer momento sem multa.' },
  ];

  return (
    <div className="bg-[#091626] min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-16 px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A679] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#A67246] opacity-5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block bg-[#D9A679]/10 border border-[#D9A679]/30 px-4 py-2 rounded-full mb-4">
            <span className="text-[#D9A679] text-sm">Para desenvolvedores e empresas</span>
          </div>
          <h1 className="text-5xl text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            API & <span className="text-[#D9A679]">Parcerias</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Acesse dados sobre infrações de trânsito de forma estruturada e segura. Construa soluções de mobilidade, pesquisa ou segurança viária sobre nossa plataforma.
          </p>
        </div>
      </section>

      {/* Código exemplo */}
      <section className="py-12 px-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0a1628] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
              <Terminal className="w-4 h-4 text-[#D9A679]" />
              <span className="text-gray-400 text-sm">Exemplo de requisição</span>
            </div>
            <pre className="p-6 text-sm text-green-400 overflow-x-auto leading-relaxed" style={{ fontFamily: 'monospace' }}>
              {codeExample}
            </pre>
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="py-12 px-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl text-white text-center mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>Quem usa a API Mobcar</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {useCases.map((uc) => (
              <div key={uc.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#D9A679]/40 transition-colors">
                <uc.icon className="w-8 h-8 text-[#D9A679] mb-3" />
                <h3 className="text-white mb-2 text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>{uc.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-16 px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-white text-center mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Planos <span className="text-[#D9A679]">disponíveis</span>
          </h2>
          <p className="text-gray-400 text-center mb-10">Escolha o plano ideal para seu volume de uso</p>

          <div className="grid md:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-[#A67246] to-[#8C5D34] border-2 border-[#D9A679]'
                    : 'bg-white/5 border border-white/10 hover:border-white/20 transition-colors'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D9A679] text-[#091626] text-xs px-3 py-1 rounded-full font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Mais popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className={`text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-white'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{plan.name}</h3>
                  <div className={`text-xs mb-3 ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>{plan.desc}</div>
                  <div className="flex items-end gap-1">
                    <span className={`text-3xl ${plan.highlight ? 'text-white' : 'text-[#D9A679]'}`} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>{plan.price}</span>
                    {plan.period && <span className={`text-sm mb-1 ${plan.highlight ? 'text-white/60' : 'text-gray-500'}`}>{plan.period}</span>}
                  </div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${plan.highlight ? 'bg-white/20 text-white' : 'bg-[#D9A679]/10 text-[#D9A679]'}`}>
                    {plan.limit}
                  </div>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-white' : 'text-[#2E7D32]'}`} />
                      <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-gray-300'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'bg-white text-[#A67246] hover:bg-gray-100'
                      : 'bg-[#D9A679]/10 border border-[#D9A679]/30 text-[#D9A679] hover:bg-[#D9A679]/20'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl text-white text-center mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>Perguntas frequentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-white text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#D9A679] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de contato */}
      <section className="py-16 px-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl text-white mb-2 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Fale com nossa equipe</h2>
            <p className="text-gray-400 text-sm text-center mb-6">Para parcerias institucionais ou planos Enterprise</p>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Nome</label>
                  <input type="text" placeholder="Seu nome" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A679] transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Empresa / Organização</label>
                  <input type="text" placeholder="Nome da empresa" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A679] transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Email corporativo</label>
                <input type="email" placeholder="email@empresa.com" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A679] transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Mensagem</label>
                <textarea rows={4} placeholder="Descreva sua necessidade de integração..." className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D9A679] transition-colors text-sm resize-none" />
              </div>
              <button className="w-full bg-gradient-to-r from-[#D9A679] to-[#A67246] text-white py-3 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5 flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Enviar mensagem
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

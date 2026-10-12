import { Link } from 'react-router';
import { ArrowRight, AlertTriangle, Users, Shield, BarChart2, ChevronRight } from 'lucide-react';

const indicators = [
  { value: '15.243', label: 'Registros demonstrativos', note: 'Dado ilustrativo', noteColor: 'text-[#2E7D32]' },
  { value: '127', label: 'Cidades representadas', note: 'Dado ilustrativo', noteColor: 'text-[#0E2440]' },
  { value: '94%', label: 'Análises concluídas', note: 'Dado ilustrativo', noteColor: 'text-[#2E7D32]' },
  { value: '3min', label: 'Tempo estimado de envio', note: 'Estimativa ilustrativa', noteColor: 'text-[#F59E0B]' },
];

const impactCards = [
  {
    icon: AlertTriangle,
    color: 'from-[#D9A679] to-[#A67246]',
    title: 'Visibilidade',
    desc: 'Cada envio organiza informações sobre uma possível ocorrência e facilita o acompanhamento pelo cidadão.',
  },
  {
    icon: Users,
    color: 'from-[#A67246] to-[#8C5D34]',
    title: 'Comunidade',
    desc: 'A participação cidadã ajuda a reunir contexto sobre situações observadas no trânsito, sem substituir a fiscalização oficial.',
  },
  {
    icon: Shield,
    color: 'from-[#0E2440] to-[#091626]',
    title: 'Segurança',
    desc: 'Registros organizados podem apoiar análises preliminares e a compreensão de padrões de mobilidade.',
  },
  {
    icon: BarChart2,
    color: 'from-[#D9A679] to-[#A67246]',
    title: 'Dados reais',
    desc: 'Geramos estatísticas concretas sobre padrões de infrações para apoiar decisões de políticas públicas de mobilidade.',
  },
];

export function Home() {
  return (
    <div className="bg-[#F2F2F2]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#091626] via-[#0E2440] to-[#091626] text-white py-24 px-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D9A679] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A67246] opacity-5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-block bg-[#D9A679]/10 border border-[#D9A679]/30 px-4 py-2 rounded-full mb-6">
            <span className="text-[#D9A679] text-sm">Plataforma colaborativa de registros</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Reporte <span className="text-[#D9A679]">Infrações</span> de Trânsito
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-3xl mx-auto">
            Uma plataforma acessível para que a população denuncie infrações e irregularidades no trânsito, contribuindo para a melhoria da mobilidade urbana e da qualidade de vida.
          </p>
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
            Registre informações com responsabilidade, acompanhe atualizações e ajude a construir uma visão mais organizada sobre a mobilidade.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/denunciar"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#D9A679] to-[#A67246] text-white px-8 py-4 rounded-xl no-underline transition-all hover:opacity-90 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#D9A679]/20"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Fazer Denúncia
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/estatisticas"
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-[#D9A679]/60 text-[#D9A679] px-8 py-4 rounded-xl no-underline transition-all hover:bg-[#D9A679]/10 hover:-translate-y-1"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Acompanhar dados
            </Link>
            <Link
              to="/como-funciona"
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl no-underline transition-all hover:bg-white/10 hover:-translate-y-1"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Como Funciona
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Indicadores */}
      <section className="py-10 px-10 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {indicators.map((ind) => (
              <div key={ind.label} className="text-center p-5 rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="text-4xl mb-2 text-[#A67246]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>{ind.value}</div>
                <div className="text-[#091626] text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{ind.label}</div>
                <div className={`text-xs ${ind.noteColor}`}>{ind.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impacto */}
      <section className="py-20 px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-[#091626] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              O valor dos <span className="text-[#A67246]">registros</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Entenda como sua participação transforma o trânsito e a segurança nas cidades
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {impactCards.map((card) => (
              <div key={card.title} className="group bg-white rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D9A679]/5 to-transparent rounded-bl-full" />
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[#091626] mb-2 text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-10 bg-gradient-to-br from-[#091626] via-[#0E2440] to-[#091626]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronto para fazer a <span className="text-[#D9A679]">diferença</span>?
          </h2>
          <p className="text-gray-300 mb-8">
            Registre uma infração agora mesmo. É rápido, gratuito e pode salvar vidas.
          </p>
          <Link
            to="/denunciar"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#D9A679] to-[#A67246] text-white px-10 py-4 rounded-xl no-underline transition-all hover:opacity-90 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#D9A679]/20"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Fazer Denúncia Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

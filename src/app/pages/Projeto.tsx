import { Target, Eye, Heart } from 'lucide-react';

export function Projeto() {
  return (
    <div className="py-16 px-10 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-[#D9A679] to-[#A67246] px-6 py-2 rounded-full mb-6">
            <span className="text-white font-medium">Sobre Nós</span>
          </div>
          <h1 className="text-5xl text-[#091626] mb-4">Projeto Mobcar</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Conheça nossa missão, visão e valores que norteiam o desenvolvimento desta plataforma
            de denúncias de infrações de trânsito.
          </p>
        </div>

        {/* Missão */}
        <div className="group relative bg-white rounded-2xl p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D9A679] to-[#A67246]"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D9A679]/5 to-transparent rounded-bl-full"></div>
          <div className="flex items-start gap-6 relative">
            <div className="bg-gradient-to-br from-[#D9A679] to-[#A67246] p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Target className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl text-[#091626] mb-4">Missão</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Proporcionar uma plataforma acessível, segura e eficiente para que a população denuncie
                infrações e irregularidades no trânsito, promovendo a participação cidadã na fiscalização
                e contribuindo ativamente para a melhoria da mobilidade urbana, redução de acidentes e
                aumento da qualidade de vida nas cidades brasileiras.
              </p>
            </div>
          </div>
        </div>

        {/* Visão */}
        <div className="group relative bg-white rounded-2xl p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#A67246] to-[#8B5A36]"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A67246]/5 to-transparent rounded-bl-full"></div>
          <div className="flex items-start gap-6 relative">
            <div className="bg-gradient-to-br from-[#A67246] to-[#8B5A36] p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl text-[#091626] mb-4">Visão</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Ser a principal plataforma de referência nacional em denúncias colaborativas de trânsito,
                reconhecida pela confiabilidade, transparência e efetividade na integração entre cidadãos
                e órgãos de fiscalização, tornando-se ferramenta essencial para a construção de cidades
                mais seguras e organizadas até 2030.
              </p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="group relative bg-white rounded-2xl p-8 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0E2440] to-[#091626]"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0E2440]/5 to-transparent rounded-bl-full"></div>
          <div className="flex items-start gap-6 relative">
            <div className="bg-gradient-to-br from-[#0E2440] to-[#091626] p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl text-[#091626] mb-4">Valores</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-[#D9A679] text-2xl leading-none">•</span>
                  <div>
                    <strong className="text-[#091626]">Transparência:</strong> Dados públicos e processos claros para todas as partes envolvidas.
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-[#D9A679] text-2xl leading-none">•</span>
                  <div>
                    <strong className="text-[#091626]">Segurança e Privacidade:</strong> Proteção rigorosa dos dados pessoais e opção de anonimato.
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-[#D9A679] text-2xl leading-none">•</span>
                  <div>
                    <strong className="text-[#091626]">Cidadania Ativa:</strong> Empoderamento da população na fiscalização e melhoria do trânsito.
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-[#D9A679] text-2xl leading-none">•</span>
                  <div>
                    <strong className="text-[#091626]">Inovação:</strong> Uso de tecnologia para facilitar o acesso e otimizar processos.
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-[#D9A679] text-2xl leading-none">•</span>
                  <div>
                    <strong className="text-[#091626]">Responsabilidade Social:</strong> Compromisso com a redução de acidentes e melhoria da qualidade de vida urbana.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contexto */}
        <div className="relative bg-gradient-to-br from-[#091626] via-[#0E2440] to-[#091626] text-white rounded-2xl p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A679] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D9A679] opacity-5 rounded-full blur-3xl"></div>
          <div className="relative">
            <h2 className="text-3xl text-[#D9A679] mb-6">Contexto e Motivação</h2>
            <p className="leading-relaxed mb-6 text-gray-300 text-lg">
              O Mobcar nasceu da necessidade de criar um canal direto e eficiente entre cidadãos e órgãos
              de fiscalização de trânsito. Diariamente, milhares de infrações passam despercebidas,
              contribuindo para acidentes, congestionamentos e degradação da qualidade de vida urbana.
            </p>
            <p className="leading-relaxed mb-6 text-gray-300 text-lg">
              Acreditamos que a tecnologia pode democratizar a fiscalização, permitindo que cada cidadão
              se torne um agente ativo na construção de cidades mais seguras. Com dados transparentes e
              processos claros, buscamos criar um ecossistema colaborativo que beneficie toda a sociedade.
            </p>
            <p className="leading-relaxed text-gray-300 text-lg">
              Através da análise de dados agregados, órgãos públicos podem identificar pontos críticos,
              planejar ações preventivas e implementar melhorias baseadas em evidências reais reportadas
              pela população.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Target, Eye, Heart, Users, Building2, Star, Shield } from 'lucide-react';

const values = [
  { icon: Shield, label: 'Transparência', desc: 'Todos os dados publicados são anonimizados e auditáveis pela comunidade.' },
  { icon: Heart, label: 'Cidadania', desc: 'Acreditamos que cada cidadão pode contribuir para um trânsito mais justo.' },
  { icon: Star, label: 'Qualidade', desc: 'Priorizamos denúncias com evidências sólidas para maximizar o impacto.' },
  { icon: Users, label: 'Colaboração', desc: 'Construído pela comunidade, para a comunidade.' },
];

const team = [
  { name: 'Caio Bastos', role: 'Product Lead', initials: 'CB' },
  { name: 'Isaac Linhares', role: 'Engenheiro de Software', initials: 'IL' },
  { name: 'João Victor', role: 'UX Designer', initials: 'JV' },
  { name: 'Rafael Fernandes', role: 'Dados & Analytics', initials: 'RF' },
];

const partners = [
  { name: 'Detran-SP', type: 'Órgão público' },
  { name: 'CET', type: 'Companhia de Engenharia de Tráfego' },
  { name: 'Denatran', type: 'Órgão federal' },
  { name: 'Obs. Nacional de Segurança', type: 'Instituto de pesquisa' },
];

export function SobreProjeto() {
  return (
    <div className="bg-[#F2F2F2]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#091626] via-[#0E2440] to-[#091626] text-white py-16 px-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#D9A679]/10 border border-[#D9A679]/30 px-4 py-2 rounded-full mb-4">
            <span className="text-[#D9A679] text-sm">Nossa história</span>
          </div>
          <h1 className="text-4xl text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sobre o <span className="text-[#D9A679]">Projeto</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            O Mobcar nasceu da necessidade de dar voz à população no combate às infrações de trânsito que colocam vidas em risco todos os dias.
          </p>
        </div>
      </section>

      {/* História */}
      <section className="py-16 px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl text-[#091626] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                A história do Mobcar
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  O Mobcar foi fundado em 2024 por um grupo de engenheiros e designers preocupados com o crescente número de acidentes e infrações de trânsito nas grandes cidades brasileiras.
                </p>
                <p>
                  A motivação surgiu de uma realidade comum: presenciar infrações graves e não ter um canal eficiente para reportá-las às autoridades competentes. O processo era burocrático, pouco acessível e sem retorno para o cidadão.
                </p>
                <p>
                  Desenvolvemos então uma plataforma digital que simplifica esse processo, garante o anonimato do denunciante e direciona as informações para os órgãos responsáveis de forma organizada e rastreável.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '2024', label: 'Ano de fundação' },
                { num: '15k+', label: 'Denúncias registradas' },
                { num: '127', label: 'Cidades atendidas' },
                { num: '98%', label: 'Satisfação dos usuários' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="text-3xl text-[#A67246] mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>{stat.num}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="py-16 px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-[#091626] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Missão, Visão e Valores</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#091626] rounded-2xl p-8 text-white">
              <Target className="w-8 h-8 text-[#D9A679] mb-4" />
              <h3 className="text-[#D9A679] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Missão</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Proporcionar uma plataforma acessível e segura para que cidadãos denunciem infrações de trânsito, contribuindo ativamente para a mobilidade urbana e a segurança nas vias públicas.
              </p>
            </div>
            <div className="bg-[#A67246] rounded-2xl p-8 text-white">
              <Eye className="w-8 h-8 text-white mb-4" />
              <h3 className="text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Visão</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Ser a principal referência nacional em inteligência colaborativa para segurança viária, influenciando políticas públicas de mobilidade urbana em todo o Brasil.
              </p>
            </div>
            <div className="bg-[#0E2440] rounded-2xl p-8 text-white">
              <Heart className="w-8 h-8 text-[#D9A679] mb-4" />
              <h3 className="text-[#D9A679] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Valores</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Transparência radical</li>
                <li>• Cidadania ativa</li>
                <li>• Privacidade garantida</li>
                <li>• Impacto real</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.label} className="bg-[#F2F2F2] rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-[#D9A679]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <v.icon className="w-5 h-5 text-[#A67246]" />
                </div>
                <h4 className="text-[#091626] mb-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{v.label}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-[#091626] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Equipe Responsável</h2>
            <p className="text-gray-600">Profissionais comprometidos com o impacto social positivo</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D9A679] to-[#A67246] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>{member.initials}</span>
                </div>
                <h4 className="text-[#091626] text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{member.name}</h4>
                <p className="text-gray-500 text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros */}
      <section className="py-16 px-10 bg-[#091626]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Parceiros <span className="text-[#D9A679]">Institucionais</span>
            </h2>
            <p className="text-gray-400">Trabalhamos com órgãos públicos e instituições de pesquisa</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partners.map((p) => (
              <div key={p.name} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="w-12 h-12 bg-[#D9A679]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-[#D9A679]" />
                </div>
                <h4 className="text-white text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{p.name}</h4>
                <p className="text-gray-400 text-xs">{p.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

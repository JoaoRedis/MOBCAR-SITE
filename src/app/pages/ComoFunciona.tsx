import { CheckCircle, XCircle, Camera, FileText, Clock, Shield, AlertTriangle, Car, Bike, Truck, ChevronRight } from 'lucide-react';

const allowedInfractions = [
  { icon: Car, label: 'Estacionamento irregular' },
  { icon: AlertTriangle, label: 'Avanço de sinal vermelho' },
  { icon: Truck, label: 'Excesso de velocidade' },
  { icon: Bike, label: 'Conversão proibida' },
  { icon: Car, label: 'Direção sob efeito de álcool' },
  { icon: AlertTriangle, label: 'Uso do celular ao volante' },
  { icon: Car, label: 'Invasão de calçada' },
  { icon: Truck, label: 'Carga mal acondicionada' },
];

const notAllowed = [
  'Discussões pessoais entre motoristas',
  'Multas já aplicadas por autoridades',
  'Infrações fora do território brasileiro',
  'Conteúdo ofensivo ou discriminatório',
];

const steps = [
  {
    num: '01',
    title: 'Identifique a situação',
    desc: 'Observe uma possível ocorrência de trânsito sem se colocar em risco.',
  },
  {
    num: '02',
    title: 'Descreva o problema',
    desc: 'Registre de forma objetiva o que aconteceu e o contexto observado.',
  },
  {
    num: '03',
    title: 'Adicione evidências',
    desc: 'Inclua fotos ou vídeos quando estiverem disponíveis. Imagens: até 20 MB; vídeos: até 100 MB por arquivo.',
  },
  {
    num: '04',
    title: 'Informe a localização',
    desc: 'Digite um endereço ou selecione um ponto no mapa, com prioridade para o Distrito Federal.',
  },
  {
    num: '05',
    title: 'Revise e envie',
    desc: 'Confira descrição, localização e anexos. A data e a hora são registradas pelo sistema.',
  },
  {
    num: '06',
    title: 'Acompanhe',
    desc: 'Use o protocolo para consultar o status e as atualizações disponíveis no MobCar.',
  },
];

export function ComoFunciona() {
  return (
    <div className="bg-[#F2F2F2]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#091626] via-[#0E2440] to-[#091626] text-white py-16 px-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#D9A679]/10 border border-[#D9A679]/30 px-4 py-2 rounded-full mb-4">
            <span className="text-[#D9A679] text-sm">Guia completo</span>
          </div>
          <h1 className="text-4xl text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Como Funciona o <span className="text-[#D9A679]">Mobcar</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Entenda como registrar e acompanhar uma possível ocorrência. O envio não representa confirmação oficial.
          </p>
        </div>
      </section>

      {/* O que pode ser denunciado */}
      <section className="py-16 px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Pode */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <h2 className="text-[#091626]" style={{ fontFamily: 'Poppins, sans-serif' }}>O que pode ser denunciado</h2>
              </div>
              <div className="space-y-3">
                {allowedInfractions.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <item.icon className="w-4 h-4 text-[#A67246] shrink-0" />
                    <span className="text-[#091626] text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Não pode */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-[#D32F2F]" />
                </div>
                <h2 className="text-[#091626]" style={{ fontFamily: 'Poppins, sans-serif' }}>O que NÃO pode ser denunciado</h2>
              </div>
              <div className="space-y-3">
                {notAllowed.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <XCircle className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                    <span className="text-[#091626] text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-amber-800 text-sm">
                  <strong>Atenção:</strong> Registre apenas informações que você observou e evite expor dados pessoais desnecessários.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como registrar */}
      <section className="py-16 px-10 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-[#091626] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Como registrar uma denúncia
            </h2>
            <p className="text-gray-600">Siga os passos abaixo para enviar sua denúncia de forma correta</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="bg-[#F2F2F2] rounded-2xl p-6 h-full">
                  <div className="text-4xl text-[#D9A679]/30 mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>{step.num}</div>
                  <h3 className="text-[#091626] mb-2 text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidências */}
      <section className="py-16 px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl text-[#091626] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Enviando fotos e vídeos
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Evidências podem ajudar na organização e na análise preliminar do registro. Anexe arquivos apenas quando for seguro:
              </p>
              <ul className="space-y-3">
                {[
                  'Capture a placa do veículo claramente',
                  'Fotografe o contexto da infração (sinalização, local)',
                  'Não edite ou aplique filtros nas imagens',
                  'Imagens devem ter no máximo 20 MB por arquivo',
                  'Vídeos devem ter no máximo 100 MB por arquivo',
                  'Formatos aceitos dependem da definição técnica do projeto',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ChevronRight className="w-4 h-4 text-[#A67246] shrink-0 mt-0.5" />
                    <span className="text-[#091626] text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#091626] rounded-2xl p-6 flex flex-col items-center text-center">
                <Camera className="w-10 h-10 text-[#D9A679] mb-3" />
                <h4 className="text-white text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Fotos</h4>
                <p className="text-gray-400 text-xs">Até 20 MB por arquivo</p>
              </div>
              <div className="bg-[#0E2440] rounded-2xl p-6 flex flex-col items-center text-center">
                <FileText className="w-10 h-10 text-[#D9A679] mb-3" />
                <h4 className="text-white text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Vídeos</h4>
                <p className="text-gray-400 text-xs">Até 100 MB por arquivo</p>
              </div>
              <div className="bg-[#A67246]/10 border border-[#A67246]/20 rounded-2xl p-6 flex flex-col items-center text-center col-span-2">
                <Clock className="w-10 h-10 text-[#A67246] mb-3" />
                <h4 className="text-[#091626] text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Data e hora</h4>
                <p className="text-gray-600 text-xs">Geradas automaticamente pelo sistema no registro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anonimato e Termos */}
      <section className="py-16 px-10 bg-[#091626]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#D9A679]" />
                <h2 className="text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Política de Anonimato</h2>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm">
                {[
                  'Dados pessoais e informações públicas ficam separados',
                  'O histórico do cidadão não exibe dados administrativos privados',
                  'O protocolo identifica a ocorrência na plataforma',
                  'Regras definitivas de anonimato dependem da implementação técnica',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-[#D9A679]" />
                <h2 className="text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Termos de Uso</h2>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm">
                {[
                  'O envio cria um registro para organização e análise preliminar',
                  'O registro não equivale à confirmação oficial de uma infração',
                  'Integrações, persistência e autorização dependem do back-end',
                  'Políticas definitivas serão apresentadas nos termos do serviço',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-[#D9A679] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

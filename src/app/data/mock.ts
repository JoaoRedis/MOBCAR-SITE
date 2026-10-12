export type OccurrenceStatus = 'Recebida' | 'Em análise' | 'Aprovada' | 'Rejeitada';

export const occurrences = [
  {
    id: 'MC-2026-0142',
    description: 'Veículo estacionado bloqueando a faixa de pedestres',
    fullDescription:
      'Veículo permaneceu estacionado sobre a faixa de pedestres durante o horário de maior movimento.',
    location: 'SQS 308, Asa Sul — Brasília, DF',
    date: '18 mar 2026',
    time: '14:32',
    status: 'Em análise' as OccurrenceStatus,
    evidence: ['faixa-pedestres.jpg · 3,2 MB', 'contexto-local.jpg · 2,1 MB'],
  },
  {
    id: 'MC-2026-0098',
    description: 'Conversão proibida em cruzamento sinalizado',
    fullDescription:
      'Condutor realizou conversão em local com placa de proibição, colocando pedestres em risco.',
    location: 'Eixo Monumental, próximo à Torre de TV — Brasília, DF',
    date: '12 mar 2026',
    time: '09:15',
    status: 'Aprovada' as OccurrenceStatus,
    evidence: ['cruzamento.mp4 · 46,8 MB'],
  },
  {
    id: 'MC-2026-0041',
    description: 'Parada em vaga reservada sem identificação',
    fullDescription:
      'Automóvel sem credencial visível ocupando vaga reservada no estacionamento público.',
    location: 'CLN 210, Asa Norte — Brasília, DF',
    date: '28 fev 2026',
    time: '17:48',
    status: 'Rejeitada' as OccurrenceStatus,
    evidence: ['estacionamento.jpg · 4,5 MB'],
  },
];

export const notifications = [
  {
    id: 1,
    title: 'Ocorrência em análise',
    text: 'O registro MC-2026-0142 foi encaminhado para análise preliminar.',
    time: 'Hoje, 10:24',
    occurrence: 'MC-2026-0142',
    unread: true,
  },
  {
    id: 2,
    title: 'Registro recebido',
    text: 'Recebemos seu registro MC-2026-0142 com duas evidências.',
    time: '18 mar, 14:32',
    occurrence: 'MC-2026-0142',
    unread: true,
  },
  {
    id: 3,
    title: 'Análise concluída',
    text: 'A análise preliminar do registro MC-2026-0098 foi concluída.',
    time: '14 mar, 16:05',
    occurrence: 'MC-2026-0098',
    unread: false,
  },
];

export const timeline = [
  {
    date: '18 mar 2026 · 14:32',
    title: 'Registro recebido',
    description: 'Informações e evidências recebidas pela plataforma.',
    actor: 'Sistema MobCar',
  },
  {
    date: '18 mar 2026 · 14:35',
    title: 'Validação inicial concluída',
    description: 'Campos obrigatórios e anexos passaram pela verificação preliminar.',
    actor: 'Sistema MobCar',
  },
  {
    date: '19 mar 2026 · 10:24',
    title: 'Recebida → Em análise',
    description: 'Registro atribuído para análise. Estado demonstrativo e provisório.',
    actor: 'Equipe de análise',
  },
];

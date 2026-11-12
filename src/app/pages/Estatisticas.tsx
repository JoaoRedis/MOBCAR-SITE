import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertCircle,
  CalendarDays,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';

type InfracaoKey = 'estacionamento' | 'velocidade' | 'sinal' | 'celular' | 'outros';
type Visualizacao = 'geral' | 'regiao' | 'infracao';

type RegiaoData = {
  regiao: string;
  denuncias: number;
  quantidadeRegioes: number;
} & Record<InfracaoKey, number>;

const regioesData: RegiaoData[] = [
  { regiao: 'Ceilândia', quantidadeRegioes: 1, denuncias: 3245, estacionamento: 1550, velocidade: 573, sinal: 455, celular: 439, outros: 228 },
  { regiao: 'Taguatinga', quantidadeRegioes: 1, denuncias: 2180, estacionamento: 588, velocidade: 803, sinal: 157, celular: 478, outros: 154 },
  { regiao: 'Samambaia', quantidadeRegioes: 1, denuncias: 1560, estacionamento: 529, velocidade: 395, sinal: 291, celular: 235, outros: 110 },
  { regiao: 'Plano Piloto', quantidadeRegioes: 1, denuncias: 1320, estacionamento: 147, velocidade: 335, sinal: 646, celular: 99, outros: 93 },
  { regiao: 'Gama', quantidadeRegioes: 1, denuncias: 980, estacionamento: 332, velocidade: 248, sinal: 183, celular: 148, outros: 69 },
  { regiao: 'Águas Claras', quantidadeRegioes: 1, denuncias: 850, estacionamento: 288, velocidade: 215, sinal: 159, celular: 128, outros: 60 },
  { regiao: 'Planaltina', quantidadeRegioes: 1, denuncias: 720, estacionamento: 244, velocidade: 183, sinal: 134, celular: 109, outros: 50 },
  { regiao: 'Guará', quantidadeRegioes: 1, denuncias: 688, estacionamento: 233, velocidade: 174, sinal: 128, celular: 104, outros: 49 },
  { regiao: 'Demais regiões (29 RAs)', quantidadeRegioes: 29, denuncias: 1000, estacionamento: 339, velocidade: 254, sinal: 187, celular: 150, outros: 70 },
];

const categorias: Array<{ tipo: string; cor: string; chave: InfracaoKey }> = [
  { tipo: 'Estacionamento irregular', cor: '#D9954A', chave: 'estacionamento' },
  { tipo: 'Excesso de velocidade', cor: '#E66D3D', chave: 'velocidade' },
  { tipo: 'Avanço de sinal', cor: '#D84B4B', chave: 'sinal' },
  { tipo: 'Uso de celular', cor: '#526F9C', chave: 'celular' },
  { tipo: 'Outros', cor: '#7D9B76', chave: 'outros' },
];

const formatNumber = (value: number) => value.toLocaleString('pt-BR');
const formatPercent = (value: number) => `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
const chartTooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--foreground)',
};

export function Estatisticas() {
  const [tipoSelecionado, setTipoSelecionado] = useState<InfracaoKey | ''>('');
  const [regiaoSelecionada, setRegiaoSelecionada] = useState('');
  const [visualizacao, setVisualizacao] = useState<Visualizacao>('geral');
  const [mostrarTodasRegioes, setMostrarTodasRegioes] = useState(false);

  const regioesFiltradas = useMemo(
    () => regioesData.filter((regiao) => !regiaoSelecionada || regiao.regiao === regiaoSelecionada),
    [regiaoSelecionada],
  );
  const categoriasFiltradas = tipoSelecionado
    ? categorias.filter((categoria) => categoria.chave === tipoSelecionado)
    : categorias;

  const totaisInfracoes = categoriasFiltradas.map((categoria) => ({
    ...categoria,
    total: regioesFiltradas.reduce((total, regiao) => total + regiao[categoria.chave], 0),
  }));
  const totalExibido = totaisInfracoes.reduce((total, categoria) => total + categoria.total, 0);
  const dadosRegioes = regioesFiltradas
    .map((regiao) => ({
      regiao: regiao.regiao,
      denuncias: tipoSelecionado ? regiao[tipoSelecionado] : regiao.denuncias,
      quantidadeRegioes: regiao.quantidadeRegioes,
    }))
    .sort((a, b) => b.denuncias - a.denuncias);
  const regioesVisiveis = mostrarTodasRegioes ? dadosRegioes : dadosRegioes.slice(0, 10);
  const quantidadeRegioes = regioesFiltradas.reduce((total, regiao) => total + regiao.quantidadeRegioes, 0);
  const percentualCategorias = totaisInfracoes.map((categoria) => ({
    ...categoria,
    percentual: totalExibido ? (categoria.total / totalExibido) * 100 : 0,
  }));
  const maiorRegiao = dadosRegioes[0];
  const temFiltros = Boolean(tipoSelecionado || regiaoSelecionada);

  const cardsResumo = [
    {
      label: 'Total de denúncias',
      value: formatNumber(totalExibido),
      description: 'Ocorrências demonstrativas no recorte atual',
      icon: TrendingUp,
      accent: '#D9954A',
    },
    {
      label: 'Regiões administrativas',
      value: formatNumber(quantidadeRegioes),
      description: 'Regiões representadas no Distrito Federal',
      icon: MapPin,
      accent: '#31567D',
    },
    {
      label: 'Tipos de infrações',
      value: formatNumber(categoriasFiltradas.length),
      description: 'Categorias disponíveis neste recorte',
      icon: AlertCircle,
      accent: '#C77A39',
    },
  ];

  const filtros = (
    <section className="mb-6 rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-sm sm:p-6" aria-label="Filtros de estatísticas">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-[#0E2440] text-white">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-[#091626]">Central de consulta</h2>
            <p className="text-xs text-gray-500 dark:text-muted-foreground">Refine os dados demonstrativos do trânsito</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setTipoSelecionado('');
            setRegiaoSelecionada('');
          }}
          disabled={!temFiltros}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-[#31567D] transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9954A] disabled:cursor-not-allowed disabled:opacity-45 dark:text-[#D9A679]"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Limpar filtros
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-[#26384B] dark:text-slate-200">
          Tipo de infração
          <select
            value={tipoSelecionado}
            onChange={(event) => setTipoSelecionado(event.target.value as InfracaoKey | '')}
            className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#091626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9954A] dark:border-border dark:bg-input-background dark:text-foreground"
          >
            <option value="">Todas as infrações</option>
            {categorias.map((categoria) => (
              <option key={categoria.chave} value={categoria.chave}>{categoria.tipo}</option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-[#26384B] dark:text-slate-200">
          Região administrativa
          <select
            value={regiaoSelecionada}
            onChange={(event) => {
              setRegiaoSelecionada(event.target.value);
              setMostrarTodasRegioes(false);
            }}
            className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#091626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9954A] dark:border-border dark:bg-input-background dark:text-foreground"
          >
            <option value="">Todas as regiões</option>
            {regioesData.map((regiao) => (
              <option key={regiao.regiao} value={regiao.regiao}>{regiao.regiao}</option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-2 text-sm font-medium text-[#26384B] dark:text-slate-200">
          Período
          <span className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <select
              value="indisponivel"
              disabled
              aria-describedby="periodo-indisponivel"
              className="min-h-11 w-full cursor-not-allowed appearance-none rounded-lg border border-gray-200 bg-gray-100 pl-10 pr-3 text-sm text-gray-500 dark:border-border dark:bg-muted dark:text-muted-foreground"
            >
              <option value="indisponivel">Período não disponível</option>
            </select>
          </span>
          <span id="periodo-indisponivel" className="text-xs font-normal text-gray-500 dark:text-muted-foreground">
            Os dados agregados não possuem datas.
          </span>
        </label>
      </div>
    </section>
  );

  const cardIndicadores = (
    <section className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Indicadores principais">
      {cardsResumo.map(({ label, value, description, icon: Icon, accent }) => (
        <article key={label} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_24px_rgba(9,22,38,0.07)] sm:p-6">
          <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: accent }} />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-medium text-gray-500">{label}</h2>
              <p className="mt-2 break-words text-3xl font-bold tracking-tight text-[#091626] sm:text-4xl">{value}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F3F6F9] dark:bg-muted" style={{ color: accent }}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-dashed border-gray-200 pt-3">
            <span className="h-px w-8 border-t-2 border-dashed" style={{ borderColor: accent }} />
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </article>
      ))}
    </section>
  );

  const graficoRegioes = (
    <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-3 text-lg font-semibold text-[#091626]">
            <span className="h-6 w-1 rounded-full bg-[#D9954A]" />
            Denúncias por região
          </h2>
          <p className="mt-1 pl-4 text-sm text-gray-500 dark:text-muted-foreground">
            {maiorRegiao
              ? `Maior volume: ${maiorRegiao.regiao} · ${formatNumber(maiorRegiao.denuncias)}`
              : 'Nenhuma região disponível neste recorte.'}
          </p>
        </div>
        {dadosRegioes.length > 10 && (
          <button
            type="button"
            onClick={() => setMostrarTodasRegioes((mostrar) => !mostrar)}
            aria-expanded={mostrarTodasRegioes}
            className="min-h-9 rounded-lg px-3 text-sm font-semibold text-[#31567D] transition-colors hover:bg-[#F3F6F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9954A] dark:text-[#D9A679] dark:hover:bg-muted"
          >
            {mostrarTodasRegioes ? 'Ver menos regiões' : 'Ver todas as regiões'}
          </button>
        )}
        {dadosRegioes.length <= 10 && (
          <span className="text-xs text-gray-500">Todos os recortes regionais disponíveis estão exibidos.</span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={Math.max(270, regioesVisiveis.length * 38)}>
        <BarChart data={regioesVisiveis} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 5" stroke="var(--border)" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="regiao"
            width={145}
            tick={{ fill: 'var(--foreground)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value) => [formatNumber(Number(value)), 'Denúncias fictícias']}
          />
          <Bar dataKey="denuncias" fill={tipoSelecionado ? categorias.find((item) => item.chave === tipoSelecionado)?.cor : '#D9954A'} radius={[0, 6, 6, 0]} barSize={18}>
            <LabelList dataKey="denuncias" position="right" formatter={(value: number) => formatNumber(value)} fill="var(--foreground)" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ol className="sr-only" aria-label="Ranking de denúncias por região">
        {dadosRegioes.map((item) => (
          <li key={item.regiao}>{item.regiao}: {formatNumber(item.denuncias)} denúncias fictícias</li>
        ))}
      </ol>
    </section>
  );

  const graficoInfracoes = (
    <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-2">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-[#091626]">
          <span className="h-6 w-1 rounded-full bg-[#D9954A]" />
          Distribuição por infração
        </h2>
        <p className="mt-1 pl-4 text-sm text-gray-500 dark:text-muted-foreground">Categorias e participação no recorte atual</p>
      </div>
      <div className="grid items-center gap-3 sm:grid-cols-[minmax(190px,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative h-[230px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={percentualCategorias} dataKey="total" nameKey="tipo" cx="50%" cy="50%" innerRadius={62} outerRadius={94} paddingAngle={3} stroke="var(--card)" strokeWidth={2}>
                {percentualCategorias.map((categoria) => (
                  <Cell key={categoria.chave} fill={categoria.cor} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value) => [formatNumber(Number(value)), 'Denúncias fictícias']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-[#091626]">{formatNumber(totalExibido)}</span>
          </div>
        </div>
        <ul className="space-y-3">
          {percentualCategorias.map((categoria) => (
            <li key={categoria.chave} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: categoria.cor }} />
                <span className="truncate text-gray-600 dark:text-slate-200">{categoria.tipo}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-semibold text-[#091626]">{formatNumber(categoria.total)}</span>
                <span className="text-xs text-gray-500 dark:text-muted-foreground">{formatPercent(categoria.percentual)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

  const rankingInfracoes = (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold text-[#091626]">
        <span className="h-6 w-1 rounded-full bg-[#D9954A]" />
        Infrações mais registradas
      </h2>
      <ol className="space-y-2">
        {percentualCategorias
          .slice()
          .sort((a, b) => b.total - a.total)
          .map((categoria, index) => (
            <li key={categoria.chave}>
              <button
                type="button"
                aria-pressed={tipoSelecionado === categoria.chave}
                onClick={() => setTipoSelecionado(tipoSelecionado === categoria.chave ? '' : categoria.chave)}
                className={`w-full rounded-xl border border-transparent p-3 text-left transition-colors hover:border-gray-100 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9954A] ${tipoSelecionado === categoria.chave ? 'border-gray-200 bg-gray-50' : ''}`}
              >
                <span className="mb-2 flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md text-xs font-bold text-white" style={{ backgroundColor: categoria.cor }}>
                      {index + 1}
                    </span>
                    <span className="truncate text-sm font-medium text-gray-700">{categoria.tipo}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold text-[#091626]">{formatNumber(categoria.total)}</span>
                    <span className="text-xs text-gray-500 dark:text-muted-foreground">{formatPercent(categoria.percentual)}</span>
                  </span>
                </span>
                <span className="ml-10 block h-2 overflow-hidden rounded-full bg-gray-100">
                  <span className="block h-full rounded-full transition-[width] duration-300" style={{ backgroundColor: categoria.cor, width: `${categoria.percentual}%` }} />
                </span>
              </button>
            </li>
          ))}
      </ol>
    </section>
  );

  const rankingRegioes = (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold text-[#091626]">
        <span className="h-6 w-1 rounded-full bg-[#D9954A]" />
        Regiões com mais ocorrências
      </h2>
      <ol className="space-y-2">
        {dadosRegioes.map((regiao, index) => {
          const percentual = totalExibido ? (regiao.denuncias / totalExibido) * 100 : 0;
          return (
            <li key={regiao.regiao} className="rounded-xl border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#31567D] text-xs font-bold text-white dark:bg-[#D9954A] dark:text-[#091626]">{index + 1}</span>
                  <span className="truncate text-sm font-medium text-gray-700">{regiao.regiao}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-semibold text-[#091626]">{formatNumber(regiao.denuncias)}</span>
                  <span className="text-xs text-gray-500 dark:text-muted-foreground">{formatPercent(percentual)}</span>
                </span>
              </div>
              <span className="ml-10 block h-2 overflow-hidden rounded-full bg-gray-100">
                <span className="block h-full rounded-full bg-[#D9954A] transition-[width] duration-300" style={{ width: `${percentual}%` }} />
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );

  const graficoComparativo = (
    <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-border sm:p-6">
      <div className="mb-4">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-[#091626]">
          <span className="h-6 w-1 rounded-full bg-[#D9954A]" />
          Comparativo entre infrações
        </h2>
        <p className="mt-1 pl-4 text-sm text-gray-500 dark:text-muted-foreground">Quantidade de denúncias por categoria no recorte atual</p>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(260, percentualCategorias.length * 52)}>
        <BarChart
          data={percentualCategorias.slice().sort((a, b) => b.total - a.total)}
          layout="vertical"
          margin={{ top: 4, right: 42, bottom: 4, left: 4 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 5" stroke="var(--border)" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="tipo"
            width={142}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--foreground)', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value) => [formatNumber(Number(value)), 'Denúncias fictícias']}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={24}>
            {percentualCategorias.map((categoria) => (
              <Cell key={categoria.chave} fill={categoria.cor} />
            ))}
            <LabelList
              dataKey="total"
              position="right"
              formatter={(value: number) => formatNumber(value)}
              fill="var(--foreground)"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );

  const visualizacoes: Array<{ id: Visualizacao; label: string }> = [
    { id: 'geral', label: 'Visão geral' },
    { id: 'regiao', label: 'Por região' },
    { id: 'infracao', label: 'Por infração' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#F7F9FB] to-white px-4 py-8 dark:from-background dark:via-background dark:to-background sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0E2440] px-4 py-2 text-sm font-medium text-white">
            <span className="size-2 rounded-full bg-[#D9954A]" />
            Dados demonstrativos do DF
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#091626] sm:text-4xl">Estatísticas de Denúncias</h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-muted-foreground sm:text-base">
            Acompanhe uma visão demonstrativa das ocorrências por Região Administrativa e tipo de infração. Os dados são fictícios e não representam registros oficiais.
          </p>
          <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2" aria-hidden="true">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="flex gap-1.5">
              <span className="h-1 w-3 rounded-sm bg-[#D9954A]" />
              <span className="h-1 w-3 rounded-sm bg-gray-300" />
              <span className="h-1 w-3 rounded-sm bg-gray-300" />
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
        </header>

        {filtros}
        {cardIndicadores}

        <section aria-label="Visualizações do dashboard">
          <div className="mb-5 flex flex-wrap gap-2 border-b border-gray-200 pb-3" role="tablist" aria-label="Selecionar visualização">
            {visualizacoes.map((opcao) => (
              <button
                key={opcao.id}
                id={`visualizacao-${opcao.id}`}
                type="button"
                role="tab"
                aria-selected={visualizacao === opcao.id}
                aria-controls="painel-visualizacao"
                onClick={() => setVisualizacao(opcao.id)}
                className={`min-h-10 rounded-lg px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9954A] ${visualizacao === opcao.id ? 'bg-[#0E2440] text-white shadow-sm dark:bg-[#D9A679] dark:text-[#091626]' : 'text-gray-600 hover:bg-gray-100 hover:text-[#091626]'}`}
              >
                {opcao.label}
              </button>
            ))}
          </div>

          <div key={visualizacao} id="painel-visualizacao" role="tabpanel" aria-labelledby={`visualizacao-${visualizacao}`} className="animate-in fade-in duration-300">
            {visualizacao === 'geral' && (
              <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                {graficoRegioes}
                {graficoInfracoes}
                <div className="xl:col-span-2">{rankingInfracoes}</div>
              </div>
            )}
            {visualizacao === 'regiao' && (
              <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                {graficoRegioes}
                <div className="xl:col-span-1">{rankingRegioes}</div>
              </div>
            )}
            {visualizacao === 'infracao' && (
              <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                {graficoInfracoes}
                {graficoComparativo}
                <div className="xl:col-span-2">{rankingInfracoes}</div>
              </div>
            )}
          </div>
        </section>

        <aside className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#091626] via-[#0E2440] to-[#091626] p-6 text-white shadow-lg sm:p-8">
          <div className="absolute right-0 top-1/2 hidden h-16 w-28 -translate-y-1/2 items-center justify-center border-y border-dashed border-white/20 sm:flex" aria-hidden="true">
            <span className="h-1 w-16 rounded-full bg-[#D9954A]/80" />
          </div>
          <div className="relative max-w-3xl">
            <h2 className="mb-2 text-lg font-semibold text-[#E4AD70]">Nota sobre privacidade</h2>
            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
              Os dados apresentados são fictícios, agregados e anônimos. Nenhuma informação pessoal ou sensível é exibida nesta página.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

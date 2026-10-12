import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MapPin, AlertCircle } from 'lucide-react';

const cidadesData = [
  { cidade: 'São Paulo', denuncias: 3245 },
  { cidade: 'Rio de Janeiro', denuncias: 2180 },
  { cidade: 'Belo Horizonte', denuncias: 1560 },
  { cidade: 'Brasília', denuncias: 1320 },
  { cidade: 'Curitiba', denuncias: 980 },
  { cidade: 'Porto Alegre', denuncias: 850 },
  { cidade: 'Salvador', denuncias: 720 },
  { cidade: 'Fortaleza', denuncias: 688 },
];

const infracoesData = [
  { tipo: 'Estacionamento Irregular', total: 4250, cor: '#D9A679' },
  { tipo: 'Excesso de Velocidade', total: 3180, cor: '#A67246' },
  { tipo: 'Avanço de Sinal', total: 2340, cor: '#0E2440' },
  { tipo: 'Uso de Celular', total: 1890, cor: '#091626' },
  { tipo: 'Outros', total: 883, cor: '#666666' },
];

export function Estatisticas() {
  const totalDenuncias = infracoesData.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="py-16 px-10 bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-[#D9A679] to-[#A67246] px-6 py-2 rounded-full mb-6">
            <span className="text-white font-medium">Dados em Tempo Real</span>
          </div>
          <h1 className="text-5xl text-[#091626] mb-4">Estatísticas de Denúncias</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dados consolidados e transparentes sobre as denúncias registradas na plataforma.
            Todas as informações são anônimas e agregadas.
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D9A679]/10 to-transparent rounded-bl-full"></div>
            <div className="flex items-center justify-between relative">
              <div>
                <div className="text-gray-600 mb-3 font-medium">Total de Denúncias</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-[#D9A679] to-[#A67246] bg-clip-text text-transparent">
                  {totalDenuncias.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#D9A679] to-[#A67246] p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-green-600 font-medium">
              <span className="text-lg">↑</span> 23% vs mês anterior
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A67246]/10 to-transparent rounded-bl-full"></div>
            <div className="flex items-center justify-between relative">
              <div>
                <div className="text-gray-600 mb-3 font-medium">Cidades Atendidas</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-[#A67246] to-[#8B5A36] bg-clip-text text-transparent">
                  87
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#A67246] to-[#8B5A36] p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-blue-600 font-medium">
              <span className="text-lg">+</span> 5 novas cidades
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0E2440]/10 to-transparent rounded-bl-full"></div>
            <div className="flex items-center justify-between relative">
              <div>
                <div className="text-gray-600 mb-3 font-medium">Tipos de Infrações</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-[#0E2440] to-[#091626] bg-clip-text text-transparent">
                  5
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0E2440] to-[#091626] p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="mt-6 text-sm text-gray-500 font-medium">
              Categorias monitoradas
            </div>
          </div>
        </div>

        {/* Ranking de Cidades */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-12 border border-gray-100">
          <h2 className="text-2xl text-[#091626] mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#D9A679] to-[#A67246] rounded-full"></div>
            Ranking de Cidades com Mais Denúncias
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={cidadesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="cidade" tick={{ fill: '#666' }} />
              <YAxis tick={{ fill: '#666' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(217, 166, 121, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="denuncias" fill="#D9A679" name="Denúncias" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tipos de Infrações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Pizza */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl text-[#091626] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#D9A679] to-[#A67246] rounded-full"></div>
              Distribuição por Tipo de Infração
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={infracoesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, percent }) => `${tipo}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {infracoesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela de Infrações */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl text-[#091626] mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#D9A679] to-[#A67246] rounded-full"></div>
              Tipos de Infrações Mais Registradas
            </h2>
            <div className="space-y-4">
              {infracoesData.map((infracao, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: infracao.cor }}
                      />
                      <span className="text-gray-700">{infracao.tipo}</span>
                    </div>
                    <span className="text-[#091626]">{infracao.total.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        backgroundColor: infracao.cor,
                        width: `${(infracao.total / totalDenuncias) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aviso de Privacidade */}
        <div className="mt-12 relative bg-gradient-to-br from-[#091626] via-[#0E2440] to-[#091626] text-white rounded-2xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A679] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D9A679] opacity-5 rounded-full blur-3xl"></div>
          <div className="relative">
            <h3 className="text-2xl text-[#D9A679] mb-4">Nota sobre Privacidade</h3>
            <p className="leading-relaxed text-gray-300 text-lg">
              Todos os dados apresentados são agregados e anônimos. Nenhuma informação pessoal ou sensível
              é exibida nesta página. As estatísticas têm objetivo informativo e de transparência, demonstrando
              o impacto da plataforma na melhoria da mobilidade urbana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

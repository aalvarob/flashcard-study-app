interface AreaData {
  area: string
  correctCards: number
  totalCards: number
  percentage: number
}

interface AreaPerformancePieChartProps {
  data: AreaData[]
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
  '#8DD1E1',
  '#D084D0',
  '#82D982',
  '#FFB347',
  '#87CEEB',
  '#F08080',
  '#98FB98',
  '#DDA0DD',
]

export default function AreaPerformancePieChart({ data }: AreaPerformancePieChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível para exibir o gráfico</p>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.correctCards, 0)

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gráfico de barras simples */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Desempenho por Área</h3>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.area}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.area}</span>
                  <span className="text-sm text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.correctCards} de {item.totalCards} cartões
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo estatístico */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resumo</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Total de Cartões Corretos</div>
              <div className="text-2xl font-bold text-blue-600">{total}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Áreas Estudadas</div>
              <div className="text-2xl font-bold text-green-600">{data.length}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Desempenho Médio</div>
              <div className="text-2xl font-bold text-purple-600">
                {(data.reduce((sum, item) => sum + item.percentage, 0) / data.length).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legenda de cores */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold mb-3">Legenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {data.map((item, index) => (
            <div key={item.area} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-gray-700">{item.area}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

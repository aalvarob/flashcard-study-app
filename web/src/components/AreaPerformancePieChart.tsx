import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

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

  // Preparar dados para o gráfico de pizza (usando cartões corretos)
  const chartData = data.map((item) => ({
    name: item.area,
    value: item.correctCards,
    percentage: item.percentage,
  }))

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => {
              const item = chartData.find((d) => d.name === name)
              return item ? `${name}: ${item.percentage}%` : name
            }}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => {
              if (typeof value === 'number') {
                return `${value.toFixed(0)} cartões`
              }
              return value
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

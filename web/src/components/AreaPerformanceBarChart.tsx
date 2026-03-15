import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AreaData {
  area: string
  correctCards: number
  totalCards: number
  percentage: number
}

interface AreaPerformanceBarChartProps {
  data: AreaData[]
}

export default function AreaPerformanceBarChart({ data }: AreaPerformanceBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível para exibir o gráfico</p>
      </div>
    )
  }

  // Preparar dados para o gráfico de barras
  const chartData = data.map((item) => ({
    name: item.area.length > 15 ? item.area.substring(0, 15) + '...' : item.area,
    fullName: item.area,
    corretos: item.correctCards,
    total: item.totalCards,
    acerto: item.percentage,
  }))

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            stroke="#666"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#666' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#666"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#666' }}
            label={{ value: 'Cartões', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
            }}
            formatter={(value: any) => {
              return value
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="corretos" fill="#4caf50" name="Cartões Corretos" />
          <Bar dataKey="total" fill="#2196f3" name="Total de Cartões" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

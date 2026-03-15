import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ProgressData {
  date: string
  correctCards: number
  totalCards: number
  percentage: number
}

interface ProgressLineChartProps {
  data: ProgressData[]
}

export default function ProgressLineChart({ data }: ProgressLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível para exibir o gráfico</p>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            stroke="#666"
            style={{ fontSize: '12px' }}
            tick={{ fill: '#666' }}
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
              if (typeof value === 'number') {
                return value.toFixed(0)
              }
              return value
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="correctCards"
            stroke="#4caf50"
            strokeWidth={2}
            dot={{ fill: '#4caf50', r: 4 }}
            activeDot={{ r: 6 }}
            name="Cartões Corretos"
          />
          <Line
            type="monotone"
            dataKey="totalCards"
            stroke="#2196f3"
            strokeWidth={2}
            dot={{ fill: '#2196f3', r: 4 }}
            activeDot={{ r: 6 }}
            name="Total de Cartões"
          />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#ff9800"
            strokeWidth={2}
            dot={{ fill: '#ff9800', r: 4 }}
            activeDot={{ r: 6 }}
            name="Taxa de Acerto (%)"
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

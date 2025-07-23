import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2021', placed: 80 },
  { year: '2022', placed: 90 },
  { year: '2023', placed: 105 },
];

export default function PlacementTrends() {
  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">📈 Placement Trends</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="placed" stroke="#3B82F6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
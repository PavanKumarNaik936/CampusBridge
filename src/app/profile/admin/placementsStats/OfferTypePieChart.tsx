import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Full-Time', value: 60 },
  { name: 'Internship + PPO', value: 25 },
  { name: 'Internship Only', value: 15 },
];
const COLORS = ['#4F46E5', '#22C55E', '#FACC15'];

export default function OfferTypePieChart() {
  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">🎯 Offer Type Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
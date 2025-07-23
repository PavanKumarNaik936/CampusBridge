export default function PlacementStatsCards() {
    const stats = [
      { label: "Total Students Placed", value: 105 },
      { label: "Total Offers Made", value: 130 },
      { label: "Companies Visited", value: 35 },
      { label: "Placement Rate", value: "82%" },
      { label: "Highest Package", value: "₹18 LPA" },
      { label: "Average Package", value: "₹6.4 LPA" },
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow p-4 border border-gray-200"
          >
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-xl font-bold text-blue-700">{stat.value}</p>
          </div>
        ))}
      </div>
    );
  }
  
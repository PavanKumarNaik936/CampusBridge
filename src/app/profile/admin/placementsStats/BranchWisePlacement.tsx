export default function BranchWisePlacement() {
    const branches = [
      { name: "CSE", placed: 45, total: 60 },
      { name: "ECE", placed: 30, total: 50 },
      { name: "MECH", placed: 20, total: 40 },
    ];
  
    return (
      <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">🏫 Branch-wise Stats</h3>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th>Branch</th>
              <th>Placed</th>
              <th>Total</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.name} className="border-b hover:bg-gray-50">
                <td>{b.name}</td>
                <td>{b.placed}</td>
                <td>{b.total}</td>
                <td>{Math.round((b.placed / b.total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
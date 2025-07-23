export default function CompanyWiseStats() {
    const companies = [
      { name: "Infosys", offers: 12, highest: "₹10 LPA", average: "₹6.5 LPA" },
      { name: "TCS", offers: 8, highest: "₹9 LPA", average: "₹5.8 LPA" },
      { name: "Wipro", offers: 5, highest: "₹7.5 LPA", average: "₹5.2 LPA" },
    ];
  
    return (
      <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">🏢 Company-wise Stats</h3>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th>Company</th>
              <th>Offers</th>
              <th>Highest</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.name} className="border-b hover:bg-gray-50">
                <td>{c.name}</td>
                <td>{c.offers}</td>
                <td>{c.highest}</td>
                <td>{c.average}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
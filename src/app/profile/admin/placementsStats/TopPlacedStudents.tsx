export default function TopPlacedStudents() {
    const students = [
      { name: "Aarav R.", company: "Amazon", package: "₹18 LPA" },
      { name: "Megha S.", company: "Google", package: "₹16 LPA" },
      { name: "Rishi K.", company: "Adobe", package: "₹14 LPA" },
    ];
  
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">🏆 Top Placed Students</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.name}
              className="bg-white p-4 rounded-xl shadow border border-gray-200"
            >
              <p className="font-semibold text-gray-800">{student.name}</p>
              <p className="text-sm text-gray-600">{student.company}</p>
              <p className="text-sm text-green-600 font-medium">{student.package}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
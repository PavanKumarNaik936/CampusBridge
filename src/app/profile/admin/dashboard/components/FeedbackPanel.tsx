// components/admin/FeedbackPanel.tsx
const feedbacks = [
    { name: "Pavan K", comment: "Amazing UI, very user-friendly!" },
    { name: "Sneha", comment: "Please add more job filters." },
  ];
  
  export default function FeedbackPanel() {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">💬 User Feedback</h3>
        <ul className="space-y-3 text-sm">
          {feedbacks.map((f, idx) => (
            <li key={idx} className="border p-3 rounded-xl">
              <strong>{f.name}</strong>: {f.comment}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
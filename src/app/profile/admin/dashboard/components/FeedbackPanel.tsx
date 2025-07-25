// components/admin/FeedbackPanel.tsx
import AdminFeedbacks from "./AdminFeedbacks";

export default function FeedbackPanel() {
  return (
    <section className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl transition-all">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        📊 Feedback Dashboard
      </h1>
      <AdminFeedbacks />
    </section>
  );
}

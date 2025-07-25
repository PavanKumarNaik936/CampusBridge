"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "bug", label: "🐞 Bug" },
    { value: "suggestion", label: "💡 Suggestion" },
    { value: "feature-request", label: "🚀 Feature" },
    { value: "ui", label: "🎨 UI" },
    { value: "performance", label: "⚡ Performance" },
    { value: "content", label: "📄 Content" },
    { value: "accessibility", label: "♿ Access" },
    { value: "general", label: "📝 General" },
    { value: "other", label: "🔍 Other" },
  ];

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Feedback message is required.");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/feedback/submit", {
      method: "POST",
      body: JSON.stringify({ message, category, rating }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      toast.success("✅ Feedback submitted!");
      setMessage("");
      setCategory("general");
      setRating(null);
    } else {
      toast.error("❌ Something went wrong.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 transition-all">
      <h2 className="text-lg font-semibold mb-3 text-center">💬 Feedback</h2>

      <textarea
        placeholder="What's on your mind?"
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />

      <div className="mt-3">
        <label className="block text-sm font-medium mb-1">📂 Category</label>
        <select
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium mb-1">⭐ Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition ${
                rating === r
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              } hover:scale-105`}
              aria-label={`Rate ${r}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`mt-5 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium shadow-md transition-all duration-300 ${
          isSubmitting ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? (
          <>
            <ImSpinner2 className="animate-spin" /> Submitting...
          </>
        ) : (
          <>🚀 Submit Feedback</>
        )}
      </button>
    </div>
  );
}

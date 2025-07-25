"use client";

import { useRouter } from "next/navigation";
import { FaCommentDots } from "react-icons/fa";

export default function FeedbackFab() {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <button
        onClick={() => router.push("/feedback")}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all"
        aria-label="Give Feedback"
      >
        <FaCommentDots size={24} />
      </button>

      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm px-3 py-1 rounded shadow transition-opacity">
        Give Feedback
      </div>
    </div>
  );
}

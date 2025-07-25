"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaChartBar,
  FaStar,
  FaTags,
  FaUserAlt,
  FaCalendarAlt,
} from "react-icons/fa";

type Feedback = {
  id: string;
  message: string;
  category: string;
  rating: number | null;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
};

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("/api/feedback/get");
        setFeedbacks(res.data);
      } catch (error: any) {
        console.error("Failed to fetch feedbacks", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const total = feedbacks.length;
  const avgRating =
    feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
    (feedbacks.filter((fb) => fb.rating !== null).length || 1);

  const categoryCount = feedbacks.reduce<Record<string, number>>((acc, fb) => {
    acc[fb.category] = (acc[fb.category] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <p className="text-center py-8">Loading feedbacks...</p>;

  if (total === 0) return <p className="text-center py-8">No feedback submitted yet.</p>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Total Feedbacks</p>
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{total}</h3>
          </div>
          <FaChartBar className="text-blue-500 dark:text-blue-300 w-7 h-7" />
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Average Rating</p>
            <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              ⭐ {avgRating.toFixed(1)}
            </h3>
          </div>
          <FaStar className="text-yellow-500 dark:text-yellow-300 w-7 h-7" />
        </div>

        <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-xl shadow-sm">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">By Category</p>
          <div className="flex flex-wrap gap-2 text-sm">
            {Object.entries(categoryCount).map(([category, count]) => (
              <span
                key={category}
                className="bg-purple-300/40 dark:bg-purple-700 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full"
              >
                {category} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>

     {/* Feedback Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((fb) => (
            <div
            key={fb.id}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition space-y-2"
            >
            {/* Header: Time & Rating */}
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                <FaCalendarAlt />
                {new Date(fb.createdAt).toLocaleDateString()}
                </span>
                {fb.rating !== null && (
                <span className="flex items-center text-yellow-600 dark:text-yellow-400 font-medium">
                    <FaStar className="mr-1" /> {fb.rating}/5
                </span>
                )}
            </div>

            {/* Message */}
            <p className="text-gray-800 dark:text-gray-100 text-sm line-clamp-3">
                {fb.message}
            </p>

            {/* Footer: Category + User */}
            <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1 bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded-full text-blue-600 dark:text-blue-300 font-medium">
                <FaTags className="text-blue-400" />
                {fb.category}
                </span>
                <span className="flex items-center gap-1 truncate max-w-[60%]">
                <FaUserAlt className="text-gray-400" />
                {fb.user?.email
                    ? `${fb.user.name || "Anonymous"} (${fb.user.email})`
                    : "Anonymous"}
                </span>
            </div>
            </div>
        ))}
        </div>

    </div>
  );
}

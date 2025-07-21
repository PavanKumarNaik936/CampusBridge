// components/bookmarks/BookmarkList.tsx

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import BookmarkItem from "./BookmarkItem";
import BookmarkFilter from "./BookmarkFilter";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await axios.get("/api/bookmarks");
        setBookmarks(data);
      } catch (err) {
        console.error("Failed to fetch bookmarks");
      }
    };

    fetchBookmarks();
  }, []);

  // console.log(bookmarks);

  const filtered = bookmarks.filter((b) => {
    if (filter === "All") return true;
    if (filter === "Job") return b.job;
    if (filter === "Event") return b.event;
    if (filter === "Material") return b.material;
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔖 My Bookmarks</h2>
      <BookmarkFilter selected={filter} onSelect={setFilter} />
      {filtered.length === 0 ? (
        <p className="text-gray-500">No bookmarks found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {filtered.map((bookmark) => (
            <BookmarkItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}

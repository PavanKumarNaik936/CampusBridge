// components/bookmarks/BookmarkItem.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function BookmarkItem({ bookmark }: { bookmark: any }) {
  const type = bookmark.job
    ? "Job"
    : bookmark.event
    ? "Event"
    : bookmark.material
    ? "Material"
    : "Unknown";

  const title =
    bookmark.job?.title || bookmark.event?.title || bookmark.material?.title;

  const description =
    bookmark.job?.description ||
    bookmark.event?.description ||
    bookmark.material?.description;

  // Construct proper link based on available content
  const detailLink =
    bookmark.job
      ? `/jobs?highlight=${bookmark.job.id}`
      : bookmark.event
      ? `/events?highlight=${bookmark.event.id}`
      : bookmark.material
      ? `/materials?highlight=${bookmark.material.id}`
      : "#";

  return (
    <div className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition bg-white">
      <div className="flex justify-between items-start">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase tracking-wider">
          {type}
        </span>
        {detailLink !== "#" && (
          <Link href={detailLink}>
            <span className="text-sm text-blue-500 hover:underline cursor-pointer">
              Visit
            </span>
          </Link>
        )}
      </div>
      <h3 className="mt-2 font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

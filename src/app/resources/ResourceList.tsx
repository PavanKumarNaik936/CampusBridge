"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState ,useCallback} from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { AiOutlineFilePdf, AiOutlineLink } from "react-icons/ai";
import { PiExam } from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";
import { FaBookmark, FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";


export default function ResourceList() {
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
const [loadingBookmarkId, setLoadingBookmarkId] = useState<string | null>(null);

const fetchCategories = async () => {
  try {
    const res = await axios.get("/api/prep/categories");
    setCategories(res.data);
  } catch (err) {
    console.error("Failed to load categories", err);
  }
};

const fetchResources = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get("/api/prep/resources", {
      params: {
        search,
        categoryId: selectedCategory,
      },
    });
    setResources(res.data);
  } catch (err) {
    console.error("Failed to load resources", err);
  } finally {
    setLoading(false);
  }
}, [search, selectedCategory]);

useEffect(() => {
  fetchCategories();
  fetchResources();
}, [fetchResources]);

useEffect(() => {
  const delay = setTimeout(() => {
    fetchResources();
  }, 400); // debounce

  return () => clearTimeout(delay);
}, [search, selectedCategory, fetchResources]);

const handleBookmark = async (targetId: string, type: "resource") => {
  if (!session?.user?.id) {
    toast.warning("Please login to bookmark.");
    return;
  }

  setLoadingBookmarkId(targetId);
  try {
    await axios.post("/api/bookmarks", { targetId, type });
    toast.success("🔖 Bookmarked!");
  } catch (err: any) {
    if (err.response?.data?.error === "Already bookmarked") {
      toast.warning("You've already bookmarked this.");
    } else {
      toast.error("❌ Failed to bookmark. Try again.");
    }
  } finally {
    setLoadingBookmarkId(null);
  }
};

//   console.log(resources);
  const renderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <AiOutlineFilePdf className="text-red-600" size={22} />;
      case "mcq":
        return <PiExam className="text-green-600" size={22} />;
      case "link":
        return <AiOutlineLink className="text-blue-600" size={22} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80"
        />
      </div>

      {/* Resource List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5 space-y-3 rounded-xl shadow-md">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          ❌ No matching resources found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {resources.map((res) => (
            <Card
            key={res.id}
            className="p-6 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white group"
          >
            {/* Title and Type */}
            <div className="flex items-center justify-between gap-4">
                {/* Title + Icon */}
                <Link
                    href={res.url || res.fileUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#14326E] font-semibold text-lg hover:underline hover:text-[#1a47a0] transition-colors truncate max-w-[60%]"
                >
                    {renderIcon(res.type)}
                    <span className="truncate">{res.title}</span>
                </Link>

                {/* Type badge */}
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full uppercase font-medium whitespace-nowrap">
                    {res.type}
                </span>

                {/* Bookmark button */}
                <button
                    onClick={() => handleBookmark(res.id, "resource")}
                    className="text-gray-600 hover:text-blue-600"
                >
                    {loadingBookmarkId === res.id ? (
                    <FaSpinner className="animate-spin" />
                    ) : (
                    <FaBookmark size={16} />
                    )}
                </button>
                </div>

          
            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-3 mt-3 leading-relaxed">
              {res.description}
            </p>
          
            {/* Metadata */}
            <div className="text-sm mt-4 space-y-1 text-gray-500">
              <p>
                <span className="font-semibold text-gray-600">📂 Category:</span>{" "}
                {res.category?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-600">🙋 Uploaded by:</span>{" "}
                {res.createdBy?.name || "Anonymous"}
              </p>
              <p>
                <span className="font-semibold text-gray-600">🗓 Uploaded on:</span>{" "}
                {new Date(res.createdAt).toLocaleDateString()}
              </p>
            </div>
          
            {/* Resource Link */}
            {(res.fileUrl || res.url) && (
              <Link
                href={res.fileUrl || res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-[#14326E] hover:underline transition-colors hover:text-[#1a47a0]"
              >
                🔗 More Info / Open Resource
              </Link>
            )}
          </Card>
          
          ))}
        </div>
      )}
    </div>
  );
}

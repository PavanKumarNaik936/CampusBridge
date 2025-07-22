"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlinePlusCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";

import { toast } from "sonner";

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/prep/categories");
      setCategories(res.data);
    }catch (error: any) {
        if (error.response?.status === 409) {
          toast.error("Category already exists");
        } else {
          toast.error(error?.response?.data?.message || "Failed to add category");
        }
      } finally {
        setLoading(false); // 🔥 This is important
      }
      
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.warning("Category name is required");
    setUploading(true);
    try {
      const res = await axios.post("/api/prep/categories", {
        name: newCategory,
      });
      setCategories([res.data, ...categories]);
      setNewCategory("");
      toast.success("Category added successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add category");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#14326E]">📚 Manage Categories</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2 items-center bg-[#14326E] text-white hover:bg-[#1a3e8a] transition-all">
              <AiOutlinePlusCircle size={18} />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
              <Button
                onClick={handleAddCategory}
                disabled={uploading}
                className="w-full bg-[#14326E] text-white hover:bg-[#1a3e8a] flex justify-center items-center"
              >
                {uploading && (
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                )}
                {uploading ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <AiOutlineLoading3Quarters className="animate-spin mx-auto text-[#14326E]" size={32} />
          <p className="mt-2 text-sm text-muted-foreground">Loading categories...</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <li
                key={cat.id}
                className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
                <p className="font-medium text-gray-800">{cat.name}</p>
                <button
                onClick={async () => {
                    const confirmDelete = confirm(`Delete category "${cat.name}"?`);
                    if (!confirmDelete) return;

                    try {
                    await axios.delete(`/api/prep/categories/${cat.id}`);
                    setCategories(categories.filter((c) => c.id !== cat.id));
                    toast.success("Category deleted");
                    } catch (error) {
                    toast.error("Failed to delete category");
                    }
                }}
                className="text-red-600 hover:text-red-800"
                >
                <AiOutlineDelete size={20} />
                </button>
            </li>
            ))}

        </ul>
      )}
    </div>
  );
}

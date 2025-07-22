"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { PdfUpload } from "@/components/FileUpload";
import { AiOutlinePlusCircle, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { useSession } from "next-auth/react";


export default function AddResourceDialog({ onResourceAdded = () => {}}: { onResourceAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const { data: session } = useSession();

  useEffect(() => {
    axios.get("/api/prep/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async () => {
    // const createdBy=session?.user?.id
    if (!title || !type || !categoryId || (type === "pdf" && !file && !url)) {
      toast.warning("Please fill in all required fields");
      return;
    }

    setUploading(true);

    try {

      const fileUrl = type === "pdf" ? url : "";


      await axios.post("/api/prep/resources", {
        title,
        description,
        type,
        url: type !== "pdf" ? url : "",
        fileUrl,
        categoryId,
        createdById: session?.user?.id,
      });

      toast.success("Resource added!");
      setOpen(false);
      onResourceAdded(); // refresh list
      setTitle("");
      setDescription("");
      setType("");
      setUrl("");
      setFile(null);
      setCategoryId("");
    } catch (err) {
        console.log(err);
      toast.error("Failed to add resource");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center bg-[#14326E] text-white">
          <AiOutlinePlusCircle />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />

          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Resource Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>

          {type === "pdf" ? (
          <PdfUpload
            onUpload={(url, name) => {
              setUrl(url); // we can use url as `fileUrl`
              toast.success("PDF uploaded!");
            }}
          />
        ) : (
          <Input placeholder="Paste Link" value={url} onChange={(e) => setUrl(e.target.value)} />
        )}


          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            disabled={uploading}
            onClick={handleSubmit}
            className="w-full bg-[#14326E] text-white hover:bg-[#1a3e8a] flex items-center justify-center"
          >
            {uploading && <AiOutlineLoading3Quarters className="animate-spin mr-2" />}
            {uploading ? "Adding..." : "Add Resource"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

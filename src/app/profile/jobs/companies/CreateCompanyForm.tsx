"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Props {
  onCompanyCreated?: (company: any) => void;
}

export default function CreateCompanyForm({ onCompanyCreated }: Props) {
  const [form, setForm] = useState({
    name: "",
    logo: "",
    website: "",
    sector: "",
    location: "",
    hrContactEmail: "",
    hrPhone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/companies", form);
      toast.success("✅ Company created!");
      setForm({
        name: "",
        logo: "",
        website: "",
        sector: "",
        location: "",
        hrContactEmail: "",
        hrPhone: "",
      });
      if (onCompanyCreated) onCompanyCreated(data); // Notify parent
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.error("Company already exists");
      } else {
        toast.error("❌ Failed to create company");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md border">
      <h2 className="text-3xl font-semibold mb-6 text-blue-800 flex items-center gap-2">
        <span>🏢</span> Add New Company
      </h2>

      <div className="space-y-4">
        {[...Object.entries(form)].map(([key, value]) => (
          <input
            key={key}
            type={key.includes("Email") ? "email" : "text"}
            name={key}
            placeholder={key.replace(/([A-Z])/g, " $1")}
            value={value}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.name}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Company"}
        </button>
      </div>
    </div>
  );
}

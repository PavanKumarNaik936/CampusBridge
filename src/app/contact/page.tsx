"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [hovered, setHovered] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send to API endpoint
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left - Info Panel */}
        <div
        className="bg-cover bg-center text-white p-8 flex flex-col justify-between"
        style={{
            backgroundImage: "url('/contact_bg.jpg')",
        }}
        >
        <div>
        <h2
        className="text-3xl font-bold mb-2 text-transparent bg-clip-text"
        style={{
            backgroundImage: "linear-gradient(to right,#F907FC, #37D5D6, #36096D)",
        }}
        >
        📬 Contact CampusBridge
        </h2>

            <p className="text-sm text-blue-100 text-transparent bg-clip-text" style={{backgroundImage:"linear-gradient(to right,#0047ab,#1ca9c9)"}}>
            We are here to assist you with placements, events, or queries.
            </p>
        </div>
        <div className="mt-6">
            <p className="text-sm">📞 +91-9876543210</p>
            <p className="text-sm">✉️ support@campusbridge.in</p>
            <p className="text-sm mt-1">🏫 IIIT RK Valley, Andhra Pradesh</p>
        </div>
        </div>

        {/* Right - Form */}
        <form onSubmit={handleSubmit} className="p-8 bg-gray-50 rounded-r-2xl">
            <h3 className="text-2xl font-bold text-blue-800 mb-6">Send us a message</h3>

            <div className="space-y-5">
                <div className="relative">
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition"
                />
                <label className="absolute left-3 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                    Name
                </label>
                </div>

                <div className="relative">
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition"
                />
                <label className="absolute left-3 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                    Email
                </label>
                </div>

                <div className="relative">
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder=" "
                    required
                    className="peer w-full border border-gray-300 rounded-lg px-3 pt-4 pb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition resize-none"
                ></textarea>
                <label className="absolute left-3 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all">
                    Message
                </label>
                </div>

                <button
                type="submit"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="w-full text-white py-2 px-4 rounded-xl font-semibold transition duration-300 shadow-md"
                style={{
                    backgroundImage: hovered
                    ? "linear-gradient(to right, #2c67f2, #62cff4)"
                    : "linear-gradient(to right, #62cff4, #2c67f2)",
                }}
                >
                Send Message
                </button>
            </div>
            </form>

      </div>
    </div>
  );
}

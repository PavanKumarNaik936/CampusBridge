"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
  FaImage,
  FaUserFriends,
  FaVideo,
  FaPen,
  FaEdit,
  FaHashtag,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "sonner";
import { EventImageUpload } from "@/components/FileUpload"; // adjust path


export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "workshop",
    startDate: "",
    endDate: "",
    venue: "",
    isOnline: false,
    meetLink: "",
    maxAttendees: "",
    registrationLink: "",
    imageUrl: "",
    status: "upcoming",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
    ...formData,
    maxAttendees: formData.maxAttendees
      ? Number(formData.maxAttendees)
      : null,
  };
  try {
    const res = await axios.post("/api/events", payload);

    if (res.status === 200 || res.status === 201) {
      toast.success("🎉 Event created successfully!");
      router.push("/profile/events");
    } else {
      toast.error("Failed to create event");
    }
  } catch (error: any) {
    const serverError = error?.response?.data?.error;
  
    if (Array.isArray(serverError)) {
      // If it's an array of Zod errors
      serverError.forEach((err: any) => {
        toast.error(err.message || "Validation error");
      });
    } else if (typeof serverError === "string") {
      toast.error(serverError);
    } else {
      toast.error("Something went wrong");
    }
  
    console.error(error);
  }
  finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📅 Create New Event</h1>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
              <FaHashtag /> Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
              <FaPen /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Event details, agenda, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaEdit /> Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="seminar">Seminar</option>
                <option value="hackathon">Hackathon</option>
                <option value="culturals">Culturals</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaMapMarkerAlt /> Venue
              </label>
              <input
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Auditorium Block-A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaCalendarAlt /> Start Date
              </label>
              <input
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaCalendarAlt /> End Date
              </label>
              <input
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              id="isOnline"
              type="checkbox"
              checked={formData.isOnline}
              onChange={(e) =>
                setFormData({ ...formData, isOnline: e.target.checked })
              }
              className="accent-blue-600"
            />
            <label htmlFor="isOnline" className="text-sm font-semibold text-gray-700">
              Online Event?
            </label>
          </div>

          {formData.isOnline && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaVideo /> Meet Link
              </label>
              <input
                name="meetLink"
                value={formData.meetLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://meet.example.com/event"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaUserFriends /> Max Attendees
              </label>
              <input
                name="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., 200"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaLink /> Registration Link
              </label>
              <input
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., https://rgukt.ac.in/register"
              />
            </div>
          </div>

          <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
            📸 Upload Event Poster
          </label>

          <EventImageUpload
            onUpload={(url, name) =>
              setFormData((prev) => ({
                ...prev,
                imageUrl: url,
              }))
            }
          />

          {formData.imageUrl && (
            <Image
            src={formData.imageUrl || "/default-poster.jpg"} // fallback if imageUrl is missing
            alt="Event Poster"
            width={400}           // adjust as needed
            height={300}          // adjust as needed
            className="mt-4 max-h-48 rounded-xl shadow object-cover"
          />
          )}
        </div>


          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-2 px-6 rounded-xl shadow-md ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Creating...
                </>
              ) : (
                <>➕ Create Event</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

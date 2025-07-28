"use client";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserCheck,
  FaLink,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";


async function handleDownloadAttendees(eventId: string, eventTitle: string) {
  try {
    const res = await fetch(`/api/events/${eventId}/attendees`);
    const data = await res.json();

    if (!data.attendees || data.attendees.length === 0) {
      alert("No attendees to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data.attendees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");

    const blob = XLSX.write(workbook, { type: "binary", bookType: "xlsx" });

    const buffer = new ArrayBuffer(blob.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < blob.length; i++) {
      view[i] = blob.charCodeAt(i) & 0xff;
    }

    const blobObj = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blobObj);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.replace(/\s+/g, "_")}_attendees.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error("Error downloading attendees:", err);
    alert("Failed to download attendees.");
  }
}

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  type: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  isOnline: boolean;
  meetLink?: string;
  maxAttendees?: number;
  registrationLink?: string;
  status: string;
  attendees: string[];
  attended: string[];
  createdBy: string;
}

export default function MyPostedEvents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`/api/events/user`);
        setEvents(res.data.events || []);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  if (status === "loading" || loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        <FaSpinner className="animate-spin inline mr-2" />
        Loading your posted events...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  if (events.length === 0) {
    return (
      <>
      <div className="text-center py-20 text-gray-500">
        You haven’t posted any events yet.
      </div>
      <div className="flex justify-end mb-4">
      <button
        onClick={() => router.push("/profile/events/create")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition"
      >
        ➕ Create New Event
      </button>
    </div>
    </>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        🎉 Your Posted Events
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/profile/events/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition"
        >
          ➕ Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-100"
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt="Event Poster"
                className="rounded-xl mb-3 max-h-48 object-cover w-full"
              />
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-2 italic capitalize">
              {event.type} | {event.status}
            </p>

            <p className="text-gray-600 line-clamp-3 mb-2">{event.description}</p>

            <div className="text-sm text-gray-700 mt-2 space-y-1">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" />
                {new Date(event.startDate).toLocaleString()} →{" "}
                {new Date(event.endDate).toLocaleString()}
              </p>

              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                {event.isOnline ? "Online Event" : event.venue}
              </p>

              {event.meetLink && (
                <p className="flex items-center gap-2 truncate">
                  <FaLink className="text-purple-500" />
                  <a href={event.meetLink} target="_blank" className="underline truncate">
                    {event.meetLink}
                  </a>
                </p>
              )}

              {event.registrationLink && (
                <p className="flex items-center gap-2 truncate">
                  <FaLink className="text-green-600" />
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    className="underline truncate"
                  >
                    Register
                  </a>
                </p>
              )}

              <p className="flex items-center gap-2">
                <FaUsers className="text-indigo-500" />
                Attendees: {event.attendees?.length || 0} /{" "}
                {event.maxAttendees ?? "∞"}
              </p>

              <p className="flex items-center gap-2">
                <FaUserCheck className="text-green-600" />
                Attended: {event.attended?.length || 0}
              </p>
              {session?.user.role === "admin" && event.attendees.length > 0 && (
              <button
                onClick={() => handleDownloadAttendees(event.id, event.title)}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                📥 Download Attendees (Excel)
              </button>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

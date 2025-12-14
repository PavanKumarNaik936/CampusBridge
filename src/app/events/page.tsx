"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaBookmark, FaCalendarAlt, FaSpinner, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  startDate: string;
  endDate:string;
  status: "upcoming" | "completed" | "ongoing";
  createdBy: { name: string };
  attendees?: string[]; // <-- Make sure to include this in your backend response
}

export default function EventListingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({ location: "", status: "" });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loadingBookmarkId, setLoadingBookmarkId] = useState<string | null>(null);
  
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);

const [loadingRegisterId, setLoadingRegisterId] = useState<string | null>(null);

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  useEffect(() => {
    if (highlightId) {
      const el = document.getElementById(highlightId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring", "ring-yellow-400");
        setTimeout(() => el.classList.remove("ring", "ring-yellow-400"), 2000);
      }
    }
  }, [highlightId]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const query = new URLSearchParams(filters as any).toString();
        const { data } = await axios.get(`/api/events?${query}`);
        console.log(data);
        setEvents(data);
      } catch (err) {
        toast.error("❌ Failed to load events.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "completed";
  };
  
  const handleRegister = async (event: Event) => {
    if (!event || !session?.user?.id) return;
  
    setLoadingRegisterId(event.id); // ✅ specific event
    try {
      if (session.user.role !== "student") {
        toast.error("Only students can register for events.");
        return;
      }
  
      await axios.put(`/api/events/${event.id}/register`, {});
      toast.success("🎉 Registered successfully!");
  
      // Refresh event list after registration
      const { data } = await axios.get(`/api/events`);
      setEvents(data);
      setSelectedEvent(null);
    } catch (err: any) {
      if (err?.response?.data?.error === "Already registered") {
        toast.warning("You’ve already registered for this event.");
      } else {
        toast.error("❌ Failed to register. Try again.");
      }
    } finally {
      setLoadingRegisterId(null); // ✅ reset after done
    }
  };
  

  const handleBookmark = async (targetId: string) => {
    setLoadingBookmarkId(targetId);
    try {
      await axios.post("/api/bookmarks", { targetId, type: "event" });
      toast.success("🔖 Event bookmarked!");
    } catch (err: any) {
      if (err.response?.data?.error === "Already bookmarked") {
        toast.warning("You already bookmarked this event.");
      } else {
        toast.error("❌ Failed to bookmark.");
      }
    } finally {
      setLoadingBookmarkId(null);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        📅 Events & Workshops
      </h1>


      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          className="border px-3 py-2 rounded-xl shadow-sm"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
        <option value="">All Venues</option>
        <option value="Computer Center">Computer Center</option>
        <option value="Department">Department</option>
        <option value="Academic Block">Academic Block</option>
        

        </select>

        <select
          className="border px-3 py-2 rounded-xl shadow-sm"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Event Cards */}
      {loadingEvents ? (
        <p className="text-center text-blue-500 flex justify-center items-center gap-2">
          <FaSpinner className="animate-spin" /> Loading events...
        </p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500 col-span-full">No events found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              id={event.id}
              key={event.id}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100"
            >
              <h2 className="text-xl font-bold text-blue-900 mb-2">{event.title}</h2>
              <p className="text-gray-700 mb-2 line-clamp-3">{event.description}</p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" /> {event.venue}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" /> {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm italic text-gray-600 mt-1">
              📌 Status: {getEventStatus(event.startDate, event.endDate).charAt(0).toUpperCase() + getEventStatus(event.startDate, event.endDate).slice(1)}

              </p>
              {event.attendees && (
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <FaUsers className="text-green-500" /> Registered: {event.attendees.length}
                </p>
              )}

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium"
                >
                  View
                </button>

                {event.attendees?.includes(session?.user?.id||"") ? (
                <button
                  disabled
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium cursor-not-allowed"
                >
                  ✅ Registered
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(event)}
                  disabled={loadingRegisterId === event.id}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 disabled:opacity-70"
                >
                  {loadingRegisterId === event.id  ? <FaSpinner className="animate-spin" /> : null}
                  Register
                </button>
              )}


                <button
                  onClick={() => handleBookmark(event.id)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {loadingBookmarkId === event.id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaBookmark size={20} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative animate-fadeIn">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{selectedEvent.title}</h2>
            <p className="text-gray-700 mb-2">{selectedEvent.description}</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li><strong>📍 Venue:</strong> {selectedEvent.venue}</li>
              <li><strong>📅 Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</li>
              <li><strong>📌 Status:</strong> 
              {getEventStatus(selectedEvent.startDate, selectedEvent.endDate)}
            </li>

              <li><strong>🧑‍💼 Organizer:</strong> {selectedEvent.createdBy.name}</li>
              {selectedEvent.attendees && (
                <li><strong>👥 Registered:</strong> {selectedEvent.attendees.length}</li>
              )}
            </ul>

            <div className="flex justify-end gap-4 mt-6">
            {selectedEvent.attendees?.includes(session?.user?.id||"") ? (
              <button
                disabled
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium cursor-not-allowed"
              >
                ✅ Registered
              </button>
            ) : (
              <button
                onClick={() => handleRegister(selectedEvent)}
                disabled={loadingRegisterId === selectedEvent.id }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 disabled:opacity-70"
              >
                {loadingRegisterId === selectedEvent.id  ? <FaSpinner className="animate-spin" /> : null}
                Register
              </button>
            )}


              <button
                onClick={() => setSelectedEvent(null)}
                className="border px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

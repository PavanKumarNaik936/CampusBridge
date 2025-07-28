"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner"; // Ensure you have `sonner` installed

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  startDate: string;
  status: "upcoming" | "completed" | "cancelled";
  createdBy: { name: string };
}

export default function RegisteredEvents() {
  const { data: session, status } = useSession();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      if (!session?.user?.id) return;

      try {
        const { data } = await axios.get(`/api/events/registered-events?userId=${session.user.id}`);
        setRegisteredEvents(data);
      } catch (error) {
        toast.error("❌ Failed to load registered events.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchRegisteredEvents();
    }
  }, [session, status]);

  if (loading) {
    return (
      <p className="text-center text-blue-500 font-medium animate-pulse">
        Loading your registered events...
      </p>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">📌 Your Registered Events</h2>
      {registeredEvents.length === 0 ? (
        <p className="text-gray-500 text-center">You have not registered for any events yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {registeredEvents.map((event) => (
            <li
              key={event.id}
              className="bg-white border p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-1">{event.title}</h3>
              <p className="text-sm text-gray-700 line-clamp-3">{event.description}</p>
              <p className="text-sm text-gray-500 mt-1">📍 {event.venue}</p>
              <p className="text-sm text-gray-500">📅 {new Date(event.startDate).toLocaleDateString()}</p>
              <p className="text-sm italic text-gray-600">Status: {event.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

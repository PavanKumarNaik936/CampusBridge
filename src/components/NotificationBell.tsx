"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";

type Notification = {
  id: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications/user");
        // console.log(res.data);
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch("/api/notifications/mark-read", {
        notificationIds: [notificationId],
      });

      // Remove notification from UI
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2">
      <FaBell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (

    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 md:right-0 md:left-auto md:top-10 md:translate-x-0 w-[90vw] md:w-80 max-h-96 overflow-auto bg-white dark:bg-neutral-900 shadow-lg rounded-lg z-50 p-3 space-y-2">
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 rounded-md border ${
              n.read
                ? "bg-gray-100 dark:bg-neutral-800"
                : "bg-blue-100 dark:bg-blue-900"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {n.message}
              </p>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-500 hover:underline ml-2"
                >
                  ✓ Read
                </button>
              )}
            </div>
  
            {n.link && (
              <a
                href={n.link}
                onClick={() => markAsRead(n.id)}
                className="text-blue-600 hover:underline text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Details
              </a>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  )}
  

    </div>
  );
}

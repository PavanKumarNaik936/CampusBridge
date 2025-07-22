"use client";

import { useState } from "react";
import { User } from "@/generated/prisma";
import { FaUser, FaEdit, FaFileAlt, FaBars, FaSignOutAlt,FaCalendarAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";


export default function Sidebar({ user }: { user: User }) {
  const [collapsed, setCollapsed] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);

//   console.log(user);
  return (
    <>
      {/* Profile Image Zoom Modal */}
      {imageZoom && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setImageZoom(false)}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={user.profileImage|| user.image || "/default-user.png"}
              alt="Zoomed Profile"
              className="h-64 w-64 rounded-full border-4 border-[#14326E] object-cover"
            />
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "min-h-screen bg-white shadow-xl border-r flex flex-col justify-between transition-all duration-300",
          collapsed ? "w-20 p-2" : "w-64 p-6"
        )}
      >
        {/* Collapse Button */}
        <div className="flex justify-end mb-4">
          <button
            className="text-[#14326E] hover:text-[#0f2652]"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-3">
          <img
            src={user.profileImage||user.image || "/default-user.jpg"}
            alt="Profile"
            onClick={() => setImageZoom(true)}
            className="h-20 w-20 rounded-full border-4 border-[#14326E] shadow-sm object-cover cursor-pointer hover:scale-105 transition duration-200"
          />
          {!collapsed && (
            <div className="text-center">
              <p className="text-lg font-bold text-[#14326E]">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={clsx("mt-8 space-y-2", collapsed && "mt-4")}>
        <SidebarButton icon={<FaUser />} label="Overview" collapsed={collapsed} path="/profile" />
        <SidebarButton icon={<FaEdit />} label="Edit Profile" collapsed={collapsed} path="/profile/edit" />
        {(user?.role === "student") && (
          <SidebarButton icon={<FaFileAlt />} label="Resume" collapsed={collapsed} path="/profile/resume" />
        )}
        <SidebarButton icon={<FaEdit />} label="My Bookmarks" collapsed={collapsed} path="/profile/bookmarks" />

        {(user?.role === "student") && (
          <SidebarButton icon={<FaFileAlt />} label="My Applications" collapsed={collapsed} path="/profile/applications" />
 
        )}
        {(user?.role === "admin") && (
          <SidebarButton icon={<FaCalendarAlt />} label="Events" collapsed={collapsed} path="/profile/events" />
 
        )}

        {(user?.role === "student") && (
          <SidebarButton icon={<FaCalendarAlt />} label="Events" collapsed={collapsed} path="/profile/events/registered" />
 
        )}

        {(user?.role === "admin" || user?.role === "recruiter") && (
          <SidebarButton icon={<FaFileAlt />} label="Jobs" collapsed={collapsed} path="/profile/jobs" />
 
        )}


        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded transition"
          >
            <FaSignOutAlt />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}


function SidebarButton({
  icon,
  label,
  collapsed,
  path,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  path: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(path)}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#f0f4ff] hover:text-[#14326E] rounded transition duration-200"
    >
      <span className="text-[#14326E]">{icon}</span>
      {!collapsed && label}
    </button>
  );
}

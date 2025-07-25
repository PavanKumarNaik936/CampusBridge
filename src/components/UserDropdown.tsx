'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { customSignOut } from "@/lib/signOutUser";

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    image?: string | null;
    profileImage?: string | null;
  };
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
// console.log(user.image);
// console.log(user.profileImage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar className="h-8 w-8 border-1 border-[#000000] bg-white text-[#14326E]">
            
            {user?.image || user?.profileImage ? (
              <AvatarImage
                src={user.image ?? user.profileImage ?? ""}
                alt="User image"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 bg-white text-gray-800 p-4 mr-4 rounded-xl shadow-lg">
        {/* Top Profile Section */}
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-8 w-8 border-2 border-[#14326E] bg-white text-[#14326E]">
            {user?.image || user?.profileImage ? (
              <AvatarImage
                src={user.image ?? user.profileImage ?? ""}
                alt="User image"
              />
            ) : (
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="text-center">
            <p className="text-lg font-semibold">{user?.name || "User Name"}</p>
            <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
            <p className="text-xs text-[#14326E] font-medium mt-1">
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "Student"}
            </p>
          </div>
        </div>

        {/* View & Edit Buttons */}
        <div className="mt-4 flex justify-between gap-2">
          <button
            onClick={() => router.push("/profile")}
            className="flex-1 text-sm px-4 py-2 rounded-lg bg-[#14326E] text-white hover:bg-[#0f2652] transition"
          >
            View
          </button>
          <button
            onClick={() => router.push("/profile/edit")}
            className="flex-1 text-sm px-4 py-2 rounded-lg border border-[#14326E] text-[#14326E] hover:bg-[#f0f4ff] transition"
          >
            Edit
          </button>
        </div>

        <DropdownMenuSeparator className="my-3" />

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={customSignOut}
            className="w-full text-sm px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

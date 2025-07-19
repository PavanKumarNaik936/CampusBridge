'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-[#14326E] px-6 py-4 shadow text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-white">
          CampusBridge
        </Link>

        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList className="gap-3">
              {["jobs", "events", "contact"].map((item) => (
                <NavigationMenuItem key={item}>
                  <Link href={`/${item}`} passHref legacyBehavior>
                    <NavigationMenuLink asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-[#14326E] hover:border-[#14326E] hover:bg-white border border-transparent font-bold"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Button>

                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Section */}
          {status === "authenticated" ? (
           <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <div className="flex items-center gap-1 cursor-pointer">
             <Avatar className="h-8 w-8 border-2 border-[#14326E] bg-white text-[#14326E]">

                 <AvatarFallback>
                   {user?.name?.charAt(0) || "U"}
                 </AvatarFallback>
               </Avatar>
               {/* <ChevronDown size={16} className="text-white" /> */}
             </div>
           </DropdownMenuTrigger>
         
           <DropdownMenuContent className="w-auto bg-white text-gray-800 p-2 mr-4">
             <div className="text-center space-y-1 py-2">
               <p className="text-sm text-gray-600">👋 Hello,</p>
               <p className="font-semibold text-base">{user?.name || "User"}</p>
               {user?.role && (
                 <p className="text-xs text-gray-500 font-medium">
                   {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                 </p>
               )}
             </div>
             <DropdownMenuSeparator />
             <DropdownMenuItem
               onClick={() => signOut()}
               className="cursor-pointer hover:bg-gray-100 justify-center font-bold"
             >
               Logout
             </DropdownMenuItem>
           </DropdownMenuContent>
          </DropdownMenu>
         
          ) : (
            <Link href="/auth/login" passHref>
              <Button
                variant="outline"
                className="text-[#14326E] hover:text-[#14326E] hover:border-[#14326E] hover:bg-white border border-transparent font-bold"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

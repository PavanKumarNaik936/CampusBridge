'use client';

// import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NotificationBell from "../NotificationBell";
import UserDropdown from "../UserDropdown";

import {
  FiHome,
  FiMenu,
  FiX,
  FiBriefcase,
  FiBookOpen,
  FiCalendar,
  FiBarChart2,
  FiPhone,
  FiUser,
  FiEdit,
  FiBookmark
} from "react-icons/fi";

const iconMap: Record<string, JSX.Element> = {
  "/": <FiHome className="mr-2" />,
  "/jobs": <FiBriefcase className="mr-2" />,
  "/resources": <FiBookOpen className="mr-2" />,
  "/events": <FiCalendar className="mr-2" />,
  "/placements-stats": <FiBarChart2 className="mr-2" />,
  "/contact": <FiPhone className="mr-2" />,
  "/profile": <FiUser className="mr-2" />,
  "/profile/edit":<FiEdit className="mr-2"/>,
  "/profile/bookmarks":<FiBookmark className="mr-2"/>


};

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  // const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Resources", path: "/resources" },
    { name: "Events", path: "/events" },
    { name: "Placements Stats", path: "/placements-stats" },
    { name: "Contact", path: "/contact" },
  ];

  const mobileNavItems = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Resources", path: "/resources" },
    { name: "Events", path: "/events" },
    { name:"Overview" ,path:"/profile"},
    { name:"Edit Profile",path:"/profile/edit"},
    { name:"My Bookmarks",path:"/profile/bookmarks"},
    { name: "Placements Stats", path: "/placements-stats" },
    { name: "Contact", path: "/contact" }    
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#14326E] backdrop-blur-md rounded-xl px-6 py-3 shadow-lg text-white w-[95%] md:w-[90%] max-w-7xl transition-all duration-300 ">

      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-white">
          CampusBridge
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-3">
              {navItems.map(({ name, path }) => (
                <NavigationMenuItem key={path}>
                  <Link href={path} passHref legacyBehavior>
                    <NavigationMenuLink asChild>
                    <Button
                      variant="ghost"
                      className={`font-bold border transition ${
                        pathname === path
                          ? "bg-white text-[#14326E] border-[#14326E]"
                          : "text-white border-transparent hover:text-[#14326E] hover:bg-white hover:border-[#14326E]"
                      }`}
                    >
                      {name}
                    </Button>

                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Section */}
          {status === "authenticated" && user ? (
            <>
              <NotificationBell />
              <UserDropdown user={user} />
            </>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="text-[#14326E] border-white hover:bg-white hover:text-[#14326E] font-bold"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Right Section (Icons + Hamburger) */}
        <div className="md:hidden flex items-center gap-3">
          {status === "authenticated" && user ? (
            <>
              <NotificationBell />
              <UserDropdown user={user} />
            </>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="text-[#14326E] border-white hover:bg-white hover:text-[#14326E] font-bold"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Hamburger Menu */}
          {/* <div className="md:hidden"> */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:bg-white hover:text-[#14326E] p-2"
              >
                {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#20409A] text-white w-64">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold tracking-wide text-white pb-2 border-b border-white/20">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-3">
                {mobileNavItems.map(({ name, path }) => (
                  <Link key={path} href={path} onClick={() => setOpen(false)}>
                    <div
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer text-base font-medium transition-colors ${
                  pathname === path ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                }`}
              >
                {iconMap[path]}
                {name}
              </div>

                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          {/* </div> */}
        </div>
      </div>
    </nav>
  );
}

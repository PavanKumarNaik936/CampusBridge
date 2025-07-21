'use client';
import { useRouter } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import UserDropdown from "../UserDropdown";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  

  const router = useRouter();

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
          {status === "authenticated" && user ? (
            <UserDropdown user={user} />
          )  : (
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

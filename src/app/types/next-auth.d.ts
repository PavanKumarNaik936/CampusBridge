// types/next-auth.d.ts or wherever you store it
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      isVerified: boolean;
      image?: string | null;
      profileImage?: string | null;
      isOnline: boolean;
      lastSeen: Date;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role;
    isVerified: boolean;
    image?: string | null;
    profileImage?: string | null;
    isOnline: boolean;
    lastSeen: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role;
    isVerified: boolean;
    image?: string | null;
    profileImage?: string | null;
    isOnline: boolean;
    lastSeen: Date;
  }
}

type Role = "student" | "admin" | "recruiter";

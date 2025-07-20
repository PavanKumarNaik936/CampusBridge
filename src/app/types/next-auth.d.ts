import NextAuth from "next-auth";
declare module 'next-auth' {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        role: Role;
        isVerified: boolean;
        image?: string | null;
        profileImage?: string | null;
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
    }
  }
  
  declare module 'next-auth/jwt' {
    interface JWT {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      isVerified: boolean;
      image?: string | null;
      profileImage?: string | null;
    }
  }
  
  type Role = 'student' | 'admin' | 'recruiter';
  
import NextAuth from "next-auth";
declare module 'next-auth' {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        role: Role;
        isVerified: boolean;
      };
    }
  
    interface User {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      isVerified: boolean;
    }
  }
  
  declare module 'next-auth/jwt' {
    interface JWT {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      isVerified: boolean;
    }
  }
  
  type Role = 'student' | 'admin' | 'recruiter';
  
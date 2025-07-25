import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma"; // your Prisma client
import { User } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // if (!user.isVerified) {
        //   throw new Error("Please verify your account before logging in");
        // }
        if (!user?.password) {
            throw new Error("User password not found.");
          }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isOnline:user.isOnline,
          lastSeen:user.lastSeen,
          image:user.image,
          profileImage:user.profileImage
        } as User;
      },
    }),
    // ✅ Google provider
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
  
      // ✅ GitHub provider
    GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isOnline: true,
            lastSeen: new Date(),
          },
        });
      } catch (err) {
        console.error("Error updating user on signIn:", err);
      }
      return true;
    },
  
   
    async jwt({ token, user,account,profile }) {
      if (user) {
        
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.isOnline=user.isOnline;
        token.lastSeen=user.lastSeen;

      }
      if (account && profile) {
        token.image = (profile as any).picture; // Google gives picture
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role as "student" | "admin" | "recruiter";
        session.user.isVerified = token.isVerified as boolean;
        session.user.image = token.image as string;
        session.user.profileImage = token.profileImage ?? null;
        session.user.isOnline=token.isOnline;
        session.user.lastSeen=token.lastSeen;
        
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

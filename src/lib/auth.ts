import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

// IMPORTANT: Do NOT use PrismaAdapter with CredentialsProvider.
// PrismaAdapter expects OAuth/email providers that create database sessions.
// CredentialsProvider + JWT strategy is self-contained — the JWT IS the session.

export const authOptions: NextAuthOptions = {
  // No adapter — JWT handles everything
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !(await verifyPassword(credentials.password, user.password))) {
          return null;
        }

        // Return the user object — this becomes the `user` param in the jwt callback
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes of inactivity before session expires
    updateAge: 5 * 60, // Extend session every 5 minutes if active
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only defined on initial sign-in
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role ?? "CUSTOMER";
        session.user.id = token.id ?? "";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
};

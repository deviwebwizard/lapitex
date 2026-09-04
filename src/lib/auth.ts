import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode as defaultEncode } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const CUSTOMER_SESSION_MAX_AGE = 60 * 60;
const ADMIN_SESSION_MAX_AGE = 12 * 60 * 60;

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

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          return null;
        }

        let passwordMatches = await verifyPassword(password, user.password);

        // Migrate old plaintext records the first time they log in.
        if (!passwordMatches && !user.password.startsWith("scrypt$") && user.password === password) {
          await prisma.user.update({
            where: { id: user.id },
            data: { password: await hashPassword(password) },
          });
          passwordMatches = true;
        }

        if (!passwordMatches) return null;

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
    // Use the longest cookie lifetime here; the JWT encoder below applies the
    // shorter customer lifetime to customer tokens.
    maxAge: ADMIN_SESSION_MAX_AGE,
    updateAge: 5 * 60, // Extend session every 5 minutes if active
  },
  jwt: {
    // NextAuth's default maxAge is global. Encode each token with the
    // role-specific lifetime so admin sessions can remain active for 12 hours
    // while customer sessions still expire after one hour of inactivity.
    encode: async (params) =>
      defaultEncode({
        ...params,
        maxAge:
          params.token?.role === "ADMIN"
            ? ADMIN_SESSION_MAX_AGE
            : CUSTOMER_SESSION_MAX_AGE,
      }),
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

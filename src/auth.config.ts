import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig, Session } from "next-auth";
import { db } from "@/db";
import { JWT } from "next-auth/jwt";
export const authConfig = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    // error: "/error",
    signIn: "/signin",
    // signOut: "/",
  },

  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: any; // Replace 'any' with a custom user type if defined
    }) {
      session.user.id = token.id as string;
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: any; // 'user' may be undefined when called internally, so it’s optional
    }) {
      if (user) {
        token.id = user.id; // Assuming 'id' is from the user data
      }
      return token;
    },
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

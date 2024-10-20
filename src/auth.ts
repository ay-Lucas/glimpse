import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/index";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { authConfig } from "./auth.config";

export function passwordToSalt(password: string) {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
}

export async function getUserFromDb(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
}

export async function addUserToDb(email: string, saltedPassword: string) {
  const user = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      email: email,
      password: saltedPassword,
    })
    .returning();
  return user.pop();
}

export async function isExistingUser(email: string) {
  return (await getUserFromDb(email)) !== undefined;
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUserFromDb(
          credentials.email as string,
          // credentials.password as string,
        );

        return user ?? null;
      },
    }),
  ],
});

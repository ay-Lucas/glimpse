import { db } from "@/db/index";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

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

export async function getUserFromDbUserId(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, userId),
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

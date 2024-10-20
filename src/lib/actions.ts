"use server";

import { AuthError } from "next-auth";
import { users } from "@/db/schema";
import {
  addUserToDb,
  getUserFromDb,
  isExistingUser,
  passwordToSalt,
  signIn,
  signOut,
} from "@/auth";
import { redirect } from "next/navigation";
import { loginSchema } from "@/types/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
const defaultValues = {
  email: "",
  password: "",
};

export async function signin(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    // await db.delete(users).where(eq(users.email, email?.toString()!));
    // console.log("User deleted!");

    const validatedFields = loginSchema.safeParse({
      email: email,
      password: password,
    });

    if (!validatedFields.success) {
      return {
        message: "validation error",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    await signIn("credentials", formData);

    return {
      message: "success",
      errors: {},
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "credentials error",
            errors: {
              ...defaultValues,
              credentials: "incorrect email or password",
            },
          };
        default:
          return {
            message: "unknown error",
            errors: {
              ...defaultValues,
              unknown: "unknown error",
            },
          };
      }
    }
    throw error;
  }
}

export async function signout() {
  await signOut();
}

export async function signup(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!email || !password) {
      console.log("email and password can't be null");
      return null;
    }
    const userExists = await isExistingUser(email);
    if (userExists) {
      redirect("/signin");
    }
    const hashedPassword = passwordToSalt(password);
    await addUserToDb(email, hashedPassword);
    await signin("credentials", formData);
  } catch (error) {
    console.log("There was an error Signing up" + error);
  }
}

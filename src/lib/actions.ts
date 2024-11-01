"use server";

import { AuthError } from "next-auth";
import {
  addUserToDb,
  isExistingUser,
  passwordToSalt,
  signIn,
  signOut,
} from "@/auth";
import { redirect } from "next/navigation";
import { loginSchema } from "@/types/schema";
import { Console } from "console";
const defaultValues = {
  email: "",
  password: "",
};

export async function signin(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

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

    if (await isExistingUser(validatedFields.data.email))
      await signIn("credentials", formData);
    else {
      console.log("User Does Not Exist");
      return;
    }

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
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validatedFields.success) {
    // console.log(validatedFields.error.message);
    return {
      message: "validation error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const userExists = await isExistingUser(validatedFields.data.email);
  if (userExists) {
    console.log("User already exists");
    redirect("/signin");
  }
  const hashedPassword = passwordToSalt(validatedFields.data.password);
  await addUserToDb(validatedFields.data.email, hashedPassword);
  console.log('New user "' + email + '" registerd');
  await signIn("credentials", formData);
  console.log("Signing in..");
}

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email required!" })
    .email({ message: "Invalid email!" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password required" })
    .min(8, { message: "Password must have at least 8 characters" }),
});

export const watchlistNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Watchlist name must not be empty" })
    .regex(/^[A-Za-z0-9].*$/, "Title must start with a letter or number")
    .max(30, { message: "Wachlist name too long" }),
});

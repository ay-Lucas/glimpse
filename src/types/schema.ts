import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email required!" })
    .email({ message: "Invalid email!" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must have at least 8 characters" }),
});

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email required!" })
    .email({ message: "Invalid email!" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must have at least 8 characters" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Name must have at least 1 character" }),
});

export const watchlistSchema = z.object({
  watchlistId: z.preprocess(
    (val) => {
      // FormData.get(...) can return string | null
      if (val == null) return undefined; // cover both null & undefined
      if (typeof val === "string" && val.trim() === "") {
        return undefined; // empty string → treat as missing
      }
      return val; // otherwise pass the string through
    },
    // now validate only if we have a string
    z.string().uuid({ message: "Invalid watchlist ID" }).optional()
  ),
  name: z
    .string()
    .trim()
    .min(1, { message: "Watchlist name must not be empty" })
    .regex(/^[A-Za-z0-9].*$/, "Title must start with a letter or number")
    .max(50, { message: "Wachlist name too long" }),
  description: z
    .string()
    .max(1000, { message: "Description too long" })
    .optional(),
  isPublic: z
    .preprocess((val) => val === "on" || val === true, z.boolean())
    .default(false),
});

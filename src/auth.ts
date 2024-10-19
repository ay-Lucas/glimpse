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
  console.log(user);
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
        const usersList = await db.select().from(users);
        console.log(usersList);

        return user ?? null;
      },
    }),
  ],
});

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   debug: true,
//   adapter: DrizzleAdapter(db),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         let user = null;
//         const username = (credentials.username as string) || null;
//         const password = (credentials.password as string) || null;
//
//         // const usersList = await db.select().from(users);
//         console.log(username);
//         console.log(password);
//         if (!username || username.length < 4)
//           console.log("Username length must at least 4 characters");
//         else if (!password || password.length < 8)
//           console.log("Password length must be at least 8 characters");
//         if (!username || !password) {
//           return null;
//         }
//
//         user = await getUserFromDb(username);
//         console.log(user);
//         if (user) {
//           if (!user.password) {
//             return null;
//           }
//
//           const isAuthenciated = await bcrypt.compare(password, user.password);
//           console.log(isAuthenciated);
//           if (isAuthenciated) {
//             return user;
//           } else {
//             return null;
//           }
//         }
//
//         if (!user) {
//           const saltedPassword = passwordToSalt(password);
//           user = await addUserToDb(username, saltedPassword);
//         }
//
//         if (!user) {
//           throw new Error("User was not found and could not be created.");
//         }
//         return user;
//       },
//     }),
//   ],
//   callbacks: {
//     // Getting the JWT token from API response
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.accessToken = (user as any).token; // cast user type to include token
//       }
//       return token;
//     },
//
//     async session({ session, token }: { session: Session; token: JWT }) {
//       session.accessToken = token.accessToken as string;
//       return session;
//     },
//     authorized({ auth }) {
//       const isAuthenticated = !!auth?.user;
//
//       return isAuthenticated;
//     },
//   },
//
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     error: "/",
//     signIn: "/",
//     signOut: "/",
//   },
// });

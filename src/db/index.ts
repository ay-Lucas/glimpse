import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/db/schema";
export const db = drizzle({ schema });

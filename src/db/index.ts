import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "./schema"

const connectionString = process.env.POSTGRES_URL!;

if (!connectionString) {
  console.warn("POSTGRES_URL is missing or undefined")
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString!, { prepare: false })
export const db = drizzle(client, { schema });

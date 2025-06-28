import "dotenv/config";
import { defineConfig } from 'drizzle-kit';

const url = process.env.POSTGRES_URL_SESSION_POOLER!;

if (!url) {
  console.warn("POSTGRES_URL_SESSION_POOLER is missing or undefined")
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: url },
  verbose: true,
  strict: true
});

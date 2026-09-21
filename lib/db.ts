import { neon } from "@neondatabase/serverless";

// Shared helper: Backend = the kitchen. This is how the kitchen reaches
// cold storage (the database). DATABASE_URL is the address + password.
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");
  return neon(url);
}

import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

// Load DATABASE_URL from .env.local without needing another library.
// (dotenv = a helper that loads secrets; we do the 5-line version by hand.)
const envPath = path.join(process.cwd(), ".env.local");
const envText = fs.readFileSync(envPath, "utf8");
for (const line of envText.split("\n")) {
  const m = line.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/);
  if (m) process.env.DATABASE_URL = m[1];
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const schemaPath = path.join(process.cwd(), "db", "schema.sql");
const schemaSql = fs.readFileSync(schemaPath, "utf8");

// Split on semicolons and run each statement in order.
const statements = schemaSql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const stmt of statements) {
  await sql.query(stmt);
}

const restaurants = await sql.query("SELECT * FROM restaurants");
const reviews = await sql.query("SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at");

console.log("restaurants:", restaurants.rows ?? restaurants);
console.log("reviews:", reviews.rows ?? reviews);
console.log("db:setup done");

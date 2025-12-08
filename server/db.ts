import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("Database connection string is required (SUPABASE_DB_URL or DATABASE_URL)");
}

const isSupabase = connectionString.includes('supabase');
const client = postgres(connectionString, { 
  prepare: false,
  ssl: isSupabase ? 'require' : false
});

export const db = drizzle(client, { schema });

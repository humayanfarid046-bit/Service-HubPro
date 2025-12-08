import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Supabase client for auth and storage
export const supabase = createClient(supabaseUrl, supabaseKey);

// PostgreSQL client for Drizzle (if database URL is provided)
let db: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  const client = postgres(databaseUrl, { prepare: false });
  db = drizzle(client, { schema });
}

export { db };

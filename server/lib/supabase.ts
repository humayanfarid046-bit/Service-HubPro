import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Supabase client for auth and storage
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database connection string from Supabase
const connectionString = `${supabaseUrl.replace('https://', 'postgres://postgres:')}@db.${supabaseUrl.split('//')[1].split('.')[0]}.supabase.co:5432/postgres`;

// PostgreSQL client for Drizzle
const client = postgres(connectionString, { prepare: false });

// Drizzle ORM instance
export const db = drizzle(client, { schema });

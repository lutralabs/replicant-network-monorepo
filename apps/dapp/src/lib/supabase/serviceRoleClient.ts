import {
  type SupabaseClient,
  createClient as createSupbaseClient,
} from '@supabase/supabase-js';
import type { Database } from './database.types';

let client: SupabaseClient<Database> | null = null;

export const supabaseServiceRoleClient = () => {
  if (!client) {
    client = createSupbaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    );
  }

  return client;
};

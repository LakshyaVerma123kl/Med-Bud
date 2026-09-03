import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client (uses Anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (uses Service Role key)
// Warning: Only use this on the server (API routes, Next.js Server Components, Node scripts)
export const getAdminSupabase = () => {
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!adminKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
  }
  return createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "$lib/supabase/types";

// Validate environment variables (only in browser)
if (typeof window !== "undefined") {
  if (
    !PUBLIC_SUPABASE_URL ||
    PUBLIC_SUPABASE_URL.trim() === "" ||
    PUBLIC_SUPABASE_URL === "your_supabase_project_url"
  ) {
    console.error(
      "Missing or invalid PUBLIC_SUPABASE_URL. Please create a .env file with a valid Supabase project URL."
    );
  }

  if (
    !PUBLIC_SUPABASE_ANON_KEY ||
    PUBLIC_SUPABASE_ANON_KEY.trim() === "" ||
    PUBLIC_SUPABASE_ANON_KEY === "your_supabase_anon_key"
  ) {
    console.error(
      "Missing or invalid PUBLIC_SUPABASE_ANON_KEY. Please create a .env file with a valid Supabase anon key."
    );
  }
}

export const supabase = createBrowserClient<Database>(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
);

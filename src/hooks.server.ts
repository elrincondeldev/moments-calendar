import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { createServerClient } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";

// Validate environment variables
if (
  !PUBLIC_SUPABASE_URL ||
  PUBLIC_SUPABASE_URL.trim() === "" ||
  PUBLIC_SUPABASE_URL === "your_supabase_project_url"
) {
  throw new Error(
    "Missing or invalid PUBLIC_SUPABASE_URL. Please create a .env file with a valid Supabase project URL.\n" +
      "Get your URL from: https://app.supabase.com/project/_/settings/api\n" +
      "Example: PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co"
  );
}

if (
  !PUBLIC_SUPABASE_ANON_KEY ||
  PUBLIC_SUPABASE_ANON_KEY.trim() === "" ||
  PUBLIC_SUPABASE_ANON_KEY === "your_supabase_anon_key"
) {
  throw new Error(
    "Missing or invalid PUBLIC_SUPABASE_ANON_KEY. Please create a .env file with a valid Supabase anon key.\n" +
      "Get your key from: https://app.supabase.com/project/_/settings/api"
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            event.cookies.set(name, value, {
              ...options,
              path: options?.path ?? "/",
            })
          );
        },
      },
    }
  );

  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};

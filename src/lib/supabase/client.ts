import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://epfrypgehehvcsualcel.supabase.co";

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZnJ5cGdlaGVodmNzdWFsY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTUzODgsImV4cCI6MjEwMzU5MTM4OH0.aGjRHBKTJRJMBdYtAe7Mvq6LS8xOss_PNEwnmUo94qA";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

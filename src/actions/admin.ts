"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminBookingsAction() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*, payments(*)")
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message, bookings: [] };
    return { success: true, bookings: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, bookings: [] };
  }
}

export async function updateBookingStatusAction(id: string, status: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updatePaymentStatusAction(id: string, status: string, bookingId?: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("payments")
      .update({
        status,
        verified_at: status === "verified" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    if (bookingId && status === "verified") {
      await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

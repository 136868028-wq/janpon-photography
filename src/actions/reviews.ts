"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SubmitReviewInput = {
  customerName: string;
  service: string;
  rating: number;
  comment: string;
};

export async function submitReviewAction(input: SubmitReviewInput) {
  try {
    const supabase = await createServerSupabaseClient();

    const today = new Date();
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const formattedDate = `${today.getDate()} ${thaiMonths[today.getMonth()]} ${today.getFullYear() + 543}`;

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        customer_name: input.customerName.trim(),
        service: input.service,
        rating: input.rating,
        comment: input.comment.trim(),
        date_formatted: formattedDate,
        is_published: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Review insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, review: data };
  } catch (err: any) {
    return { success: false, error: err?.message || "เกิดข้อผิดพลาดในการส่งรีวิว" };
  }
}

export async function getPublishedReviewsAction() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message, reviews: [] };
    return { success: true, reviews: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, reviews: [] };
  }
}

"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type CreateBookingInput = {
  serviceName: string;
  packageName?: string;
  date: string;
  slot: string;
  totalPrice: number;
  depositAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerLine?: string;
  customerNote?: string;
  photoConsent: boolean;
};

export async function createBookingAction(input: CreateBookingInput) {
  try {
    const supabase = await createServerSupabaseClient();

    // Clean phone digits (e.g. 0812345678)
    const rawPhone = input.customerPhone.trim();
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");

    // Generate Parcel-style Tracking Code (e.g. STX-26894K)
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "STX-26";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const holdExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        code,
        service_name: input.serviceName,
        package_name: input.packageName || null,
        date: input.date,
        slot: input.slot,
        total_price: input.totalPrice,
        deposit_amount: input.depositAmount,
        status: "holding",
        customer_name: input.customerName.trim(),
        customer_phone: cleanPhone || rawPhone,
        customer_email: input.customerEmail?.trim() || null,
        customer_line: input.customerLine?.trim() || null,
        customer_note: input.customerNote?.trim() || null,
        photo_consent: input.photoConsent,
        hold_expires_at: holdExpires,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking insert error:", bookingError);
      return { success: false, error: bookingError.message };
    }

    // Create payment entry
    await supabase.from("payments").insert({
      booking_id: booking.id,
      booking_code: code,
      amount: input.depositAmount,
      status: "pending",
    });

    return { success: true, code, booking };
  } catch (err: any) {
    console.error("Booking exception:", err);
    return { success: false, error: err?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูลการจอง" };
  }
}

export async function getBookingByCodeAction(code: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const cleanCode = code.trim().toUpperCase();

    const { data, error } = await supabase
      .from("bookings")
      .select("*, payments(*)")
      .ilike("code", cleanCode)
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (!data) return { success: false, error: "ไม่พบข้อมูลการจองตามรหัสที่ระบุ" };

    return { success: true, booking: data };
  } catch (err: any) {
    return { success: false, error: err?.message || "ไม่สามารถดึงข้อมูลการจองได้" };
  }
}

export async function getCustomerBookingsByPhoneAction(phone: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const cleanDigits = phone.trim().replace(/[^0-9]/g, "");

    // Fetch all bookings from Supabase
    const { data, error } = await supabase
      .from("bookings")
      .select("*, payments(*)")
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message, bookings: [] };

    const matched = (data || []).filter((b: any) => {
      const bDigits = (b.customer_phone || "").replace(/[^0-9]/g, "");
      if (!bDigits || !cleanDigits) return false;
      return (
        bDigits === cleanDigits ||
        bDigits.includes(cleanDigits) ||
        cleanDigits.includes(bDigits) ||
        (cleanDigits.length >= 6 && bDigits.endsWith(cleanDigits.slice(-6))) ||
        (bDigits.length >= 6 && cleanDigits.endsWith(bDigits.slice(-6)))
      );
    });

    return { success: true, bookings: matched };
  } catch (err: any) {
    return { success: false, error: err?.message, bookings: [] };
  }
}

export async function uploadSlipAction(code: string, slipDataUrl: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const cleanCode = code.trim().toUpperCase();

    // Update payment record
    const { error: payError } = await supabase
      .from("payments")
      .update({
        status: "slip_uploaded",
        slip_url: slipDataUrl,
        uploaded_at: new Date().toISOString(),
      })
      .eq("booking_code", cleanCode);

    if (payError) return { success: false, error: payError.message };

    // Update booking status
    const { error: bkError } = await supabase
      .from("bookings")
      .update({ status: "pending_verification", updated_at: new Date().toISOString() })
      .eq("code", cleanCode);

    if (bkError) return { success: false, error: bkError.message };

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "เกิดข้อผิดพลาดในการอัปโหลดสลิป" };
  }
}

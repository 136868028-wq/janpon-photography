"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getDashboardStatsAction() {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Fetch all bookings
    const { data: bookings, error: bkError } = await supabase
      .from("bookings")
      .select("*, payments(*)")
      .order("created_at", { ascending: false });

    // 2. Fetch all reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("*");

    if (bkError) {
      console.error("Dashboard error:", bkError);
      return { success: false, error: bkError.message };
    }

    const allBookings = bookings || [];
    const allReviews = reviews || [];

    // Calculate metrics
    const totalBookings = allBookings.length;
    const confirmedCount = allBookings.filter((b) => b.status === "confirmed" || b.status === "completed").length;
    const pendingVerificationCount = allBookings.filter((b) => b.status === "pending_verification" || b.status === "holding").length;
    const cancelledCount = allBookings.filter((b) => b.status === "cancelled").length;

    const totalDeposits = allBookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.deposit_amount || 0), 0);

    const totalRevenue = allBookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + (b.total_price || 0), 0);

    // Today's bookings
    const todayStr = new Date().toISOString().split("T")[0];
    const todayBookings = allBookings.filter((b) => b.date === todayStr && b.status !== "cancelled");

    // Pending payments (slips needing verification)
    const pendingSlips = allBookings
      .filter((b) => b.status === "pending_verification" || (b.payments && b.payments.some((p: any) => p.status === "slip_uploaded")))
      .map((b) => ({
        id: b.payments?.[0]?.id || b.id,
        bookingId: b.id,
        code: b.code,
        customerName: b.customer_name,
        phone: b.customer_phone,
        serviceName: b.service_name,
        amount: b.deposit_amount,
        status: b.payments?.[0]?.status || "slip_uploaded",
        slipUrl: b.payments?.[0]?.slip_url || null,
        uploadedAt: b.payments?.[0]?.uploaded_at || b.created_at,
      }));

    // Service distribution
    const serviceCounts: Record<string, number> = {};
    allBookings.forEach((b) => {
      const sName = b.service_name || "อื่นๆ";
      serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
    });

    const serviceDistribution = Object.entries(serviceCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      success: true,
      stats: {
        totalBookings,
        confirmedCount,
        pendingVerificationCount,
        cancelledCount,
        totalDeposits,
        totalRevenue,
        reviewCount: allReviews.length,
        averageRating: allReviews.length > 0
          ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
          : "5.0",
      },
      recentBookings: allBookings.slice(0, 6),
      todayBookings,
      pendingSlips,
      serviceDistribution,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "ไม่สามารถดึงข้อมูลแดชบอร์ดได้" };
  }
}

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

export async function createManualBookingAction(formData: {
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
  status: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "SX";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const { data: booking, error: bkError } = await supabase
      .from("bookings")
      .insert({
        code,
        service_name: formData.serviceName,
        package_name: formData.packageName || null,
        date: formData.date,
        slot: formData.slot,
        total_price: formData.totalPrice,
        deposit_amount: formData.depositAmount,
        status: formData.status || "confirmed",
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_email: formData.customerEmail || null,
        customer_line: formData.customerLine || null,
        customer_note: formData.customerNote || null,
        photo_consent: true,
      })
      .select()
      .single();

    if (bkError) return { success: false, error: bkError.message };

    // Create payment entry
    await supabase.from("payments").insert({
      booking_id: booking.id,
      booking_code: code,
      amount: formData.depositAmount,
      status: formData.status === "confirmed" ? "verified" : "pending",
      verified_at: formData.status === "confirmed" ? new Date().toISOString() : null,
    });

    return { success: true, booking };
  } catch (err: any) {
    return { success: false, error: err?.message };
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

export async function updatePaymentStatusAction(id: string, status: string, bookingId?: string, rejectionReason?: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("payments")
      .update({
        status,
        admin_note: rejectionReason || null,
        verified_at: status === "verified" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    if (bookingId) {
      const nextBookingStatus = status === "verified" ? "confirmed" : status === "rejected" ? "pending_payment" : "pending_verification";
      await supabase
        .from("bookings")
        .update({ status: nextBookingStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteBookingAction(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

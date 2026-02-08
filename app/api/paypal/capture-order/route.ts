import { NextResponse } from "next/server";
import { capturePayPalOrder, isPayPalConfiguredAsync } from "@/lib/paypal";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    if (!(await isPayPalConfiguredAsync())) {
      return NextResponse.json(
        { error: "PayPal is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { orderID, donorName, donorEmail, frequency } = body;

    if (!orderID || typeof orderID !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid order ID" },
        { status: 400 }
      );
    }

    const result = await capturePayPalOrder(orderID);

    if (result.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment was not completed" },
        { status: 400 }
      );
    }

    const name = (donorName ?? "").slice(0, 255);
    const email = (donorEmail ?? result.payerEmail ?? "").slice(0, 255);
    const freq = ["once", "monthly"].includes(frequency) ? frequency : "once";

    const supabase = createServiceRoleClient();
    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        payment_provider: "paypal",
        paypal_order_id: result.orderId,
        paypal_capture_id: result.captureId,
        donor_name: name,
        donor_email: email,
        amount: parseFloat(result.amount),
        currency: "USD",
        frequency: freq,
        status: "completed",
        metadata: { captured_via: "api" },
      })
      .select("id")
      .single();

    if (error) {
      console.error("Donation insert error:", error);
      return NextResponse.json(
        { error: "Payment received but recording failed" },
        { status: 500 }
      );
    }

    const donationId = donation?.id ?? `DON-${result.orderId}`;
    return NextResponse.json({
      success: true,
      donationId: String(donationId),
      amount: result.amount,
    });
  } catch (err) {
    console.error("PayPal capture-order error:", err);
    return NextResponse.json(
      { error: "Failed to complete payment" },
      { status: 500 }
    );
  }
}

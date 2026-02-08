import { NextResponse } from "next/server";
import { createPayPalOrder, isPayPalConfiguredAsync } from "@/lib/paypal";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 100_000;

export async function POST(request: Request) {
  try {
    if (!(await isPayPalConfiguredAsync())) {
      return NextResponse.json(
        { error: "PayPal is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { amount, frequency, donorName, donorEmail } = body;

    const numAmount = typeof amount === "string" ? parseFloat(amount) : Number(amount);
    if (isNaN(numAmount) || numAmount < MIN_AMOUNT || numAmount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: `Amount must be between $${MIN_AMOUNT} and $${MAX_AMOUNT}` },
        { status: 400 }
      );
    }

    if (!["once", "monthly"].includes(frequency)) {
      return NextResponse.json(
        { error: "Invalid frequency" },
        { status: 400 }
      );
    }

    if (!donorName || typeof donorName !== "string" || donorName.length < 2) {
      return NextResponse.json(
        { error: "Valid donor name required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!donorEmail || !emailRegex.test(donorEmail)) {
      return NextResponse.json(
        { error: "Valid donor email required" },
        { status: 400 }
      );
    }

    const { orderId } = await createPayPalOrder({
      amount: numAmount,
      frequency,
      donorName: donorName.slice(0, 255),
      donorEmail: donorEmail.slice(0, 255),
    });

    return NextResponse.json({ orderId });
  } catch (err) {
    console.error("PayPal create-order error:", err);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}

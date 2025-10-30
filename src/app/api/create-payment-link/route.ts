// src/app/api/create-payment-link/route.ts

import axios from "axios";
import { NextResponse } from "next/server";

interface CreatePaymentLinkPayload {
  amount: number; // satang: 1000 = 10 BATH
  redirectUrl: string;
  docId: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { redirectUrl, docId } = body;

    // Validate required fields
    if (!redirectUrl || !docId) {
      return NextResponse.json(
        { error: "Missing required fields: redirectUrl, or docId" },
        { status: 400 },
      );
    }

    const envAmount = process.env.DEPOSIT_AMOUNT;
    const amount = parseInt(envAmount);

    if (!amount) {
      return NextResponse.json({ error: "Deposit amount is not configured" }, { status: 500 });
    }

    const payload: CreatePaymentLinkPayload = { amount, redirectUrl, docId };

    // Call the external payment gateway API
    const { data } = await axios.post(
      "https://queue-payment.vercel.app/api/create-payment-link",
      payload,
    );

    if (!data) {
      return NextResponse.json({ error: "Error creating payment link" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating payment link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// src/app/api/disable-payment-link/[payment_link_id]/route.ts

import axios from "axios";
import { NextResponse } from "next/server";

interface DisablePaymentLinkResponse {
  code: number;
  message: string;
  error?: {
    errorCode: string;
    errorMessage: string;
  };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ payment_link_id: string }> },
) {
  try {
    const { payment_link_id } = await context.params;

    // Validate payment_link_id parameter
    if (!payment_link_id) {
      return NextResponse.json({ error: "Missing payment_link_id parameter" }, { status: 400 });
    }

    // Get the cancel payment link URL from environment variables
    const cancelPaymentLinkUrl = process.env.NEXT_PUBLIC_CANCEL_PAYMENT_LINK_URL;

    if (!cancelPaymentLinkUrl) {
      return NextResponse.json(
        { error: "Cancel payment link URL is not configured" },
        { status: 500 },
      );
    }

    const beamToken = process.env.BEAM_TOKEN;
    const merchantId = process.env.MERCHANT_ID;

    if (!beamToken || !merchantId) {
      return NextResponse.json(
        { error: "BEAM_TOKEN or MERCHANT_ID is not configured" },
        { status: 500 },
      );
    }

    const authString = `${merchantId}:${beamToken}`;
    const basicAuth = Buffer.from(authString).toString("base64");

    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${cancelPaymentLinkUrl}/api/v1/payment-links/${payment_link_id}/disable`,
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    };

    const { data } = await axios.request<DisablePaymentLinkResponse>(config);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error disabling payment link:", error);

    // Handle axios errors specifically
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return NextResponse.json(error.response.data, {
          status: error.response.status,
        });
      } else if (error.request) {
        // The request was made but no response was received
        return NextResponse.json({ error: "No response from payment gateway" }, { status: 503 });
      }
    }

    // Generic error response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

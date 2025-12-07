import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

export async function POST(req: Request) {
  try {
    // Kiểm tra authentication (optional nhưng nên có)
    // Cho phép cả guest và authenticated user

    // Parse và validate body
    const body = await req.json();
    const { items, totalAmount, address, description, userId, cancelUrl } =
      body || {};

    const session = await createCheckoutSession({
      items,
      totalAmount,
      address,
      description,
      userId: userId || null,
      cancelUrl: cancelUrl || undefined,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("PayOS create payment error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo link thanh toán.";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

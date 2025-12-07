import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { auth } from "@clerk/nextjs/server";

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
  } catch (error: any) {
    console.error("PayOS create payment error:", error);
    return NextResponse.json(
      { error: error?.message || "Không thể tạo link thanh toán." },
      { status: 400 }
    );
  }
}

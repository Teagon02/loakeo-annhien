import { NextResponse } from "next/server";
import { getPayOS } from "@/actions/createCheckoutSession";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    getPayOS().webhooks.verify(body);
    // TODO: update order status in Sanity here if needed

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invalid PayOS webhook:", error);

    // Không leak thông tin chi tiết
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}

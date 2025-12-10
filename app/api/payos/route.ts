import { NextResponse } from "next/server";
import { Address } from "@/sanity.types";
import {
  createCheckoutSession,
  GroupedCartItems,
  Metadata,
} from "@/actions/createCheckoutSession";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, address, userId, cancelUrl } = body as {
      items?: GroupedCartItems[];
      address?: Partial<Address> | null;
      userId?: string | null;
      cancelUrl?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Thiếu danh sách sản phẩm để thanh toán." },
        { status: 400 }
      );
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "addressLine",
      "ward",
      "district",
      "province",
    ] as const;

    const hasAllAddressFields = requiredAddressFields.every(
      (field) => address && address[field]
    );

    if (!hasAllAddressFields) {
      return NextResponse.json(
        { error: "Thiếu thông tin giao hàng." },
        { status: 400 }
      );
    }

    const metadata: Metadata = {
      orderNumber: crypto.randomUUID(),
      customerName: address?.fullName || "Vãng lai",
      clerkUserId: userId ?? undefined,
      address: address as Address,
    };

    const checkoutUrl = await createCheckoutSession(
      items,
      metadata,
      address as Address
    );

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("PayOS checkout error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { serverWriteClient } from "@/sanity/lib/server-client";
import { Product } from "@/sanity.types";
import { CartItem } from "@/store";

// Type for cart item with dereferenced product from query
type CartItemWithProduct = {
  product: (Product & { categories?: string[] }) | null;
  quantity: number;
};

// GET: Lấy giỏ hàng của user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Tìm giỏ hàng của user
    const query = `*[_type == "cart" && userId == $userId][0] {
      _id,
      userId,
      email,
      items[] {
        product-> {
          ...,
          "categories": categories[]->title
        },
        quantity
      },
      updatedAt
    }`;

    const cart = await serverWriteClient.fetch(query, { userId });

    if (!cart) {
      return NextResponse.json({ cart: null, items: [] });
    }

    // Lọc bỏ các items có product null (product đã bị xóa)
    const validItems = (cart.items || []).filter(
      (item: CartItemWithProduct) => item.product && item.product._id
    );

    return NextResponse.json({
      cart: cart._id,
      items: validItems,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST: Lưu/cập nhật giỏ hàng
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress ||
      "";

    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    // Tìm giỏ hàng hiện tại
    const existingCartQuery = `*[_type == "cart" && userId == $userId][0]`;
    const existingCart = await serverWriteClient.fetch(existingCartQuery, {
      userId,
    });

    // Chuẩn bị items với reference đến product (lọc bỏ items không hợp lệ)
    const cartItems = items
      .filter((item: CartItem) => item?.product?._id)
      .map((item: CartItem) => ({
        product: {
          _type: "reference" as const,
          _ref: item.product._id,
        },
        quantity: Math.max(1, item.quantity || 1),
      }));

    const cartData = {
      _type: "cart",
      userId: userId,
      email: email,
      items: cartItems,
      updatedAt: new Date().toISOString(),
    };

    if (existingCart) {
      // Cập nhật giỏ hàng hiện có
      await serverWriteClient.patch(existingCart._id).set(cartData).commit();

      return NextResponse.json({
        success: true,
        message: "Cart updated successfully",
        cartId: existingCart._id,
      });
    } else {
      // Tạo giỏ hàng mới
      const newCart = await serverWriteClient.create(cartData);

      return NextResponse.json({
        success: true,
        message: "Cart created successfully",
        cartId: newCart._id,
      });
    }
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  const allowedOrigin =
    process.env.ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_BASE_URL || "*";

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { serverWriteClient } from "@/sanity/lib/server-client";
import { Product } from "@/sanity.types";

// GET: Lấy wishlist của user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Tìm wishlist của user
    const query = `*[_type == "wishlist" && userId == $userId][0] {
      _id,
      userId,
      email,
      products[]-> {
        ...,
        "categories": categories[]->title
      },
      updatedAt
    }`;

    const wishlist = await serverWriteClient.fetch(query, { userId });

    if (!wishlist) {
      return NextResponse.json({ wishlist: null, products: [] });
    }

    // Lọc bỏ các products null (product đã bị xóa)
    const validProducts = (wishlist.products || []).filter(
      (product: Product | null) => product && product._id
    );

    return NextResponse.json({
      wishlist: wishlist._id,
      products: validProducts,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST: Lưu/cập nhật wishlist
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
    const { products } = body;

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Products must be an array" },
        { status: 400 }
      );
    }

    // Tìm wishlist hiện tại
    const existingWishlistQuery = `*[_type == "wishlist" && userId == $userId][0]`;
    const existingWishlist = await serverWriteClient.fetch(
      existingWishlistQuery,
      {
        userId,
      }
    );

    // Chuẩn bị products với reference (lọc bỏ products không hợp lệ)
    const productReferences = products
      .filter((product: Product | null) => product?._id)
      .map((product: Product) => ({
        _type: "reference",
        _ref: product._id,
      }));

    const wishlistData = {
      _type: "wishlist",
      userId: userId,
      email: email,
      products: productReferences,
      updatedAt: new Date().toISOString(),
    };

    if (existingWishlist) {
      // Cập nhật wishlist hiện có
      await serverWriteClient
        .patch(existingWishlist._id)
        .set(wishlistData)
        .commit();

      return NextResponse.json({
        success: true,
        message: "Wishlist updated successfully",
        wishlistId: existingWishlist._id,
      });
    } else {
      // Tạo wishlist mới
      const newWishlist = await serverWriteClient.create(wishlistData);

      return NextResponse.json({
        success: true,
        message: "Wishlist created successfully",
        wishlistId: newWishlist._id,
      });
    }
  } catch (error) {
    console.error("Error saving wishlist:", error);
    return NextResponse.json(
      { error: "Failed to save wishlist" },
      { status: 500 }
    );
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

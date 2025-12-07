import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { serverWriteClient } from "@/sanity/lib/server-client";

interface AddressRequestBody {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  label: "home" | "office" | "other";
  isDefault: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Xác thực người dùng
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Lấy thông tin user từ Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body: AddressRequestBody = await request.json();

    // Validate required fields
    if (
      !body.fullName ||
      !body.phone ||
      !body.province ||
      !body.district ||
      !body.ward ||
      !body.addressLine
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone number format (Vietnamese phone - 10 digits)
    // Format: 0[3-9]xxxxxxxx (10 digits) or +84[3-9]xxxxxxxx (12 characters, 10 digits)
    const phoneRegex = /^(0|\+84)[3-9]\d{8}$/;
    const cleanedPhone = body.phone.replace(/\s|\.|-/g, "");
    if (!phoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Must be 10 digits" },
        { status: 400 }
      );
    }

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress ||
      "";

    // Nếu đặt làm mặc định, cần bỏ mặc định của các địa chỉ khác
    if (body.isDefault) {
      try {
        // Tìm tất cả địa chỉ mặc định của user này
        const query = `*[_type == "address" && userId == $userId && isDefault == true]`;
        const defaultAddresses = await serverWriteClient.fetch(query, {
          userId: userId,
        });

        // Unset default cho các địa chỉ khác
        for (const addr of defaultAddresses || []) {
          await serverWriteClient
            .patch(addr._id)
            .set({ isDefault: false })
            .commit();
        }
      } catch (error) {
        console.error("Error updating default addresses:", error);
        // Continue even if this fails
      }
    }

    // Tạo địa chỉ mới
    const newAddress = {
      _type: "address",
      userId: userId,
      email: email,
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      province: body.province.trim(),
      district: body.district.trim(),
      ward: body.ward.trim(),
      addressLine: body.addressLine.trim(),
      label: body.label || "home",
      isDefault: body.isDefault || false,
    };

    const createdAddress = await serverWriteClient.create(newAddress);

    return NextResponse.json(
      {
        success: true,
        address: createdAddress,
        message: "Địa chỉ đã được thêm thành công",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating address:", error);

    // Handle specific Sanity errors
    if (error instanceof Error) {
      if (
        error.message.includes("permission") ||
        error.message.includes("unauthorized")
      ) {
        return NextResponse.json(
          { error: "Permission denied. Please check Sanity configuration." },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Failed to create address" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { changeUserPassword } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "कृपया पहिले लगइन गर्नुहोस् (Unauthorized. Please log in)" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "पुरानो र नयाँ पासवर्ड दुवै अनिवार्य छ (Both old and new password are required)" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "नयाँ पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ (New password must be at least 6 characters)" },
        { status: 400 }
      );
    }

    await changeUserPassword(user.username, oldPassword, newPassword);

    return NextResponse.json({
      success: true,
      message: "पासवर्ड सफलतापूर्वक परिवर्तन भयो (Password changed successfully)",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: error.message || "पासवर्ड परिवर्तन गर्न सकिएन (Failed to change password)" },
      { status: 400 }
    );
  }
}

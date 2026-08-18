import { NextResponse } from "next/server";
import { verifyUserPassword } from "@/lib/db";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "प्रयोगकर्ताको नाम र पासवर्ड अनिवार्य छ (Username & Password are required)" },
        { status: 400 }
      );
    }

    const user = await verifyUserPassword(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "प्रयोगकर्ताको नाम वा पासवर्ड मिलेन (Invalid username or password)" },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "लगइन गर्दा समस्या आयो (Login error)" },
      { status: 500 }
    );
  }
}

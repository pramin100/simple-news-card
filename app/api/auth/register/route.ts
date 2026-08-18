import { NextResponse } from "next/server";
import { createUser, findUserByUsername } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Only Admin can create new users
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        {
          error: "पहुँच अस्वीकृत: केवल एडमिनले मात्र नयाँ प्रयोगकर्ता थप्न सक्छन् (Access denied: Only Administrators can create new accounts)",
        },
        { status: 403 }
      );
    }

    const { username, password, fullName, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "प्रयोगकर्ताको नाम र पासवर्ड अनिवार्य छ (Username & Password are required)" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username कम्तिमा ३ अक्षरको हुनुपर्छ (Username must be at least 3 chars)" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password कम्तिमा ६ अक्षरको हुनुपर्छ (Password must be at least 6 chars)" },
        { status: 400 }
      );
    }

    const existing = await findUserByUsername(cleanUsername);
    if (existing) {
      return NextResponse.json(
        { error: "यो Username पहिले नै दर्ता भइसकेको छ (Username already taken)" },
        { status: 409 }
      );
    }

    const assignedRole = role === "admin" || role === "user" ? role : "editor";

    const newUser = await createUser({
      username: cleanUsername,
      password,
      fullName: fullName?.trim() || cleanUsername,
      role: assignedRole,
    });

    return NextResponse.json({
      success: true,
      message: "नयाँ प्रयोगकर्ता सफलतापूर्वक सिर्जना गरियो (User created successfully)",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: error.message || "दर्ता गर्दा समस्या आयो (Registration failed)" },
      { status: 500 }
    );
  }
}

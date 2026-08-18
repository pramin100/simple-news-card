import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAllUsersSafe, createUser, findUserByUsername } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "कृपया पहिले लगइन गर्नुहोस् (Unauthorized)" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "पहुँच अस्वीकृत: यो सुविधा एडमिनका लागि मात्र हो (Access denied: Admin only)" },
        { status: 403 }
      );
    }

    const users = await getAllUsersSafe();
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: error.message || "प्रयोगकर्ता सूची लोड गर्न सकिएन" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "कृपया पहिले लगइन गर्नुहोस् (Unauthorized)" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "पहुँच अस्वीकृत: नयाँ खाता एडमिनले मात्र सिर्जना गर्न सक्छ (Access denied: Only admins can create users)" },
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
    console.error("Admin create user error:", error);
    return NextResponse.json(
      { error: error.message || "प्रयोगकर्ता सिर्जना गर्न सकिएन" },
      { status: 500 }
    );
  }
}

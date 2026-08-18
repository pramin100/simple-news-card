import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteUser } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
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
        { error: "पहुँच अस्वीकृत: यो सुविधा एडमिनका लागि मात्र हो (Access denied: Admin only)" },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "प्रयोगकर्ता ID फेला परेन (User ID missing)" },
        { status: 400 }
      );
    }

    if (currentUser.id === id) {
      return NextResponse.json(
        { error: "तपाईंले आफ्नै खाता मेटाउन सक्नुहुन्न (You cannot delete your own account)" },
        { status: 400 }
      );
    }

    await deleteUser(id);

    return NextResponse.json({
      success: true,
      message: "प्रयोगकर्ता सफलतापूर्वक हटाइयो (User deleted successfully)",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: error.message || "प्रयोगकर्ता हटाउन सकिएन" },
      { status: 400 }
    );
  }
}

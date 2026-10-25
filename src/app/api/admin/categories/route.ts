import { NextResponse } from "next/server";
import { Category } from "@/database/models";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const category = await Category.create({
      name: String(body.name || "").trim(),
      slug: String(body.slug || "").trim(),
      isActive: true,
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create category" },
      { status: 400 }
    );
  }
}

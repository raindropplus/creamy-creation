import { NextResponse } from "next/server";
import { Category, Product } from "@/database/models";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(products);
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

    const product = await Product.create({
      name: String(body.name || "").trim(),
      slug: String(body.slug || "").trim(),
      sku: body.sku || null,
      description: body.description || null,
      price: Number(body.price).toFixed(2),
      comparePrice: body.comparePrice
        ? Number(body.comparePrice).toFixed(2)
        : null,
      stock: Number(body.stock || 0),
      imageUrl: body.imageUrl || null,
      categoryId: body.categoryId || null,
      isActive: body.isActive ?? true,
      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create product" },
      { status: 400 }
    );
  }
}

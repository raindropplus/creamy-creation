import { NextResponse } from "next/server";
import { Product } from "@/database/models";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const stock = Number(body.stock);
    if (!Number.isInteger(stock) || stock < 0) return NextResponse.json({ error: "Stock must be a non-negative integer." }, { status: 400 });
    const product = await Product.findByPk(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    await product.update({ stock });
    return NextResponse.json({ id: product.id, stock: product.stock });
  } catch {
    return NextResponse.json({ error: "Could not update stock" }, { status: 400 });
  }
}

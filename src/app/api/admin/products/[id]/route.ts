import { NextResponse } from "next/server";
import { OrderItem, Product } from "@/database/models";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const body = await request.json();

    const product = await Product.findByPk(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await product.update({
      ...(body.name !== undefined && {
        name: String(body.name).trim(),
      }),
      ...(body.slug !== undefined && {
        slug: String(body.slug).trim(),
      }),
      ...(body.sku !== undefined && {
        sku: body.sku || null,
      }),
      ...(body.description !== undefined && {
        description: body.description || null,
      }),
      ...(body.price !== undefined && {
        price: Number(body.price).toFixed(2),
      }),
      ...(body.comparePrice !== undefined && {
        comparePrice: body.comparePrice
          ? Number(body.comparePrice).toFixed(2)
          : null,
      }),
      ...(body.stock !== undefined && {
        stock: Number(body.stock),
      }),
      ...(body.imageUrl !== undefined && {
        imageUrl: body.imageUrl || null,
      }),
      ...(body.categoryId !== undefined && {
        categoryId: body.categoryId || null,
      }),
      ...(body.isActive !== undefined && {
        isActive: Boolean(body.isActive),
      }),
      ...(body.isFeatured !== undefined && {
        isFeatured: Boolean(body.isFeatured),
      }),
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Could not update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const product = await Product.findByPk(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const permanent = new URL(request.url).searchParams.get("permanent") === "true";
    if (!permanent) {
      await product.update({ isActive: false });
      return NextResponse.json({ ok: true, archived: true });
    }

    const orderItemCount = await OrderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      return NextResponse.json({ error: "This product has order history. Archive it instead of deleting it permanently." }, { status: 409 });
    }

    await product.destroy();
    return NextResponse.json({ ok: true, deleted: true });
  } catch {
    return NextResponse.json({ error: "Could not delete product" }, { status: 400 });
  }
}

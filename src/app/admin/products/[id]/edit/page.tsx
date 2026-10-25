import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Category, Product } from "@/database/models";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductEditForm } from "@/components/admin-product-edit-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");
  const { id } = await params;
  const [product, categories] = await Promise.all([
    Product.findByPk(id),
    Category.findAll({ where: { isActive: true }, order: [["name", "ASC"]] }),
  ]);
  if (!product) notFound();

  return (
    <main className="container-app py-10">
      <AdminNav />
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-rose-600"><ArrowLeft className="h-4 w-4" />Back to products</Link>
      <div className="mt-5 mb-7"><h1 className="text-3xl font-bold">Edit product</h1><p className="mt-1 text-zinc-500">Update product information, image, visibility, price, and stock.</p></div>
      <AdminProductEditForm product={product.toJSON() as any} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </main>
  );
}

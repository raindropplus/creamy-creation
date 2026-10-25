import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CakeSlice, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Category, Product } from "@/database/models";
import { ProductDetailClient } from "@/components/product-detail-client";
import { ProductCard } from "@/components/product-card";
import { money } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await Product.findOne({ where: { slug, isActive: true } });
  return { title: product?.name || "Product" };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await Product.findOne({
    where: { slug, isActive: true },
    include: [{ model: Category, as: "category", required: false }],
  });

  if (!product) notFound();

  const category = (product as any).category;
  const related = await Product.findAll({
    where: { isActive: true, ...(product.categoryId ? { categoryId: product.categoryId } : {}) },
    order: [["createdAt", "DESC"]],
    limit: 4,
  });

  return (
    <main className="container-app py-8 sm:py-12">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-rose-600">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <section className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-rose-50 to-amber-50 shadow-sm">
          <div className="aspect-square">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center"><CakeSlice className="h-20 w-20 text-rose-300" /></div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          {category?.name && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">{category.name}</p>}
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{product.name}</h1>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-bold text-rose-600">{money(product.price)}</span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <span className="pb-1 text-lg text-zinc-400 line-through">{money(product.comparePrice)}</span>
            )}
          </div>

          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
            {product.description || "A beautifully crafted creation from Creamy Creation By Alpona, made to make your special moments even sweeter."}
          </p>

          <div className="mt-7"><ProductDetailClient product={product.toJSON() as any} /></div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [Sparkles, "Freshly prepared", "Crafted with care"],
              [Truck, "Order ready", "Simple checkout"],
              [ShieldCheck, "Trusted quality", "Made for celebrations"],
            ].map(([Icon, title, text]: any) => (
              <div key={title} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                <Icon className="h-5 w-5 text-rose-500" />
                <p className="mt-2 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-zinc-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">You may also like</p>
            <h2 className="mt-2 text-2xl font-bold">More creations</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-rose-600 hover:underline">View all</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.filter((item) => item.id !== product.id).slice(0, 4).map((item) => (
            <ProductCard key={item.id} product={item.toJSON() as any} />
          ))}
        </div>
      </section>
    </main>
  );
}

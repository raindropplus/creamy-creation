"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addToCart } from "@/lib/cart";
import { money } from "@/lib/utils";

type ProductData = {
  id: string;
  name: string;
  price: string;
  stock: number;
  slug?: string;
  imageUrl?: string | null;
};

export function ProductCard({ product }: { product: ProductData }) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || null,
      stock: product.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Card className="group overflow-hidden rounded-2xl border border-rose-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/70">
      <Link href={product.slug ? `/products/${product.slug}` : "/products"} className="relative block aspect-square overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">No image</div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-rose-500 shadow-sm">
          {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
        </div>
      </Link>

      <CardContent className="space-y-3 p-5">
        <div>
          <Link href={product.slug ? `/products/${product.slug}` : "/products"}><h3 className="min-h-[3rem] text-base font-semibold text-zinc-900 transition hover:text-rose-600">{product.name}</h3></Link>
          <div className="mt-1 text-lg font-bold text-rose-600">{money(product.price)}</div>
        </div>

        <Button
          className={`mt-2 w-full gap-2 rounded-xl ${added ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}
          onClick={handleAddToCart}
          disabled={product.stock < 1}
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {added ? "Added to cart" : product.stock < 1 ? "Out of stock" : "Add to cart"}
        </Button>
      </CardContent>
    </Card>
  );
}

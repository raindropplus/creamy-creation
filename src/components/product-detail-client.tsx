"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { money } from "@/lib/utils";

type ProductDetail = {
  id: string;
  name: string;
  price: string;
  comparePrice?: string | null;
  stock: number;
  imageUrl?: string | null;
};

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const add = () => {
    addToCart({
      productId: product.id,
      quantity,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || null,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 p-1">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white" aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-12 text-center text-sm font-bold">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white" aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-zinc-500">{product.stock} available</span>
      </div>

      <Button onClick={add} disabled={!product.stock} className={`mt-5 h-12 w-full gap-2 rounded-xl text-base sm:w-auto sm:min-w-60 ${added ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}>
        {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
        {added ? "Added to cart" : product.stock ? "Add to cart" : "Out of stock"}
      </Button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CartItem,
  getCart,
  removeFromCart,
  subscribeToCart,
  updateCartQuantity,
} from "@/lib/cart";
import { money } from "@/lib/utils";

type DisplayCartItem = CartItem & {
  name: string;
  price: string;
  imageUrl?: string | null;
  stock?: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<DisplayCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function syncCart() {
      const storedCart = getCart();

      if (!storedCart.length) {
        if (active) {
          setCart([]);
          setLoading(false);
        }
        return;
      }

      const missingDetails = storedCart.filter((item) => !item.name || !item.price);
      let hydratedCart: DisplayCartItem[] = storedCart as DisplayCartItem[];

      if (missingDetails.length) {
        const ids = storedCart.map((item) => item.productId).join(",");
        const response = await fetch(`/api/products?ids=${encodeURIComponent(ids)}`);
        const products = await response.json();
        const productMap = new Map<string, any>(
          products.map((product: any) => [product.id, product]),
        );

        hydratedCart = storedCart.map((item) => {
          const product = productMap.get(item.productId);
          return {
            ...item,
            name: item.name || product?.name || "Product",
            price: item.price || product?.price || "0",
            imageUrl: item.imageUrl || product?.imageUrl || null,
            stock: item.stock ?? product?.stock ?? 0,
          };
        });

        localStorage.setItem("cart", JSON.stringify(hydratedCart));
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }

      if (active) {
        setCart(hydratedCart);
        setLoading(false);
      }
    }

    syncCart();
    const unsubscribe = subscribeToCart(syncCart);

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [cart]
  );

  return (
    <main className="container-app py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Shopping cart</p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-950">Your sweet picks</h1>
          <p className="mt-1 text-zinc-500">Review your selected items before checkout.</p>
        </div>
        <Link href="/products" className="text-sm font-semibold text-rose-600 hover:underline">Continue shopping</Link>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-2xl bg-zinc-100" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-zinc-100" />
        </div>
      ) : cart.length === 0 ? (
        <Card className="overflow-hidden rounded-3xl border border-rose-100 shadow-sm">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <ShoppingBag className="h-8 w-8" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-zinc-900">Your cart is empty</h2>
            <p className="mt-2 max-w-md text-zinc-500">Add delicious cakes and desserts to your cart to place your next order.</p>
            <Link href="/products" className="mt-6">
              <Button className="bg-rose-500 hover:bg-rose-600">Browse products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {cart.map((item) => {
              const lineTotal = Number(item.price || 0) * item.quantity;
              return (
                <Card key={item.productId} className="overflow-hidden rounded-2xl border border-rose-100 shadow-sm transition hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-rose-50 sm:w-24">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">No image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg font-semibold text-zinc-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-zinc-500">Unit price: {money(item.price || "0")}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 p-1">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-700 transition hover:bg-white"
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-10 text-center text-sm font-semibold text-zinc-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-700 transition hover:bg-white"
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Line total</p>
                      <p className="mt-1 text-lg font-bold text-rose-600">{money(lineTotal)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="rounded-3xl border border-rose-100 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-zinc-950">Order summary</h2>
                <div className="mt-5 space-y-3 text-sm text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                <div className="mt-5 border-t border-dashed border-zinc-200 pt-5">
                  <div className="flex items-center justify-between text-base font-semibold text-zinc-950">
                    <span>Estimated total</span>
                    <span>{money(subtotal)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="mt-6 block">
                  <Button className="w-full rounded-xl bg-rose-500 hover:bg-rose-600">Proceed to checkout</Button>
                </Link>
                <p className="mt-3 text-center text-xs leading-5 text-zinc-500">Secure checkout and order confirmation for every purchase.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}

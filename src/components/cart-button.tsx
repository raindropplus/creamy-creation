"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { getCartCount, subscribeToCart } from "@/lib/cart";

export function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getCartCount());
    sync();
    return subscribeToCart(sync);
  }, []);

  return (
    <Link
      href="/cart"
      aria-label={`Cart${count ? ` (${count})` : ""}`}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:shadow"
    >
      <ShoppingBag className="h-4 w-4 transition group-hover:scale-110" />
      <span
        className={`absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-white shadow transition ${count ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'}`}
      >
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}

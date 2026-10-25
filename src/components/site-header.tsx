import Link from "next/link";
import { CakeSlice } from "lucide-react";
import { getSession } from "@/lib/auth";
import { CartButton } from "@/components/cart-button";

export async function SiteHeader() {
  const user = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-white/95 backdrop-blur">
      <div className="container-app flex min-h-16 items-center justify-between gap-5 py-2">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 font-bold">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50">
            <CakeSlice className="h-5 w-5 text-rose-500" />
          </span>
          <span className="truncate text-sm sm:text-base">Creamy Creation By Alpona</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm sm:gap-5">
          <Link href="/products" className="hidden hover:text-rose-600 sm:inline">Products</Link>
          {user ? (
            <>
              <Link href="/account/orders" className="hidden hover:text-rose-600 md:inline">My Orders</Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="hidden hover:text-rose-600 md:inline">Admin</Link>
              )}
            </>
          ) : (
            <Link href="/login" className="hover:text-rose-600">Login</Link>
          )}
          <CartButton />
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { CakeSlice, Facebook, Heart, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-rose-100 bg-zinc-950 text-zinc-300">
      <div className="container-app grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-300">
              <CakeSlice className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">Creamy Creation By Alpona</p>
              <p className="text-xs text-zinc-500">Sweet moments, beautifully made</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            Handmade cakes and desserts created for birthdays, celebrations, gifts, and everyday sweet cravings.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Shop</p>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/products" className="block transition hover:text-rose-300">All products</Link>
            <Link href="/cart" className="block transition hover:text-rose-300">Shopping cart</Link>
            <Link href="/account/orders" className="block transition hover:text-rose-300">My orders</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-white">Connect</p>
          <div className="mt-4 space-y-3 text-sm">
            <a href="https://www.facebook.com/share/19mADXz9Yc/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-rose-300">
              <Facebook className="h-4 w-4" /> Facebook page
            </a>
            <div className="flex items-center gap-2 text-zinc-400"><Phone className="h-4 w-4" /> Order support</div>
            <div className="flex items-center gap-2 text-zinc-400"><MapPin className="h-4 w-4" /> Bangladesh</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <Heart className="h-5 w-5 text-rose-300" />
          <p className="mt-3 font-semibold text-white">Made for celebrations</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Custom orders can be discussed directly through our Facebook page.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col gap-2 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Creamy Creation By Alpona. All rights reserved.</p>
          <p>Freshly prepared with care.</p>
        </div>
      </div>
    </footer>
  );
}

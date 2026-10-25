import Link from "next/link";
import { Heart, Sparkles, Star } from "lucide-react";
import { Product } from "@/database/models";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { HomeHeroSlider } from "@/components/home-hero-slider";

export default async function Home() {
  const products = await Product.findAll({
    where: { isActive: true },
    order: [["createdAt", "DESC"]],
    limit: 4,
  });

  return (
    <main>
      <section className="overflow-hidden border-b border-rose-100 bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="container-app grid min-h-[560px] gap-12 py-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Premium home bakery collection
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-500">Creamy Creation By Alpona</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
              Beautiful cakes, creamy delights, and handcrafted sweetness.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
              From birthdays to special celebrations, discover elegant cakes and desserts made with care, creativity, and unforgettable flavor.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products"><Button className="bg-rose-500 hover:bg-rose-600">Explore our creations</Button></Link>
              <a
                href="https://www.facebook.com/share/19mADXz9Yc/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium transition hover:bg-zinc-50"
              >
                Visit Facebook page
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
                <Heart className="h-5 w-5 text-rose-500" />
                <p className="mt-2 font-semibold">Made with love</p>
                <p className="mt-1 text-sm text-zinc-500">Beautiful presentation and carefully crafted finishing.</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <p className="mt-2 font-semibold">Premium quality</p>
                <p className="mt-1 text-sm text-zinc-500">Fresh ingredients and delightful taste in every order.</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
                <Star className="h-5 w-5 text-violet-500" />
                <p className="mt-2 font-semibold">Celebration ready</p>
                <p className="mt-1 text-sm text-zinc-500">Perfect for birthdays, events, gifts, and family gatherings.</p>
              </div>
            </div>
          </div>

          <HomeHeroSlider />
        </div>
      </section>

      <section className="container-app py-14">
        <div className="mb-7 flex items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Our shop</p>
            <h2 className="mt-2 text-3xl font-bold">Featured creations</h2>
            <p className="mt-1 text-zinc-500">Fresh picks from Creamy Creation By Alpona.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-rose-600 hover:underline">View all</Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product.toJSON() as any} />
          ))}
        </div>
      </section>
    </main>
  );
}

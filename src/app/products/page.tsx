import { Product } from "@/database/models";
import { ProductCard } from "@/components/product-card";

export default async function ProductsPage() {
  const products = await Product.findAll({
    where: { isActive: true },
    order: [["name", "ASC"]],
  });

  return (
    <main className="container-app py-10">
      <h1 className="text-3xl font-bold">
        Products
      </h1>

      <p className="mt-1 text-zinc-500">
        Browse everything currently available.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product.toJSON() as any}
          />
        ))}
      </div>
    </main>
  );
}

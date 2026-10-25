import { redirect } from "next/navigation";
import { Category, Product } from "@/database/models";
import { getSession } from "@/lib/auth";
import { money } from "@/lib/utils";
import { AdminProductForm } from "@/components/admin-product-form";
import { AdminNav } from "@/components/admin-nav";
import { AdminProductActions } from "@/components/admin-product-actions";

export default async function AdminProductsPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const [products, categories] = await Promise.all([
    Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
    Category.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    }),
  ]);

  return (
    <main className="container-app py-10">
      <AdminNav />

      <h1 className="text-3xl font-bold">Products</h1>
      <p className="mt-1 text-zinc-500">Create products, upload images, and monitor stock.</p>

      <div className="mt-7">
        <AdminProductForm
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        />
      </div>

      <div className="mt-7 overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b bg-rose-50/70">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const category = (product as any).category;
              return (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="p-4">
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-rose-50">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{category?.name || "—"}</td>
                  <td className="p-4">{money(product.price)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-700'}`}>
                      {product.isActive ? "Active" : "Archived"}
                    </span>
                  </td>
                  <td className="p-4"><AdminProductActions productId={product.id} archived={!product.isActive} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

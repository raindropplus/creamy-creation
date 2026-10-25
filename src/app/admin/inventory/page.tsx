import { redirect } from "next/navigation";
import { Op } from "sequelize";
import { Package, PackageCheck, PackageX, TriangleAlert } from "lucide-react";
import { Product } from "@/database/models";
import { getSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";
import { AdminStockControl } from "@/components/admin-stock-control";

export default async function InventoryPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const products = await Product.findAll({ order: [["stock", "ASC"], ["name", "ASC"]] });
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const stats = [
    [Package, "Products", products.length, "Catalog items"],
    [PackageCheck, "Units in stock", totalUnits, "Across all products"],
    [TriangleAlert, "Low stock", lowStock, "5 or fewer units"],
    [PackageX, "Out of stock", outOfStock, "Needs restocking"],
  ] as const;

  return (
    <main className="container-app py-10">
      <AdminNav />
      <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Inventory</p><h1 className="mt-2 text-3xl font-bold">Stock management</h1><p className="mt-1 text-zinc-500">Monitor availability and update quantities quickly.</p></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([Icon, label, value, text]) => <div key={label} className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-rose-500" /><p className="mt-4 text-sm font-medium text-zinc-500">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-zinc-400">{text}</p></div>)}
      </div>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-rose-100 bg-white shadow-sm">
        <table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-rose-50/70"><tr><th className="p-4">Product</th><th className="p-4">SKU</th><th className="p-4">Status</th><th className="p-4">Current stock</th><th className="p-4">Adjust stock</th></tr></thead><tbody>
          {products.map((product) => <tr key={product.id} className="border-t"><td className="p-4"><div className="flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-xl bg-rose-50">{product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />}</div><span className="font-medium">{product.name}</span></div></td><td className="p-4 text-zinc-500">{product.sku || "—"}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock === 0 ? 'bg-red-50 text-red-700' : product.stock <= 5 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? 'Low stock' : 'In stock'}</span></td><td className="p-4 font-semibold">{product.stock}</td><td className="p-4"><AdminStockControl productId={product.id} stock={product.stock} /></td></tr>)}
        </tbody></table>
      </div>
    </main>
  );
}

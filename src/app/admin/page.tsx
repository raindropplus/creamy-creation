import { redirect } from "next/navigation";
import { Op, fn, col } from "sequelize";
import { DollarSign, Package, ShoppingBag, TriangleAlert, Users } from "lucide-react";
import { Order, Product, User } from "@/database/models";
import { getSession } from "@/lib/auth";
import { money } from "@/lib/utils";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminDashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  const [orders, products, customers, revenueResult, lowStock, recentOrders] = await Promise.all([
    Order.count(), Product.count(), User.count({ where: { role: "CUSTOMER" } }),
    Order.findOne({ attributes: [[fn("SUM", col("total")), "revenue"]], where: { status: { [Op.ne]: "CANCELLED" } }, raw: true }) as Promise<any>,
    Product.count({ where: { stock: { [Op.lte]: 5 }, isActive: true } }),
    Order.findAll({ include: [{ model: User, as: "user", attributes: ["name", "email", "phone"] }], order: [["createdAt", "DESC"]], limit: 5 }),
  ]);

  const stats = [
    [ShoppingBag, "Total orders", orders, "All customer orders"],
    [DollarSign, "Revenue", money(revenueResult?.revenue || 0), "Non-cancelled orders"],
    [Package, "Products", products, "Catalog products"],
    [Users, "Customers", customers, "Registered customers"],
  ] as const;

  return (
    <main className="container-app py-10">
      <AdminNav />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">Store overview</p><h1 className="mt-2 text-3xl font-bold">Admin dashboard</h1><p className="mt-1 text-zinc-500">Monitor sales, customers, inventory, and recent activity.</p></div><div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${lowStock ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}><TriangleAlert className="h-4 w-4" />{lowStock ? `${lowStock} low-stock product${lowStock > 1 ? 's' : ''}` : 'Stock levels healthy'}</div></div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([Icon, label, value, helper]) => <div key={label} className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><Icon className="h-5 w-5" /></div><p className="mt-5 text-sm font-medium text-zinc-500">{label}</p><p className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">{value}</p><p className="mt-1 text-xs text-zinc-400">{helper}</p></div>)}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Recent orders</h2><p className="text-sm text-zinc-500">Latest customer purchases</p></div><a href="/admin/orders" className="text-sm font-semibold text-rose-600 hover:underline">View all</a></div><div className="mt-5 divide-y divide-zinc-100">{recentOrders.map((order) => { const customer=(order as any).user; return <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{order.orderNumber}</p><p className="text-sm text-zinc-500">{customer?.name || customer?.email || customer?.phone || 'Customer'} · {order.createdAt.toLocaleDateString()}</p></div><div className="text-right"><p className="font-bold text-rose-600">{money(order.total)}</p><p className="text-xs text-zinc-500">{order.status}</p></div></div>})}</div></div>
        <div className="rounded-3xl bg-gradient-to-br from-zinc-950 to-zinc-800 p-6 text-white shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">Inventory health</p><p className="mt-4 text-4xl font-bold">{lowStock}</p><p className="mt-2 text-sm leading-6 text-zinc-300">Products currently have 5 or fewer units available.</p><a href="/admin/inventory" className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-rose-50">Manage stock</a></div>
      </div>
    </main>
  );
}

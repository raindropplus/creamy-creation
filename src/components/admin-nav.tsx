import Link from "next/link";
import { BarChart3, Boxes, LayoutDashboard, Package, ShoppingBag, Tags } from "lucide-react";

const links = [
  [LayoutDashboard, "Dashboard", "/admin"],
  [ShoppingBag, "Orders", "/admin/orders"],
  [Package, "Products", "/admin/products"],
  [Boxes, "Inventory", "/admin/inventory"],
  [Tags, "Categories", "/admin/categories"],
  [BarChart3, "Coupons", "/admin/coupons"],
] as const;

export function AdminNav() {
  return (
    <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-rose-100 bg-white p-2 shadow-sm">
      {links.map(([Icon, label, href]) => (
        <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-rose-50 hover:text-rose-600"><Icon className="h-4 w-4" />{label}</Link>
      ))}
    </div>
  );
}

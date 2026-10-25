import { redirect } from "next/navigation";
import { Order, OrderItem, Product } from "@/database/models";
import { getSession } from "@/lib/auth";
import { money } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PROCESSING: "bg-sky-50 text-sky-700 border-sky-200",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200",
  DELIVERED: "bg-zinc-100 text-zinc-700 border-zinc-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default async function CustomerOrdersPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const orders = await Order.findAll({
    where: { userId: user.id },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["imageUrl"],
            required: false,
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return (
    <main className="container-app py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">My account</p>
        <h1 className="mt-2 text-3xl font-bold">My orders</h1>
        <p className="mt-1 text-zinc-500">Track your recent orders and ordered items.</p>
      </div>

      <div className="space-y-5">
        {orders.map((order) => {
          const items = (order as any).items || [];
          return (
            <div key={order.id} className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">Order number</div>
                  <div className="mt-1 text-lg font-bold text-zinc-950">{order.orderNumber}</div>
                  <div className="mt-1 text-sm text-zinc-500">Placed on {order.createdAt.toLocaleString()}</div>
                </div>
                <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || 'bg-zinc-100 text-zinc-700 border-zinc-200'}`}>
                  {order.status}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {items.map((item: any) => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3 sm:flex-row sm:items-center">
                    <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-white sm:h-20 sm:w-20">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">No image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-zinc-900">{item.name}</p>
                      <p className="text-sm text-zinc-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right text-sm font-medium text-zinc-700">
                      <p>{money(item.price)} each</p>
                      <p className="mt-1 font-semibold text-rose-600">{money(Number(item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-dashed border-zinc-200 pt-5">
                <p className="text-sm text-zinc-500">{items.length} item(s) in this order</p>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Order total</p>
                  <p className="text-xl font-bold text-rose-600">{money(order.total)}</p>
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="rounded-3xl border border-rose-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900">No orders yet</h2>
            <p className="mt-2 text-zinc-500">Your orders will appear here once you complete a purchase.</p>
          </div>
        )}
      </div>
    </main>
  );
}

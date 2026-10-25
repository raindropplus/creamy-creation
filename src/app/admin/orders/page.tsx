import { redirect } from "next/navigation";
import {
  Address,
  NotificationLog,
  Order,
  OrderItem,
  User,
} from "@/database/models";
import { getSession } from "@/lib/auth";
import { money } from "@/lib/utils";
import { AdminOrderStatus } from "@/components/admin-order-status";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminOrdersPage() {
  const sessionUser = await getSession();

  if (!sessionUser) {
    redirect("/login");
  }

  if (sessionUser.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await Order.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name", "email", "phone"],
      },
      {
        model: OrderItem,
        as: "items",
      },
      {
        model: NotificationLog,
        as: "notifications",
      },
      {
        model: Address,
        as: "address",
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return (
    <main className="container-app py-10">
      <AdminNav />

      <div>
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="mt-1 text-zinc-500">
          Manage fulfillment and review notification delivery.
        </p>
      </div>

      <div className="mt-7 space-y-4">
        {orders.map((order) => {
          const customer = (order as any).user;
          const address = (order as any).address;
          const items = (order as any).items || [];
          const notifications =
            (order as any).notifications || [];

          return (
            <div
              key={order.id}
              className="rounded-xl border bg-white p-5"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <div className="font-semibold">
                    {order.orderNumber}
                  </div>

                  <div className="text-sm text-zinc-500">
                    {customer?.name} · {customer?.email || customer?.phone || "No login contact"} · {address?.phone}
                  </div>

                  <div className="mt-1 text-sm">
                    {items.length} item(s) · {money(order.total)} · {order.paymentMethod}
                  </div>
                </div>

                <AdminOrderStatus
                  orderId={order.id}
                  current={order.status}
                />
              </div>

              <div className="mt-4 grid gap-3 text-xs text-zinc-500 sm:grid-cols-3">
                <div>
                  Payment:{" "}
                  <span className="font-medium text-zinc-800">
                    {order.paymentStatus}
                  </span>
                </div>

                <div>
                  Alerts:{" "}
                  <span className="font-medium text-zinc-800">
                    {
                      notifications.filter(
                        (item: any) =>
                          item.status === "SENT"
                      ).length
                    }
                    /{notifications.length} sent
                  </span>
                </div>

                <div>
                  Placed:{" "}
                  <span className="font-medium text-zinc-800">
                    {order.createdAt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

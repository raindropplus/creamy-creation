import { redirect } from "next/navigation";
import { Coupon } from "@/database/models";
import { getSession } from "@/lib/auth";
import { AdminCouponForm } from "@/components/admin-coupon-form";
import { money } from "@/lib/utils";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminCouponsPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const coupons = await Coupon.findAll({
    order: [["createdAt", "DESC"]],
  });

  return (
    <main className="container-app py-10">
      <AdminNav />

      <h1 className="text-3xl font-bold">
        Coupons
      </h1>

      <div className="mt-6">
        <AdminCouponForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border bg-white">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b p-4 last:border-0"
          >
            <div>
              <div className="font-semibold">
                {coupon.code}
              </div>

              <div className="text-sm text-zinc-500">
                {coupon.percentOff
                  ? `${coupon.percentOff}% off`
                  : `${money(
                      coupon.amountOff || "0"
                    )} off`}
              </div>
            </div>

            <div className="text-sm text-zinc-500">
              Used {coupon.usedCount}
              {coupon.usageLimit
                ? ` / ${coupon.usageLimit}`
                : ""}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

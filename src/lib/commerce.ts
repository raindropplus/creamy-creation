import { Coupon } from "@/database/models";

export async function calculateCoupon(code: string | undefined, subtotal: number) {
  if (!code) return { couponId: null as string | null, discount: 0 };

  const coupon = await Coupon.findOne({
    where: { code: code.trim().toUpperCase() },
  });

  const now = new Date();

  if (
    !coupon ||
    !coupon.isActive ||
    (coupon.startsAt && coupon.startsAt > now) ||
    (coupon.endsAt && coupon.endsAt < now) ||
    (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) ||
    (coupon.minimumOrder && subtotal < Number(coupon.minimumOrder))
  ) {
    return { couponId: null, discount: 0 };
  }

  let discount = 0;

  if (coupon.percentOff) {
    discount = subtotal * (coupon.percentOff / 100);
  }

  if (coupon.amountOff) {
    discount = Number(coupon.amountOff);
  }

  return {
    couponId: coupon.id,
    discount: Math.min(subtotal, Number(discount.toFixed(2))),
  };
}

export function calculateShipping(subtotalAfterDiscount: number) {
  const freeShippingThreshold = Number(
    process.env.FREE_SHIPPING_THRESHOLD || 100
  );
  const flatShippingRate = Number(process.env.FLAT_SHIPPING_RATE || 10);

  return subtotalAfterDiscount >= freeShippingThreshold
    ? 0
    : flatShippingRate;
}

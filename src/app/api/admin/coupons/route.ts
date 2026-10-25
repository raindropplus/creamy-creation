import { NextResponse } from "next/server";
import { Coupon } from "@/database/models";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const coupons = await Coupon.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(coupons);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    if (
      !body.code ||
      (!body.percentOff && !body.amountOff)
    ) {
      return NextResponse.json(
        { error: "Code and discount are required" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.create({
      code: String(body.code).trim().toUpperCase(),
      percentOff: body.percentOff
        ? Number(body.percentOff)
        : null,
      amountOff: body.amountOff
        ? Number(body.amountOff).toFixed(2)
        : null,
      minimumOrder: body.minimumOrder
        ? Number(body.minimumOrder).toFixed(2)
        : null,
      usageLimit: body.usageLimit
        ? Number(body.usageLimit)
        : null,
      usedCount: 0,
      isActive: body.isActive ?? true,
      startsAt: null,
      endsAt: null,
    });

    return NextResponse.json(coupon, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create coupon" },
      { status: 400 }
    );
  }
}

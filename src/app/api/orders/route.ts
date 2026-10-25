import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { sequelize } from "@/database/sequelize";
import {
  Address,
  Coupon,
  Order,
  OrderItem,
  Product,
  User,
} from "@/database/models";
import { requireUser } from "@/lib/auth";
import {
  notifyAdminsForOrder,
  notifyCustomerForOrder,
} from "@/lib/notifications";
import {
  calculateCoupon,
  calculateShipping,
} from "@/lib/commerce";

type ItemInput = {
  productId: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const sessionUser = await requireUser();
    const body = await request.json();
    const items = (body.items || []) as ItemInput[];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const productIds = [
      ...new Set(items.map((item) => item.productId)),
    ];

    const products = await Product.findAll({
      where: {
        id: { [Op.in]: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 }
      );
    }

    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (
        !product ||
        item.quantity < 1 ||
        item.quantity > product.stock
      ) {
        return NextResponse.json(
          {
            error: `Invalid quantity for ${
              product?.name || "product"
            }`,
          },
          { status: 400 }
        );
      }

      subtotal += Number(product.price) * item.quantity;
    }

    const couponResult = await calculateCoupon(
      body.couponCode,
      subtotal
    );

    const shipping = calculateShipping(
      subtotal - couponResult.discount
    );

    const total =
      subtotal - couponResult.discount + shipping;

    const orderNumber = `ORD-${Date.now()
      .toString(36)
      .toUpperCase()}`;

    const paymentMethod = [
      "COD",
      "STRIPE",
      "SSLCOMMERZ",
    ].includes(body.paymentMethod)
      ? body.paymentMethod
      : "COD";

    const transaction = await sequelize.transaction();

    try {
      const address = await Address.create(
        {
          userId: sessionUser.id,
          name: String(body.shippingAddress.name || ""),
          phone: String(body.shippingAddress.phone || ""),
          line1: String(body.shippingAddress.line1 || ""),
          line2: body.shippingAddress.line2 || null,
          city: String(body.shippingAddress.city || ""),
          state: body.shippingAddress.state || null,
          postalCode:
            body.shippingAddress.postalCode || null,
          country: String(
            body.shippingAddress.country || ""
          ),
        },
        { transaction }
      );

      const order = await Order.create(
        {
          orderNumber,
          userId: sessionUser.id,
          addressId: address.id,
          couponId: couponResult.couponId,
          status:
            paymentMethod === "COD"
              ? "CONFIRMED"
              : "PENDING",
          paymentStatus: "UNPAID",
          paymentMethod,
          paymentReference: null,
          subtotal: subtotal.toFixed(2),
          discount: couponResult.discount.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2),
          customerNote: body.customerNote || null,
          adminNote: null,
        },
        { transaction }
      );

      await OrderItem.bulkCreate(
        items.map((item) => {
          const product = productMap.get(item.productId)!;

          return {
            orderId: order.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          };
        }),
        { transaction }
      );

      for (const item of items) {
        const product = productMap.get(item.productId)!;

        await Product.decrement(
          { stock: item.quantity },
          {
            where: { id: product.id },
            transaction,
          }
        );
      }

      if (couponResult.couponId) {
        await Coupon.increment(
          { usedCount: 1 },
          {
            where: { id: couponResult.couponId },
            transaction,
          }
        );
      }

      await transaction.commit();

      const user = await User.findByPk(sessionUser.id);

      if (order.status === "CONFIRMED") {
        await Promise.allSettled([
          notifyAdminsForOrder({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName:
              user?.name || sessionUser.name,
            total: order.total,
          }),
          notifyCustomerForOrder({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName:
              user?.name || sessionUser.name,
            customerPhone: address.phone,
            total: order.total,
          }),
        ]);
      }

      return NextResponse.json(
        {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentMethod: order.paymentMethod,
        },
        { status: 201 }
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { Product } from "@/database/models";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!ids.length) {
    return NextResponse.json([]);
  }

  const products = await Product.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
      isActive: true,
    },
    attributes: ["id", "name", "price", "imageUrl", "stock"],
  });

  return NextResponse.json(products.map((product) => product.toJSON()));
}

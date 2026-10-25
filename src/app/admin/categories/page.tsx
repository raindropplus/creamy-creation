import { redirect } from "next/navigation";
import { fn, col } from "sequelize";
import {
  Category,
  Product,
} from "@/database/models";
import { getSession } from "@/lib/auth";
import { AdminCategoryForm } from "@/components/admin-category-form";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminCategoriesPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const categories = await Category.findAll({
    attributes: {
      include: [
        [
          fn("COUNT", col("products.id")),
          "productCount",
        ],
      ],
    },
    include: [
      {
        model: Product,
        as: "products",
        attributes: [],
        required: false,
      },
    ],
    group: ["Category.id"],
    order: [["name", "ASC"]],
    subQuery: false,
  });

  return (
    <main className="container-app py-10">
      <AdminNav />

      <h1 className="text-3xl font-bold">
        Categories
      </h1>

      <div className="mt-6">
        <AdminCategoryForm />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border bg-white p-5"
          >
            <div className="font-semibold">
              {category.name}
            </div>

            <div className="text-sm text-zinc-500">
              {category.slug}
            </div>

            <div className="mt-2 text-xs text-zinc-500">
              {Number(
                category.getDataValue(
                  "productCount" as any
                ) || 0
              )}{" "}
              product(s)
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

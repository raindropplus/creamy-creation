import bcrypt from "bcryptjs";
import { Category, Coupon, Product, User } from "@/database/models";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  await User.findOrCreate({
    where: { email: adminEmail },
    defaults: {
      name: "Store Admin",
      email: adminEmail,
      phone: process.env.SEED_ADMIN_PHONE || "+8801700000000",
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
      isActive: true,
    },
  });

  const categoryData = [
    { name: "Fashion", slug: "fashion" },
    { name: "Accessories", slug: "accessories" },
    { name: "Lifestyle", slug: "lifestyle" },
  ];

  const categories: Record<string, string> = {};

  for (const item of categoryData) {
    const [category] = await Category.findOrCreate({
      where: { slug: item.slug },
      defaults: item,
    });
    categories[item.slug] = category.id;
  }

  const products = [
    { name: "Classic Sneakers", slug: "classic-sneakers", sku: "SNK-001", price: "79", stock: 20, categoryId: categories.fashion, isFeatured: true },
    { name: "Minimal Backpack", slug: "minimal-backpack", sku: "BAG-001", price: "59", stock: 15, categoryId: categories.accessories, isFeatured: true },
    { name: "Everyday Hoodie", slug: "everyday-hoodie", sku: "HD-001", price: "49", stock: 30, categoryId: categories.fashion, isFeatured: false },
    { name: "Travel Bottle", slug: "travel-bottle", sku: "BOT-001", price: "25", stock: 40, categoryId: categories.lifestyle, isFeatured: false },
  ];

  for (const product of products) {
    await Product.findOrCreate({
      where: { slug: product.slug },
      defaults: {
        ...product,
        comparePrice: null,
        description: null,
        imageUrl: null,
        isActive: true,
      },
    });
  }

  await Coupon.findOrCreate({
    where: { code: "WELCOME10" },
    defaults: {
      code: "WELCOME10",
      percentOff: 10,
      amountOff: null,
      minimumOrder: "30",
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
      startsAt: null,
      endsAt: null,
    },
  });

  console.log(`Seeded admin: ${adminEmail}`);
  console.log("Seeded coupon: WELCOME10");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { User } from "./User";
import { Address } from "./Address";
import { Category } from "./Category";
import { Product } from "./Product";
import { Coupon } from "./Coupon";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { NotificationLog } from "./NotificationLog";

User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

Address.hasMany(Order, { foreignKey: "addressId", as: "orders" });
Order.belongsTo(Address, { foreignKey: "addressId", as: "address" });

Coupon.hasMany(Order, { foreignKey: "couponId", as: "orders" });
Order.belongsTo(Coupon, { foreignKey: "couponId", as: "coupon" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Order.hasMany(NotificationLog, { foreignKey: "orderId", as: "notifications" });
NotificationLog.belongsTo(Order, { foreignKey: "orderId", as: "order" });

export {
  User,
  Address,
  Category,
  Product,
  Coupon,
  Order,
  OrderItem,
  NotificationLog,
};

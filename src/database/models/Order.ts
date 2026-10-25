import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "@/database/sequelize";

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<string>;
  declare orderNumber: string;
  declare userId: string;
  declare addressId: string;
  declare couponId: string | null;
  declare status: CreationOptional<"PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED">;
  declare paymentStatus: CreationOptional<"UNPAID" | "PAID" | "FAILED" | "REFUNDED">;
  declare paymentMethod: CreationOptional<"COD" | "STRIPE" | "SSLCOMMERZ">;
  declare paymentReference: string | null;
  declare subtotal: string;
  declare discount: CreationOptional<string>;
  declare shipping: CreationOptional<string>;
  declare total: string;
  declare customerNote: string | null;
  declare adminNote: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Order.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    addressId: { type: DataTypes.UUID, allowNull: false },
    couponId: { type: DataTypes.UUID, allowNull: true },
    status: {
      type: DataTypes.ENUM("PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    paymentStatus: {
      type: DataTypes.ENUM("UNPAID", "PAID", "FAILED", "REFUNDED"),
      allowNull: false,
      defaultValue: "UNPAID",
    },
    paymentMethod: {
      type: DataTypes.ENUM("COD", "STRIPE", "SSLCOMMERZ"),
      allowNull: false,
      defaultValue: "COD",
    },
    paymentReference: { type: DataTypes.STRING, allowNull: true },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    discount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    shipping: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    customerNote: { type: DataTypes.TEXT, allowNull: true },
    adminNote: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "orders",
    modelName: "Order",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["status"] },
      { fields: ["paymentStatus"] },
      { fields: ["createdAt"] },
    ],
  }
);

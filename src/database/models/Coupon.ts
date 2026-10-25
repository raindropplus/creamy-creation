import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "@/database/sequelize";

export class Coupon extends Model<InferAttributes<Coupon>, InferCreationAttributes<Coupon>> {
  declare id: CreationOptional<string>;
  declare code: string;
  declare percentOff: number | null;
  declare amountOff: string | null;
  declare minimumOrder: string | null;
  declare isActive: CreationOptional<boolean>;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare usageLimit: number | null;
  declare usedCount: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Coupon.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    percentOff: { type: DataTypes.INTEGER, allowNull: true },
    amountOff: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    minimumOrder: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    startsAt: { type: DataTypes.DATE, allowNull: true },
    endsAt: { type: DataTypes.DATE, allowNull: true },
    usageLimit: { type: DataTypes.INTEGER, allowNull: true },
    usedCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "coupons",
    modelName: "Coupon",
    timestamps: true,
  }
);

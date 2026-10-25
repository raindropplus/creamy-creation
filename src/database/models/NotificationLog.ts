import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "@/database/sequelize";

export class NotificationLog extends Model<InferAttributes<NotificationLog>, InferCreationAttributes<NotificationLog>> {
  declare id: CreationOptional<string>;
  declare orderId: string;
  declare channel: "WHATSAPP" | "SMS";
  declare status: "SENT" | "FAILED";
  declare recipient: string;
  declare providerId: string | null;
  declare error: string | null;
  declare createdAt: CreationOptional<Date>;
}

NotificationLog.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false },
    channel: { type: DataTypes.ENUM("WHATSAPP", "SMS"), allowNull: false },
    status: { type: DataTypes.ENUM("SENT", "FAILED"), allowNull: false },
    recipient: { type: DataTypes.STRING, allowNull: false },
    providerId: { type: DataTypes.STRING, allowNull: true },
    error: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "notificationLogs",
    modelName: "NotificationLog",
    timestamps: false,
    indexes: [{ fields: ["orderId"] }],
  }
);
